"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  BookOpen,
  ArrowRight,
  Download,
  ExternalLink,
  Star,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  MOCK_COURS,
  MOCK_COMMUNIQUES,
} from "@/lib/data/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function EtudiantDashboard() {
  const { user } = useCurrentUser();
  const [courses, setCourses] = useState(MOCK_COURS);

  const toggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
    >
      <div className="space-y-7">
        {/* ============================================================================== */}
        {/* BANNIÈRE DE BIENVENUE AVEC COORDONNÉES ACADÉMIQUES */}
        {/* ============================================================================== */}
        <div className="bg-[#0f2744] text-white rounded-xl p-6 sm:p-7 relative overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#0f2744]">
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/10 text-[11px] font-bold uppercase tracking-wider text-slate-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Année Académique 2024-2025 · Semestre 1</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
              Ravi de vous revoir, {user.full_name}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Bienvenue sur votre portail d&apos;apprentissage de Halil Académie Scientifique.
              Consultez les nouveaux supports déposés par vos enseignants et restez à jour sur les plannings.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5 text-xs text-slate-200">
              <span className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg font-mono text-[11px]">
                Matricule : {user.matricule}
              </span>
              <span className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                Classe : {user.classe?.name || "L1 MPI"}
              </span>
              <span className="bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg text-[11px] font-medium">
                Niveau : {user.classe?.niveau || "L1"}
              </span>
            </div>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* ALERTE OFFICIELLE EMPLOI DU TEMPS */}
        {/* ============================================================================== */}
        <div className="bg-[#F8FAFC] border border-amber-300/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-800 border border-amber-300/40 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-0.5">
                Emploi du temps officiel
              </p>
              <h3 className="font-serif text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Planning de la Semaine validé
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Le planning officiel des cours en présentiel et séances de TD est disponible pour votre classe ({user.classe?.code || "L1-MPI"}).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <Link href="/etudiant/edt" className="w-full sm:w-auto">
              <Button variant="accent" size="sm" className="rounded-lg text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Consulter l&apos;EDT
              </Button>
            </Link>
          </div>
        </div>

        {/* ============================================================================== */}
        {/* DERNIERS COURS PUBLIÉS (Cartes géométriques strictes) */}
        {/* ============================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-0.5">
                Supports récents
              </p>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">
                Derniers Cours &amp; Travaux Dirigés
              </h2>
            </div>
            <Link href="/etudiant/cours">
              <Button variant="ghost" size="sm" className="rounded-lg text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Tous les cours
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.slice(0, 4).map((c) => (
              <Card key={c.id} hoverEffect className="flex flex-col justify-between overflow-hidden">
                <div className="p-5 flex-1 flex flex-col">
                  {/* 1. En-tête */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <Badge variant="primary" size="sm" uppercase>
                      {c.classe?.code || "Licence"}
                    </Badge>
                    <button
                      onClick={() => toggleFavorite(c.id)}
                      title={c.is_favorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      className="text-slate-300 hover:text-amber-500 transition-colors p-1"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          c.is_favorite ? "fill-amber-400 text-amber-500" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* 2. Catégorie/Matière */}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    {c.matiere?.name}
                  </p>

                  {/* 3. Titre 2 lignes max */}
                  <h3 className="font-serif text-base font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {c.description}
                  </p>

                  {/* 4. Métadonnées filaires */}
                  <div className="pt-3 border-t border-slate-100/90 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0f2744] shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{c.professeur?.full_name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                {/* 5. Pied de carte */}
                <CardFooter className="flex items-center justify-between gap-2 p-3 bg-slate-50/70 border-t border-slate-100/90">
                  {c.file_url ? (
                    <a
                      href={c.file_url}
                      download
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0f2744] text-white hover:bg-[#183a62] rounded-lg transition-colors flex-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger ({c.file_name?.split(".").pop()?.toUpperCase() || "PDF"})
                    </a>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Support en ligne</span>
                  )}
                  {c.external_url && (
                    <a
                      href={c.external_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-white text-slate-700 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200/90"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* ============================================================================== */}
        {/* COMMUNIQUÉS OFFICIELS */}
        {/* ============================================================================== */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-0.5">
                Information officielle
              </p>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">
                Communiqués de l&apos;Administration
              </h2>
            </div>
            <Link href="/etudiant/communiques">
              <Button variant="ghost" size="sm" className="rounded-lg text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Tous les communiqués
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {MOCK_COMMUNIQUES.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:shadow-md transition-all duration-200"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.is_important && (
                      <Badge variant="accent" size="sm" uppercase>
                        Important
                      </Badge>
                    )}
                    <span className="text-[11px] text-slate-400 font-medium">
                      {new Date(item.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <h4 className="font-serif text-base font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.content}
                  </p>
                </div>

                <Link href="/etudiant/communiques" className="shrink-0">
                  <Button variant="outline" size="sm" className="rounded-lg text-xs border-slate-200/90">
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
