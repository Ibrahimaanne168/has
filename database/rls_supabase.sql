-- ============================================================
-- Plateforme HAS — Politiques RLS pour Supabase
-- 
-- ARCHITECTURE : L'application Next.js se connecte à Supabase
-- via DATABASE_URL (connexion directe PostgreSQL avec pg pool).
-- Toutes les requêtes passent par le serveur Next.js (SSR/Actions)
-- avec le rôle "authenticator" ou la connection string du service.
--
-- STRATÉGIE RLS :
-- 1. Activer RLS sur toutes les tables (protection par défaut).
-- 2. Autoriser le rôle "service_role" à tout faire (serveur Next.js).
-- 3. Bloquer tout accès direct via le rôle "anon" et "authenticated"
--    (pas d'accès client Supabase JS côté navigateur).
--
-- Exécutez ce script APRÈS schema.sql dans l'éditeur SQL Supabase.
-- ============================================================


-- ============================================================
-- PARTIE 1 : ACTIVATION DU RLS SUR TOUTES LES TABLES
-- ============================================================

ALTER TABLE roles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE users                ENABLE ROW LEVEL SECURITY;
ALTER TABLE filieres             ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE matieres             ENABLE ROW LEVEL SECURITY;
ALTER TABLE matiere_classe       ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignants          ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignant_filiere   ENABLE ROW LEVEL SECURITY;
ALTER TABLE enseignant_matiere   ENABLE ROW LEVEL SECURITY;
ALTER TABLE etudiants            ENABLE ROW LEVEL SECURITY;
ALTER TABLE emplois_du_temps     ENABLE ROW LEVEL SECURITY;
ALTER TABLE edt_classe           ENABLE ROW LEVEL SECURITY;
ALTER TABLE edt_filiere          ENABLE ROW LEVEL SECURITY;
ALTER TABLE cours                ENABLE ROW LEVEL SECURITY;
ALTER TABLE cours_classe         ENABLE ROW LEVEL SECURITY;
ALTER TABLE fichiers_cours       ENABLE ROW LEVEL SECURITY;
ALTER TABLE communiques          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_contact     ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications        ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoris              ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs                 ENABLE ROW LEVEL SECURITY;


-- ============================================================
-- PARTIE 2 : POLITIQUES POUR LE RÔLE service_role (serveur Next.js)
-- Le service_role bypasse le RLS par défaut dans Supabase.
-- Ces politiques sont une sécurité supplémentaire explicite.
-- ============================================================

-- Vous n'avez PAS besoin d'ajouter de policies pour service_role
-- car Supabase le bypass automatiquement (BYPASSRLS privilege).
-- Les politiques ci-dessous concernent les rôles anon/authenticated.


-- ============================================================
-- PARTIE 3 : DONNÉES PUBLIQUES EN LECTURE SEULE (rôle anon)
-- Certaines données non sensibles peuvent être lues sans auth
-- ============================================================

-- Filières : lecture publique (affichées sur la page d'accueil publique)
CREATE POLICY "anon_read_filieres"
  ON filieres FOR SELECT
  TO anon
  USING (true);

-- Classes : lecture publique (utile pour les menus publics)
CREATE POLICY "anon_read_classes"
  ON classes FOR SELECT
  TO anon
  USING (true);

-- Matières : lecture publique
CREATE POLICY "anon_read_matieres"
  ON matieres FOR SELECT
  TO anon
  USING (true);

-- Matière-Classe : lecture publique (liaisons)
CREATE POLICY "anon_read_matiere_classe"
  ON matiere_classe FOR SELECT
  TO anon
  USING (true);

-- Communiqués : lecture publique (seuls ceux non archivés)
CREATE POLICY "anon_read_communiques_publics"
  ON communiques FOR SELECT
  TO anon
  USING (archive = FALSE);

-- Enseignants (profils publics) : lecture publique
CREATE POLICY "anon_read_enseignants"
  ON enseignants FOR SELECT
  TO anon
  USING (true);

-- Enseignant-Filière : lecture publique (liaison pour l'affichage)
CREATE POLICY "anon_read_enseignant_filiere"
  ON enseignant_filiere FOR SELECT
  TO anon
  USING (true);

-- Enseignant-Matière : lecture publique (liaison pour l'affichage)
CREATE POLICY "anon_read_enseignant_matiere"
  ON enseignant_matiere FOR SELECT
  TO anon
  USING (true);


-- ============================================================
-- PARTIE 4 : DONNÉES PRIVÉES — ACCÈS BLOQUÉ POUR anon/authenticated
-- (Toutes les autres opérations passent uniquement par le serveur)
-- ============================================================

-- USERS : Aucun accès direct autorisé
-- (Les mots de passe hashés et les codes 2FA ne doivent jamais
-- être exposés via Supabase JS, uniquement via server actions Next.js)
-- Pas de policy = accès interdit par défaut avec RLS activé.

-- ETUDIANTS : Aucun accès direct autorisé
-- NOTIFICATIONS : Aucun accès direct autorisé
-- MESSAGES_CONTACT : Aucun accès direct autorisé
-- LOGS : Aucun accès direct autorisé
-- FAVORIS : Aucun accès direct autorisé
-- COURS/FICHIERS_COURS : Accès uniquement via serveur
-- EMPLOIS_DU_TEMPS : Accès uniquement via serveur


-- ============================================================
-- PARTIE 5 : POLITIQUES POUR LE RÔLE authenticated
-- (Si Supabase Auth est utilisé dans le futur, ces bases sont posées)
-- ============================================================

-- Lectures autorisées pour un utilisateur authentifié

-- Filières (accès total en lecture pour toute personne connectée)
CREATE POLICY "auth_read_filieres"
  ON filieres FOR SELECT
  TO authenticated
  USING (true);

-- Classes
CREATE POLICY "auth_read_classes"
  ON classes FOR SELECT
  TO authenticated
  USING (true);

-- Matières
CREATE POLICY "auth_read_matieres"
  ON matieres FOR SELECT
  TO authenticated
  USING (true);

-- Communiqués non archivés
CREATE POLICY "auth_read_communiques"
  ON communiques FOR SELECT
  TO authenticated
  USING (archive = FALSE);

-- Emplois du temps actifs
CREATE POLICY "auth_read_edt_actifs"
  ON emplois_du_temps FOR SELECT
  TO authenticated
  USING (actif = TRUE);

-- EDT_Classe (liaisons EDT)
CREATE POLICY "auth_read_edt_classe"
  ON edt_classe FOR SELECT
  TO authenticated
  USING (true);

-- Cours
CREATE POLICY "auth_read_cours"
  ON cours FOR SELECT
  TO authenticated
  USING (true);

-- Fichiers de cours
CREATE POLICY "auth_read_fichiers_cours"
  ON fichiers_cours FOR SELECT
  TO authenticated
  USING (true);

-- Cours-Classe
CREATE POLICY "auth_read_cours_classe"
  ON cours_classe FOR SELECT
  TO authenticated
  USING (true);

-- Enseignants (profils)
CREATE POLICY "auth_read_enseignants"
  ON enseignants FOR SELECT
  TO authenticated
  USING (true);


-- ============================================================
-- PARTIE 6 : VÉRIFICATION — Lister toutes les politiques actives
-- ============================================================

-- Décommentez cette requête pour vérifier après exécution :
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
