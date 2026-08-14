-- ============================================================
-- Plateforme Web HAS - Schéma PostgreSQL pour NEON
-- Exécutez ce script directement dans l'éditeur SQL de Neon (Console -> SQL Editor)
-- ============================================================

-- 1. Nettoyage des anciennes tables si existantes
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

-- 2. Création des tables

-- ROLES
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(30) NOT NULL UNIQUE
);

-- USERS
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    login VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nom VARCHAR(80) NOT NULL,
    prenom VARCHAR(80) NOT NULL,
    telephone VARCHAR(20),
    photo VARCHAR(255)
);

-- FILIERES
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

-- MATIERES
CREATE TABLE matieres (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL
);

-- MATIERE_CLASSE
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

-- ENSEIGNANT_FILIERE
CREATE TABLE enseignant_filiere (
    enseignant_id INT NOT NULL REFERENCES enseignants(id) ON DELETE CASCADE,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    PRIMARY KEY (enseignant_id, filiere_id)
);

-- ENSEIGNANT_MATIERE
CREATE TABLE enseignant_matiere (
    enseignant_id INT NOT NULL REFERENCES enseignants(id) ON DELETE CASCADE,
    matiere_id INT NOT NULL REFERENCES matieres(id) ON DELETE CASCADE,
    PRIMARY KEY (enseignant_id, matiere_id)
);

-- ETUDIANTS
CREATE TABLE etudiants (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    filiere_id INT NOT NULL REFERENCES filieres(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    matricule VARCHAR(30) UNIQUE
);

-- EMPLOIS_DU_TEMPS
CREATE TABLE emplois_du_temps (
    id SERIAL PRIMARY KEY,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    titre VARCHAR(150),
    fichier_pdf VARCHAR(255),
    fichier_image VARCHAR(255),
    date_publication DATE,
    actif BOOLEAN DEFAULT TRUE
);

-- EDT_CLASSE
CREATE TABLE edt_classe (
    id SERIAL PRIMARY KEY,
    edt_id INT NOT NULL REFERENCES emplois_du_temps(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE
);

-- EDT_FILIERE
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

-- COURS_CLASSE
CREATE TABLE cours_classe (
    cours_id INT NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    classe_id INT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    PRIMARY KEY (cours_id, classe_id)
);

-- FICHIERS_COURS
CREATE TABLE fichiers_cours (
    id SERIAL PRIMARY KEY,
    cours_id INT NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    type_fichier VARCHAR(20) NOT NULL CHECK (type_fichier IN ('pdf', 'ppt', 'word', 'video', 'autre')),
    nom_original VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL
);

-- COMMUNIQUES
CREATE TABLE communiques (
    id SERIAL PRIMARY KEY,
    titre VARCHAR(150) NOT NULL,
    contenu TEXT NOT NULL,
    image VARCHAR(255),
    fichier_pdf VARCHAR(255),
    auteur_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mis_en_avant BOOLEAN DEFAULT FALSE,
    archive BOOLEAN DEFAULT FALSE,
    date_publication DATE
);

-- MESSAGES_CONTACT
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
    lu BOOLEAN DEFAULT FALSE
);

-- NOTIFICATIONS
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(30) NOT NULL CHECK (type IN ('cours', 'communique', 'emploi_du_temps', 'message', 'mot_de_passe', 'info')),
    contenu VARCHAR(255) NOT NULL,
    lien VARCHAR(255),
    lu BOOLEAN DEFAULT FALSE
);

-- FAVORIS
CREATE TABLE favoris (
    id SERIAL PRIMARY KEY,
    etudiant_id INT NOT NULL REFERENCES etudiants(id) ON DELETE CASCADE,
    cours_id INT NOT NULL REFERENCES cours(id) ON DELETE CASCADE,
    CONSTRAINT uniq_favori UNIQUE (etudiant_id, cours_id)
);

-- LOGS
CREATE TABLE logs (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    description VARCHAR(255)
);

-- 3. Insertion des Données Initiales

-- ROLES
INSERT INTO roles (id, nom) VALUES 
(1, 'admin'),
(2, 'enseignant'),
(3, 'etudiant');

-- FILIERES
INSERT INTO filieres (id, nom, description) VALUES
(1, 'MPI', 'Mathématiques Physique et Informatique'),
(2, 'SML', 'Sciences de la Mer et du Littoral'),
(3, 'MIASS', 'Mathématiques et Informatique Appliquées aux Sciences Sociales');

-- CLASSES
INSERT INTO classes (id, filiere_id, nom, niveau) VALUES
(1, 1, 'L1 MPI', 'Licence 1'),
(2, 1, 'L2 MPI', 'Licence 2'),
(3, 2, 'L1 SML', 'Licence 1'),
(4, 2, 'L2 SML', 'Licence 2'),
(5, 3, 'L1 MIASS', 'Licence 1'),
(6, 3, 'L2 MIASS', 'Licence 2');

-- MATIERES
INSERT INTO matieres (id, nom) VALUES
(1, 'Programmation Orientée Objet Python'),
(2, 'Base de données'),
(3, 'Mécanique Générale '),
(4, 'Analyse 3'),
(5, 'Algèbre 3'),
(6, 'Thermodynamique'),
(7, 'Analyse Numérique Matricielle'),
(8, 'Economie'),
(9, 'Analyse 1'),
(10, 'Algèbre 1'),
(11, 'Programmation Python'),
(12, 'Mécanique du point'),
(13, 'Eléctricité'),
(14, 'Economie'),
(15, 'Analyse 2'),
(16, 'Algèbre 2'),
(17, 'Magnétostatique et Régime Variable'),
(18, 'Optique Géométrique'),
(19, 'Langage C');

-- MATIERE_CLASSE
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
(19, 1), (19, 3), (19, 5);

-- USERS
INSERT INTO users (id, role_id, login, password_hash, nom, prenom, telephone, photo) VALUES
(1, 1, 'halil', 'scrypt:32768:8:1$v0Api9oHkCGM5Vfl$fe8ec4836e2853f6e1e5220b7548589d2d667555bb8f758bd12802139de3ce34f5de8bc4a2f230f40fe482bbdec73821a47083e05dd35ee9bbe615b5c59f2b88', 'Samb', 'Pape Ibrahima', '756502017', 'uploads/profils/directeur.jpg'),
(2, 2, 'papa', 'scrypt:32768:8:1$Wxp9U9s5dulcD32a$e3fc8111fd972044aa219d531799659f872ee9e9d81e79d9d14baf01e08173f5fc1164453032b70464a0dc601da706a75076729e3bdecc5958c07f2070de16e4', 'Samb', 'Pape Ibrahima', '756502017', 'uploads/profs/photo_2026-07-20_16-18-59_2.jpg'),
(3, 2, 'ibou', 'scrypt:32768:8:1$IzgB8FdQwBXo5tUL$76db724a962fb3982eee8b473c5806276da6b3b705e6fb2432f23d331133541fd0e0a25c889743440fca7842161d25b03b7eb67c2f1844471e7abef1560db105', 'Anne', 'Ibrahima', '775518196', 'uploads/profs/ibrahima.jpg'),
(4, 2, 'ndiogou', 'scrypt:32768:8:1$mnmRn5B4TESoAd9c$166062b717e5387bcead2606c4589997f3fbef6f4eb7b7d1bafd6d1b929ad6312c92bfdec5552540c152ed172bd41e94e774d19edbab8741563f7d5f1178f511', 'Ndiaye', 'Ndiogou ', '772772709', 'uploads/profs/photo_2026-07-20_16-46-11_2.jpg'),
(5, 2, 'diopsow', 'scrypt:32768:8:1$83xY8DnIbubywc6c$2965eb93bab4bf6038cf8ea02d71b638cf23aab0bc3123174c7dfcad16c26b9265eb75665a6bfe572b9e0c3f390ab37c981968ce73964d2b6fb666afc2b9a75d', 'Sow', 'El Hadji Ibrahima Diop', '776689777', 'uploads/profs/photo_2026-07-20_16-29-37.jpg'),
(7, 2, 'papethiam', 'scrypt:32768:8:1$gfQSkMCQuj6O7Qfp$374016e8b5b84582453ddb3a2ce2f0de43b34add4a0997bc7a4dc489b41e8cf730fcc912ca14e06b25df85108a2d9b375fbaf267980c2929bc1aee8ee6c7716b', 'Thiam', 'Pape', '787318427', NULL),
(8, 2, 'kalidou', 'scrypt:32768:8:1$oHo8GTwVHPls7mba$74090a56d3eab1fc6933c82563c9c62ac7bb49ce22143868280bb7122bc5a2d9c1176f763c9c14f3145f125c736a9e9312ce31f1fd6c074bfe787a73b05c5a9b', 'Ba', 'Kalidou', '782718397', NULL),
(10, 3, 'batoura', 'scrypt:32768:8:1$kC4EHN0SMtyjXwrA$8dd18248e879f52cb8ecde99b2c5c97f406bec94000e3de339faa6fd3255dc1636639ee80269331cb72f42faaead04589e99d95db68b65fc1a2939112ea634dc', 'Diakhaby', 'Batoura', '774288825', NULL),
(11, 3, 'amadou', 'scrypt:32768:8:1$7q6yF2eWcpXeulmR$a64b8d319fa18a7c92165a266017f5644730a1488399d391b0c80dc014298d76c84a44ec1e71d3c69a648347f4d85e1397797fc29b840f6e713440fa324b53fc', 'Barro', 'Amadou', '786025355', NULL),
(12, 3, 'mariame', 'scrypt:32768:8:1$nEUsYYlzy02GhZpN$948423b4ccc1b9035a8e6e8a049a0eb821287e448c579c631d4146a0007782bb96d8b55bd99ba4bda4aa24e6b89b53f659582fb6b99d96f7337af8f117ad99b1', 'Sam', 'Mariame', '781796475', NULL),
(13, 3, 'aliou', 'scrypt:32768:8:1$EwLZPg7rXfVUF5Wq$3ef7f46d4c1a35b23db322c46cdcb6a83aaf4c1dc1cd94755f5e81f834af92a33fe0f5390438fbb5f946c7ea996027db7fca1c9d73a5699e35f3899a4aef5797', 'Konté', 'Aliou', '772026306', NULL);

-- ENSEIGNANTS
INSERT INTO enseignants (id, user_id, filiere_id, biographie) VALUES
(1, 2, 3, 'Etudiant en L3 Mathématique et Modélisation'),
(2, 3, 3, 'Etudiant en L3 Informatique'),
(3, 4, 1, 'Etudiant en L3 Physique et Application'),
(4, 5, 1, 'Etudiant en L3 Physique et Applications'),
(5, 7, 3, 'Etudiant en L3 Informatique'),
(6, 8, 1, 'Etudiant en L3 Physique et Applications');

-- ENSEIGNANT_FILIERE
INSERT INTO enseignant_filiere (enseignant_id, filiere_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3),
(3, 1), (3, 2),
(4, 1), (4, 2),
(5, 1), (5, 2), (5, 3),
(6, 1), (6, 2);

-- ENSEIGNANT_MATIERE
INSERT INTO enseignant_matiere (enseignant_id, matiere_id) VALUES
(1, 4), (1, 5), (1, 7), (1, 9), (1, 10), (1, 15), (1, 16),
(2, 1), (2, 2),
(3, 6), (3, 12), (3, 17), (3, 18),
(4, 3),
(5, 11), (5, 19),
(6, 12), (6, 13), (6, 17), (6, 18);

-- ETUDIANTS
INSERT INTO etudiants (id, user_id, filiere_id, classe_id, matricule) VALUES
(1, 10, 1, 1, '0001'),
(2, 11, 1, 1, '0002'),
(3, 12, 1, 1, '0003'),
(4, 13, 1, 1, '0004');

-- NOTIFICATIONS
INSERT INTO notifications (id, user_id, type, contenu, lien, lu) VALUES
(1, 1, 'info', 'Nouvel enseignant ajouté : Pape Ibrahima SAMB', '/admin/enseignants', FALSE),
(2, 1, 'info', 'Nouvel enseignant ajouté : Ibrahima Anne', '/admin/enseignants', FALSE),
(3, 1, 'info', 'Nouvel enseignant ajouté : Ndiogou  Ndiaye', '/admin/enseignants', FALSE),
(4, 1, 'info', 'Nouvel enseignant ajouté : El Hadji Ibrahima Diop Sow', '/admin/enseignants', FALSE),
(5, 1, 'info', 'Nouvel enseignant ajouté : Pape Thiam', '/admin/enseignants', FALSE),
(6, 1, 'info', 'Nouvel enseignant ajouté : Kalidou Ba', '/admin/enseignants', FALSE),
(7, 1, 'info', 'Nouvel étudiant ajouté : Batoura Diakhaby', '/admin/etudiants', FALSE),
(8, 1, 'info', 'Nouvel étudiant ajouté : Amadou Barro', '/admin/etudiants', FALSE),
(9, 1, 'info', 'Nouvel étudiant ajouté : Mariame Sam', '/admin/etudiants', FALSE),
(10, 1, 'info', 'Nouvel étudiant ajouté : Aliou Konté', '/admin/etudiants', FALSE);

-- 4. Réalignement des séquences d'identifiants
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 1) FROM roles));
SELECT setval('filieres_id_seq', (SELECT COALESCE(MAX(id), 1) FROM filieres));
SELECT setval('classes_id_seq', (SELECT COALESCE(MAX(id), 1) FROM classes));
SELECT setval('matieres_id_seq', (SELECT COALESCE(MAX(id), 1) FROM matieres));
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));
SELECT setval('enseignants_id_seq', (SELECT COALESCE(MAX(id), 1) FROM enseignants));
SELECT setval('etudiants_id_seq', (SELECT COALESCE(MAX(id), 1) FROM etudiants));
SELECT setval('emplois_du_temps_id_seq', (SELECT COALESCE(MAX(id), 1) FROM emplois_du_temps));
SELECT setval('edt_classe_id_seq', (SELECT COALESCE(MAX(id), 1) FROM edt_classe));
SELECT setval('cours_id_seq', (SELECT COALESCE(MAX(id), 1) FROM cours));
SELECT setval('fichiers_cours_id_seq', (SELECT COALESCE(MAX(id), 1) FROM fichiers_cours));
SELECT setval('communiques_id_seq', (SELECT COALESCE(MAX(id), 1) FROM communiques));
SELECT setval('messages_contact_id_seq', (SELECT COALESCE(MAX(id), 1) FROM messages_contact));
SELECT setval('notifications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM notifications));
SELECT setval('favoris_id_seq', (SELECT COALESCE(MAX(id), 1) FROM favoris));
SELECT setval('logs_id_seq', (SELECT COALESCE(MAX(id), 1) FROM logs));
