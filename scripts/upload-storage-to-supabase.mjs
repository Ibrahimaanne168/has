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

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("❌ ERREUR: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local");
  process.exit(1);
}

function getLatestBackupDir() {
  const backupsRoot = path.resolve(process.cwd(), "backups");
  if (!fs.existsSync(backupsRoot)) return null;
  const dirs = fs.readdirSync(backupsRoot)
    .filter((d) => d.startsWith("supabase-backup-"))
    .map((d) => path.join(backupsRoot, d))
    .filter((d) => fs.statSync(d).isDirectory())
    .sort()
    .reverse();
  return dirs[0] || null;
}

const backupDir = getLatestBackupDir();
if (!backupDir) {
  console.error("❌ Aucun dossier de sauvegarde trouvé dans backups/");
  process.exit(1);
}

const storageDir = path.join(backupDir, "storage");
if (!fs.existsSync(storageDir)) {
  console.error("❌ Aucun dossier storage trouvé dans", backupDir);
  process.exit(1);
}

console.log("============================================================");
console.log("🚀 TÉLÉVERSEMENT AUTOMATIQUE DES FICHIERS STORAGE VERS SUPABASE");
console.log(`🌐 Cible : ${SUPABASE_URL}`);
console.log(`📁 Source : ${storageDir}`);
console.log("============================================================\n");

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function uploadAll() {
  const bucketDirs = fs.readdirSync(storageDir).filter((f) => fs.statSync(path.join(storageDir, f)).isDirectory());

  for (const bucketName of bucketDirs) {
    const bucketPath = path.join(storageDir, bucketName);
    const files = fs.readdirSync(bucketPath).filter((f) => fs.statSync(path.join(bucketPath, f)).isFile());

    console.log(`\n📦 Bucket "${bucketName}" : ${files.length} fichier(s)...`);

    // S'assurer que le bucket existe
    const { data: buckets } = await supabase.storage.listBuckets();
    const exists = (buckets || []).some((b) => b.name === bucketName || b.id === bucketName);
    if (!exists) {
      await supabase.storage.createBucket(bucketName, { public: true });
      console.log(`  ✓ Bucket "${bucketName}" créé.`);
    }

    for (const file of files) {
      const filePath = path.join(bucketPath, file);
      const fileBuffer = fs.readFileSync(filePath);
      const ext = path.extname(file).toLowerCase();
      let contentType = "application/octet-stream";
      if (ext === ".pdf") contentType = "application/pdf";
      else if (ext === ".json") contentType = "application/json";
      else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";

      const { error } = await supabase.storage.from(bucketName).upload(file, fileBuffer, {
        contentType,
        upsert: true,
      });

      if (error) {
        console.warn(`  ⚠️ Échec upload "${file}":`, error.message);
      } else {
        console.log(`  ✅ "${file}" téléversé.`);
      }
    }
  }

  console.log("\n============================================================");
  console.log("🎉 TOUS LES FICHIERS STORAGE ONT ÉTÉ ENVOYÉS AVEC SUCCÈS !");
  console.log("============================================================\n");
}

uploadAll().catch((err) => {
  console.error("❌ ERREUR:", err);
  process.exit(1);
});

