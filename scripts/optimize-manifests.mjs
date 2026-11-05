import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

function loadEnvLocal() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, "utf-8");
  const env = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      env[key] = val;
    }
  }
  return env;
}

const env = loadEnvLocal();
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function optimize() {
  console.log("🔍 Analyse et optimisation de courses-manifest.json...");

  const { data: blob, error } = await supabase.storage
    .from("cours-supports")
    .download("courses-manifest.json");

  if (error || !blob) {
    console.error("❌ Impossible de télécharger courses-manifest.json:", error?.message);
    return;
  }

  const text = await blob.text();
  const originalSize = Buffer.byteLength(text);
  console.log(`📊 Taille actuelle sur Supabase Storage : ${(originalSize / 1024 / 1024).toFixed(2)} Mo`);

  const courses = JSON.parse(text);
  const uploadDir = path.join(process.cwd(), "public", "uploads", "courses");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  let extractedPdfs = 0;

  const cleanedCourses = courses.map((c) => {
    const item = { ...c };

    // Si file_url contient un PDF base64 volumineux, l'extraire sur disque et remplacer par l'URL propre
    if (item.file_url && item.file_url.startsWith("data:application/pdf;base64,")) {
      try {
        const base64Data = item.file_url.split(";base64,").pop();
        const buffer = Buffer.from(base64Data, "base64");
        const cleanName = `extracted-${item.id || Date.now()}.pdf`;
        const localPath = path.join(uploadDir, cleanName);
        fs.writeFileSync(localPath, buffer);
        item.file_url = `/uploads/courses/${cleanName}`;
        extractedPdfs++;
        console.log(`  -> PDF extrait sur disque : ${cleanName} (${(buffer.length / 1024).toFixed(1)} Ko)`);
      } catch (err) {
        console.warn("Erreur extraction base64:", err.message);
      }
    }

    // Nettoyer les avatars volumineux stockés en base64 dans professeur
    if (item.professeur) {
      const prof = { ...item.professeur };
      if (prof.avatar_url && prof.avatar_url.startsWith("data:")) prof.avatar_url = null;
      if (prof.photo && prof.photo.startsWith("data:")) prof.photo = null;
      item.professeur = prof;
    }

    // Nettoyer dans matiere.professeur
    if (item.matiere && item.matiere.professeur) {
      const prof = { ...item.matiere.professeur };
      if (prof.avatar_url && prof.avatar_url.startsWith("data:")) prof.avatar_url = null;
      if (prof.photo && prof.photo.startsWith("data:")) prof.photo = null;
      item.matiere = { ...item.matiere, professeur: prof };
    }

    return item;
  });

  const cleanedJson = JSON.stringify(cleanedCourses, null, 2);
  const newSize = Buffer.byteLength(cleanedJson);
  console.log(`✨ Nouvelle taille optimisée : ${(newSize / 1024).toFixed(1)} Ko (-${(((originalSize - newSize) / originalSize) * 100).toFixed(1)}% de données en moins !)`);

  // Sauvegarder en local
  const localDataFile = path.join(process.cwd(), "public", "uploads", "courses-data.json");
  fs.writeFileSync(localDataFile, cleanedJson, "utf-8");

  // Téléverser la version allégée sur Supabase Storage
  console.log("⬆️ Téléversement de la version allégée sur Supabase Storage...");
  const { error: upErr } = await supabase.storage
    .from("cours-supports")
    .upload("courses-manifest.json", Buffer.from(cleanedJson, "utf-8"), {
      contentType: "application/json",
      cacheControl: "3600",
      upsert: true,
    });

  if (upErr) {
    console.error("❌ Erreur upload version allégée:", upErr.message);
  } else {
    console.log("✅ courses-manifest.json allégé avec succès sur Supabase Storage !");
  }
}

optimize().catch((err) => console.error("Fatal:", err));

