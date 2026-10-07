/**
 * Service d'envoi de notifications Telegram pour les administrateurs HAS
 * Permet d'alerter instantanément l'administration lors d'une nouvelle inscription.
 */

export interface TelegramNotificationParams {
  fullName: string;
  email: string;
  filiere: string;
  niveau: string;
  matricule: string;
  username: string;
  phone?: string | null;
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

  const messageText = `
📢 <b>NOUVELLE DEMANDE D'INSCRIPTION HAS</b>

👤 <b>Candidat :</b> ${escapeHtml(params.fullName)}
📧 <b>Email :</b> ${escapeHtml(params.email)}
${params.phone ? `📞 <b>Téléphone :</b> ${escapeHtml(params.phone)}\n` : ""}🎓 <b>Filière :</b> ${escapeHtml(params.filiere)} (${escapeHtml(params.niveau)})
🔢 <b>Matricule :</b> <code>${escapeHtml(params.matricule)}</code>
🆔 <b>Identifiant :</b> @${escapeHtml(params.username)}
📅 <b>Date :</b> ${dateFormatted} (GMT)

⚡ <i>Veuillez vous connecter à l'espace Administration pour accepter ou refuser cette inscription.</i>
`.trim();

  // Si le bot n'est pas encore configuré (ex: clés en attente)
  if (!botToken || !chatId || botToken.trim() === "" || chatId.trim() === "") {
    console.log(
      "[TELEGRAM-NOTIFICATION-MOCK] Bot Telegram non configuré dans .env.local (TELEGRAM_BOT_TOKEN / TELEGRAM_ADMIN_CHAT_ID)."
    );
    console.log(messageText.replace(/<[^>]*>/g, ""));
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
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok || !data?.ok) {
      console.warn("[TELEGRAM-SEND-FAIL]", data);
      return { success: false, error: data?.description || "Erreur API Telegram" };
    }

    console.log("[TELEGRAM-NOTIFICATION-SUCCESS] Notification transmise avec succès à l'admin.");
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
