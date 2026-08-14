import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { BookOpen, Plus, Trash2, ExternalLink } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function createProfCoursAction(enseignantId: number, formData: FormData): Promise<void> {
  "use server";
  const titre = formData.get("titre")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const matiere_id = parseInt(formData.get("matiere_id")?.toString() || "0", 10);
  const classe_id = parseInt(formData.get("classe_id")?.toString() || "0", 10);
  const lien_externe = formData.get("lien_externe")?.toString().trim() || null;

  if (!titre || !matiere_id || !classe_id) return;

  const cl = await queryOne<{ filiere_id: number }>(`SELECT filiere_id FROM classes WHERE id = $1`, [classe_id]);
  const filiere_id = cl?.filiere_id || 1;

  const res = await query<{ id: number }>(`
    INSERT INTO cours (titre, description, matiere_id, enseignant_id, filiere_id, classe_id, lien_externe)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
  `, [titre, description, matiere_id, enseignantId, filiere_id, classe_id, lien_externe]);

  if (res[0]?.id) {
    await query(`INSERT INTO cours_classe (cours_id, classe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [res[0].id, classe_id]);
  }

  revalidatePath("/professeur/cours");
}

async function deleteProfCoursAction(id: number, enseignantId: number): Promise<void> {
  "use server";
  await query(`DELETE FROM cours WHERE id = $1 AND enseignant_id = $2`, [id, enseignantId]);
  revalidatePath("/professeur/cours");
}

export default async function ProfesseurCoursPage() {
  const user = await getCurrentUser();

  const ens = await queryOne<{ id: number }>(`SELECT id FROM enseignants WHERE user_id = $1`, [user!.id]);
  if (!ens) return null;

  const mesCours = await query(`
    SELECT c.id, c.titre, c.description, c.lien_externe, m.nom as matiere_nom, cl.nom as classe_nom
    FROM cours c
    JOIN matieres m ON m.id = c.matiere_id
    JOIN classes cl ON cl.id = c.classe_id
    WHERE c.enseignant_id = $1
    ORDER BY c.id DESC
  `, [ens.id]);

  const matieres = await query(`
    SELECT m.id, m.nom FROM matieres m
    JOIN enseignant_matiere em ON em.matiere_id = m.id
    WHERE em.enseignant_id = $1
    ORDER BY m.nom
  `, [ens.id]);

  const classes = await query(`SELECT * FROM classes ORDER BY nom`);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Gestion de Mes Cours"
        description="Déposez vos leçons, fiches de révision et liens de visioconférence."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Formulaire */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <BookOpen className="h-5 w-5 text-blue-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Déposer un Nouveau Cours
            </h2>
          </div>

          <form action={createProfCoursAction.bind(null, ens.id)} className="space-y-4">

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Titre du cours *</label>
                <input
                  type="text"
                  name="titre"
                  required
                  placeholder="Ex: Chapitre 2 - Dérivabilité"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Matière *</label>
                <select
                  name="matiere_id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="">Sélectionner la matière...</option>
                  {matieres.map((m: any) => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Classe destinataire *</label>
                <select
                  name="classe_id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="">Sélectionner la classe...</option>
                  {classes.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Lien externe / Drive / Visio</label>
                <input
                  type="url"
                  name="lien_externe"
                  placeholder="https://meet.google.com/... ou lien de partage"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Instructions ou résumé du cours..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publier le support</span>
            </button>
          </form>
        </div>

        {/* Mes Cours */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-700" />
              <span>Mes Cours Publiés ({mesCours.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mesCours.map((c: any) => (
              <div key={c.id} className="rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {c.classe_nom}
                    </span>
                    <form action={deleteProfCoursAction.bind(null, c.id, ens.id)}>
                      <button type="submit" className="text-slate-400 hover:text-rose-600 transition-colors p-1">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mt-2">{c.titre}</h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">{c.matiere_nom}</p>
                  {c.description && <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.description}</p>}
                </div>

                {c.lien_externe && (
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <a
                      href={c.lien_externe}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Consulter le lien</span>
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
