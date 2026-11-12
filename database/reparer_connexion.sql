-- ==============================================================================
-- RÉPARATION IMMÉDIATE DE L'AUTHENTIFICATION & DES PROFILS SUPABASE (HAS)
-- À COPIER-COLLER DANS LE "SQL EDITOR" DE VOTRE NOUVEAU PROJET SUPABASE ET CLIQUER SUR "RUN"
-- ==============================================================================

-- 1. Réparer les colonnes NULL dans auth.users
-- GoTrue (le moteur d'authentification Supabase) plante avec l'erreur "Database error querying schema"
-- lorsque des colonnes comme recovery_token ou email_change sont NULL. Cette commande les initialise proprement.
UPDATE auth.users 
SET 
  confirmation_token = COALESCE(confirmation_token, ''),
  recovery_token = COALESCE(recovery_token, ''),
  email_change_token_new = COALESCE(email_change_token_new, ''),
  email_change = COALESCE(email_change, ''),
  phone = COALESCE(phone, ''),
  phone_change = COALESCE(phone_change, ''),
  phone_change_token = COALESCE(phone_change_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token = COALESCE(reauthentication_token, '')
;

-- 2. Autoriser la lecture de la table profiles pour que le formulaire de connexion
-- puisse vérifier les identifiants et trouver les emails associés aux usernames.
DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles FOR SELECT USING (true);

-- Confirmation de succès
DO $$
BEGIN
    RAISE NOTICE '✓ Authentification et profils réparés avec succès !';
END $$;
