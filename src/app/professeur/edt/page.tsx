"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar, Clock, Video, CheckCircle2, ExternalLink, Copy, GraduationCap, Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredSeancesEDT } from "@/lib/academicStorage";
import { SeanceEDT, JourSemaine } from "@/lib/types";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function ProfesseurEDTPage() {
  const { user } = useCurrentUser();
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [activeNiveau, setActiveNiveau] = useState<"L1" | "L2">("L1");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const reload = () => setSeances(getStoredSeancesEDT());

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, []);

  // Séances du prof connecté (par id ou par nom)
  const mySeances = useMemo(() =>
    seances.filter((s) => {
      const isMe =
        (user.id && s.professeur_id === user.id) ||
        (user.full_name && s.professeur_nom.toLowerCase().includes(user.full_name.split(" ")[0].toLowerCase()));
      return isMe && (s.niveau || "L1") === activeNiveau;
    }),
    [seances, user, activeNiveau]
  );

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
    (user.id && s.professeur_id === user.id) ||
    (user.full_name && s.professeur_nom.toLowerCase().includes(user.full_name.split(" ")[0].toLowerCase()))
  ).length;

  return (
    <DashboardLayout
      role="professeur"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "PROF001"}
    >
      <div className="space-y-5">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">Mon Emploi du Temps</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Planning Hebdomadaire</h1>
            <p className="text-xs text-slate-500 mt-1">
              <strong>{totalMySessions}</strong> séance{totalMySessions !== 1 ? "s" : ""} cette semaine
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-[#0f2744]/5 rounded-lg border border-[#0f2744]/10 text-xs text-[#0f2744]">
            <GraduationCap className="w-4 h-4 text-[#e0521c]" />
            <span>Vos séances uniquement</span>
          </div>
        </div>

        {/* Onglets L1 / L2 */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          {(["L1", "L2"] as const).map((niv) => {
            const cnt = seances.filter((s) =>
              ((user.id && s.professeur_id === user.id) ||
              (user.full_name && s.professeur_nom.toLowerCase().includes(user.full_name.split(" ")[0].toLowerCase()))) &&
              (s.niveau || "L1") === niv
            ).length;
            return (
              <button key={niv} onClick={() => setActiveNiveau(niv)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeNiveau === niv ? "bg-[#0f2744] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Licence {niv === "L1" ? "1" : "2"}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeNiveau === niv ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tableau */}
        {timeSlots.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Aucune séance en {activeNiveau}</p>
            <p className="text-xs text-slate-400 mt-1">L&apos;administration n&apos;a pas encore publié de cours vous concernant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-sm">
            <table className="w-full min-w-[800px] bg-white text-sm">
              <thead>
                <tr className="bg-[#0f2744]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-white/70 uppercase tracking-wider w-24">Heure</th>
                  {JOURS.map((jour) => {
                    const cnt = mySeances.filter((s) => s.jour === jour).length;
                    return (
                      <th key={jour} className="px-3 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                        {jour}
                        {cnt > 0 && <div className="text-[10px] font-normal text-white/50 mt-0.5">{cnt}</div>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, i) => (
                  <tr key={slot} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-[#e0521c]" />
                        {slot}
                      </div>
                    </td>
                    {JOURS.map((jour) => {
                      const cells = mySeances.filter(
                        (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                      );
                      return (
                        <td key={jour} className="px-2 py-2 border-r border-slate-100 align-top">
                          {cells.map((s) => {
                            const tc = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                            const fLabel = s.filieres?.length ? s.filieres.join(", ") : "Toutes filières";
                            return (
                              <div key={s.id} className={`rounded-lg border p-2.5 mb-1.5 ${tc.bg} ${tc.border}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${tc.bg} ${tc.text} border ${tc.border}`}>
                                    {s.type_seance || "CM"}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.filieres?.length ? "text-[#e0521c] bg-orange-50 border border-orange-200" : "text-slate-500 bg-slate-100 border border-slate-200"}`}>
                                    {fLabel}
                                  </span>
                                </div>
                                <p className="text-xs font-bold text-slate-900 line-clamp-2">{s.matiere_nom}</p>
                                <p className="text-[10px] font-mono text-slate-500">{s.matiere_code}</p>
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1">
                                  🌐 En ligne
                                </span>
                                {s.meet_url && (
                                  <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60">
                                    <a href={s.meet_url} target="_blank" rel="noopener noreferrer"
                                      className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                      <Video className="w-3 h-3" /> Lancer
                                      <ExternalLink className="w-2.5 h-2.5" />
                                    </a>
                                    <button onClick={() => handleCopy(s.meet_url!)}
                                      className="p-1.5 border border-slate-200 rounded hover:bg-white text-slate-500">
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

        {/* Info */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
          <Filter className="w-4 h-4 text-[#0f2744] shrink-0 mt-0.5" />
          <p className="text-xs text-slate-600">
            Seules <strong className="text-slate-800">vos séances</strong> sont affichées.
            Les filières spécifiques (MPI, SML, MIASS) sont indiquées sur chaque cours.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
