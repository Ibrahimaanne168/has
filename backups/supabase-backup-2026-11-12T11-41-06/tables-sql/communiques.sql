-- ============================================================
-- Données sauvegardées pour : communiques (2 lignes)
-- ============================================================

INSERT INTO "communiques" ("id", "titre", "contenu", "image", "fichier_pdf", "auteur_id", "mis_en_avant", "archive", "date_publication") VALUES (1, 'Bienvenue sur la plateforme académique HAS', 'Chers étudiants et professeurs, nous sommes ravis de vous accueillir sur votre nouvel espace numérique dédié aux cours, emplois du temps et communiqués officiels.', NULL, NULL, 1, TRUE, FALSE, '2026-09-28') ON CONFLICT DO NOTHING;
INSERT INTO "communiques" ("id", "titre", "contenu", "image", "fichier_pdf", "auteur_id", "mis_en_avant", "archive", "date_publication") VALUES (2, 'Début des sessions de renforcement intensif', 'Les cours de renforcement en Analyse, Algèbre et Programmation débuteront dès lundi prochain à 09h00 selon le planning affiché dans votre espace.', NULL, NULL, 1, TRUE, FALSE, '2026-09-28') ON CONFLICT DO NOTHING;
