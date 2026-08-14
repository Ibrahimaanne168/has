import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { MessageSquare, Phone } from "lucide-react";

export const revalidate = 0;

export default async function ProfesseurMessagesPage() {
  const user = await getCurrentUser();

  const messages = await query(`
    SELECT * FROM messages_contact 
    WHERE destinataire_type = 'enseignant' OR destinataire_id = $1
    ORDER BY id DESC
  `, [user!.id]);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Messagerie Pédagogique"
        description="Questions et demandes des étudiants et de l'administration."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-5xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-700" />
            <span>Messages Reçus ({messages.length})</span>
          </h2>

          {messages.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">Aucun message pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {messages.map((m: any) => (
                <div key={m.id} className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{m.prenom} {m.nom}</span>
                    {m.telephone && <span className="text-slate-500">{m.telephone}</span>}
                  </div>
                  <h4 className="text-xs font-bold text-blue-700">{m.sujet}</h4>
                  <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200/60 whitespace-pre-line">
                    {m.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
