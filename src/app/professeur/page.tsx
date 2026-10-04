"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  MessageSquare,
  ArrowRight,
  Download,
  ExternalLink,
  PlusCircle,
  Calendar,
  Users,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_CLASSES } from "@/lib/data/mock-data";
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import { getStoredCourses } from "@/lib/academicStorage";
import { Cours } from "@/lib/types";

export default function ProfesseurDashboard() {
  const { prof } = useCurrentProfesseur();
  const [courses, setCourses] = React.useState<Cours[]>([]);
  const myClasses = MOCK_CLASSES.slice(0, 3);

  React.useEffect(() => {
    setCourses(getStoredCourses());
    const handleUpdate = () => setCourses(getStoredCourses());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const myCourses = courses.filter((c) => c.professeur_id === prof.id || c.professeur?.id === prof.id || !c.professeur_id).slice(0, 3);

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
    >
      <div className="space-y-8">
        {/* Bannière de bienvenue Professeur */}
        <div className="bg-[#0f2744] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Espace Enseignant-Chercheur • Année 2024-2025</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Bienvenue, {prof.full_name}
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Gérez vos cours, déposez vos supports pédagogiques et répondez aux questions de vos étudiants depuis votre espace dédié Halil Académie Scientifique.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-2">
              <span className="bg-white/15 px-3 py-1 rounded-md">
                Spécialité : {prof.specialite}
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-md font-mono">
                {prof.matricule}
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Cours publiés", value: myCourses.length.toString(), icon: <BookOpen className="w-5 h-5 text-[#0f2744]" />, color: "bg-[#0f2744]/5" },
            { label: "Classes encadrées", value: myClasses.length.toString(), icon: <Users className="w-5 h-5 text-emerald-600" />, color: "bg-emerald-50" },
            { label: "Messages reçus", value: "3", icon: <MessageSquare className="w-5 h-5 text-amber-600" />, color: "bg-amber-50" },
            { label: "Étudiants total", value: "112", icon: <BarChart3 className="w-5 h-5 text-[#e0521c]" />, color: "bg-[#e0521c]/5" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Link href="/professeur/cours">
            <Button variant="accent" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Déposer un nouveau cours
            </Button>
          </Link>
          <Link href="/professeur/edt">
            <Button variant="outline" size="md" leftIcon={<Calendar className="w-4 h-4" />}>
              Voir les emplois du temps
            </Button>
          </Link>
          <Link href="/professeur/messages">
            <Button variant="outline" size="md" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Messagerie étudiants
            </Button>
          </Link>
        </div>

        {/* Mes derniers cours publiés */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">Mes Cours Récemment Publiés</h2>
              <p className="text-xs text-slate-500">Supports accessibles à vos étudiants</p>
            </div>
            <Link href="/professeur/cours">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Gérer mes cours
              </Button>
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-serif text-sm font-bold text-slate-800">
                Aucun cours publié pour le moment
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Cliquez sur &quot;Publier un nouveau cours&quot; ci-dessus pour déposer votre premier support de cours ou TD.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCourses.map((c) => (
                <Card key={c.id} hoverEffect>
                  <CardHeader className="pb-3">
                    <Badge variant="primary" size="sm">{c.matiere?.code}</Badge>
                    <h3 className="font-serif text-sm font-bold text-slate-900 mt-2 line-clamp-2">{c.title}</h3>
                    <p className="text-xs text-slate-500 mt-1">{c.classe?.code}</p>
                  </CardHeader>
                  <CardContent className="pt-0 pb-4 flex flex-col gap-2">
                    <div className="text-xs text-slate-400">
                      Publié le {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </div>
                    <div className="flex gap-2 pt-1">
                      <Badge variant="success" size="sm" icon={<FileText className="w-3 h-3" />}>
                        Document PDF
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Classes encadrées */}
        <div className="space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#0f2744]">Mes Classes Encadrées</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {myClasses.map((cls) => (
              <div key={cls.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                <div className="w-11 h-11 rounded-lg bg-[#0f2744]/10 flex items-center justify-center text-[#0f2744] font-serif font-bold text-lg shrink-0">
                  {cls.niveau}
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-900">{cls.code}</div>
                  <div className="text-xs text-slate-500">{cls.annee_scolaire}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-[11px] text-emerald-700 font-medium">EDT disponible</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
