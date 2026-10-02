"use client";

import React from "react";
import Link from "next/link";
import {
  Users, BookOpen, GraduationCap, MessageSquare, FileText, BarChart3,
  ArrowRight, Shield, TrendingUp, Calendar, Bell, ShieldCheck, Sparkles,
  UserCheck, AlertTriangle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_CLASSES } from "@/lib/data/mock-data";
import { getStoredCourses, getStoredEDTs, getStoredCommuniques, getStoredProfesseurs } from "@/lib/academicStorage";

export default function AdminDashboard() {
  const [coursesCount, setCoursesCount] = React.useState(0);
  const [edtsCount, setEdtsCount] = React.useState(0);
  const [communiquesCount, setCommuniquesCount] = React.useState(0);
  const [profsCount, setProfsCount] = React.useState(6);

  React.useEffect(() => {
    setCoursesCount(getStoredCourses().length);
    setEdtsCount(getStoredEDTs().length);
    setCommuniquesCount(getStoredCommuniques().length);
    setProfsCount(getStoredProfesseurs().length);
    const handleUpdate = () => {
      setCoursesCount(getStoredCourses().length);
      setEdtsCount(getStoredEDTs().length);
      setCommuniquesCount(getStoredCommuniques().length);
      setProfsCount(getStoredProfesseurs().length);
    };
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const stats = [
    { label: "Enseignants actifs", value: profsCount.toString(), icon: <GraduationCap className="w-6 h-6" />, color: "text-emerald-700", bg: "bg-emerald-50", trend: "Personnel enseignant" },
    { label: "Cours & Chapitres", value: coursesCount.toString(), icon: <BookOpen className="w-6 h-6" />, color: "text-blue-700", bg: "bg-blue-50", trend: coursesCount === 0 ? "Aucun publié" : `${coursesCount} actif(s)` },
    { label: "Emplois du temps", value: edtsCount.toString(), icon: <Calendar className="w-6 h-6" />, color: "text-[#0f2744]", bg: "bg-[#0f2744]/8", trend: edtsCount === 0 ? "En attente" : `${edtsCount} validé(s)` },
    { label: "Classes actives", value: MOCK_CLASSES.length.toString(), icon: <BarChart3 className="w-6 h-6" />, color: "text-amber-700", bg: "bg-amber-50", trend: "Année 2024-2025" },
    { label: "Communiqués officiels", value: communiquesCount.toString(), icon: <Bell className="w-6 h-6" />, color: "text-purple-700", bg: "bg-purple-50", trend: communiquesCount === 0 ? "Aucun" : `${communiquesCount} publié(s)` },
    { label: "Statut Système", value: "Actif", icon: <ShieldCheck className="w-6 h-6" />, color: "text-emerald-700", bg: "bg-emerald-50", trend: "Plateforme en ligne" },
  ];

  const recentActions = [
    { action: "Système académique initialisé", detail: "Configuration Halil Académie Scientifique", time: "Aujourd'hui", type: "creation" },
    { action: "Surveillance de la plateforme", detail: "Services opérationnels et sécurisés", time: "En continu", type: "success" },
  ];

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="Directeur Général — Supervision Totale"
    >
      <div className="space-y-8">
        {/* Bannière Admin */}
        <div className="bg-[#0f2744] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Tableau de Supervision — Accès Administrateur Général</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Supervision Globale — Halil Académie Scientifique
            </h1>
            <p className="text-sm text-slate-300">
              Gérez les comptes, les cours, les filières, les emplois du temps, les communiqués et la modération en un seul espace sécurisé.
            </p>
          </div>
        </div>

        {/* Grille des statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className={`w-11 h-11 rounded-lg ${s.bg} flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-slate-900">{s.value}</div>
                <div className="text-xs text-slate-600 font-medium">{s.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{s.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides Admin */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#0f2744]">Actions Administratives Rapides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Gérer les comptes", href: "/admin/comptes", icon: <UserCheck className="w-5 h-5" /> },
              { label: "Cours & Chapitres", href: "/admin/cours", icon: <BookOpen className="w-5 h-5" /> },
              { label: "Publier EDT", href: "/admin/edt", icon: <Calendar className="w-5 h-5" /> },
              { label: "Nouveau communiqué", href: "/admin/communiques", icon: <Bell className="w-5 h-5" /> },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="p-4 rounded-lg border border-slate-200 hover:border-[#0f2744]/40 hover:bg-slate-50/80 transition-all text-center space-y-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-[#0f2744]/8 text-[#0f2744] flex items-center justify-center mx-auto group-hover:bg-[#0f2744] group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 block">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Journal d'activités récentes */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#0f2744]">Activité Récente</h3>
              <Link href="/admin/audit">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Journal complet</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    a.type === "creation" ? "bg-emerald-100 text-emerald-700" :
                    a.type === "info" ? "bg-blue-100 text-blue-700" :
                    a.type === "message" ? "bg-amber-100 text-amber-700" :
                    "bg-slate-100 text-slate-600"
                  }`}>
                    {a.type === "creation" ? "+" : a.type === "message" ? "✉" : "✓"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">{a.action}</p>
                    <p className="text-[11px] text-slate-500 truncate">{a.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes & Points d'attention */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <h3 className="font-serif text-base font-bold text-[#0f2744]">Points d&apos;Attention</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-900">5 messages de contact en attente</p>
                  <p className="text-[11px] text-amber-700 mt-0.5">Demandes d&apos;informations d&apos;admission non traitées</p>
                  <Link href="/admin/messages" className="text-[11px] text-amber-800 font-semibold hover:underline">Traiter maintenant →</Link>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-[#0f2744]/5 border border-[#0f2744]/20 flex items-start gap-3">
                <Shield className="w-4 h-4 text-[#0f2744] shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-[#0f2744]">RLS & Sécurité — Statut : Actif</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Row Level Security active sur toutes les tables</p>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-900">Emplois du temps — Semestre 1 : Publiés</p>
                  <p className="text-[11px] text-emerald-700 mt-0.5">6 classes / plannings validés et accessibles</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
