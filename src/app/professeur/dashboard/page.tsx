import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { BookOpen, Calendar, MessageSquare, Plus, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function ProfesseurDashboardPage() {
  const user = await getCurrentUser();

  const enseignant = await queryOne<{ id: number }>(`
    SELECT id FROM enseignants WHERE user_id = $1
  `, [user!.id]);

  let nbCours = 0;
  let mesCours: any[] = [];
  let edts: any[] = [];

  if (enseignant) {
    const cRes = await query<{ count: string }>(`
      SELECT COUNT(*) as count FROM cours WHERE enseignant_id = $1
    `, [enseignant.id]);
    nbCours = parseInt(cRes[0]?.count || "0", 10);

    mesCours = await query(`
      SELECT c.id, c.titre, m.nom as matiere_nom, cl.nom as classe_nom
      FROM cours c
      JOIN matieres m ON m.id = c.matiere_id
      JOIN classes cl ON cl.id = c.classe_id
      WHERE c.enseignant_id = $1
      ORDER BY c.id DESC LIMIT 4
    `, [enseignant.id]);

    edts = await query(`
      SELECT ed.id, ed.titre, cl.nom as classe_nom, TO_CHAR(ed.date_publication, 'DD/MM/YYYY') as date_publication, ed.fichier_pdf
      FROM emplois_du_temps ed
      JOIN classes cl ON cl.id = ed.classe_id
      WHERE ed.actif = TRUE
      ORDER BY ed.id DESC LIMIT 3
    `);
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title={`Bienvenue, Prof. ${user!.prenom} ${user!.nom}`}
        description="Espace enseignant — Gérez vos cours et supports pédagogiques."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Mes Cours Publiés
              </span>
              <p className="mt-1 font-display text-3xl font-extrabold text-slate-900">
                {nbCours}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <BookOpen className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Emplois du Temps
              </span>
              <p className="mt-1 font-display text-3xl font-extrabold text-slate-900">
                {edts.length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Action Rapide
              </span>
              <div className="mt-2">
                <Link
                  href="/professeur/cours"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Publier un cours</span>
                </Link>
              </div>
            </div>
            <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Plus className="h-6 w-6" />
            </div>
          </div>
        </div>

        {/* Mes Cours Récents */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-700" />
              <span>Derniers Cours Déposés</span>
            </h2>
            <Link
              href="/professeur/cours"
              className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
            >
              <span>Tous mes cours</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mesCours.map((c) => (
              <div key={c.id} className="rounded-xl border border-slate-200 p-4 shadow-sm">
                <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                  {c.classe_nom}
                </span>
                <h4 className="font-display font-bold text-base text-slate-900 mt-2">{c.titre}</h4>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{c.matiere_nom}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
