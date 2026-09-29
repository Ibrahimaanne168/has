-- ============================================================
-- TABLE PROFILES — À exécuter dans Supabase SQL Editor
-- Requise pour l'authentification de la plateforme HAS
-- ============================================================

-- Création de la table profiles (liée à Supabase Auth)
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(150),
    role VARCHAR(30) NOT NULL DEFAULT 'etudiant' CHECK (role IN ('admin', 'professeur', 'etudiant')),
    matricule VARCHAR(50),
    telephone VARCHAR(30),
    avatar_url TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la recherche par username et email
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Service role : accès total
DROP POLICY IF EXISTS "service_role_all_profiles" ON profiles;
CREATE POLICY "service_role_all_profiles"
    ON profiles FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- Lecture publique des profils
DROP POLICY IF EXISTS "public_read_profiles" ON profiles;
CREATE POLICY "public_read_profiles"
    ON profiles FOR SELECT TO anon, authenticated
    USING (true);

-- Mise à jour uniquement de son propre profil
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
CREATE POLICY "users_update_own_profile"
    ON profiles FOR UPDATE TO authenticated
    USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Trigger pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at();

-- ============================================================
-- NOTE : Après avoir exécuté ce script dans Supabase :
-- 1. Configurez vos clés dans .env.local
-- 2. Lancez : http://localhost:3000/api/admin/create-admin?token=has-admin-seed-2024
-- 3. Connectez-vous avec : halil@has-academie.online / Admin123!
-- ============================================================
