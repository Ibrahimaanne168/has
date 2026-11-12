-- ============================================================
-- Données sauvegardées pour : roles (3 lignes)
-- ============================================================

INSERT INTO "roles" ("id", "nom") VALUES (1, 'admin') ON CONFLICT DO NOTHING;
INSERT INTO "roles" ("id", "nom") VALUES (2, 'enseignant') ON CONFLICT DO NOTHING;
INSERT INTO "roles" ("id", "nom") VALUES (3, 'etudiant') ON CONFLICT DO NOTHING;
