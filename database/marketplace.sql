-- ==============================================================================
-- MODULE MARKETPLACE & VALIDATIONS ADMIN — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- Vente de fascicules et ressources pédagogiques avec redirection WhatsApp
-- et validation manuelle du téléchargement par l'administrateur
-- ==============================================================================
-- Compatible exécution directe dans le "SQL Editor" de votre projet Supabase.
-- Idempotent : peut être ré-exécuté plusieurs fois sans aucune erreur.
-- ==============================================================================

-- 1. Table des articles en vente dans le Marketplace
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL DEFAULT 2000,
    original_price INT, -- Prix d'origine barré (ex: 10000 FCFA -> promo Chariow)
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    cover_image_url TEXT,
    pdf_url TEXT,
    file_size VARCHAR(50) DEFAULT '1.99 MB',
    whatsapp_number VARCHAR(50) NOT NULL DEFAULT '+221 77 551 81 96',
    professeur_phone VARCHAR(50) DEFAULT '+221 77 551 81 96', -- rétro-compatibilité
    professeur_name VARCHAR(150) DEFAULT 'HAS Académie',
    professeur_avatar TEXT,
    professeur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    matiere VARCHAR(100),
    niveau VARCHAR(30) DEFAULT 'Tous',
    pages_count INT,
    badge VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sécurisation des colonnes si la table existait déjà avec un ancien schéma
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS original_price INT;
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS file_size VARCHAR(50) DEFAULT '1.99 MB';
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50) DEFAULT '+221 77 551 81 96';
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS professeur_phone VARCHAR(50) DEFAULT '+221 77 551 81 96';
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS professeur_name VARCHAR(150) DEFAULT 'HAS Académie';
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;
ALTER TABLE public.marketplace_items ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- 2. Table des commandes et validations de téléchargement
CREATE TABLE IF NOT EXISTS public.marketplace_orders (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL REFERENCES public.marketplace_items(id) ON DELETE CASCADE,
    item_title VARCHAR(255) NOT NULL,
    item_price INT NOT NULL,
    item_pdf_url TEXT,
    buyer_name VARCHAR(150) NOT NULL,
    buyer_email VARCHAR(150) NOT NULL,
    buyer_phone VARCHAR(50) NOT NULL,
    buyer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'valide', 'refuse')),
    validated_at TIMESTAMPTZ,
    validated_by VARCHAR(150),
    notes TEXT,
    download_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Index pour recherche rapide et tri haute performance
CREATE INDEX IF NOT EXISTS idx_marketplace_is_active ON public.marketplace_items(is_active);
CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON public.marketplace_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_email ON public.marketplace_orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created_at ON public.marketplace_orders(created_at DESC);

-- 4. Sécurité Row Level Security (RLS)
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Politiques de lecture publique (catalogue visible par tous les étudiants et visiteurs)
DROP POLICY IF EXISTS "public_read_marketplace_items" ON public.marketplace_items;
CREATE POLICY "public_read_marketplace_items"
    ON public.marketplace_items
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "public_read_marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "public_read_marketplace_orders"
    ON public.marketplace_orders
    FOR SELECT
    USING (true);

-- Politiques d'écriture complète pour le service role et les admins
DROP POLICY IF EXISTS "service_role_all_marketplace_items" ON public.marketplace_items;
CREATE POLICY "service_role_all_marketplace_items"
    ON public.marketplace_items
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "service_role_all_marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "service_role_all_marketplace_orders"
    ON public.marketplace_orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Autoriser également les utilisateurs authentifiés / anonymes à créer une commande (achat WhatsApp)
DROP POLICY IF EXISTS "public_insert_marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "public_insert_marketplace_orders"
    ON public.marketplace_orders
    FOR INSERT
    WITH CHECK (true);

-- 5. Configuration automatique du bucket de stockage 'marketplace' pour les images et PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('marketplace', 'marketplace', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Politiques d'accès au bucket 'marketplace'
DROP POLICY IF EXISTS "Public Access Marketplace Bucket" ON storage.objects;
CREATE POLICY "Public Access Marketplace Bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'marketplace');

DROP POLICY IF EXISTS "Service Role Upload Marketplace Bucket" ON storage.objects;
CREATE POLICY "Service Role Upload Marketplace Bucket"
ON storage.objects FOR ALL
USING (bucket_id = 'marketplace')
WITH CHECK (bucket_id = 'marketplace');

-- Notifier fin de configuration
DO $$
BEGIN
    RAISE NOTICE '✓ Schéma Marketplace HAS et bucket configurés avec succès !';
END $$;
