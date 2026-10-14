import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const fileName = file.name;
    const fileExt = path.extname(fileName).toLowerCase();

    if (fileExt !== ".pdf") {
      return NextResponse.json(
        { error: "Format non autorisé. Seuls les fichiers PDF sont acceptés." },
        { status: 400 }
      );
    }

    // Répertoire cible public/uploads/courses
    const uploadDir = path.join(process.cwd(), "public", "uploads", "courses");
    await fs.mkdir(uploadDir, { recursive: true });

    // Nom de fichier assaini et unique pour éviter les collisions
    const safeBaseName = path
      .basename(fileName, fileExt)
      .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
      .substring(0, 80);
    const uniqueFileName = `${Date.now()}-${safeBaseName}.pdf`;
    const fullPath = path.join(uploadDir, uniqueFileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(fullPath, buffer);

    const publicUrl = `/uploads/courses/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      fileUrl: publicUrl,
      fileName: fileName,
      fileSizeBytes: buffer.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur upload cours";
    console.error("Erreur upload cours:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
