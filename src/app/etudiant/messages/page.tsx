import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { MessageSquare, Send, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { sendStudentMessageAction } from "@/app/actions/etudiant";

export const revalidate = 0;

export default async function EtudiantMessagesPage() {
  const user = await getCurrentUser();

  const [messages, enseignants] = await Promise.all([
    query<any>(
      `SELECT * FROM messages_contact 
       WHERE nom = $1 AND prenom = $2 
       ORDER BY id DESC`,
      [user!.nom, user!.prenom]
    ).catch(() => []),
    query<any>(
      `SELECT u.id, u.nom, u.prenom 
       FROM enseignants e 
       JOIN users u ON u.id = e.user_id 
       ORDER BY u.nom, u.prenom`
    ).catch(() => []),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Messagerie Étudiant"
        description="Contactez l'administration, la direction ou vos professeurs."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-8 max-w-5xl">
        {/* Formulaire d'envoi */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-700">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-slate-900">
                Nouveau message
              </h2>
              <p className="text-xs text-slate-500">
                Une réponse vous sera apportée directement sur cet espace.
              </p>
            </div>
          </div>

          <form action={sendStudentMessageAction} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Destinataire *
                </label>
                <select
                  name="destinataire_type"
                  required
                  defaultValue="administration"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  <option value="administration">Administration</option>
                  <option value="direction">Direction Générale</option>
                  <option value="responsable_pedagogique">Responsable Pédagogique</option>
                  <option value="enseignant">Un Enseignant</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Enseignant (si concerné)
                </label>
                <select
                  name="destinataire_id"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
                >
                  <option value="">-- Sélectionner un enseignant --</option>
                  {enseignants.map((e) => (
                    <option key={e.id} value={e.id}>
                      Pr. {e.prenom} {e.nom}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Objet / Sujet *
              </label>
              <input
                type="text"
                name="sujet"
                required
                placeholder="Ex: Demande de renseignement sur l'examen"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Message détaillé *
              </label>
              <textarea
                name="message"
                rows={4}
                required
                placeholder="Rédigez clairement votre requête..."
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-700 resize-none"
              ></textarea>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-800 transition-colors cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Envoyer le message</span>
              </button>
            </div>
          </form>
        </div>

        {/* Historique des messages */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-blue-700" />
              <span>Mes messages envoyés ({messages.length})</span>
            </h3>
          </div>

          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center">
              <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">Aucun message pour l&apos;instant</p>
              <p className="text-xs text-slate-400 mt-1">
                Utilisez le formulaire ci-dessus pour envoyer votre première requête.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((m: any) => (
                <div
                  key={m.id}
                  className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">{m.sujet}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                        {m.destinataire_type?.replace("_", " ")}
                      </span>
                    </div>
                    {m.reponse ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Réponse reçue
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Clock className="h-3 w-3" />
                        En attente de réponse
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100 whitespace-pre-line leading-relaxed">
                    {m.message}
                  </p>

                  {m.reponse && (
                    <div className="mt-3 p-3.5 rounded-xl bg-blue-50/70 border border-blue-200/60 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-blue-900">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-700" />
                        <span>Réponse de l&apos;établissement :</span>
                      </div>
                      <p className="text-blue-950 whitespace-pre-line leading-relaxed pl-5">
                        {m.reponse}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
