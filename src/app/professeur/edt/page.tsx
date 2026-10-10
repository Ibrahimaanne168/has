"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar, Clock, Video, CheckCircle2, ExternalLink, Copy,
  GraduationCap, Layers, Table as TableIcon, BookOpen,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import { getStoredSeancesEDT } from "@/lib/academicStorage";
import { SeanceEDT, JourSemaine } from "@/lib/types";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

function formatHeureDisplay(h: string) {
  if (!h) return "";
  if (h.includes("h")) return h;
  const parts = h.split(":");
  if (parts.length >= 2) return `${parts[0]}h${parts[1]}`;
  return h;
}

function getFiliereBadgeInfo(filieres?: ("MPI" | "SML" | "MIASS")[]) {
  if (!filieres || filieres.length === 0 || filieres.length >= 3) {
    return {
      label: "Tronc Commun",
      color: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    };
  }
  if (filieres.length === 1) {
    const f = filieres[0];
    if (f === "MIASS") {
      return {
        label: "MIASS",
        color: "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      };
    }
    if (f === "MPI") {
      return {
        label: "MPI",
        color: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
      };
    }
    if (f === "SML") {
      return {
        label: "SML",
        color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
      };
    }
  }
  return {
    label: filieres.join(" & "),
    color: "bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60",
  };
}

export default function ProfesseurEDTPage() {
  const { prof } = useCurrentProfesseur();
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [activeNiveau, setActiveNiveau] = useState<"L1" | "L2">("L2");
  const [viewMode, setViewMode] = useState<"tableau" | "grille">("tableau");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const reload = () => setSeances(getStoredSeancesEDT());

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, []);

  // Séances du prof connecté (par id, matricule ou par nom / Mister Halil)
  const mySeances = useMemo(() =>
    seances.filter((s) => {
      const isMe =
        (prof.id && s.professeur_id === prof.id) ||
        (prof.matricule && s.professeur_id === prof.matricule) ||
        (prof.full_name && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.full_name.toLowerCase())) ||
        (prof.nom && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.nom.toLowerCase())) ||
        ((prof.username === "halilsamb" || (prof.nom && prof.nom.toLowerCase().includes("samb"))) &&
          s.professeur_nom && s.professeur_nom.toLowerCase().includes("halil")) ||
        (prof.nom && prof.nom.toLowerCase().includes("thiam") && s.professeur_nom && s.professeur_nom.toLowerCase().includes("thiam")) ||
        (((prof.nom && prof.nom.toLowerCase().includes("sow")) || (prof.prenom && prof.prenom.toLowerCase().includes("diop"))) &&
          s.professeur_nom && (s.professeur_nom.toLowerCase().includes("diop") || s.professeur_nom.toLowerCase().includes("sow"))) ||
        (prof.nom && prof.nom.toLowerCase().includes("ndiaye") && s.professeur_nom && s.professeur_nom.toLowerCase().includes("ndiogou"));
      return isMe && (s.niveau || "L1") === activeNiveau;
    }),
    [seances, prof, activeNiveau]
  );

  // Tri par jour puis par heure
  const sortedMySeances = useMemo(() => {
    return [...mySeances].sort((a, b) => {
      const idxA = JOURS.indexOf(a.jour);
      const idxB = JOURS.indexOf(b.jour);
      if (idxA !== idxB) return idxA - idxB;
      return a.heure_debut.localeCompare(b.heure_debut);
    });
  }, [mySeances]);

  const timeSlots = useMemo(() => {
    const slots = new Set<string>();
    mySeances.forEach((s) => slots.add(`${s.heure_debut}–${s.heure_fin}`));
    return Array.from(slots).sort();
  }, [mySeances]);

  const handleCopy = (url: string) => {
    navigator?.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const totalMySessions = seances.filter((s) =>
    (prof.id && s.professeur_id === prof.id) ||
    (prof.matricule && s.professeur_id === prof.matricule) ||
    (prof.full_name && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.full_name.toLowerCase())) ||
    (prof.nom && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.nom.toLowerCase())) ||
    ((prof.username === "halilsamb" || (prof.nom && prof.nom.toLowerCase().includes("samb"))) &&
      s.professeur_nom && s.professeur_nom.toLowerCase().includes("halil"))
  ).length;

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">Mon Emploi du Temps</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Tableau de Mes Cours
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              <strong className="text-[#0f2744] dark:text-[#F5F7FA]">{totalMySessions}</strong> séance(s) au total · Promotion active : <strong>Licence {activeNiveau === "L2" ? "2" : "1"}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Bascule Tableau vs Grille */}
            <div className="flex p-1 bg-slate-100 dark:bg-[#151D27] rounded-xl border border-slate-200 dark:border-[#263241]">
              <button
                type="button"
                onClick={() => setViewMode("tableau")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "tableau"
                    ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-[#F5F7FA] shadow-xs"
                    : "text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800"
                }`}
              >
                <TableIcon className="w-3.5 h-3.5 text-[#e0521c]" />
                Format Tableau
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grille")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grille"
                    ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-[#F5F7FA] shadow-xs"
                    : "text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Grille Semaine
              </button>
            </div>
          </div>
        </div>

        {/* Onglets L1 / L2 */}
        <div className="flex gap-2 p-1.5 bg-slate-100/90 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] rounded-2xl w-fit">
          {(["L1", "L2"] as const).map((niv) => {
            const cnt = seances.filter((s) =>
              ((prof.id && s.professeur_id === prof.id) ||
              (prof.matricule && s.professeur_id === prof.matricule) ||
              (prof.full_name && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.full_name.toLowerCase())) ||
              (prof.nom && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.nom.toLowerCase())) ||
              ((prof.username === "halilsamb" || (prof.nom && prof.nom.toLowerCase().includes("samb"))) &&
                s.professeur_nom && s.professeur_nom.toLowerCase().includes("halil"))) &&
              (s.niveau || "L1") === niv
            ).length;
            return (
              <button
                key={niv}
                onClick={() => setActiveNiveau(niv)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  activeNiveau === niv
                    ? "bg-[#0f2744] dark:bg-[#e0521c] text-white shadow-sm"
                    : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900"
                }`}
              >
                Licence {niv === "L1" ? "1 (L1)" : "2 (L2)"}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                  activeNiveau === niv ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-[#263241] text-slate-600 dark:text-[#AAB4C0]"
                }`}>
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── 1. SOUS FORME DE TABLEAU POUR LES ENSEIGNANTS SELON LA CLASSE ── */}
        {viewMode === "tableau" && (
          <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex items-center justify-between">
              <h2 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA] flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-[#e0521c]" />
                Vos Séances en Licence {activeNiveau === "L2" ? "2" : "1"} ({sortedMySeances.length})
              </h2>
              <span className="text-xs text-slate-400">
                Filières différenciées (MPI, SML, MIASS)
              </span>
            </div>

            <div className="p-4 sm:p-5">
              {sortedMySeances.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-slate-50/50 dark:bg-[#151D27]/30 rounded-2xl border border-dashed border-slate-200 dark:border-[#263241]">
                  <Calendar className="w-10 h-10 text-slate-300 dark:text-[#687585] mx-auto" />
                  <p className="text-sm font-bold text-slate-600 dark:text-[#AAB4C0]">
                    Aucune séance programmée en Licence {activeNiveau === "L2" ? "2" : "1"}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-[#687585]">
                    L&apos;administration n&apos;a pas encore publié de cours vous concernant sur cette promotion.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#0f2744] text-white dark:bg-[#151D27] uppercase tracking-wider font-extrabold divide-x divide-white/10 dark:divide-[#263241]">
                        <th className="py-3 px-4 text-center w-28">JOUR</th>
                        <th className="py-3 px-4 text-center w-36">HORAIRES</th>
                        <th className="py-3 px-5">MATIÈRE</th>
                        <th className="py-3 px-4 text-center w-36">FILIÈRE</th>
                        <th className="py-3 px-4 text-center w-36">LIEN MEET</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                      {sortedMySeances.map((s, idx) => {
                        const isEven = idx % 2 === 0;
                        const fBadge = getFiliereBadgeInfo(s.filieres);
                        return (
                          <tr
                            key={s.id}
                            className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-[#151D27]/80 ${
                              isEven ? "bg-white dark:bg-[#111821]" : "bg-slate-50/40 dark:bg-[#151D27]/30"
                            }`}
                          >
                            <td className="py-3.5 px-4 text-center font-bold text-xs text-[#0f2744] dark:text-[#F5F7FA]">
                              <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 text-[#0f2744] dark:text-blue-300 font-extrabold">
                                {s.jour}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center font-bold text-xs text-slate-700 dark:text-[#AAB4C0] whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151D27] border border-slate-200/60 dark:border-[#263241]">
                                <Clock className="w-3.5 h-3.5 text-[#e0521c]" />
                                <span>{formatHeureDisplay(s.heure_debut)} – {formatHeureDisplay(s.heure_fin)}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-5 font-bold text-sm text-slate-900 dark:text-[#F5F7FA]">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#0f2744] dark:text-[#e0521c] shrink-0" />
                                <span>{s.matiere_nom}</span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${fBadge.color}`}>
                                {fBadge.label}
                              </span>
                            </td>

                            <td className="py-3.5 px-4 text-center">
                              {s.meet_url ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <a
                                    href={s.meet_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    Lancer Meet
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopy(s.meet_url!)}
                                    title="Copier le lien"
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-[#263241] hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500 cursor-pointer"
                                  >
                                    {copiedLink === s.meet_url ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">Lien non défini</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 2. FORMAT GRILLE HEBDOMADAIRE ────────────────────────── */}
        {viewMode === "grille" && (
          <div>
            {timeSlots.length === 0 ? (
              <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-sm p-12 text-center">
                <Calendar className="w-10 h-10 text-slate-200 dark:text-[#263241] mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-500 dark:text-[#AAB4C0]">Aucune séance en {activeNiveau}</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-sm">
                <table className="w-full min-w-[800px] bg-white dark:bg-[#111821] text-sm">
                  <thead>
                    <tr className="bg-[#0f2744] dark:bg-[#151D27]">
                      <th className="px-4 py-3 text-left text-xs font-bold text-white/70 dark:text-[#AAB4C0] uppercase tracking-wider w-24">Heure</th>
                      {JOURS.map((jour) => {
                        const cnt = mySeances.filter((s) => s.jour === jour).length;
                        return (
                          <th key={jour} className="px-3 py-3 text-center text-xs font-bold text-white dark:text-[#F5F7FA] uppercase tracking-wider">
                            {jour}
                            {cnt > 0 && <div className="text-[10px] font-normal text-white/50 dark:text-[#687585] mt-0.5">{cnt}</div>}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                    {timeSlots.map((slot, i) => (
                      <tr key={slot} className={i % 2 === 0 ? "bg-white dark:bg-[#111821]" : "bg-slate-50/60 dark:bg-[#151D27]/50"}>
                        <td className="px-4 py-3 border-r border-slate-100 dark:border-[#263241] align-top whitespace-nowrap">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0]">
                            <Clock className="w-3 h-3 text-[#e0521c]" />
                            {slot}
                          </div>
                        </td>
                        {JOURS.map((jour) => {
                          const cells = mySeances.filter(
                            (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                          );
                          return (
                            <td key={jour} className="px-2 py-2 border-r border-slate-100 dark:border-[#263241] align-top min-w-[125px]">
                              {cells.map((s) => {
                                const fBadge = getFiliereBadgeInfo(s.filieres);
                                return (
                                  <div key={s.id} className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-[#151D27] p-2.5 mb-1.5 shadow-2xs space-y-1">
                                    <p className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] leading-tight">{s.matiere_nom}</p>
                                    <div>
                                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black border ${fBadge.color}`}>
                                        {fBadge.label}
                                      </span>
                                    </div>
                                    {s.meet_url && (
                                      <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60">
                                        <a href={s.meet_url} target="_blank" rel="noopener noreferrer"
                                          className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                          <Video className="w-3 h-3" /> Lancer
                                        </a>
                                        <button onClick={() => handleCopy(s.meet_url!)}
                                          className="p-1 border border-slate-200 rounded hover:bg-white text-slate-500 cursor-pointer">
                                          {copiedLink === s.meet_url ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
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
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
