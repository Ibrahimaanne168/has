-- ============================================================
-- Données sauvegardées pour : cours (4 lignes)
-- ============================================================

INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (1, 'Introduction à la Programmation Python & Algorithmique', 'Cours fondamental sur les bases du langage Python, les structures conditionnelles, boucles et fonctions.', 11, 2, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (2, 'Analyse 1 : Suites numériques et Continuité', 'Définition des limites, théorèmes de comparaison, fonctions continues et dérivabilité.', 9, 1, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (3, 'Mécanique du Point Matériel', 'Cinématique, lois de Newton, oscillateurs harmoniques et travail-énergie.', 12, 3, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
INSERT INTO "cours" ("id", "titre", "description", "matiere_id", "enseignant_id", "filiere_id", "classe_id", "niveau", "lien_externe") VALUES (4, 'Algèbre Linéaire 1 : Espaces Vectoriels', 'Sous-espaces vectoriels, familles génératrices, bases et dimensions.', 10, 1, 1, 1, 'Licence 1', NULL) ON CONFLICT DO NOTHING;
