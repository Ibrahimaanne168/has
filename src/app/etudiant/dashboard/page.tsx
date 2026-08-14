import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { BookOpen, Calendar, Megaphone, ArrowRight, Sparkles, FileText, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function EtudiantDashboardPage() {
  const user = await getCurrentUser();

  const etudiant = await queryOne<{ id: number; classe_id: number; filiere_id: number; matricule: string; classe_nom: string; filiere_nom: string }>(`
    SELECT et.id, et.classe_id, et.filiere_id, et.matricule, cl.nom as classe_nom, f.nom as filiere_nom
    FROM etudiants et
    JOIN classes cl ON cl.id = et.classe_id
    JOIN filieres f ON f.id = et.filiere_id
    WHERE et.user_id = $1
  `, [user!.id]);

  let mesCours: any[] = [];
  let communiques: any[] = [];
  let monEdt: any = null;

  if (etudiant) {
    mesCours = await query(`
      SELECT c.id, c.titre, m.nom as matiere_nom, u.nom as ens_nom, u.prenom as ens_prenom
      FROM cours c
      JOIN matieres m ON m.id = c.matiere_id
      JOIN enseignants e ON e.id = c.enseignant_id
      JOIN users u ON u.id = e.user_id
      WHERE c.classe_id = $1
      ORDER BY c.id DESC LIMIT 4
    `, [etudiant.classe_id]);

    communiques = await query(`
      SELECT id, titre, contenu, TO_CHAR(date_publication, 'DD/MM/YYYY') as date_publication, mis_en_avant
      FROM communiques
      WHERE archive = FALSE
      ORDER BY mis_en_avant DESC, id DESC LIMIT 3
    `);

    monEdt = await queryOne(`
      SELECT ed.id, ed.titre, ed.fichier_pdf, TO_CHAR(ed.date_publication, 'DD/MM/YYYY') as date_publication
      FROM emplois_du_temps ed
      WHERE ed.classe_id = $1 AND ed.actif = TRUE
      ORDER BY ed.id DESC LIMIT 1
    `, [etudiant.classe_id]);
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title={`Bienvenue, ${user!.prenom} !`}
        description={`Espace Étudiant — Classe : ${etudiant?.classe_nom || "HAS"} (Matricule #${etudiant?.matricule || etudiant?.id})`}
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-7xl">
        {/* Banner Alert if EDT available */}
        {monEdt && (
          <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-900 to-indigo-900 p-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/30 px-2.5 py-0.5 text-xs font-bold text-blue-200">
                <Calendar className="h-3.5 w-3.5" />
                <span>Emploi du temps en cours</span>
              </span>
              <h3 className="font-display font-bold text-lg text-white">{monEdt.titre}</h3>
              <p className="text-xs text-slate-300">Mis à jour le {monEdt.date_publication}</p>
            </div>
            {monEdt.fichier_pdf && (
              <a
                href={monEdt.fichier_pdf.startsWith("http") ? monEdt.fichier_pdf : `/${monEdt.fichier_pdf}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-600 shadow-md transition-all flex-shrink-0"
              >
                <FileText className="h-4 w-4" />
                <span>Télécharger mon planning</span>
              </a>
            )}
          </div>
        )}

        {/* 2-Col Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Mes Cours Récents */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-700" />
                <span>Derniers Cours Déposés</span>
              </h2>
              <Link href="/etudiant/cours" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                <span>Tous mes cours</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {mesCours.map((c) => (
                <div key={c.id} className="rounded-xl border border-slate-200 p-4 hover:border-blue-300 hover:bg-blue-50/40 transition-all flex items-center justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900">{c.titre}</h4>
                    <p className="text-xs text-blue-700 font-semibold mt-0.5">{c.matiere_nom}</p>
                    <p className="text-[11px] text-slate-500 mt-1">Prof. {c.ens_prenom} {c.ens_nom}</p>
                  </div>
                  <Link
                    href="/etudiant/cours"
                    className="text-xs font-bold text-blue-700 hover:underline"
                  >
                    Ouvrir
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Communiqués */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-orange-600" />
                <span>Annonces & Communiqués</span>
              </h2>
              <Link href="/etudiant/communiques" className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1">
                <span>Voir tout</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {communiques.map((com) => (
                <div key={com.id} className="rounded-xl border border-slate-200 p-4 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-display font-bold text-sm text-slate-900">{com.titre}</h4>
                    <span className="text-[10px] text-slate-400 font-medium">{com.date_publication}</span>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2">{com.contenu}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
