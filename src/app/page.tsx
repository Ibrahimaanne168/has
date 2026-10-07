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
import { MatieresSection } from "@/components/home/MatieresSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* ================================================================ */}
        {/* 1. HERO — Excellence Académique & CTA                            */}
        {/* ================================================================ */}
        <section className="bg-[#0f2744] text-white py-8 sm:py-20 lg:py-24 relative overflow-hidden border-b border-[#0f2744]">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
            {/* Kicker */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#e0521c]/15 text-[#e0521c] text-[10px] sm:text-[11px] font-bold tracking-wider uppercase mb-3 sm:mb-6 border border-[#e0521c]/30">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Renforcement Universitaire d&apos;Excellence · Sénégal</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-5xl lg:text-6xl font-bold text-white max-w-3xl tracking-tight leading-tight">
              Halil Académie{" "}
              <span className="text-[#e0521c]">Scientifique</span>
            </h1>

            <p className="mt-3 sm:mt-6 text-slate-300 text-sm sm:text-lg leading-relaxed max-w-2xl font-normal">
              Donner à chaque étudiant les clés méthodologiques et scientifiques
              de sa réussite. Accompagnement ciblé et intensif en{" "}
              <strong className="text-white font-medium">Mathématiques</strong>,{" "}
              <strong className="text-white font-medium">Physique</strong> et{" "}
              <strong className="text-white font-medium">Informatique</strong> pour les niveaux{" "}
              <strong className="text-white font-medium">Licence 1 &amp; Licence 2</strong>.
            </p>

            {/* CTAs */}
            <div className="mt-5 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
              <Link href="/#matieres" className="sm:w-auto">
                <Button
                  variant="accent"
                  size="md"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto min-h-[42px] sm:min-h-[48px] text-xs sm:text-base font-semibold shadow-none justify-center rounded-lg"
                >
                  Découvrir les matières
                </Button>
              </Link>

              <Link href="/inscription" className="sm:w-auto">
                <Button
                  variant="outline"
                  size="md"
                  className="w-full sm:w-auto min-h-[42px] sm:min-h-[48px] text-xs sm:text-base font-semibold border-white/30 text-white hover:bg-white/10 justify-center rounded-lg"
                >
                  Rejoindre HAS
                </Button>
              </Link>

              <Link
                href="/#mot-directeur"
                className="text-xs sm:text-sm text-slate-300 hover:text-white transition-colors underline underline-offset-4 px-2 py-1.5 min-h-[36px] sm:min-h-[48px] flex items-center justify-center sm:justify-start"
              >
                Mot du Directeur
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 2. APPROCHE & PILIERS D'EXCELLENCE                               */}
        {/* ================================================================ */}
        <section id="presentation" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
            {/* En-tête de section */}
            <div className="max-w-xl mb-12 sm:mb-16">
              <p className="text-[#e0521c] text-[11px] font-bold tracking-wider uppercase mb-3">
                Notre Approche Pédagogique
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f2744] leading-snug">
                Une pédagogie active,
                <br className="hidden sm:block" /> centrée sur la pratique
              </h2>
              <p className="mt-3 text-slate-500 text-sm sm:text-base leading-relaxed">
                À <strong className="text-slate-800 font-semibold">Halil Académie Scientifique</strong>, chaque étudiant
                bénéficie d&apos;une attention réelle et d&apos;une méthode rigoureuse pour exceller.
              </p>
            </div>

            {/* Cartes des 3 piliers géométriques */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
              {/* Carte 1 : Pratique intensive des TD */}
              <div className="lg:col-span-3 bg-[#0f2744] rounded-xl p-7 sm:p-9 text-white flex flex-col justify-between min-h-[260px] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] border border-[#0f2744]">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center mb-5">
                    <Target className="w-5 h-5 text-[#e0521c]" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                    Pratique intensive des TD
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                    Résolution méthodique de chaque exercice : nous décortiquons chaque démonstration,
                    formule et algorithme jusqu&apos;à ce que le réflexe soit parfaitement ancré.
                  </p>
                </div>
              </div>

              {/* Colonne droite : 2 cartes empilées */}
              <div className="lg:col-span-2 flex flex-col gap-5 sm:gap-6">
                {/* Carte 2 : Examens Antérieurs */}
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-6 sm:p-7 flex-1 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center mb-4">
                    <BookOpen className="w-4 h-4 text-[#0f2744]" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                    Examens Antérieurs
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Entraînement ciblé sur les véritables sujets d&apos;examen, corrigés pas à pas,
                    pour aborder les épreuves avec sérénité et maîtrise.
                  </p>
                </div>

                {/* Carte 3 : Soutien des Profs */}
                <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-6 sm:p-7 flex-1 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:shadow-md transition-all duration-200">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200/80 flex items-center justify-center mb-4">
                    <Users className="w-4 h-4 text-[#e0521c]" />
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-slate-900 mb-2 leading-snug">
                    Soutien des Profs
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Encadrement personnalisé par des enseignants dévoués, toujours disponibles
                    pour répondre à vos interrogations et guider votre progression.
                  </p>
                </div>
              </div>
            </div>

            {/* Bandeau Valeurs */}
            <div className="mt-6 bg-white border border-slate-200/90 rounded-xl p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
              <div className="w-8 h-8 rounded-lg bg-[#e0521c]/10 text-[#e0521c] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <p className="text-slate-700 text-sm sm:text-base">
                <strong className="font-bold text-slate-900">Rigueur &amp; Fraternité</strong> —
                {" "}les valeurs cardinales qui guident chaque séance et chaque étudiant vers l&apos;excellence académique.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. MATIÈRES EN LIGNE (2 espaces : Matières L1 & Matières L2)    */}
        {/* ================================================================ */}
        <MatieresSection />

        {/* ================================================================ */}
        {/* 4. MOT DU DIRECTEUR (Photo 1:1, texte soigné et sobre)           */}
        {/* ================================================================ */}
        <section id="mot-directeur" className="py-16 sm:py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="bg-[#F8FAFC] border border-slate-200/90 rounded-xl p-6 sm:p-9 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8">
                {/* Photo ratio 1:1 */}
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-40 h-40 sm:w-44 sm:h-44 aspect-square rounded-xl overflow-hidden ring-1 ring-slate-200 shadow-sm">
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
                  <p className="text-[11px] text-[#e0521c] font-bold uppercase tracking-wider text-center">
                    Directeur — HAS
                  </p>
                </div>

                {/* Mot sobre */}
                <div className="flex-1 flex flex-col justify-center">
                  <p className="text-[#e0521c] text-[11px] font-bold tracking-wider uppercase mb-2">
                    Mot du Directeur
                  </p>

                  <blockquote className="font-serif text-xl sm:text-2xl font-bold text-[#0f2744] leading-snug mb-4">
                    « Notre mission : donner à chaque étudiant les clés méthodologiques et scientifiques de sa réussite. »
                  </blockquote>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                    Bienvenue à la <strong className="text-slate-900 font-semibold">Halil Académie Scientifique</strong>.
                    Notre ambition est d&apos;offrir aux étudiants de <strong className="text-slate-900 font-semibold">Licence 1 et Licence 2</strong> un accompagnement
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
