import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmploiDuTemps } from "@/lib/types";
import { Calendar, FileText, CheckCircle2, Download } from "lucide-react";

export const revalidate = 0;

export default async function EtudiantEdtPage() {
  const user = await getCurrentUser();

  const etudiant = await queryOne<{ id: number; classe_id: number; classe_nom: string }>(`
    SELECT et.id, et.classe_id, cl.nom as classe_nom
    FROM etudiants et
    JOIN classes cl ON cl.id = et.classe_id
    WHERE et.user_id = $1
  `, [user!.id]);

  let edts: EmploiDuTemps[] = [];

  if (etudiant) {
    edts = await query<EmploiDuTemps>(`
      SELECT ed.id, ed.titre, ed.fichier_pdf, ed.fichier_image, 
             TO_CHAR(ed.date_publication, 'DD/MM/YYYY') as date_publication
      FROM emplois_du_temps ed
      WHERE ed.classe_id = $1 AND ed.actif = TRUE
      ORDER BY ed.id DESC
    `, [etudiant.classe_id]);
  }

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Mon Emploi du Temps"
        description={`Planning et horaires de cours de la classe : ${etudiant?.classe_nom || "HAS"}`}
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {edts.map((e) => (
            <div key={e.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="rounded-md bg-orange-50 px-2.5 py-0.5 text-xs font-bold text-orange-700">
                  {etudiant?.classe_nom}
                </span>
                <h3 className="font-display font-bold text-lg text-slate-900 mt-3">{e.titre}</h3>
                <p className="text-xs text-slate-400 mt-1">Publié le {e.date_publication}</p>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>En vigueur</span>
                </span>
                {e.fichier_pdf && (
                  <a
                    href={e.fichier_pdf.startsWith("http") ? e.fichier_pdf : `/${e.fichier_pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-800 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Télécharger</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
