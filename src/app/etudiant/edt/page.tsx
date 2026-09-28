"use client";

import React, { useState } from "react";
import { Calendar, Download, Clock, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT, MOCK_EMPLOI_DU_TEMPS } from "@/lib/data/mock-data";

export default function EtudiantEDTPage() {
  const [selectedSemestre, setSelectedSemestre] = useState("S1");

  // Grille horaire officielle Licence 2 ISN
  const scheduleDays = [
    {
      day: "Lundi",
      courses: [
        {
          time: "08h00 — 10h00",
          title: "Algorithmique Avancée & Structures",
          teacher: "Dr. Ousmane Touré",
          room: "Amphi A1",
          type: "Cours Magistral",
        },
        {
          time: "10h15 — 12h15",
          title: "Travaux Dirigés Algorithmique",
          teacher: "Dr. Ousmane Touré",
          room: "Salle TD-04",
          type: "Travaux Dirigés",
        },
        {
          time: "14h00 — 17h00",
          title: "Laboratoire Réseaux & Systèmes (Groupe 1)",
          teacher: "Ing. Diallo",
          room: "Labo Réseau 2",
          type: "Travaux Pratiques",
        },
      ],
    },
    {
      day: "Mardi",
      courses: [
        {
          time: "08h30 — 11h30",
          title: "Bases de Données Relationnelles & SQL",
          teacher: "Dr. Ousmane Touré",
          room: "Amphi B",
          type: "Cours Magistral",
        },
        {
          time: "14h00 — 16h30",
          title: "Architecture des Microservices & Cloud",
          teacher: "Pr. Invité",
          room: "Salle Multimédia 1",
          type: "Cours / TD",
        },
      ],
    },
    {
      day: "Mercredi",
      courses: [
        {
          time: "08h00 — 10h00",
          title: "Mathématiques pour l'Ingénieur & Proba",
          teacher: "Dr. Keita",
          room: "Amphi A1",
          type: "Cours Magistral",
        },
        {
          time: "10h15 — 12h15",
          title: "Anglais Technique & Communication",
          teacher: "Mme. Camara",
          room: "Salle Langues",
          type: "Langues",
        },
      ],
    },
    {
      day: "Jeudi",
      courses: [
        {
          time: "09h00 — 12h00",
          title: "Atelier Développement Web Fullstack",
          teacher: "Dr. Ousmane Touré",
          room: "Labo Info 1",
          type: "Travaux Pratiques",
        },
        {
          time: "14h00 — 17h00",
          title: "Routage Réseaux & Protocoles IP",
          teacher: "Dr. Ousmane Touré",
          room: "Salle TD-02",
          type: "Cours Magistral",
        },
      ],
    },
    {
      day: "Vendredi",
      courses: [
        {
          time: "08h30 — 11h30",
          title: "Sécurité des Systèmes Informatiques",
          teacher: "Dr. Coulibaly",
          room: "Amphi B",
          type: "Cours Magistral",
        },
        {
          time: "14h30 — 16h30",
          title: "Projet Tuteuré & Suivi de Groupe",
          teacher: "Comité Pédagogique",
          room: "Espace Projets",
          type: "Projet",
        },
      ],
    },
    {
      day: "Samedi",
      courses: [
        {
          time: "08h30 — 12h30",
          title: "Rattrapages & Conférences Thématiques",
          teacher: "Intervenants extérieurs",
          room: "Grand Amphi",
          type: "Séminaire",
        },
      ],
    },
  ];

  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-[#0f2744]">
                Emploi du Temps Hebdomadaire
              </h1>
              <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                Officiel HAS
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Classe : <strong>{MOCK_STUDENT.classe?.name}</strong> • Année Universitaire 2024-2025
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedSemestre}
              onChange={(e) => setSelectedSemestre(e.target.value)}
              className="text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            >
              <option value="S1">Semestre 1 (En cours)</option>
              <option value="S2">Semestre 2</option>
            </select>

            <a
              href={MOCK_EMPLOI_DU_TEMPS.file_url}
              download
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-[#e0521c]" />
              Télécharger l&apos;EDT (PDF)
            </a>
          </div>
        </div>

        {/* Grille de la semaine */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scheduleDays.map((item) => (
            <div
              key={item.day}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs"
            >
              <div className="bg-[#0f2744] px-4 py-2.5 flex items-center justify-between text-white">
                <span className="font-serif font-bold text-sm tracking-wide">{item.day}</span>
                <span className="text-[11px] text-slate-300">{item.courses.length} séance(s)</span>
              </div>

              <div className="p-4 space-y-3.5">
                {item.courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#e0521c] font-semibold">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.time}</span>
                      </div>
                      <span className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600 font-normal">
                        {course.type}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                      {course.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-slate-400" />
                        <span>{course.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1 font-medium text-slate-700">
                        <MapPin className="w-3 h-3 text-[#0f2744]" />
                        <span>{course.room}</span>
                      </div>
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
