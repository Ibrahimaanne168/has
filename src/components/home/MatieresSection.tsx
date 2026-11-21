"use client";

import React, { useState } from "react";
import { Calculator, Atom, Code2, Sparkles, BookOpen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface MatiereCategory {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  items: string[];
}

const MATIERES_FR_L1: MatiereCategory[] = [
  {
    title: "Mathématiques L1",
    icon: <Calculator className="w-5 h-5 text-[#0f2744]" />,
    iconBg: "bg-[#0f2744]/5 border-[#0f2744]/15",
    items: [
      "Analyse 1 (Suites, Limites & Continuité)",
      "Algèbre 1 (Espaces Vectoriels & Matrices)",
      "Analyse 2 (Calcul Intégral & Développements)",
      "Algèbre 2 (Déterminants & Espaces Euclidiens)",
    ],
  },
  {
    title: "Physique L1",
    icon: <Atom className="w-5 h-5 text-[#e0521c]" />,
    iconBg: "bg-amber-500/10 border-amber-300/40 text-amber-800",
    items: [
      "Mécanique du Point",
      "Électricité (Régimes continu & transitoire)",
      "Optique Géométrique",
    ],
  },
  {
    title: "Informatique L1",
    icon: <Code2 className="w-5 h-5 text-emerald-700" />,
    iconBg: "bg-emerald-50 border-emerald-300/40 text-emerald-800",
    items: [
      "Programmation Python Fondamentale",
      "Langage C & Gestion Mémoire",
      "Algorithmique & Structures de Données",
    ],
  },
];

const MATIERES_FR_L2: MatiereCategory[] = [
  {
    title: "Mathématiques L2",
    icon: <Calculator className="w-5 h-5 text-[#0f2744]" />,
    iconBg: "bg-[#0f2744]/5 border-[#0f2744]/15",
    items: [
      "Analyse 3 (Séries numériques & Fourier)",
      "Algèbre 3 (Réduction & Diagonalisation)",
      "Analyse Numérique Matricielle (LU, QR)",
      "Probabilités & Statistique Inférentielle",
    ],
  },
  {
    title: "Physique L2",
    icon: <Atom className="w-5 h-5 text-[#e0521c]" />,
    iconBg: "bg-amber-500/10 border-amber-300/40 text-amber-800",
    items: [
      "Mécanique Générale des Solides",
      "Thermodynamique & Cycles Thermiques",
      "Magnétostatique & Induction Électromagnétique",
    ],
  },
  {
    title: "Informatique L2",
    icon: <Code2 className="w-5 h-5 text-emerald-700" />,
    iconBg: "bg-emerald-50 border-emerald-300/40 text-emerald-800",
    items: [
      "POO Python Avancée & Design Patterns",
      "Bases de Données Relationnelles & SQL",
      "Architecture des Ordinateurs",
    ],
  },
];

const MATIERES_EN_L1: MatiereCategory[] = [
  {
    title: "Mathematics Year 1",
    icon: <Calculator className="w-5 h-5 text-[#0f2744]" />,
    iconBg: "bg-[#0f2744]/5 border-[#0f2744]/15",
    items: [
      "Calculus 1 (Sequences, Limits & Continuity)",
      "Linear Algebra 1 (Vector Spaces & Matrices)",
      "Calculus 2 (Integration & Taylor Expansions)",
      "Linear Algebra 2 (Determinants & Euclidean Spaces)",
    ],
  },
  {
    title: "Physics Year 1",
    icon: <Atom className="w-5 h-5 text-[#e0521c]" />,
    iconBg: "bg-amber-500/10 border-amber-300/40 text-amber-800",
    items: [
      "Point Particle Mechanics",
      "Electromagnetism (DC & Transient Circuits)",
      "Geometrical Optics",
    ],
  },
  {
    title: "Computer Science Year 1",
    icon: <Code2 className="w-5 h-5 text-emerald-700" />,
    iconBg: "bg-emerald-50 border-emerald-300/40 text-emerald-800",
    items: [
      "Core Python Programming",
      "C Language & Dynamic Memory",
      "Algorithms & Fundamental Data Structures",
    ],
  },
];

const MATIERES_EN_L2: MatiereCategory[] = [
  {
    title: "Mathematics Year 2",
    icon: <Calculator className="w-5 h-5 text-[#0f2744]" />,
    iconBg: "bg-[#0f2744]/5 border-[#0f2744]/15",
    items: [
      "Analysis 3 (Infinite Series & Fourier Analysis)",
      "Linear Algebra 3 (Matrix Diagonalization & Jordan)",
      "Numerical Matrix Analysis (LU, QR Decompositions)",
      "Probability & Inferential Statistics",
    ],
  },
  {
    title: "Physics Year 2",
    icon: <Atom className="w-5 h-5 text-[#e0521c]" />,
    iconBg: "bg-amber-500/10 border-amber-300/40 text-amber-800",
    items: [
      "Rigid Body Mechanics",
      "Thermodynamics & Heat Engines",
      "Magnetostatics & Electromagnetic Induction",
    ],
  },
  {
    title: "Computer Science Year 2",
    icon: <Code2 className="w-5 h-5 text-emerald-700" />,
    iconBg: "bg-emerald-50 border-emerald-300/40 text-emerald-800",
    items: [
      "Advanced OOP Python & Software Patterns",
      "Relational Databases, Schema Design & SQL",
      "Computer Architecture & Low-Level Systems",
    ],
  },
];

export function MatieresSection() {
  const { t, language } = useLanguage();
  const [activeSpace, setActiveSpace] = useState<"L1" | "L2">("L1");

  const isEn = language === "en";
  const listL1 = isEn ? MATIERES_EN_L1 : MATIERES_FR_L1;
  const listL2 = isEn ? MATIERES_EN_L2 : MATIERES_FR_L2;
  const currentList = activeSpace === "L1" ? listL1 : listL2;

  return (
    <section id="matieres" className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0B0F14] border-b border-slate-200/80 dark:border-[#263241] transition-colors">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#0f2744]/8 dark:bg-[#151D27] text-[#0f2744] dark:text-[#e0521c] text-[11px] font-bold tracking-wider uppercase mb-3 border border-[#0f2744]/15 dark:border-[#263241]">
              {t("matieres_kicker")}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              {t("matieres_title")}
            </h2>
          </div>
          <p className="text-slate-500 dark:text-[#AAB4C0] text-sm sm:text-base max-w-md">
            {t("matieres_desc")}
          </p>
        </div>

        {/* 2 Espaces distincts : Matières L1 & Matières L2 */}
        <div className="flex items-center justify-center sm:justify-start gap-2 mb-8 p-1.5 bg-slate-200/70 dark:bg-[#151D27] border border-transparent dark:border-[#263241] rounded-2xl w-fit mx-auto sm:mx-0">
          <button
            type="button"
            onClick={() => setActiveSpace("L1")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSpace === "L1"
                ? "bg-[#0f2744] dark:bg-[#e0521c] text-white shadow-md"
                : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
            }`}
          >
            <BookOpen className="w-4 h-4 text-[#e0521c] dark:text-white" />
            <span>{t("tab_l1")}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveSpace("L2")}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSpace === "L2"
                ? "bg-[#0f2744] dark:bg-[#e0521c] text-white shadow-md"
                : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#e0521c] dark:text-white" />
            <span>{t("tab_l2")}</span>
          </button>
        </div>

        {/* Grille du niveau sélectionné */}
        <div className="space-y-4">
          {currentList.map((category) => (
            <div
              key={category.title}
              className="bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-xl p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)] hover:shadow-md transition-all duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                <div className="flex items-center gap-3 md:w-56 shrink-0">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border ${category.iconBg}`}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-tight">
                      {category.title}
                    </h3>
                    <span className="text-[11px] font-mono font-bold text-[#e0521c] tracking-wider">
                      {activeSpace}
                    </span>
                  </div>
                </div>

                <div className="flex-1 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100/80 dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] text-xs sm:text-sm font-medium border border-slate-200/80 dark:border-[#263241] hover:bg-slate-200/70 dark:hover:bg-[#1a2533] transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
