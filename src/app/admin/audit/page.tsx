"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  Shield, Clock, User, Activity, ChevronRight,
  UserPlus, KeyRound, BookOpen, Trash2, FileText,
  RefreshCw, Search, Filter, Calendar, CheckCircle,
  AlertTriangle, Download, Database, Info,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  AuditEntry,
  getLocalAuditLogs,
  fetchServerAuditLogs,
  clearAllAuditLogs,
} from "@/lib/auditLogger";

const ACTION_TYPES: Array<{
  key: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}> = [
  { key: "PUBLICATION_EDT", label: "Emploi du temps publié", icon: <Calendar className="w-4 h-4" />, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
  { key: "MODIFICATION_EDT", label: "Emploi du temps modifié", icon: <Calendar className="w-4 h-4" />, color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300" },
  { key: "SUPPRESSION_EDT", label: "Séance EDT supprimée", icon: <Trash2 className="w-4 h-4" />, color: "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300" },
  { key: "VALIDATION_INSCRIPTION_ACCEPTEE", label: "Inscription acceptée", icon: <CheckCircle className="w-4 h-4" />, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" },
  { key: "VALIDATION_INSCRIPTION_REFUSEE", label: "Inscription rejetée", icon: <AlertTriangle className="w-4 h-4" />, color: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" },
  { key: "DEMANDE_INSCRIPTION_ETUDIANT", label: "Demande inscription", icon: <UserPlus className="w-4 h-4" />, color: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300" },
  { key: "INSCRIPTION_ETUDIANT_2FA", label: "Inscription Étudiant 2FA", icon: <UserPlus className="w-4 h-4" />, color: "bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300" },
  { key: "CONNEXION_REUSSIE", label: "Connexion réussie", icon: <Activity className="w-4 h-4" />, color: "bg-sky-100 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300" },
  { key: "MODIFICATION_MOT_DE_PASSE", label: "Changement MDP", icon: <KeyRound className="w-4 h-4" />, color: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300" },
  { key: "PUBLICATION_COURS", label: "Cours publié", icon: <BookOpen className="w-4 h-4" />, color: "bg-cyan-100 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300" },
  { key: "SUPPRESSION_COMPTE", label: "Compte supprimé", icon: <Trash2 className="w-4 h-4" />, color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300" },
  { key: "PUBLICATION_COMMUNIQUE", label: "Communiqué", icon: <FileText className="w-4 h-4" />, color: "bg-violet-100 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300" },
  { key: "SYSTEME_INITIALISATION", label: "Initialisation système", icon: <Shield className="w-4 h-4" />, color: "bg-slate-100 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA]" },
  { key: "SECURITE_2FA_ACTIVE", label: "Sécurité 2FA active", icon: <Shield className="w-4 h-4" />, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" },
];

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState<string>("ALL");
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      // D'abord afficher les logs locaux instantanément
      setLogs(getLocalAuditLogs());
      // Puis rafraîchir depuis le serveur
      const serverLogs = await fetchServerAuditLogs();
      setLogs(serverLogs);
    } catch {
      setLogs(getLocalAuditLogs());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => {
      setLogs(getLocalAuditLogs());
    };
    window.addEventListener("has_audit_logs_updated", handleUpdate);
    return () => window.removeEventListener("has_audit_logs_updated", handleUpdate);
  }, [loadLogs]);

  const getActionInfo = (action: string) => {
    const found = ACTION_TYPES.find((a) => a.key === action);
    if (found) return found;
    return {
      key: action,
      label: action.replace(/_/g, " "),
      icon: <Shield className="w-4 h-4" />,
      color: "bg-slate-100 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0]",
    };
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const diff = Date.now() - new Date(dateStr).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "À l'instant";
      if (mins < 60) return `Il y a ${mins} min`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `Il y a ${hours}h`;
      const days = Math.floor(hours / 24);
      return `Il y a ${days} jour(s)`;
    } catch {
      return dateStr;
    }
  };

  const formatExactDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchAction = selectedAction === "ALL" || log.action === selectedAction;
      if (!matchAction) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const userMatch = (log.user || "").toLowerCase().includes(q);
      const actionMatch = (log.action || "").toLowerCase().includes(q);
      const ipMatch = (log.ip || "").toLowerCase().includes(q);
      const detailsMatch = log.details ? JSON.stringify(log.details).toLowerCase().includes(q) : false;
      return userMatch || actionMatch || ipMatch || detailsMatch;
    });
  }, [logs, selectedAction, search]);

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-has-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = async () => {
    if (confirm("Confirmez-vous la réinitialisation complète du journal d'audit de sécurité ?")) {
      await clearAllAuditLogs();
      setLogs([]);
    }
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">Sécurité &amp; Conformité</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Journal d&apos;Audit de Sécurité
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              Traçabilité en temps réel des actions sensibles — accès, modifications d&apos;emploi du temps, inscriptions et suppressions
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              onClick={loadLogs}
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />}
            >
              Actualiser
            </Button>
            <Button
              onClick={handleExportJson}
              variant="secondary"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
            >
              Exporter
            </Button>
          </div>
        </div>

        {/* Info box statut */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">Système de journalisation actif</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
                  Temps Réel
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0]">
                {logs.length} événement(s) archivé(s) — Synchronisation Supabase &amp; stockage résilient
              </p>
            </div>
          </div>
          {logs.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer self-start sm:self-auto"
            >
              Vider le journal
            </button>
          )}
        </div>

        {/* Filtres & Recherche */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-4 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#687585]" />
              <input
                type="text"
                placeholder="Rechercher par utilisateur, action, IP ou mot-clé..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
              />
            </div>
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
            >
              <option value="ALL">Tous les événements ({logs.length})</option>
              {ACTION_TYPES.map((a) => {
                const count = logs.filter((l) => l.action === a.key).length;
                return (
                  <option key={a.key} value={a.key}>
                    {a.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Pastilles d'actions rapides */}
          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100 dark:border-[#263241]">
            <button
              onClick={() => setSelectedAction("ALL")}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors cursor-pointer ${
                selectedAction === "ALL"
                  ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                  : "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
              }`}
            >
              Tous
            </button>
            {ACTION_TYPES.slice(0, 6).map((a) => (
              <button
                key={a.key}
                onClick={() => setSelectedAction(a.key)}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                  selectedAction === a.key
                    ? "ring-2 ring-[#0f2744] dark:ring-[#e0521c] font-bold"
                    : "opacity-80 hover:opacity-100"
                } ${a.color}`}
              >
                {a.icon}
                <span>{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Table Journal */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0f2744] dark:text-[#e0521c]" />
              <span className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">
                {filteredLogs.length} entrée(s) affichée(s)
              </span>
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                Effacer recherche
              </button>
            )}
          </div>

          {filteredLogs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#151D27] text-slate-400 dark:text-[#687585] flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-800 dark:text-[#F5F7FA]">
                Aucune entrée trouvée
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto leading-relaxed">
                {search || selectedAction !== "ALL"
                  ? "Aucun événement ne correspond à vos filtres de recherche."
                  : "Le journal d'audit est prêt. Toute nouvelle opération sensible apparaîtra automatiquement ici."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-[#263241]">
              {filteredLogs.map((log) => {
                const info = getActionInfo(log.action);
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedEntry(log)}
                    className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3.5 hover:bg-slate-50/60 dark:hover:bg-[#151D27]/60 transition-colors cursor-pointer group"
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${info.color}`}>
                      {info.icon}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">
                          {info.label}
                        </span>
                        <ChevronRight className="w-3 h-3 text-slate-300 dark:text-[#687585]" />
                        <span className="text-xs font-medium text-slate-600 dark:text-[#AAB4C0] truncate max-w-xs">
                          {log.user}
                        </span>
                      </div>

                      {log.details && (
                        <div className="text-[11px] text-slate-500 dark:text-[#AAB4C0] font-mono bg-slate-50 dark:bg-[#151D27] px-2.5 py-1 rounded-md border border-slate-100 dark:border-[#263241] inline-block max-w-full truncate">
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0 space-y-1 self-end sm:self-center">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-[#AAB4C0]">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{formatRelativeTime(log.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-[#687585]">
                        <Activity className="w-2.5 h-2.5" />
                        <span className="font-mono">{log.ip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Détails */}
        {selectedEntry && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-[#263241] pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#e0521c]" />
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                    Détail de l&apos;événement d&apos;audit
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedEntry(null)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 dark:text-[#687585] block font-medium">Type d&apos;action :</span>
                  <span className="font-bold text-slate-900 dark:text-[#F5F7FA] font-mono text-sm">
                    {selectedEntry.action}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-slate-400 dark:text-[#687585] block font-medium">Utilisateur / Auteur :</span>
                    <span className="font-semibold text-slate-800 dark:text-[#F5F7FA]">{selectedEntry.user}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 dark:text-[#687585] block font-medium">Adresse IP :</span>
                    <span className="font-mono text-slate-800 dark:text-[#F5F7FA]">{selectedEntry.ip}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 dark:text-[#687585] block font-medium">Date &amp; Heure exacte :</span>
                  <span className="text-slate-700 dark:text-[#AAB4C0]">{formatExactDate(selectedEntry.created_at)}</span>
                </div>
                {selectedEntry.details && (
                  <div>
                    <span className="text-slate-400 dark:text-[#687585] block font-medium mb-1">Détails techniques :</span>
                    <pre className="p-3 rounded-lg bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-[11px] font-mono text-slate-800 dark:text-[#F5F7FA] overflow-x-auto">
                      {JSON.stringify(selectedEntry.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#263241] flex justify-end">
                <Button size="sm" variant="outline" onClick={() => setSelectedEntry(null)}>
                  Fermer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
