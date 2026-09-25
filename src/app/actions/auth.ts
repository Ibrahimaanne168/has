"use server";

import { redirect } from "next/navigation";
import { query, queryOne } from "@/lib/db";
import { verifyPassword, setSessionCookie, clearSessionCookie, getCurrentUser } from "@/lib/auth";
import { sendTwoFactorCodeEmail } from "@/lib/mail";

export interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
  requires2FA?: boolean;
  userId?: number;
  maskedEmail?: string;
}

function maskEmail(email?: string): string {
  if (!email) return "votre adresse email";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const maskedName = name.length > 2 ? `${name[0]}***${name[name.length - 1]}` : `${name[0]}***`;
  return `${maskedName}@${domain}`;
}

export async function loginAction(formData: FormData): Promise<LoginResult> {
  const login = formData.get("login")?.toString().trim();
  const password = formData.get("password")?.toString();

  if (!login || !password) {
    return { success: false, error: "Veuillez renseigner votre identifiant et votre mot de passe." };
  }

  try {
    const user = await queryOne<{
      id: number;
      role_id: number;
      login: string;
      password_hash: string;
      nom: string;
      prenom: string;
      email?: string;
      role_name: "admin" | "enseignant" | "etudiant";
      two_factor_enabled?: boolean;
    }>(
      `SELECT u.id, u.role_id, u.login, u.password_hash, u.nom, u.prenom, u.email, u.two_factor_enabled, r.nom as role_name 
       FROM users u 
       JOIN roles r ON r.id = u.role_id 
       WHERE LOWER(u.login) = LOWER($1)`,
      [login]
    );

    if (!user || !verifyPassword(password, user.password_hash)) {
      return { success: false, error: "Identifiant ou mot de passe incorrect." };
    }

    // Si le 2FA est activé sur le compte
    if (user.two_factor_enabled) {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await query(
        `UPDATE users SET two_factor_code = $1, two_factor_expires_at = $2 WHERE id = $3`,
        [code, expiresAt, user.id]
      );

      // Envoi du mail Resend
      const targetEmail = user.email || `${user.login}@has.sn`;
      await sendTwoFactorCodeEmail(targetEmail, code, `${user.prenom} ${user.nom}`);

      return {
        success: true,
        requires2FA: true,
        userId: user.id,
        maskedEmail: maskEmail(targetEmail),
      };
    }

    // Connexion directe sans 2FA
    await setSessionCookie({
      userId: user.id,
      login: user.login,
      nom: user.nom,
      prenom: user.prenom,
      roleId: user.role_id,
      roleName: user.role_name,
    });

    let redirectTo = "/etudiant/dashboard";
    if (user.role_id === 1) redirectTo = "/admin/dashboard";
    else if (user.role_id === 2) redirectTo = "/professeur/dashboard";

    return { success: true, redirectTo };
  } catch (error) {
    console.error("Login action error:", error);
    return { success: false, error: "Une erreur est survenue lors de la connexion. Veuillez réessayer." };
  }
}

export async function verifyTwoFactorAction(userId: number, code: string): Promise<LoginResult> {
  if (!userId || !code) {
    return { success: false, error: "Veuillez saisir le code à 6 chiffres." };
  }

  try {
    const user = await queryOne<{
      id: number;
      role_id: number;
      login: string;
      nom: string;
      prenom: string;
      two_factor_code?: string;
      two_factor_expires_at?: Date;
      role_name: "admin" | "enseignant" | "etudiant";
    }>(
      `SELECT u.id, u.role_id, u.login, u.nom, u.prenom, u.two_factor_code, u.two_factor_expires_at, r.nom as role_name 
       FROM users u 
       JOIN roles r ON r.id = u.role_id 
       WHERE u.id = $1`,
      [userId]
    );

    if (!user || !user.two_factor_code) {
      return { success: false, error: "Session 2FA introuvable ou expirée. Veuillez vous reconnecter." };
    }

    const now = new Date();
    const expiresAt = user.two_factor_expires_at ? new Date(user.two_factor_expires_at) : null;

    if (!expiresAt || now > expiresAt) {
      return { success: false, error: "Le code de sécurité a expiré. Veuillez en demander un nouveau." };
    }

    if (user.two_factor_code.trim() !== code.trim()) {
      return { success: false, error: "Code de sécurité incorrect. Vérifiez votre boîte mail." };
    }

    // Code valide : nettoyage du code et création de la session
    await query(
      `UPDATE users SET two_factor_code = NULL, two_factor_expires_at = NULL WHERE id = $1`,
      [user.id]
    );

    await setSessionCookie({
      userId: user.id,
      login: user.login,
      nom: user.nom,
      prenom: user.prenom,
      roleId: user.role_id,
      roleName: user.role_name,
    });

    let redirectTo = "/etudiant/dashboard";
    if (user.role_id === 1) redirectTo = "/admin/dashboard";
    else if (user.role_id === 2) redirectTo = "/professeur/dashboard";

    return { success: true, redirectTo };
  } catch (error) {
    console.error("Erreur vérification 2FA:", error);
    return { success: false, error: "Erreur lors de la validation du code." };
  }
}

export async function resendTwoFactorCodeAction(userId: number): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await queryOne<{
      id: number;
      login: string;
      nom: string;
      prenom: string;
      email?: string;
    }>(`SELECT id, login, nom, prenom, email FROM users WHERE id = $1`, [userId]);

    if (!user) return { success: false, error: "Utilisateur introuvable" };

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await query(
      `UPDATE users SET two_factor_code = $1, two_factor_expires_at = $2 WHERE id = $3`,
      [code, expiresAt, user.id]
    );

    const targetEmail = user.email || `${user.login}@has.sn`;
    await sendTwoFactorCodeEmail(targetEmail, code, `${user.prenom} ${user.nom}`);

    return { success: true };
  } catch (e: any) {
    return { success: false, error: "Impossible de renvoyer le code." };
  }
}

export async function toggleTwoFactorAction(enabled: boolean, email?: string): Promise<{ success: boolean; error?: string }> {
  const currentUser = await getCurrentUser();
  if (!currentUser) return { success: false, error: "Non connecté" };

  try {
    if (enabled && email) {
      await query(`UPDATE users SET two_factor_enabled = TRUE, email = $1 WHERE id = $2`, [email.trim(), currentUser.id]);
    } else {
      await query(`UPDATE users SET two_factor_enabled = $1 WHERE id = $2`, [enabled, currentUser.id]);
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: "Erreur lors de la mise à jour du 2FA." };
  }
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
