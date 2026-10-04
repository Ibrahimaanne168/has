"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Download, Clock, MapPin, GraduationCap, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredEDTs } from "@/lib/academicStorage";
import { EmploiDuTemps } from "@/lib/types";

export default function EtudiantEDTPage() {
  const { user } = useCurrentUser();
  const [selectedSemestre, setSelectedSemestre] = useState("Semestre 1");
  const [edts, setEdts] = useState<EmploiDuTemps[]>([]);

  useEffect(() => {
    setEdts(getStoredEDTs());
    const handleUpdate = () => setEdts(getStoredEDTs());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  // Filtrer l'emploi du temps pour la classe de l'étudiant
  const currentEDT = edts.find(
    (e) =>
      e.classe_id === user.classe_id ||
      (e.classe && user.classe && e.classe.code === user.classe.code)
  );

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
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Organisation des Séances
            </p>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
                Emploi du Temps Hebdomadaire
              </h1>
              {currentEDT && (
                <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                  Officiel HAS
                </Badge>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Classe : <strong className="text-slate-800">{user.classe?.name || "Licence 1 — MPI"}</strong> • Année Universitaire 2024-2025
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSemestre}
              onChange={(e) => setSelectedSemestre(e.target.value)}
              className="text-xs border border-slate-200/90 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            >
              <option value="Semestre 1">Semestre 1</option>
              <option value="Semestre 2">Semestre 2</option>
            </select>

            {currentEDT && (
              <a
                href={currentEDT.file_url}
                download
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[#e0521c]" />
                <span>Télécharger l&apos;EDT (PDF)</span>
              </a>
            )}
          </div>
        </div>

        {/* Affichage de l'EDT ou État vide officiel */}
        {currentEDT ? (
          <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-[#0f2744]/10 text-[#0f2744] flex items-center justify-center shrink-0">
                  <Calendar className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="primary" size="sm">{currentEDT.classe?.code || user.classe?.code || "L1"}</Badge>
                    <Badge variant="neutral" size="sm">{currentEDT.semestre}</Badge>
                    <Badge variant="success" size="sm">Validé par l&apos;Administration</Badge>
                  </div>
                  <h2 className="font-serif text-xl font-bold text-slate-900">{currentEDT.title}</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Année Universitaire {currentEDT.annee_universitaire} • Publié le {new Date(currentEDT.created_at).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <a
                href={currentEDT.file_url}
                download
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors shrink-0"
              >
                <Download className="w-4 h-4 text-[#e0521c]" />
                Télécharger le document officiel (PDF)
              </a>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Planning officiel en vigueur</p>
                <p>
                  Ce document certifié par la direction académique HAS fait foi pour l&apos;organisation de vos séances de cours magistraux, travaux dirigés (TD) et travaux pratiques (TP).
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200/90 p-8 sm:p-12 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center mx-auto text-amber-600">
              <Calendar className="w-7 h-7" />
            </div>

            <div className="space-y-1.5 max-w-lg mx-auto">
              <h3 className="font-serif text-xl font-bold text-slate-900">
                Emploi du temps en cours de publication
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Aucun emploi du temps n&apos;a encore été publié par l&apos;administration pour la classe{" "}
                <strong className="text-slate-800">{user.classe?.name || "Licence 1 — MPI"}</strong>.
              </p>
              <p className="text-xs text-slate-400">
                Seule l&apos;administration académique configure et valide les plannings officiels. Dès publication, votre emploi du temps et votre calendrier de séances s&apos;afficheront automatiquement ici.
              </p>
            </div>

            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Semestre 1 · Année 2024-2025
              </span>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
