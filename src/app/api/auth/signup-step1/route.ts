import { NextRequest, NextResponse } from "next/server";
import { signupStep1Schema } from "@/lib/validators";
import { send2FACodeEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/service-role";

// Simple in-memory rate limiting for development & edge protection
const RATE_LIMIT_MAP = new Map<string, { count: number; lastTime: number }>();

function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(identifier);
  if (!entry) {
    RATE_LIMIT_MAP.set(identifier, { count: 1, lastTime: now });
    return true;
  }
  if (now - entry.lastTime > windowMs) {
    RATE_LIMIT_MAP.set(identifier, { count: 1, lastTime: now });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(`signup1-${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: "Trop de requêtes. Veuillez patienter une minute avant de réessayer." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const parseResult = signupStep1Schema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Données invalides" },
        { status: 400 }
      );
    }

    const { fullName, email } = parseResult.data;

    // Génération du code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    const supabaseAdmin = createAdminClient();

    // Enregistrement dans Supabase verification_codes
    try {
      await supabaseAdmin.from("verification_codes").insert({
        email,
        code,
        type: "signup_2fa",
        expires_at: expiresAt,
        verified: false,
        attempts: 0,
      });
    } catch (dbErr) {
      console.warn("[DB WARNING] Impossible d'écrire verification_code (mode local possible):", dbErr);
    }

    // Envoi de l'email via Resend
    const emailRes = await send2FACodeEmail(email, fullName, code);

    // Journalisation console pour faciliter les tests
    console.info(`[AUTHENTIFICATION 2FA] Code généré pour ${email} : ${code}`);

    if (!emailRes.success && !emailRes.simulated) {
      console.error(`[SIGNUP-STEP1] Échec envoi email à ${email}:`, emailRes.error);
    }

    return NextResponse.json({
      success: true,
      message: "Un code de vérification à 6 chiffres a été envoyé par email.",
      email,
      simulated: emailRes.simulated || false,
      emailError: process.env.NODE_ENV !== "production" ? emailRes.error : undefined,
      devCode: process.env.NODE_ENV !== "production" ? code : undefined,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne du serveur";
    console.error("[SIGNUP-STEP1-ERROR]", message);
    return NextResponse.json(
      { error: "Impossible de traiter votre demande. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
