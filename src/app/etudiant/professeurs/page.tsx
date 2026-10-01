"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, MessageSquare, Award } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS } from "@/lib/data/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function EtudiantProfesseursPage() {
  const { user } = useCurrentUser();

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
            Équipe Académique
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
            Corps Professoral &amp; Encadrement
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Enseignants-chercheurs et directeurs de départements académiques de Halil Académie Scientifique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {MOCK_PROFESSEURS.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-xl border border-slate-200/90 p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  {/* Avatar académique */}
                  <div className="w-14 h-14 rounded-lg bg-[#0f2744] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 border border-slate-200/90 shadow-xs">
                    <GraduationCap className="w-7 h-7 text-[#e0521c]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-slate-900 truncate">
                        {prof.full_name}
                      </h3>
                      <Badge variant="primary" size="sm" uppercase>
                        Professeur
                      </Badge>
                    </div>

                    <div className="text-[11px] font-semibold text-[#e0521c] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>{prof.specialite}</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Matricule : {prof.matricule}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed bg-[#F8FAFC] p-3.5 rounded-lg border border-slate-100/90">
                    {prof.bio}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500 pt-1">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{prof.email}</span>
                    </div>
                    {prof.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{prof.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100/90 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Permanence étudiants</span>
                <Link href={`/etudiant/messages?dest=${prof.id}&name=${encodeURIComponent(prof.full_name)}`}>
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
      </div>
    </DashboardLayout>
  );
}
