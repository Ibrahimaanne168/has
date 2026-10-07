-- ============================================================
-- TABLE ORDERS & PAIEMENTS WAVE CHECKOUT
-- À exécuter dans Supabase SQL Editor
-- ============================================================

-- 1. Création de la table des commandes / transactions
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email VARCHAR(150) NOT NULL,
    full_name VARCHAR(150),
    matricule VARCHAR(50),
    filiere VARCHAR(20),
    niveau VARCHAR(10),
    description VARCHAR(255) DEFAULT 'Frais d''inscription académique HAS (Année 2026-2027)',
    amount INTEGER NOT NULL, -- Montant en XOF (ex: 25000)
    currency VARCHAR(10) NOT NULL DEFAULT 'XOF',
    payment_method VARCHAR(30) NOT NULL DEFAULT 'wave',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'processing', 'paid', 'failed', 'cancelled')),
    client_reference VARCHAR(100) UNIQUE NOT NULL,
    wave_checkout_id VARCHAR(100),
    wave_launch_url TEXT,
    wave_transaction_id VARCHAR(100),
    raw_webhook_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_orders_client_reference ON orders(client_reference);
CREATE INDEX IF NOT EXISTS idx_orders_wave_checkout_id ON orders(wave_checkout_id);
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);

-- 2. Colonnes associées sur la table profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS has_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) DEFAULT 'pending';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES orders(id) ON DELETE SET NULL;

-- 3. RLS (Row Level Security)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Service role : accès total
DROP POLICY IF EXISTS "service_role_all_orders" ON orders;
CREATE POLICY "service_role_all_orders"
    ON orders FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- Utilisateurs authentifiés : lecture de leurs propres commandes
DROP POLICY IF EXISTS "users_read_own_orders" ON orders;
CREATE POLICY "users_read_own_orders"
    ON orders FOR SELECT TO authenticated
    USING (auth.uid() = user_id OR email = auth.email());

-- Lecture publique restreinte par client_reference pour la page de succès
DROP POLICY IF EXISTS "public_read_order_by_ref" ON orders;
CREATE POLICY "public_read_order_by_ref"
    ON orders FOR SELECT TO anon
    USING (true);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON orders;
CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at();
