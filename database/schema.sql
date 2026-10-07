-- ============================================================
-- Plateforme HAS (Halil Académie Scientifique)
-- Schéma Complet Unique + RLS (Row Level Security) pour Supabase
-- Compatible exécution directe dans le "SQL Editor" de Supabase
-- Fichier Unique Consolidé (Tables, Relations, Matières, Seeds, RLS, Storage)
-- ============================================================

-- ============================================================
-- 1. NETTOYAGE DES ANCIENNES TABLES (Idempotent)
-- ============================================================
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

-- ⚠️ ATTENTION : NE PAS EXÉCUTER CE FICHIER SUR UNE BASE ACTIVE SUPABASE AUTH !
-- Ce fichier contient un schéma relationnel hérité autonome (avec table users séparée).
-- Pour la plateforme HAS connectée à Supabase Auth, utilisez :
-- 1. database/profiles.sql
-- 2. database/verification_codes.sql
-- ============================================================

-- Nettoyage des tables d'anciens schémas (compatibilité totale)
-- Note de sécurité : conservation des tables profiles, verification_codes et audit_logs
-- DROP TABLE IF EXISTS profiles CASCADE;
-- DROP TABLE IF EXISTS verification_codes CASCADE;
-- DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS favoris_cours CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS contact_messages CASCADE;

-- ============================================================
-- 2. CRÉATION DES TABLES ET CONTRAINTES
-- ============================================================

-- RÔLES (1: admin, 2: enseignant, 3: etudiant)
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(30) NOT NULL UNIQUE
);

-- UTILISATEURS
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
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Verification codes access" ON verification_codes FOR ALL TO anon, authenticated, service_role USING (true) WITH CHECK (true);


-- ============================================================
-- 3. DONNÉES INITIALES (SEED DATA RÉEL)
-- ============================================================

-- Rôles
INSERT INTO roles (id, nom) VALUES 
(1, 'admin'),
(2, 'enseignant'),
(3, 'etudiant')
ON CONFLICT (id) DO NOTHING;

-- Filières
INSERT INTO filieres (id, nom, description) VALUES
(1, 'MPI', 'Mathématiques, Physique et Informatique — Formation fondamentale et modélisation scientifique.'),
(2, 'SML', 'Sciences de la Mer et du Littoral — Océanographie physique, biologie marine et environnement.'),
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

-- UTILISATEURS DU SYSTÈME (Mot de passe par défaut: admin123 pour tous les comptes initiaux)
-- Hash bcrypt vérifié: $2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im
INSERT INTO users (id, role_id, login, password_hash, nom, prenom, telephone, email, photo, two_factor_enabled) VALUES
(1, 1, 'admin', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Samb', 'Pape Ibrahima', '756502017', 'admin@has.sn', 'uploads/profils/directeur.jpg', FALSE),
(2, 2, 'papa', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Samb', 'Pape Ibrahima', '756502017', 'papa.samb@has.sn', 'uploads/profs/photo_2026-07-20_16-18-59_2.jpg', FALSE),
(3, 2, 'ibou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Anne', 'Ibrahima', '775518196', 'ibrahima.anne@has.sn', 'uploads/profs/ibrahima.jpg', FALSE),
(4, 2, 'ndiogou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ndiaye', 'Ndiogou', '772772709', 'ndiogou.ndiaye@has.sn', 'uploads/profs/photo_2026-07-20_16-46-11_2.jpg', FALSE),
(5, 2, 'diopsow', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Sow', 'El Hadji Ibrahima Diop', '776689777', 'diop.sow@has.sn', 'uploads/profs/photo_2026-07-20_16-29-37.jpg', FALSE),
(6, 2, 'papethiam', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Thiam', 'Pape', '787318427', 'pape.thiam@has.sn', NULL, FALSE),
(7, 2, 'kalidou', '$2a$10$wRmr446fxs2vNyHC1qALTejGFYdhVjKe57wzBW15UiTdwW0yBC.im', 'Ba', 'Kalidou', '782718397', 'kalidou.ba@has.sn', NULL, FALSE)
ON CONFLICT (id) DO UPDATE SET password_hash = EXCLUDED.password_hash;

-- Enseignants
INSERT INTO enseignants (id, user_id, filiere_id, biographie) VALUES
(1, 2, 3, 'Enseignant-chercheur en Mathématiques et Modélisation stochastique'),
(2, 3, 3, 'Spécialiste en Génie Logiciel, Algorithmique et Programmation'),
(3, 4, 1, 'Physicien, spécialiste en Mécanique Analytique et Thermodynamique'),
(4, 5, 1, 'Enseignant en Physique Appliquée et Ondes'),
(5, 6, 3, 'Ingénieur Informatique, architectures Web et Systèmes'),
(6, 7, 1, 'Professeur de Sciences Physiques et Électromagnétisme')
ON CONFLICT (id) DO NOTHING;

-- Enseignant <-> Filières
INSERT INTO enseignant_filiere (enseignant_id, filiere_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2),
(4, 1), (4, 2),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 2)
ON CONFLICT DO NOTHING;

-- Enseignant <-> Matières
INSERT INTO enseignant_matiere (enseignant_id, matiere_id) VALUES
(1, 4), (1, 5), (1, 7), (1, 9), (1, 10), (1, 15), (1, 16),
(2, 1), (2, 2),
(3, 6), (3, 12), (3, 17), (3, 18),
(4, 3),
(5, 11), (5, 19),
(6, 12), (6, 13), (6, 17), (6, 18)
ON CONFLICT DO NOTHING;


-- (Les cours, fichiers de cours, emplois du temps et communiqués sont gérés et publiés exclusivement par l'administration via la plateforme)

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

-- ============================================================
-- 4. ACTIVATION DU ROW LEVEL SECURITY (RLS)
-- ============================================================

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

-- ============================================================
-- 5. POLITIQUES RLS (Supabase service_role, anon & authenticated)
-- ============================================================

-- RÔLE SERVICE_ROLE : Accès total
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

-- LECTURE PUBLIQUE POUR LA NAVIGATION
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

-- UTILISATEURS & AUTH
CREATE POLICY "public_read_users"             ON users             FOR SELECT USING (true);
CREATE POLICY "public_update_users"           ON users             FOR UPDATE USING (true) WITH CHECK (true);

-- ÉTUDIANTS
CREATE POLICY "public_read_etudiants"         ON etudiants         FOR SELECT USING (true);

-- CONTACT
CREATE POLICY "anon_insert_messages_contact"  ON messages_contact  FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read_messages_contact"   ON messages_contact  FOR SELECT USING (true);

-- NOTIFICATIONS & FAVORIS
CREATE POLICY "public_all_notifications"      ON notifications     FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "public_all_favoris"            ON favoris           FOR ALL USING (true) WITH CHECK (true);

-- CHAT GÉNÉRAL (Accessible à tous les utilisateurs connectés)
CREATE POLICY "public_read_chat_messages"     ON chat_messages     FOR SELECT USING (true);
CREATE POLICY "public_insert_chat_messages"   ON chat_messages     FOR INSERT WITH CHECK (true);
CREATE POLICY "public_delete_chat_messages"   ON chat_messages     FOR DELETE USING (true);

-- LOGS
CREATE POLICY "public_all_logs"               ON logs              FOR ALL USING (true) WITH CHECK (true);

-- ============================================================
-- 6. CONFIGURATION DU STOCKAGE SUPABASE (STORAGE BUCKETS)
-- ============================================================
INSERT INTO storage.buckets (id, name, public) VALUES 
('cours-supports', 'cours-supports', true),
('emplois-du-temps', 'emplois-du-temps', true),
('avatars', 'avatars', true),
('communiques', 'communiques', true),
('public-gallery', 'public-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- Politiques RLS Storage
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

-- ============================================================
-- 7. TEMPS RÉEL (SUPABASE REALTIME)
-- ============================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;
EXCEPTION
    WHEN duplicate_object THEN null;
    WHEN OTHERS THEN null;
END $$;
