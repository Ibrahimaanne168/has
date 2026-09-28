"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";

export default function AdminChatPage() {
  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Modération du Chat Général</h1>
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
