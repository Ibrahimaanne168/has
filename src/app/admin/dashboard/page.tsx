import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import {
  Users,
  GraduationCap,
  BookOpen,
  Layers,
  Calendar,
  Megaphone,
  ArrowRight,
  TrendingUp,
  Clock,
  Sparkles,
} from "lucide-react";

export const revalidate = 0; // Always fresh for admin dashboard

export default async function AdminDashboardPage() {
  const user = await getCurrentUser();

  // Metrics from Neon
  let nbEtudiants = 0;
  let nbEnseignants = 0;
  let nbCours = 0;
  let nbFilieres = 0;
  let nbClasses = 0;
  let nbCommuniques = 0;
  let filieresActives: { nom: string; nb: number }[] = [];
  let derniersLogs: { action: string; description: string }[] = [];

  try {
    const etudRes = await query<{ c: string }>(`SELECT COUNT(*) as c FROM etudiants`);
    nbEtudiants = parseInt(etudRes[0]?.c || "0", 10);

    const ensRes = await query<{ c: string }>(`SELECT COUNT(*) as c FROM enseignants`);
    nbEnseignants = parseInt(ensRes[0]?.c || "0", 10);

    const coursRes = await query<{ c: string }>(`SELECT COUNT(*) as c FROM cours`);
    nbCours = parseInt(coursRes[0]?.c || "0", 10);

    const filRes = await query<{ c: string }>(`SELECT COUNT(*) as c FROM filieres`);
    nbFilieres = parseInt(filRes[0]?.c || "0", 10);

    const clRes = await query<{ c: string }>(`SELECT COUNT(*) as c FROM classes`);
    nbClasses = parseInt(clRes[0]?.c || "0", 10);

    const comRes = await query<{ c: string }>(`SELECT COUNT(*) as c FROM communiques WHERE archive = FALSE`);
    nbCommuniques = parseInt(comRes[0]?.c || "0", 10);

    filieresActives = await query<{ nom: string; nb: number }>(`
      SELECT fl.nom as nom, COUNT(c.id) as nb
      FROM filieres fl
      LEFT JOIN cours c ON c.filiere_id = fl.id
      GROUP BY fl.id, fl.nom
      ORDER BY nb DESC
    `);

    derniersLogs = await query<{ action: string; description: string }>(`
      SELECT action, description FROM logs ORDER BY id DESC LIMIT 5
    `);
  } catch (e) {
    console.error("Admin dashboard fetch error:", e);
  }

  const statCards = [
    {
      title: "Étudiants Inscrits",
      value: nbEtudiants,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      link: "/admin/etudiants",
    },
    {
      title: "Professeurs",
      value: nbEnseignants,
      icon: GraduationCap,
      color: "from-orange-500 to-amber-600",
      link: "/admin/enseignants",
    },
    {
      title: "Supports de Cours",
      value: nbCours,
      icon: BookOpen,
      color: "from-emerald-500 to-teal-600",
      link: "/admin/cours",
    },
    {
      title: "Filières & Niveaux",
      value: `${nbFilieres} / ${nbClasses}`,
      icon: Layers,
      color: "from-purple-500 to-violet-600",
      link: "/admin/filieres",
    },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Vue d'ensemble de l'Académie"
        description="Statistiques globales, activités et gestion pédagogique HAS."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Link
                key={idx}
                href={stat.link}
                className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-card hover:shadow-lift hover:border-slate-300 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr ${stat.color} text-white shadow-md`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Gérer <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
                <div className="mt-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    {stat.title}
                  </span>
                  <p className="mt-1 font-display text-3xl font-extrabold text-slate-900">
                    {stat.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* 2-Column Analytics */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Filières Actives */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-700" />
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Répartition des Cours par Filière
                </h3>
              </div>
              <Link
                href="/admin/filieres"
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Tout voir
              </Link>
            </div>

            <div className="space-y-4">
              {filieresActives.map((fil, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span>{fil.nom}</span>
                    <span>{fil.nb} cours</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"
                      style={{
                        width: `${Math.min(100, Math.max(15, (fil.nb / (nbCours || 1)) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Recent Info */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">
                  Accès Rapides & Raccourcis
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/admin/enseignants"
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col justify-between"
              >
                <GraduationCap className="h-5 w-5 text-blue-700 mb-2" />
                <span className="font-bold text-xs text-slate-900">Ajouter un Enseignant</span>
                <span className="text-[11px] text-slate-500 mt-1">Assigner matières & filières</span>
              </Link>

              <Link
                href="/admin/etudiants"
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col justify-between"
              >
                <Users className="h-5 w-5 text-indigo-700 mb-2" />
                <span className="font-bold text-xs text-slate-900">Inscrire un Étudiant</span>
                <span className="text-[11px] text-slate-500 mt-1">Matricule & classe</span>
              </Link>

              <Link
                href="/admin/edt"
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col justify-between"
              >
                <Calendar className="h-5 w-5 text-orange-600 mb-2" />
                <span className="font-bold text-xs text-slate-900">Publier un EDT</span>
                <span className="text-[11px] text-slate-500 mt-1">PDF & Image planning</span>
              </Link>

              <Link
                href="/admin/communiques"
                className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/50 transition-all flex flex-col justify-between"
              >
                <Megaphone className="h-5 w-5 text-emerald-600 mb-2" />
                <span className="font-bold text-xs text-slate-900">Communiqué Officiel</span>
                <span className="text-[11px] text-slate-500 mt-1">Mise en avant</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
