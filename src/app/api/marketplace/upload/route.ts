import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const type = (formData.get("type") as string) || "cover"; // "cover" ou "pdf"

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    const fileName = file.name;
    const fileExt = path.extname(fileName).toLowerCase();

    if (type === "pdf" && fileExt !== ".pdf") {
      return NextResponse.json({ error: "Seuls les fichiers PDF sont acceptés pour le document." }, { status: 400 });
    }

    if (type === "cover" && ![".jpg", ".jpeg", ".png", ".webp"].includes(fileExt)) {
      return NextResponse.json({ error: "Format image non supporté (.jpg, .png, .webp)." }, { status: 400 });
    }

    const safeBaseName = path
      .basename(fileName, fileExt)
      .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
      .substring(0, 60);
    const uniqueFileName = `mkt-${type}-${Date.now()}-${safeBaseName}${fileExt}`;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let finalUrl = `/uploads/marketplace/${uniqueFileName}`;

    // 1. Sauvegarde Supabase Storage
    try {
      const supabaseAdmin = createAdminClient();
      const bucket = type === "pdf" ? "cours-supports" : "public-gallery";
      const contentType = type === "pdf" ? "application/pdf" : file.type || "image/jpeg";

      const { data: uploadData, error: uploadErr } = await supabaseAdmin.storage
        .from(bucket)
        .upload(`marketplace/${uniqueFileName}`, buffer, {
          contentType,
          cacheControl: "31536000",
          upsert: true,
        });

      if (!uploadErr && uploadData) {
        const { data: pubData } = supabaseAdmin.storage
          .from(bucket)
          .getPublicUrl(`marketplace/${uniqueFileName}`);

        if (pubData && pubData.publicUrl) {
          finalUrl = pubData.publicUrl;
        }
      }
    } catch (e) {
      console.info("Storage remote skipped, using local fallback");
    }

    // 2. Sauvegarde locale en fallback
    try {
      const uploadDir = path.join(process.cwd(), "public", "uploads", "marketplace");
      await fs.mkdir(uploadDir, { recursive: true });
      await fs.writeFile(path.join(uploadDir, uniqueFileName), buffer);
    } catch (fsErr) {
      console.warn("Écriture locale upload fallback :", fsErr);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      fileName: uniqueFileName,
      originalName: fileName,
    });
  } catch (err: unknown) {
    console.error("Upload marketplace error:", err);
    return NextResponse.json({ error: "Échec de l'upload" }, { status: 500 });
  }
}
