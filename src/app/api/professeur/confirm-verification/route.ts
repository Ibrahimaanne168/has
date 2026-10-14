import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const rawEmail = (body.email || "").trim().toLowerCase();
    const cleanCode = String(body.code || "").trim();
    const profId = (body.profId || "").trim();

    if (!rawEmail || !cleanCode) {
      return NextResponse.json(
        { error: "Email et code de vérification requis." },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Recherche des codes actifs pour cet email
    const { data: codeRecords, error: searchError } = await supabaseAdmin
      .from("verification_codes")
      .select("*")
      .eq("email", rawEmail)
      .eq("type", "prof_email_verify")
      .order("created_at", { ascending: false })
      .limit(5);

    const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

    if (searchError) {
      console.warn("[CONFIRM-VERIFY] Recherche codes erreur:", searchError.message);
      if (isPlaceholder) {
        return NextResponse.json({
          success: true,
          email: rawEmail,
          message: "Adresse email validée avec succès (mode test).",
        });
      }
    }

    if (!codeRecords || codeRecords.length === 0) {
      if (isPlaceholder) {
        return NextResponse.json({
          success: true,
          email: rawEmail,
          message: "Adresse email validée avec succès (mode test).",
        });
      }
      return NextResponse.json(
        { error: "Aucun code en attente trouvé pour cet email. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    const matchingRecord = codeRecords.find((r) => String(r.code).trim() === cleanCode);

    if (!matchingRecord) {
      const latest = codeRecords[0];
      const newAttempts = (latest.attempts || 0) + 1;
      await supabaseAdmin
        .from("verification_codes")
        .update({ attempts: newAttempts })
        .eq("id", latest.id);

      return NextResponse.json(
        { error: `Code incorrect. Il vous reste ${Math.max(0, 5 - newAttempts)} tentative(s).` },
        { status: 400 }
      );
    }

    if (new Date(matchingRecord.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Ce code a expiré (validité 15 min). Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    if ((matchingRecord.attempts || 0) >= 5) {
      return NextResponse.json(
        { error: "Nombre maximum d'essais atteint. Veuillez demander un nouveau code." },
        { status: 400 }
      );
    }

    // Marquer vérifié
    await supabaseAdmin
      .from("verification_codes")
      .update({ verified: true })
      .eq("id", matchingRecord.id);

    // Mettre à jour Supabase profiles si profId fourni
    if (profId) {
      try {
        await supabaseAdmin
          .from("profiles")
          .update({
            email: rawEmail,
            updated_at: new Date().toISOString(),
          })
          .eq("id", profId);
      } catch (profErr) {
        console.warn("[CONFIRM-VERIFY] Mise à jour profile ignorée:", profErr);
      }
    }

    // Enregistrer la certification dans public.logs pour que les rappels puissent y accéder en toute sécurité
    try {
      await supabaseAdmin.from("logs").insert({
        action: `PROF_EMAIL_VERIFIED:${profId || rawEmail}`,
        description: JSON.stringify({
          email: rawEmail,
          profId,
          verified_at: new Date().toISOString(),
        }),
      });
    } catch {}

    return NextResponse.json({
      success: true,
      email: rawEmail,
      message: "Votre adresse email a été certifiée avec succès !",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
