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
import { downloadOrOpenDocument } from "@/lib/fileDownload";

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

  const [activeNiveauTab, setActiveNiveauTab] = useState<"all" | "L1" | "L2">("all");

  const toggleFavorite = (courseId: string) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, is_favorite: !c.is_favorite } : c))
    );
  };

  const userClasseCode = user.classe?.code || "";
  const userNiveau = user.classe?.niveau || "";

  const filteredCourses = courses.filter((c) => {
    const courseClasses: string[] = (c.classes && c.classes.length > 0)
      ? c.classes
      : (c.matiere?.classes && c.matiere.classes.length > 0)
        ? c.matiere.classes
        : (c.classe?.code ? [c.classe.code] : []);

    const matchesClasse = courseClasses.length === 0 ||
      courseClasses.some((cls) => {
        const clsUpper = cls.toUpperCase();
        const userUpper = userClasseCode.toUpperCase();
        if (clsUpper === userUpper) return true;
        if (userNiveau && clsUpper === userNiveau.toUpperCase()) return true;
        return false;
      });

    // Filtre par onglet Matières L1 ou L2
    const matchesNiveauTab =
      activeNiveauTab === "all" ||
      (c.matiere?.niveau === activeNiveauTab) ||
      courseClasses.some((cls) => cls.toUpperCase().startsWith(activeNiveauTab));

    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMatiere = selectedMatiere === "all" || c.matiere_id === selectedMatiere;
    const matchesFavorites = !onlyFavorites || c.is_favorite;
    return matchesClasse && matchesNiveauTab && matchesSearch && matchesMatiere && matchesFavorites;
  });

  const availableMatieres = MOCK_MATIERES.filter((m) => {
    if (activeNiveauTab === "all") return true;
    return m.niveau === activeNiveauTab || (m.classes || []).some((cls) => cls.startsWith(activeNiveauTab));
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Cours &amp; Fiches Académiques
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              Supports officiels, syllabus et fiches de TD classés par niveau
            </p>
          </div>

          {/* Onglets 2 Espaces : Matières L1 / Matières L2 */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#151D27] rounded-xl border border-slate-200/80 dark:border-[#263241] w-fit shrink-0">
            <button
              onClick={() => { setActiveNiveauTab("all"); setSelectedMatiere("all"); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeNiveauTab === "all"
                  ? "bg-[#0f2744] dark:bg-[#1a385c] text-white shadow-xs dark:border dark:border-[#2b4c73]"
                  : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
              }`}
            >
              Tous
            </button>
            <button
              onClick={() => { setActiveNiveauTab("L1"); setSelectedMatiere("all"); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNiveauTab === "L1"
                  ? "bg-[#0f2744] dark:bg-[#1a385c] text-white shadow-xs dark:border dark:border-[#2b4c73]"
                  : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
              }`}
            >
              <span>Matières L1</span>
            </button>
            <button
              onClick={() => { setActiveNiveauTab("L2"); setSelectedMatiere("all"); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeNiveauTab === "L2"
                  ? "bg-[#0f2744] dark:bg-[#1a385c] text-white shadow-xs dark:border dark:border-[#2b4c73]"
                  : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
              }`}
            >
              <span>Matières L2</span>
            </button>
          </div>
        </div>

        {/* Barre de Recherche & Filtres géométrique */}
        <div className="bg-white dark:bg-[#111821] p-4 rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#687585] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un cours ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] focus:border-[#0f2744] dark:focus:border-[#e0521c] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <select
              value={selectedMatiere}
              onChange={(e) => setSelectedMatiere(e.target.value)}
              className="text-xs border border-slate-200/90 dark:border-[#263241] rounded-lg px-3 py-2 bg-white dark:bg-[#151D27] text-slate-700 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
            >
              <option value="all">
                {activeNiveauTab === "all" ? "Toutes les matières" : `Matières ${activeNiveauTab}`} ({availableMatieres.length})
              </option>
              {availableMatieres.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.code} — {m.name}
                </option>
              ))}
            </select>

            <button
              onClick={() => setOnlyFavorites(!onlyFavorites)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
                onlyFavorites
                  ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/60 text-amber-900 dark:text-amber-300"
                  : "bg-white dark:bg-[#151D27] border-slate-200/90 dark:border-[#263241] text-slate-700 dark:text-[#AAB4C0] hover:bg-slate-50 dark:hover:bg-[#1C2633]"
              }`}
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  onlyFavorites ? "fill-amber-400 text-amber-500" : "text-slate-400 dark:text-[#687585]"
                }`}
              />
              <span>Favoris uniquement</span>
            </button>
          </div>
        </div>

        {/* Grille modulaire des cours (architecture stricte de carte) */}
        {filteredCourses.length === 0 ? (
          <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-12 text-center text-slate-500 dark:text-[#AAB4C0] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] space-y-2">
            <BookOpen className="w-10 h-10 text-slate-300 dark:text-[#687585] mx-auto mb-2" />
            <p className="font-serif text-base font-bold text-slate-800 dark:text-[#F5F7FA]">
              {courses.length === 0
                ? "Aucun cours ou chapitre publié pour le moment"
                : "Aucun cours ne correspond aux critères sélectionnés"}
            </p>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-md mx-auto">
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
                      className="text-slate-300 dark:text-[#687585] hover:text-amber-500 dark:hover:text-amber-400 transition-colors p-1"
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
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 dark:text-[#F5F7FA] leading-snug line-clamp-2 mb-2">
                    {c.title}
                  </h3>

                  {/* Description succincte */}
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] line-clamp-2 leading-relaxed mb-4 flex-1">
                    {c.description}
                  </p>

                  {/* 4. Métadonnées alignées avec icônes filaires fines (14-16px) */}
                  <div className="pt-3 border-t border-slate-100/90 dark:border-[#263241] flex flex-col gap-1.5 text-xs text-slate-500 dark:text-[#AAB4C0]">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0f2744] dark:text-[#e0521c] shrink-0" />
                      <span className="font-medium text-slate-700 dark:text-[#F5F7FA] truncate">{c.professeur?.full_name}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#687585]">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-[#687585] shrink-0" />
                        {new Date(c.created_at).toLocaleDateString("fr-FR")}
                      </span>
                      {c.file_size_bytes && (
                        <span>{(c.file_size_bytes / 1000000).toFixed(1)} Mo</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Pied de carte séparé visuellement avec boutons d'actions nets */}
                <CardFooter className="flex items-center justify-between gap-2 p-3 bg-slate-50/70 dark:bg-[#151D27] border-t border-slate-100/90 dark:border-[#263241]">
                  {c.file_url ? (
                    <button
                      type="button"
                      onClick={(e) =>
                        downloadOrOpenDocument(
                          c.file_url!,
                          c.file_name || `${(c.title || "cours").replace(/[/\\?%*:|"<>]/g, "_")}.pdf`,
                          e
                        )
                      }
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-[#0f2744] dark:bg-[#1a385c] text-white hover:bg-[#183a62] dark:hover:bg-[#234b7a] dark:border dark:border-[#2b4c73] rounded-lg transition-colors flex-1 cursor-pointer active:scale-95"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Télécharger le PDF
                    </button>
                  ) : null}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
