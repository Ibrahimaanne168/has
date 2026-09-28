"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { MOCK_PROFESSEURS } from "@/lib/data/mock-data";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurChatPage() {
  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.specialite || "Enseignant HAS"}
    >
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Chat Général de l&apos;Académie</h1>
          <p className="text-xs text-slate-500 mt-1">
            Salon d&apos;échanges en temps réel avec l&apos;ensemble de la communauté Halil Académie Scientifique
          </p>
        </div>
        <ChatRoom
          currentUser={{ id: CURRENT_PROF.id, fullName: CURRENT_PROF.full_name, role: "professeur" }}
          isAdmin={false}
        />
      </div>
    </DashboardLayout>
  );
}
