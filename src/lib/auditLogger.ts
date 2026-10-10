/**
 * Système de Journalisation d'Audit de Sécurité — HAS
 * Gère la persistance locale et la synchronisation avec le serveur Supabase.
 */

export interface AuditEntry {
  id: string;
  user: string;
  action: string;
  details?: Record<string, unknown> | null;
  ip: string;
  created_at: string;
}

export const AUDIT_STORAGE_KEY = "has_audit_logs_v1";

const SEED_AUDIT_LOGS: AuditEntry[] = [
  {
    id: "log-seed-1",
    user: "direction@halil-academie.com",
    action: "SYSTEME_INITIALISATION",
    details: { message: "Plateforme Halil Académie Scientifique opérationnelle", version: "2.4.0" },
    ip: "192.168.1.1",
    created_at: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
  },
  {
    id: "log-seed-2",
    user: "ADM001 (Direction HAS)",
    action: "SECURITE_2FA_ACTIVE",
    details: { statut: "Vérification par code à 6 chiffres & Telegram activés" },
    ip: "105.235.10.42",
    created_at: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: "log-seed-3",
    user: "direction@halil-academie.com",
    action: "PUBLICATION_EDT",
    details: { classe: "LICENCE 2 MIASS - SEMESTRE 4", enseignant: "Mister Halil", matieres: ["Analyse 4", "Probabilité"] },
    ip: "105.235.10.42",
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export function getLocalAuditLogs(): AuditEntry[] {
  if (typeof window === "undefined") return SEED_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(SEED_AUDIT_LOGS));
      return SEED_AUDIT_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : SEED_AUDIT_LOGS;
  } catch {
    return SEED_AUDIT_LOGS;
  }
}

export function saveLocalAuditLogs(logs: AuditEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(logs.slice(0, 500)));
    window.dispatchEvent(new CustomEvent("has_audit_logs_updated"));
  } catch (e) {
    console.warn("[AUDIT-SAVE-ERROR]", e);
  }
}

export async function recordAuditLog(entry: {
  action: string;
  user?: string;
  details?: Record<string, unknown>;
  ip?: string;
}): Promise<AuditEntry> {
  const newLog: AuditEntry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    user: entry.user || "Administration HAS",
    action: entry.action,
    details: entry.details || null,
    ip: entry.ip || "105.235.10.42",
    created_at: new Date().toISOString(),
  };

  if (typeof window !== "undefined") {
    const current = getLocalAuditLogs();
    const updated = [newLog, ...current];
    saveLocalAuditLogs(updated);

    // Synchronisation en tâche de fond avec le serveur
    fetch("/api/admin/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLog),
    }).catch(() => {
      // Échec silencieux si hors-ligne, le log reste dans le stockage local
    });
  }

  return newLog;
}

export async function fetchServerAuditLogs(): Promise<AuditEntry[]> {
  try {
    const res = await fetch("/api/admin/audit", { cache: "no-store" });
    if (!res.ok) throw new Error("Erreur serveur");
    const data = await res.json();
    if (Array.isArray(data?.logs) && data.logs.length > 0) {
      // Fusionner avec les logs locaux pour ne rien perdre
      const local = getLocalAuditLogs();
      const map = new Map<string, AuditEntry>();
      [...data.logs, ...local].forEach((item) => {
        if (item?.id && !map.has(item.id)) {
          map.set(item.id, item);
        }
      });
      const merged = Array.from(map.values()).sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      saveLocalAuditLogs(merged);
      return merged;
    }
  } catch {
    // En cas d'indisponibilité réseau, renvoyer les données locales
  }
  return getLocalAuditLogs();
}

export async function clearAllAuditLogs(): Promise<void> {
  if (typeof window !== "undefined") {
    localStorage.removeItem(AUDIT_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("has_audit_logs_updated"));
    try {
      await fetch("/api/admin/audit", { method: "DELETE" });
    } catch {}
  }
}
