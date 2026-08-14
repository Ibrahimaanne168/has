import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { User as UserIcon, Lock, ShieldCheck, Check } from "lucide-react";
import { hashPassword } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function updateAdminProfileAction(userId: number, formData: FormData): Promise<void> {
  "use server";
  const nom = formData.get("nom")?.toString().trim();
  const prenom = formData.get("prenom")?.toString().trim();
  const telephone = formData.get("telephone")?.toString().trim() || null;
  const newPassword = formData.get("new_password")?.toString();

  if (!nom || !prenom) return;

  if (newPassword && newPassword.length >= 6) {
    const hashed = hashPassword(newPassword);
    await query(
      `UPDATE users SET nom = $1, prenom = $2, telephone = $3, password_hash = $4 WHERE id = $5`,
      [nom, prenom, telephone, hashed, userId]
    );
  } else {
    await query(
      `UPDATE users SET nom = $1, prenom = $2, telephone = $3 WHERE id = $4`,
      [nom, prenom, telephone, userId]
    );
  }

  revalidatePath("/admin/profil");
}

export default async function AdminProfilPage() {
  const user = await getCurrentUser();

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Mon Profil & Paramètres"
        description="Gérez vos informations personnelles et la sécurité de votre compte."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-4xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
            <UserIcon className="h-5 w-5 text-blue-700" />
            <h2 className="font-display font-bold text-lg text-slate-900">
              Informations du Compte Administrateur
            </h2>
          </div>

          <form action={updateAdminProfileAction.bind(null, user!.id)} className="space-y-6">

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  defaultValue={user?.prenom}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">Nom</label>
                <input
                  type="text"
                  name="nom"
                  defaultValue={user?.nom}
                  required
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
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
                  placeholder="Ex: 75 650 20 17"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs focus:border-blue-600 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 space-y-4">
              <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                <Lock className="h-4 w-4 text-orange-600" />
                <span>Modifier le Mot de Passe (Optionnel)</span>
              </h3>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Nouveau mot de passe (laisser vide pour ne pas modifier)
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
              <span>Enregistrer les modifications</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
