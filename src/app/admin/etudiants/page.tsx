import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Etudiant, Filiere, Classe } from "@/lib/types";
import { createEtudiantAction, deleteEtudiantAction } from "../actions";
import { Users, Plus, Trash2, Phone, UserPlus, GraduationCap } from "lucide-react";

export const revalidate = 0;

export default async function AdminEtudiantsPage() {
  const user = await getCurrentUser();

  const etudiants = await query<Etudiant>(`
    SELECT et.id, et.user_id, et.matricule, u.nom, u.prenom, u.login, u.telephone, u.photo,
           cl.nom as classe_nom, f.nom as filiere_nom
    FROM etudiants et
    JOIN users u ON u.id = et.user_id
    JOIN classes cl ON cl.id = et.classe_id
    JOIN filieres f ON f.id = et.filiere_id
    ORDER BY cl.nom, u.nom, u.prenom
  `);

  const filieres = await query<Filiere>(`SELECT * FROM filieres ORDER BY nom`);
  const classes = await query<Classe>(`
    SELECT c.*, f.nom as filiere_nom 
    FROM classes c 
    JOIN filieres f ON f.id = c.filiere_id 
    ORDER BY f.nom, c.nom
  `);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Gestion des Étudiants"
        description="Inscriptions, matricules et affectations aux classes."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Formulaire d'ajout */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <UserPlus className="h-5 w-5 text-indigo-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Inscrire un Nouvel Étudiant
            </h2>
          </div>

          <form action={createEtudiantAction} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Prénom *</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  placeholder="Ex: Batoura"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Nom *</label>
                <input
                  type="text"
                  name="nom"
                  required
                  placeholder="Ex: Diakhaby"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Identifiant / Login *</label>
                <input
                  type="text"
                  name="login"
                  required
                  placeholder="Ex: batoura"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
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
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Classe *</label>
                <select
                  name="classe_id"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                >
                  <option value="">Sélectionner...</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.nom} ({c.filiere_nom})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Matricule (Optionnel)</label>
                <input
                  type="text"
                  name="matricule"
                  placeholder="Généré automatiquement si vide"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Ex: 77 123 45 67"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-700/20 hover:bg-indigo-800 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Inscrire l'étudiant</span>
            </button>
          </form>
        </div>

        {/* Liste des étudiants */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-700" />
              <span>Étudiants Inscrits ({etudiants.length})</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Matricule</th>
                  <th className="p-3.5">Étudiant</th>
                  <th className="p-3.5">Login</th>
                  <th className="p-3.5">Classe & Filière</th>
                  <th className="p-3.5">Téléphone</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {etudiants.map((et) => (
                  <tr key={et.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 font-bold text-blue-700 font-mono">
                      #{et.matricule || et.id}
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">
                      {et.prenom} {et.nom}
                    </td>
                    <td className="p-3.5 text-slate-500">@{et.login}</td>
                    <td className="p-3.5">
                      <span className="inline-block rounded-md bg-blue-50 px-2 py-0.5 font-semibold text-blue-700">
                        {et.classe_nom}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-500">{et.telephone || "—"}</td>
                    <td className="p-3.5 text-right">
                      <form action={deleteEtudiantAction.bind(null, et.user_id)}>
                        <button
                          type="submit"
                          className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                          title="Supprimer l'étudiant"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
