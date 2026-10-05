"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Users,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Radio,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getAccessibleSalons } from "@/lib/academicStorage";
import { ChatSalon } from "@/lib/types";

export default function EtudiantChatPage() {
  const { user } = useCurrentUser();
  const niveau = user.classe?.niveau || "L1";

  const [salons, setSalons] = useState<ChatSalon[]>([]);
  const [activeSalonId, setActiveSalonId] = useState<string>("salon-l1");
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    const updateSalons = () => {
      const allowed = getAccessibleSalons("etudiant", niveau);
      setSalons(allowed);
      if (!allowed.some((s) => s.id === activeSalonId) && allowed.length > 0) {
        setActiveSalonId(allowed[0].id);
      }
    };

    updateSalons();
    window.addEventListener("has_academic_storage_updated", updateSalons);
    return () => window.removeEventListener("has_academic_storage_updated", updateSalons);
  }, [niveau, activeSalonId]);

  const activeSalon =
    salons.find((s) => s.id === activeSalonId) ||
    salons[0] || {
      id: "salon-l1",
      titre: "Salon Licence 1 (L1)",
      description: "Échanges et discussions réservés au niveau Licence 1 (L1)",
      type: "niveau",
      created_at: "",
    };

  const handleOpenRoom = (salonId: string) => {
    setActiveSalonId(salonId);
    setIsPopupOpen(true);
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Entête de page */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2744]/5 text-[#0f2744] text-[11px] font-semibold mb-2 border border-slate-200/90">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Espace d&apos;Échanges Universitaire HAS</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Salons de Discussion en Direct
            </h1>

          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2744] text-white text-xs font-bold shadow-md hover:bg-[#163860] transition-all active:scale-95"
            >
              <MessageSquare className="w-4 h-4 text-[#e0521c]" />
              <span>Ouvrir {activeSalon.titre}</span>
            </button>
          </div>
        </div>

        {/* Grille des Salons : L'utilisateur clique sur une room pour afficher le popup WhatsApp */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {salons.map((salon) => {
            const isL1 = salon.id.includes("l1");
            const isSelected = activeSalonId === salon.id;

            return (
              <div
                key={salon.id}
                onClick={() => handleOpenRoom(salon.id)}
                className={`group cursor-pointer rounded-2xl p-6 transition-all duration-200 border bg-white relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-[#0f2744] shadow-xl ring-2 ring-[#0f2744]/10"
                    : "border-slate-200 hover:border-[#0f2744]/40 hover:shadow-lg"
                }`}
              >
                {/* Liseré haut coloré */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isL1
                      ? "bg-gradient-to-r from-[#0f2744] via-[#2563eb] to-[#e0521c]"
                      : "bg-gradient-to-r from-[#e0521c] via-[#ea580c] to-[#0f2744]"
                  }`}
                />

                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    {/* Icône du salon avec ondulations concentriques */}
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${
                          isL1 ? "bg-[#0f2744]" : "bg-[#e0521c]"
                        }`}
                      >
                        <Users className="w-7 h-7" />
                      </div>
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white animate-pulse" />
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
                        En direct
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {salon.id}
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-[#0f2744] group-hover:text-[#e0521c] transition-colors mb-2">
                    {salon.titre}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {salon.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 pt-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      Canal vérifié
                    </span>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 text-slate-600">
                      Niveau {salon.niveau || (isL1 ? "L1" : "L2")}
                    </span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-900 transition-colors">
                    {salon.description}
                  </span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 group-hover:bg-[#0f2744] text-slate-700 group-hover:text-white transition-all text-xs font-bold shadow-xs">
                    <span>Entrer</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>



        {/* ─── Grand Pop-up de Chat façon WhatsApp ──────────────────────────── */}
        {isPopupOpen && (
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
            isPopup={true}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            salons={salons}
            onSelectSalon={(newId) => setActiveSalonId(newId)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
