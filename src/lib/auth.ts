import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { queryOne } from "./db";
import { User } from "./types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SECRET_KEY || "has-super-secret-key-production-2026"
);

const COOKIE_NAME = "has_session";

export interface SessionPayload {
  userId: number;
  login: string;
  nom: string;
  prenom: string;
  roleId: number;
  roleName: "admin" | "enseignant" | "etudiant";
}

/**
 * Vérifie un mot de passe contre un hash Werkzeug scrypt ou bcrypt
 */
export function verifyPassword(plainPassword: string, storedHash: string): boolean {
  if (!storedHash || !plainPassword) return false;

  // Format Werkzeug: scrypt:32768:8:1$salt$hash
  if (storedHash.startsWith("scrypt:")) {
    try {
      const parts = storedHash.split("$");
      if (parts.length === 3) {
        const [, paramsStr] = parts[0].split(":"); // 32768:8:1
        const [N, r, p] = paramsStr.split(":").map(Number);
        const salt = parts[1];
        const expectedHex = parts[2];

        const derivedKey = crypto.scryptSync(plainPassword, salt, expectedHex.length / 2, {
          N: N || 32768,
          r: r || 8,
          p: p || 1,
          maxmem: 64 * 1024 * 1024,
        });

        return crypto.timingSafeEqual(Buffer.from(derivedKey.toString("hex")), Buffer.from(expectedHex));
      }
    } catch (e) {
      console.error("Scrypt verification error:", e);
    }
  }

  // Format Bcrypt: $2a$... ou $2b$...
  if (storedHash.startsWith("$2")) {
    try {
      return bcrypt.compareSync(plainPassword, storedHash);
    } catch (e) {
      console.error("Bcrypt verification error:", e);
    }
  }

  // Fallback direct
  return plainPassword === storedHash;
}

/**
 * Hash un mot de passe avec bcrypt pour les nouveaux utilisateurs
 */
export function hashPassword(plainPassword: string): string {
  return bcrypt.hashSync(plainPassword, 10);
}

/**
 * Crée un token JWT de session
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

/**
 * Récupère et vérifie la session actuelle
 */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Définit le cookie de session
 */
export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 jours
  });
}

/**
 * Supprime le cookie de session (déconnexion)
 */
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Récupère l'utilisateur complet en base
 */
export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  if (!session) return null;

  return await queryOne<User>(
    `SELECT u.id, u.role_id, u.login, u.nom, u.prenom, u.telephone, u.photo, r.nom as role_name 
     FROM users u 
     JOIN roles r ON r.id = u.role_id 
     WHERE u.id = $1`,
    [session.userId]
  );
}
