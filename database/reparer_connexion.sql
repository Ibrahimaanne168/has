-- ============================================================
-- RÉPARER LA CONNEXION APRÈS MIGRATION SUPABASE
-- À exécuter dans le SQL Editor du NOUVEAU projet Supabase
-- ============================================================

-- 1. Fixer les colonnes NULL dans auth.users
--    (NE PAS toucher 'phone' — contrainte UNIQUE, doit rester NULL)
UPDATE auth.users 
SET 
  confirmation_token      = COALESCE(confirmation_token, ''),
  recovery_token          = COALESCE(recovery_token, ''),
  email_change_token_new  = COALESCE(email_change_token_new, ''),
  email_change            = COALESCE(email_change, ''),
  phone_change            = COALESCE(phone_change, ''),
  phone_change_token      = COALESCE(phone_change_token, ''),
  email_change_token_current = COALESCE(email_change_token_current, ''),
  reauthentication_token  = COALESCE(reauthentication_token, '')
;

-- 2. Permettre la lecture publique des profils
--    (nécessaire pour la recherche par username/email AVANT connexion)
DROP POLICY IF EXISTS "public_read_profiles" ON public.profiles;
CREATE POLICY "public_read_profiles" ON public.profiles
  FOR SELECT USING (true);

-- 3. Vérification : compter les utilisateurs auth
SELECT COUNT(*) AS total_users FROM auth.users;

-- 4. Vérification : compter les profils visibles en anon
SELECT COUNT(*) AS total_profiles FROM public.profiles;
