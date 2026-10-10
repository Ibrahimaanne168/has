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
      replyTo: "noreply@has-academie.online",
      to: [toEmail],
      subject,
      html: htmlContent,
      text: textContent || subject,
      headers: {
        "X-Entity-Ref-ID": `has-${Date.now()}`,
        "List-Unsubscribe": "<mailto:noreply@has-academie.online>",
      },
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

/**
 * Envoi de l'email de confirmation d'inscription (acceptée par l'admin) avec lien direct
 */
export async function sendRegistrationAcceptedEmail({
  email,
  fullName,
  matricule,
  loginUrl,
}: {
  email: string;
  fullName: string;
  matricule?: string | null;
  loginUrl: string;
}) {
  const subject = `Félicitations ! Votre inscription est validée — Halil Académie Scientifique`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #0f2744; padding: 28px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">HALIL ACADÉMIE SCIENTIFIQUE</h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px;">Direction des Admissions & Scolarité</p>
      </div>

      <div style="padding: 36px 28px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: #ecfdf5; border: 1px solid #a7f3d0; color: #047857; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 14px; border-radius: 9999px;">
            ✓ Inscription Validée
          </span>
        </div>

        <h2 style="color: #0f2744; margin: 0 0 16px 0; font-size: 20px; font-weight: 700; text-align: center;">
          Bienvenue au sein de l'Académie !
        </h2>

        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Bonjour <strong>${fullName}</strong>,
        </p>

        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          Nous avons le plaisir de vous informer que votre dossier d'inscription pour l'année universitaire <strong>2026-2027</strong> a été formellement examiné et <strong>validé par la direction académique</strong>. Votre compte est désormais pleinement activé.
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 0 0 28px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Matricule officiel :</td>
              <td style="color: #0f2744; font-weight: 700; text-align: right; padding: 6px 0; font-family: monospace;">${matricule || "Non renseigné"}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Identifiant de connexion :</td>
              <td style="color: #0f2744; font-weight: 600; text-align: right; padding: 6px 0;">${email}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0;">Statut académique :</td>
              <td style="color: #059669; font-weight: 700; text-align: right; padding: 6px 0;">Actif / Autorisé</td>
            </tr>
          </table>
        </div>

        <div style="text-align: center; margin: 32px 0 24px 0;">
          <a href="${loginUrl}" style="display: inline-block; background-color: #0f2744; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 6px rgba(15,39,68,0.25);">
            Accéder à mon espace étudiant &rarr;
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center; margin: 0 0 16px 0;">
          Si le bouton ci-dessus ne fonctionne pas, copiez ce lien direct dans votre navigateur :<br/>
          <a href="${loginUrl}" style="color: #e0521c; text-decoration: underline; word-break: break-all;">${loginUrl}</a>
        </p>

        <p style="color: #64748b; font-size: 13px; line-height: 1.6; margin: 24px 0 0 0; padding-top: 16px; border-top: 1px solid #f1f5f9;">
          Vous pouvez dès à présent télécharger vos supports de cours, consulter l'emploi du temps officiel et rejoindre le chat académique pour échanger avec vos enseignants et pairs.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
          Halil Académie Scientifique • Excellence & Rigueur
        </p>
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          Cet email vous a été envoyé automatiquement suite à la validation de votre dossier.
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
 * Envoi de l'email de non-confirmation / refus d'inscription avec lien direct de retour au site
 */
export async function sendRegistrationRejectedEmail({
  email,
  fullName,
  siteUrl,
}: {
  email: string;
  fullName: string;
  siteUrl: string;
}) {
  const subject = `Information concernant votre demande d'inscription — Halil Académie Scientifique`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #0f2744; padding: 28px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">HALIL ACADÉMIE SCIENTIFIQUE</h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px;">Direction des Admissions & Scolarité</p>
      </div>

      <div style="padding: 36px 28px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <span style="display: inline-block; background-color: #fef2f2; border: 1px solid #fecaca; color: #dc2626; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 14px; border-radius: 9999px;">
            Dossier non retenu
          </span>
        </div>

        <h2 style="color: #0f2744; margin: 0 0 16px 0; font-size: 20px; font-weight: 700; text-align: center;">
          Mise à jour de votre candidature
        </h2>

        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Bonjour <strong>${fullName}</strong>,
        </p>

        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Nous vous remercions pour l'intérêt que vous avez porté à nos programmes d'enseignement à <strong>Halil Académie Scientifique</strong>.
        </p>

        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 24px 0;">
          Après examen attentif des éléments de votre dossier par le comité des admissions, nous vous informons que votre demande d'inscription n'a pas pu être retenue pour cette session.
        </p>

        <div style="background-color: #f8fafc; border-left: 4px solid #94a3b8; padding: 14px 18px; margin: 0 0 28px 0; border-radius: 0 8px 8px 0;">
          <p style="color: #475569; font-size: 13px; line-height: 1.5; margin: 0;">
            Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez obtenir des informations complémentaires sur les critères d'admission, vous pouvez prendre contact avec le secrétariat académique.
          </p>
        </div>

        <div style="text-align: center; margin: 32px 0 24px 0;">
          <a href="${siteUrl}" style="display: inline-block; background-color: #0f2744; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
            Retourner sur le site officiel &rarr;
          </a>
        </div>

        <p style="color: #64748b; font-size: 12px; line-height: 1.5; text-align: center; margin: 0;">
          Lien direct : <a href="${siteUrl}" style="color: #e0521c; text-decoration: underline;">${siteUrl}</a>
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
          Halil Académie Scientifique • Secrétariat Général
        </p>
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          Pour toute question, contactez notre équipe via le formulaire de contact du site.
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
 * Envoi d'un email de rappel avant le début d'un cours en ligne
 */
export async function sendCourseReminderEmail({
  email,
  fullName,
  matiereNom,
  jour,
  horaireDebut,
  horaireFin,
  enseignantNom,
  meetUrl,
  filiere,
  niveau,
  delai = "40 minutes",
}: {
  email: string;
  fullName: string;
  matiereNom: string;
  jour: string;
  horaireDebut: string;
  horaireFin: string;
  enseignantNom?: string | null;
  meetUrl?: string | null;
  filiere?: string | null;
  niveau?: string | null;
  delai?: string;
}) {
  const subject = `Rappel : Cours de ${matiereNom} dans ${delai} (${horaireDebut} - ${horaireFin}) — HAS`;
  const htmlContent = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
      <div style="background-color: #0f2744; padding: 26px 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.5px;">HALIL ACADÉMIE SCIENTIFIQUE</h1>
        <p style="color: #cbd5e1; margin: 6px 0 0 0; font-size: 13px;">Rappel officiel de séance en ligne</p>
      </div>

      <div style="padding: 32px 26px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; background-color: #eff6ff; border: 1px solid #bfdbfe; color: #1d4ed8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 14px; border-radius: 9999px;">
            🔔 Début dans ${delai} — ${jour}
          </span>
        </div>

        <h2 style="color: #0f2744; margin: 0 0 14px 0; font-size: 21px; font-weight: 800; text-align: center;">
          ${matiereNom}
        </h2>

        <p style="color: #334155; font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
          Bonjour <strong>${fullName}</strong>,
        </p>

        <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0 0 20px 0;">
          Nous vous rappelons que votre séance en ligne de <strong>${matiereNom}</strong> commence dans <strong>${delai}</strong> (à <strong>${horaireDebut}</strong>) :
        </p>

        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px 20px; margin: 0 0 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 600;">Jour :</td>
              <td style="color: #0f2744; font-weight: 700; text-align: right; padding: 6px 0;">${jour}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 600;">Horaires :</td>
              <td style="color: #e0521c; font-weight: 800; text-align: right; padding: 6px 0;">${horaireDebut} — ${horaireFin}</td>
            </tr>
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 600;">Enseignant :</td>
              <td style="color: #0f2744; font-weight: 700; text-align: right; padding: 6px 0;">${enseignantNom || "Mister Halil"}</td>
            </tr>
            ${niveau || filiere ? `
            <tr>
              <td style="color: #64748b; padding: 6px 0; font-weight: 600;">Classe & Filière :</td>
              <td style="color: #475569; font-weight: 600; text-align: right; padding: 6px 0;">${niveau || ""} ${filiere || ""}</td>
            </tr>` : ""}
          </table>
        </div>

        ${meetUrl ? `
        <div style="text-align: center; margin: 28px 0;">
          <a href="${meetUrl}" style="display: inline-block; background-color: #0f2744; color: #ffffff; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 8px; box-shadow: 0 2px 6px rgba(15,39,68,0.25);">
            🎥 Rejoindre la salle de cours (Google Meet) &rarr;
          </a>
          <p style="color: #64748b; font-size: 12px; margin-top: 10px;">
            Lien direct : <a href="${meetUrl}" style="color: #e0521c; text-decoration: underline; word-break: break-all;">${meetUrl}</a>
          </p>
        </div>
        ` : `
        <div style="text-align: center; margin: 24px 0;">
          <a href="https://www.has-academie.online/etudiant/edt" style="display: inline-block; background-color: #0f2744; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px;">
            Consulter l'emploi du temps sur mon espace &rarr;
          </a>
        </div>
        `}

        <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin: 20px 0 0 0; padding-top: 16px; border-top: 1px solid #f1f5f9; text-align: center;">
          Pensez à vous connecter quelques minutes avant le début de la séance avec vos cahiers et calculatrices prêts.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 18px; text-align: center; border-top: 1px solid #e2e8f0;">
        <p style="color: #64748b; font-size: 12px; margin: 0 0 4px 0;">
          Halil Académie Scientifique • Excellence & Rigueur
        </p>
        <p style="color: #94a3b8; font-size: 11px; margin: 0;">
          Cet email est un rappel automatique destiné aux étudiants inscrits.
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
