import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

// 1. Lire .env.local manuellement pour ne pas dépendre de packages externes
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
  console.error("❌ ERREUR: URL Supabase ou SUPABASE_SERVICE_ROLE_KEY manquante dans .env.local");
  process.exit(1);
}

console.log("============================================================");
console.log("🚀 DÉMARRAGE DE LA SAUVEGARDE COMPLÈTE SUPABASE (HAS)");
console.log(`🌐 URL Cible : ${SUPABASE_URL}`);
console.log("============================================================\n");

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Création du dossier d'export
const now = new Date();
const timestamp = now.toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupDir = path.resolve(process.cwd(), "backups", `supabase-backup-${timestamp}`);
const dataDir = path.join(backupDir, "tables-json");
const sqlDir = path.join(backupDir, "tables-sql");
const authDir = path.join(backupDir, "auth");
const storageDir = path.join(backupDir, "storage");

[backupDir, dataDir, sqlDir, authDir, storageDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Convertir un tableau d'objets en requêtes SQL INSERT
function generateSqlInserts(tableName, rows) {
  if (!rows || rows.length === 0) return `-- Table ${tableName} vide\n`;
  const columns = Object.keys(rows[0]);
  const colList = columns.map((c) => `"${c}"`).join(", ");

  let sql = `-- ============================================================\n`;
  sql += `-- Données sauvegardées pour : ${tableName} (${rows.length} lignes)\n`;
  sql += `-- ============================================================\n\n`;

  for (const row of rows) {
    const vals = columns.map((col) => {
      const val = row[col];
      if (val === null || val === undefined) return "NULL";
      if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
      if (typeof val === "number") return val;
      if (typeof val === "object") {
        return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      }
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    sql += `INSERT INTO "${tableName}" (${colList}) VALUES (${vals.join(", ")}) ON CONFLICT DO NOTHING;\n`;
  }
  return sql;
}

// Découverte de toutes les tables via l'OpenAPI PostgREST
async function discoverTables() {
  const discovered = new Set();
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    });
    if (res.ok) {
      const spec = await res.json();
      if (spec?.definitions) {
        Object.keys(spec.definitions).forEach((t) => discovered.add(t));
      }
      if (spec?.paths) {
        Object.keys(spec.paths).forEach((p) => {
          const clean = p.replace(/^\//, "").split("/")[0];
          if (clean && clean !== "rpc") discovered.add(clean);
        });
      }
    }
  } catch (err) {
    console.warn("⚠️ OpenAPI discovery non disponible:", err.message);
  }

  // Liste de vérification complémentaire de sécurité (schémas HAS)
  const candidateTables = [
    "profiles",
    "verification_codes",
    "audit_logs",
    "users",
    "utilisateurs",
    "roles",
    "filieres",
    "filiere",
    "classes",
    "matieres",
    "cours",
    "salles",
    "notes",
    "messages",
    "contact_messages",
    "enseignants",
    "enseignant_matiere",
    "enseignant_filiere",
    "matiere_classe",
    "favoris_cours",
  ];
  candidateTables.forEach((t) => discovered.add(t));

  return Array.from(discovered);
}

async function exportAuthUsers() {
  console.log("📦 1. Sauvegarde des comptes utilisateurs Supabase Auth...");
  const allUsers = [];
  let page = 1;
  const perPage = 1000;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      console.error("❌ Erreur récupération auth users:", error.message);
      break;
    }
    if (!data?.users || data.users.length === 0) break;
    allUsers.push(...data.users);
    if (data.users.length < perPage) break;
    page++;
  }

  fs.writeFileSync(
    path.join(authDir, "users.json"),
    JSON.stringify(allUsers, null, 2),
    "utf-8"
  );

  console.log(`✅ ${allUsers.length} comptes utilisateurs auth exportés dans auth/users.json\n`);
  return allUsers.length;
}

async function exportTable(tableName) {
  try {
    const allRows = [];
    const pageSize = 1000;
    let offset = 0;

    while (true) {
      const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .range(offset, offset + pageSize - 1);

      if (error) {
        // Table inexistante ou inaccessible
        return null;
      }
      if (!data || data.length === 0) break;
      allRows.push(...data);
      if (data.length < pageSize) break;
      offset += pageSize;
    }

    fs.writeFileSync(
      path.join(dataDir, `${tableName}.json`),
      JSON.stringify(allRows, null, 2),
      "utf-8"
    );

    const sqlContent = generateSqlInserts(tableName, allRows);
    fs.writeFileSync(path.join(sqlDir, `${tableName}.sql`), sqlContent, "utf-8");

    console.log(`✅ Table "${tableName}": ${allRows.length} lignes sauvegardées`);
    return { name: tableName, count: allRows.length, exists: true };
  } catch {
    return null;
  }
}

async function exportStorage() {
  console.log("\n📦 3. Sauvegarde des fichiers Stockage (Storage)...");
  let totalFiles = 0;
  try {
    const { data: buckets, error } = await supabase.storage.listBuckets();
    if (error || !buckets) {
      console.warn("⚠️ Aucun bucket storage ou accès restreint.");
      return 0;
    }

    for (const b of buckets) {
      const bDir = path.join(storageDir, b.name);
      if (!fs.existsSync(bDir)) fs.mkdirSync(bDir, { recursive: true });

      const { data: files } = await supabase.storage.from(b.name).list("", { limit: 1000 });
      if (files) {
        for (const f of files) {
          if (f.name === ".emptyFolderPlaceholder") continue;
          try {
            const { data: blob } = await supabase.storage.from(b.name).download(f.name);
            if (blob) {
              const buf = Buffer.from(await blob.arrayBuffer());
              fs.writeFileSync(path.join(bDir, f.name), buf);
              totalFiles++;
            }
          } catch {}
        }
      }
    }
    console.log(`✅ ${totalFiles} fichier(s) téléchargé(s) depuis le Storage.`);
  } catch (err) {
    console.warn("⚠️ Note storage:", err.message);
  }
  return totalFiles;
}

async function run() {
  const tableList = await discoverTables();
  console.log(`🔍 ${tableList.length} tables détectées/analysées.`);

  const usersCount = await exportAuthUsers();

  console.log("📦 2. Sauvegarde des tables de données...");
  const tableResults = [];
  for (const table of tableList) {
    const res = await exportTable(table);
    if (res && res.exists) {
      tableResults.push(res);
    }
  }

  const storageFilesCount = await exportStorage();

  // Résumé global
  const summary = {
    date: now.toISOString(),
    supabaseUrl: SUPABASE_URL,
    totalAuthUsers: usersCount,
    totalStorageFiles: storageFilesCount,
    tables: tableResults,
  };

  fs.writeFileSync(
    path.join(backupDir, "summary.json"),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  // Guide de restauration
  const restoreGuide = `# Guide de Sauvegarde et Restauration Supabase — HAS

**Date de la sauvegarde** : ${now.toLocaleString("fr-FR")}
**Source** : ${SUPABASE_URL}

## 📊 Résumé des éléments sauvegardés
* **Comptes utilisateurs (Auth)** : ${usersCount}
* **Fichiers Storage** : ${storageFilesCount}
* **Tables exportées** :
${tableResults.map((t) => `  - **${t.name}** : ${t.count} ligne(s)`).join("\n")}

## 📁 Structure des fichiers de la sauvegarde
* \`auth/users.json\` : Export complet de tous les comptes utilisateurs Supabase Auth (identifiants, métadonnées, rôles).
* \`tables-json/\` : Chaque table au format JSON standard.
* \`tables-sql/\` : Chaque table convertie en requêtes SQL \`INSERT INTO ...\` prête à exécuter dans votre nouveau projet Supabase !
* \`storage/\` : Tous les fichiers téléversés dans vos buckets Supabase.

## 🔄 Comment basculer vers votre NOUVEAU projet Supabase :
1. Créez votre nouveau projet sur [supabase.com](https://supabase.com).
2. Dans le SQL Editor du nouveau projet, exécutez vos schémas dans \`database/profiles.sql\`, \`database/verification_codes.sql\`, etc.
3. Exécutez ensuite les fichiers SQL générés dans \`tables-sql/\` pour réinjecter immédiatement toutes vos données.
4. Mettez à jour vos 3 variables dans le fichier \`.env.local\` avec les nouvelles clés de votre nouveau projet :
   \`\`\`env
   NEXT_PUBLIC_SUPABASE_URL=https://<votre-nouveau-projet>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   \`\`\`
5. Redémarrez votre application : tout est réinitialisé et opérationnel sans aucune perte !
`;

  fs.writeFileSync(path.join(backupDir, "README.md"), restoreGuide, "utf-8");

  // Générer automatiquement le fichier SQL unique complet de restauration
  try {
    console.log("\n🔨 Génération automatique du fichier SQL unique de restauration...");
    execSync(`node scripts/build-unified-sql-backup.mjs "${backupDir}"`, { stdio: "inherit" });
  } catch (sqlBuildErr) {
    console.warn("⚠️ Avertissement génération restore_all_data.sql:", sqlBuildErr.message);
  }

  console.log("\n============================================================");
  console.log("🎉 SAUVEGARDE TERMINÉE AVEC SUCCÈS !");
  console.log(`📁 Répertoire de sauvegarde : ${backupDir}`);
  console.log("============================================================\n");
}

run().catch((err) => {
  console.error("❌ ERREUR FATALE:", err);
  process.exit(1);
});

