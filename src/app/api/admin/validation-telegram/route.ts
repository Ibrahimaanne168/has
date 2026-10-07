import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { verifyTelegramActionToken } from "@/lib/telegram";
import {
  sendRegistrationAcceptedEmail,
  sendRegistrationRejectedEmail,
} from "@/lib/resend";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const action = searchParams.get("action");
  const studentId = searchParams.get("studentId");
  const token = searchParams.get("token");

  // Vérification de sécurité du token
  if (!action || !studentId || !token || (action !== "accept" && action !== "reject")) {
    return new NextResponse(
      renderHtmlResponse({
        success: false,
        title: "Lien invalide ou expiré",
        message: "Les paramètres de sécurité requis pour exécuter cette action sont manquants ou incorrects.",
      }),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const isValidToken = verifyTelegramActionToken(studentId, token);
  if (!isValidToken) {
    return new NextResponse(
      renderHtmlResponse({
        success: false,
        title: "Signature non autorisée",
        message: "Ce lien d'action Telegram n'a pas pu être validé pour des raisons de sécurité.",
      }),
      { status: 403, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  try {
    const supabaseAdmin = createAdminClient();
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    const origin = host ? `${proto}://${host}` : (request.nextUrl.origin || "https://has-academie.online");
    const loginUrl = `${origin}/connexion`;
    const siteUrl = origin;

    // 1. Récupération et synchronisation de l'étudiant (Source primaire : auth.users)
    let targetEmail: string | null = null;
    let targetFullName: string = "Étudiant";
    let targetMatricule: string | null = null;

    try {
      const { data: authUser } = await supabaseAdmin.auth.admin.getUserById(studentId);
      if (authUser?.user) {
        targetEmail = authUser.user.email || null;
        const meta = authUser.user.user_metadata || {};
        targetFullName = meta.full_name || meta.fullName || targetEmail?.split("@")[0] || "Étudiant";
        targetMatricule = meta.matricule || null;
      }
    } catch (authErr) {
      console.warn("[AUTH-LOOKUP-WARN]", authErr);
    }

    // Vérifier également si le profil existe dans profiles pour compléter
    try {
      const { data: existingProfile } = await supabaseAdmin
        .from("profiles")
        .select("*")
        .eq("id", studentId)
        .maybeSingle();

      if (existingProfile) {
        if (existingProfile.email) targetEmail = existingProfile.email;
        if (existingProfile.full_name) targetFullName = existingProfile.full_name;
        if (existingProfile.matricule) targetMatricule = existingProfile.matricule;
      }
    } catch {}

    // 2. Mise à jour résiliente dans profiles
    const isAccepting = action === "accept";
    let updateSuccess = false;

    // Tentative 1 : avec statut_inscription et is_active
    const { data: up1, error: err1 } = await supabaseAdmin
      .from("profiles")
      .update({
        is_active: isAccepting,
        statut_inscription: isAccepting ? "valide" : "refuse",
        updated_at: new Date().toISOString(),
      })
      .eq("id", studentId)
      .select()
      .maybeSingle();

    if (up1) {
      updateSuccess = true;
      if (up1.email) targetEmail = up1.email;
      if (up1.full_name) targetFullName = up1.full_name;
      if (up1.matricule) targetMatricule = up1.matricule;
    } else if (err1) {
      console.warn("[RETRY-UPDATE-CORE-ONLY]", err1.message);
      // Tentative 2 : avec is_active uniquement (si statut_inscription n'existe pas dans le schéma)
      const { data: up2, error: err2 } = await supabaseAdmin
        .from("profiles")
        .update({
          is_active: isAccepting,
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .select()
        .maybeSingle();

      if (up2) {
        updateSuccess = true;
        if (up2.email) targetEmail = up2.email;
        if (up2.full_name) targetFullName = up2.full_name;
      }
    }

    // 3. Synchronisation obligatoire dans les métadonnées auth.users (libération du username si refusé)
    try {
      const { data: userCurrent } = await supabaseAdmin.auth.admin.getUserById(studentId);
      const currentMeta = userCurrent?.user?.user_metadata || {};

      const updatedMeta: Record<string, any> = {
        ...currentMeta,
        is_active: isAccepting,
        statut_inscription: isAccepting ? "valide" : "refuse",
      };

      if (!isAccepting) {
        if (currentMeta.username) {
          updatedMeta.original_username = currentMeta.username;
          updatedMeta.username = null;
        }
      } else {
        if (currentMeta.original_username && !currentMeta.username) {
          updatedMeta.username = currentMeta.original_username;
        }
      }

      await supabaseAdmin.auth.admin.updateUserById(studentId, {
        user_metadata: updatedMeta,
      });
      updateSuccess = true;
    } catch (authUpdateErr) {
      console.warn("[AUTH-UPDATE-WARN]", authUpdateErr);
    }

    if (!updateSuccess && !targetEmail) {
      return new NextResponse(
        renderHtmlResponse({
          success: false,
          title: "Étudiant introuvable",
          message: "Le compte de l'étudiant n'a pas pu être identifié dans la base de données HAS.",
        }),
        { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }

    // 4. Log d'audit administrateur
    try {
      await supabaseAdmin.from("audit_logs").insert({
        action: isAccepting ? "VALIDATION_INSCRIPTION_TELEGRAM_ACCEPTEE" : "VALIDATION_INSCRIPTION_TELEGRAM_REFUSEE",
        details: { student_id: studentId, email: targetEmail, matricule: targetMatricule },
        ip_address: "telegram-bot",
      });
    } catch {}

    // 5. Envoi des emails Resend avec lien direct vers le site
    if (targetEmail) {
      try {
        if (isAccepting) {
          await sendRegistrationAcceptedEmail({
            email: targetEmail,
            fullName: targetFullName,
            matricule: targetMatricule,
            loginUrl,
          });
        } else {
          await sendRegistrationRejectedEmail({
            email: targetEmail,
            fullName: targetFullName,
            siteUrl,
          });
        }
      } catch (emailErr) {
        console.warn("[TELEGRAM-RESEND-ERROR]", emailErr);
      }
    }

    if (isAccepting) {
      return new NextResponse(
        renderHtmlResponse({
          success: true,
          badgeText: "Inscription Validée",
          title: `Compte activé pour ${targetFullName}`,
          message: `L'inscription a été confirmée avec succès. L'étudiant peut dès à présent se connecter à son espace personnel. Un email de confirmation officiel contenant le lien direct vers le site lui a été expédié via Resend.`,
          adminDashboardUrl: `${origin}/admin/inscriptions`,
        }),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    } else {
      return new NextResponse(
        renderHtmlResponse({
          success: false,
          isRejection: true,
          badgeText: "Inscription Refusée",
          title: `Dossier refusé pour ${targetFullName}`,
          message: `La demande d'inscription a été marquée comme refusée. Un email explicatif a été transmis au candidat via Resend.`,
          adminDashboardUrl: `${origin}/admin/inscriptions`,
        }),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur serveur inattendue";
    return new NextResponse(
      renderHtmlResponse({
        success: false,
        title: "Erreur serveur",
        message: msg,
      }),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

function renderHtmlResponse(opts: {
  success: boolean;
  isRejection?: boolean;
  badgeText?: string;
  title: string;
  message: string;
  adminDashboardUrl?: string;
}) {
  const isOk = opts.success;
  const isRejection = opts.isRejection;
  const badgeBg = isOk ? "#ecfdf5" : isRejection ? "#fffbeb" : "#fef2f2";
  const badgeColor = isOk ? "#047857" : isRejection ? "#b45309" : "#b91c1c";

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(opts.title)} — HAS Administration</title>
  <style>
    body {
      margin: 0;
      padding: 24px;
      background-color: #0b0f14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f5f7fa;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background-color: #111821;
      border: 1px solid #263241;
      border-radius: 20px;
      padding: 36px 28px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 12px 40px rgba(0,0,0,0.5);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background-color: ${badgeBg};
      color: ${badgeColor};
      margin-bottom: 20px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      margin: 0 0 14px 0;
      color: #f5f7fa;
      line-height: 1.3;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #aab4c0;
      margin: 0 0 28px 0;
    }
    .btn {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      background-color: #0f2744;
      color: #ffffff;
      padding: 14px 20px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
      border: 1px solid #263241;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #1a385c;
    }
    .footer {
      margin-top: 24px;
      font-size: 11px;
      color: #687585;
    }
  </style>
</head>
<body>
  <div class="card">
    ${opts.badgeText ? `<div class="badge">${escapeHtml(opts.badgeText)}</div>` : ""}
    <h1>${escapeHtml(opts.title)}</h1>
    <p>${escapeHtml(opts.message)}</p>
    ${opts.adminDashboardUrl ? `<a href="${opts.adminDashboardUrl}" class="btn">Ouvrir le panneau d'administration</a>` : ""}
    <div class="footer">Halil Académie Scientifique • Validation Telegram Sécurisée</div>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
