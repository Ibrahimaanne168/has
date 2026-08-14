import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { EmploiDuTemps, Classe } from "@/lib/types";
import { Calendar, Plus, Trash2, FileText, CheckCircle2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function createEdtAction(formData: FormData) {
  "use server";
  const titre = formData.get("titre")?.toString().trim();
  const classe_id = parseInt(formData.get("classe_id")?.toString() || "0", 10);
  const fichier_pdf = formData.get("fichier_pdf")?.toString().trim() || null;
  const fichier_image = formData.get("fichier_image")?.toString().trim() || null;

  if (!titre || !classe_id) return;

  const res = await query<{ id: number }>(`
    INSERT INTO emplois_du_temps (titre, classe_id, fichier_pdf, fichier_image, date_publication, actif)
    VALUES ($1, $2, $3, $4, CURRENT_DATE, TRUE) RETURNING id
  `, [titre, classe_id, fichier_pdf, fichier_image]);

  if (res[0]?.id) {
    await query(`INSERT INTO edt_classe (edt_id, classe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [res[0].id, classe_id]);
  }

  revalidatePath("/admin/edt");
}

async function deleteEdtAction(id: number) {
  "use server";
  await query(`DELETE FROM emplois_du_temps WHERE id = $1`, [id]);
  revalidatePath("/admin/edt");
}

export default async function AdminEdtPage() {
  const user = await getCurrentUser();

  const edts = await query<EmploiDuTemps>(`
    SELECT ed.id, ed.classe_id, ed.titre, ed.fichier_pdf, ed.fichier_image, 
           TO_CHAR(ed.date_publication, 'DD/MM/YYYY') as date_publication, ed.actif,
           cl.nom as classe_nom
    FROM emplois_du_temps ed
    JOIN classes cl ON cl.id = ed.classe_id
    ORDER BY ed.id DESC
  `);

  const classes = await query<Classe>(`SELECT * FROM classes ORDER BY nom`);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Emplois du Temps (EDT)"
        description="Publiez les plannings et emplois du temps hebdomadaires."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Formulaire */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Calendar className="h-5 w-5 text-orange-600" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Publier un Nouvel Emploi du Temps
            </h2>
          </div>

          <form action={createEdtAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Titre du planning *</label>
                <input
                  type="text"
                  name="titre"
                  required
                  placeholder="Ex: Emploi du temps Semaine 12"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Classe concernée *</label>
                <select
                  name="classe_id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="">Sélectionner la classe...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Lien fichier PDF (Cloud/Storage)</label>
                <input
                  type="text"
                  name="fichier_pdf"
                  placeholder="Ex: uploads/edt/planning_l1.pdf ou URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Lien Image planning (Optionnel)</label>
                <input
                  type="text"
                  name="fichier_image"
                  placeholder="Ex: uploads/edt/planning_l1.png ou URL"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-600/20 hover:bg-orange-700 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publier l'emploi du temps</span>
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span>Emplois du Temps Actifs ({edts.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {edts.map((e) => (
              <div
                key={e.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                      {e.classe_nom}
                    </span>
                    <form action={deleteEdtAction.bind(null, e.id)}>
                      <button
                        type="submit"
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mt-2">
                    {e.titre}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">Publié le {e.date_publication}</p>
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-semibold">
                  <span className="text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>Actif</span>
                  </span>
                  {e.fichier_pdf && (
                    <a
                      href={e.fichier_pdf.startsWith("http") ? e.fichier_pdf : `/${e.fichier_pdf}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline flex items-center gap-1"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      <span>Voir PDF</span>
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
