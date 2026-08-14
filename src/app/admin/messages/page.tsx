import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { MessageContact } from "@/lib/types";
import { MessageSquare, Phone, CheckCircle2, Trash2 } from "lucide-react";
import { revalidatePath } from "next/cache";

export const revalidate = 0;

async function markAsReadAction(id: number) {
  "use server";
  await query(`UPDATE messages_contact SET lu = TRUE WHERE id = $1`, [id]);
  revalidatePath("/admin/messages");
}

async function deleteMessageAction(id: number) {
  "use server";
  await query(`DELETE FROM messages_contact WHERE id = $1`, [id]);
  revalidatePath("/admin/messages");
}

export default async function AdminMessagesPage() {
  const user = await getCurrentUser();

  const messages = await query<MessageContact>(`
    SELECT * FROM messages_contact ORDER BY lu ASC, id DESC
  `);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Boîte de Réception des Contacts"
        description="Messages envoyés depuis le formulaire de contact du site public."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-7xl">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-700" />
              <span>Messages Reçus ({messages.length})</span>
            </h2>
          </div>

          <div className="space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`rounded-2xl border p-5 transition-all ${
                  m.lu ? "border-slate-200 bg-white opacity-85" : "border-blue-300 bg-blue-50/40 shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-slate-900">
                      {m.prenom} {m.nom}
                    </span>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {m.destinataire_type}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {m.telephone && (
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        <span>{m.telephone}</span>
                      </span>
                    )}

                    {!m.lu && (
                      <form action={markAsReadAction.bind(null, m.id)}>
                        <button
                          type="submit"
                          className="rounded-lg bg-blue-700 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-blue-800 transition-colors"
                        >
                          Marquer lu
                        </button>
                      </form>
                    )}

                    <form action={deleteMessageAction.bind(null, m.id)}>
                      <button
                        type="submit"
                        className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-800 mb-1">
                  Sujet : {m.sujet}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line bg-white/80 p-3 rounded-xl border border-slate-200/60">
                  {m.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
