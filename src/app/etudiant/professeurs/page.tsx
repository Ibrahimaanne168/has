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
  CheckCircle2,
  Users,
  Sparkles,
  Filter,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredProfesseurs, getAccessibleProfesseurs } from "@/lib/academicStorage";
import { Professeur } from "@/lib/types";

export default function EtudiantProfesseursPage() {
  const { user } = useCurrentUser();
  const niveau = user.classe?.niveau || "L1";
  const classeCode = user.classe?.code || "L1-MPI";
  const classeName = user.classe?.name || "L1 MPI";

  const [allProfs, setAllProfs] = useState<Professeur[]>([]);
  const [filterMode, setFilterMode] = useState<"mes_profs" | "tous">("mes_profs");

  const loadProfs = () => {
    setAllProfs(getStoredProfesseurs());
  };

  useEffect(() => {
    loadProfs();
    window.addEventListener("has_academic_storage_updated", loadProfs);
    return () => window.removeEventListener("has_academic_storage_updated", loadProfs);
  }, []);

  const accessibleProfs = getAccessibleProfesseurs(niveau, classeCode);
  const displayedProfs = filterMode === "mes_profs" ? accessibleProfs : allProfs;

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        {/* Entête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f2744]/5 text-[#0f2744] text-[11px] font-semibold mb-1 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Votre promotion : {classeName} ({niveau})</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Corps Professoral &amp; Encadrement
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Enseignants-chercheurs et directeurs de départements intervenant dans votre formation
            </p>
          </div>

          {/* Filtre : Mes profs vs Tout le corps professoral */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setFilterMode("mes_profs")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === "mes_profs"
                  ? "bg-white text-[#0f2744] shadow-xs border border-slate-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Mes Professeurs ({classeCode})</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800">
                {accessibleProfs.length}
              </span>
            </button>

            <button
              onClick={() => setFilterMode("tous")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterMode === "tous"
                  ? "bg-white text-[#0f2744] shadow-xs border border-slate-200/80 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Tout HAS</span>
              <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 text-slate-700">
                {allProfs.length}
              </span>
            </button>
          </div>
        </div>

        {/* Message d'information sur les permissions de l'étudiant */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 text-xs text-slate-600 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#e0521c] shrink-0" />
            <span>
              {filterMode === "mes_profs"
                ? `Affichage restreint aux ${accessibleProfs.length} enseignants assurant les cours et TD de votre classe (${classeName}).`
                : `Consultation étendue à l'ensemble du personnel enseignant (${allProfs.length} professeurs).`}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
            HAS Académique
          </span>
        </div>

        {/* Grille des professeurs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {displayedProfs.map((prof) => {
            const isMyDirectProf = accessibleProfs.some((p) => p.id === prof.id);

            return (
              <div
                key={prof.id}
                className={`bg-white rounded-xl border p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
                  isMyDirectProf ? "border-[#0f2744]/25 ring-1 ring-[#0f2744]/10" : "border-slate-200/90"
                }`}
              >
                <div>
                  {/* Profil prof */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-[#0f2744] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 border border-slate-200/90 shadow-xs overflow-hidden">
                      {prof.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={prof.photo}
                          alt={prof.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <GraduationCap className="w-7 h-7 text-[#e0521c]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 truncate">
                          {prof.full_name}
                        </h3>
                        {isMyDirectProf && (
                          <Badge variant="success" size="sm">
                            Votre Enseignant
                          </Badge>
                        )}
                      </div>

                      <div className="text-[11px] font-semibold text-[#e0521c] flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{prof.specialite}</span>
                      </div>

                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        Matricule : {prof.matricule}
                      </div>
                    </div>
                  </div>

                  {/* Biographie */}
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-100/90 mb-4">
                    {prof.bio}
                  </p>

                  {/* Matières enseignées avec niveaux et classes */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#0f2744]">
                      <BookOpen className="w-3.5 h-3.5 text-[#e0521c]" />
                      <span>Matières enseignées ({prof.matieres?.length || 0}) :</span>
                    </div>

                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {prof.matieres && prof.matieres.length > 0 ? (
                        prof.matieres.map((m, idx) => {
                          const isRelevantToStudent =
                            m.niveau.toUpperCase() === niveau.toUpperCase() &&
                            m.classes?.some((c) =>
                              c.toUpperCase().includes(classeCode.toUpperCase().replace("-", " ")) ||
                              classeCode.toUpperCase().includes(c.toUpperCase())
                            );

                          return (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 transition-colors ${
                                isRelevantToStudent
                                  ? "bg-amber-50/50 border-amber-200/80 text-amber-950 font-medium"
                                  : "bg-slate-50 border-slate-200/60 text-slate-700"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[#0f2744]">
                                  {m.niveau}
                                </span>
                                <span className="font-semibold text-slate-900">{m.nom}</span>
                                {isRelevantToStudent && (
                                  <span className="text-[10px] font-bold text-[#e0521c] bg-[#e0521c]/10 px-1.5 py-0.2 rounded">
                                    Au programme
                                  </span>
                                )}
                              </div>

                              <div className="flex flex-wrap items-center gap-1">
                                {m.classes?.map((c, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200 font-mono"
                                  >
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="text-xs text-slate-400 italic">
                          Matières en cours d&apos;attribution par l&apos;administration.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Coordonnées réelles */}
                  <div className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="font-mono text-slate-700">{prof.email}</span>
                    </div>
                    {prof.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-mono text-slate-700">{prof.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer action */}
                <div className="mt-5 pt-4 border-t border-slate-100/90 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {prof.niveaux?.join(" & ") || "Licence"} • {prof.classes?.length || 0} classes
                  </span>
                  <Link
                    href={`/etudiant/messages?dest=${prof.id}&name=${encodeURIComponent(
                      prof.full_name
                    )}`}
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
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
