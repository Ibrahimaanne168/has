"use client";

import React from "react";
import {
  Shield, Clock, User, Activity, ChevronRight,
  UserPlus, KeyRound, BookOpen, Trash2, FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";

const ACTION_TYPES = [
  { key: "INSCRIPTION_ETUDIANT_2FA", label: "Inscription Étudiant", icon: <UserPlus className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700" },
  { key: "CONNEXION_REUSSIE", label: "Connexion", icon: <Activity className="w-4 h-4" />, color: "bg-blue-100 text-blue-700" },
  { key: "MODIFICATION_MOT_DE_PASSE", label: "Changement MDP", icon: <KeyRound className="w-4 h-4" />, color: "bg-amber-100 text-amber-700" },
  { key: "PUBLICATION_COURS", label: "Cours publié", icon: <BookOpen className="w-4 h-4" />, color: "bg-[#0f2744]/10 text-[#0f2744]" },
  { key: "SUPPRESSION_COMPTE", label: "Compte supprimé", icon: <Trash2 className="w-4 h-4" />, color: "bg-red-100 text-red-700" },
  { key: "PUBLICATION_COMMUNIQUE", label: "Communiqué", icon: <FileText className="w-4 h-4" />, color: "bg-purple-100 text-purple-700" },
];

const MOCK_AUDIT_LOGS = [
  { id: "a1", user: "Administration HAS", action: "INSCRIPTION_ETUDIANT_2FA", details: { email: "mamadou.traore@etudiant.halil-academie.com", matricule: "HAS-2024-ETU-3812" }, ip: "197.234.12.45", created_at: new Date(Date.now() - 1000 * 60 * 35).toISOString() },
  { id: "a2", user: "Dr. Ousmane Touré", action: "PUBLICATION_COURS", details: { titre: "Optimisation PostgreSQL — Chapitre 4", classe: "L2-ISN" }, ip: "197.234.18.10", created_at: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: "a3", user: "Administration HAS", action: "PUBLICATION_COMMUNIQUE", details: { titre: "Emplois du temps Semestre 1 disponibles" }, ip: "197.234.12.45", created_at: new Date(Date.now() - 1000 * 60 * 180).toISOString() },
  { id: "a4", user: "Mamadou Traoré", action: "MODIFICATION_MOT_DE_PASSE", details: { email: "m.traore@etudiant.halil-academie.com" }, ip: "154.72.45.3", created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString() },
  { id: "a5", user: "Administration HAS", action: "INSCRIPTION_ETUDIANT_2FA", details: { email: "awa.coulibaly@etudiant.halil-academie.com", matricule: "HAS-2024-ETU-4291" }, ip: "197.234.12.45", created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
  { id: "a6", user: "Administration HAS", action: "SUPPRESSION_COMPTE", details: { email: "test.user@halil-academie.com", raison: "Compte de test" }, ip: "197.234.12.45", created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString() },
];

export default function AdminAuditPage() {
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
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Journal d&apos;Audit de Sécurité</h1>
          <p className="text-xs text-slate-500 mt-1">
            Traçabilité des actions sensibles — accès, créations, modifications et suppressions de comptes
          </p>
        </div>

        {/* Légende des types d'actions */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Types d&apos;événements journalisés</h3>
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
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#0f2744]" />
            <span className="text-sm font-bold text-slate-800">
              {MOCK_AUDIT_LOGS.length} entrées récentes — ordonnées par date
            </span>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_AUDIT_LOGS.map((log) => {
              const info = getActionInfo(log.action);
              return (
                <div key={log.id} className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${info.color}`}>
                    {info.icon}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{info.label}</span>
                      <ChevronRight className="w-3 h-3 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700">{log.user}</span>
                    </div>
                    {log.details && (
                      <div className="text-[11px] text-slate-500 font-mono bg-slate-50 px-2 py-1 rounded-md border border-slate-100 inline-block max-w-full truncate">
                        {JSON.stringify(log.details)}
                      </div>
                    )}
                  </div>
                  <div className="text-right shrink-0 space-y-1">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(log.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Activity className="w-3 h-3" />
                      <span className="font-mono">{log.ip}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
