"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Download, CheckCircle2, FileText, Clock } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_CLASSES } from "@/lib/data/mock-data";
import { getStoredEDTs } from "@/lib/academicStorage";
import { EmploiDuTemps } from "@/lib/types";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurEDTPage() {
  const [edts, setEdts] = useState<EmploiDuTemps[]>([]);
  const myClasses = MOCK_CLASSES.slice(0, 3);

  useEffect(() => {
    setEdts(getStoredEDTs());
    const handleUpdate = () => setEdts(getStoredEDTs());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.specialite || "Enseignant HAS"}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Espace Enseignant
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Emplois du Temps Officiels
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Plannings hebdomadaires validés par l&apos;administration — Année 2024-2025
            </p>
          </div>
        </div>

        {/* Classes encadrées */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
          <h3 className="font-serif text-base font-bold text-[#0f2744] mb-3">
            Classes sous votre responsabilité
          </h3>
          <div className="flex flex-wrap gap-2">
            {myClasses.map((cls) => (
              <div
                key={cls.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/90 text-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-800">{cls.code}</span>
                <span className="text-slate-500">— {cls.niveau}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Liste des EDT ou état vide */}
        {edts.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800">
              Emplois du temps en cours de publication
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              L&apos;administration académique est en cours de configuration des plannings de séances. Dès qu&apos;un emploi du temps officiel est validé pour vos classes, il apparaîtra ici avec son support officiel téléchargeable.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {edts.map((edt) => (
              <div
                key={edt.id}
                className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#0f2744]/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-[#0f2744]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" size="sm">{edt.classe?.code || "Classe"}</Badge>
                      <Badge variant="neutral" size="sm">{edt.semestre}</Badge>
                      <Badge variant="success" size="sm">Validé</Badge>
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 truncate">
                      {edt.title}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {edt.annee_universitaire} • Publié le {new Date(edt.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                {edt.file_url && (
                  <a
                    href={edt.file_url}
                    download
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-[#0f2744] hover:bg-[#183a62] text-white rounded-lg transition-colors shrink-0"
                  >
                    <Download className="w-3.5 h-3.5 text-[#e0521c]" /> Télécharger PDF
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
