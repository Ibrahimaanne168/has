-- ============================================================
-- Données sauvegardées pour : fichiers_cours (3 lignes)
-- ============================================================

INSERT INTO "fichiers_cours" ("id", "cours_id", "type_fichier", "nom_original", "chemin_fichier") VALUES (1, 1, 'pdf', 'Support_Python_Chapitre1.pdf', 'uploads/cours/Support_Python_Chapitre1.pdf') ON CONFLICT DO NOTHING;
INSERT INTO "fichiers_cours" ("id", "cours_id", "type_fichier", "nom_original", "chemin_fichier") VALUES (2, 2, 'pdf', 'TD_Analyse_1_Suites.pdf', 'uploads/cours/TD_Analyse_1_Suites.pdf') ON CONFLICT DO NOTHING;
INSERT INTO "fichiers_cours" ("id", "cours_id", "type_fichier", "nom_original", "chemin_fichier") VALUES (3, 3, 'pdf', 'Exercices_Mecanique_Point.pdf', 'uploads/cours/Exercices_Mecanique_Point.pdf') ON CONFLICT DO NOTHING;
