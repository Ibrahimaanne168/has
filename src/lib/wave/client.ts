import crypto from "crypto";
import { WaveCheckoutSessionRequest, WaveCheckoutSessionResponse } from "./types";

const DEFAULT_WAVE_BASE_URL = "https://api.wave.com";
const DEFAULT_FEE_AMOUNT = 25000; // Frais d'inscription officielle HAS : 25 000 XOF

/**
 * Récupère le montant officiel des frais d'inscription défini côté serveur
 */
export function getInscriptionFeeAmount(): number {
  const envAmount = process.env.INSCRIPTION_FEE_AMOUNT;
  if (envAmount && !isNaN(Number(envAmount))) {
    return Math.max(100, Math.floor(Number(envAmount)));
  }
  return DEFAULT_FEE_AMOUNT;
}

/**
 * Récupère la devise officielle (Sénégal - Franc CFA)
 */
export function getWaveCurrency(): string {
  return (process.env.WAVE_CURRENCY || "XOF").toUpperCase();
}

/**
 * Crée une session de paiement Wave Checkout
 * Référence officielle : POST https://api.wave.com/v1/checkout/sessions
 */
export async function createWaveCheckoutSession(params: {
  amount: number;
  clientReference: string;
  successUrl?: string;
  errorUrl?: string;
}): Promise<WaveCheckoutSessionResponse> {
  const apiKey = process.env.WAVE_API_KEY;
  const baseUrl = (process.env.WAVE_BASE_URL || DEFAULT_WAVE_BASE_URL).replace(/\/$/, "");
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://www.has-academie.online").replace(/\/$/, "");

  const successUrl =
    params.successUrl ||
    process.env.WAVE_SUCCESS_URL ||
    `${appUrl}/payment/success?ref=${encodeURIComponent(params.clientReference)}`;

  const errorUrl =
    params.errorUrl ||
    process.env.WAVE_CANCEL_URL ||
    `${appUrl}/payment/cancel?ref=${encodeURIComponent(params.clientReference)}`;

  // Vérification de la clé API Wave
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("MA_CLE")) {
    // Mode simulation / bac à sable si la clé n'est pas encore fournie par l'utilisateur
    console.warn(
      "[WAVE-CHECKOUT] ATTENTION: WAVE_API_KEY non configurée. Session de simulation générée. Renseignez WAVE_API_KEY dans vos variables d'environnement."
    );
    const mockId = `cos_sim_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      id: mockId,
      amount: String(params.amount),
      currency: getWaveCurrency(),
      wave_launch_url: `${appUrl}/payment/success?ref=${encodeURIComponent(params.clientReference)}&simulated=1`,
      checkout_status: "open",
      client_reference: params.clientReference,
      when_created: new Date().toISOString(),
    };
  }

  const payload: WaveCheckoutSessionRequest = {
    amount: String(params.amount),
    currency: getWaveCurrency(),
    error_url: errorUrl,
    success_url: successUrl,
    client_reference: params.clientReference,
    restrict_pid_to_single_currency: true,
  };

  const response = await fetch(`${baseUrl}/v1/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey.trim()}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responseData = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg =
      responseData?.message ||
      responseData?.error ||
      `Erreur Wave (${response.status}: ${response.statusText})`;
    console.error("[WAVE-API-ERROR]", response.status, responseData);
    throw new Error(`Wave API: ${errorMsg}`);
  }

  return responseData as WaveCheckoutSessionResponse;
}

/**
 * Récupère le statut d'une session Wave Checkout
 * Référence officielle : GET https://api.wave.com/v1/checkout/sessions/:id
 */
export async function getWaveCheckoutSession(
  sessionId: string
): Promise<WaveCheckoutSessionResponse | null> {
  const apiKey = process.env.WAVE_API_KEY;
  const baseUrl = (process.env.WAVE_BASE_URL || DEFAULT_WAVE_BASE_URL).replace(/\/$/, "");

  if (!apiKey || apiKey.trim() === "" || sessionId.startsWith("cos_sim_")) {
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey.trim()}`,
        Accept: "application/json",
      },
    });

    if (!res.ok) return null;
    return (await res.json()) as WaveCheckoutSessionResponse;
  } catch (err) {
    console.error("[WAVE-GET-SESSION-ERROR]", err);
    return null;
  }
}

/**
 * Vérifie l'authenticité de la signature du Webhook Wave
 * Format attendu : Wave-Signature: t={timestamp},v1={signature}
 * Payload signé : timestamp + raw_body
 */
export function verifyWaveWebhookSignature(params: {
  rawBody: string;
  signatureHeader: string | null;
  webhookSecret: string | undefined;
}): { valid: boolean; reason?: string } {
  const { rawBody, signatureHeader, webhookSecret } = params;

  if (!webhookSecret || webhookSecret.trim() === "") {
    // Si aucun secret configuré, refuser par sécurité en production
    return { valid: false, reason: "WAVE_WEBHOOK_SECRET non configuré sur le serveur" };
  }

  if (!signatureHeader) {
    return { valid: false, reason: "En-tête Wave-Signature manquant" };
  }

  try {
    const parts = signatureHeader.split(",");
    let timestamp: string | null = null;
    let receivedSignature: string | null = null;

    for (const part of parts) {
      const [key, value] = part.trim().split("=");
      if (key === "t") timestamp = value;
      if (key === "v1") receivedSignature = value;
    }

    if (!timestamp || !receivedSignature) {
      return { valid: false, reason: "Format de Wave-Signature invalide (attendu t=...,v1=...)" };
    }

    // Protection contre les attaques par rejeu : maximum 5 minutes (300 secondes)
    const nowSeconds = Math.floor(Date.now() / 1000);
    const sentSeconds = parseInt(timestamp, 10);
    if (isNaN(sentSeconds) || Math.abs(nowSeconds - sentSeconds) > 300) {
      return { valid: false, reason: "Timestamp webhook expiré (plus de 5 minutes)" };
    }

    // Calcul de la signature HMAC-SHA256
    const payload = `${timestamp}${rawBody}`;
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret.trim())
      .update(payload)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature, "utf8");
    const receivedBuffer = Buffer.from(receivedSignature, "utf8");

    if (expectedBuffer.length !== receivedBuffer.length) {
      return { valid: false, reason: "Longueur de signature discordante" };
    }

    const matches = crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    if (!matches) {
      return { valid: false, reason: "Signature HMAC Wave invalide" };
    }

    return { valid: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur vérification";
    return { valid: false, reason: msg };
  }
}
