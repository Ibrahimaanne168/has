"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  Bell,
  ArrowRight,
  Download,
  ExternalLink,
  Star,
  Users,
  AlertTriangle,
  Clock,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  MOCK_STUDENT,
  MOCK_COURS,
  MOCK_COMMUNIQUES,
  MOCK_EMPLOI_DU_TEMPS,
} from "@/lib/data/mock-data";

export default function EtudiantDashboard() {
  const [courses, setCourses] = useState(MOCK_COURS);

  const toggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-8">
        {/* ============================================================================== */}
        {/* BANNIÈRE DE BIENVENUE AVEC COORDONNÉES ACADÉMIQUES */}
        {/* ============================================================================== */}
        <div className="bg-[#0f2744] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium text-slate-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Année Universitaire 2024-2025 • Semestre 1</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Ravi de vous revoir, {MOCK_STUDENT.full_name}
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed font-light">
              Bienvenue sur votre portail d&apos;apprentissage de Halil Académie Scientifique.
              Consultez les nouveaux supports déposés par vos enseignants et restez à jour sur les plannings.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-200">
              <span className="bg-white/15 px-3 py-1 rounded-md font-mono">
                Matricule : {MOCK_STUDENT.matricule}
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-md">
                Classe : {MOCK_STUDENT.classe?.name}
              </span>
              <span className="bg-white/15 px-3 py-1 rounded-md">
                Niveau : {MOCK_STUDENT.classe?.niveau}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* ALERTE OFFICIELLE NOUVEL EMPLOI DU TEMPS */}
        {/* ============================================================================== */}
        <div className="bg-amber-50 border-l-4 border-[#e0521c] p-4 sm:p-5 rounded-r-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-[#e0521c] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-amber-950">
                Alerte Emploi du Temps : Planning Semestre 1 validé
              </h3>
              <p className="text-xs text-amber-900/80 mt-0.5">
                Le planning officiel des cours en présentiel et séances de laboratoire a été publié pour votre classe ({MOCK_STUDENT.classe?.code}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Link href="/etudiant/edt" className="w-full sm:w-auto">
              <Button variant="accent" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Consulter l&apos;EDT
              </Button>
            </Link>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* APERÇU DES 4 DERNIERS COURS PUBLIÉS */}
        {/* ============================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">
                Derniers Cours & Travaux Dirigés
              </h2>
              <p className="text-xs text-slate-500">Supports pédagogiques récemment mis en ligne</p>
            </div>
            <Link href="/etudiant/cours">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Tous les cours
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.slice(0, 4).map((c) => (
              <Card key={c.id} hoverEffect className="flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <Badge variant="primary" size="sm">
                      {c.matiere?.name}
                    </Badge>
                    <button
                      onClick={() => toggleFavorite(c.id)}
                      title={c.is_favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      className="text-slate-400 hover:text-amber-500 transition-colors"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          c.is_favorite ? "fill-amber-400 text-amber-500" : ""
                        }`}
                      />
                    </button>
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 line-clamp-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {c.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 pb-4">
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0f2744]" />
                      <span className="font-medium text-slate-700">{c.professeur?.full_name}</span>
                    </div>
                    <span>{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-2">
                    {c.file_url && (
                      <a
                        href={c.file_url}
                        download
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0f2744]/5 text-[#0f2744] hover:bg-[#0f2744]/10 rounded-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Télécharger le support PDF
                      </a>
                    )}
                    {c.external_url && (
                      <a
                        href={c.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-[#0f2744]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Lien externe
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* ============================================================================== */}
        {/* COMMUNIQUÉS OFFICIELS IMPORTANTS */}
        {/* ============================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">
                Communiqués de l&apos;Administration
              </h2>
              <p className="text-xs text-slate-500">Notes de service et directives officielles</p>
            </div>
            <Link href="/etudiant/communiques">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Tous les communiqués
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_COMMUNIQUES.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {item.is_important && (
                      <Badge variant="accent" size="sm">
                        Important
                      </Badge>
                    )}
                    <span className="text-xs text-slate-400">
                      {new Date(item.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-slate-900">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl">
                    {item.content}
                  </p>
                </div>

                <Link href="/etudiant/communiques" className="shrink-0">
                  <Button variant="outline" size="sm">
                    Lire le communiqué
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
