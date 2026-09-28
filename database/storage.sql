-- ==============================================================================
-- CONFIGURATION SUPABASE STORAGE — HALIL ACADÉMIE SCIENTIFIQUE
-- ==============================================================================

-- 1. CRÉATION DES BUCKETS
INSERT INTO storage.buckets (id, name, public) VALUES 
('cours-supports', 'cours-supports', true),
('emplois-du-temps', 'emplois-du-temps', true),
('avatars', 'avatars', true),
('public-gallery', 'public-gallery', true) -- Illustrations pédagogiques et fiches publiques
ON CONFLICT (id) DO NOTHING;

-- 2. POLICIES POUR LE BUCKET cours-supports
CREATE POLICY "Lecture publique des supports de cours"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'cours-supports');

CREATE POLICY "Professeurs et admins uploadent supports de cours"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'cours-supports' AND
    (public.is_professeur() OR public.is_admin())
);

CREATE POLICY "Suppression supports de cours par professeurs et admins"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'cours-supports' AND
    (public.is_professeur() OR public.is_admin())
);

-- 3. POLICIES POUR LE BUCKET emplois-du-temps
CREATE POLICY "Lecture des emplois du temps"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'emplois-du-temps');

CREATE POLICY "Admin upload emplois du temps"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
    bucket_id = 'emplois-du-temps' AND public.is_admin()
);

CREATE POLICY "Admin supprime emplois du temps"
ON storage.objects FOR DELETE TO authenticated
USING (
    bucket_id = 'emplois-du-temps' AND public.is_admin()
);

-- 4. POLICIES POUR LE BUCKET avatars
CREATE POLICY "Lecture publique des avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Utilisateurs uploadent leur avatar"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Utilisateurs mettent a jour leur avatar"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'avatars');

-- 5. POLICIES POUR LE BUCKET public-gallery
CREATE POLICY "Lecture publique de la galerie"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-gallery');

CREATE POLICY "Admin gère la galerie"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'public-gallery' AND public.is_admin())
WITH CHECK (bucket_id = 'public-gallery' AND public.is_admin());
