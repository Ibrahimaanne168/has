"use client";

import React, { useState, useEffect } from "react";
import {
  Clock,
  Video,
  ExternalLink,
  Copy,
  CheckCircle2,
  Download,
  Calendar,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredSeancesEDT, getStoredEDTs } from "@/lib/academicStorage";
import { SeanceEDT, JourSemaine, EmploiDuTemps } from "@/lib/types";
import { downloadOrOpenDocument } from "@/lib/fileDownload";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
};

export default function EtudiantEDTPage() {
  const { user } = useCurrentUser();
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [edts, setEdts] = useState<EmploiDuTemps[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Niveau et filière de l'étudiant (fixes, pas de sélection)
  const userNiveau = (user.classe?.niveau || "L1") as "L1" | "L2";
  const userFiliere = (user.filiere?.code || "MPI") as "MPI" | "SML" | "MIASS";

  const reload = () => {
    setSeances(getStoredSeancesEDT());
    setEdts(getStoredEDTs());
  };

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, []);

  // Séances visibles : uniquement son niveau + (sa filière ou tronc commun)
  const mySeances = seances.filter((s) => {
    if ((s.niveau || "L1") !== userNiveau) return false;
    if (s.filieres && s.filieres.length > 0) {
      return s.filieres.includes(userFiliere);
    }
    return true; // tronc commun
  });

  // Créneaux horaires uniques triés
  const timeSlots = Array.from(
    new Set(mySeances.map((s) => `${s.heure_debut}–${s.heure_fin}`))
  ).sort();

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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Planning Hebdomadaire
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              <strong className="text-[#0f2744] dark:text-[#F5F7FA]">{userNiveau}</strong> —{" "}
              <strong className="text-[#e0521c]">{userFiliere}</strong>
            </p>
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

        {/* Tableau EDT */}
        {timeSlots.length === 0 ? (
          <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-sm p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-200 dark:text-[#263241] mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500 dark:text-[#AAB4C0]">Aucun cours cette semaine</p>
            <p className="text-xs text-slate-400 dark:text-[#687585] mt-1">
              L&apos;administration n&apos;a pas encore publié de cours pour votre classe.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-sm">
            <table className="w-full min-w-[800px] bg-white dark:bg-[#111821] text-sm">
              <thead>
                <tr className="bg-[#0f2744] dark:bg-[#151D27]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-white/70 dark:text-[#AAB4C0] uppercase tracking-wider w-24">
                    Heure
                  </th>
                  {JOURS.map((jour) => {
                    const cnt = mySeances.filter((s) => s.jour === jour).length;
                    return (
                      <th key={jour} className="px-4 py-3 text-center text-xs font-bold text-white dark:text-[#F5F7FA] uppercase tracking-wider">
                        <div>{jour}</div>
                        {cnt > 0 && <div className="text-[10px] font-normal text-white/50 dark:text-[#687585] mt-0.5">{cnt}</div>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, i) => (
                  <tr key={slot} className={i % 2 === 0 ? "bg-white dark:bg-[#111821]" : "bg-slate-50/60 dark:bg-[#151D27]/50"}>
                    <td className="px-4 py-3 border-r border-slate-100 dark:border-[#263241]">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] whitespace-nowrap">
                        <Clock className="w-3 h-3 text-[#e0521c]" />
                        {slot}
                      </div>
                    </td>
                    {JOURS.map((jour) => {
                      const cells = mySeances.filter(
                        (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                      );
                      return (
                        <td key={jour} className="px-2 py-2 border-r border-slate-100 dark:border-[#263241] align-top">
                          {cells.map((s) => {
                            const tc = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                            const fLabel =
                              s.filieres && s.filieres.length > 0 && s.filieres.length < 3
                                ? s.filieres.join(", ")
                                : null;
                            return (
                              <div key={s.id} className={`rounded-lg border p-2.5 mb-1.5 ${tc.bg} ${tc.border}`}>
                                <div className="flex items-center justify-between gap-1 mb-1">
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${tc.bg} ${tc.text} border ${tc.border}`}>
                                    {s.type_seance || "CM"}
                                  </span>
                                  {fLabel && (
                                    <span className="text-[9px] font-bold text-[#e0521c] bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded-full">
                                      {fLabel}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">{s.matiere_nom}</p>
                                <p className="text-[10px] text-slate-500 font-mono">{s.matiere_code}</p>
                                <p className="text-[10px] text-slate-600 mt-1 truncate">{s.professeur_nom}</p>
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1">
                                  🌐 En ligne
                                </span>
                                {s.meet_url && (
                                  <div className="flex items-center gap-1 mt-1.5 pt-1.5 border-t border-current/10">
                                    <a
                                      href={s.meet_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-1 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
                                    >
                                      <Video className="w-3 h-3" />
                                      Rejoindre
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                    <button
                                      onClick={() => handleCopyMeet(s.meet_url!)}
                                      className="p-1 text-slate-500 hover:text-slate-800 border border-slate-200 rounded hover:bg-white transition-colors"
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
      </div>
    </DashboardLayout>
  );
}
