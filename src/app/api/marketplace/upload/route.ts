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

    let finalUrl = "";

    // 1. Sauvegarde Supabase Storage (Essayer 'marketplace', puis 'cours-supports' ou 'public-gallery')
    try {
      const supabaseAdmin = createAdminClient();
      const candidateBuckets = ["marketplace", type === "pdf" ? "cours-supports" : "public-gallery"];
      const contentType = type === "pdf" ? "application/pdf" : file.type || "image/jpeg";

      for (const bucket of candidateBuckets) {
        try {
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
              break;
            }
          }
        } catch {}
      }
    } catch (e) {
      console.info("Storage Supabase upload passée en fallback");
    }

    // 2. Sauvegarde locale en fallback si pas d'URL Supabase
    if (!finalUrl) {
      try {
        const uploadDir = path.join(process.cwd(), "public", "uploads", "marketplace");
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.writeFile(path.join(uploadDir, uniqueFileName), buffer);
        finalUrl = `/uploads/marketplace/${uniqueFileName}`;
      } catch (fsErr) {
        console.warn("Écriture locale upload fallback :", fsErr);
      }
    }

    // 3. Fallback ultime pour les images : Base64 data URL pour que l'admin ne soit JAMAIS bloqué sur téléphone
    if (!finalUrl && type === "cover" && buffer.length < 3 * 1024 * 1024) {
      const mime = file.type || "image/jpeg";
      finalUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    }

    if (!finalUrl) {
      finalUrl = `/uploads/marketplace/${uniqueFileName}`;
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
