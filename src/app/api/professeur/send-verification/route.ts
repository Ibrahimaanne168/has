import { NextRequest, NextResponse } from "next/server";
import { sendProfEmailVerificationCode } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/service-role";

// Simple rate limit in-memory
const RATE_LIMIT_MAP = new Map<string, { count: number; lastTime: number }>();

function checkRateLimit(key: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry) {
    RATE_LIMIT_MAP.set(key, { count: 1, lastTime: now });
    return true;
  }
  if (now - entry.lastTime > windowMs) {
    RATE_LIMIT_MAP.set(key, { count: 1, lastTime: now });
    return true;
  }
  if (entry.count >= maxRequests) return false;
  entry.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "local";
    if (!checkRateLimit(`prof-verify-${ip}`, 5, 60000)) {
      return NextResponse.json(
        { error: "Trop de demandes consécutives. Veuillez patienter une minute." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawEmail = (body.email || "").trim().toLowerCase();
    const fullName = (body.fullName || "Professeur").trim();
    const profId = (body.profId || "").trim();

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json(
        { error: "Veuillez renseigner une adresse email valide." },
        { status: 400 }
      );
    }

    // Générer code à 6 chiffres
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes

    const supabaseAdmin = createAdminClient();

    try {
      await supabaseAdmin.from("verification_codes").insert({
        email: rawEmail,
        code,
        type: "prof_email_verify",
        expires_at: expiresAt,
        verified: false,
        attempts: 0,
      });
    } catch (dbErr) {
      console.warn("[VERIFY-EMAIL] Avertissement écriture DB (mode local possible):", dbErr);
    }

    // Envoi de l'email avec le code
    const emailRes = await sendProfEmailVerificationCode(rawEmail, fullName, code);

    console.info(`[PROF-EMAIL-VERIFY] Code généré pour ${rawEmail} (${fullName}) : ${code}`);

    return NextResponse.json({
      success: true,
      message: `Un code de vérification à 6 chiffres a été envoyé à l'adresse ${rawEmail}.`,
      email: rawEmail,
      profId,
      simulated: emailRes.simulated || false,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
