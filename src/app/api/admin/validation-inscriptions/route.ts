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

    const studentsMap = new Map<string, any>();

    // 1. Récupération directe depuis Supabase Auth (source de vérité fiable)
    try {
      const { data: authList, error: authErr } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      if (!authErr && authList?.users) {
        for (const u of authList.users) {
          const meta = u.user_metadata || {};
          if (meta.role === "etudiant") {
            const isActive = meta.is_active === true;
            let statut = meta.statut_inscription;
            if (!statut) {
              statut = isActive ? "valide" : "en_attente";
            }
            studentsMap.set(u.id, {
              id: u.id,
              email: u.email,
              full_name: meta.full_name || meta.fullName || u.email?.split("@")[0] || "Étudiant",
              username: meta.username || null,
              telephone: meta.phone || null,
              matricule: meta.matricule || null,
              filiere: meta.filiere || "MPI",
              niveau: meta.niveau || "L1",
              is_active: isActive,
              statut_inscription: statut,
              created_at: u.created_at,
            });
          }
        }
      }
    } catch (authErr) {
      console.warn("[AUTH-LIST-USERS-WARN]", authErr);
    }

    // 2. Si la table profiles existe, fusionner ou enrichir avec les données de profiles
    try {
      const { data: profileList } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("role", "etudiant");

      if (profileList) {
        for (const p of profileList) {
          const existing = studentsMap.get(p.id) || {};
          studentsMap.set(p.id, {
            ...existing,
            ...p,
            statut_inscription: p.statut_inscription || (p.is_active ? "valide" : "en_attente"),
          });
        }
      }
    } catch {}

    const studentsList = Array.from(studentsMap.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    const pendingList = studentsList.filter(
      (s) =>
        (s.statut_inscription === "en_attente" || (!s.statut_inscription && !s.is_active)) &&
        s.statut_inscription !== "refuse" &&
        s.statut_inscription !== "valide"
    );
    const validatedList = studentsList.filter(
      (s) => s.statut_inscription === "valide" || (s.is_active === true && s.statut_inscription !== "refuse")
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

    if (!studentId || (action !== "accept" && action !== "reject" && action !== "pending")) {
      return NextResponse.json(
        { error: "Paramètres invalides (studentId et action 'accept' | 'reject' | 'pending' requis)." },
        { status: 400 }
      );
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const origin = host ? `${proto}://${host}` : (request.nextUrl.origin || "https://has-academie.online");
    const loginUrl = `${origin}/connexion`;
    const siteUrl = origin;

    const supabaseAdmin = createAdminClient();
    const isAccepting = action === "accept";
    const isPending = action === "pending";
    const newStatus = isAccepting ? "valide" : isPending ? "en_attente" : "refuse";
    const newActive = isAccepting;

    let targetEmail: string | null = null;
    let targetFullName: string = "Étudiant";
    let targetMatricule: string | null = null;

    // 1. Mettre à jour les métadonnées dans Supabase Auth (garanti de persister)
    try {
      const { data: updatedAuthUser, error: authUpErr } = await supabaseAdmin.auth.admin.updateUserById(studentId, {
        user_metadata: {
          is_active: newActive,
          statut_inscription: newStatus,
        },
      });

      if (updatedAuthUser?.user) {
        targetEmail = updatedAuthUser.user.email || null;
        const meta = updatedAuthUser.user.user_metadata || {};
        targetFullName = meta.full_name || meta.fullName || "Étudiant";
        targetMatricule = meta.matricule || null;
      }
    } catch (authErr) {
      console.warn("[AUTH-UPDATE-ERR]", authErr);
    }

    // 2. Mettre à jour dans la table profiles si elle existe
    try {
      const { data: upProfile } = await supabaseAdmin
        .from("profiles")
        .update({
          is_active: isAccepting,
          statut_inscription: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .select()
        .maybeSingle();

      if (upProfile) {
        if (upProfile.email) targetEmail = upProfile.email;
        if (upProfile.full_name) targetFullName = upProfile.full_name;
        if (upProfile.matricule) targetMatricule = upProfile.matricule;
      }
    } catch {}

    // 3. Log d'audit
    try {
      await supabaseAdmin.from("audit_logs").insert({
        action: isAccepting ? "VALIDATION_INSCRIPTION_ACCEPTEE" : "VALIDATION_INSCRIPTION_REFUSEE",
        details: { student_id: studentId, email: targetEmail, matricule: targetMatricule },
        ip_address: request.headers.get("x-forwarded-for") || "admin",
      });
    } catch {}

    // 4. Envoi de l'email via Resend avec lien direct de retour au site
    if (targetEmail && (isAccepting || (!isPending && action === "reject"))) {
      try {
        if (isAccepting) {
          await sendRegistrationAcceptedEmail({
            email: targetEmail,
            fullName: targetFullName,
            matricule: targetMatricule,
            loginUrl,
          });
        } else {
          await sendRegistrationRejectedEmail({
            email: targetEmail,
            fullName: targetFullName,
            siteUrl,
          });
        }
      } catch (emailErr) {
        console.warn("[RESEND-EMAIL-ERROR]", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      action: isAccepting ? "accepted" : isPending ? "pending" : "rejected",
      message: isAccepting
        ? `L'inscription de ${targetFullName} a été validée avec succès. Un email de confirmation lui a été envoyé.`
        : isPending
        ? `Le dossier de ${targetFullName} a été replacé en attente de décision.`
        : `L'inscription de ${targetFullName} a été refusée. Un email explicatif lui a été envoyé.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
