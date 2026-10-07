import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    // Récupérer les étudiants en attente de validation ou inactifs
    const { data: pendingStudents, error } = await supabaseAdmin
      .from("profiles")
      .select("*")
      .eq("role", "etudiant")
      .eq("is_active", false)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[GET-PENDING-STUDENTS-ERROR]", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      pendingStudents: pendingStudents || [],
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

      return NextResponse.json({
        success: true,
        action: "accepted",
        message: `L'inscription de ${updated?.full_name || "l'étudiant"} a été validée avec succès. L'étudiant peut désormais se connecter.`,
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

      return NextResponse.json({
        success: true,
        action: "rejected",
        message: `L'inscription de ${updated?.full_name || "l'étudiant"} a été refusée.`,
        student: updated,
      });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
