"use client";

import React, { useState, useEffect } from "react";
import { MessageSquare, Users, BookOpen, ShieldAlert, Hash, Sparkles } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getAccessibleSalons } from "@/lib/academicStorage";
import { ChatSalon } from "@/lib/types";

export default function EtudiantChatPage() {
  const { user } = useCurrentUser();
  const niveau = user.classe?.niveau || "L1";
  const classeCode = user.classe?.code || "L1-MPI";
  const classeName = user.classe?.name || "L1 MPI";

  const [salons, setSalons] = useState<ChatSalon[]>([]);
  const [activeSalonId, setActiveSalonId] = useState<string>("general");

  useEffect(() => {
    const updateSalons = () => {
      const allowed = getAccessibleSalons("etudiant", niveau, classeCode);
      setSalons(allowed);
      if (!allowed.some((s) => s.id === activeSalonId) && allowed.length > 0) {
        setActiveSalonId(allowed[0].id);
      }
    };

    updateSalons();
    window.addEventListener("has_academic_storage_updated", updateSalons);
    return () => window.removeEventListener("has_academic_storage_updated", updateSalons);
  }, [niveau, classeCode, activeSalonId]);

  const activeSalon = salons.find((s) => s.id === activeSalonId) || salons[0] || {
    id: "general",
    titre: "Salon Général de l'Académie",
    description: "Canal temps réel ouvert aux membres de Halil Académie Scientifique",
    type: "general",
    created_at: "",
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
    >
      <div className="space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#0f2744]/5 text-[#0f2744] text-[11px] font-semibold mb-1.5 border border-slate-200">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Accès réservé • Niveau {niveau} — {classeCode}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Salons de Discussion en Direct
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Vous avez accès exclusivement au salon général et aux espaces de votre promotion ({niveau}) et classe ({classeCode}).
            </p>
          </div>

          {/* Onglets de sélection des salons autorisés */}
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

        {/* Notice d'accès sécurisé HAS */}
        <div className="bg-blue-50/60 border border-blue-200/70 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>
              Salon connecté : <strong>{activeSalon.titre}</strong> — Accès vérifié pour {user.full_name} ({niveau} - {classeName})
            </span>
          </div>
          <span className="text-[11px] text-blue-700/80 font-mono hidden sm:inline">
            Filtre strict étudiant actif
          </span>
        </div>

        {/* Composant ChatRoom */}
        <ChatRoom
          key={activeSalon.id}
          roomId={activeSalon.id}
          roomTitle={activeSalon.titre}
          roomDescription={activeSalon.description}
          currentUser={{
            id: user.id,
            fullName: user.full_name,
            role: "etudiant",
            email: user.email,
          }}
          isAdmin={false}
        />
      </div>
    </DashboardLayout>
  );
}
