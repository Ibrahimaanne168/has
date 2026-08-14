import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Cours, Filiere, Classe, Matiere, Enseignant } from "@/lib/types";
import { BookOpen, Plus, Trash2, FileText, Link as LinkIcon, ExternalLink } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function createCoursAction(formData: FormData) {
  "use server";
  const titre = formData.get("titre")?.toString().trim();
  const description = formData.get("description")?.toString().trim() || null;
  const matiere_id = parseInt(formData.get("matiere_id")?.toString() || "0", 10);
  const enseignant_id = parseInt(formData.get("enseignant_id")?.toString() || "0", 10);
  const filiere_id = parseInt(formData.get("filiere_id")?.toString() || "0", 10);
  const classe_id = parseInt(formData.get("classe_id")?.toString() || "0", 10);
  const lien_externe = formData.get("lien_externe")?.toString().trim() || null;

  if (!titre || !matiere_id || !enseignant_id || !classe_id || !filiere_id) return;

  const res = await query<{ id: number }>(`
    INSERT INTO cours (titre, description, matiere_id, enseignant_id, filiere_id, classe_id, lien_externe)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
  `, [titre, description, matiere_id, enseignant_id, filiere_id, classe_id, lien_externe]);

  if (res[0]?.id) {
    await query(`INSERT INTO cours_classe (cours_id, classe_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [res[0].id, classe_id]);
  }

  revalidatePath("/admin/cours");
}

async function deleteCoursAction(id: number) {
  "use server";
  await query(`DELETE FROM cours WHERE id = $1`, [id]);
  revalidatePath("/admin/cours");
}

export default async function AdminCoursPage() {
  const user = await getCurrentUser();

  const cours = await query<Cours>(`
    SELECT c.id, c.titre, c.description, c.matiere_id, c.enseignant_id, c.filiere_id, c.classe_id, c.lien_externe,
           m.nom as matiere_nom, u.nom as ens_nom, u.prenom as ens_prenom, cl.nom as classes_noms
    FROM cours c
    JOIN matieres m ON m.id = c.matiere_id
    JOIN enseignants e ON e.id = c.enseignant_id
    JOIN users u ON u.id = e.user_id
    JOIN classes cl ON cl.id = c.classe_id
    ORDER BY c.id DESC
  `);

  const matieres = await query<Matiere>(`SELECT * FROM matieres ORDER BY nom`);
  const enseignants = await query<Enseignant>(`
    SELECT e.id, u.nom, u.prenom FROM enseignants e JOIN users u ON u.id = e.user_id ORDER BY u.nom
  `);
  const filieres = await query<Filiere>(`SELECT * FROM filieres ORDER BY nom`);
  const classes = await query<Classe>(`SELECT * FROM classes ORDER BY nom`);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Gestion des Supports de Cours"
        description="Publiez des cours, supports numériques et liens de ressources."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Formulaire d'ajout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <BookOpen className="h-5 w-5 text-emerald-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Publier un Nouveau Cours
            </h2>
          </div>

          <form action={createCoursAction} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Titre du cours *</label>
                <input
                  type="text"
                  name="titre"
                  required
                  placeholder="Ex: Chapitre 1 - Espaces Vectoriels"
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
                  {matieres.map((m) => (
                    <option key={m.id} value={m.id}>{m.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Enseignant responsable *</label>
                <select
                  name="enseignant_id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="">Sélectionner l'enseignant...</option>
                  {enseignants.map((e) => (
                    <option key={e.id} value={e.id}>{e.prenom} {e.nom}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Filière *</label>
                <select
                  name="filiere_id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {filieres.map((f) => (
                    <option key={f.id} value={f.id}>{f.nom}</option>
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
                  <option value="">Sélectionner...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Lien externe / Visio (Optionnel)</label>
                <input
                  type="url"
                  name="lien_externe"
                  placeholder="https://drive.google.com/... ou https://meet.google.com/..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Description (Optionnel)</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Brève description ou consignes..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-700/20 hover:bg-emerald-800 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Publier le cours</span>
            </button>
          </form>
        </div>

        {/* Liste des cours */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-700" />
              <span>Liste des Cours ({cours.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {cours.map((c) => (
              <div
                key={c.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {c.classes_noms}
                    </span>
                    <form action={deleteCoursAction.bind(null, c.id)}>
                      <button
                        type="submit"
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <h3 className="font-display font-bold text-base text-slate-900 mt-2">
                    {c.titre}
                  </h3>
                  <p className="text-xs text-blue-700 font-semibold mt-0.5">
                    {c.matiere_nom}
                  </p>
                  {c.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{c.description}</p>
                  )}
                </div>

                <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Prof. {c.ens_prenom} {c.ens_nom}</span>
                  {c.lien_externe && (
                    <a
                      href={c.lien_externe}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 hover:underline flex items-center gap-1 font-semibold"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span>Lien</span>
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
