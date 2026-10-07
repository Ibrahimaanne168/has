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
    { label: "Enseignants actifs", value: profsCount.toString(), icon: <GraduationCap className="w-6 h-6" />, color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", trend: "Personnel enseignant" },
    { label: "Cours & Chapitres", value: coursesCount.toString(), icon: <BookOpen className="w-6 h-6" />, color: "text-blue-700 dark:text-cyan-400", bg: "bg-blue-50 dark:bg-[#151D27]", trend: coursesCount === 0 ? "Aucun publié" : `${coursesCount} actif(s)` },
    { label: "Emplois du temps", value: edtsCount.toString(), icon: <Calendar className="w-6 h-6" />, color: "text-[#0f2744] dark:text-[#F5F7FA]", bg: "bg-[#0f2744]/8 dark:bg-[#151D27]", trend: edtsCount === 0 ? "En attente" : `${edtsCount} validé(s)` },
    { label: "Classes actives", value: MOCK_CLASSES.length.toString(), icon: <BarChart3 className="w-6 h-6" />, color: "text-amber-700 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/30", trend: "Année 2024-2025" },
    { label: "Communiqués officiels", value: communiquesCount.toString(), icon: <Bell className="w-6 h-6" />, color: "text-purple-700 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950/30", trend: communiquesCount === 0 ? "Aucun" : `${communiquesCount} publié(s)` },
    { label: "Statut Système", value: "Actif", icon: <ShieldCheck className="w-6 h-6" />, color: "text-emerald-700 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", trend: "Plateforme en ligne" },
  ];

  const recentActions = [
    { action: "Système académique initialisé", detail: "Configuration Halil Académie Scientifique", time: "En continu", type: "creation" },
  ];

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-8">
        {/* En-tête Supervision */}
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
            Supervision Globale
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
            Gérez les comptes, les cours, les filières, les emplois du temps, les communiqués et les échanges en un seul espace.
          </p>
        </div>

        {/* Grille des statistiques */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-5 shadow-xs dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] space-y-3 transition-colors">
              <div className={`w-11 h-11 rounded-lg ${s.bg} border border-transparent dark:border-[#263241] flex items-center justify-center ${s.color}`}>
                {s.icon}
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-slate-900 dark:text-[#F5F7FA]">{s.value}</div>
                <div className="text-xs text-slate-600 dark:text-[#AAB4C0] font-medium">{s.label}</div>
                <div className="text-[11px] text-slate-400 dark:text-[#687585] mt-0.5">{s.trend}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides Admin */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-6 shadow-xs dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] space-y-4">
          <h2 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">Actions Administratives Rapides</h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: "Valider Inscriptions", href: "/admin/inscriptions", icon: <UserCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> },
              { label: "Gérer les comptes", href: "/admin/comptes", icon: <Users className="w-5 h-5" /> },
              { label: "Cours & Chapitres", href: "/admin/cours", icon: <BookOpen className="w-5 h-5" /> },
              { label: "Publier EDT", href: "/admin/edt", icon: <Calendar className="w-5 h-5" /> },
              { label: "Communiqués", href: "/admin/communiques", icon: <Bell className="w-5 h-5" /> },
            ].map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="p-4 rounded-lg border border-slate-200 dark:border-[#263241] hover:border-[#0f2744]/40 dark:hover:border-[#e0521c]/50 hover:bg-slate-50/80 dark:hover:bg-[#151D27] transition-all text-center space-y-2 cursor-pointer group">
                  <div className="w-10 h-10 rounded-lg bg-[#0f2744]/8 dark:bg-[#151D27] text-[#0f2744] dark:text-[#e0521c] border border-transparent dark:border-[#263241] flex items-center justify-center mx-auto group-hover:bg-[#0f2744] dark:group-hover:bg-[#e0521c] group-hover:text-white transition-colors">
                    {action.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] block">{action.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Activité récente */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Journal d'activités récentes */}
          <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-6 shadow-xs dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA]">Activité Récente</h3>
              <Link href="/admin/audit">
                <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Journal complet</Button>
              </Link>
            </div>
            <div className="space-y-3">
              {recentActions.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-slate-50 dark:border-[#263241] last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs ${
                    a.type === "creation" ? "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300" :
                    a.type === "info" ? "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" :
                    a.type === "message" ? "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" :
                    "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0]"
                  }`}>
                    {a.type === "creation" ? "+" : a.type === "message" ? "✉" : "✓"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA] truncate">{a.action}</p>
                    <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] truncate">{a.detail}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 dark:text-[#687585] shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Alertes & Points d'attention */}
          <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-6 shadow-xs dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] space-y-4">
            <h3 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA]">Points d&apos;Attention</h3>
            <div className="space-y-3">
              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-900 dark:text-emerald-300">Emplois du temps</p>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400/90 mt-0.5">Plannings validés pour Licence 1 et Licence 2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
