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
  const [activeSalonId, setActiveSalonId] = useState<string>("salon-l1");

  useEffect(() => {
    const update = () => {
      const list = getStoredProfesseurs();
      const current = list[0];
      setProf(current);
      const allowed = getAccessibleSalons("professeur");
      setSalons(allowed);
    };

    update();
    window.addEventListener("has_academic_storage_updated", update);
    return () => window.removeEventListener("has_academic_storage_updated", update);
  }, []);

  const activeSalon = salons.find((s) => s.id === activeSalonId) || salons[0] || {
    id: "salon-l1",
    titre: "Salon Licence 1 (L1)",
    description: "Échanges et discussions réservés au niveau Licence 1 (L1)",
    type: "niveau",
    created_at: "",
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
    >
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f2744]/5 text-[#0f2744] text-[11px] font-semibold mb-1.5 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Espace Enseignant • Échanges Pédagogiques</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Salons Académiques de Discussion
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Deux salons sont disponibles : un salon pour la Licence 1 (L1) et un pour la Licence 2 (L2).
            </p>
          </div>

          <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/90 shrink-0">
            {salons.map((salon) => {
              const isActive = activeSalonId === salon.id;
              return (
                <button
                  key={salon.id}
                  onClick={() => setActiveSalonId(salon.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? "bg-[#0f2744] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
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
