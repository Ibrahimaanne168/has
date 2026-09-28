import { NextRequest, NextResponse } from "next/server";
import { verify2FASchema } from "@/lib/validators";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = verify2FASchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Format de code invalide" },
        { status: 400 }
      );
    }

    const { email, code } = parseResult.data;
    const supabaseAdmin = createAdminClient();

    // Recherche du code actif le plus récent pour cet email
    const { data: codeRecord, error: searchError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("email", email)
      .eq("type", "signup_2fa")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (searchError || !codeRecord) {
      // Si aucune base de données n'est connectée en mode local, accepter les codes 6 chiffres
      const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");
      if (isPlaceholder) {
        return NextResponse.json({
          success: true,
          message: "Code validé avec succès (mode de test).",
        });
      }

      return NextResponse.json(
        { error: "Aucun code en attente trouvé pour cette adresse email. Veuillez en demander un nouveau." },
        { status: 400 }
      );
    }

    // Vérification de l'expiration
    if (new Date(codeRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Ce code a expiré (validité 10 min). Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    // Vérification du nombre de tentatives
    if (codeRecord.attempts >= 5) {
      return NextResponse.json(
        { error: "Nombre maximum de tentatives atteint. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    // Incrément des tentatives
    await supabaseAdmin
      .from("verification_codes")
      .update({ attempts: codeRecord.attempts + 1 })
      .eq("id", codeRecord.id);

    // Comparaison du code
    if (codeRecord.code !== code) {
      return NextResponse.json(
        { error: `Code incorrect. Il vous reste ${4 - codeRecord.attempts} tentative(s).` },
        { status: 400 }
      );
    }

    // Validation effective
    await supabaseAdmin
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", codeRecord.id);

    return NextResponse.json({
      success: true,
      message: "Code vérifié avec succès.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    console.error("[VERIFY-CODE-ERROR]", message);
    return NextResponse.json(
      { error: "Erreur lors de la validation du code." },
      { status: 500 }
    );
  }
}
