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
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = String(code).trim();
    const supabaseAdmin = createAdminClient();

    // Recherche des codes actifs pour cet email
    const { data: codeRecords, error: searchError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("email", cleanEmail)
      .eq("type", "signup_2fa")
      .order("created_at", { ascending: false })
      .limit(5);

    const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

    if (searchError) {
      console.error("[VERIFY-CODE] Erreur Supabase:", searchError);
      if (searchError.code === "42P01" || searchError.message?.includes("does not exist")) {
        return NextResponse.json(
          { error: "La table verification_codes est manquante dans votre base Supabase. Veuillez exécuter le script database/verification_codes.sql dans le SQL Editor de Supabase." },
          { status: 500 }
        );
      }
      if (isPlaceholder) {
        return NextResponse.json({
          success: true,
          message: "Code validé avec succès (mode de test).",
        });
      }
      return NextResponse.json(
        { error: `Erreur base de données : ${searchError.message}` },
        { status: 500 }
      );
    }

    if (!codeRecords || codeRecords.length === 0) {
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

    // Recherche d'un code correspondant parmi les derniers émis
    const matchingRecord = codeRecords.find(
      (r) => String(r.code).trim() === cleanCode
    );

    if (!matchingRecord) {
      const latest = codeRecords[0];
      const newAttempts = (latest.attempts || 0) + 1;
      await supabaseAdmin
        .from("verification_codes")
        .update({ attempts: newAttempts })
        .eq("id", latest.id);

      return NextResponse.json(
        { error: `Code incorrect. Il vous reste ${Math.max(0, 5 - newAttempts)} tentative(s). Vérifiez bien les 6 chiffres du dernier email reçu.` },
        { status: 400 }
      );
    }

    // Vérification de l'expiration
    if (new Date(matchingRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Ce code a expiré (validité 10 min). Veuillez cliquer sur 'Renvoyer un nouveau code'." },
        { status: 400 }
      );
    }

    // Vérification du nombre de tentatives
    if ((matchingRecord.attempts || 0) >= 5) {
      return NextResponse.json(
        { error: "Nombre maximum de tentatives atteint pour ce code. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    // Validation effective
    await supabaseAdmin
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", matchingRecord.id);

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
