"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MessagesSquare,
  ShieldCheck,
  Users,
  BookOpen,
  CheckCircle2,
  X,
  Radio,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { getStoredSalons, saveSalon, deleteSalon } from "@/lib/academicStorage";
import { ChatSalon } from "@/lib/types";

export default function AdminChatPage() {
  const [salons, setSalons] = useState<ChatSalon[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<string>("salon-l1");
  const [modalOpen, setModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Formulaire nouveau salon
  const [formTitre, setFormTitre] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formType, setFormType] = useState<"general" | "niveau" | "classe">("niveau");
  const [formNiveau, setFormNiveau] = useState<"L1" | "L2">("L1");
  const [formClasse, setFormClasse] = useState("L1 MPI");

  const loadSalons = () => {
    const list = getStoredSalons();
    setSalons(list);
    if (!list.some((s) => s.id === selectedSalonId) && list.length > 0) {
      setSelectedSalonId(list[0].id);
    }
  };

  useEffect(() => {
    loadSalons();
    window.addEventListener("has_academic_storage_updated", loadSalons);
    return () => window.removeEventListener("has_academic_storage_updated", loadSalons);
  }, [selectedSalonId]);

  const handleCreateSalon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitre.trim()) return;

    const slug = formTitre
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-");
    const newId = `salon-${slug}-${Date.now().toString().slice(-4)}`;

    const newSalon: ChatSalon = {
      id: newId,
      titre: formTitre.trim(),
      description:
        formDesc.trim() ||
        `Salon d'échange ${
          formType === "classe" ? formClasse : formType === "niveau" ? formNiveau : "général"
        }`,
      type: formType,
      niveau: formType === "general" ? null : formNiveau,
      classe: formType === "classe" ? formClasse : null,
      cree_par: "Administration HAS",
      created_at: new Date().toISOString(),
    };

    saveSalon(newSalon);
    setSuccessMsg(`Le salon « ${newSalon.titre} » a été créé avec succès.`);
    setModalOpen(false);
    setSelectedSalonId(newSalon.id);
    setFormTitre("");
    setFormDesc("");

    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteSalon = (id: string, titre: string) => {
    if (id === "salon-l1" || id === "salon-l2" || id === "general") {
      alert("Ce salon principal ne peut pas être supprimé.");
      return;
    }
    if (confirm(`Confirmez-vous la suppression du salon « ${titre} » ?`)) {
      deleteSalon(id);
      setSelectedSalonId("salon-l1");
      setSuccessMsg(`Le salon « ${titre} » a été supprimé.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const activeSalon =
    salons.find((s) => s.id === selectedSalonId) ||
    salons[0] || {
      id: "salon-l1",
      titre: "Salon Licence 1 (L1)",
      description: "Supervision du salon Licence 1 (L1)",
      type: "niveau",
      created_at: "",
    };

  const handleOpenRoom = (salonId: string) => {
    setSelectedSalonId(salonId);
    setIsPopupOpen(true);
  };

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Entête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f2744]/5 text-[#0f2744] text-[11px] font-semibold mb-2 border border-slate-200/90">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Supervision Académique & Modération</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Gestion & Modération des Salons
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Cliquez sur un salon pour ouvrir le chat large façon WhatsApp, écouter les notes vocales
              Telegram et modérer les messages en temps réel.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsPopupOpen(true)}
              leftIcon={<MessagesSquare className="w-4 h-4 text-[#e0521c]" />}
            >
              Ouvrir {activeSalon.titre}
            </Button>
            <Button
              variant="accent"
              size="md"
              onClick={() => setModalOpen(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nouveau salon
            </Button>
          </div>
        </div>

        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Grille des Salons Actifs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {salons.map((s) => {
            const isSelected = selectedSalonId === s.id;
            const isDeletable = s.id !== "general" && s.id !== "salon-l1" && s.id !== "salon-l2";

            return (
              <div
                key={s.id}
                onClick={() => handleOpenRoom(s.id)}
                className={`group cursor-pointer rounded-2xl p-5 transition-all duration-200 border bg-white relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? "border-[#0f2744] shadow-xl ring-2 ring-[#0f2744]/10"
                    : "border-slate-200 hover:border-[#0f2744]/40 hover:shadow-lg"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-[#0f2744] text-white flex items-center justify-center shadow-sm">
                      {s.type === "general" ? (
                        <MessagesSquare className="w-6 h-6 text-[#e0521c]" />
                      ) : s.type === "niveau" ? (
                        <Users className="w-6 h-6 text-blue-400" />
                      ) : (
                        <BookOpen className="w-6 h-6 text-emerald-400" />
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                        <Radio className="w-2.5 h-2.5 text-emerald-500 animate-pulse" />
                        Actif
                      </span>
                      {isDeletable && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSalon(s.id, s.titre);
                          }}
                          title="Supprimer ce salon"
                          className="p-1 text-slate-300 hover:text-red-600 rounded-md transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-[#0f2744] group-hover:text-[#e0521c] transition-colors mb-1 truncate">
                    {s.titre}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                    {s.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    ID: {s.id}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#0f2744] group-hover:text-[#e0521c] transition-colors">
                    <span>Ouvrir chat</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal création de nouveau salon */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-[#0f2744]/10 text-[#0f2744] flex items-center justify-center">
                    <Plus className="w-5 h-5 text-[#e0521c]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                      Créer un Salon de Discussion
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Définissez la portée et les étudiants autorisés
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSalon} className="space-y-4">
                <Input
                  label="Titre du salon"
                  required
                  placeholder="Ex. Groupe d'entraide Algèbre L1, Projet Python..."
                  value={formTitre}
                  onChange={(e) => setFormTitre(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Portée et Accès
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20"
                  >
                    <option value="niveau">Par Niveau (Licence 1 ou 2)</option>
                    <option value="classe">Par Classe Spécifique (L1 MPI, L2 SML...)</option>
                    <option value="general">Ouvert à tous (Général)</option>
                  </select>
                </div>

                {formType === "niveau" && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Niveau Autorisé
                    </label>
                    <select
                      value={formNiveau}
                      onChange={(e) => setFormNiveau(e.target.value as any)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20"
                    >
                      <option value="L1">Licence 1 (L1) uniquement</option>
                      <option value="L2">Licence 2 (L2) uniquement</option>
                    </select>
                  </div>
                )}

                {formType === "classe" && (
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Classe Autorisée
                    </label>
                    <select
                      value={formClasse}
                      onChange={(e) => setFormClasse(e.target.value)}
                      className="w-full text-sm border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0f2744]/20"
                    >
                      <option value="L1 MPI">L1 MPI (Maths, Physique, Info)</option>
                      <option value="L2 MPI">L2 MPI (Maths, Physique, Info)</option>
                      <option value="L1 SML">L1 SML (Sciences de la Mer & Littoral)</option>
                      <option value="L2 SML">L2 SML (Sciences de la Mer & Littoral)</option>
                      <option value="L1 MIASS">L1 MIASS (Maths & Info Appliquées)</option>
                      <option value="L2 MIASS">L2 MIASS (Maths & Info Appliquées)</option>
                    </select>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Description ou objectif du salon
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Ex. Espace d'échange et partage de ressources pédagogiques..."
                    value={formDesc}
                    onChange={(e) => setFormDesc(e.target.value)}
                    className="block w-full rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-2 focus:ring-[#0f2744]/20"
                  />
                </div>

                <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs rounded-lg"
                    onClick={() => setModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    className="text-xs rounded-lg"
                    leftIcon={<Plus className="w-3.5 h-3.5" />}
                  >
                    Créer le salon
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── Grand Pop-up de Chat WhatsApp avec privilèges Modérateur ──────── */}
        {isPopupOpen && (
          <ChatRoom
            key={activeSalon.id}
            roomId={activeSalon.id}
            roomTitle={activeSalon.titre}
            roomDescription={activeSalon.description}
            currentUser={{
              id: "1",
              fullName: "Administration HAS",
              role: "admin",
              email: "admin@has.sn",
            }}
            isAdmin={true}
            isPopup={true}
            isOpen={isPopupOpen}
            onClose={() => setIsPopupOpen(false)}
            salons={salons}
            onSelectSalon={(newId) => setSelectedSalonId(newId)}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
