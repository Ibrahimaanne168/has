import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { sendCourseReminderEmail } from "@/lib/resend";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { SeanceEDT } from "@/lib/types";

const JOURS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

// Cache en mémoire pour éviter tout doublon dans le même processus
const inMemorySentToday = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    return await handleReminderNotification(body);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const seanceId = searchParams.get("seanceId") || undefined;
  const jour = searchParams.get("jour") || undefined;
  const niveau = searchParams.get("niveau") || undefined;
  const mode = (searchParams.get("mode") as "auto_40min" | "manual") || undefined;

  return await handleReminderNotification({ seanceId, jour, niveau, mode });
}

export async function handleReminderNotification(params: {
  seanceId?: string;
  jour?: string;
  niveau?: string;
  mode?: "auto_40min" | "manual";
  seances?: SeanceEDT[];
}) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  // Heure locale au Sénégal / Dakar : UTC+0 (GMT) toute l'année
  const dakarDayFr = JOURS_FR[now.getUTCDay()];
  const currentMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
  const currentClock = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

  // Répertoire des séances (priorité aux séances passées en payload ou aux séances enregistrées dans Supabase)
  let allSeances: SeanceEDT[] =
    params.seances && params.seances.length > 0
      ? params.seances
      : [];

  if (allSeances.length === 0) {
    try {
      const supabaseAdmin = createAdminClient();
      const { data: syncData } = await supabaseAdmin
        .from("audit_logs")
        .select("details")
        .eq("action", "EDT_SEANCES_SYNC")
        .order("created_at", { ascending: false })
        .limit(1);
      if (syncData && syncData.length > 0 && Array.isArray(syncData[0].details?.seances) && syncData[0].details.seances.length > 0) {
        allSeances = syncData[0].details.seances;
      }
    } catch {}
    if (allSeances.length === 0) {
      allSeances = DEFAULT_SEANCES_EDT;
    }
  }

  let targetSeances: SeanceEDT[] = [];
  const isAuto40Min = params.mode === "auto_40min" || (!params.seanceId && !params.jour);

  if (params.seanceId) {
    // Mode unitaire manuel : ciblage d'un cours précis
    targetSeances = allSeances.filter((s) => s.id === params.seanceId);
  } else if (!isAuto40Min && params.jour) {
    // Mode manuel journée : tous les cours du jour choisi
    targetSeances = allSeances.filter((s) => s.jour === params.jour);
    if (params.niveau) {
      targetSeances = targetSeances.filter((s) => s.niveau === params.niveau);
    }
  } else {
    // Mode AUTOMATIQUE 40 MINUTES AVANT LE COURS :
    // Filtre les cours du jour actuel dont le début se situe dans une fenêtre de ~40 minutes (30 à 50 minutes)
    const todayCourses = allSeances.filter((s) => s.jour === dakarDayFr);

    targetSeances = todayCourses.filter((s) => {
      const parts = s.heure_debut.split(":");
      const courseH = parseInt(parts[0], 10);
      const courseM = parseInt(parts[1] || "0", 10);
      if (isNaN(courseH)) return false;
      const courseMinutes = courseH * 60 + courseM;
      const delta = courseMinutes - currentMinutesUTC;
      // Fenêtre cible de 30 à 50 minutes avant le début (couvre parfaitement le passage cron toutes les 10 min)
      return delta >= 30 && delta <= 50;
    });

    if (params.niveau) {
      targetSeances = targetSeances.filter((s) => s.niveau === params.niveau);
    }
  }

  if (targetSeances.length === 0) {
    return NextResponse.json({
      success: true,
      message: isAuto40Min
        ? `Aucun cours ne débute dans ~40 minutes aujourd'hui (${dakarDayFr} à ${currentClock} GMT).`
        : `Aucun cours programmé pour les filtres sélectionnés.`,
      dakarTime: `${currentClock} GMT`,
      day: dakarDayFr,
      sentCount: 0,
    });
  }

  // Connexion Supabase pour récupérer les étudiants inscrits & l'historique d'envoi
  const supabaseAdmin = createAdminClient();

  // Filtrer les séances qui ont déjà reçu leur rappel aujourd'hui (déduplication stricte)
  const dedupedSeances: SeanceEDT[] = [];

  for (const seance of targetSeances) {
    const dedupKey = `${todayStr}_${seance.id}`;
    if (inMemorySentToday.has(dedupKey) && isAuto40Min) {
      continue;
    }

    if (isAuto40Min) {
      try {
        const { data: existingAudit } = await supabaseAdmin
          .from("audit_logs")
          .select("id")
          .eq("action", "RAPPEL_COURS_40MIN")
          .filter("details->>seance_id", "eq", seance.id)
          .filter("details->>date", "eq", todayStr)
          .limit(1);

        if (existingAudit && existingAudit.length > 0) {
          inMemorySentToday.add(dedupKey);
          continue;
        }
      } catch {
        // En cas d'indisponibilité temporaire de la table audit_logs, on continue
      }
    }

    dedupedSeances.push(seance);
  }

  if (dedupedSeances.length === 0) {
    return NextResponse.json({
      success: true,
      message: `Tous les rappels de 40 minutes pour les cours actuels ont déjà été envoyés aujourd'hui (${dakarDayFr}).`,
      dakarTime: `${currentClock} GMT`,
      day: dakarDayFr,
      sentCount: 0,
    });
  }

  // Récupérer les étudiants réels inscrits depuis Supabase
  const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
    perPage: 1000,
  });

  if (usersError) {
    return NextResponse.json({ error: usersError.message }, { status: 500 });
  }

  // Filtrer les étudiants actifs et validés
  const students = (usersData?.users || []).filter((u) => {
    const meta = u.user_metadata || {};
    const role = meta.role || (u.email?.includes("admin") ? "admin" : "etudiant");
    if (role !== "etudiant") return false;
    const isValide = meta.is_active === true || meta.statut_inscription === "valide";
    return isValide && u.email;
  });

  const sendResults: Array<{
    course: string;
    student: string;
    email: string;
    status: string;
  }> = [];

  for (const seance of dedupedSeances) {
    const seanceNiveau = seance.niveau || (seance.classe_nom?.includes("Licence 2") ? "L2" : "L1");
    const seanceFilieres = seance.filieres || [];

    // Sélectionner les étudiants concernés par la promotion et la filière du cours
    const targetedStudents = students.filter((stu) => {
      const meta = stu.user_metadata || {};
      const stuNiveau = meta.niveau || (meta.classe?.includes("L2") ? "L2" : "L1");
      const stuFiliere = (meta.filiere || meta.classe || "").toUpperCase();

      if (stuNiveau !== seanceNiveau) return false;

      // Si cours en tronc commun (aucune filière restreinte ou >= 3)
      if (seanceFilieres.length === 0 || seanceFilieres.length >= 3) {
        return true;
      }

      // Si filière spécifique (MPI, SML, MIASS)
      return seanceFilieres.some((f) => stuFiliere.includes(f));
    });

    for (const student of targetedStudents) {
      const studentEmail = student.email!;
      const studentName = student.user_metadata?.full_name || student.email?.split("@")[0] || "Étudiant";
      const studentFiliere = student.user_metadata?.filiere || "";

      try {
        await sendCourseReminderEmail({
          email: studentEmail,
          fullName: studentName,
          matiereNom: seance.matiere_nom,
          jour: seance.jour,
          horaireDebut: seance.heure_debut,
          horaireFin: seance.heure_fin,
          enseignantNom: seance.professeur_nom,
          meetUrl: seance.meet_url,
          filiere: studentFiliere || seanceFilieres.join(" / "),
          niveau: seanceNiveau,
          delai: "40 minutes",
        });

        sendResults.push({
          course: seance.matiere_nom,
          student: studentName,
          email: studentEmail,
          status: "envoye",
        });
      } catch (err: unknown) {
        sendResults.push({
          course: seance.matiere_nom,
          student: studentName,
          email: studentEmail,
          status: "erreur",
        });
      }
    }

    // Enregistrer l'envoi dans la déduplication en mémoire et Supabase audit_logs
    const dedupKey = `${todayStr}_${seance.id}`;
    inMemorySentToday.add(dedupKey);

    try {
      await supabaseAdmin.from("audit_logs").insert({
        action: "RAPPEL_COURS_40MIN",
        user_email: "system@halil-academie.com",
        details: {
          seance_id: seance.id,
          matiere: seance.matiere_nom,
          jour: seance.jour,
          horaire: `${seance.heure_debut} - ${seance.heure_fin}`,
          date: todayStr,
          destinataires_count: targetedStudents.length,
          niveau: seanceNiveau,
        },
      });
    } catch {
      // Ignorer l'erreur d'audit log si table inexistante
    }
  }

  return NextResponse.json({
    success: true,
    message: `Rappels 40min envoyés pour ${dedupedSeances.length} séance(s) (${sendResults.length} notification(s) envoyée(s)).`,
    dakarTime: `${currentClock} GMT`,
    day: dakarDayFr,
    coursesProcessed: dedupedSeances.map((s) => ({
      matiere: s.matiere_nom,
      jour: s.jour,
      horaires: `${s.heure_debut} - ${s.heure_fin}`,
      filieres: s.filieres,
    })),
    sentCount: sendResults.length,
    results: sendResults,
  });
}
