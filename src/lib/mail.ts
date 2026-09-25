import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey && resendApiKey !== "re_votre_cle_resend_ici" ? new Resend(resendApiKey) : null;
const fromEmail = process.env.RESEND_FROM_EMAIL || "HAS Académie <onboarding@resend.dev>";

/**
 * Envoie un code de vérification 2FA par email via Resend
 */
export async function sendTwoFactorCodeEmail(
  toEmail: string,
  code: string,
  userName: string
): Promise<{ success: boolean; error?: string }> {
  if (!toEmail) {
    return { success: false, error: "Adresse email non renseignée." };
  }

  // Fallback si la clé Resend n'est pas encore renseignée
  if (!resend) {
    console.log(`\n==================================================`);
    console.log(`[SIMULATION EMAIL 2FA - RESEND NON CONFIGURÉ]`);
    console.log(`Destinataire : ${toEmail} (${userName})`);
    console.log(`Code de validation 2FA : >>> ${code} <<<`);
    console.log(`==================================================\n`);
    return { success: true };
  }

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      subject: `🔐 Code de sécurité 2FA : ${code} — HAS Académie`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f172a; font-size: 22px; font-weight: 800; margin: 0;">Haute Académie du Sahel</h1>
            <p style="color: #2563eb; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin: 4px 0 0 0;">Sécurité du compte & Authentification</p>
          </div>
          
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0;">
            Bonjour <strong>${userName}</strong>,
          </p>
          
          <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
            Vous essayez de vous connecter à votre espace académique. Utilisez le code de validation suivant pour finaliser votre connexion :
          </p>

          <div style="text-align: center; margin: 28px 0; padding: 20px; background: #f8fafc; border: 2px dashed #93c5fd; border-radius: 12px;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #1d4ed8; font-family: monospace;">${code}</span>
          </div>

          <p style="color: #64748b; font-size: 12px; line-height: 1.5; margin: 0 0 24px 0;">
            Ce code est valable pendant <strong>10 minutes</strong>. Si vous n'êtes pas à l'origine de cette tentative de connexion, veuillez changer immédiatement votre mot de passe et alerter l'administration.
          </p>

          <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; text-align: center;">
            <p style="color: #94a3b8; font-size: 11px; margin: 0;">
              © ${new Date().getFullYear()} Haute Académie du Sahel. Tous droits réservés.
            </p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Erreur d'envoi email Resend:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Exception lors de l'envoi email Resend:", err);
    return { success: false, error: err.message || "Erreur lors de l'envoi de l'email" };
  }
}
