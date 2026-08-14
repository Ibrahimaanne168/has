import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Enseignant, Filiere, Matiere } from "@/lib/types";
import { createEnseignantAction, deleteEnseignantAction } from "../actions";
import { GraduationCap, Plus, Trash2, Phone, BookOpen, Layers, UserPlus } from "lucide-react";

export const revalidate = 0;

export default async function AdminEnseignantsPage() {
  const user = await getCurrentUser();

  const enseignants = await query<Enseignant>(`
    SELECT e.id, e.user_id, e.biographie, u.nom, u.prenom, u.login, u.telephone, u.photo,
           STRING_AGG(DISTINCT f.nom, ', ' ORDER BY f.nom) as filieres_noms
    FROM enseignants e
    JOIN users u ON u.id = e.user_id
    LEFT JOIN enseignant_filiere ef ON ef.enseignant_id = e.id
    LEFT JOIN filieres f ON f.id = ef.filiere_id
    GROUP BY e.id, e.user_id, e.biographie, u.nom, u.prenom, u.login, u.telephone, u.photo
    ORDER BY u.nom, u.prenom
  `);

  for (const ens of enseignants) {
    const mat = await query<{ nom: string }>(`
      SELECT m.nom FROM matieres m
      JOIN enseignant_matiere em ON em.matiere_id = m.id
      WHERE em.enseignant_id = $1
    `, [ens.id]);
    ens.matieres_noms = mat.map((m) => m.nom).join(", ");
  }

  const filieres = await query<Filiere>(`SELECT * FROM filieres ORDER BY nom`);
  const matieres = await query<Matiere>(`SELECT * FROM matieres ORDER BY nom`);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Gestion des Enseignants"
        description="Ajoutez et assignez les professeurs aux matières et filières."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Formulaire d'ajout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <UserPlus className="h-5 w-5 text-blue-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Ajouter un Nouvel Enseignant
            </h2>
          </div>

          <form action={createEnseignantAction} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  placeholder="Ex: Pape"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Ex: Samb"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Identifiant / Login *</label>
                <input
                  type="text"
                  name="login"
                  required
                  placeholder="Ex: psamb"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Ex: 77 000 00 00"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Mot de passe temporaire</label>
                <input
                  type="password"
                  name="password"
                  defaultValue="123456"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Biographie / Titre</label>
                <input
                  type="text"
                  name="biographie"
                  placeholder="Ex: Doctorant en Mathématiques"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Checkboxes Filières et Matières */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Filières rattachées :
                </span>
                <div className="flex flex-wrap gap-3">
                  {filieres.map((f) => (
                    <label key={f.id} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input type="checkbox" name="filieres" value={f.id} className="rounded text-blue-600" />
                      <span>{f.nom}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Matières assignées :
                </span>
                <div className="flex flex-wrap gap-3 max-h-28 overflow-y-auto">
                  {matieres.map((m) => (
                    <label key={m.id} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input type="checkbox" name="matieres" value={m.id} className="rounded text-blue-600" />
                      <span>{m.nom}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Enregistrer l'enseignant</span>
            </button>
          </form>
        </div>

        {/* Liste des enseignants */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-700" />
              <span>Enseignants Enregistrés ({enseignants.length})</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enseignants.map((ens) => (
              <div
                key={ens.id}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 bg-blue-50 flex items-center justify-center font-display font-bold text-base text-blue-700">
                        {ens.photo ? (
                          <Image src={ens.photo.startsWith("http") ? ens.photo : `/${ens.photo}`} alt="" fill className="object-cover" />
                        ) : (
                          `${ens.prenom[0]}${ens.nom[0]}`
                        )}
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-sm text-slate-900">
                          {ens.prenom} {ens.nom}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">@{ens.login}</p>
                      </div>
                    </div>
                    <form action={deleteEnseignantAction.bind(null, ens.user_id)}>
                      <button
                        type="submit"
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                        title="Supprimer l'enseignant"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>

                  <div className="mt-4 space-y-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Layers className="h-3.5 w-3.5 text-blue-600" />
                      <span className="font-semibold">{ens.filieres_noms || "Aucune filière"}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-600">
                      <BookOpen className="h-3.5 w-3.5 text-emerald-600 mt-0.5" />
                      <span className="line-clamp-2">{ens.matieres_noms || "Aucune matière"}</span>
                    </div>
                    {ens.telephone && (
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3.5 w-3.5" />
                        <span>{ens.telephone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
