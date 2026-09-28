// ==============================================================================
// SERVICE EMAILS TRANSACTIONNELS — RESEND (HALIL ACADÉMIE SCIENTIFIQUE)
// ==============================================================================

import { Resend } from "resend";

interface SendEmailParams {
  toEmail: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendTransactionalEmail({
  toEmail,
  toName,
  subject,
  htmlContent,
  textContent,
}: SendEmailParams): Promise<{ success: boolean; messageId?: string; simulated?: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  // Toujours formater l'expéditeur avec nom d'affichage pour Resend
  const rawSender = process.env.RESEND_SENDER_EMAIL || "onboarding@resend.dev";
  // Si déjà au format "Nom <email>", on le garde, sinon on ajoute le nom
  const senderEmail = rawSender.includes("<")
    ? rawSender
    : `Halil Académie Scientifique <${rawSender}>`;

  // Si pas de clé configurée en développement, on journalise et simule l'envoi sans bloquer l'expérience
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("votre-cle") || apiKey.includes("re_placeholder")) {
    console.info(`[SIMULATION EMAIL RESEND] -> À: ${toEmail} (${toName || "Utilisateur"}) | Sujet: ${subject}`);
    return {
      success: true,
      simulated: true,
      messageId: `simulated-resend-${Date.now()}`,
    };
  }

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: senderEmail,
      to: [toEmail],
      subject,
      html: htmlContent,
      text: textContent || subject,
    });

    if (error) {
      console.error("[RESEND ERROR]", JSON.stringify(error));
      return {
        success: false,
        error: `Resend: ${error.message || JSON.stringify(error)}`,
      };
    }

    console.info(`[RESEND OK] Email envoyé à ${toEmail} | id: ${data?.id}`);
    return {
      success: true,
      messageId: data?.id,
    };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Erreur réseau inconnue";
    console.error("[RESEND EXCEPTION]", msg);
    return {
      success: false,
      error: msg,
    };
  }
}

/**
 * Envoi du code de vérification 2FA pour l'inscription
 */
export async function send2FACodeEmail(email: string, fullName: string, code: string) {
  const subject = `Votre code de vérification — Halil Académie Scientifique`;
  const htmlContent = `
    <div style="font-family: Arial, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f2744; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700; letter-spacing: 0.5px;">HALIL ACADÉMIE SCIENTIFIQUE</h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px;">Direction des Systèmes d'Information & Admissions</p>
      </div>
      <div style="padding: 32px 24px; background-color: #ffffff;">
        <h2 style="color: #0f2744; margin-top: 0; font-size: 18px;">Validation de votre adresse email</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Bonjour <strong>${fullName}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Vous avez initié une demande de création de compte sur le portail officiel de <strong>Halil Académie Scientifique</strong>.
          Veuillez utiliser le code de sécurité ci-dessous pour certifier votre identité et finaliser votre inscription.
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <span style="display: inline-block; background-color: #f0f5fa; border: 2px dashed #0f2744; color: #0f2744; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 14px 28px; border-radius: 8px;">
            ${code}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          Ce code est strictement confidentiel et reste valable pendant <strong>10 minutes</strong>. Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email en toute sécurité.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Halil Académie Scientifique (HAS) — Tous droits réservés.
        </p>
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    toEmail: email,
    toName: fullName,
    subject,
    htmlContent,
  });
}

/**
 * Envoi du lien de réinitialisation de mot de passe
 */
export async function sendPasswordResetEmail(email: string, fullName: string, resetLink: string) {
  const subject = `Réinitialisation de votre mot de passe — Halil Académie Scientifique`;
  const htmlContent = `
    <div style="font-family: Arial, 'Helvetica Neue', sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #0f2744; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 700;">HALIL ACADÉMIE SCIENTIFIQUE</h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px;">Sécurité des comptes & Authentification</p>
      </div>
      <div style="padding: 32px 24px; background-color: #ffffff;">
        <h2 style="color: #0f2744; margin-top: 0; font-size: 18px;">Demande de réinitialisation de mot de passe</h2>
        <p style="color: #334155; font-size: 15px; line-height: 1.5;">Bonjour <strong>${fullName}</strong>,</p>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Une demande de réinitialisation de votre mot de passe d'accès au portail académique a été reçue. Cliquez sur le bouton ci-dessous pour choisir votre nouveau mot de passe :
        </p>
        <div style="margin: 28px 0; text-align: center;">
          <a href="${resetLink}" style="display: inline-block; background-color: #e0521c; color: #ffffff; font-size: 15px; font-weight: 600; text-decoration: none; padding: 12px 28px; border-radius: 6px;">
            Réinitialiser mon mot de passe
          </a>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          Si vous ne pouvez pas cliquer sur le bouton, copiez ce lien dans votre navigateur :<br/>
          <span style="word-break: break-all; color: #0f2744;">${resetLink}</span>
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 20px;">
          Ce lien est valable pour une durée limitée. Si vous n'êtes pas à l'origine de cette demande, veuillez contacter immédiatement le support informatique.
        </p>
      </div>
      <div style="background-color: #f1f5f9; padding: 16px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #94a3b8; font-size: 12px; margin: 0;">
          © ${new Date().getFullYear()} Halil Académie Scientifique (HAS)
        </p>
      </div>
    </div>
  `;

  return sendTransactionalEmail({
    toEmail: email,
    toName: fullName,
    subject,
    htmlContent,
  });
}
