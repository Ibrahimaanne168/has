import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";

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

    // Nom de fichier assaini et unique pour éviter les collisions
    const safeBaseName = path
      .basename(fileName, fileExt)
      .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
      .substring(0, 80);
    const uniqueFileName = `${Date.now()}-${safeBaseName}.pdf`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let permanentUrl = `/uploads/courses/${uniqueFileName}`;

    // 1. Sauvegarde prioritaire dans Supabase Storage (bucket 'cours-supports')
    // Garantit une disponibilité mondiale, permanente et multi-appareils (mobile, desktop, étudiants, profs)
    try {
      const supabaseAdmin = createAdminClient();
      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from("cours-supports")
        .upload(uniqueFileName, buffer, {
          contentType: "application/pdf",
          cacheControl: "31536000",
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: pubData } = supabaseAdmin.storage
          .from("cours-supports")
          .getPublicUrl(uniqueFileName);

        if (pubData && pubData.publicUrl) {
          permanentUrl = pubData.publicUrl;
        }
      } else if (uploadErr) {
        console.warn("Info Supabase Storage upload (fallback local):", uploadErr.message);
      }
    } catch (storageEx) {
      console.warn("Exception upload Supabase Storage:", storageEx);
    }

    // 2. Sauvegarde miroir sur disque local (public/uploads/courses)
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "courses");
      await fs.mkdir(uploadDir, { recursive: true });
      const fullPath = path.join(uploadDir, uniqueFileName);
      await fs.writeFile(fullPath, buffer);
    } catch (diskErr) {
      console.warn("Info écriture disque local cours:", diskErr);
    }

    return NextResponse.json({
      success: true,
      fileUrl: permanentUrl,
      fileName: fileName,
      fileSizeBytes: buffer.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur upload cours";
    console.error("Erreur upload cours:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
