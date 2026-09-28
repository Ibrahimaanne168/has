import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Target,
  Sparkles,
  Calculator,
  Atom,
  Code2,
  GraduationCap,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ContactSection } from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================ */}
        {/* 1. HERO — Excellence Académique & CTA                            */}
        {/* ================================================================ */}
        <section className="bg-[#0f2744] text-white py-16 sm:py-24 lg:py-28 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10 relative z-10">
            {/* Kicker */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#e0521c]/15 text-[#e0521c] text-xs font-semibold tracking-wider uppercase mb-5 sm:mb-6 border border-[#e0521c]/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Renforcement Universitaire d&apos;Excellence · Sénégal</span>
            </div>

            <h1 className="font-serif text-[2.25rem] leading-[1.15] sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl">
              Halil Académie
              <br />
              <span className="text-[#e0521c]">Scientifique</span>
            </h1>

            <p className="mt-5 sm:mt-6 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Donner à chaque étudiant les clés méthodologiques et scientifiques
              de sa réussite. Accompagnement ciblé et intensif en{" "}
              <strong className="text-white font-medium">Mathématiques</strong>,{" "}
              <strong className="text-white font-medium">Physique</strong> et{" "}
              <strong className="text-white font-medium">Informatique</strong> pour les niveaux{" "}
              <strong className="text-white font-medium">Licence 1 &amp; Licence 2</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link href="/#matieres" className="sm:w-auto">
                <Button
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto min-h-[48px] text-base font-semibold shadow-none justify-center"
                >
                  Découvrir les matières
                </Button>
              </Link>

              <Link href="/inscription" className="sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto min-h-[48px] text-base font-semibold border-white/30 text-white hover:bg-white/10 justify-center"
                >
                  Rejoindre HAS
                </Button>
              </Link>

              <Link
                href="/#mot-directeur"
                className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 px-2 py-3 min-h-[48px] flex items-center justify-center sm:justify-start"
              >
                Mot du Directeur
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 2. APPROCHE & PILIERS D'EXCELLENCE                               */}
        {/* ================================================================ */}
        <section id="presentation" className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
            {/* En-tête de section */}
            <div className="max-w-xl mb-12 sm:mb-16">
              <p className="text-[#e0521c] text-xs font-bold tracking-widest uppercase mb-3">
                Notre Approche Pédagogique
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f2744] leading-snug">
                Une pédagogie active,
                <br className="hidden sm:block" /> centrée sur la pratique
              </h2>
              <p className="mt-4 text-slate-500 text-base leading-relaxed">
                À <strong className="text-slate-700">Halil Académie Scientifique</strong>, chaque étudiant
                bénéficie d&apos;une attention réelle et d&apos;une méthode éprouvée pour exceller.
              </p>
            </div>

            {/* Cartes des 3 piliers demandés */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Carte 1 : Pratique intensive des TD */}
              <div className="lg:col-span-3 bg-[#0f2744] rounded-2xl p-8 sm:p-10 text-white flex flex-col justify-between min-h-[260px]">
                <div>
                  <Target className="w-7 h-7 text-[#e0521c] mb-5" />
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                    Pratique intensive des TD
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Résolution méthodique de chaque exercice : nous décortiquons chaque démonstration,
                    formule et algorithme jusqu&apos;à ce que le réflexe soit ancré.
                  </p>
                </div>
              </div>

              {/* Colonne droite : 2 cartes empilées */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                {/* Carte 2 : Examens Antérieurs */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-7 flex-1">
                  <BookOpen className="w-6 h-6 text-[#0f2744] mb-4" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Examens Antérieurs
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Entraînement ciblé sur les véritables sujets d&apos;examen, corrigés pas à pas,
                    pour aborder les épreuves avec sérénité.
                  </p>
                </div>

                {/* Carte 3 : Soutien des Profs */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 sm:p-7 flex-1">
                  <Users className="w-6 h-6 text-[#e0521c] mb-4" />
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    Soutien des Profs
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Encadrement personnalisé par des enseignants dévoués, toujours disponibles
                    pour accompagner votre progression.
                  </p>
                </div>
              </div>
            </div>

            {/* Bandeau Valeurs */}
            <div className="mt-6 bg-[#e0521c]/8 border border-[#e0521c]/15 rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <Sparkles className="w-5 h-5 text-[#e0521c] shrink-0" />
              <p className="text-slate-700 text-sm sm:text-base">
                <strong className="font-semibold text-slate-900">Rigueur &amp; Fraternité</strong> —
                {" "}les valeurs qui guident chaque séance et chaque étudiant vers l&apos;excellence.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. MATIÈRES EN LIGNE (Licence 1 & Licence 2)                     */}
        {/* ================================================================ */}
        <section id="matieres" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#0f2744]/10 text-[#0f2744] text-xs font-semibold mb-3">
                  Licence 1 &amp; Licence 2 (pour l&apos;instant)
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f2744] leading-snug">
                  Nos Matières Enseignées
                </h2>
              </div>
              <p className="text-slate-500 text-sm sm:text-base max-w-md">
                Un cursus complet axé sur les fondamentaux universitaires pour consolider vos bases et garantir vos mentions.
              </p>
            </div>

            {/* Matières en ligne (lignes structurées et aérées) */}
            <div className="space-y-4">
              {/* Ligne 1 : Mathématiques */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3 md:w-56 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                        Mathématiques
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">L1 · L2</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-wrap gap-2">
                    {["Analyse", "Algèbre", "Statistiques Descriptives", "Probabilités", "Suites & Séries", "Calcul Intégral"].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Ligne 2 : Physique */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3 md:w-56 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                      <Atom className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                        Physique
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">L1 · L2</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-wrap gap-2">
                    {["Mécanique du Point", "Thermodynamique", "Électricité & Circuits", "Électrostatique", "Magnétostatique", "Optique Géométrique"].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Ligne 3 : Informatique */}
              <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div className="flex items-center gap-3 md:w-56 shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                      <Code2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                        Informatique
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">L1 · L2</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-wrap gap-2">
                    {["POO (Prog. Orientée Objet)", "Bases de Données & SQL", "Algorithmique & Programmation", "Structures de Données", "Architecture Ordinateurs", "C / Java / Python"].map(
                      (item) => (
                        <span
                          key={item}
                          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs sm:text-sm font-medium hover:bg-slate-200 transition-colors"
                        >
                          {item}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. MOT DU DIRECTEUR (Photo 1:1, texte simplifié et bref)         */}
        {/* ================================================================ */}
        <section id="mot-directeur" className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-7 sm:p-10 shadow-sm">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Photo ratio 1:1 */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-40 h-40 sm:w-48 sm:h-48 aspect-square rounded-2xl overflow-hidden ring-2 ring-[#e0521c]/40 shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/directeur-pape-ibrahima-samb.jpg"
                      alt="Pape Ibrahima Samb — Directeur de Halil Académie Scientifique"
                      className="w-full h-full object-cover object-top aspect-square"
                    />
                  </div>
                  <p className="font-serif text-base font-bold text-[#0f2744] mt-3 text-center">
                    Pape Ibrahima Samb
                  </p>
                  <p className="text-xs text-[#e0521c] font-semibold tracking-wide text-center">
                    Directeur — HAS
                  </p>
                </div>

                {/* Mot bref et simplifié */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[#e0521c] text-xs font-bold tracking-widest uppercase mb-2">
                    Mot du Directeur
                  </p>

                  <blockquote className="font-serif text-xl sm:text-2xl font-bold text-[#0f2744] leading-snug mb-4">
                    « Notre mission : donner à chaque étudiant les clés méthodologiques et scientifiques de sa réussite. »
                  </blockquote>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Bienvenue à la <strong className="text-slate-800">Halil Académie Scientifique</strong>.
                    Notre ambition est d&apos;offrir aux étudiants de <strong className="text-slate-800">Licence 1 et Licence 2</strong> un accompagnement
                    méthodique et de haute rigueur en Mathématiques, Physique et Informatique. À travers la pratique intensive
                    des travaux dirigés et l&apos;encadrement de nos enseignants dévoués, nous forgeons l&apos;assurance et les compétences
                    nécessaires à votre succès universitaire.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 5. CONTACT                                                       */}
        {/* ================================================================ */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
