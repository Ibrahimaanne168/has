import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import {
  sendRegistrationAcceptedEmail,
  sendRegistrationRejectedEmail,
} from "@/lib/resend";

export async function GET(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const statusParam = request.nextUrl.searchParams.get("status") || "pending";

    // Récupérer tous les profils étudiants pour les compteurs
    const { data: allStudents, error: allErr } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "etudiant")
      .order("created_at", { ascending: false });

    if (allErr) {
      console.error("[GET-STUDENTS-ERROR]", allErr);
      return NextResponse.json({ error: allErr.message }, { status: 500 });
    }

    const studentsList = allStudents || [];
    const pendingList = studentsList.filter(
      (s) => s.is_active === false || s.statut_inscription === "en_attente" || !s.statut_inscription
    );
    const validatedList = studentsList.filter(
      (s) => s.is_active === true && s.statut_inscription === "valide"
    );
    const rejectedList = studentsList.filter(
      (s) => s.statut_inscription === "refuse"
    );

    let filtered = pendingList;
    if (statusParam === "all") filtered = studentsList;
    else if (statusParam === "valide" || statusParam === "validated") filtered = validatedList;
    else if (statusParam === "refuse" || statusParam === "rejected") filtered = rejectedList;

    return NextResponse.json({
      success: true,
      pendingStudents: pendingList,
      students: filtered,
      counts: {
        pending: pendingList.length,
        validated: validatedList.length,
        rejected: rejectedList.length,
        total: studentsList.length,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { studentId, action } = body;

    if (!studentId || (action !== "accept" && action !== "reject")) {
      return NextResponse.json(
        { error: "Paramètres invalides (studentId et action 'accept' | 'reject' requis)." },
        { status: 400 }
      );
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const origin = host ? `${proto}://${host}` : (request.nextUrl.origin || "https://has-academie.online");
    const loginUrl = `${origin}/connexion`;
    const siteUrl = origin;

    const supabaseAdmin = createAdminClient();

    if (action === "accept") {
      // Activer l'étudiant
      const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({
          is_active: true,
          statut_inscription: "valide",
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[ACCEPT-STUDENT-ERROR]", error);
        return NextResponse.json({ error: "Impossible de valider l'étudiant" }, { status: 500 });
      }

      // Log d'audit
      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "VALIDATION_INSCRIPTION_ACCEPTEE",
          details: { student_id: studentId, email: updated?.email, matricule: updated?.matricule },
          ip_address: request.headers.get("x-forwarded-for") || "admin",
        });
      } catch {}

      // Envoi de l'email de confirmation via Resend avec lien direct de retour au site
      if (updated?.email) {
        try {
          await sendRegistrationAcceptedEmail({
            email: updated.email,
            fullName: updated.full_name || "Étudiant",
            matricule: updated.matricule,
            loginUrl,
          });
        } catch (emailErr) {
          console.warn("[RESEND-ACCEPT-EMAIL-ERROR]", emailErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: "accepted",
        message: `L'inscription de ${updated?.full_name || "l'étudiant"} a été validée avec succès. Un email de confirmation avec lien direct lui a été envoyé.`,
        student: updated,
      });
    } else {
      // Refuser l'inscription
      const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({
          is_active: false,
          statut_inscription: "refuse",
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .select()
        .maybeSingle();

      if (error) {
        console.error("[REJECT-STUDENT-ERROR]", error);
        return NextResponse.json({ error: "Impossible de refuser l'étudiant" }, { status: 500 });
      }

      // Log d'audit
      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "VALIDATION_INSCRIPTION_REFUSEE",
          details: { student_id: studentId, email: updated?.email, matricule: updated?.matricule },
          ip_address: request.headers.get("x-forwarded-for") || "admin",
        });
      } catch {}

      // Envoi de l'email de non-confirmation via Resend avec lien direct de retour au site
      if (updated?.email) {
        try {
          await sendRegistrationRejectedEmail({
            email: updated.email,
            fullName: updated.full_name || "Candidat",
            siteUrl,
          });
        } catch (emailErr) {
          console.warn("[RESEND-REJECT-EMAIL-ERROR]", emailErr);
        }
      }

      return NextResponse.json({
        success: true,
        action: "rejected",
        message: `L'inscription de ${updated?.full_name || "l'étudiant"} a été refusée. Un email d'information avec lien direct lui a été envoyé.`,
        student: updated,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
