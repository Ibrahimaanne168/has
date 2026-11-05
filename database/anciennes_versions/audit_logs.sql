-- ============================================================
-- TABLE AUDIT_LOGS — Journal d'audit de sécurité HAS
-- À exécuter dans l'éditeur SQL de Supabase (SQL Editor)
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(100) DEFAULT 'local',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour la performance des requêtes d'audit
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- Activation de Row Level Security (RLS)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Autorisation totale pour le service_role (requêtes serveur backend)
DROP POLICY IF EXISTS "service_role_all_audit" ON audit_logs;
CREATE POLICY "service_role_all_audit"
    ON audit_logs FOR ALL TO service_role
    USING (true) WITH CHECK (true);

-- Lecture réservée aux administrateurs authentifiés
DROP POLICY IF EXISTS "admin_read_audit" ON audit_logs;
CREATE POLICY "admin_read_audit"
    ON audit_logs FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
    );
