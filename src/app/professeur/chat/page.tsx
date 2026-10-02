"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Users, BookOpen, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { getStoredProfesseurs, getAccessibleSalons } from "@/lib/academicStorage";
import { ChatSalon, Professeur } from "@/lib/types";

export default function ProfesseurChatPage() {
  const [prof, setProf] = useState<Professeur>(() => {
    const list = getStoredProfesseurs();
    return list[0];
  });

  const [salons, setSalons] = useState<ChatSalon[]>([]);
  const [activeSalonId, setActiveSalonId] = useState<string>("general");

  useEffect(() => {
    const update = () => {
      const list = getStoredProfesseurs();
      const current = list[0];
      setProf(current);
      const allowed = getAccessibleSalons("professeur", undefined, undefined, current.classes);
      setSalons(allowed);
    };

    update();
    window.addEventListener("has_academic_storage_updated", update);
    return () => window.removeEventListener("has_academic_storage_updated", update);
  }, []);

  const activeSalon = salons.find((s) => s.id === activeSalonId) || salons[0] || {
    id: "general",
    titre: "Salon Général de l'Académie",
    description: "Échanges en temps réel avec les étudiants et enseignants",
    type: "general",
    created_at: "",
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.specialite || "Enseignant HAS"}
    >
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f2744]/5 text-[#0f2744] text-[11px] font-semibold mb-1.5 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Espace Enseignant • {prof.classes.length} classes suivies</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Salons Académiques &amp; Discussions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Communiquez en direct avec l&apos;ensemble de l&apos;Académie ou avec les classes que vous encadrez.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/90 shrink-0">
            {salons.map((salon) => {
              const isActive = activeSalonId === salon.id;
              return (
                <button
                  key={salon.id}
                  onClick={() => setActiveSalonId(salon.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-white text-[#0f2744] shadow-xs border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  {salon.type === "general" ? (
                    <MessageSquare className="w-3.5 h-3.5 text-[#e0521c]" />
                  ) : salon.type === "niveau" ? (
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                  ) : (
                    <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                  <span>{salon.titre}</span>
                </button>
              );
            })}
          </div>
        </div>

        <ChatRoom
          key={activeSalon.id}
          roomId={activeSalon.id}
          roomTitle={activeSalon.titre}
          roomDescription={activeSalon.description}
          currentUser={{
            id: String(prof.user_id || "2"),
            fullName: prof.full_name,
            role: "professeur",
            email: prof.email,
          }}
          isAdmin={false}
        />
      </div>
    </DashboardLayout>
  );
}
