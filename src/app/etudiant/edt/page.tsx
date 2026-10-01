"use client";

import React, { useState } from "react";
import { Calendar, Download, Clock, MapPin, GraduationCap, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { MOCK_EMPLOI_DU_TEMPS } from "@/lib/data/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function EtudiantEDTPage() {
  const { user } = useCurrentUser();
  const [selectedSemestre, setSelectedSemestre] = useState("S1");

  const scheduleDays = [
    {
      day: "Lundi",
      courses: [
        {
          time: "08h00 — 10h00",
          title: "Algorithmique & Structures de Données",
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
          title: "Programmation Python & Analyse",
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
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
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
              <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                Officiel HAS
              </Badge>
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
              <option value="S1">Semestre 1 (En cours)</option>
              <option value="S2">Semestre 2</option>
            </select>

            <a
              href={MOCK_EMPLOI_DU_TEMPS.file_url}
              download
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Télécharger l&apos;EDT (PDF)</span>
            </a>
          </div>
        </div>

        {/* Grille de la semaine en cartes modulaires */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {scheduleDays.map((item) => (
            <div
              key={item.day}
              className="bg-white rounded-xl border border-slate-200/90 overflow-hidden shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all duration-200 flex flex-col"
            >
              <div className="bg-[#0f2744] px-4 py-3 flex items-center justify-between text-white">
                <span className="font-serif font-bold text-sm tracking-wide">{item.day}</span>
                <span className="text-[11px] text-slate-300 font-medium">{item.courses.length} séance(s)</span>
              </div>

              <div className="p-4 space-y-3 flex-1">
                {item.courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border border-slate-200/70 bg-[#F8FAFC] hover:bg-slate-100/70 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#e0521c] font-semibold">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{course.time}</span>
                      </div>
                      <span className="bg-white px-2 py-0.5 rounded-md border border-slate-200/80 text-slate-600 font-medium text-[10px]">
                        {course.type}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                      {course.title}
                    </h4>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-1 truncate mr-2">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{course.teacher}</span>
                      </div>
                      <div className="flex items-center gap-1 font-semibold text-slate-700 shrink-0 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#0f2744]" />
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
