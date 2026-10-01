"use client";

import React, { useState } from "react";
import { MessageSquare, Users, Sparkles, BookOpen } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { useCurrentUser } from "@/lib/useCurrentUser";

export default function EtudiantChatPage() {
  const { user } = useCurrentUser();
  const niveau = user.classe?.niveau || "L1";
  const [activeTab, setActiveTab] = useState<"general" | "niveau">("general");

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
    >
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Échanges & Communauté
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Salons de Discussion en Direct
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Échangez avec l&apos;ensemble de l&apos;Académie ou directement avec les étudiants de votre niveau ({niveau})
            </p>
          </div>

          {/* Onglets de sélection du salon */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 shrink-0 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "general"
                  ? "bg-white text-[#0f2744] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Salon Général HAS</span>
            </button>

            <button
              onClick={() => setActiveTab("niveau")}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === "niveau"
                  ? "bg-white text-[#0f2744] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-600" />
              <span>Groupe {niveau} ({user.classe?.code || `${niveau}-MPI`})</span>
            </button>
          </div>
        </div>

        {activeTab === "general" ? (
          <ChatRoom
            key="general"
            roomId="general"
            roomTitle="Salon Général de l'Académie"
            currentUser={{
              id: user.id,
              fullName: user.full_name,
              role: "etudiant",
            }}
            isAdmin={false}
          />
        ) : (
          <ChatRoom
            key={`niveau-${niveau}`}
            roomId={`groupe-${niveau.toLowerCase()}`}
            roomTitle={`Groupe d'Échange ${niveau} — Étudiants de Licence ${niveau === "L1" ? "1" : "2"}`}
            currentUser={{
              id: user.id,
              fullName: user.full_name,
              role: "etudiant",
            }}
            isAdmin={false}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
