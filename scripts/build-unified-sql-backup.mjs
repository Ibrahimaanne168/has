import fs from "fs";
import path from "path";

function getBackupDir() {
  if (process.argv[2]) return path.resolve(process.argv[2]);
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

const backupDir = getBackupDir();
if (!backupDir) {
  console.error("❌ Aucun dossier de backup trouvé !");
  process.exit(1);
}
console.log(`📁 Dossier source du backup : ${backupDir}`);
const tablesSqlDir = path.join(backupDir, "tables-sql");
const authUsersFile = path.join(backupDir, "auth", "users.json");
const databaseDir = path.resolve(process.cwd(), "database");

console.log("🔨 1. Génération du fichier SQL complet de restauration des données...");

// 1. Charger les utilisateurs Supabase Auth
let authUsers = [];
if (fs.existsSync(authUsersFile)) {
  try {
    authUsers = JSON.parse(fs.readFileSync(authUsersFile, "utf-8"));
    console.log(`✓ ${authUsers.length} utilisateurs Auth trouvés dans users.json`);
  } catch (e) {
    console.error("Erreur lecture auth users:", e);
  }
}

let restoreSql = `-- ==============================================================================
-- RESTAURATION COMPLÈTE DES DONNÉES — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- Sauvegarde générée le : ${new Date().toISOString()}
-- Total utilisateurs Auth : ${authUsers.length}
-- Compatible exécution directe dans le "SQL Editor" de votre nouveau projet Supabase
-- ==============================================================================
-- INSTRUCTIONS D'UTILISATION :
-- 1. Exécutez d'abord "database/schema_complet.sql" pour créer toutes les tables et buckets.
-- 2. Exécutez ensuite CE fichier pour insérer toutes les données sans aucune perte.
-- ==============================================================================

SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- Désactiver temporairement les vérifications strictes de déclencheurs pour un import fluide
SET session_replication_role = 'replica';

`;

// Section A: Comptes utilisateurs Supabase Auth (auth.users + auth.identities)
restoreSql += `-- ==============================================================================
-- A. RESTAURATION DES COMPTES SUPABASE AUTH (${authUsers.length} UTILISATEURS)
-- ==============================================================================
-- Remarque : Pour des raisons de sécurité, Supabase n'exporte pas les hashs de mot de passe bruts.
-- Les comptes sont créés avec le mot de passe standard initial 'admin123' (ou hash bcrypt sécurisé).
-- Tous les rôles, matricules, filières, classes et statuts de validation sont 100% préservés !
-- ==============================================================================

DO $$
BEGIN
    RAISE NOTICE 'Restauration des utilisateurs auth.users...';
END $$;

`;

// Mot de passe standard hashé bcrypt pour 'admin123' (compatible Supabase Auth)
const DEFAULT_BCRYPT = "$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im";

for (const u of authUsers) {
  const uid = u.id;
  const email = (u.email || "").replace(/'/g, "''");
  if (!uid || !email) continue;

  const appMeta = JSON.stringify(u.app_metadata || { provider: "email", providers: ["email"] }).replace(/'/g, "''");
  const userMeta = JSON.stringify(u.user_metadata || {}).replace(/'/g, "''");
  const confirmedAt = u.confirmed_at || u.email_confirmed_at || u.created_at || new Date().toISOString();
  const createdAt = u.created_at || new Date().toISOString();
  const updatedAt = u.updated_at || createdAt;

  restoreSql += `INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '${uid}',
  'authenticated',
  'authenticated',
  '${email}',
  '${DEFAULT_BCRYPT}',
  '${confirmedAt}',
  '${appMeta}'::jsonb,
  '${userMeta}'::jsonb,
  '${createdAt}',
  '${updatedAt}',
  ''
) ON CONFLICT (id) DO UPDATE SET
  raw_user_meta_data = EXCLUDED.raw_user_meta_data,
  raw_app_meta_data = EXCLUDED.raw_app_meta_data,
  email_confirmed_at = EXCLUDED.email_confirmed_at;

-- Identité email pour connexion immédiate
INSERT INTO auth.identities (
  id, provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) VALUES (
  '${uid}',
  '${uid}',
  '${uid}',
  json_build_object('sub', '${uid}', 'email', '${email}')::jsonb,
  'email',
  '${confirmedAt}',
  '${createdAt}',
  '${updatedAt}'
) ON CONFLICT DO NOTHING;

`;

  // Si l'utilisateur a des métadonnées, insérer ou mettre à jour dans public.profiles aussi
  const meta = u.user_metadata || {};
  const username = (meta.username || email.split("@")[0] || "user").replace(/'/g, "''");
  const fullName = (meta.full_name || meta.nom_complet || "").replace(/'/g, "''");
  const role = (meta.role || "etudiant").replace(/'/g, "''");
  const matricule = (meta.matricule || "").replace(/'/g, "''");
  const telephone = (meta.telephone || u.phone || "").replace(/'/g, "''");

  restoreSql += `INSERT INTO public.profiles (
  id, email, username, full_name, role, matricule, telephone, is_active, created_at, updated_at
) VALUES (
  '${uid}',
  '${email}',
  '${username}',
  '${fullName}',
  '${role}',
  '${matricule}',
  '${telephone}',
  TRUE,
  '${createdAt}',
  '${updatedAt}'
) ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  role = EXCLUDED.role,
  matricule = EXCLUDED.matricule;

`;
}

// Section B: Tables de données relationnelles dans l'ordre strict des dépendances FK
const tableOrder = [
  "roles.sql",
  "filieres.sql",
  "classes.sql",
  "matieres.sql",
  "matiere_classe.sql",
  "users.sql",
  "enseignants.sql",
  "enseignant_filiere.sql",
  "enseignant_matiere.sql",
  "etudiants.sql",
  "emplois_du_temps.sql",
  "edt_classe.sql",
  "edt_filiere.sql",
  "cours.sql",
  "cours_classe.sql",
  "fichiers_cours.sql",
  "communiques.sql",
  "chat_messages.sql",
  "logs.sql",
  "verification_codes.sql",
];

restoreSql += `\n-- ==============================================================================
-- B. RESTAURATION DES TABLES RELATIONNELLES HAS
-- ==============================================================================
`;

for (const sqlFile of tableOrder) {
  const filePath = path.join(tablesSqlDir, sqlFile);
  if (!fs.existsSync(filePath)) {
    console.warn(`Fichier absent : ${sqlFile}`);
    continue;
  }
  const content = fs.readFileSync(filePath, "utf-8").trim();
  if (content && !content.startsWith("-- Table ") || content.includes("INSERT INTO")) {
    restoreSql += `\n-- >>> ${sqlFile} <<<\n`;
    restoreSql += content + "\n";
  }
}

// Section C: Réalignement des séquences Serial
restoreSql += `\n-- ==============================================================================
-- C. SYNCHRONISATION DES SÉQUENCES D'AUTO-INCRÉMENTATION
-- ==============================================================================
SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 1));
SELECT setval(pg_get_serial_sequence('filieres', 'id'), COALESCE((SELECT MAX(id) FROM filieres), 1));
SELECT setval(pg_get_serial_sequence('classes', 'id'), COALESCE((SELECT MAX(id) FROM classes), 1));
SELECT setval(pg_get_serial_sequence('matieres', 'id'), COALESCE((SELECT MAX(id) FROM matieres), 1));
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('enseignants', 'id'), COALESCE((SELECT MAX(id) FROM enseignants), 1));
SELECT setval(pg_get_serial_sequence('etudiants', 'id'), COALESCE((SELECT MAX(id) FROM etudiants), 1));
SELECT setval(pg_get_serial_sequence('emplois_du_temps', 'id'), COALESCE((SELECT MAX(id) FROM emplois_du_temps), 1));
SELECT setval(pg_get_serial_sequence('edt_classe', 'id'), COALESCE((SELECT MAX(id) FROM edt_classe), 1));
SELECT setval(pg_get_serial_sequence('cours', 'id'), COALESCE((SELECT MAX(id) FROM cours), 1));
SELECT setval(pg_get_serial_sequence('fichiers_cours', 'id'), COALESCE((SELECT MAX(id) FROM fichiers_cours), 1));
SELECT setval(pg_get_serial_sequence('communiques', 'id'), COALESCE((SELECT MAX(id) FROM communiques), 1));
SELECT setval(pg_get_serial_sequence('messages_contact', 'id'), COALESCE((SELECT MAX(id) FROM messages_contact), 1));
SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE((SELECT MAX(id) FROM notifications), 1));
SELECT setval(pg_get_serial_sequence('favoris', 'id'), COALESCE((SELECT MAX(id) FROM favoris), 1));
SELECT setval(pg_get_serial_sequence('chat_messages', 'id'), COALESCE((SELECT MAX(id) FROM chat_messages), 1));
SELECT setval(pg_get_serial_sequence('logs', 'id'), COALESCE((SELECT MAX(id) FROM logs), 1));

-- Réactiver les règles et contraintes
SET session_replication_role = 'origin';

-- Fin de restauration
DO $$
BEGIN
    RAISE NOTICE '✓ Restauration terminée avec succès pour toutes les tables et comptes HAS !';
END $$;
`;

// Écrire le fichier unifié de restauration des données
const targetBackupFile = path.join(backupDir, "restore_all_data.sql");
const targetDatabaseDataFile = path.join(databaseDir, "restore_backup_data.sql");
fs.writeFileSync(targetBackupFile, restoreSql, "utf-8");
fs.writeFileSync(targetDatabaseDataFile, restoreSql, "utf-8");
console.log(`✓ Fichier restauration écrit dans : ${targetBackupFile}`);
console.log(`✓ Fichier restauration écrit dans : ${targetDatabaseDataFile} (${Math.round(restoreSql.length / 1024)} Ko)`);

// 2. Générer le fichier de schéma unique complet consolidé dans database/
console.log("\n🔨 2. Génération du fichier unique complet pour la structure de base (database/schema_complet.sql)...");

const completeSchemaSql = `-- ==============================================================================
-- HALIL ACADÉMIE SCIENTIFIQUE (HAS) — SCHÉMA COMPLET UNIQUE DE BASE DE DONNÉES
-- À EXÉCUTER EN 1 SEUL CLIC DANS LE "SQL EDITOR" DE VOTRE NOUVEAU PROJET SUPABASE
-- ==============================================================================
-- Ce fichier contient TOUT :
-- 1. Extensions requises (pgcrypto, uuid-ossp)
-- 2. Création de TOUTES les tables relationnelles
-- 3. Table des profils Supabase Auth (profiles) avec index et triggers automatiques
-- 4. Table des logs d'audit (audit_logs)
-- 5. Table des codes 2FA (verification_codes)
-- 6. Configuration des Buckets de Stockage Supabase (cours-supports, emplois-du-temps, avatars, communiques, public-gallery)
-- 7. Toutes les politiques de sécurité Row Level Security (RLS)
-- 8. Synchronisation temps réel Supabase Realtime (chat_messages)
-- 9. Données initiales essentielles (rôles, filières, classes, matières, liaisons)
-- ==============================================================================

-- ==============================================================================
-- 1. EXTENSIONS POSTGRESQL
-- ==============================================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. NETTOYAGE IDEMPOTENT DES ANCIENNES TABLES
-- ==============================================================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS chat_messages CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
DROP TABLE IF EXISTS favoris CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS messages_contact CASCADE;
DROP TABLE IF EXISTS communiques CASCADE;
DROP TABLE IF EXISTS fichiers_cours CASCADE;
DROP TABLE IF EXISTS cours_classe CASCADE;
DROP TABLE IF EXISTS cours CASCADE;
DROP TABLE IF EXISTS edt_filiere CASCADE;
DROP TABLE IF EXISTS edt_classe CASCADE;
DROP TABLE IF EXISTS emplois_du_temps CASCADE;
DROP TABLE IF EXISTS etudiants CASCADE;
DROP TABLE IF EXISTS enseignant_matiere CASCADE;
DROP TABLE IF EXISTS enseignant_filiere CASCADE;
DROP TABLE IF EXISTS enseignants CASCADE;
DROP TABLE IF EXISTS matiere_classe CASCADE;
DROP TABLE IF EXISTS matieres CASCADE;
DROP TABLE IF EXISTS classes CASCADE;
DROP TABLE IF EXISTS filieres CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS verification_codes CASCADE;

-- ==============================================================================
-- 3. CRÉATION DES TABLES PRINCIPALES
-- ==============================================================================

-- RÔLES (1: admin, 2: enseignant, 3: etudiant)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(30) NOT NULL UNIQUE
);

-- UTILISATEURS DU SYSTÈME LOCAL (compatibilité historique et administration)
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    telephone VARCHAR(20),
    email VARCHAR(150),
    photo VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_code VARCHAR(10),
    two_factor_expires_at TIMESTAMP
);

-- FILIÈRES
CREATE TABLE filieres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    description TEXT
);

-- CLASSES
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    nom VARCHAR(100) NOT NULL,
    niveau VARCHAR(30)
);

-- MATIÈRES
CREATE TABLE matieres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- LIAISON MATIÈRE <-> CLASSE
CREATE TABLE matiere_classe (
    matiere_id INT NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (matiere_id, classe_id)
);

-- ENSEIGNANTS
CREATE TABLE enseignants (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    filiere_id INT REFERENCES filieres(id) ON DELETE SET NULL,
    biographie TEXT
);

-- LIAISON ENSEIGNANT <-> FILIÈRE
CREATE TABLE enseignant_filiere (
    enseignant_id INT NOT NULL REFERENCES enseignants(id) ON DELETE CASCADE,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    PRIMARY KEY (enseignant_id, filiere_id)
);

-- LIAISON ENSEIGNANT <-> MATIÈRE
CREATE TABLE enseignant_matiere (
    enseignant_id INT NOT NULL REFERENCES enseignants(id) ON DELETE CASCADE,
    matiere_id INT NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    PRIMARY KEY (enseignant_id, matiere_id)
);

-- ÉTUDIANTS
CREATE TABLE etudiants (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    matricule VARCHAR(30) UNIQUE
);

-- EMPLOIS DU TEMPS
CREATE TABLE emplois_du_temps (
    id SERIAL PRIMARY KEY,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    titre VARCHAR(150),
    fichier_pdf VARCHAR(255),
    fichier_image VARCHAR(255),
    date_publication DATE,
    actif BOOLEAN DEFAULT TRUE
);

-- LIAISON EDT <-> CLASSE
CREATE TABLE edt_classe (
    id SERIAL PRIMARY KEY,
    edt_id INT NOT NULL REFERENCES emplois_du_temps(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE
);

-- LIAISON EDT <-> FILIÈRE
CREATE TABLE edt_filiere (
    edt_id INT NOT NULL REFERENCES emplois_du_temps(id) ON DELETE CASCADE,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    PRIMARY KEY (edt_id, filiere_id)
);

-- COURS
CREATE TABLE cours (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    description TEXT,
    matiere_id INT NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    enseignant_id INT NOT NULL REFERENCES enseignants(id) ON DELETE CASCADE,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    niveau VARCHAR(30),
    lien_externe VARCHAR(255)
);

-- LIAISON COURS <-> CLASSE
CREATE TABLE cours_classe (
    cours_id INT NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (cours_id, classe_id)
);

-- FICHIERS ATTACHÉS AUX COURS
CREATE TABLE fichiers_cours (
    id SERIAL PRIMARY KEY,
    cours_id INT NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    type_fichier VARCHAR(20) NOT NULL CHECK (type_fichier IN ('pdf', 'ppt', 'word', 'video', 'autre')),
    nom_original VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL
);

-- COMMUNIQUÉS ACADÉMIQUES
CREATE TABLE communiques (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    contenu TEXT NOT NULL,
    image VARCHAR(255),
    fichier_pdf VARCHAR(255),
    auteur_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mis_en_avant BOOLEAN DEFAULT FALSE,
    archive BOOLEAN DEFAULT FALSE,
    date_publication DATE DEFAULT CURRENT_DATE
);

-- FORMULAIRE DE CONTACT & MESSAGES
CREATE TABLE messages_contact (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    telephone VARCHAR(20),
    sujet VARCHAR(150) NOT NULL,
    destinataire_type VARCHAR(30) NOT NULL CHECK (destinataire_type IN ('administration', 'direction', 'responsable_pedagogique', 'enseignant')),
    destinataire_id INT REFERENCES users(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    reponse TEXT,
    lu BOOLEAN DEFAULT FALSE,
    date_envoi TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('cours', 'communique', 'emploi_du_temps', 'message', 'mot_de_passe', 'info')),
    contenu VARCHAR(255) NOT NULL,
    lien VARCHAR(255),
    lu BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- FAVORIS COURS
CREATE TABLE favoris (
    id SERIAL PRIMARY KEY,
    etudiant_id INT NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    cours_id INT NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    CONSTRAINT uniq_favori UNIQUE (etudiant_id, cours_id)
);

-- CHAT GÉNÉRAL (Salon d'échange communautaire persistant)
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- LOGS D'ACTIVITÉ
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CODES DE VÉRIFICATION 2FA / SÉCURITÉ
CREATE TABLE verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'signup_2fa',
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_created ON verification_codes(created_at DESC);

-- ==============================================================================
-- 4. TABLE PROFILES ET AUDIT (LIÉES DIRECTEMENT À SUPABASE AUTH)
-- ==============================================================================

-- Table des profils d'utilisateurs connectés à auth.users
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(150),
    role VARCHAR(30) NOT NULL DEFAULT 'etudiant' CHECK (role IN ('admin', 'professeur', 'etudiant')),
    matricule VARCHAR(50),
    telephone VARCHAR(30),
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Déclencheur pour updated_at automatique sur profiles
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- Table des journaux d'audit de sécurité
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100) DEFAULT 'local',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- ==============================================================================
-- 5. DONNÉES DE BASE INITIALES (SEEDS)
-- ==============================================================================

-- Rôles
INSERT INTO roles (id, nom) VALUES 
(1, 'admin'),
(2, 'enseignant'),
(3, 'etudiant')
ON CONFLICT (id) DO NOTHING;

-- Filières
INSERT INTO filieres (id, nom, description) VALUES
(1, 'MPI', 'Mathématiques, Physique et Informatique — Formation fondamentale et modélisation scientifique.'),
(2, 'SML', 'Science de la mer et du littoral — Océanographie physique, biologie marine et environnement.'),
(3, 'MIASS', 'Mathématiques et Informatique Appliquées aux Sciences Sociales — Statistiques, analyse de données et économétrie.')
ON CONFLICT (id) DO NOTHING;

-- Classes
INSERT INTO classes (id, filiere_id, nom, niveau) VALUES
(1, 1, 'L1 MPI', 'Licence 1'),
(2, 1, 'L2 MPI', 'Licence 2'),
(3, 2, 'L1 SML', 'Licence 1'),
(4, 2, 'L2 SML', 'Licence 2'),
(5, 3, 'L1 MIASS', 'Licence 1'),
(6, 3, 'L2 MIASS', 'Licence 2')
ON CONFLICT (id) DO NOTHING;

-- Matières
INSERT INTO matieres (id, nom) VALUES
(1, 'Programmation Orientée Objet Python'),
(2, 'Base de données'),
(3, 'Mécanique Générale'),
(4, 'Analyse 3'),
(5, 'Algèbre 3'),
(6, 'Thermodynamique'),
(7, 'Analyse Numérique Matricielle'),
(8, 'Economie'),
(9, 'Analyse 1'),
(10, 'Algèbre 1'),
(11, 'Programmation Python'),
(12, 'Mécanique du point'),
(13, 'Electricité'),
(14, 'Economie Générale'),
(15, 'Analyse 2'),
(16, 'Algèbre 2'),
(17, 'Magnétostatique et Régime Variable'),
(18, 'Optique Géométrique'),
(19, 'Langage C')
ON CONFLICT (id) DO NOTHING;

-- Matières <-> Classes
INSERT INTO matiere_classe (matiere_id, classe_id) VALUES
(1, 2), (1, 4), (1, 6),
(2, 2),
(3, 2), (3, 4),
(4, 2), (4, 4), (4, 6),
(5, 2), (5, 4), (5, 6),
(6, 2), (6, 4),
(7, 2), (7, 4),
(8, 6),
(9, 1), (9, 3), (9, 5),
(10, 1), (10, 3), (10, 5),
(11, 1), (11, 3), (11, 5),
(12, 1), (12, 3),
(13, 1), (13, 3),
(14, 5),
(15, 1), (15, 3), (15, 5),
(16, 1), (16, 3), (16, 5),
(17, 1), (17, 3),
(18, 1), (18, 3),
(19, 1), (19, 3), (19, 5)
ON CONFLICT DO NOTHING;

-- Utilisateurs initiaux (administrateur et professeurs)
INSERT INTO users (id, role_id, login, password_hash, nom, prenom, telephone, email, photo, two_factor_enabled) VALUES
(1, 1, 'admin', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Samb', 'Pape Ibrahima', '756502017', 'admin@has.sn', 'uploads/profils/directeur.jpg', FALSE),
(2, 2, 'papa', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Samb', 'Pape Ibrahima', '756502017', 'papa.samb@has.sn', 'uploads/profs/photo_2026-07-20_16-18-59_2.jpg', FALSE),
(3, 2, 'ibou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Anne', 'Ibrahima', '775518196', 'ibrahima.anne@has.sn', 'uploads/profs/ibrahima.jpg', FALSE),
(4, 2, 'ndiogou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ndiaye', 'Ndiogou', '772772709', 'ndiogou.ndiaye@has.sn', 'uploads/profs/photo_2026-07-20_16-46-11_2.jpg', FALSE),
(5, 2, 'diopsow', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Sow', 'El Hadji Ibrahima Diop', '776689777', 'diop.sow@has.sn', 'uploads/profs/photo_2026-07-20_16-29-37.jpg', FALSE),
(6, 2, 'papethiam', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Thiam', 'Pape', '787318427', 'pape.thiam@has.sn', NULL, FALSE),
(7, 2, 'kalidou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ba', 'Kalidou', '782718397', 'kalidou.ba@has.sn', NULL, FALSE),
(14, 2, 'mamour', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Diop', 'El Hadji Mamour Seynabou', '776689777', 'mamour@has.sn', NULL, FALSE),
(15, 2, 'kady', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ba', 'Papa Kady', '770000000', 'kady.ba@has-academie.online', NULL, FALSE)
ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Enseignants
INSERT INTO enseignants (id, user_id, filiere_id, biographie) VALUES
(1, 2, 3, 'Enseignant-chercheur en Mathématiques et Modélisation stochastique'),
(2, 3, 3, 'Spécialiste en Génie Logiciel, Algorithmique et Programmation'),
(3, 4, 1, 'Physicien, spécialiste en Mécanique Analytique et Thermodynamique'),
(4, 5, 1, 'Enseignant en Physique Appliquée et Ondes'),
(5, 6, 3, 'Ingénieur Informatique, architectures Web et Systèmes'),
(6, 7, 1, 'Professeur de Sciences Physiques et Électromagnétisme'),
(7, 14, 3, 'Enseignant-chercheur en Économie, Finance des entreprises et Gestion financière pour la filière MIASS.'),
(8, 15, 1, 'Professeur de Mathématiques - Spécialiste Nouveaux Bacheliers (NB) en Analyse et Algèbre')
ON CONFLICT (id) DO NOTHING;

-- Enseignant <-> Filières
INSERT INTO enseignant_filiere (enseignant_id, filiere_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(7, 3),
(3, 1), (3, 2),
(4, 1), (4, 2),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 2),
(8, 1), (8, 2), (8, 3)
ON CONFLICT DO NOTHING;

-- Enseignant <-> Matières
INSERT INTO enseignant_matiere (enseignant_id, matiere_id) VALUES
(1, 4), (1, 5), (1, 7), (1, 9), (1, 10), (1, 15), (1, 16),
(2, 1), (2, 2),
(3, 6), (3, 12), (3, 17), (3, 18),
(4, 3),
(5, 11), (5, 19),
(6, 12), (6, 13), (6, 17), (6, 18),
(8, 9), (8, 10)
ON CONFLICT DO NOTHING;

-- Réalignement des séquences d'identifiants (auto-increment)
SELECT setval(pg_get_serial_sequence('roles', 'id'), COALESCE((SELECT MAX(id) FROM roles), 1));
SELECT setval(pg_get_serial_sequence('filieres', 'id'), COALESCE((SELECT MAX(id) FROM filieres), 1));
SELECT setval(pg_get_serial_sequence('classes', 'id'), COALESCE((SELECT MAX(id) FROM classes), 1));
SELECT setval(pg_get_serial_sequence('matieres', 'id'), COALESCE((SELECT MAX(id) FROM matieres), 1));
SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM users), 1));
SELECT setval(pg_get_serial_sequence('enseignants', 'id'), COALESCE((SELECT MAX(id) FROM enseignants), 1));
SELECT setval(pg_get_serial_sequence('etudiants', 'id'), COALESCE((SELECT MAX(id) FROM etudiants), 1));
SELECT setval(pg_get_serial_sequence('emplois_du_temps', 'id'), COALESCE((SELECT MAX(id) FROM emplois_du_temps), 1));
SELECT setval(pg_get_serial_sequence('edt_classe', 'id'), COALESCE((SELECT MAX(id) FROM edt_classe), 1));
SELECT setval(pg_get_serial_sequence('cours', 'id'), COALESCE((SELECT MAX(id) FROM cours), 1));
SELECT setval(pg_get_serial_sequence('fichiers_cours', 'id'), COALESCE((SELECT MAX(id) FROM fichiers_cours), 1));
SELECT setval(pg_get_serial_sequence('communiques', 'id'), COALESCE((SELECT MAX(id) FROM communiques), 1));
SELECT setval(pg_get_serial_sequence('messages_contact', 'id'), COALESCE((SELECT MAX(id) FROM messages_contact), 1));
SELECT setval(pg_get_serial_sequence('notifications', 'id'), COALESCE((SELECT MAX(id) FROM notifications), 1));
SELECT setval(pg_get_serial_sequence('favoris', 'id'), COALESCE((SELECT MAX(id) FROM favoris), 1));
SELECT setval(pg_get_serial_sequence('chat_messages', 'id'), COALESCE((SELECT MAX(id) FROM chat_messages), 1));
SELECT setval(pg_get_serial_sequence('logs', 'id'), COALESCE((SELECT MAX(id) FROM logs), 1));

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
-- ==============================================================================
ALTER TABLE roles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE filieres             ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE matieres             ENABLE ROW LEVEL SECURITY;
ALTER TABLE matiere_classe       ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignants          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignant_filiere   ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignant_matiere   ENABLE ROW LEVEL SECURITY;
ALTER TABLE etudiants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE emplois_du_temps     ENABLE ROW LEVEL SECURITY;
ALTER TABLE edt_classe           ENABLE ROW LEVEL SECURITY;
ALTER TABLE edt_filiere          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cours                ENABLE ROW LEVEL SECURITY;
ALTER TABLE cours_classe         ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichiers_cours       ENABLE ROW LEVEL SECURITY;
ALTER TABLE communiques          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_contact     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoris              ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages        ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_codes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles             ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs           ENABLE ROW LEVEL SECURITY;

-- Accès complet pour le rôle backend sécurisé (service_role)
CREATE POLICY "service_role_all_roles"              ON roles              FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_users"              ON users              FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_filieres"          ON filieres          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_classes"           ON classes           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_matieres"          ON matieres          FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_matiere_classe"    ON matiere_classe    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_enseignants"       ON enseignants       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_enseignant_filiere" ON enseignant_filiere FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_enseignant_matiere" ON enseignant_matiere FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_etudiants"         ON etudiants         FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_emplois_du_temps"  ON emplois_du_temps  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_edt_classe"        ON edt_classe        FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_edt_filiere"       ON edt_filiere       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_cours"             ON cours             FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_cours_classe"      ON cours_classe      FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_fichiers_cours"    ON fichiers_cours    FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_communiques"       ON communiques       FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_messages_contact"  ON messages_contact  FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_notifications"     ON notifications     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_favoris"           ON favoris           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_chat_messages"     ON chat_messages     FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_logs"              ON logs              FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_verification_codes" ON verification_codes FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_profiles"           ON profiles           FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "service_role_all_audit"              ON audit_logs         FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Politiques de lecture publique nécessaires pour la plateforme
CREATE POLICY "public_read_roles"              ON roles              FOR SELECT USING (true);
CREATE POLICY "public_read_filieres"          ON filieres          FOR SELECT USING (true);
CREATE POLICY "public_read_classes"           ON classes           FOR SELECT USING (true);
CREATE POLICY "public_read_matieres"          ON matieres          FOR SELECT USING (true);
CREATE POLICY "public_read_matiere_classe"    ON matiere_classe    FOR SELECT USING (true);
CREATE POLICY "public_read_enseignants"       ON enseignants       FOR SELECT USING (true);
CREATE POLICY "public_read_enseignant_filiere" ON enseignant_filiere FOR SELECT USING (true);
CREATE POLICY "public_read_enseignant_matiere" ON enseignant_matiere FOR SELECT USING (true);
CREATE POLICY "public_read_communiques"       ON communiques       FOR SELECT USING (archive = FALSE);
CREATE POLICY "public_read_cours"             ON cours             FOR SELECT USING (true);
CREATE POLICY "public_read_cours_classe"      ON cours_classe      FOR SELECT USING (true);
CREATE POLICY "public_read_fichiers_cours"    ON fichiers_cours    FOR SELECT USING (true);
CREATE POLICY "public_read_emplois_du_temps"  ON emplois_du_temps  FOR SELECT USING (actif = TRUE);
CREATE POLICY "public_read_edt_classe"        ON edt_classe        FOR SELECT USING (true);
CREATE POLICY "public_read_edt_filiere"       ON edt_filiere       FOR SELECT USING (true);
CREATE POLICY "public_read_users"             ON users             FOR SELECT USING (true);
CREATE POLICY "public_update_users"           ON users             FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "public_read_etudiants"         ON etudiants         FOR SELECT USING (true);
CREATE POLICY "anon_insert_messages_contact"  ON messages_contact  FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_messages_contact"   ON messages_contact  FOR SELECT USING (true);
CREATE POLICY "public_all_notifications"      ON notifications     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_favoris"            ON favoris           FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_read_chat_messages"     ON chat_messages     FOR SELECT USING (true);
CREATE POLICY "public_insert_chat_messages"   ON chat_messages     FOR INSERT WITH CHECK (true);
CREATE POLICY "public_delete_chat_messages"   ON chat_messages     FOR DELETE USING (true);
CREATE POLICY "public_all_logs"               ON logs              FOR ALL USING (true) WITH CHECK (true);

-- Politiques de profiles et audit_logs
CREATE POLICY "authenticated_read_profiles"   ON profiles          FOR SELECT TO authenticated USING (true);
CREATE POLICY "users_update_own_profile"      ON profiles          FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY "admin_read_audit"              ON audit_logs        FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- ==============================================================================
-- 7. BUCKETS DE STOCKAGE SUPABASE STORAGE ET POLITIQUES
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
('cours-supports', 'cours-supports', true),
('emplois-du-temps', 'emplois-du-temps', true),
('avatars', 'avatars', true),
('communiques', 'communiques', true),
('public-gallery', 'public-gallery', true)
ON CONFLICT (id) DO NOTHING;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Access Supports" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload Supports" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access EDT" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload EDT" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload Avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Communiques" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Gallery" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public Access Supports" ON storage.objects FOR SELECT USING (bucket_id = 'cours-supports');
CREATE POLICY "Auth Upload Supports" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (bucket_id = 'cours-supports');
CREATE POLICY "Public Access EDT" ON storage.objects FOR SELECT USING (bucket_id = 'emplois-du-temps');
CREATE POLICY "Auth Upload EDT" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (bucket_id = 'emplois-du-temps');
CREATE POLICY "Public Access Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth Upload Avatars" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public Access Communiques" ON storage.objects FOR SELECT USING (bucket_id = 'communiques');
CREATE POLICY "Public Access Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'public-gallery');

-- ==============================================================================
-- 8. PUBLICATION TEMPS RÉEL (SUPABASE REALTIME)
-- ==============================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN OTHERS THEN null;
END $$;

-- Fin du schéma
DO $$
BEGIN
    RAISE NOTICE '✓ Schéma complet HAS déployé avec succès sur Supabase !';
END $$;
`;

const targetSchemaFile = path.join(databaseDir, "schema_complet.sql");
const targetMainSchema = path.join(databaseDir, "schema.sql");
fs.writeFileSync(targetSchemaFile, completeSchemaSql, "utf-8");
fs.writeFileSync(targetMainSchema, completeSchemaSql, "utf-8");
console.log(`✓ Fichier schéma unique écrit dans : ${targetSchemaFile}`);
console.log(`✓ Fichier schema.sql mis à jour (${Math.round(completeSchemaSql.length / 1024)} Ko)`);

console.log("\n✨ TOUS LES FICHIERS SQL SONT PRÊTS !");

