-- ==============================================================================
-- TABLE DE VÉRIFICATION 2FA / EMAIL POUR HALIL ACADÉMIE SCIENTIFIQUE (HAS)
-- À exécuter dans la console Supabase (SQL Editor)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS verification_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(150) NOT NULL,
    code VARCHAR(10) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'signup_2fa',
    expires_at TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    attempts INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour accélérer les recherches par email et type
CREATE INDEX IF NOT EXISTS idx_verification_codes_email ON verification_codes(email);
CREATE INDEX IF NOT EXISTS idx_verification_codes_created ON verification_codes(created_at DESC);

-- Activation de Row Level Security (RLS)
ALTER TABLE verification_codes ENABLE ROW LEVEL SECURITY;

-- Politiques de sécurité RLS
DROP POLICY IF EXISTS "Service role full access on verification_codes" ON verification_codes;
CREATE POLICY "Service role full access on verification_codes" 
    ON verification_codes 
    FOR ALL 
    TO service_role 
    USING (true) 
    WITH CHECK (true);

-- Sécurité RLS stricte : seul le backend sécurisé (service_role) accède aux codes 2FA secrets
DROP POLICY IF EXISTS "Anon insert and read verification_codes" ON verification_codes;
-- Aucune lecture publique n'est autorisée sur les codes de vérification pour préserver l'intégrité du 2FA.
