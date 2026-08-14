"use server";

import { revalidatePath } from "next/cache";
import { query, queryOne } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// ==========================================
// 1. FILIERES, CLASSES & MATIERES
// ==========================================

export async function createFiliereAction(formData: FormData): Promise<void> {
  const nom = formData.get("nom")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  if (!nom) return;

  await query(`INSERT INTO filieres (nom, description) VALUES ($1, $2)`, [nom, description]);
  revalidatePath("/admin/filieres");
}

export async function deleteFiliereAction(id: number): Promise<void> {
  await query(`DELETE FROM filieres WHERE id = $1`, [id]);
  revalidatePath("/admin/filieres");
}

export async function createClasseAction(formData: FormData): Promise<void> {
  const nom = formData.get("nom")?.toString().trim();
  const niveau = formData.get("niveau")?.toString().trim() || null;
  const filiere_id = parseInt(formData.get("filiere_id")?.toString() || "0", 10);
  if (!nom || !filiere_id) return;

  await query(`INSERT INTO classes (filiere_id, nom, niveau) VALUES ($1, $2, $3)`, [filiere_id, nom, niveau]);
  revalidatePath("/admin/filieres");
}

export async function deleteClasseAction(id: number): Promise<void> {
  await query(`DELETE FROM classes WHERE id = $1`, [id]);
  revalidatePath("/admin/filieres");
}

export async function createMatiereAction(formData: FormData): Promise<void> {
  const nom = formData.get("nom")?.toString().trim();
  const classeIds = formData.getAll("classes").map((c) => parseInt(c.toString(), 10)).filter(Boolean);
  if (!nom) return;

  const res = await queryOne<{ id: number }>(
    `INSERT INTO matieres (nom) VALUES ($1) RETURNING id`,
    [nom]
  );

  if (res?.id && classeIds.length > 0) {
    for (const cId of classeIds) {
      await query(`INSERT INTO matiere_classe (matiere_id, classe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [res.id, cId]);
    }
  }

  revalidatePath("/admin/filieres");
}

export async function deleteMatiereAction(id: number): Promise<void> {
  await query(`DELETE FROM matieres WHERE id = $1`, [id]);
  revalidatePath("/admin/filieres");
}

// ==========================================
// 2. ENSEIGNANTS
// ==========================================

export async function createEnseignantAction(formData: FormData): Promise<void> {
  const nom = formData.get("nom")?.toString().trim();
  const prenom = formData.get("prenom")?.toString().trim();
  const login = formData.get("login")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString() || "123456";
  const telephone = formData.get("telephone")?.toString().trim() || null;
  const biographie = formData.get("biographie")?.toString().trim() || null;
  const filiere_id = parseInt(formData.get("filiere_id")?.toString() || "0", 10) || null;
  const matieresIds = formData.getAll("matieres").map((m) => parseInt(m.toString(), 10)).filter(Boolean);
  const filieresIds = formData.getAll("filieres").map((f) => parseInt(f.toString(), 10)).filter(Boolean);

  if (!nom || !prenom || !login) return;

  const existing = await queryOne(`SELECT id FROM users WHERE LOWER(login) = LOWER($1)`, [login]);
  if (existing) return;

  const hashed = hashPassword(password);
  const userRes = await queryOne<{ id: number }>(
    `INSERT INTO users (role_id, login, password_hash, nom, prenom, telephone) 
     VALUES (2, $1, $2, $3, $4, $5) RETURNING id`,
    [login, hashed, nom, prenom, telephone]
  );

  if (userRes?.id) {
    const ensRes = await queryOne<{ id: number }>(
      `INSERT INTO enseignants (user_id, filiere_id, biographie) VALUES ($1, $2, $3) RETURNING id`,
      [userRes.id, filiere_id, biographie]
    );

    if (ensRes?.id) {
      for (const mId of matieresIds) {
        await query(`INSERT INTO enseignant_matiere (enseignant_id, matiere_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [ensRes.id, mId]);
      }
      for (const fId of filieresIds) {
        await query(`INSERT INTO enseignant_filiere (enseignant_id, filiere_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [ensRes.id, fId]);
      }
    }
  }

  revalidatePath("/admin/enseignants");
}

export async function deleteEnseignantAction(userId: number): Promise<void> {
  await query(`DELETE FROM users WHERE id = $1`, [userId]);
  revalidatePath("/admin/enseignants");
}

// ==========================================
// 3. ETUDIANTS
// ==========================================

export async function createEtudiantAction(formData: FormData): Promise<void> {
  const nom = formData.get("nom")?.toString().trim();
  const prenom = formData.get("prenom")?.toString().trim();
  const login = formData.get("login")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString() || "123456";
  const telephone = formData.get("telephone")?.toString().trim() || null;
  const classe_id = parseInt(formData.get("classe_id")?.toString() || "0", 10);
  const filiere_id = parseInt(formData.get("filiere_id")?.toString() || "0", 10);
  let matricule = formData.get("matricule")?.toString().trim();

  if (!nom || !prenom || !login || !classe_id || !filiere_id) {
    return;
  }

  const existing = await queryOne(`SELECT id FROM users WHERE LOWER(login) = LOWER($1)`, [login]);
  if (existing) return;

  if (!matricule) {
    const count = await queryOne<{ c: string }>(`SELECT COUNT(*) as c FROM etudiants`);
    const nextNum = parseInt(count?.c || "0", 10) + 1;
    matricule = nextNum.toString().padStart(4, "0");
  }

  const hashed = hashPassword(password);
  const userRes = await queryOne<{ id: number }>(
    `INSERT INTO users (role_id, login, password_hash, nom, prenom, telephone) 
     VALUES (3, $1, $2, $3, $4, $5) RETURNING id`,
    [login, hashed, nom, prenom, telephone]
  );

  if (userRes?.id) {
    await query(
      `INSERT INTO etudiants (user_id, filiere_id, classe_id, matricule) VALUES ($1, $2, $3, $4)`,
      [userRes.id, filiere_id, classe_id, matricule]
    );
  }

  revalidatePath("/admin/etudiants");
}

export async function deleteEtudiantAction(userId: number): Promise<void> {
  await query(`DELETE FROM users WHERE id = $1`, [userId]);
  revalidatePath("/admin/etudiants");
}

// ==========================================
// 4. COMMUNIQUES & MESSAGES
// ==========================================

export async function createCommuniqueAction(auteurId: number, formData: FormData): Promise<void> {
  const titre = formData.get("titre")?.toString().trim();
  const contenu = formData.get("contenu")?.toString().trim();
  const mis_en_avant = formData.get("mis_en_avant") === "on";

  if (!titre || !contenu) return;

  await query(
    `INSERT INTO communiques (titre, contenu, auteur_id, mis_en_avant, archive, date_publication) 
     VALUES ($1, $2, $3, $4, FALSE, CURRENT_DATE)`,
    [titre, contenu, auteurId, mis_en_avant]
  );

  revalidatePath("/admin/communiques");
}

export async function deleteCommuniqueAction(id: number): Promise<void> {
  await query(`DELETE FROM communiques WHERE id = $1`, [id]);
  revalidatePath("/admin/communiques");
}
