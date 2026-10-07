import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

// ⚠️ ROUTE PROTÉGÉE — Usage unique pour créer le compte admin initial
const ADMIN_EMAIL = "admin.halil@has-internal.local";
const ADMIN_PASSWORD = "Admin123!";
const ADMIN_USERNAME = "halil";
const ADMIN_FULLNAME = "Administration HAS";

export async function GET(request: NextRequest) {
  // En production, cette route est désactivée par défaut sauf si ADMIN_SEED_TOKEN est explicitement configuré
  if (process.env.NODE_ENV === "production" && !process.env.ADMIN_SEED_TOKEN) {
    return NextResponse.json({ error: "Route non disponible." }, { status: 404 });
  }

  const token = request.nextUrl.searchParams.get("token");
  const expectedToken = process.env.ADMIN_SEED_TOKEN || (process.env.NODE_ENV !== "production" ? "has-admin-seed-2024" : null);

  if (!token || !expectedToken || token !== expectedToken) {
    return NextResponse.json(
      { error: "Accès non autorisé." },
      { status: 401 }
    );
  }

  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
  if (isPlaceholder) {
    return NextResponse.json(
      {
        error: "❌ Supabase non configuré (mode placeholder).",
        instructions: [
          "1. Allez sur https://supabase.com → votre projet → Settings → API",
          "2. Copiez 'Project URL' et 'service_role secret'",
          "3. Mettez à jour NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans .env.local",
          "4. Relancez le serveur: npm run dev",
          "5. Revenez sur cette URL",
        ],
      },
      { status: 503 }
    );
  }

  try {
    const supabaseAdmin = createAdminClient();

    // Vérifier si admin existe déjà
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const alreadyExists = usersData?.users?.find((u) => u.email === ADMIN_EMAIL);

    if (alreadyExists) {
      // S'assurer que le profil a bien le rôle admin
      await supabaseAdmin.from("profiles").upsert({
        id: alreadyExists.id,
        email: ADMIN_EMAIL,
        username: ADMIN_USERNAME,
        full_name: ADMIN_FULLNAME,
        role: "admin",
        is_active: true,
        updated_at: new Date().toISOString(),
      });

      return NextResponse.json({
        success: true,
        message: "✅ Compte admin 'halil' déjà existant — rôle admin confirmé.",
        identifiants: { username: ADMIN_USERNAME },
      });
    }

    // Créer dans Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: ADMIN_FULLNAME, username: ADMIN_USERNAME, role: "admin" },
    });

    if (authError) {
      return NextResponse.json(
        { error: `Erreur Auth: ${authError.message}` },
        { status: 400 }
      );
    }

    const userId = authData.user.id;

    // Créer le profil admin
    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email: ADMIN_EMAIL,
      username: ADMIN_USERNAME,
      full_name: ADMIN_FULLNAME,
      role: "admin",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.warn("[PROFILE-ERROR]", profileError.message);
    }

    return NextResponse.json({
      success: true,
      message: "✅ Compte admin configuré avec succès !",
      identifiants: {
        username: ADMIN_USERNAME,
        userId,
      },
      prochaine_etape: "Connectez-vous sur /connexion avec votre identifiant admin.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
