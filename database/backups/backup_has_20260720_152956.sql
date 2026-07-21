-- Backup generated on 2026-07-20T15:29:56.485412
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `communiques` (`id`, `titre`, `contenu`, `image`, `fichier_pdf`, `auteur_id`, `mis_en_avant`, `archive`, `date_publication`) VALUES (1, 'Communiqué 2', 'délibération l1', 'uploads/communiques/IMG-20260612-WA0020.jpg', NULL, 1, 0, 0, NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cours` (`id`, `titre`, `description`, `matiere_id`, `enseignant_id`, `filiere_id`, `classe_id`, `niveau`, `lien_externe`) VALUES (1, 'Chapitre 1 POO', '', 1, 1, 1, 2, 'Licence 2', NULL);
INSERT INTO `cours` (`id`, `titre`, `description`, `matiere_id`, `enseignant_id`, `filiere_id`, `classe_id`, `niveau`, `lien_externe`) VALUES (2, 'Cours de Base de donnees', '', 6, 1, 2, 4, '', NULL);

DROP TABLE IF EXISTS `cours_classe`;
CREATE TABLE `cours_classe` (
  `cours_id` int(11) NOT NULL,
  `classe_id` int(11) NOT NULL,
  PRIMARY KEY (`cours_id`,`classe_id`),
  KEY `classe_id` (`classe_id`),
  CONSTRAINT `cours_classe_ibfk_1` FOREIGN KEY (`cours_id`) REFERENCES `cours` (`id`),
  CONSTRAINT `cours_classe_ibfk_2` FOREIGN KEY (`classe_id`) REFERENCES `classes` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cours_classe` (`cours_id`, `classe_id`) VALUES (1, 2);
INSERT INTO `cours_classe` (`cours_id`, `classe_id`) VALUES (1, 4);
INSERT INTO `cours_classe` (`cours_id`, `classe_id`) VALUES (1, 6);
INSERT INTO `cours_classe` (`cours_id`, `classe_id`) VALUES (2, 4);

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `edt_classe` (`id`, `edt_id`, `classe_id`) VALUES (1, 1, 1);
INSERT INTO `edt_classe` (`id`, `edt_id`, `classe_id`) VALUES (2, 1, 2);
INSERT INTO `edt_classe` (`id`, `edt_id`, `classe_id`) VALUES (3, 1, 3);
INSERT INTO `edt_classe` (`id`, `edt_id`, `classe_id`) VALUES (4, 1, 4);

DROP TABLE IF EXISTS `edt_filiere`;
CREATE TABLE `edt_filiere` (
  `edt_id` int(11) NOT NULL,
  `filiere_id` int(11) NOT NULL,
  PRIMARY KEY (`edt_id`,`filiere_id`),
  KEY `filiere_id` (`filiere_id`),
  CONSTRAINT `edt_filiere_ibfk_1` FOREIGN KEY (`edt_id`) REFERENCES `emplois_du_temps` (`id`),
  CONSTRAINT `edt_filiere_ibfk_2` FOREIGN KEY (`filiere_id`) REFERENCES `filieres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `edt_filiere` (`edt_id`, `filiere_id`) VALUES (1, 1);
INSERT INTO `edt_filiere` (`edt_id`, `filiere_id`) VALUES (1, 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `emplois_du_temps` (`id`, `classe_id`, `titre`, `fichier_pdf`, `fichier_image`, `date_publication`, `actif`) VALUES (1, 5, 'sema', NULL, 'uploads/edt/photo_2026-07-18_21-15-58.jpg', NULL, 1);

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

DROP TABLE IF EXISTS `enseignant_matiere`;
CREATE TABLE `enseignant_matiere` (
  `enseignant_id` int(11) NOT NULL,
  `matiere_id` int(11) NOT NULL,
  PRIMARY KEY (`enseignant_id`,`matiere_id`),
  KEY `matiere_id` (`matiere_id`),
  CONSTRAINT `enseignant_matiere_ibfk_1` FOREIGN KEY (`enseignant_id`) REFERENCES `enseignants` (`id`),
  CONSTRAINT `enseignant_matiere_ibfk_2` FOREIGN KEY (`matiere_id`) REFERENCES `matieres` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 1);
INSERT INTO `enseignant_matiere` (`enseignant_id`, `matiere_id`) VALUES (1, 6);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `enseignants` (`id`, `user_id`, `filiere_id`, `biographie`) VALUES (1, 2, 3, 'Etudiant en L3 Informatique.');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `etudiants` (`id`, `user_id`, `filiere_id`, `classe_id`, `matricule`) VALUES (1, 3, 1, 2, 'ETU001');

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `fichiers_cours` (`id`, `cours_id`, `type_fichier`, `nom_original`, `chemin_fichier`) VALUES (1, 1, 'pdf', 'Et3-5DiagSequence.pdf', '1_20260719123316_Et3-5DiagSequence.pdf');

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `logs` (`id`, `user_id`, `action`, `description`) VALUES (1, 3, 'telechargement_cours', 'Téléchargement de « Et3-5DiagSequence.pdf » (Chapitre 1 POO)');
INSERT INTO `logs` (`id`, `user_id`, `action`, `description`) VALUES (2, 3, 'telechargement_cours', 'Téléchargement de « Et3-5DiagSequence.pdf » (Chapitre 1 POO)');
INSERT INTO `logs` (`id`, `user_id`, `action`, `description`) VALUES (3, 3, 'telechargement_cours', 'Téléchargement de « Et3-5DiagSequence.pdf » (Chapitre 1 POO)');
INSERT INTO `logs` (`id`, `user_id`, `action`, `description`) VALUES (4, 3, 'telechargement_cours', 'Téléchargement de « Et3-5DiagSequence.pdf » (Chapitre 1 POO)');

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
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (2, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (4, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (4, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (4, 6);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (5, 2);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (5, 4);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (5, 6);
INSERT INTO `matiere_classe` (`matiere_id`, `classe_id`) VALUES (6, 2);

DROP TABLE IF EXISTS `matieres`;
CREATE TABLE `matieres` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `matieres` (`id`, `nom`) VALUES (1, 'Programmation Orientée Objet Python');
INSERT INTO `matieres` (`id`, `nom`) VALUES (2, 'Mécanique Générale ');
INSERT INTO `matieres` (`id`, `nom`) VALUES (4, 'Analyse 3');
INSERT INTO `matieres` (`id`, `nom`) VALUES (5, 'Algèbre 3');
INSERT INTO `matieres` (`id`, `nom`) VALUES (6, 'Base de données');

DROP TABLE IF EXISTS `messages_contact`;
CREATE TABLE `messages_contact` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nom` varchar(80) NOT NULL,
  `prenom` varchar(80) NOT NULL,
  `email` varchar(120) NOT NULL,
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `messages_contact` (`id`, `nom`, `prenom`, `email`, `telephone`, `sujet`, `destinataire_type`, `destinataire_id`, `message`, `reponse`, `lu`) VALUES (1, 'Samb', 'Ibrahima', 'anneibrahim5@gmail.com', NULL, '[Recommandation] Les cours', 'enseignant', 2, 'Vous etes trop rapide', NULL, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (4, 1, 'communique', 'Nouveau communiqué : Communiqué 2', '/etudiant/communiques', 1);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (5, 2, 'communique', 'Nouveau communiqué : Communiqué 2', '/etudiant/communiques', 1);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (6, 3, 'communique', 'Nouveau communiqué : Communiqué 2', '/etudiant/communiques', 1);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (7, 1, 'emploi_du_temps', 'Nouvel emploi du temps : sema', '/etudiant/edt', 1);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (8, 2, 'emploi_du_temps', 'Nouvel emploi du temps : sema', '/etudiant/edt', 1);
INSERT INTO `notifications` (`id`, `user_id`, `type`, `contenu`, `lien`, `lu`) VALUES (9, 3, 'emploi_du_temps', 'Nouvel emploi du temps : sema', '/etudiant/edt', 0);

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
  `email` varchar(120) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nom` varchar(80) NOT NULL,
  `prenom` varchar(80) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `login` (`login`),
  UNIQUE KEY `email` (`email`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`id`, `role_id`, `login`, `email`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (1, 1, 'admin', 'admin@has.sn', 'scrypt:32768:8:1$BbbumMm6c0EkKYWj$21f64b3cbee5f65a3bbfab5b973d7a27dca127479f240f7121a9b1d752881dcf411c1cadc6e3f1306c5c0dfd55ebcecf829b1992f28e36496066c57c2e6a05a5', 'Anne', 'Administrateur', '770000001', 'uploads/profils/ibrahima.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `email`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (2, 2, 'ibou', 'anneibrahima142@gmail.com', 'scrypt:32768:8:1$leXO9kgtHccSNvzv$5cde4182390e8d15f93b52e0be2da32511d25bd2587e0b02f0ef6245b0c1a55eb39cff0239c03c1b09e17f5b11c3b4bcb1a862a897d9832dd8819ff54311f36c', 'Anne', 'Ibrahima', '775518196', 'uploads/photos/user_2_ibrahima.jpg');
INSERT INTO `users` (`id`, `role_id`, `login`, `email`, `password_hash`, `nom`, `prenom`, `telephone`, `photo`) VALUES (3, 3, 'ibra', 'connectin4838@gmail.com', 'scrypt:32768:8:1$UTbpwXVpw9WfbZue$67a2211b4734b1ec2c3ea4d53073c49efa4391109ebc226bf2964ae3278df3e6dcb50cef0e895bf8a6b5bfc150c0aab168d82e5c7485b29e06a8efd317f7338f', 'Anne', 'Ibrahima', '775518107', NULL);

SET FOREIGN_KEY_CHECKS=1;
