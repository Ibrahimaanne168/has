/**
 * Service d'envoi de notifications Telegram pour les administrateurs HAS
 * Permet d'alerter instantanément l'administration avec boutons de validation directe.
 */

import crypto from "crypto";

export interface TelegramNotificationParams {
  studentId: string;
  fullName: string;
  filiere: string;
  niveau: string;
  username?: string;
  phone?: string | null;
}

/**
 * Génère un jeton sécurisé pour autoriser l'action d'acceptation/refus direct depuis Telegram
 */
export function generateTelegramActionToken(studentId: string): string {
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.TELEGRAM_BOT_TOKEN || "has-telegram-secret";
  return crypto.createHmac("sha256", secret).update(`telegram-action-${studentId}`).digest("hex").slice(0, 32);
}

/**
 * Vérifie l'authenticité du jeton d'action Telegram
 */
export function verifyTelegramActionToken(studentId: string, token: string): boolean {
  if (!studentId || !token) return false;
  const expected = generateTelegramActionToken(studentId);
  try {
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function sendTelegramAdminNotification(params: TelegramNotificationParams): Promise<{
  success: boolean;
  error?: string;
}> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;

  const dateFormatted = new Date().toLocaleString("fr-FR", {
    timeZone: "Africa/Dakar",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Message sans matricule ni email (conformément aux consignes strictes)
  const messageText = `
🎓 <b>NOUVELLE DEMANDE D'INSCRIPTION — HAS</b>

👤 <b>${escapeHtml(params.fullName)}</b> veut s'inscrire

📚 <b>Filière :</b> ${escapeHtml(params.filiere)}
🎯 <b>Niveau :</b> ${escapeHtml(params.niveau)}
${params.phone ? `📞 <b>Téléphone :</b> ${escapeHtml(params.phone)}\n` : ""}📅 <b>Date :</b> ${dateFormatted} (GMT)

⚡ <i>Validez ou refusez directement la demande avec les boutons ci-dessous :</i>
`.trim();

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.has-academie.online";
  const token = generateTelegramActionToken(params.studentId);
  const acceptUrl = `${baseUrl}/api/admin/validation-telegram?action=accept&studentId=${encodeURIComponent(params.studentId)}&token=${token}`;
  const rejectUrl = `${baseUrl}/api/admin/validation-telegram?action=reject&studentId=${encodeURIComponent(params.studentId)}&token=${token}`;

  const replyMarkup = {
    inline_keyboard: [
      [
        { text: "✅ Accepter l'inscription", url: acceptUrl },
        { text: "❌ Refuser", url: rejectUrl },
      ],
    ],
  };

  // Si le bot n'est pas encore configuré (ex: clés en attente)
  if (!botToken || !chatId || botToken.trim() === "" || chatId.trim() === "") {
    console.log(
      "[TELEGRAM-NOTIFICATION-MOCK] Bot Telegram non configuré dans .env.local (TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID)."
    );
    console.log(messageText.replace(/<[^>]*>/g, ""));
    console.log("Actions directes :");
    console.log(`[Accepter] -> ${acceptUrl}`);
    console.log(`[Refuser]  -> ${rejectUrl}`);
    return {
      success: true,
      error: "TELEGRAM_BOT_TOKEN ou TELEGRAM_ADMIN_CHAT_ID non configuré (notification simulée en console)",
    };
  }

  try {
    const url = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId.trim(),
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: replyMarkup,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      console.warn("[TELEGRAM-SEND-FAIL]", data);
      return { success: false, error: data?.description || "Erreur API Telegram" };
    }

    console.log("[TELEGRAM-NOTIFICATION-SUCCESS] Notification transmise avec succès à l'admin avec boutons d'action.");
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur réseau Telegram";
    console.error("[TELEGRAM-SEND-ERROR]", msg);
    return { success: false, error: msg };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
