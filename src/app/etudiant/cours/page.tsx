"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Search,
  Filter,
  Star,
  Download,
  ExternalLink,
  GraduationCap,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT, MOCK_COURS, MOCK_MATIERES } from "@/lib/data/mock-data";

export default function EtudiantCoursPage() {
  const [courses, setCourses] = useState(MOCK_COURS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const toggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMatiere = selectedMatiere === "all" || c.matiere_id === selectedMatiere;
    const matchesFavorites = !onlyFavorites || c.is_favorite;
    return matchesSearch && matchesMatiere && matchesFavorites;
  });

  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0f2744]">
              Cours & Supports Pédagogiques
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Supports officiels, syllabus et fiches de travaux dirigés pour votre promotion ({MOCK_STUDENT.classe?.code})
            </p>
          </div>
        </div>

        {/* Filtres & Recherche */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un cours ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744] focus:border-[#0f2744]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            >
              <option value="all">Toutes les matières</option>
              {MOCK_MATIERES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                onlyFavorites
                  ? "bg-amber-50 border-amber-300 text-amber-900"
                  : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  onlyFavorites ? "fill-amber-400 text-amber-500" : "text-slate-400"
                }`}
              />
              <span>Favoris uniquement</span>
            </button>
          </div>
        </div>

        {/* Liste des cours */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-700">Aucun cours ne correspond aux critères sélectionnés.</p>
            <p className="text-xs text-slate-400 mt-1">Modifiez vos filtres ou réinitialisez la recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredCourses.map((c) => (
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
                  <h3 className="font-serif text-base font-bold text-slate-900">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                    {c.description}
                  </p>
                </CardHeader>

                <CardContent className="pt-0 pb-5">
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0f2744]" />
                      <span className="font-medium text-slate-700">{c.professeur?.full_name}</span>
                    </div>
                    <span>{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {c.file_url && (
                      <a
                        href={c.file_url}
                        download
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0f2744] text-white hover:bg-[#183a62] rounded-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Télécharger ({c.file_name?.split(".").pop()?.toUpperCase() || "PDF"})
                      </a>
                    )}
                    {c.external_url && (
                      <a
                        href={c.external_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors border border-slate-200"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Ressources complémentaires
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
