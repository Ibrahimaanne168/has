import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Communique } from "@/lib/types";
import { createCommuniqueAction, deleteCommuniqueAction } from "../actions";
import { Megaphone, Plus, Trash2, Pin, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function AdminCommuniquesPage() {
  const user = await getCurrentUser();

  const communiques = await query<Communique>(`
    SELECT c.id, c.titre, c.contenu, c.image, c.fichier_pdf, c.mis_en_avant, c.archive,
           TO_CHAR(c.date_publication, 'DD/MM/YYYY') as date_publication,
           u.nom as auteur_nom, u.prenom as auteur_prenom
    FROM communiques c
    JOIN users u ON u.id = c.auteur_id
    ORDER BY c.mis_en_avant DESC, c.id DESC
  `);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Gestion des Communiqués"
        description="Publiez des annonces officielles pour les étudiants et enseignants."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-10 max-w-7xl">
        {/* Formulaire */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <Megaphone className="h-5 w-5 text-blue-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Publier un Nouveau Communiqué
            </h2>
          </div>

          <form action={createCommuniqueAction.bind(null, user!.id)} className="space-y-4">

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Titre de l'annonce *</label>
              <input
                type="text"
                name="titre"
                required
                placeholder="Ex: Calendrier des examens du second semestre"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Contenu du message *</label>
              <textarea
                name="contenu"
                required
                rows={4}
                placeholder="Rédigez le texte du communiqué..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" name="mis_en_avant" className="rounded text-blue-600" />
                <span>Épingler / Mettre en avant ce communiqué</span>
              </label>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Diffuser le communiqué</span>
            </button>
          </form>
        </div>

        {/* Liste */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <Megaphone className="h-5 w-5 text-blue-700" />
              <span>Communiqués Publiés ({communiques.length})</span>
            </h2>
          </div>

          <div className="space-y-4">
            {communiques.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 max-w-3xl">
                  <div className="flex items-center gap-2">
                    {c.mis_en_avant && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                        <Pin className="h-3 w-3" />
                        <span>Épinglé</span>
                      </span>
                    )}
                    <h3 className="font-display font-bold text-base text-slate-900">
                      {c.titre}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                    {c.contenu}
                  </p>

                  <p className="text-[11px] text-slate-400">
                    Par {c.auteur_prenom} {c.auteur_nom} le {c.date_publication}
                  </p>
                </div>

                <form action={deleteCommuniqueAction.bind(null, c.id)}>
                  <button
                    type="submit"
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Supprimer"
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
