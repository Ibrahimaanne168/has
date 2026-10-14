import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { Cours } from "@/lib/types";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "public", "uploads", "courses-data.json");

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
 * GET: Récupère tous les cours officiels enregistrés de manière persistante (Supabase + Serveur).
 * Permet à tout appareil (professeur sur PC/mobile, étudiant) de récupérer instantanément tous les cours.
 */
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const map = new Map<string, Cours>();

    // 1. Lire depuis le fichier persistant serveur
    const fileCourses = await readCoursesFromFile();
    fileCourses.forEach((c) => {
      if (c && c.id) map.set(c.id, c);
    });

    // 2. Lire depuis le cache mémoire serveur
    if (memoryCourses && memoryCourses.length > 0) {
      memoryCourses.forEach((c) => {
        if (c && c.id) map.set(c.id, c);
      });
    }

    // 3. Lire depuis Supabase logs (actions 'COURSE:%')
    try {
      const { data: logRows } = await supabaseAdmin
        .from("logs")
        .select("action, description, created_at")
        .like("action", "COURSE:%");

      if (logRows && Array.isArray(logRows)) {
        for (const row of logRows) {
          try {
            if (row.description && row.description.trim()) {
              const parsedCourse: Cours = JSON.parse(row.description);
              if (parsedCourse && parsedCourse.id) {
                map.set(parsedCourse.id, parsedCourse);
              }
            }
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Info lecture Supabase logs cours:", err);
    }

    // 4. Lire également les suppressions éventuelles
    try {
      const { data: delRows } = await supabaseAdmin
        .from("logs")
        .select("action")
        .like("action", "DEL_COURSE:%");

      if (delRows && Array.isArray(delRows)) {
        for (const r of delRows) {
          const delId = r.action.replace("DEL_COURSE:", "");
          map.delete(delId);
        }
      }
    } catch {}

    const allCourses = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    memoryCourses = allCourses;

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
 * POST: Sauvegarde définitive d'un ou plusieurs cours sur le serveur et dans Supabase.
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
    const supabaseAdmin = createAdminClient();

    // 1. Lire cours existants
    const existing = await readCoursesFromFile();
    const map = new Map<string, Cours>();
    existing.forEach((c) => map.set(c.id, c));
    if (memoryCourses) {
      memoryCourses.forEach((c) => map.set(c.id, c));
    }

    // 2. Mettre à jour avec les nouveaux cours
    itemsToSave.forEach((c) => {
      map.set(c.id, c);
    });

    const updatedList = Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    memoryCourses = updatedList;
    await writeCoursesToFile(updatedList);

    // 3. Sauvegarder dans Supabase PostgreSQL pour persistance multi-appareils
    for (const item of itemsToSave) {
      try {
        // Enlever les éventuels anciens logs de ce cours pour éviter les doublons
        await supabaseAdmin.from("logs").delete().eq("action", `COURSE:${item.id}`);
        await supabaseAdmin.from("logs").delete().eq("action", `DEL_COURSE:${item.id}`);

        // Insérer le cours sérialisé
        // Si le cours a un fichier base64 lourd, on ne met pas le base64 dans Supabase logs pour ne pas exploser la table
        // S'il s'agit d'une URL HTTP (/uploads/courses/...), c'est très compact (< 1 Ko)
        const itemForSupabase: Cours = { ...item };
        if (itemForSupabase.file_url && itemForSupabase.file_url.startsWith("data:")) {
          // On évite de saturer le log avec des megabytes de base64
          itemForSupabase.file_url = itemForSupabase.file_url.substring(0, 500);
        }

        await supabaseAdmin.from("logs").insert({
          action: `COURSE:${item.id}`,
          description: JSON.stringify(itemForSupabase),
        });
      } catch (err) {
        console.warn(`Erreur sauvegarde Supabase log pour cours ${item.id}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `${itemsToSave.length} cours enregistré(s) et synchronisé(s) avec succès.`,
      courses: updatedList,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur sauvegarde cours";
    console.error("Erreur POST /api/academic/courses:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

/**
 * DELETE: Supprime un cours de façon permanente sur le serveur et dans Supabase.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID du cours requis" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();

    // 1. Mettre à jour fichier local et mémoire
    const existing = await readCoursesFromFile();
    const updatedList = existing.filter((c) => c.id !== id);
    memoryCourses = updatedList;
    await writeCoursesToFile(updatedList);

    // 2. Mettre à jour Supabase
    try {
      await supabaseAdmin.from("logs").delete().eq("action", `COURSE:${id}`);
      await supabaseAdmin.from("logs").insert({
        action: `DEL_COURSE:${id}`,
        description: "deleted",
      });
    } catch (err) {
      console.warn("Erreur suppression log Supabase cours:", err);
    }

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
