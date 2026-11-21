-- ==============================================================================
-- TABLE MARKETPLACE_ITEMS & MARKETPLACE_ORDERS — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- Vente de fascicules et ressources pédagogiques avec validation du téléchargement par l'admin
-- ==============================================================================

-- 1. Table des articles en vente
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    id TEXT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price INT NOT NULL DEFAULT 3500,
    currency VARCHAR(10) NOT NULL DEFAULT 'FCFA',
    cover_image_url TEXT NOT NULL,
    pdf_url TEXT,
    professeur_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    professeur_name VARCHAR(150) NOT NULL,
    professeur_phone VARCHAR(50) NOT NULL,
    professeur_avatar TEXT,
    matiere VARCHAR(100),
    niveau VARCHAR(30) DEFAULT 'Tous',
    pages_count INT,
    badge VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- Index pour recherche rapide et tri
CREATE INDEX IF NOT EXISTS idx_marketplace_is_active ON public.marketplace_items(is_active);
CREATE INDEX IF NOT EXISTS idx_marketplace_niveau ON public.marketplace_items(niveau);
CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON public.marketplace_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_marketplace_orders_status ON public.marketplace_orders(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_buyer_email ON public.marketplace_orders(buyer_email);
CREATE INDEX IF NOT EXISTS idx_marketplace_orders_created_at ON public.marketplace_orders(created_at DESC);

-- Sécurité Row Level Security (RLS)
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_orders ENABLE ROW LEVEL SECURITY;

-- Lecture publique autorisée pour tous les visiteurs (catalogue)
DROP POLICY IF EXISTS "public_read_marketplace_items" ON public.marketplace_items;
CREATE POLICY "public_read_marketplace_items"
    ON public.marketplace_items
    FOR SELECT
    USING (true);

-- Écriture autorisée pour le service role et les administrateurs
DROP POLICY IF EXISTS "service_role_all_marketplace_items" ON public.marketplace_items;
CREATE POLICY "service_role_all_marketplace_items"
    ON public.marketplace_items
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Politiques pour les commandes
DROP POLICY IF EXISTS "public_read_marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "public_read_marketplace_orders"
    ON public.marketplace_orders
    FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "service_role_all_marketplace_orders" ON public.marketplace_orders;
CREATE POLICY "service_role_all_marketplace_orders"
    ON public.marketplace_orders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);
