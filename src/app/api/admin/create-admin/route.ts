import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

// ⚠️ ROUTE PROTÉGÉE — Création et synchronisation des comptes admin
const DEFAULT_ADMINS = [
  {
    email: "ibou@has-academie.online",
    password: "Admin123!",
    username: "ibou",
    full_name: "El Hadji",
  },
  {
    email: "halil@has-academie.online",
    password: "Admin123!",
    username: "halil",
    full_name: "Administration HAS",
  },
];

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
      },
      { status: 503 }
    );
  }

  try {
    const supabaseAdmin = createAdminClient();
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });

    if (listError) {
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const results = [];

    for (const adminInfo of DEFAULT_ADMINS) {
      const existing = usersData?.users?.find(
        (u) =>
          u.email?.toLowerCase() === adminInfo.email.toLowerCase() ||
          u.user_metadata?.username?.toLowerCase() === adminInfo.username.toLowerCase()
      );

      if (existing) {
        // Mettre à jour si nécessaire
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          email: adminInfo.email,
          password: adminInfo.password,
          email_confirm: true,
          user_metadata: {
            ...existing.user_metadata,
            full_name: adminInfo.full_name,
            username: adminInfo.username,
            role: "admin",
            is_active: true,
          },
        });

        try {
          await supabaseAdmin.from("profiles").upsert({
            id: existing.id,
            email: adminInfo.email,
            username: adminInfo.username,
            full_name: adminInfo.full_name,
            role: "admin",
            is_active: true,
            updated_at: new Date().toISOString(),
          });
        } catch {}

        results.push({ username: adminInfo.username, status: "existant_et_mis_a_jour", email: adminInfo.email });
      } else {
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email: adminInfo.email,
          password: adminInfo.password,
          email_confirm: true,
          user_metadata: {
            full_name: adminInfo.full_name,
            username: adminInfo.username,
            role: "admin",
            is_active: true,
          },
        });

        if (createErr) {
          results.push({ username: adminInfo.username, status: "erreur", message: createErr.message });
        } else {
          try {
            await supabaseAdmin.from("profiles").upsert({
              id: created.user.id,
              email: adminInfo.email,
              username: adminInfo.username,
              full_name: adminInfo.full_name,
              role: "admin",
              is_active: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
          } catch {}

          results.push({ username: adminInfo.username, status: "cree", email: adminInfo.email });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "✅ Comptes administrateurs configurés avec succès !",
      admins: results,
      prochaine_etape: "Connectez-vous sur /connexion avec 'ibou' ou 'halil' et le mot de passe Admin123!",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
