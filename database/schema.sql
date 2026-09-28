-- ==============================================================================
-- SCHÉMA DE BASE DE DONNÉES — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- PostgreSQL / Supabase avec Row Level Security (RLS) & Triggers
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TYPES ÉNUMÉRÉS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('etudiant', 'professeur', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE contact_status AS ENUM ('nouveau', 'en_cours', 'traite', 'archive');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLES DE STRUCTURE ACADÉMIQUE

-- Filières
CREATE TABLE IF NOT EXISTS public.filieres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cycle VARCHAR(50) DEFAULT 'Licence Professionnelle',
    duration_years INT DEFAULT 3,
    icon VARCHAR(50) DEFAULT 'book-open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filiere_id UUID NOT NULL REFERENCES public.filieres(id) ON DELETE CASCADE,
    code VARCHAR(30) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    niveau VARCHAR(10) NOT NULL, -- L1, L2, L3, M1, M2
    annee_scolaire VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Matières / Modules
CREATE TABLE IF NOT EXISTS public.matieres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filiere_id UUID NOT NULL REFERENCES public.filieres(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    coefficient INT DEFAULT 2,
    credits_ects INT DEFAULT 4,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(filiere_id, code)
);

-- 4. TABLE PROFILS UTILISATEURS (Liée à auth.users de Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'etudiant',
    phone VARCHAR(30),
    matricule VARCHAR(50) UNIQUE,
    filiere_id UUID REFERENCES public.filieres(id) ON DELETE SET NULL,
    classe_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
    bio TEXT,
    specialite VARCHAR(255),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURS ET SUPPORTS PÉDAGOGIQUES
CREATE TABLE IF NOT EXISTS public.cours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    matiere_id UUID NOT NULL REFERENCES public.matieres(id) ON DELETE CASCADE,
    classe_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    professeur_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_url TEXT,
    file_name VARCHAR(255),
    file_type VARCHAR(50),
    file_size_bytes BIGINT,
    external_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Favoris des cours (étudiants)
CREATE TABLE IF NOT EXISTS public.favoris_cours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    cours_id UUID NOT NULL REFERENCES public.cours(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, cours_id)
);

-- 6. EMPLOIS DU TEMPS
CREATE TABLE IF NOT EXISTS public.emplois_du_temps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    classe_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    semestre VARCHAR(20) NOT NULL DEFAULT 'Semestre 1',
    annee_universitaire VARCHAR(20) NOT NULL DEFAULT '2024-2025',
    file_url TEXT NOT NULL,
    file_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. COMMUNIQUÉS OFFICIELS
CREATE TABLE IF NOT EXISTS public.communiques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_important BOOLEAN DEFAULT FALSE,
    target_role user_role, -- NULL = tous les rôles
    published_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. MESSAGERIE INTERNE (Directe entre utilisateurs)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES public.messages(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. CHAT GÉNÉRAL (Salon partagé temps réel)
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. MESSAGES DE CONTACT (Formulaire public)
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(30),
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status contact_status DEFAULT 'nouveau',
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. CODES 2FA / VÉRIFICATION D'EMAIL (Inscription & Réinitialisation)
CREATE TABLE IF NOT EXISTS public.verification_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(30) DEFAULT 'signup_2fa', -- 'signup_2fa' ou 'password_reset'
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_verification_email ON public.verification_codes(email, type);

-- 12. JOURNAL D'AUDIT SÉCURITÉ
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_created_at ON public.audit_logs(created_at DESC);

-- ==============================================================================
-- TRIGGERS POUR LA GESTION DU CHAMP updated_at
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_filieres_updated_at BEFORE UPDATE ON public.filieres FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON public.classes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_matieres_updated_at BEFORE UPDATE ON public.matieres FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_cours_updated_at BEFORE UPDATE ON public.cours FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_emplois_du_temps_updated_at BEFORE UPDATE ON public.emplois_du_temps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_communiques_updated_at BEFORE UPDATE ON public.communiques FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- FONCTIONS D'AIDE RLS (SECURITY DEFINER)
-- ==============================================================================
-- Obtenir le rôle de l'utilisateur courant
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Vérifier si l'utilisateur est professeur
CREATE OR REPLACE FUNCTION public.is_professeur()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'professeur'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Activation RLS sur TOUTES les tables
ALTER TABLE public.filieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matieres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favoris_cours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emplois_du_temps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communiques ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. POLICIES POUR FILIERES, CLASSES, MATIERES
-- Lecture ouverte à tous (y compris public pour la page d'accueil)
CREATE POLICY "Filieres consultables par tous" ON public.filieres FOR SELECT USING (true);
CREATE POLICY "Classes consultables par utilisateurs authentifies" ON public.classes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Matieres consultables par utilisateurs authentifies" ON public.matieres FOR SELECT TO authenticated USING (true);
-- Modification réservée aux admins
CREATE POLICY "Admins modifient filieres" ON public.filieres FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins modifient classes" ON public.classes FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins modifient matieres" ON public.matieres FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 2. POLICIES POUR PROFILES
-- Lecture : les utilisateurs authentifiés peuvent lire les profils de base (pour le trombinoscope, le chat, la messagerie)
CREATE POLICY "Profils lisibles par les utilisateurs authentifies" ON public.profiles FOR SELECT TO authenticated USING (true);
-- Modification : un utilisateur peut mettre à jour ses propres infos personnelles (téléphone, bio, avatar)
CREATE POLICY "Mise a jour de son propre profil" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM public.profiles WHERE id = auth.uid()) -- empêche l'auto-promotion de rôle
);
-- Seul l'admin peut insérer, supprimer ou modifier les rôles et affectations de classe
CREATE POLICY "Admins ont tout pouvoir sur profiles" ON public.profiles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- 3. POLICIES POUR COURS
-- Lecture :
-- - Les étudiants voient les cours de leur classe
-- - Les professeurs voient tous les cours ou leurs cours
-- - L'admin voit tout
CREATE POLICY "Lecture des cours filtree" ON public.cours FOR SELECT TO authenticated USING (
    public.is_admin() OR
    public.is_professeur() OR
    classe_id = (SELECT classe_id FROM public.profiles WHERE id = auth.uid())
);
-- Insertion : réservée aux professeurs et admins
CREATE POLICY "Professeurs publient leurs cours" ON public.cours FOR INSERT TO authenticated WITH CHECK (
    (public.is_professeur() AND professeur_id = auth.uid()) OR public.is_admin()
);
-- Modification / Suppression : un professeur ne peut modifier/supprimer QUE ses propres cours
CREATE POLICY "Professeurs gerent leurs propres cours" ON public.cours FOR UPDATE TO authenticated USING (
    (public.is_professeur() AND professeur_id = auth.uid()) OR public.is_admin()
) WITH CHECK (
    (public.is_professeur() AND professeur_id = auth.uid()) OR public.is_admin()
);
CREATE POLICY "Professeurs suppriment leurs propres cours" ON public.cours FOR DELETE TO authenticated USING (
    (public.is_professeur() AND professeur_id = auth.uid()) OR public.is_admin()
);

-- 4. POLICIES POUR FAVORIS_COURS
CREATE POLICY "Gestion de ses propres favoris" ON public.favoris_cours FOR ALL TO authenticated USING (
    user_id = auth.uid()
) WITH CHECK (
    user_id = auth.uid()
);

-- 5. POLICIES POUR EMPLOIS DU TEMPS
-- Lecture : les étudiants voient l'EDT de leur classe, les professeurs et admins voient tout
CREATE POLICY "Lecture des emplois du temps" ON public.emplois_du_temps FOR SELECT TO authenticated USING (
    public.is_admin() OR
    public.is_professeur() OR
    classe_id = (SELECT classe_id FROM public.profiles WHERE id = auth.uid())
);
-- Écriture : réservée à l'admin
CREATE POLICY "Admins gèrent emplois du temps" ON public.emplois_du_temps FOR ALL TO authenticated USING (
    public.is_admin()
) WITH CHECK (
    public.is_admin()
);

-- 6. POLICIES POUR COMMUNIQUÉS
CREATE POLICY "Lecture des communiques par tous les connectes" ON public.communiques FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins gèrent communiques" ON public.communiques FOR ALL TO authenticated USING (
    public.is_admin()
) WITH CHECK (
    public.is_admin()
);

-- 7. POLICIES POUR MESSAGES (Messagerie interne)
CREATE POLICY "Lecture de ses messages" ON public.messages FOR SELECT TO authenticated USING (
    sender_id = auth.uid() OR receiver_id = auth.uid()
);
CREATE POLICY "Envoi de messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
    sender_id = auth.uid()
);
CREATE POLICY "Marquer message comme lu" ON public.messages FOR UPDATE TO authenticated USING (
    receiver_id = auth.uid()
) WITH CHECK (
    receiver_id = auth.uid()
);

-- 8. POLICIES POUR CHAT GÉNÉRAL
CREATE POLICY "Lecture du chat public" ON public.chat_messages FOR SELECT TO authenticated USING (
    is_deleted = false OR public.is_admin()
);
CREATE POLICY "Envoi de message dans le chat" ON public.chat_messages FOR INSERT TO authenticated WITH CHECK (
    user_id = auth.uid()
);
CREATE POLICY "Moderation du chat par admin" ON public.chat_messages FOR UPDATE TO authenticated USING (
    public.is_admin() OR user_id = auth.uid()
);
CREATE POLICY "Suppression du chat par admin" ON public.chat_messages FOR DELETE TO authenticated USING (
    public.is_admin()
);

-- 9. POLICIES POUR CONTACT_MESSAGES
-- Le formulaire public peut insérer
CREATE POLICY "Public insere message contact" ON public.contact_messages FOR INSERT TO anon, authenticated WITH CHECK (true);
-- Seul l'admin peut lire et modifier le statut
CREATE POLICY "Admin consulte messages contact" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admin met a jour contact" ON public.contact_messages FOR UPDATE TO authenticated USING (public.is_admin());

-- 10. POLICIES POUR AUDIT_LOGS
CREATE POLICY "Insertion audit par le système" ON public.audit_logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Lecture audit par admin uniquement" ON public.audit_logs FOR SELECT TO authenticated USING (public.is_admin());

-- 11. POLICIES POUR VERIFICATION_CODES
-- Géré via Service Role côté Next.js serveur (pas d'accès direct côté client anon)
CREATE POLICY "Verification codes via service role" ON public.verification_codes FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ==============================================================================
-- REALTIME
-- ==============================================================================
DO $$ BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- DONNÉES INITIALES (SEED DE QUALITÉ RÉELLE — HALIL ACADÉMIE SCIENTIFIQUE)
-- ==============================================================================

-- 1. FILIÈRES OFFICIELLES HAS
INSERT INTO public.filieres (id, code, name, description, cycle, duration_years, icon) VALUES
('11111111-1111-1111-1111-111111111111', 'ISN', 'Informatique & Systèmes Numériques', 'Formation d''excellence axée sur le génie logiciel, la cybersécurité, les réseaux d''entreprise et le cloud computing.', 'Licence Professionnelle', 3, 'cpu'),
('22222222-2222-2222-2222-222222222222', 'GCB', 'Génie Civil & Bâtiment', 'Conception des structures modernes, résistance des matériaux, hydraulique urbaine et conduite de chantiers durables.', 'Licence Professionnelle', 3, 'building'),
('33333333-3333-3333-3333-333333333333', 'EER', 'Électromécanique & Énergies Renouvelables', 'Automatismes industriels, maintenance des systèmes énergétiques, solaire photovoltaïque et réseaux intelligents.', 'Licence Professionnelle', 3, 'zap'),
('44444444-4444-4444-4444-444444444444', 'SEG', 'Sciences Économiques & Gestion d''Entreprise', 'Comptabilité financière, audit, management stratégique et gestion de projets innovants.', 'Licence Professionnelle', 3, 'trending-up')
ON CONFLICT (code) DO NOTHING;

-- 2. CLASSES OFFICIELLES
INSERT INTO public.classes (id, filiere_id, code, name, niveau, annee_scolaire) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'L1-ISN', 'Licence 1 Informatique & Systèmes Numériques', 'L1', '2024-2025'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'L2-ISN', 'Licence 2 Informatique & Systèmes Numériques', 'L2', '2024-2025'),
('cccccccc-cccc-cccc-cccc-cccccccccccc', '11111111-1111-1111-1111-111111111111', 'L3-ISN', 'Licence 3 Informatique & Systèmes Numériques', 'L3', '2024-2025'),
('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'L2-GCB', 'Licence 2 Génie Civil & Bâtiment', 'L2', '2024-2025'),
('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '33333333-3333-3333-3333-333333333333', 'L2-EER', 'Licence 2 Électromécanique & Énergies', 'L2', '2024-2025'),
('ffffffff-ffff-ffff-ffff-ffffffffffff', '44444444-4444-4444-4444-444444444444', 'L2-SEG', 'Licence 2 Sciences Économiques & Gestion', 'L2', '2024-2025')
ON CONFLICT (code) DO NOTHING;

-- 3. MATIÈRES OFFICIELLES
INSERT INTO public.matieres (id, filiere_id, code, name, coefficient, credits_ects, description) VALUES
('m1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'ALG-201', 'Algorithmique Avancée & Structures de Données', 3, 5, 'Arbres, graphes, complexité algorithmique et programmation dynamique.'),
('m2222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'BDD-202', 'Bases de Données Relationnelles & SQL', 3, 5, 'Modèle relationnel, formes normales, optimisation de requêtes SQL et triggers PostgreSQL.'),
('m3333333-3333-3333-3333-333333333333', '11111111-1111-1111-1111-111111111111', 'RES-203', 'Architectures Réseaux & Protocoles IP', 2, 4, 'Modèle OSI, routage dynamique, VLANs et principes de sécurité périmétrique.'),
('m4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'WEB-204', 'Développement Web Fullstack & Architectures Cloud', 3, 5, 'React, TypeScript, APIs RESTful et conteneurisation.'),
('m5555555-5555-5555-5555-555555555555', '22222222-2222-2222-2222-222222222222', 'RDM-201', 'Résistance des Matériaux & Structures', 4, 6, 'Calcul des contraintes, déformations des poutres et modélisation aux éléments finis.')
ON CONFLICT (filiere_id, code) DO NOTHING;

-- 4. COMMUNIQUÉS OFFICIELS
INSERT INTO public.communiques (id, title, content, is_important, created_at) VALUES
('c1111111-1111-1111-1111-111111111111', 'Rentrée Universitaire 2024-2025 : Accueil des promotions', 'La Direction Générale de Halil Académie Scientifique a le plaisir d''accueillir les nouveaux étudiants ainsi que les promotions montantes. Les séances d''intégration et la présentation du règlement intérieur se tiendront dans le grand amphithéâtre.', true, NOW() - INTERVAL '3 days'),
('c2222222-2222-2222-2222-222222222222', 'Publication des plannings de travaux pratiques (Laboratoires)', 'Les emplois du temps détaillés pour l''accès aux salles de travaux pratiques et aux laboratoires de mesures physiques sont désormais consultables sur votre espace étudiant. La présence aux séances de TP est strictement obligatoire.', false, NOW() - INTERVAL '1 day'),
('c3333333-3333-3333-3333-333333333333', 'Conférence Annuelle : L''Ingénierie au service de l''innovation', 'Halil Académie Scientifique organise sa conférence annuelle réunissant des experts industriels et des chercheurs de premier plan. Inscription ouverte auprès du secrétariat académique.', true, NOW() - INTERVAL '5 hours');
