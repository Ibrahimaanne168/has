"use server";

import { redirect } from "next/navigation";
import { queryOne } from "@/lib/db";
import { verifyPassword, setSessionCookie, clearSessionCookie } from "@/lib/auth";

export interface LoginResult {
  success: boolean;
  error?: string;
  redirectTo?: string;
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
      role_name: "admin" | "enseignant" | "etudiant";
    }>(
      `SELECT u.id, u.role_id, u.login, u.password_hash, u.nom, u.prenom, r.nom as role_name 
       FROM users u 
       JOIN roles r ON r.id = u.role_id 
       WHERE LOWER(u.login) = LOWER($1)`,
      [login]
    );

    if (!user || !verifyPassword(password, user.password_hash)) {
      return { success: false, error: "Identifiant ou mot de passe incorrect." };
    }

    // Créer la session
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

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
