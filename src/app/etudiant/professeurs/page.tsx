"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Mail,
  Phone,
  MessageSquare,
  Award,
  BookOpen,
  Users,
  Search,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredProfesseurs } from "@/lib/academicStorage";
import { Professeur } from "@/lib/types";

export default function EtudiantProfesseursPage() {
  const { user } = useCurrentUser();
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [search, setSearch] = useState("");

  const load = () => setProfs(getStoredProfesseurs());

  useEffect(() => {
    load();
    window.addEventListener("has_academic_storage_updated", load);
    return () => window.removeEventListener("has_academic_storage_updated", load);
  }, []);

  // Recherche par nom ou spécialité
  const displayed = profs.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      p.full_name.toLowerCase().includes(q) ||
      (p.specialite || "").toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Corps Professoral
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#e0521c]" />
              {profs.length} enseignant{profs.length !== 1 ? "s" : ""} — HAS Académie Scientifique
            </p>
          </div>

          {/* Barre de recherche */}
          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher un enseignant…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2744]/30"
            />
          </div>
        </div>

        {/* Grille */}
        {displayed.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <GraduationCap className="w-10 h-10 mx-auto mb-3 text-slate-200" />
            <p className="text-sm font-semibold">Aucun enseignant trouvé</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {displayed.map((prof) => (
              <div
                key={prof.id}
                className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between hover:shadow-md transition-all duration-200"
              >
                <div>
                  {/* Avatar + identité */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-[#0f2744] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 shadow-xs overflow-hidden">
                      {prof.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={prof.photo} alt={prof.full_name} className="w-full h-full object-cover" />
                      ) : (
                        <GraduationCap className="w-7 h-7 text-[#e0521c]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 truncate">
                        {prof.full_name}
                      </h3>
                      {prof.specialite && (
                        <div className="text-[11px] font-semibold text-[#e0521c] flex items-center gap-1 mt-0.5">
                          <Award className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{prof.specialite}</span>
                        </div>
                      )}
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        {prof.matricule}
                      </div>
                    </div>
                  </div>

                  {/* Biographie */}
                  {prof.bio && (
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100 mb-4">
                      {prof.bio}
                    </p>
                  )}

                  {/* Matières enseignées (noms seulement, sans compteur) */}
                  {prof.matieres && prof.matieres.length > 0 && (
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f2744] mb-2">
                        <BookOpen className="w-3.5 h-3.5 text-[#e0521c]" />
                        <span>Matières enseignées</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {prof.matieres.map((m, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#0f2744]/5 border border-[#0f2744]/10 text-[10px] font-semibold text-[#0f2744]"
                          >
                            <span className="font-mono text-[#e0521c]">{m.niveau}</span>
                            {m.nom}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Coordonnées (téléphone seulement, pas d'email) */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    {prof.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700">{prof.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-end">
                  <Link
                    href={`/etudiant/messages?dest=${prof.id}&name=${encodeURIComponent(prof.full_name)}`}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-200/90 text-xs rounded-lg"
                      leftIcon={<MessageSquare className="w-3.5 h-3.5 text-[#0f2744]" />}
                    >
                      Envoyer un message
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
