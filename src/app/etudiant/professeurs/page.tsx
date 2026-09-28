"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GraduationCap, Mail, Phone, BookOpen, MessageSquare, Award } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT, MOCK_PROFESSEURS } from "@/lib/data/mock-data";

export default function EtudiantProfesseursPage() {
  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">
            Corps Professoral & Encadrement
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enseignants-chercheurs et directeurs de départements académiques de Halil Académie Scientifique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_PROFESSEURS.map((prof) => (
            <div
              key={prof.id}
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  {/* Photo / Avatar académique */}
                  <div className="w-16 h-16 rounded-xl bg-[#0f2744] text-white flex items-center justify-center font-serif text-xl font-bold shrink-0 border border-slate-200">
                    <GraduationCap className="w-8 h-8 text-[#e0521c]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-serif text-lg font-bold text-[#0f2744] truncate">
                        {prof.full_name}
                      </h3>
                      <Badge variant="primary" size="sm">
                        Enseignant
                      </Badge>
                    </div>

                    <div className="text-xs font-semibold text-[#e0521c] flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />
                      <span>{prof.specialite}</span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      Matricule : {prof.matricule}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                    {prof.bio}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{prof.email}</span>
                    </div>
                    {prof.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{prof.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">Permanence aux étudiants</span>
                <Link href={`/etudiant/messages?dest=${prof.id}&name=${encodeURIComponent(prof.full_name)}`}>
                  <Button
                    variant="outline"
                    size="sm"
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
