-- ============================================================
-- Données sauvegardées pour : classes (6 lignes)
-- ============================================================

INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (1, 1, 'L1 MPI', 'Licence 1') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (2, 1, 'L2 MPI', 'Licence 2') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (3, 2, 'L1 SML', 'Licence 1') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (4, 2, 'L2 SML', 'Licence 2') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (5, 3, 'L1 MIASS', 'Licence 1') ON CONFLICT DO NOTHING;
INSERT INTO "classes" ("id", "filiere_id", "nom", "niveau") VALUES (6, 3, 'L2 MIASS', 'Licence 2') ON CONFLICT DO NOTHING;
