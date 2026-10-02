import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function GET(request: NextRequest) {
  const identifier = request.nextUrl.searchParams.get("identifier")?.trim();

  if (!identifier) {
    return NextResponse.json({ error: "Identifiant manquant" }, { status: 400 });
  }

  const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
  if (isPlaceholder) {
    return NextResponse.json({ email: identifier });
  }

  try {
    const supabaseAdmin = createAdminClient();
    const cleanId = identifier.toLowerCase();

    // 1. Tenter via la table profiles si elle existe
    try {
      const { data: profile } = await supabaseAdmin
        .from("profiles")
        .select("email, role")
        .or(`username.ilike.${cleanId},email.ilike.${cleanId}`)
        .maybeSingle();

      if (profile?.email) {
        return NextResponse.json({ email: profile.email, role: profile.role });
      }
    } catch {
      // Table profiles potentiellement non encore créée, on bascule sur Supabase Auth
    }

    // 2. Recherche directe dans la liste des utilisateurs Supabase Auth (admin)
    const { data: usersData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      perPage: 1000,
    });

    if (!usersError && usersData?.users) {
      const matchedUser = usersData.users.find((u) => {
        const email = (u.email || "").toLowerCase();
        const username = (u.user_metadata?.username || "").toLowerCase();
        const prefix = email.split("@")[0];
        return email === cleanId || username === cleanId || prefix === cleanId;
      });

      if (matchedUser?.email) {
        const role =
          matchedUser.user_metadata?.role ||
          (matchedUser.email?.includes("admin") || matchedUser.email?.includes("halil-academie")
            ? "admin"
            : matchedUser.email?.endsWith("@has-academie.online")
            ? "professeur"
            : "etudiant");

        return NextResponse.json({
          email: matchedUser.email,
          role,
        });
      }
    }

    // Si aucune correspondance n'est trouvée, renvoyer l'identifiant brut (si déjà un email)
    return NextResponse.json({ email: identifier });
  } catch (err: unknown) {
    console.error("Erreur lors de la résolution de l'identifiant:", err);
    return NextResponse.json({ email: identifier });
  }
}
