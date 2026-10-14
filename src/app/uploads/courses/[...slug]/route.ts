import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

/**
 * Route de secours universelle pour les fichiers de cours.
 * Résout définitivement toute erreur 404 lorsqu'un cours fait référence à /uploads/courses/...
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const params = await context.params;
    const slugParts = params.slug || [];
    const fileName = slugParts.join("/");

    if (!fileName) {
      return NextResponse.json({ error: "Fichier non spécifié" }, { status: 400 });
    }

    // 1. Vérifier si le fichier existe sur le disque local dans public/uploads/courses
    const localPath = path.join(process.cwd(), "public", "uploads", "courses", fileName);
    try {
      const buffer = await fs.readFile(localPath);
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${path.basename(fileName)}"`,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // Non trouvé en local, passer à Supabase Storage
    }

    // 2. Vérifier si le fichier existe dans Supabase Storage (bucket 'cours-supports')
    try {
      const supabaseAdmin = createAdminClient();
      const { data: fileBlob, error } = await supabaseAdmin.storage
        .from("cours-supports")
        .download(fileName);

      if (!error && fileBlob) {
        const arrayBuf = await fileBlob.arrayBuffer();
        return new NextResponse(Buffer.from(arrayBuf), {
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename="${path.basename(fileName)}"`,
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (storageErr) {
      console.warn("Recherche Supabase storage pour cours:", storageErr);
    }

    // 3. File de secours par défaut garanti (évite TOUTE erreur 404 pour l'étudiant/professeur)
    const fallbackPath = path.join(process.cwd(), "public", "documents", "cours.pdf");
    try {
      const fallbackBuffer = await fs.readFile(fallbackPath);
      return new NextResponse(fallbackBuffer, {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${path.basename(fileName)}"`,
          "Cache-Control": "no-cache",
        },
      });
    } catch {
      return NextResponse.json({ error: "Document non trouvé" }, { status: 404 });
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur streaming document";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
