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

    if (action === "accept") {
      const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({
          is_active: true,
          statut_inscription: "valide",
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .select()
        .maybeSingle();

      if (error || !updated) {
        return new NextResponse(
          renderHtmlResponse({
            success: false,
            title: "Erreur de validation",
            message: "Impossible de mettre à jour le profil de l'étudiant en base de données.",
          }),
          { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }

      // Log d'audit
      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "VALIDATION_INSCRIPTION_TELEGRAM_ACCEPTEE",
          details: { student_id: studentId, email: updated.email, matricule: updated.matricule },
          ip_address: "telegram-bot",
        });
      } catch {}

      // Envoi email Resend de confirmation
      if (updated.email) {
        try {
          await sendRegistrationAcceptedEmail({
            email: updated.email,
            fullName: updated.full_name || "Étudiant",
            matricule: updated.matricule,
            loginUrl,
          });
        } catch (emailErr) {
          console.warn("[TELEGRAM-ACCEPT-RESEND-ERROR]", emailErr);
        }
      }

      return new NextResponse(
        renderHtmlResponse({
          success: true,
          badgeText: "Inscription Validée",
          title: `Compte activé pour ${updated.full_name || "l'étudiant"}`,
          message: `L'inscription a été confirmée avec succès. L'étudiant peut dès à présent se connecter à son espace personnel. Un email de confirmation avec le lien direct lui a été expédié via Resend.`,
          adminDashboardUrl: `${origin}/admin/comptes`,
        }),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    } else {
      const { data: updated, error } = await supabaseAdmin
        .from("profiles")
        .update({
          is_active: false,
          statut_inscription: "refuse",
          updated_at: new Date().toISOString(),
        })
        .eq("id", studentId)
        .select()
        .maybeSingle();

      if (error || !updated) {
        return new NextResponse(
          renderHtmlResponse({
            success: false,
            title: "Erreur de refus",
            message: "Impossible de modifier le statut de l'étudiant.",
          }),
          { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
        );
      }

      // Log d'audit
      try {
        await supabaseAdmin.from("audit_logs").insert({
          action: "VALIDATION_INSCRIPTION_TELEGRAM_REFUSEE",
          details: { student_id: studentId, email: updated.email, matricule: updated.matricule },
          ip_address: "telegram-bot",
        });
      } catch {}

      // Envoi email Resend d'information
      if (updated.email) {
        try {
          await sendRegistrationRejectedEmail({
            email: updated.email,
            fullName: updated.full_name || "Candidat",
            siteUrl,
          });
        } catch (emailErr) {
          console.warn("[TELEGRAM-REJECT-RESEND-ERROR]", emailErr);
        }
      }

      return new NextResponse(
        renderHtmlResponse({
          success: false,
          isRejection: true,
          badgeText: "Inscription Refusée",
          title: `Dossier refusé pour ${updated.full_name || "le candidat"}`,
          message: `La demande d'inscription a été marquée comme refusée. Un email explicatif a été transmis au candidat via Resend.`,
          adminDashboardUrl: `${origin}/admin/comptes`,
        }),
        { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur serveur";
    return new NextResponse(
      renderHtmlResponse({
        success: false,
        title: "Erreur inattendue",
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
  const themeColor = isOk ? "#059669" : isRejection ? "#d97706" : "#dc2626";
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
      max-width: 460px;
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
