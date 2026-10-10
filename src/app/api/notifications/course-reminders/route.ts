import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { sendCourseReminderEmail } from "@/lib/resend";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { SeanceEDT } from "@/lib/types";

const JOURS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

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

  return await handleReminderNotification({ seanceId, jour, niveau });
}

async function handleReminderNotification(params: {
  seanceId?: string;
  jour?: string;
  niveau?: string;
  seances?: SeanceEDT[];
}) {
  const todayFr = JOURS_FR[new Date().getDay()];
  const targetJour = params.jour || todayFr;

  // Trouver les séances ciblées (priorité aux séances transmises depuis le stockage actuel)
  let targetSeances: SeanceEDT[] =
    params.seances && params.seances.length > 0
      ? params.seances
      : DEFAULT_SEANCES_EDT;

  if (params.seanceId) {
    targetSeances = targetSeances.filter((s) => s.id === params.seanceId);
  } else {
    targetSeances = targetSeances.filter((s) => s.jour === targetJour);
    if (params.niveau) {
      targetSeances = targetSeances.filter((s) => s.niveau === params.niveau);
    }
  }

  if (targetSeances.length === 0) {
    return NextResponse.json({
      success: true,
      message: `Aucun cours programmé pour ${targetJour}${params.niveau ? ` en ${params.niveau}` : ""}.`,
      sentCount: 0,
    });
  }

  // Récupérer les étudiants réels inscrits depuis Supabase
  const supabaseAdmin = createAdminClient();
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
    // Compte actif et validé
    const isValide = meta.is_active === true || meta.statut_inscription === "valide";
    return isValide && u.email;
  });

  const sendResults: Array<{
    course: string;
    student: string;
    email: string;
    status: string;
  }> = [];

  for (const seance of targetSeances) {
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
  }

  return NextResponse.json({
    success: true,
    message: `Rappels de cours envoyés pour ${targetSeances.length} séance(s) (${sendResults.length} notification(s) envoyée(s)).`,
    coursesProcessed: targetSeances.map((s) => ({
      matiere: s.matiere_nom,
      jour: s.jour,
      horaires: `${s.heure_debut} - ${s.heure_fin}`,
      filieres: s.filieres,
    })),
    sentCount: sendResults.length,
    results: sendResults,
  });
}
