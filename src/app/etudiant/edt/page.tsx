"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Video,
  ExternalLink,
  Copy,
  CheckCircle2,
  Download,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredSeancesEDT, getStoredEDTs } from "@/lib/academicStorage";
import { SeanceEDT, JourSemaine, EmploiDuTemps } from "@/lib/types";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function EtudiantEDTPage() {
  const { user } = useCurrentUser();
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [edts, setEdts] = useState<EmploiDuTemps[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Niveau de l'étudiant (L1 ou L2) — extrait du code de classe ou user_metadata
  const userNiveau = (user.classe?.niveau || "L1") as "L1" | "L2";
  // Filière de l'étudiant — extrait du code de filière
  const userFiliere = (user.filiere?.code || "MPI") as "MPI" | "SML" | "MIASS";

  // Onglet actif = niveau de l'étudiant par défaut
  const [activeNiveau, setActiveNiveau] = useState<"L1" | "L2">(userNiveau);

  const reload = () => {
    setSeances(getStoredSeancesEDT());
    setEdts(getStoredEDTs());
  };

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, []);

  // Filtrage des séances :
  // 1. Bon niveau (L1 ou L2)
  // 2. Filière concernée (si filieres est vide/undefined = toutes filières du niveau)
  const seancesFiltrees = seances.filter((s) => {
    const seanceNiveau = s.niveau || "L1";
    if (seanceNiveau !== activeNiveau) return false;

    // Si la séance a des filières spécifiques, vérifier que l'étudiant en fait partie
    if (s.filieres && s.filieres.length > 0) {
      return s.filieres.includes(userFiliere);
    }
    // Sinon (tronc commun du niveau) → tout le monde voit
    return true;
  });

  const handleCopyMeet = (url: string) => {
    navigator?.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // EDT PDF officiel
  const currentEDT = edts.find((e) => e.classe?.niveau === activeNiveau);

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-5">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">
                Emploi du Temps — Semaine en cours
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Planning Hebdomadaire
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Votre filière : <strong className="text-[#e0521c]">{userFiliere}</strong> •
              Niveau : <strong className="text-[#0f2744]">{userNiveau}</strong>
            </p>
          </div>
          {currentEDT && (
            <a
              href={currentEDT.file_url}
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-[#e0521c]" />
              Télécharger l&apos;EDT officiel (PDF)
            </a>
          )}
        </div>

        {/* Onglets L1 / L2 */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          {(["L1", "L2"] as const).map((niv) => (
            <button
              key={niv}
              onClick={() => setActiveNiveau(niv)}
              className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
                activeNiveau === niv
                  ? "bg-[#0f2744] text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Licence {niv === "L1" ? "1" : "2"}
              {niv === userNiveau && (
                <span className="ml-1.5 w-1.5 h-1.5 rounded-full bg-[#e0521c] inline-block" />
              )}
            </button>
          ))}
        </div>

        {/* Info filière visible */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2">
          <Filter className="w-3.5 h-3.5 text-blue-500 shrink-0" />
          <span>
            Vous voyez les cours <strong className="text-[#0f2744]">{activeNiveau}</strong> communs à toutes les filières
            {activeNiveau === userNiveau && (
              <> + les cours spécifiques à <strong className="text-[#e0521c]">{userFiliere}</strong></>
            )}
          </span>
        </div>

        {/* Tableau EDT */}
        {seancesFiltrees.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Aucune séance pour {activeNiveau}</p>
            <p className="text-xs text-slate-400 mt-1">L&apos;administration n&apos;a pas encore publié de cours pour cette semaine.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-sm">
            <table className="w-full min-w-[800px] bg-white text-sm">
              <thead>
                <tr className="bg-[#0f2744]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-white/70 uppercase tracking-wider w-24">Heure</th>
                  {JOURS.map((jour) => {
                    const count = seancesFiltrees.filter((s) => s.jour === jour).length;
                    return (
                      <th key={jour} className="px-4 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                        <div>{jour}</div>
                        {count > 0 && (
                          <div className="text-[10px] font-normal text-white/50 mt-0.5">{count} cours</div>
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {/* Grouper par créneau horaire */}
                {getUniqueTimeSlots(seancesFiltrees).map((slot, i) => (
                  <tr key={slot} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-[#e0521c]" />
                        {slot}
                      </div>
                    </td>
                    {JOURS.map((jour) => {
                      const cell = seancesFiltrees.filter(
                        (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                      );
                      return (
                        <td key={jour} className="px-2 py-2 border-r border-slate-100 align-top">
                          {cell.map((s) => {
                            const tc = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                            const filiereLabel = s.filieres && s.filieres.length > 0 && s.filieres.length < 3
                              ? s.filieres.join(", ")
                              : null;
                            return (
                              <div
                                key={s.id}
                                className={`rounded-lg border p-2.5 mb-1.5 ${tc.bg} ${tc.border} hover:shadow-sm transition-shadow`}
                              >
                                {/* Type + filières */}
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${tc.bg} ${tc.text} border ${tc.border}`}>
                                    {s.type_seance || "CM"}
                                  </span>
                                  {filiereLabel && (
                                    <span className="text-[9px] font-bold text-[#e0521c] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
                                      {filiereLabel}
                                    </span>
                                  )}
                                </div>
                                {/* Matière */}
                                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{s.matiere_nom}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{s.matiere_code}</p>
                                {/* Prof */}
                                <p className="text-[10px] text-slate-600 mt-1 truncate">{s.professeur_nom}</p>
                                {/* En ligne */}
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1">
                                  🌐 En ligne
                                </span>
                                {/* Meet */}
                                {s.meet_url && (
                                  <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-current/10">
                                    <a
                                      href={s.meet_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className={`flex-1 inline-flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors`}
                                    >
                                      <Video className="w-3 h-3" />
                                      Rejoindre
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                    <button
                                      onClick={() => handleCopyMeet(s.meet_url!)}
                                      className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 rounded hover:bg-white transition-colors"
                                      title="Copier"
                                    >
                                      {copiedLink === s.meet_url
                                        ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Bannière info */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600">
            <strong className="text-slate-800">Synchronisation en temps réel —</strong>{" "}
            Toute séance ajoutée par l&apos;administration apparaît immédiatement. Les cours marqués
            avec une filière spécifique (MPI, SML, MIASS) sont visibles uniquement par les étudiants concernés.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Récupère les créneaux horaires uniques et triés
function getUniqueTimeSlots(seances: SeanceEDT[]): string[] {
  const slots = new Set<string>();
  seances.forEach((s) => slots.add(`${s.heure_debut}–${s.heure_fin}`));
  return Array.from(slots).sort();
}
