import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Target,
  Sparkles,
  Quote,
  CheckCircle,
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
        {/* 1. HERO — mobile-first, fond uni, 1 CTA principal                */}
        {/* ================================================================ */}
        <section className="bg-[#0f2744] text-white py-16 sm:py-24 lg:py-32">
          <div className="max-w-4xl mx-auto px-5 sm:px-8 lg:px-10">
            {/* Kicker — texte simple, pas de badge pilule */}
            <p className="text-[#e0521c] text-sm font-semibold tracking-widest uppercase mb-5 sm:mb-6">
              Renforcement universitaire · Sénégal
            </p>

            <h1 className="font-serif text-[2.25rem] leading-[1.15] sm:text-5xl lg:text-6xl font-bold text-white">
              Halil Académie
              <br />
              <span className="text-slate-300">Scientifique</span>
            </h1>

            <p className="mt-5 sm:mt-6 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-light">
              Donner à chaque étudiant les clés méthodologiques et scientifiques
              de sa réussite — accompagnement ciblé en{" "}
              <strong className="text-white font-medium">MPI</strong>,{" "}
              <strong className="text-white font-medium">SML</strong> et{" "}
              <strong className="text-white font-medium">MIASS</strong>.
            </p>

            {/* CTAs : 1 principal + 2 discrets */}
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
              <Link href="/#contact" className="w-full sm:w-auto">
                <Button
                  variant="accent"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto min-h-[48px] text-base font-semibold shadow-none"
                >
                  Nous Contacter
                </Button>
              </Link>

              <Link
                href="/#mot-directeur"
                className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 px-1 py-3 min-h-[48px] flex items-center"
              >
                Mot du Directeur
              </Link>

              <Link
                href="/#presentation"
                className="text-sm text-slate-400 hover:text-white transition-colors underline underline-offset-4 px-1 py-3 min-h-[48px] flex items-center"
              >
                Notre approche
              </Link>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 2. APPROCHE PÉDAGOGIQUE — éditoriale, pas de grille uniforme     */}
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
                bénéficie d&apos;une attention réelle — pas d&apos;un cours magistral impersonnel.
              </p>
            </div>

            {/* Mise en page éditoriale asymétrique */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
              {/* Bloc principal large */}
              <div className="lg:col-span-3 bg-[#0f2744] rounded-2xl p-8 sm:p-10 text-white flex flex-col justify-between min-h-[280px]">
                <div>
                  <Target className="w-7 h-7 text-[#e0521c] mb-5" />
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold mb-3 leading-snug">
                    Pratique intensive des TD
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-md">
                    Résolution méthodique de chaque exercice : nous décortiquons chaque démonstration,
                    formule et algorithme jusqu&apos;à ce que le réflexe soit ancré.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-[#e0521c] text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>MPI · SML · MIASS</span>
                </div>
              </div>

              {/* Colonne droite : 2 blocs empilés */}
              <div className="lg:col-span-2 flex flex-col gap-6">
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

            {/* Valeurs — bande pleine largeur sobre */}
            <div className="mt-6 bg-[#e0521c]/8 border border-[#e0521c]/15 rounded-2xl px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
              <Sparkles className="w-5 h-5 text-[#e0521c] shrink-0" />
              <p className="text-slate-700 text-sm sm:text-base">
                <strong className="font-semibold text-slate-900">Rigueur & Fraternité</strong> —
                {" "}les valeurs qui guident chaque séance et chaque étudiant vers l&apos;excellence.
              </p>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 3. MOT DU DIRECTEUR                                              */}
        {/* ================================================================ */}
        <section id="mot-directeur" className="py-16 sm:py-24 bg-slate-50 border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-5 sm:px-8 lg:px-10">
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Photo — colonne gauche sombre */}
                <div className="md:w-56 lg:w-72 shrink-0 bg-[#0f2744] flex flex-col items-center justify-center py-10 px-8 gap-5">
                  <div className="w-40 h-52 sm:w-48 sm:h-60 lg:w-52 lg:h-64 rounded-xl overflow-hidden ring-2 ring-[#e0521c]/50 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/images/directeur-pape-ibrahima-samb.jpg"
                      alt="Pape Ibrahima Samb — Directeur de Halil Académie Scientifique"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div className="text-center">
                    <p className="font-serif text-sm font-bold text-white leading-tight">
                      Pape Ibrahima Samb
                    </p>
                    <p className="text-[11px] text-[#e0521c] font-semibold tracking-wide mt-1">
                      Directeur — HAS
                    </p>
                  </div>
                </div>

                {/* Texte — colonne droite */}
                <div className="flex-1 p-7 sm:p-10 flex flex-col justify-center gap-5">
                  <p className="text-[#e0521c] text-xs font-bold tracking-widest uppercase">
                    Mot du Directeur
                  </p>

                  <blockquote className="font-serif text-xl sm:text-2xl font-bold text-[#0f2744] leading-snug">
                    « Notre mission : donner à chaque étudiant les clés méthodologiques
                    et scientifiques de sa réussite. »
                  </blockquote>

                  <div className="space-y-3 text-slate-600 text-sm sm:text-base leading-relaxed border-t border-slate-100 pt-5">
                    <p>
                      Bienvenue à la <strong className="text-slate-800">Halil Académie Scientifique (HAS)</strong>.
                      Dans un monde universitaire exigeant, la maîtrise des sciences fondamentales et de l&apos;outil
                      informatique constitue le socle indispensable à l&apos;émancipation intellectuelle
                      et professionnelle des futurs cadres et chercheurs.
                    </p>
                    <p>
                      À travers nos formations de renforcement en <strong className="text-slate-800">MPI</strong>,{" "}
                      <strong className="text-slate-800">SML</strong> et{" "}
                      <strong className="text-slate-800">MIASS</strong>, notre équipe met en œuvre une pédagogie
                      active centrée sur la pratique : résolution méthodique des TD, maîtrise des examens
                      antérieurs et disponibilité continue de nos enseignants.
                    </p>
                    <p className="italic text-slate-500 border-l-2 border-[#e0521c] pl-4 text-sm">
                      « Que vous soyez en début de cursus ou en consolidation de vos acquis, la rigueur
                      et la fraternité sont les valeurs qui vous porteront chez nous vers l&apos;excellence. »
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* 4. CONTACT                                                       */}
        {/* ================================================================ */}
        <ContactSection />
      </main>

      <Footer />
    </div>
  );
}
