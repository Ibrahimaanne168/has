"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  ExternalLink,
  Copy,
  GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS } from "@/lib/data/mock-data";
import { getStoredEDTs, getStoredSeancesEDT, getStoredClasses } from "@/lib/academicStorage";
import { EmploiDuTemps, SeanceEDT, JourSemaine, Classe } from "@/lib/types";

const CURRENT_PROF = MOCK_PROFESSEURS[0];
const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function ProfesseurEDTPage() {
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [selectedClasseFilter, setSelectedClasseFilter] = useState<string>("all");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const reloadData = () => {
    setSeances(getStoredSeancesEDT());
    setClasses(getStoredClasses());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  // Séances enseignées par ce professeur
  const mySeances = seances.filter((s) => {
    const isMe =
      s.professeur_id === CURRENT_PROF.id ||
      Boolean(CURRENT_PROF.nom && s.professeur_nom.toLowerCase().includes(CURRENT_PROF.nom.toLowerCase())) ||
      !s.professeur_id;
    const matchClasse = selectedClasseFilter === "all" || s.classe_id === selectedClasseFilter;
    return isMe && matchClasse;
  });

  const handleCopyMeet = (url: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.matricule || "PROF001"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">
                Planning Enseignant
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Semaine en cours
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Mes Séances &amp; Visioconférences
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tableau hebdomadaire de vos cours magistraux, TD et visios Google Meet
            </p>
          </div>

          {/* Filtre par classe */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Filtrer par classe :</label>
            <select
              value={selectedClasseFilter}
              onChange={(e) => setSelectedClasseFilter(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            >
              <option value="all">Toutes vos classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tableau hebdomadaire (Grid Lundi - Samedi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {JOURS.map((jour) => {
            const jourSeances = mySeances
              .filter((s) => s.jour === jour)
              .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

            return (
              <div
                key={jour}
                className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col overflow-hidden"
              >
                {/* En-tête jour */}
                <div className="px-4 py-3 bg-[#0f2744]/5 border-b border-slate-200/80 flex items-center justify-between">
                  <span className="font-serif text-sm font-bold text-[#0f2744]">{jour}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#0f2744]/10 text-[#0f2744]">
                    {jourSeances.length}
                  </span>
                </div>

                {/* Séances */}
                <div className="p-3 flex-1 flex flex-col gap-3 min-h-[300px]">
                  {jourSeances.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                      <Clock className="w-5 h-5 text-slate-300 mb-1" />
                      <p className="text-[11px] text-slate-400 font-medium">Aucun cours</p>
                    </div>
                  ) : (
                    jourSeances.map((s) => {
                      const typeBadge = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                      const matchedClasse = classes.find((c) => c.id === s.classe_id);

                      return (
                        <div
                          key={s.id}
                          className="rounded-lg border border-slate-200/90 bg-white p-3 shadow-xs hover:border-[#0f2744]/40 transition-all flex flex-col gap-2"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#e0521c]" />
                              {s.heure_debut} - {s.heure_fin}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}
                            >
                              {s.type_seance || "CM"}
                            </span>
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                              {s.matiere_nom}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">
                              {s.matiere_code}
                            </span>
                          </div>

                          <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                            {matchedClasse && (
                              <div className="flex items-center gap-1.5 truncate">
                                <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="font-semibold text-slate-700">{matchedClasse.code}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1.5 truncate">
                              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{s.salle}</span>
                            </div>
                          </div>

                          {/* Bouton Lancer / Rejoindre la Visio Google Meet */}
                          {s.meet_url && (
                            <div className="mt-1 pt-2 border-t border-slate-100 flex items-center gap-1.5">
                              <a
                                href={s.meet_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-colors shadow-xs"
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>Démarrer le Meet</span>
                                <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                              </a>
                              <button
                                onClick={() => handleCopyMeet(s.meet_url!)}
                                className="p-1.5 text-slate-500 hover:text-slate-800 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shrink-0"
                                title="Copier le lien"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
