-- Backup generated on 2026-07-20T16:44:40.965826
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filiere_id` int(11) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `niveau` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `filiere_id` (`filiere_id`),
  CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `classes` (`id`, `filiere_id`, `nom`, `niveau`) VALUES (1, 1, 'L1 MPI', 'Licence 1');
INSERT INTO `classes` (`id`, `filiere_id`, `nom`, `niveau`) VALUES (2, 1, 'L2 MPI', 'Licence 2');
INSERT INTO `classes` (`id`, `filiere_id`, `nom`, `niveau`) VALUES (3, 2, 'L1 SML', 'Licence 1');
INSERT INTO `classes` (`id`, `filiere_id`, `nom`, `niveau`) VALUES (4, 2, 'L2 SML', 'Licence 2');
INSERT INTO `classes` (`id`, `filiere_id`, `nom`, `niveau`) VALUES (5, 3, 'L1 MIASS', 'Licence 1');
INSERT INTO `classes` (`id`, `filiere_id`, `nom`, `niveau`) VALUES (6, 3, 'L2 MIASS', 'Licence 2');

DROP TABLE IF EXISTS `communiques`;
CREATE TABLE `communiques` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(150) NOT NULL,
  `contenu` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `fichier_pdf` varchar(255) DEFAULT NULL,
  `auteur_id` int(11) NOT NULL,
  `mis_en_avant` tinyint(1) DEFAULT 0,
  `archive` tinyint(1) DEFAULT 0,
  `date_publication` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `auteur_id` (`auteur_id`),
  CONSTRAINT `communiques_ibfk_1` FOREIGN KEY (`auteur_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cours`;
CREATE TABLE `cours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titre` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `matiere_id` int(11) NOT NULL,
  `enseignant_id` int(11) NOT NULL,
  `filiere_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  `niveau` varchar(30) DEFAULT NULL,
  `lien_externe` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `matiere_id` (`matiere_id`),
  KEY `enseignant_id` (`enseignant_id`),
  KEY `filiere_id` (`filiere_id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `cours_ibfk_1` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`),
  CONSTRAINT `cours_ibfk_2` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`),
  CONSTRAINT `cours_ibfk_3` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`),
  CONSTRAINT `cours_ibfk_4` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cours_classe`;
CREATE TABLE `cours_classe` (
  `cours_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  PRIMARY KEY (`cours_id`,`classe_id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `cours_classe_ibfk_1` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`),
  CONSTRAINT `cours_classe_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `edt_classe`;
CREATE TABLE `edt_classe` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `edt_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_edt_id` (`edt_id`),
  KEY `idx_classe_id` (`classe_id`),
  CONSTRAINT `fk_edt_classe_classe` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_edt_classe_edt` FOREIGN KEY (`edt_id`) REFERENCES `emplois_du_temps` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `edt_filiere`;
CREATE TABLE `edt_filiere` (
  `edt_id` int(11) NOT NULL,
  `filiere_id` int(11) NOT NULL,
  PRIMARY KEY (`edt_id`,`filiere_id`),
  KEY `filiere_id` (`filiere_id`),
  CONSTRAINT `edt_filiere_ibfk_1` FOREIGN KEY (`edt_id`) REFERENCES `emplois_du_temps` (`id`),
  CONSTRAINT `edt_filiere_ibfk_2` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `emplois_du_temps`;
CREATE TABLE `emplois_du_temps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `classe_id` int(11) NOT NULL,
  `titre` varchar(150) DEFAULT NULL,
  `fichier_pdf` varchar(255) DEFAULT NULL,
  `fichier_image` varchar(255) DEFAULT NULL,
  `date_publication` date DEFAULT NULL,
  `actif` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `emplois_du_temps_ibfk_1` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `enseignant_filiere`;
CREATE TABLE `enseignant_filiere` (
  `enseignant_id` int(11) NOT NULL,
  `filiere_id` int(11) NOT NULL,
  PRIMARY KEY (`enseignant_id`,`filiere_id`),
  KEY `filiere_id` (`filiere_id`),
  CONSTRAINT `enseignant_filiere_ibfk_1` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`),
  CONSTRAINT `enseignant_filiere_ibfk_2` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (1, 1);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (1, 2);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (1, 3);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (2, 1);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (2, 2);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (2, 3);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (3, 1);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (3, 2);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (4, 1);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (4, 2);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (5, 1);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (5, 2);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (5, 3);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (6, 1);
INSERT INTO `enseignant_filiere` (`enseignant_id`, `filiere_id`) VALUES (6, 2);

DROP TABLE IF EXISTS `enseignant_matiere`;
CREATE TABLE `enseignant_matiere` (
  `enseignant_id` int(11) NOT NULL,
  `matiere_id` int(11) NOT NULL,
  PRIMARY KEY (`enseignant_id`,`matiere_id`),
  KEY `matiere_id` (`matiere_id`),
  CONSTRAINT `enseignant_matiere_ibfk_1` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`),
  CONSTRAINT `enseignant_matiere_ibfk_2` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 4);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 5);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 7);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 9);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 10);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 15);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 16);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (2, 1);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (2, 2);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (3, 6);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (3, 12);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (3, 17);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (3, 18);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (4, 3);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (5, 11);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (5, 19);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (6, 12);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (6, 13);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (6, 17);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (6, 18);

DROP TABLE IF EXISTS `enseignants`;
CREATE TABLE `enseignants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `filiere_id` int(11) DEFAULT NULL,
  `biographie` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  KEY `filiere_id` (`filiere_id`),
  CONSTRAINT `enseignants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `enseignants_ibfk_2` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (1, 2, 3, 'Etudiant en L3 Mathématique et Modélisation');
INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (2, 3, 3, 'Etudiant en L3 Informatique');
INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (3, 4, 1, 'Etudiant en L3 Physique et Application');
INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (4, 5, 1, 'Etudiant en L3 Physique et Applications');
INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (5, 7, 3, 'Etudiant en L3 Informatique');
INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (6, 8, 1, 'Etudiant en L3 Physique et Applications');

DROP TABLE IF EXISTS `etudiants`;
CREATE TABLE `etudiants` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `filiere_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  `matricule` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`),
  UNIQUE KEY `matricule` (`matricule`),
  KEY `filiere_id` (`filiere_id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `etudiants_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `etudiants_ibfk_2` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`),
  CONSTRAINT `etudiants_ibfk_3` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `favoris`;
CREATE TABLE `favoris` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `etudiant_id` int(11) NOT NULL,
  `cours_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_favori` (`etudiant_id`,`cours_id`),
  KEY `cours_id` (`cours_id`),
  CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`etudiant_id`) REFERENCES `etudiants` (`id`),
  CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `fichiers_cours`;
CREATE TABLE `fichiers_cours` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cours_id` int(11) NOT NULL,
  `type_fichier` enum('pdf','ppt','word','video','autre') NOT NULL,
  `nom_original` varchar(255) NOT NULL,
  `chemin_fichier` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `cours_id` (`cours_id`),
  CONSTRAINT `fichiers_cours_ibfk_1` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `filieres`;
CREATE TABLE `filieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `filieres` (`id`, `nom`, `description`) VALUES (1, 'MPI', 'Mathématiques Physique et Informatique');
INSERT INTO `filieres` (`id`, `nom`, `description`) VALUES (2, 'SML', 'Sciences de la Mer et du Littoral');
INSERT INTO `filieres` (`id`, `nom`, `description`) VALUES (3, 'MIASS', 'Mathématiques et Informatique Appliquées aux Sciences Sociales');

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `action` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `matiere_classe`;
CREATE TABLE `matiere_classe` (
  `matiere_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  PRIMARY KEY (`matiere_id`,`classe_id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `matiere_classe_ibfk_1` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`),
  CONSTRAINT `matiere_classe_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (1, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (1, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (1, 6);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (2, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (3, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (3, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (4, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (4, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (4, 6);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (5, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (5, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (5, 6);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (6, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (6, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (7, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (7, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (8, 6);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (9, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (9, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (9, 5);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (10, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (10, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (10, 5);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (11, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (11, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (11, 5);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (12, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (12, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (13, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (13, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (14, 5);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (15, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (15, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (15, 5);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (16, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (16, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (16, 5);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (17, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (17, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (18, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (18, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (19, 1);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (19, 3);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (19, 5);

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE `matieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `matieres` (`id`, `nom`) VALUES (1, 'Programmation Orientée Objet Python');
INSERT INTO `matieres` (`id`, `nom`) VALUES (2, 'Base de données');
INSERT INTO `matieres` (`id`, `nom`) VALUES (3, 'Mécanique Générale ');
INSERT INTO `matieres` (`id`, `nom`) VALUES (4, 'Analyse 3');
INSERT INTO `matieres` (`id`, `nom`) VALUES (5, 'Algèbre 3');
INSERT INTO `matieres` (`id`, `nom`) VALUES (6, 'Thermodynamique');
INSERT INTO `matieres` (`id`, `nom`) VALUES (7, 'Analyse Numérique Matricielle');
INSERT INTO `matieres` (`id`, `nom`) VALUES (8, 'Economie');
INSERT INTO `matieres` (`id`, `nom`) VALUES (9, 'Analyse 1');
INSERT INTO `matieres` (`id`, `nom`) VALUES (10, 'Algèbre 1');
INSERT INTO `matieres` (`id`, `nom`) VALUES (11, 'Programmation Python');
INSERT INTO `matieres` (`id`, `nom`) VALUES (12, 'Mécanique du point');
INSERT INTO `matieres` (`id`, `nom`) VALUES (13, 'Eléctricité');
INSERT INTO `matieres` (`id`, `nom`) VALUES (14, 'Economie');
INSERT INTO `matieres` (`id`, `nom`) VALUES (15, 'Analyse 2');
INSERT INTO `matieres` (`id`, `nom`) VALUES (16, 'Algèbre 2');
INSERT INTO `matieres` (`id`, `nom`) VALUES (17, 'Magnétostatique et Régime Variable');
INSERT INTO `matieres` (`id`, `nom`) VALUES (18, 'Optique Géométrique');
INSERT INTO `matieres` (`id`, `nom`) VALUES (19, 'Langage C');

DROP TABLE IF EXISTS `messages_contact`;
CREATE TABLE `messages_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(80) NOT NULL,
  `prenom` varchar(80) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `sujet` varchar(150) NOT NULL,
  `destinataire_type` enum('administration','direction','responsable_pedagogique','enseignant') NOT NULL,
  `destinataire_id` int(11) DEFAULT NULL,
  `message` text NOT NULL,
  `reponse` text DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `destinataire_id` (`destinataire_id`),
  CONSTRAINT `messages_contact_ibfk_1` FOREIGN KEY (`destinataire_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `type` enum('cours','communique','emploi_du_temps','message','mot_de_passe','info') NOT NULL,
  `contenu` varchar(255) NOT NULL,
  `lien` varchar(255) DEFAULT NULL,
  `lu` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (1, 1, 'info', 'Nouvel enseignant ajouté : Pape Ibrahima SAMB', '/admin/enseignants', 0);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (2, 1, 'info', 'Nouvel enseignant ajouté : Ibrahima Anne', '/admin/enseignants', 0);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (3, 1, 'info', 'Nouvel enseignant ajouté : Ndiogou  Ndiaye', '/admin/enseignants', 0);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (4, 1, 'info', 'Nouvel enseignant ajouté : El Hadji Ibrahima Diop Sow', '/admin/enseignants', 0);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (5, 1, 'info', 'Nouvel enseignant ajouté : Pape Thiam', '/admin/enseignants', 0);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (6, 1, 'info', 'Nouvel enseignant ajouté : Kalidou Ba', '/admin/enseignants', 0);

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(30) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nom` (`nom`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `roles` (`id`, `nom`) VALUES (1, 'admin');
INSERT INTO `roles` (`id`, `nom`) VALUES (2, 'enseignant');
INSERT INTO `roles` (`id`, `nom`) VALUES (3, 'etudiant');

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role_id` int(11) NOT NULL,
  `login` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nom` varchar(80) NOT NULL,
  `prenom` varchar(80) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (1, 1, 'halil', 'scrypt:32768:8:1$v0Api9oHkCGM5Vfl$fe8ec4836e2853f6e1e5220b7548589d2d667555bb8f758bd12802139de3ce34f5de8bc4a2f230f40fe482bbdec73821a47083e05dd35ee9bbe615b5c59f2b88', 'Samb', 'Pape Ibrahima', '756502017', 'uploads/profils/directeur.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (2, 2, 'papa', 'scrypt:32768:8:1$Wxp9U9s5dulcD32a$e3fc8111fd972044aa219d531799659f872ee9e9d81e79d9d14baf01e08173f5fc1164453032b70464a0dc601da706a75076729e3bdecc5958c07f2070de16e4', 'Samb', 'Pape Ibrahima', '756502017', 'uploads/profs/photo_2026-07-20_16-18-59.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (3, 2, 'ibou', 'scrypt:32768:8:1$IzgB8FdQwBXo5tUL$76db724a962fb3982eee8b473c5806276da6b3b705e6fb2432f23d331133541fd0e0a25c889743440fca7842161d25b03b7eb67c2f1844471e7abef1560db105', 'Anne', 'Ibrahima', '775518196', 'uploads/profs/ibrahima.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (4, 2, 'ndiogou', 'scrypt:32768:8:1$mnmRn5B4TESoAd9c$166062b717e5387bcead2606c4589997f3fbef6f4eb7b7d1bafd6d1b929ad6312c92bfdec5552540c152ed172bd41e94e774d19edbab8741563f7d5f1178f511', 'Ndiaye', 'Ndiogou ', '772772709', 'uploads/profs/photo_2026-07-20_16-14-39.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (5, 2, 'diopsow', 'scrypt:32768:8:1$83xY8DnIbubywc6c$2965eb93bab4bf6038cf8ea02d71b638cf23aab0bc3123174c7dfcad16c26b9265eb75665a6bfe572b9e0c3f390ab37c981968ce73964d2b6fb666afc2b9a75d', 'Sow', 'El Hadji Ibrahima Diop', '776689777', 'uploads/profs/photo_2026-07-20_16-29-37.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (7, 2, 'papethiam', 'scrypt:32768:8:1$gfQSkMCQuj6O7Qfp$374016e8b5b84582453ddb3a2ce2f0de43b34add4a0997bc7a4dc489b41e8cf730fcc912ca14e06b25df85108a2d9b375fbaf267980c2929bc1aee8ee6c7716b', 'Thiam', 'Pape', '787318427', NULL);
INSERT INTO `users` (`id`, `role_id`, `login`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (8, 2, 'kalidou', 'scrypt:32768:8:1$oHo8GTwVHPls7mba$74090a56d3eab1fc6933c82563c9c62ac7bb49ce22143868280bb7122bc5a2d9c1176f763c9c14f3145f125c736a9e9312ce31f1fd6c074bfe787a73b05c5a9b', 'Ba', 'Kalidou', '782718397', NULL);

SET FOREIGN_KEY_CHECKS=1;
