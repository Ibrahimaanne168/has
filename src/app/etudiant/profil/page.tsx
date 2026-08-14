import { getCurrentUser } from "@/lib/auth";
import { query, queryOne } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { User, Lock, Check } from "lucide-react";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function updateEtudiantProfileAction(userId: number, formData: FormData): Promise<void> {
  "use server";
  const telephone = formData.get("telephone")?.toString().trim() || null;
  const newPassword = formData.get("new_password")?.toString();

  if (newPassword && newPassword.length >= 6) {
    const hashed = hashPassword(newPassword);
    await query(`UPDATE users SET telephone = $1, password_hash = $2 WHERE id = $3`, [telephone, hashed, userId]);
  } else {
    await query(`UPDATE users SET telephone = $1 WHERE id = $2`, [telephone, userId]);
  }

  revalidatePath("/etudiant/profil");
}

export default async function EtudiantProfilPage() {
  const user = await getCurrentUser();
  const etudiant = await queryOne<{ matricule: string; classe_nom: string; filiere_nom: string }>(`
    SELECT et.matricule, cl.nom as classe_nom, f.nom as filiere_nom
    FROM etudiants et
    JOIN classes cl ON cl.id = et.classe_id
    JOIN filieres f ON f.id = et.filiere_id
    WHERE et.user_id = $1
  `, [user!.id]);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Mon Profil Étudiant"
        description="Consultez votre fiche d'inscription et modifiez vos informations."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <User className="h-5 w-5 text-blue-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Fiche Individuelle de l'Étudiant
            </h2>
          </div>

          <form action={updateEtudiantProfileAction.bind(null, user!.id)} className="space-y-6">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Nom complet</label>
                <input
                  type="text"
                  defaultValue={`${user?.prenom} ${user?.nom}`}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Matricule</label>
                <input
                  type="text"
                  defaultValue={`#${etudiant?.matricule || user?.id}`}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs font-mono font-bold text-blue-700 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Classe</label>
                <input
                  type="text"
                  defaultValue={`${etudiant?.classe_nom} (${etudiant?.filiere_nom})`}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-700 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Identifiant de connexion</label>
                <input
                  type="text"
                  defaultValue={user?.login}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 p-2.5 text-xs text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  defaultValue={user?.telephone || ""}
                  placeholder="Ex: 77 123 45 67"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-orange-600" />
                <span>Modifier mon Mot de Passe</span>
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  name="new_password"
                  placeholder="••••••••"
                  className="w-full sm:w-1/2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 transition-all cursor-pointer"
            >
              <Check className="h-4 w-4" />
              <span>Enregistrer mes coordonnées</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
