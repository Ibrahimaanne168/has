import Image from "next/image";
import Link from "next/link";
import { Award, Compass, Sparkles, BookOpen, Users, CheckCircle, ArrowRight } from "lucide-react";

export default function PresentationPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          À Propos de l'Académie
        </span>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
          L'Excellence Scientifique & Pédagogique
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Fondée avec la mission d'élever le niveau d'apprentissage des étudiants dans les disciplines
          scientifiques fondamentales et appliquées.
        </p>
      </div>

      {/* Story & Vision */}
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            <Compass className="h-4 w-4" />
            <span>Notre Vision</span>
          </div>
          <h2 className="font-display text-3xl font-bold text-slate-900">
            Un Encadrement Rigoureux pour Réussir
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
            L'Académie Scientifique Halil (HAS) offre aux étudiants un cadre d'apprentissage moderne,
            stimulant et adapté aux exigences universitaires actuelles.
          </p>
          <div className="space-y-3">
            {[
              "Encadrement personnalisé par des enseignants expérimentés",
              "Supports de cours complets (PDF, fiches d'exercices, examens corrigés)",
              "Préparation intensive aux partiels et concours universitaires",
              "Suivi régulier et disponibilité constante de l'équipe pédagogique",
            ].map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <CheckCircle className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Highlight Image or Box */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-blue-900 to-indigo-950 p-10 text-white shadow-2xl">
          <div className="space-y-6">
            <span className="font-display text-4xl font-extrabold text-orange-400">100%</span>
            <h3 className="font-display text-2xl font-bold text-white">
              Engagement pour la Réussite
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Nos méthodes pédagogiques combinent théorie rigoureuse, travaux dirigés intensifs et
              plateforme numérique accessible 24h/24.
            </p>
            <div className="border-t border-slate-800 pt-6 flex items-center gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full border border-white/20 bg-white">
                <Image
                  src="/images/logo_has.jpg"
                  alt="HAS"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Direction Académique</p>
                <p className="text-xs text-slate-400">Halil Académie Scientifique</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
