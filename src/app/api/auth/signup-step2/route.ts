import { NextRequest, NextResponse } from "next/server";
import { signupStep2Schema } from "@/lib/validators";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = signupStep2Schema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { email, code, fullName, username, password } = parseResult.data;
    const supabaseAdmin = createAdminClient();

    // 1. Vérification que le code a bien été vérifié
    const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

    if (!isPlaceholder) {
      const { data: codeRecord } = await supabaseAdmin
        .from("verification_codes")
        .select("*")
        .eq("email", email)
        .eq("code", code)
        .eq("type", "signup_2fa")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (!codeRecord || !codeRecord.verified) {
        return NextResponse.json(
          { error: "Le code 2FA n'a pas été validé au préalable. Veuillez recommencer la vérification." },
          { status: 403 }
        );
      }
    }

    // 2. Génération automatique du matricule étudiant officiel HAS
    const year = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const matricule = `HAS-${year}-ETU-${randomDigits}`;

    // 3. Création du compte dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
        username,
        role: "etudiant",
      },
    });

    if (authError) {
      console.error("[SUPABASE-AUTH-ERROR]", authError);
      return NextResponse.json(
        { error: `Erreur d'inscription: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // 4. Insertion dans la table profiles
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      username,
      full_name: fullName,
      role: "etudiant", // Rôle par défaut imposé (seul l'admin peut promouvoir)
      matricule,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("[PROFILE-INSERT-ERROR]", profileError);
    }

    // 5. Journalisation d'audit
    try {
      const ip = request.headers.get("x-forwarded-for") || "local";
      await supabaseAdmin.from("audit_logs").insert({
        user_id: userId,
        action: "INSCRIPTION_ETUDIANT_2FA",
        details: { email, matricule, username },
        ip_address: ip,
      });
    } catch (auditErr) {
      console.warn("[AUDIT-LOG-FAIL]", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Votre compte Halil Académie Scientifique a été créé avec succès.",
      user: {
        id: userId,
        email,
        fullName,
        username,
        matricule,
        role: "etudiant",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    console.error("[SIGNUP-STEP2-ERROR]", message);
    return NextResponse.json(
      { error: "Impossible de finaliser l'inscription. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
