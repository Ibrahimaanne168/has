-- ============================================================
-- Données sauvegardées pour : enseignants (8 lignes)
-- ============================================================

INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (1, 2, 3, 'Enseignant-chercheur en Mathématiques et Modélisation stochastique') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (2, 3, 3, 'Spécialiste en Génie Logiciel, Algorithmique et Programmation') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (3, 4, 1, 'Physicien, spécialiste en Mécanique Analytique et Thermodynamique') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (4, 5, 1, 'Enseignant en Physique Appliquée et Ondes') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (5, 6, 3, 'Ingénieur Informatique, architectures Web et Systèmes') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (6, 7, 1, 'Professeur de Sciences Physiques et Électromagnétisme') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (7, 14, 3, 'Enseignant en Finance des entreprises, Gestion financière et Économie pour la filière MIASS.') ON CONFLICT DO NOTHING;
INSERT INTO "enseignants" ("id", "user_id", "filiere_id", "biographie") VALUES (8, 15, 1, 'Professeur de Mathématiques - Nouveaux Bacheliers (NB)') ON CONFLICT DO NOTHING;
