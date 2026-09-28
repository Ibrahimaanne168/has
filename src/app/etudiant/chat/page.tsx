"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { MOCK_STUDENT } from "@/lib/data/mock-data";

export default function EtudiantChatPage() {
  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">
            Chat Général de l&apos;Académie
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Espace de discussion instantané ouvert à toute la communauté Halil Académie Scientifique
          </p>
        </div>

        <ChatRoom
          currentUser={{
            id: MOCK_STUDENT.id,
            fullName: MOCK_STUDENT.full_name,
            role: "etudiant",
          }}
          isAdmin={false}
        />
      </div>
    </DashboardLayout>
  );
}
