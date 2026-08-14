import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Cours, FichierCours } from "@/lib/types";
import { BookOpen, FileText, ExternalLink, Bookmark, Search } from "lucide-react";

export const revalidate = 0;

export default async function EtudiantCoursPage() {
  const user = await getCurrentUser();

  const etudiant = await queryOne<{ id: number; classe_id: number; classe_nom: string }>(`
    SELECT et.id, et.classe_id, cl.nom as classe_nom
    FROM etudiants et
    JOIN classes cl ON cl.id = et.classe_id
    WHERE et.user_id = $1
  `, [user!.id]);

  let mesCours: Cours[] = [];

  if (etudiant) {
    mesCours = await query<Cours>(`
      SELECT c.id, c.titre, c.description, c.matiere_id, c.enseignant_id, c.classe_id, c.lien_externe,
             m.nom as matiere_nom, u.nom as ens_nom, u.prenom as ens_prenom
      FROM cours c
      JOIN matieres m ON m.id = c.matiere_id
      JOIN enseignants e ON e.id = c.enseignant_id
      JOIN users u ON u.id = e.user_id
      WHERE c.classe_id = $1
      ORDER BY m.nom, c.id DESC
    `, [etudiant.classe_id]);

    for (const c of mesCours) {
      const fichiers = await query<FichierCours>(`
        SELECT * FROM fichiers_cours WHERE cours_id = $1
      `, [c.id]);
      c.fichiers = fichiers;
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Mes Supports de Cours"
        description={`Tous les cours et documents de votre classe : ${etudiant?.classe_nom || "HAS"}`}
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-700" />
              <span>Documents Disponibles ({mesCours.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mesCours.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                    {c.matiere_nom}
                  </span>

                  <h3 className="font-display font-bold text-base text-slate-900 mt-3">
                    {c.titre}
                  </h3>

                  {c.description && (
                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {c.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 border-t border-slate-100 pt-3 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                    <span>Prof. {c.ens_prenom} {c.ens_nom}</span>
                  </div>

                  {c.lien_externe && (
                    <a
                      href={c.lien_externe}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Accéder au support en ligne</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
