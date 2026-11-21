-- ==============================================================================
-- TABLE MARKETPLACE_ITEMS — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- Vente de fascicules et ressources pédagogiques avec commande WhatsApp
-- ==============================================================================

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

-- Index pour recherche rapide et tri
CREATE INDEX IF NOT EXISTS idx_marketplace_is_active ON public.marketplace_items(is_active);
CREATE INDEX IF NOT EXISTS idx_marketplace_niveau ON public.marketplace_items(niveau);
CREATE INDEX IF NOT EXISTS idx_marketplace_created_at ON public.marketplace_items(created_at DESC);

-- Sécurité Row Level Security (RLS)
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;

-- Lecture publique autorisée pour tous les visiteurs (landing page & catalogue)
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
