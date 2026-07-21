-- ============================================================
-- Plateforme Web HAS - Schéma MySQL simplifié
-- ============================================================

CREATE DATABASE IF NOT EXISTS has_platform
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE has_platform;

-- ROLES
CREATE TABLE roles (
    id   INT AUTO_INCREMENT PRIMARY KEY,
    nom  VARCHAR(30) NOT NULL UNIQUE       -- admin, enseignant, etudiant
) ENGINE=InnoDB;

-- USERS
CREATE TABLE users (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    role_id        INT NOT NULL,
    login          VARCHAR(50) NOT NULL UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    nom            VARCHAR(80) NOT NULL,
    prenom         VARCHAR(80) NOT NULL,
    telephone      VARCHAR(20),
    photo          VARCHAR(255),
    FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB;

-- FILIERES
CREATE TABLE filieres (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL,
    description TEXT
) ENGINE=InnoDB;

-- CLASSES
CREATE TABLE classes (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    filiere_id  INT NOT NULL,
    nom         VARCHAR(100) NOT NULL,
    niveau      VARCHAR(30),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
) ENGINE=InnoDB;

-- MATIERES
CREATE TABLE matieres (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nom         VARCHAR(100) NOT NULL
) ENGINE=InnoDB;

-- MATIERE_CLASSES (matières associées à plusieurs classes)
CREATE TABLE matiere_classe (
    matiere_id INT NOT NULL,
    classe_id  INT NOT NULL,
    PRIMARY KEY (matiere_id, classe_id),
    FOREIGN KEY (matiere_id) REFERENCES matieres(id),
    FOREIGN KEY (classe_id) REFERENCES classes(id)
) ENGINE=InnoDB;

-- ENSEIGNANTS
CREATE TABLE enseignants (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL UNIQUE,
    filiere_id   INT,
    biographie   TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
) ENGINE=InnoDB;

-- ENSEIGNANT_FILIERES (filières encadrées par un enseignant)
CREATE TABLE enseignant_filiere (
    enseignant_id INT NOT NULL,
    filiere_id    INT NOT NULL,
    PRIMARY KEY (enseignant_id, filiere_id),
    FOREIGN KEY (enseignant_id) REFERENCES enseignants(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
) ENGINE=InnoDB;

-- ENSEIGNANT_MATIERE (matières enseignées, many-to-many)
CREATE TABLE enseignant_matiere (
    enseignant_id INT NOT NULL,
    matiere_id    INT NOT NULL,
    PRIMARY KEY (enseignant_id, matiere_id),
    FOREIGN KEY (enseignant_id) REFERENCES enseignants(id),
    FOREIGN KEY (matiere_id) REFERENCES matieres(id)
) ENGINE=InnoDB;

-- ETUDIANTS
CREATE TABLE etudiants (
    id           INT AUTO_INCREMENT PRIMARY KEY,
    user_id      INT NOT NULL UNIQUE,
    filiere_id   INT NOT NULL,
    classe_id    INT NOT NULL,
    matricule    VARCHAR(30) UNIQUE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id),
    FOREIGN KEY (classe_id) REFERENCES classes(id)
) ENGINE=InnoDB;

-- EMPLOIS_DU_TEMPS
CREATE TABLE emplois_du_temps (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    classe_id        INT NOT NULL,
    titre            VARCHAR(150),
    fichier_pdf      VARCHAR(255),
    fichier_image    VARCHAR(255),
    date_publication DATE,
    actif            BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (classe_id) REFERENCES classes(id)
) ENGINE=InnoDB;

-- EDT_FILIERES (filières concernées par l'emploi du temps)
CREATE TABLE edt_filiere (
    edt_id      INT NOT NULL,
    filiere_id  INT NOT NULL,
    PRIMARY KEY (edt_id, filiere_id),
    FOREIGN KEY (edt_id) REFERENCES emplois_du_temps(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id)
) ENGINE=InnoDB;

-- COURS
CREATE TABLE cours (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    titre         VARCHAR(150) NOT NULL,
    description   TEXT,
    matiere_id    INT NOT NULL,
    enseignant_id INT NOT NULL,
    filiere_id    INT NOT NULL,
    classe_id     INT NOT NULL,
    niveau        VARCHAR(30),
    lien_externe  VARCHAR(255),
    FOREIGN KEY (matiere_id) REFERENCES matieres(id),
    FOREIGN KEY (enseignant_id) REFERENCES enseignants(id),
    FOREIGN KEY (filiere_id) REFERENCES filieres(id),
    FOREIGN KEY (classe_id) REFERENCES classes(id)
) ENGINE=InnoDB;

-- COURS_CLASSES (classes concernées par un cours)
CREATE TABLE cours_classe (
    cours_id   INT NOT NULL,
    classe_id  INT NOT NULL,
    PRIMARY KEY (cours_id, classe_id),
    FOREIGN KEY (cours_id) REFERENCES cours(id),
    FOREIGN KEY (classe_id) REFERENCES classes(id)
) ENGINE=InnoDB;

-- FICHIERS_COURS
CREATE TABLE fichiers_cours (
    id             INT AUTO_INCREMENT PRIMARY KEY,
    cours_id       INT NOT NULL,
    type_fichier   ENUM('pdf', 'ppt', 'word', 'video', 'autre') NOT NULL,
    nom_original   VARCHAR(255) NOT NULL,
    chemin_fichier VARCHAR(255) NOT NULL,
    FOREIGN KEY (cours_id) REFERENCES cours(id)
) ENGINE=InnoDB;

-- COMMUNIQUES
CREATE TABLE communiques (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    titre            VARCHAR(150) NOT NULL,
    contenu          TEXT NOT NULL,
    image            VARCHAR(255),
    fichier_pdf      VARCHAR(255),
    auteur_id        INT NOT NULL,
    mis_en_avant     BOOLEAN DEFAULT FALSE,
    archive          BOOLEAN DEFAULT FALSE,
    date_publication DATE,
    FOREIGN KEY (auteur_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- MESSAGES_CONTACT
CREATE TABLE messages_contact (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    nom               VARCHAR(80) NOT NULL,
    prenom            VARCHAR(80) NOT NULL,
    telephone         VARCHAR(20),
    sujet             VARCHAR(150) NOT NULL,
    destinataire_type ENUM('administration', 'direction', 'responsable_pedagogique', 'enseignant') NOT NULL,
    destinataire_id   INT,
    message           TEXT NOT NULL,
    reponse           TEXT,
    lu                BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (destinataire_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- NOTIFICATIONS
CREATE TABLE notifications (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    user_id  INT NOT NULL,
    type     ENUM('cours', 'communique', 'emploi_du_temps', 'message', 'mot_de_passe', 'info') NOT NULL,
    contenu  VARCHAR(255) NOT NULL,
    lien     VARCHAR(255),
    lu       BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- FAVORIS
CREATE TABLE favoris (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    etudiant_id INT NOT NULL,
    cours_id    INT NOT NULL,
    UNIQUE KEY uniq_favori (etudiant_id, cours_id),
    FOREIGN KEY (etudiant_id) REFERENCES etudiants(id),
    FOREIGN KEY (cours_id) REFERENCES cours(id)
) ENGINE=InnoDB;

-- LOGS
CREATE TABLE logs (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT,
    action      VARCHAR(50) NOT NULL,      -- connexion, suppression, depot_cours, etc.
    description VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id)
) ENGINE=InnoDB;

-- EDT -> classes (permet d'associer plusieurs classes à un edt)
CREATE TABLE IF NOT EXISTS edt_classe (
    id INT AUTO_INCREMENT PRIMARY KEY,
    edt_id INT NOT NULL,
    classe_id INT NOT NULL,
    INDEX idx_edt_id (edt_id),
    INDEX idx_classe_id (classe_id),
    CONSTRAINT fk_edt_classe_edt FOREIGN KEY (edt_id) REFERENCES emplois_du_temps(id) ON DELETE CASCADE,
    CONSTRAINT fk_edt_classe_classe FOREIGN KEY (classe_id) REFERENCES classes(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Données de base
INSERT INTO roles (nom) VALUES ('admin'), ('enseignant'), ('etudiant');

INSERT INTO filieres (nom, description)
VALUES
('MPI', 'Mathématiques Physique et Informatique'),
('SML', 'Sciences de la Mer et du Littoral'),
('MIASS', 'Mathématiques et Informatique Appliquées aux Sciences Sociales');


INSERT INTO classes (filiere_id, nom, niveau)
VALUES
(1, 'L1 MPI', 'Licence 1'),
(1, 'L2 MPI', 'Licence 2'),
(2, 'L1 SML', 'Licence 1'),
(2, 'L2 SML', 'Licence 2'),
(3, 'L1 MIASS', 'Licence 1'),
(3, 'L2 MIASS', 'Licence 2');


INSERT INTO users
(role_id, login, password_hash, nom, prenom, telephone, photo)
VALUES
(
1,
'halil',
'scrypt:32768:8:1$v0Api9oHkCGM5Vfl$fe8ec4836e2853f6e1e5220b7548589d2d667555bb8f758bd12802139de3ce34f5de8bc4a2f230f40fe482bbdec73821a47083e05dd35ee9bbe615b5c59f2b88',
'Samb',
'Pape Ibrahima',
'756502017',
'ibou.png'
);
