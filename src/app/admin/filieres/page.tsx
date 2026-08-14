import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Filiere, Classe, Matiere } from "@/lib/types";
import { createFiliereAction, deleteFiliereAction, createClasseAction, deleteClasseAction, createMatiereAction, deleteMatiereAction } from "../actions";
import { Layers, Plus, Trash2, BookOpen, GraduationCap } from "lucide-react";

export const revalidate = 0;

export default async function AdminFilieresPage() {
  const user = await getCurrentUser();

  const filieres = await query<Filiere>(`SELECT * FROM filieres ORDER BY id`);
  const classes = await query<Classe>(`
    SELECT c.*, f.nom as filiere_nom 
    FROM classes c 
    JOIN filieres f ON f.id = c.filiere_id 
    ORDER BY f.nom, c.nom
  `);
  const matieres = await query<Matiere>(`
    SELECT m.id, m.nom,
           STRING_AGG(DISTINCT cl.nom, ', ' ORDER BY cl.nom) as classes_noms
    FROM matieres m
    LEFT JOIN matiere_classe mc ON mc.matiere_id = m.id
    LEFT JOIN classes cl ON cl.id = mc.classe_id
    GROUP BY m.id, m.nom
    ORDER BY m.nom
  `);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Gestion des Filières, Classes & Matières"
        description="Configurez l'arborescence pédagogique de l'académie."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Section 1 : Filières & Classes */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Filières */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-700" />
                <span>Filières ({filieres.length})</span>
              </h2>
            </div>

            <form action={createFiliereAction} className="flex gap-2">
              <input
                type="text"
                name="nom"
                required
                placeholder="Nouvelle filière (ex: MPI)"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-blue-700 px-4 py-2 text-xs font-bold text-white hover:bg-blue-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter</span>
              </button>
            </form>

            <div className="space-y-2">
              {filieres.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900">{f.nom}</span>
                    {f.description && <p className="text-slate-500 text-[11px] mt-0.5">{f.description}</p>}
                  </div>
                  <form action={deleteFiliereAction.bind(null, f.id)}>
                    <button
                      type="submit"
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>

          {/* Classes */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-indigo-700" />
                <span>Classes & Niveaux ({classes.length})</span>
              </h2>
            </div>

            <form action={createClasseAction} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                name="nom"
                required
                placeholder="Nom (ex: L1 MPI)"
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
              <select
                name="filiere_id"
                required
                className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              >
                <option value="">Filière...</option>
                {filieres.map((f) => (
                  <option key={f.id} value={f.id}>{f.nom}</option>
                ))}
              </select>
              <button
                type="submit"
                className="rounded-xl bg-indigo-700 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-800 transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter</span>
              </button>
            </form>

            <div className="space-y-2">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{c.nom}</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                      {c.filiere_nom}
                    </span>
                  </div>
                  <form action={deleteClasseAction.bind(null, c.id)}>
                    <button
                      type="submit"
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 2 : Matières */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-700" />
              <span>Matières Enseignées ({matieres.length})</span>
            </h2>
          </div>

          <form action={createMatiereAction} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                name="nom"
                required
                placeholder="Nom de la matière (ex: Analyse 3, Programmation Python...)"
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-xl bg-emerald-700 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-800 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Ajouter la matière</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                Assigner aux classes :
              </span>
              <div className="flex flex-wrap gap-3">
                {classes.map((cl) => (
                  <label key={cl.id} className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                    <input type="checkbox" name="classes" value={cl.id} className="rounded text-blue-600" />
                    <span>{cl.nom}</span>
                  </label>
                ))}
              </div>
            </div>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {matieres.map((m) => (
              <div
                key={m.id}
                className="flex items-start justify-between rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm"
              >
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{m.nom}</h4>
                  <p className="text-[11px] text-blue-700 font-medium mt-1">
                    {m.classes_noms || "Non assignée"}
                  </p>
                </div>
                <form action={deleteMatiereAction.bind(null, m.id)}>
                  <button
                    type="submit"
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
