"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Search,
  Star,
  Download,
  ExternalLink,
  GraduationCap,
  Calendar,
  Layers,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_MATIERES } from "@/lib/data/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredCourses } from "@/lib/academicStorage";
import { Cours } from "@/lib/types";

export default function EtudiantCoursPage() {
  const { user } = useCurrentUser();
  const [courses, setCourses] = useState<Cours[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("all");
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  useEffect(() => {
    setCourses(getStoredCourses());
    const handleUpdate = () => setCourses(getStoredCourses());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

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
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6">
        {/* En-tête de page */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Espace Pédagogique
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Cours &amp; Fiches Académiques
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Supports officiels, syllabus et TD pour votre promotion ({user.classe?.code || "L1-MPI"})
            </p>
          </div>
        </div>

        {/* Barre de Recherche & Filtres géométrique */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un cours ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744] focus:border-[#0f2744] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="text-xs border border-slate-200/90 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            >
              <option value="all">Toutes les matières ({MOCK_MATIERES.length})</option>
              {MOCK_MATIERES.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                onlyFavorites
                  ? "bg-amber-50 border-amber-300 text-amber-900"
                  : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50"
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

        {/* Grille modulaire des cours (architecture stricte de carte) */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/90 p-12 text-center text-slate-500 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="font-serif text-base font-bold text-slate-800">
              {courses.length === 0
                ? "Aucun cours ou chapitre publié pour le moment"
                : "Aucun cours ne correspond aux critères sélectionnés"}
            </p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {courses.length === 0
                ? `L'administration et vos enseignants publieront ici les syllabus, cours magistraux et fiches de TD pour votre promotion (${user.classe?.name || "Licence 1 — MPI"}).`
                : "Modifiez vos filtres ou réinitialisez la barre de recherche pour afficher les autres cours."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((c) => (
              <Card
                key={c.id}
                hoverEffect
                className="flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* 1. En-tête de carte avec badges compacts alignés + bouton favori */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="primary" size="sm" uppercase>
                        {c.classe?.code || "Licence"}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {c.file_name?.split(".").pop()?.toUpperCase() || "SUPPORT"}
                      </Badge>
                    </div>

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

                  {/* 2. Catégorie/Matière en petit surtitre */}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-1.5">
                    {c.matiere?.name}
                  </p>

                  {/* 3. Titre principal affirmé sur 2 lignes max */}
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-2">
                    {c.title}
                  </h3>

                  {/* Description succincte */}
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {c.description}
                  </p>

                  {/* 4. Métadonnées alignées avec icônes filaires fines (14-16px) */}
                  <div className="pt-3 border-t border-slate-100/90 flex flex-col gap-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0f2744] shrink-0" />
                      <span className="font-medium text-slate-700 truncate">{c.professeur?.full_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      {c.file_size_bytes && (
                        <span>{(c.file_size_bytes / 1000000).toFixed(1)} Mo</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Pied de carte séparé visuellement avec boutons d'actions nets */}
                <CardFooter className="flex items-center justify-between gap-2 p-3 bg-slate-50/70 border-t border-slate-100/90">
                  {c.file_url ? (
                    <a
                      href={c.file_url || "#"}
                      download
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0f2744] text-white hover:bg-[#183a62] rounded-lg transition-colors flex-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger le PDF
                    </a>
                  </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
