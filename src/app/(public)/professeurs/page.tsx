import Image from "next/image";
import { query } from "@/lib/db";
import { Enseignant } from "@/lib/types";
import { GraduationCap, Mail, Phone, BookOpen, Layers } from "lucide-react";

export const revalidate = 60;

export default async function ProfesseursPage() {
  let enseignants: Enseignant[] = [];

  try {
    enseignants = await query<Enseignant>(`
      SELECT e.id, e.biographie, u.nom, u.prenom, u.login, u.telephone, u.photo,
             STRING_AGG(DISTINCT f.nom, ', ' ORDER BY f.nom) as filieres_noms
      FROM enseignants e
      JOIN users u ON u.id = e.user_id
      LEFT JOIN enseignant_filiere ef ON ef.enseignant_id = e.id
      LEFT JOIN filieres f ON f.id = ef.filiere_id
      GROUP BY e.id, e.biographie, u.nom, u.prenom, u.login, u.telephone, u.photo
      ORDER BY u.nom, u.prenom
    `);

    for (const ens of enseignants) {
      const matieres = await query<{ nom: string }>(`
        SELECT m.nom FROM matieres m
        JOIN enseignant_matiere em ON em.matiere_id = m.id
        WHERE em.enseignant_id = $1
      `, [ens.id]);
      ens.matieres_noms = matieres.map((m) => m.nom).join(", ");
    }
  } catch (e) {
    console.error("Professeurs fetch error:", e);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-orange-600">
          Encadrement Pédagogique
        </span>
        <h1 className="font-display text-4xl font-extrabold text-slate-900 sm:text-5xl">
          Notre Équipe Enseignante
        </h1>
        <p className="text-base text-slate-600">
          Des formateurs passionnés, diplômés et engagés pour vous accompagner vers l'excellence
          académique et professionnelle.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {enseignants.map((ens) => (
          <div
            key={ens.id}
            className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-card hover:shadow-lift hover:border-blue-300 transition-all duration-300"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-2 border-blue-600/20 bg-slate-100 flex-shrink-0">
                  {ens.photo ? (
                    <Image
                      src={ens.photo.startsWith("http") ? ens.photo : `/${ens.photo}`}
                      alt={`${ens.prenom} ${ens.nom}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-blue-50 font-display font-bold text-xl text-blue-700">
                      {ens.prenom[0]}
                      {ens.nom[0]}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-slate-900">
                    {ens.prenom} {ens.nom}
                  </h3>
                  <span className="inline-block mt-1 rounded-md bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                    {ens.filieres_noms || "Filière HAS"}
                  </span>
                </div>
              </div>

              {ens.biographie && (
                <p className="text-sm text-slate-600 leading-relaxed mb-6 italic">
                  "{ens.biographie}"
                </p>
              )}

              {ens.matieres_noms && (
                <div className="space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <BookOpen className="h-3.5 w-3.5 text-blue-600" />
                    <span>Matières enseignées</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">
                    {ens.matieres_noms}
                  </p>
                </div>
              )}
            </div>

            {ens.telephone && (
              <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{ens.telephone}</span>
                </span>
                <span className="text-emerald-600 font-semibold">Actif</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
