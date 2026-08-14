import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmploiDuTemps } from "@/lib/types";
import { Calendar, FileText, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function ProfesseurEdtPage() {
  const user = await getCurrentUser();

  const edts = await query<EmploiDuTemps>(`
    SELECT ed.id, ed.titre, ed.fichier_pdf, ed.fichier_image, 
           TO_CHAR(ed.date_publication, 'DD/MM/YYYY') as date_publication,
           cl.nom as classe_nom
    FROM emplois_du_temps ed
    JOIN classes cl ON cl.id = ed.classe_id
    WHERE ed.actif = TRUE
    ORDER BY ed.id DESC
  `);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Emplois du Temps Hebdomadaires"
        description="Consultez les plannings des différentes classes et filières."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {edts.map((e) => (
            <div key={e.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
              <div>
                <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                  {e.classe_nom}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900 mt-2">{e.titre}</h3>
                <p className="text-xs text-slate-400 mt-1">Publié le {e.date_publication}</p>
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between">
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>En vigueur</span>
                </span>
                {e.fichier_pdf && (
                  <a
                    href={e.fichier_pdf.startsWith("http") ? e.fichier_pdf : `/${e.fichier_pdf}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-3.5 w-3.5" />
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
