import Link from "next/link";
import Image from "next/image";
import { query } from "@/lib/db";
import { Filiere, Enseignant, Communique } from "@/lib/types";
import {
  GraduationCap,
  BookOpen,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export const revalidate = 60; // Revalidate dynamic data every minute

export default async function HomePage() {
  // Fetch dynamic stats and content from Neon
  let filieres: Filiere[] = [];
  let enseignants: Enseignant[] = [];
  let communiques: Communique[] = [];
  let totalEtudiants = 0;
  let totalCours = 0;

  try {
    filieres = await query<Filiere>(`
      SELECT f.id, f.nom, f.description, 
             COUNT(DISTINCT c.id) as nb_classes,
             COUNT(DISTINCT co.id) as nb_cours
      FROM filieres f
      LEFT JOIN classes c ON c.filiere_id = f.id
      LEFT JOIN cours co ON co.filiere_id = f.id
      GROUP BY f.id, f.nom, f.description
      ORDER BY f.id
    `);

    enseignants = await query<Enseignant>(`
      SELECT e.id, u.nom, u.prenom, u.photo, e.biographie,
             STRING_AGG(DISTINCT f.nom, ', ' ORDER BY f.nom) as filieres_noms
      FROM enseignants e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN enseignant_filiere ef ON ef.enseignant_id = e.id
      LEFT JOIN filieres f ON f.id = ef.filiere_id
      GROUP BY e.id, u.nom, u.prenom, u.photo, e.biographie
      ORDER BY u.nom, u.prenom
      LIMIT 4
    `);

    communiques = await query<Communique>(`
      SELECT id, titre, contenu, date_publication
      FROM communiques
      WHERE archive = FALSE
      ORDER BY mis_en_avant DESC, id DESC
      LIMIT 3
    `);

    const countEtud = await query<{ count: string }>(`SELECT COUNT(*) as count FROM etudiants`);
    totalEtudiants = parseInt(countEtud[0]?.count || "0", 10);

    const countCr = await query<{ count: string }>(`SELECT COUNT(*) as count FROM cours`);
    totalCours = parseInt(countCr[0]?.count || "0", 10);
  } catch (e) {
    console.error("Home page DB fetch error:", e);
  }

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-slate-50 to-white pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e40af0a_1px,transparent_1px),linear-gradient(to_bottom,#1e40af0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-white/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-orange-500" />
              <span>Excellence Académique & Pédagogique</span>
            </div>

            <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-[1.15]">
              Formez votre avenir avec la{" "}
              <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-orange-500 bg-clip-text text-transparent">
                Halil Académie Scientifique
              </span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-600 sm:text-xl">
              Accédez à vos cours, emplois du temps actualisés, supports numériques et
              échanges avec vos enseignants sur une plateforme unifiée et moderne.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-xl bg-blue-700 px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-700/25 hover:bg-blue-800 hover:shadow-xl transition-all active:scale-95"
              >
                <span>Accéder à mon espace</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/presentation"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-8 py-3.5 text-base font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:border-slate-400 transition-all"
              >
                <span>Découvrir l'Académie</span>
              </Link>
            </div>
          </div>

          {/* Key Metrics / Highlights */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-8">
            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3 text-blue-700">
                <Users className="h-5 w-5" />
                <span className="font-display text-3xl font-bold text-slate-900">
                  {totalEtudiants || 4}+
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">Étudiants inscrits</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3 text-orange-600">
                <GraduationCap className="h-5 w-5" />
                <span className="font-display text-3xl font-bold text-slate-900">
                  {enseignants.length || 6}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">Professeurs experts</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3 text-indigo-600">
                <Layers className="h-5 w-5" />
                <span className="font-display text-3xl font-bold text-slate-900">
                  {filieres.length || 3}
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">Filières d'excellence</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md">
              <div className="flex items-center gap-3 text-emerald-600">
                <BookOpen className="h-5 w-5" />
                <span className="font-display text-3xl font-bold text-slate-900">
                  {totalCours || 19}+
                </span>
              </div>
              <p className="mt-2 text-sm font-medium text-slate-500">Cours & Matières</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Filières Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
              Formations Universitaires
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
              Nos Filières Académiques
            </h2>
          </div>
          <p className="text-slate-600 max-w-md text-sm">
            Des cursus rigoureux et spécialisés pour préparer les leaders scientifiques et
            technologiques de demain.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {filieres.map((filiere) => (
            <div
              key={filiere.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8 shadow-card hover:border-blue-300 hover:shadow-lift transition-all duration-300"
            >
              <div>
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700 font-display font-bold text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {filiere.nom}
                </div>
                <h3 className="mt-5 font-display text-xl font-bold text-slate-900">
                  {filiere.nom}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {filiere.description || "Formation scientifique spécialisée."}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                <span>{filiere.nb_classes || 2} Classes (L1 & L2)</span>
                <span className="flex items-center gap-1 text-blue-700 group-hover:translate-x-1 transition-transform">
                  En savoir plus <ChevronRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Professeurs Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
            Corps Professoral
          </span>
          <h2 className="mt-2 font-display text-3xl font-bold text-slate-900 sm:text-4xl">
            Des Enseignants Dévoués
          </h2>
          <p className="mt-3 text-slate-600 text-sm">
            Un encadrement d'excellence par des étudiants-chercheurs et professeurs passionnés.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {enseignants.map((prof) => (
            <div
              key={prof.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center"
            >
              <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-blue-600/20 bg-slate-100 mb-4">
                {prof.photo ? (
                  <Image
                    src={prof.photo.startsWith("http") ? prof.photo : `/${prof.photo}`}
                    alt={`${prof.prenom} ${prof.nom}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-50 font-display font-bold text-xl text-blue-700">
                    {prof.prenom[0]}
                    {prof.nom[0]}
                  </div>
                )}
              </div>
              <h3 className="font-display font-bold text-slate-900 text-lg">
                {prof.prenom} {prof.nom}
              </h3>
              <p className="mt-1 text-xs font-semibold text-blue-700 uppercase tracking-wider">
                {prof.filieres_noms || "Enseignant HAS"}
              </p>
              {prof.biographie && (
                <p className="mt-2 text-xs text-slate-500 line-clamp-2">
                  {prof.biographie}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/professeurs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors"
          >
            <span>Voir toute l'équipe enseignante</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. CTA Box */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-8 py-12 sm:px-16 sm:py-16 text-white shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="font-display text-3xl font-bold sm:text-4xl text-white">
              Prêt à commencer vos révisions ?
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Connectez-vous à votre espace personnel pour télécharger vos supports de cours,
              consulter les emplois du temps et échanger avec la direction.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-95"
              >
                <span>Accéder à la plateforme</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
