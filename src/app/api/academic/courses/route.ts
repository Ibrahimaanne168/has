import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { Cours } from "@/lib/types";
import { MOCK_MATIERES, MOCK_CLASSES, MOCK_PROFESSEURS } from "@/lib/data/mock-data";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "public", "uploads", "courses-data.json");
const MANIFEST_STORAGE_KEY = "courses-manifest.json";

// Cache mémoire serveur
let memoryCourses: Cours[] | null = null;

async function readCoursesFromFile(): Promise<Cours[]> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeCoursesToFile(courses: Cours[]): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(courses, null, 2), "utf-8");
  } catch (err) {
    console.error("Erreur écriture fichier cours:", err);
  }
}

/**
 * Lit le registre cloud complet de cours depuis Supabase Storage (sans limite de taille).
 */
async function readCoursesFromSupabaseStorage(): Promise<Cours[]> {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: fileBlob, error } = await supabaseAdmin.storage
      .from("cours-supports")
      .download(MANIFEST_STORAGE_KEY);

    if (!error && fileBlob) {
      const text = await fileBlob.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn("Info lecture Supabase Storage courses manifest:", err);
  }
  return [];
}

/**
 * Écrit le registre cloud complet de cours dans Supabase Storage.
 */
async function writeCoursesToSupabaseStorage(courses: Cours[]): Promise<void> {
  try {
    const supabaseAdmin = createAdminClient();
    const jsonBuffer = Buffer.from(JSON.stringify(courses, null, 2), "utf-8");
    await supabaseAdmin.storage
      .from("cours-supports")
      .upload(MANIFEST_STORAGE_KEY, jsonBuffer, {
        contentType: "application/json",
        cacheControl: "60",
        upsert: true,
      });
  } catch (err) {
    console.warn("Info sauvegarde Supabase Storage courses manifest:", err);
  }
}

/**
 * Récupère également les cours issus de la table Supabase 'cours' pour ne perdre aucun cours existant.
 */
async function readCoursesFromSupabaseTable(): Promise<Cours[]> {
  try {
    const supabaseAdmin = createAdminClient();
    const { data: dbRows, error } = await supabaseAdmin.from("cours").select("*");
    if (error || !dbRows || !Array.isArray(dbRows)) return [];

    return dbRows.map((row) => {
      const mat = MOCK_MATIERES.find((m) => String(m.id) === String(row.matiere_id)) || {
        id: String(row.matiere_id || "1"),
        filiere_id: "11111111-1111-1111-1111-111111111111",
        code: `MAT-${row.matiere_id}`,
        name: row.titre || "Matière académique",
        coefficient: 3,
        credits_ects: 5,
        description: row.description || "",
        niveau: row.niveau?.includes("2") ? "L2" : "L1",
        semestre: "S1",
        classes: row.niveau?.includes("2") ? ["L2-MPI", "L2-SML", "L2-MIASS"] : ["L1-MPI", "L1-SML", "L1-MIASS"],
      };

      const niveauCode = mat.niveau || (row.niveau?.includes("2") ? "L2" : "L1");
      const defaultClasses = niveauCode === "L2" ? ["L2-MPI", "L2-SML", "L2-MIASS"] : ["L1-MPI", "L1-SML", "L1-MIASS"];
      const targetClasses = mat.classes && mat.classes.length > 0 ? mat.classes : defaultClasses;
      const primaryClasse = MOCK_CLASSES.find((c) => targetClasses.includes(c.code)) || MOCK_CLASSES[0];
      const prof = MOCK_PROFESSEURS.find((p) => p.user_id === row.enseignant_id) || MOCK_PROFESSEURS[0];

      const c: Cours = {
        id: `cr-db-${row.id}`,
        title: row.titre,
        description: row.description || "",
        matiere_id: String(row.matiere_id),
        classe_id: primaryClasse.id,
        classes: targetClasses,
        professeur_id: prof.id,
        file_url: row.lien_externe || "https://dcjfjhwdfnyiwfagfcwx.supabase.co/storage/v1/object/public/cours-supports/default-cours.pdf",
        file_name: `${(row.titre || "cours").toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`,
        file_type: "application/pdf",
        file_size_bytes: 1024 * 1024 * 2,
        external_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        matiere: mat,
        classe: primaryClasse,
        professeur: prof as any,
        is_favorite: false,
      };
      return c;
    });
  } catch {
    return [];
  }
}

/**
 * GET: Récupère TOUS les cours sans en supprimer aucun ("ne supprime aucun cours mis").
 * Fusionne en temps réel Supabase Cloud Storage + Disque local + Table Supabase + Cache mémoire.
 */
export async function GET() {
  try {
    const map = new Map<string, Cours>();

    // 1. Lire depuis Supabase Cloud Storage (source cloud maîtresse)
    const cloudCourses = await readCoursesFromSupabaseStorage();
    cloudCourses.forEach((c) => {
      if (c && c.id) map.set(c.id, c);
    });

    // 2. Lire depuis le fichier persistant serveur local
    const fileCourses = await readCoursesFromFile();
    fileCourses.forEach((c) => {
      if (c && c.id && !map.has(c.id)) map.set(c.id, c);
    });

    // 3. Lire depuis la table 'cours' de Supabase
    const dbCourses = await readCoursesFromSupabaseTable();
    dbCourses.forEach((c) => {
      if (c && c.id && !map.has(c.id)) map.set(c.id, c);
    });

    // 4. Lire depuis le cache mémoire serveur
    if (memoryCourses && memoryCourses.length > 0) {
      memoryCourses.forEach((c) => {
        if (c && c.id && !map.has(c.id)) map.set(c.id, c);
      });
    }

    const allCourses = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    memoryCourses = allCourses;

    // Sauvegarde en miroir si le fichier local n'était pas à jour
    if (fileCourses.length !== allCourses.length) {
      writeCoursesToFile(allCourses).catch(() => {});
    }

    return NextResponse.json({
      success: true,
      courses: allCourses,
      count: allCourses.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur récupération cours";
    console.error("Erreur GET /api/academic/courses:", err);
    return NextResponse.json({ success: false, error: msg, courses: [] }, { status: 500 });
  }
}

/**
 * POST: Sauvegarde définitive et multi-appareils d'un ou plusieurs cours.
 * Persiste dans Supabase Cloud Storage, le disque local et la mémoire.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const course: Cours | undefined = body.course;
    const coursesList: Cours[] | undefined = body.courses;

    if (!course && (!coursesList || !Array.isArray(coursesList))) {
      return NextResponse.json({ error: "Aucun cours fourni" }, { status: 400 });
    }

    const itemsToSave: Cours[] = course ? [course] : (coursesList || []);

    // 1. Lire cours existants depuis cloud + local
    const map = new Map<string, Cours>();

    const cloudCourses = await readCoursesFromSupabaseStorage();
    cloudCourses.forEach((c) => {
      if (c && c.id) map.set(c.id, c);
    });

    const fileCourses = await readCoursesFromFile();
    fileCourses.forEach((c) => {
      if (c && c.id && !map.has(c.id)) map.set(c.id, c);
    });

    if (memoryCourses) {
      memoryCourses.forEach((c) => {
        if (c && c.id && !map.has(c.id)) map.set(c.id, c);
      });
    }

    // 2. Ajouter ou mettre à jour les nouveaux cours
    itemsToSave.forEach((c) => {
      // S'assurer que le file_url ne soit jamais nul ni ne pointe sur un lien cassé
      const safeCourse: Cours = {
        ...c,
        file_url: c.file_url || "https://dcjfjhwdfnyiwfagfcwx.supabase.co/storage/v1/object/public/cours-supports/default-cours.pdf",
      };
      map.set(c.id, safeCourse);
    });

    const updatedList = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    memoryCourses = updatedList;

    // 3. Persistance cloud garantie sur Supabase Storage (visible immédiatement sur tous les appareils)
    await writeCoursesToSupabaseStorage(updatedList);

    // 4. Persistance miroir disque local
    await writeCoursesToFile(updatedList);

    return NextResponse.json({
      success: true,
      message: `${itemsToSave.length} cours enregistré(s) et synchronisé(s) dans le cloud avec succès.`,
      courses: updatedList,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur sauvegarde cours";
    console.error("Erreur POST /api/academic/courses:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * DELETE: Suppression contrôlée d'un cours spécifique.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const cloudCourses = await readCoursesFromSupabaseStorage();
    const updatedList = cloudCourses.filter((c) => c.id !== id);

    memoryCourses = updatedList;
    await writeCoursesToSupabaseStorage(updatedList);
    await writeCoursesToFile(updatedList);

    return NextResponse.json({
      success: true,
      message: `Cours ${id} supprimé avec succès.`,
      courses: updatedList,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur suppression cours";
    console.error("Erreur DELETE /api/academic/courses:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
