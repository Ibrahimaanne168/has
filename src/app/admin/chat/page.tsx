"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default function AdminChatPage() {
  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-4">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Supervision Temps Réel</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Modération du Chat Général</h1>
          <p className="text-xs text-slate-500 mt-1">
            Supervision et modération du salon temps réel — passez la souris sur un message pour afficher le bouton de suppression
          </p>
        </div>
        <ChatRoom
          currentUser={{ id: "admin-id", fullName: "Administration HAS", role: "admin" }}
          isAdmin={true}
        />
      </div>
    </DashboardLayout>
  );
}
