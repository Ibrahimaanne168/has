import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";
import { Topbar } from "@/components/dashboard/Topbar";
import { Communique } from "@/lib/types";
import { Megaphone, Pin, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function EtudiantCommuniquesPage() {
  const user = await getCurrentUser();

  const communiques = await query<Communique>(`
    SELECT c.id, c.titre, c.contenu, c.mis_en_avant,
           TO_CHAR(c.date_publication, 'DD/MM/YYYY') as date_publication,
           u.nom as auteur_nom, u.prenom as auteur_prenom
    FROM communiques c
    JOIN users u ON u.id = c.auteur_id
    WHERE c.archive = FALSE
    ORDER BY c.mis_en_avant DESC, c.id DESC
  `);

  return (
    <div className="flex-1 flex flex-col">
      <Topbar
        title="Annonces & Communiqués Officiels"
        description="Informations importantes de la direction académique."
        user={user!}
      />

      <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
        <div className="space-y-4">
          {communiques.map((c) => (
            <div
              key={c.id}
              className={`rounded-2xl border p-6 bg-white shadow-sm transition-all ${
                c.mis_en_avant ? "border-orange-300 ring-2 ring-orange-500/10" : "border-slate-200"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {c.mis_en_avant && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold text-orange-700">
                      <Pin className="h-3 w-3" />
                      <span>Important</span>
                    </span>
                  )}
                  <h3 className="font-display font-bold text-lg text-slate-900">{c.titre}</h3>
                </div>
                <span className="text-xs text-slate-400 font-medium">{c.date_publication}</span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {c.contenu}
              </p>

              <div className="mt-4 border-t border-slate-100 pt-3 text-[11px] text-slate-400 font-medium">
                Publié par la Direction ({c.auteur_prenom} {c.auteur_nom})
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
