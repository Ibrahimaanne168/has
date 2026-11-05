-- ==============================================================================
-- CONFIGURATION SUPABASE STORAGE — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- NOTE : Cette configuration est DÉJÀ INTÉGRÉE dans database/schema.sql !
-- Si vous avez exécuté database/schema.sql, vous n'avez pas besoin d'exécuter ce fichier.
-- ==============================================================================

-- 1. CRÉATION DES BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES 
('cours-supports', 'cours-supports', true),
('emplois-du-temps', 'emplois-du-temps', true),
('avatars', 'avatars', true),
('communiques', 'communiques', true),
('public-gallery', 'public-gallery', true)
ON CONFLICT (id) DO NOTHING;

-- 2. POLITIQUES RLS DU STOCKAGE
DO $$ BEGIN
    DROP POLICY IF EXISTS "Public Access Supports" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload Supports" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access EDT" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload EDT" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Auth Upload Avatars" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Communiques" ON storage.objects;
    DROP POLICY IF EXISTS "Public Access Gallery" ON storage.objects;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "Public Access Supports" ON storage.objects FOR SELECT USING (bucket_id = 'cours-supports');
CREATE POLICY "Auth Upload Supports" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (bucket_id = 'cours-supports');
CREATE POLICY "Public Access EDT" ON storage.objects FOR SELECT USING (bucket_id = 'emplois-du-temps');
CREATE POLICY "Auth Upload EDT" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (bucket_id = 'emplois-du-temps');
CREATE POLICY "Public Access Avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Auth Upload Avatars" ON storage.objects FOR INSERT TO authenticated, service_role WITH CHECK (bucket_id = 'avatars');
CREATE POLICY "Public Access Communiques" ON storage.objects FOR SELECT USING (bucket_id = 'communiques');
CREATE POLICY "Public Access Gallery" ON storage.objects FOR SELECT USING (bucket_id = 'public-gallery');
