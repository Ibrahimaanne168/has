"use client";

import React from "react";
import {
  Shield, Clock, User, Activity, ChevronRight,
  UserPlus, KeyRound, BookOpen, Trash2, FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";

const ACTION_TYPES = [
  { key: "INSCRIPTION_ETUDIANT_2FA", label: "Inscription Étudiant", icon: <UserPlus className="w-4 h-4" />, color: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" },
  { key: "CONNEXION_REUSSIE", label: "Connexion", icon: <Activity className="w-4 h-4" />, color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
  { key: "MODIFICATION_MOT_DE_PASSE", label: "Changement MDP", icon: <KeyRound className="w-4 h-4" />, color: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" },
  { key: "PUBLICATION_COURS", label: "Cours publié", icon: <BookOpen className="w-4 h-4" />, color: "bg-[#0f2744]/10 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA]" },
  { key: "SUPPRESSION_COMPTE", label: "Compte supprimé", icon: <Trash2 className="w-4 h-4" />, color: "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300" },
  { key: "PUBLICATION_COMMUNIQUE", label: "Communiqué", icon: <FileText className="w-4 h-4" />, color: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300" },
];

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  details?: Record<string, unknown> | null;
  ip: string;
  created_at: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = React.useState<AuditEntry[]>([]);

  React.useEffect(() => {
    // Si des logs réels existent dans le stockage local ou la base de données
    try {
      const stored = localStorage.getItem("has_audit_logs_v1");
      if (stored) {
        setLogs(JSON.parse(stored));
      } else {
        setLogs([]);
      }
    } catch {
      setLogs([]);
    }
  }, []);

  const getActionInfo = (action: string) => ACTION_TYPES.find((a) => a.key === action) || { label: action, icon: <Shield className="w-4 h-4" />, color: "bg-slate-100 text-slate-600" };

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `Il y a ${mins} min`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)} jour(s)`;
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Sécurité &amp; Conformité</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">Journal d&apos;Audit de Sécurité</h1>
          <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
            Traçabilité des actions sensibles — accès, créations, modifications et suppressions de comptes
          </p>
        </div>

        {/* Légende des types d'actions */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)]">
          <h3 className="text-xs font-bold text-slate-500 dark:text-[#AAB4C0] uppercase tracking-wider mb-3">Types d&apos;événements journalisés</h3>
          <div className="flex flex-wrap gap-2">
            {ACTION_TYPES.map((a) => (
              <div key={a.key} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${a.color}`}>
                {a.icon}
                <span>{a.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Table Journal */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#0f2744] dark:text-[#e0521c]" />
              <span className="text-sm font-bold text-slate-800 dark:text-[#F5F7FA]">
                {logs.length} entrée(s) — journal d&apos;audit en temps réel
              </span>
            </div>
            {logs.length > 0 && (
              <button
                onClick={() => {
                  if (confirm("Confirmez-vous la réinitialisation du journal d'audit ?")) {
                    localStorage.removeItem("has_audit_logs_v1");
                    setLogs([]);
                  }
                }}
                className="text-xs text-red-600 dark:text-red-400 hover:underline cursor-pointer"
              >
                Vider le journal
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#151D27] text-slate-400 dark:text-[#687585] flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-base font-bold text-slate-800 dark:text-[#F5F7FA]">
                Aucune entrée dans le journal d&apos;audit
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto leading-relaxed">
                Le journal d&apos;audit est actuellement vide. Toutes les nouvelles opérations sensibles (création de compte, publication, connexion) apparaîtront automatiquement ici.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-[#263241]">
              {logs.map((log) => {
                const info = getActionInfo(log.action);
                return (
                  <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50/50 dark:hover:bg-[#151D27]/50 transition-colors">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${info.color}`}>
                      {info.icon}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">{info.label}</span>
                        <ChevronRight className="w-3 h-3 text-slate-400 dark:text-[#687585]" />
                        <span className="text-xs font-medium text-slate-700 dark:text-[#AAB4C0]">{log.user}</span>
                      </div>
                      {log.details && (
                        <div className="text-[11px] text-slate-500 dark:text-[#AAB4C0] font-mono bg-slate-50 dark:bg-[#151D27] px-2 py-1 rounded-md border border-slate-100 dark:border-[#263241] inline-block max-w-full truncate">
                          {JSON.stringify(log.details)}
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0 space-y-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-[#687585]">
                        <Clock className="w-3 h-3" />
                        <span>{formatRelativeTime(log.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 dark:text-[#687585]">
                        <Activity className="w-3 h-3" />
                        <span className="font-mono">{log.ip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
