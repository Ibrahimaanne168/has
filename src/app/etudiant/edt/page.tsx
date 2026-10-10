"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Clock,
  Video,
  ExternalLink,
  Copy,
  CheckCircle2,
  Download,
  Calendar,
  Layers,
  Table as TableIcon,
  BookOpen,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredSeancesEDT, getStoredEDTs } from "@/lib/academicStorage";
import { SeanceEDT, JourSemaine, EmploiDuTemps } from "@/lib/types";
import { downloadOrOpenDocument } from "@/lib/fileDownload";

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

export default function EtudiantEDTPage() {
  const { user } = useCurrentUser();
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [edts, setEdts] = useState<EmploiDuTemps[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"tableau" | "grille">("tableau");

  // Niveau et filière de l'étudiant
  const userNiveau = (user.classe?.niveau || "L1") as "L1" | "L2";
  const userFiliere = (user.filiere?.code || "MIASS") as "MPI" | "SML" | "MIASS";

  // Filtre d'affichage : "MINE" (ses cours), "ALL" (tous les cours L1/L2), ou par filière
  const [filterMode, setFilterMode] = useState<string>("MINE");

  const reload = () => {
    setSeances(getStoredSeancesEDT());
    setEdts(getStoredEDTs());
  };

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, []);

  // Séances de la promotion de l'étudiant (L1 ou L2)
  const promoSeances = useMemo(() => {
    return seances.filter((s) => (s.niveau || "L1") === userNiveau);
  }, [seances, userNiveau]);

  // Séances affichées selon le filtre
  const displayedSeances = useMemo(() => {
    let list = promoSeances;
    if (filterMode === "MINE") {
      list = list.filter((s) => {
        if (!s.filieres || s.filieres.length === 0 || s.filieres.length >= 3) return true; // tronc commun
        return s.filieres.includes(userFiliere);
      });
    } else if (filterMode === "TRONC_COMMUN") {
      list = list.filter((s) => !s.filieres || s.filieres.length === 0 || s.filieres.length >= 3);
    } else if (filterMode !== "ALL") {
      list = list.filter((s) => s.filieres && s.filieres.includes(filterMode as any));
    }

    return [...list].sort((a, b) => {
      const idxA = JOURS.indexOf(a.jour);
      const idxB = JOURS.indexOf(b.jour);
      if (idxA !== idxB) return idxA - idxB;
      return a.heure_debut.localeCompare(b.heure_debut);
    });
  }, [promoSeances, filterMode, userFiliere]);

  // Créneaux horaires uniques
  const timeSlots = useMemo(() => {
    return Array.from(
      new Set(displayedSeances.map((s) => `${s.heure_debut}–${s.heure_fin}`))
    ).sort();
  }, [displayedSeances]);

  const handleCopyMeet = (url: string) => {
    navigator?.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  const currentEDT = edts.find((e) => e.classe?.niveau === userNiveau);

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">
                Emploi du Temps — Promotion {userNiveau === "L2" ? "Licence 2" : "Licence 1"}
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Tableau des Cours Hebdomadaires
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              Promotion <strong className="text-[#0f2744] dark:text-[#F5F7FA]">Licence {userNiveau === "L2" ? "2" : "1"}</strong> — Votre filière : <strong className="text-[#e0521c] font-black">{userFiliere}</strong>
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

            {currentEDT && (
              <button
                type="button"
                onClick={(e) =>
                  downloadOrOpenDocument(
                    currentEDT.file_url,
                    currentEDT.file_name || `${(currentEDT.title || "Emploi_du_temps").replace(/[/\\?%*:|"<>]/g, "_")}.pdf`,
                    e
                  )
                }
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0f2744] dark:bg-[#e0521c] hover:bg-[#183a62] dark:hover:bg-[#c84418] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0 cursor-pointer active:scale-95"
              >
                <Download className="w-3.5 h-3.5 text-[#e0521c] dark:text-white" />
                EDT officiel (PDF)
              </button>
            )}
          </div>
        </div>

        {/* Barre de filtre par filière pour l'étudiant */}
        <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">Filtrer les cours :</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              onClick={() => setFilterMode("MINE")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterMode === "MINE"
                  ? "bg-[#e0521c] text-white shadow-xs"
                  : "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
              }`}
            >
              Mes cours ({userFiliere} &amp; Tronc Commun)
            </button>
            <button
              onClick={() => setFilterMode("ALL")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterMode === "ALL"
                  ? "bg-[#0f2744] text-white dark:bg-slate-700 shadow-xs"
                  : "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
              }`}
            >
              Tous les cours L{userNiveau === "L2" ? "2" : "1"} ({promoSeances.length})
            </button>
            {(["MIASS", "MPI", "SML"] as const).map((fil) => (
              <button
                key={fil}
                onClick={() => setFilterMode(fil)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterMode === fil
                    ? "bg-[#0f2744] text-white dark:bg-[#e0521c] shadow-xs"
                    : "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
                }`}
              >
                {fil}
              </button>
            ))}
          </div>
        </div>

        {/* ── 1. SOUS FORME DE TABLEAU POUR LES ÉTUDIANTS SELON LA CLASSE ── */}
        {viewMode === "tableau" && (
          <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex items-center justify-between">
              <div>
                <h2 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA] flex items-center gap-2">
                  <TableIcon className="w-4 h-4 text-[#e0521c]" />
                  Emploi du Temps Licence {userNiveau === "L2" ? "2" : "1"} ({displayedSeances.length} séance{displayedSeances.length !== 1 ? "s" : ""})
                </h2>
                <p className="text-xs text-slate-400 dark:text-[#687585]">
                  Filières différenciées (MPI, SML, MIASS) · Du Lundi au Dimanche
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5">
              {displayedSeances.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-slate-50/50 dark:bg-[#151D27]/30 rounded-2xl border border-dashed border-slate-200 dark:border-[#263241]">
                  <Calendar className="w-10 h-10 text-slate-300 dark:text-[#687585] mx-auto" />
                  <p className="text-sm font-bold text-slate-600 dark:text-[#AAB4C0]">
                    Aucun cours programmé pour ce filtre
                  </p>
                  <p className="text-xs text-slate-400 dark:text-[#687585]">
                    Sélectionnez « Tous les cours » ou vérifiez ultérieurement.
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
                        <th className="py-3 px-5">ENSEIGNANT</th>
                        <th className="py-3 px-4 text-center w-36">ACCÈS EN LIGNE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                      {displayedSeances.map((s, idx) => {
                        const isEven = idx % 2 === 0;
                        const fBadge = getFiliereBadgeInfo(s.filieres);
                        const isMyFiliere = s.filieres?.includes(userFiliere);
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

                            {/* FILIÈRE DIFFÉRENCIÉE */}
                            <td className="py-3.5 px-4 text-center whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${fBadge.color} ${
                                isMyFiliere ? "ring-2 ring-[#e0521c]/40 font-black" : ""
                              }`}>
                                {fBadge.label}
                              </span>
                            </td>

                            <td className="py-3.5 px-5 font-bold text-xs text-slate-800 dark:text-slate-200">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#e0521c] flex items-center justify-center font-black text-[10px] shrink-0">
                                  {(s.professeur_nom || "H")[0]}
                                </div>
                                <span>{s.professeur_nom || "Mister Halil"}</span>
                              </div>
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
                                    Rejoindre
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyMeet(s.meet_url!)}
                                    title="Copier le lien Meet"
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-[#263241] hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500 cursor-pointer"
                                  >
                                    {copiedLink === s.meet_url ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
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
                <p className="text-sm font-semibold text-slate-500 dark:text-[#AAB4C0]">Aucun cours cette semaine</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-sm">
                <table className="w-full min-w-[950px] bg-white dark:bg-[#111821] text-sm">
                  <thead>
                    <tr className="bg-[#0f2744] dark:bg-[#151D27] divide-x divide-white/10 dark:divide-[#263241]">
                      <th className="px-4 py-3 text-left text-xs font-bold text-white/70 dark:text-[#AAB4C0] uppercase tracking-wider w-24">
                        Heure
                      </th>
                      {JOURS.map((jour) => {
                        const cnt = displayedSeances.filter((s) => s.jour === jour).length;
                        return (
                          <th key={jour} className="px-3 py-3 text-center text-xs font-bold text-white dark:text-[#F5F7FA] uppercase tracking-wider">
                            <div>{jour}</div>
                            {cnt > 0 && <div className="text-[10px] font-normal text-white/50 mt-0.5">{cnt} cours</div>}
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
                          const cells = displayedSeances.filter(
                            (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                          );
                          return (
                            <td key={jour} className="px-2 py-2 border-r border-slate-100 dark:border-[#263241] align-top min-w-[125px]">
                              {cells.map((s) => {
                                const fBadge = getFiliereBadgeInfo(s.filieres);
                                return (
                                  <div key={s.id} className="rounded-xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/60 dark:bg-[#151D27] p-2.5 mb-1.5 shadow-2xs space-y-1">
                                    <p className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] leading-tight">{s.matiere_nom}</p>
                                    <div>
                                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black border ${fBadge.color}`}>
                                        {fBadge.label}
                                      </span>
                                    </div>
                                    <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">👤 {s.professeur_nom || "Mister Halil"}</p>
                                    {s.meet_url && (
                                      <div className="flex items-center gap-1 mt-2 pt-1.5 border-t border-current/10">
                                        <a
                                          href={s.meet_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex-1 inline-flex items-center justify-center gap-1 py-1 rounded-md text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                        >
                                          <Video className="w-3 h-3" />
                                          Rejoindre
                                        </a>
                                        <button
                                          onClick={() => handleCopyMeet(s.meet_url!)}
                                          className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 dark:border-[#263241] rounded-md hover:bg-white transition-colors"
                                        >
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
