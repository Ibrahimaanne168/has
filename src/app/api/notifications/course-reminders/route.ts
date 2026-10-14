import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { sendCourseReminderEmail, sendProfesseurMeetReminderEmail } from "@/lib/resend";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { MOCK_PROFESSEURS } from "@/lib/data/mock-data";
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
  const mode = (searchParams.get("mode") as "auto_all" | "auto_40min" | "prof_1h" | "manual") || undefined;

  return await handleReminderNotification({ seanceId, jour, niveau, mode });
}

export async function handleReminderNotification(params: {
  seanceId?: string;
  jour?: string;
  niveau?: string;
  mode?: "auto_all" | "auto_40min" | "prof_1h" | "manual";
  seances?: SeanceEDT[];
}) {
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  // Heure locale au Sénégal / Dakar : UTC+0 (GMT) toute l'année
  const dakarDayFr = JOURS_FR[now.getUTCDay()];
  const currentMinutesUTC = now.getUTCHours() * 60 + now.getUTCMinutes();
  const currentClock = `${String(now.getUTCHours()).padStart(2, "0")}:${String(now.getUTCMinutes()).padStart(2, "0")}`;

  const supabaseAdmin = createAdminClient();

  // Répertoire des séances (priorité aux séances passées en payload ou aux séances enregistrées dans Supabase)
  let allSeances: SeanceEDT[] =
    params.seances && params.seances.length > 0
      ? params.seances
      : [];

  if (allSeances.length === 0) {
    try {
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

  // Charger les correspondances des vrais emails professeurs vérifiés depuis Supabase
  const verifiedProfEmails = new Map<string, string>(); // profKey (id, nom ou username) -> vrai email certifié
  try {
    const { data: profLogs } = await supabaseAdmin
      .from("logs")
      .select("action, description")
      .like("action", "PROF_EMAIL_VERIFIED:%");

    if (profLogs && Array.isArray(profLogs)) {
      profLogs.forEach((l) => {
        try {
          const parsed = JSON.parse(l.description);
          if (parsed && parsed.email) {
            const clean = parsed.email.toLowerCase().trim();
            if (parsed.profId) verifiedProfEmails.set(parsed.profId.toLowerCase(), clean);
            const key = l.action.replace("PROF_EMAIL_VERIFIED:", "").toLowerCase();
            verifiedProfEmails.set(key, clean);
          }
        } catch {}
      });
    }

    const { data: profProfiles } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name, username")
      .eq("role", "professeur");

    if (profProfiles && Array.isArray(profProfiles)) {
      profProfiles.forEach((p) => {
        if (p.email && !p.email.includes("@halil-academie.com") && !p.email.includes("@has.sn")) {
          if (p.id) verifiedProfEmails.set(p.id.toLowerCase(), p.email.toLowerCase());
          if (p.full_name) verifiedProfEmails.set(p.full_name.toLowerCase(), p.email.toLowerCase());
          if (p.username) verifiedProfEmails.set(p.username.toLowerCase(), p.email.toLowerCase());
        }
      });
    }
  } catch {}

  const findProfEmail = (seance: SeanceEDT): { email: string | null; isVerified: boolean; profName: string } => {
    const profName = seance.professeur_nom || "Enseignant";
    const profNameLower = profName.toLowerCase();
    const profIdLower = (seance.professeur_id || "").toLowerCase();

    // 1. Chercher dans les emails certifiés
    let certified = verifiedProfEmails.get(profIdLower) || verifiedProfEmails.get(profNameLower);
    if (!certified) {
      for (const [k, v] of verifiedProfEmails.entries()) {
        if (profNameLower.includes(k) || k.includes(profNameLower)) {
          certified = v;
          break;
        }
      }
    }

    if (certified) {
      return { email: certified, isVerified: true, profName };
    }

    // 2. Chercher dans MOCK_PROFESSEURS
    const mock = MOCK_PROFESSEURS.find(
      (p) =>
        (p.id && p.id.toLowerCase() === profIdLower) ||
        (p.full_name && p.full_name.toLowerCase().includes(profNameLower)) ||
        (profNameLower.includes(p.nom?.toLowerCase() || "___"))
    );

    if (mock && mock.email) {
      const isFake =
        mock.email.includes("@halil-academie.com") ||
        mock.email.includes("@has.sn") ||
        mock.is_email_verified === false;
      return {
        email: mock.email,
        isVerified: !isFake,
        profName: mock.full_name || profName,
      };
    }

    return { email: null, isVerified: false, profName };
  };

  const todayCourses = allSeances.filter((s) => s.jour === dakarDayFr);

  // =========================================================================
  // 1. VOLET ENSEIGNANTS : RAPPEL 1 HEURE AVANT LE COURS POUR LE LIEN MEET
  // =========================================================================
  const shouldProcessProfs = params.mode === "prof_1h" || params.mode === "auto_all" || !params.mode || params.mode === "manual";
  const profResults: Array<{ course: string; prof: string; email: string; status: string }> = [];

  if (shouldProcessProfs) {
    const profTargetCourses = todayCourses.filter((s) => {
      if (params.seanceId && s.id !== params.seanceId) return false;
      if (params.jour && s.jour !== params.jour) return false;
      if (params.niveau && s.niveau !== params.niveau) return false;

      // En mode automatique 1h : fenêtre de 45 à 75 minutes avant le début du cours
      if (!params.seanceId && params.mode !== "manual") {
        const parts = s.heure_debut.split(":");
        const courseH = parseInt(parts[0], 10);
        const courseM = parseInt(parts[1] || "0", 10);
        if (isNaN(courseH)) return false;
        const delta = (courseH * 60 + courseM) - currentMinutesUTC;
        return delta >= 45 && delta <= 75;
      }
      return true;
    });

    for (const seance of profTargetCourses) {
      const { email: profEmail, isVerified, profName } = findProfEmail(seance);
      const dedupKey = `prof_1h_${todayStr}_${seance.id}_${profEmail || "unknown"}`;

      if (inMemorySentToday.has(dedupKey) && params.mode !== "manual") {
        continue;
      }

      if (!profEmail) {
        profResults.push({
          course: seance.matiere_nom,
          prof: profName,
          email: "non_renseigne",
          status: "aucun_email",
        });
        continue;
      }

      // Si l'enseignant n'a pas encore validé son vrai email
      if (!isVerified) {
        profResults.push({
          course: seance.matiere_nom,
          prof: profName,
          email: profEmail,
          status: "email_temporaire_en_attente_de_verification",
        });
        continue;
      }

      try {
        await sendProfesseurMeetReminderEmail({
          email: profEmail,
          profName,
          matiereNom: seance.matiere_nom,
          jour: seance.jour,
          horaireDebut: seance.heure_debut,
          horaireFin: seance.heure_fin,
          niveau: seance.niveau,
          filieres: seance.filieres,
          meetUrl: seance.meet_url,
        });

        inMemorySentToday.add(dedupKey);

        try {
          await supabaseAdmin.from("audit_logs").insert({
            action: "RAPPEL_PROF_MEET_1H",
            user_email: profEmail,
            details: {
              seance_id: seance.id,
              matiere: seance.matiere_nom,
              jour: seance.jour,
              horaire: `${seance.heure_debut} - ${seance.heure_fin}`,
              date: todayStr,
              has_meet: Boolean(seance.meet_url),
            },
          });
        } catch {}

        profResults.push({
          course: seance.matiere_nom,
          prof: profName,
          email: profEmail,
          status: "envoye_1h",
        });
      } catch {
        profResults.push({
          course: seance.matiere_nom,
          prof: profName,
          email: profEmail,
          status: "erreur_envoi",
        });
      }
    }
  }

  // =========================================================================
  // 2. VOLET ÉTUDIANTS : RAPPEL 40 MINUTES AVANT LE COURS
  // =========================================================================
  const shouldProcessStudents = params.mode === "auto_40min" || params.mode === "auto_all" || !params.mode || params.mode === "manual";
  const studentResults: Array<{ course: string; student: string; email: string; status: string }> = [];

  let studentTargetCourses: SeanceEDT[] = [];
  if (shouldProcessStudents) {
    if (params.seanceId) {
      studentTargetCourses = allSeances.filter((s) => s.id === params.seanceId);
    } else if (params.jour && params.mode === "manual") {
      studentTargetCourses = allSeances.filter((s) => s.jour === params.jour);
      if (params.niveau) {
        studentTargetCourses = studentTargetCourses.filter((s) => s.niveau === params.niveau);
      }
    } else {
      // Automatique : 30 à 50 minutes avant
      studentTargetCourses = todayCourses.filter((s) => {
        const parts = s.heure_debut.split(":");
        const courseH = parseInt(parts[0], 10);
        const courseM = parseInt(parts[1] || "0", 10);
        if (isNaN(courseH)) return false;
        const delta = (courseH * 60 + courseM) - currentMinutesUTC;
        return delta >= 30 && delta <= 50;
      });
      if (params.niveau) {
        studentTargetCourses = studentTargetCourses.filter((s) => s.niveau === params.niveau);
      }
    }
  }

  if (studentTargetCourses.length > 0) {
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 }).catch(() => ({ data: { users: [] } }));
    const students = (usersData?.users || []).filter((u) => {
      const meta = u.user_metadata || {};
      const role = meta.role || (u.email?.includes("admin") ? "admin" : "etudiant");
      if (role !== "etudiant") return false;
      const isValide = meta.is_active === true || meta.statut_inscription === "valide";
      return isValide && u.email;
    });

    for (const seance of studentTargetCourses) {
      const dedupKey = `student_40m_${todayStr}_${seance.id}`;
      if (inMemorySentToday.has(dedupKey) && params.mode !== "manual") {
        continue;
      }

      const seanceNiveau = seance.niveau || (seance.classe_nom?.includes("Licence 2") ? "L2" : "L1");
      const seanceFilieres = seance.filieres || [];

      const targetedStudents = students.filter((stu) => {
        const meta = stu.user_metadata || {};
        const stuNiveau = meta.niveau || (meta.classe?.includes("L2") ? "L2" : "L1");
        const stuFiliere = (meta.filiere || meta.classe || "").toUpperCase();
        if (stuNiveau !== seanceNiveau) return false;
        if (seanceFilieres.length === 0 || seanceFilieres.length >= 3) return true;
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

          studentResults.push({
            course: seance.matiere_nom,
            student: studentName,
            email: studentEmail,
            status: "envoye_40min",
          });
        } catch {
          studentResults.push({
            course: seance.matiere_nom,
            student: studentName,
            email: studentEmail,
            status: "erreur",
          });
        }
      }

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
          },
        });
      } catch {}
    }
  }

  return NextResponse.json({
    success: true,
    message: `Traitement terminé. ${profResults.filter((r) => r.status === "envoye_1h").length} rappel(s) enseignant (1h) et ${studentResults.filter((r) => r.status === "envoye_40min").length} rappel(s) étudiants envoyés.`,
    dakarTime: `${currentClock} GMT`,
    day: dakarDayFr,
    profResults,
    studentResults,
  });
}
