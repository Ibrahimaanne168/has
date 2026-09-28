"use client";

import React from "react";
import { Calendar, Clock, MapPin, CheckCircle2, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_CLASSES, MOCK_EMPLOI_DU_TEMPS } from "@/lib/data/mock-data";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurEDTPage() {
  const myClasses = MOCK_CLASSES.slice(0, 3);

  // Emploi du temps enseignant (créneaux personnels)
  const schedule = [
    { day: "Lundi", slots: [
      { time: "08h00 – 10h00", subject: "Algorithmique Avancée", classe: "L1-ISN", room: "Amphi A1", type: "CM" },
      { time: "10h15 – 12h15", subject: "Travaux Dirigés Algorithmique", classe: "L1-ISN", room: "TD-04", type: "TD" },
      { time: "14h00 – 17h00", subject: "Lab Réseaux & Systèmes", classe: "L2-ISN", room: "Labo 2", type: "TP" },
    ]},
    { day: "Mardi", slots: [
      { time: "08h30 – 11h30", subject: "Bases de Données & SQL", classe: "L2-ISN", room: "Amphi B", type: "CM" },
      { time: "14h00 – 16h30", subject: "Microservices & Cloud", classe: "L3-ISN", room: "Multimédia 1", type: "CM/TD" },
    ]},
    { day: "Jeudi", slots: [
      { time: "09h00 – 12h00", subject: "Atelier Web Fullstack", classe: "L2-ISN", room: "Labo Info 1", type: "TP" },
      { time: "14h00 – 17h00", subject: "Sécurité Systèmes Avancée", classe: "L3-ISN", room: "TD-02", type: "CM" },
    ]},
    { day: "Vendredi", slots: [
      { time: "10h00 – 12h00", subject: "Permanence & Consultation Étudiants", classe: "Toutes classes", room: "Bureau 204", type: "Permanence" },
    ]},
  ];

  const typeColor: Record<string, string> = {
    CM: "bg-[#0f2744]/10 text-[#0f2744]",
    TD: "bg-amber-100 text-amber-900",
    TP: "bg-emerald-100 text-emerald-800",
    "CM/TD": "bg-blue-100 text-blue-800",
    Permanence: "bg-slate-100 text-slate-700",
  };

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
            <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Emplois du Temps</h1>
            <p className="text-xs text-slate-500 mt-1">
              Vos créneaux d&apos;enseignement — Année 2024-2025 • Semestre 1
            </p>
          </div>
          <a href={MOCK_EMPLOI_DU_TEMPS.file_url} download>
            <Button variant="outline" size="sm" leftIcon={<Download className="w-4 h-4" />}>
              Télécharger PDF
            </Button>
          </a>
        </div>

        {/* Classes encadrées */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="font-serif text-base font-bold text-[#0f2744] mb-3">Classes sous ma responsabilité</h3>
          <div className="flex flex-wrap gap-2">
            {myClasses.map((cls) => (
              <div key={cls.id} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-800">{cls.code}</span>
                <span className="text-slate-500">— {cls.niveau}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grille des créneaux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {schedule.map((day) => (
            <div key={day.day} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="bg-[#0f2744] px-5 py-3 flex items-center justify-between">
                <span className="font-serif text-white font-bold">{day.day}</span>
                <span className="text-xs text-slate-300">{day.slots.length} créneau(x)</span>
              </div>
              <div className="p-4 space-y-3">
                {day.slots.map((slot, i) => (
                  <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e0521c]">
                        <Clock className="w-3.5 h-3.5" />
                        {slot.time}
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${typeColor[slot.type] || "bg-slate-100 text-slate-600"}`}>
                        {slot.type}
                      </span>
                    </div>
                    <p className="font-serif text-sm font-bold text-slate-900">{slot.subject}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {slot.classe}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#0f2744]" /> {slot.room}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
