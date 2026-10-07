import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

function generateSuggestions(base: string): string[] {
  const clean = base.toLowerCase().replace(/[^a-z0-9]/g, "");
  const suggestions: string[] = [];
  const year = new Date().getFullYear().toString().slice(-2);
  const rand = () => Math.floor(10 + Math.random() * 90);

  suggestions.push(`${clean}${year}`);
  suggestions.push(`${clean}${rand()}`);
  suggestions.push(`${clean}_has`);
  suggestions.push(`${clean}${rand()}`);

  // Dédoublonnage et max 4
  return [...new Set(suggestions)].slice(0, 4);
}

export async function GET(request: NextRequest) {
  const username = request.nextUrl.searchParams.get("username")?.trim().toLowerCase();

  if (!username || username.length < 3) {
    return NextResponse.json({ available: false, error: "Identifiant trop court (3 caractères minimum)." });
  }

  if (!/^[a-z0-9_\-\.]{3,30}$/.test(username)) {
    return NextResponse.json({ available: false, error: "Identifiant invalide. Utilisez uniquement lettres, chiffres, tirets ou underscore." });
  }

  try {
    const supabase = createAdminClient();

    // 1. Vérifier dans la table profiles (ignorer les comptes refusés)
    try {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, statut_inscription")
        .eq("username", username)
        .maybeSingle();

      if (existingProfile && existingProfile.statut_inscription !== "refuse") {
        return NextResponse.json({
          available: false,
          message: `L'identifiant « ${username} » est déjà utilisé.`,
          suggestions: generateSuggestions(username),
        });
      }
    } catch {}

    // 2. Vérifier dans Supabase Auth (user_metadata.username, ignorer les comptes refusés)
    const { data: usersData, error } = await supabase.auth.admin.listUsers({ perPage: 1000 });

    if (!error && usersData?.users) {
      const taken = usersData.users.some((u) => {
        const meta = u.user_metadata || {};
        if (meta.statut_inscription === "refuse") return false; // Libéré pour réutilisation
        return (meta.username || "").toLowerCase() === username;
      });

      if (taken) {
        return NextResponse.json({
          available: false,
          message: `L'identifiant « ${username} » est déjà utilisé.`,
          suggestions: generateSuggestions(username),
        });
      }
    }

    return NextResponse.json({ available: true, message: `« ${username} » est disponible ✓` });
  } catch (err) {
    console.error("[CHECK-USERNAME]", err);
    return NextResponse.json({ available: true }); // fail open pour ne pas bloquer
  }
}
