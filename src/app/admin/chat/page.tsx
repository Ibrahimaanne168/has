"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  MessagesSquare,
  ShieldCheck,
  Hash,
  Users,
  BookOpen,
  CheckCircle2,
  X,
  Layers,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { getStoredSalons, saveSalon, deleteSalon } from "@/lib/academicStorage";
import { ChatSalon } from "@/lib/types";

export default function AdminChatPage() {
  const [salons, setSalons] = useState<ChatSalon[]>([]);
  const [selectedSalonId, setSelectedSalonId] = useState<string>("general");
  const [modalOpen, setModalOpen] = useState(false);
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
      description: formDesc.trim() || `Salon d'échange ${formType === "classe" ? formClasse : formType === "niveau" ? formNiveau : "général"}`,
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
    if (id === "general") {
      alert("Le salon général ne peut pas être supprimé.");
      return;
    }
    if (confirm(`Confirmez-vous la suppression du salon « ${titre} » ?`)) {
      deleteSalon(id);
      setSelectedSalonId("general");
      setSuccessMsg(`Le salon « ${titre} » a été supprimé.`);
      setTimeout(() => setSuccessMsg(null), 3500);
    }
  };

  const activeSalon =
    salons.find((s) => s.id === selectedSalonId) ||
    salons[0] || {
      id: "general",
      titre: "Salon Général de l'Académie",
      description: "Supervision du salon général",
      type: "general",
      created_at: "",
    };

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="Directeur Général"
    >
      <div className="space-y-6">
        {/* Entête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Supervision & Communauté
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Gestion & Modération des Salons
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Supervision temps réel, création de nouveaux salons et modération des échanges académiques
            </p>
          </div>

          <Button
            variant="accent"
            size="md"
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Créer un nouveau salon
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/90 text-emerald-800 text-sm flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Barre de navigation des salons */}
        <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Salons Actifs ({salons.length})
            </span>
            <span className="text-[11px] text-slate-400">
              L&apos;administrateur accède à tous les canaux
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {salons.map((s) => {
              const isActive = selectedSalonId === s.id;
              const isDeletable = s.id !== "general" && s.id !== "niveau-l1" && s.id !== "niveau-l2";

              return (
                <div key={s.id} className="relative group inline-flex items-center">
                  <button
                    onClick={() => setSelectedSalonId(s.id)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? "bg-[#0f2744] text-white shadow-xs"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80"
                    }`}
                  >
                    {s.type === "general" ? (
                      <MessagesSquare className="w-3.5 h-3.5 text-[#e0521c]" />
                    ) : s.type === "niveau" ? (
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                    ) : (
                      <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                    <span>{s.titre}</span>
                  </button>

                  {isDeletable && (
                    <button
                      onClick={() => handleDeleteSalon(s.id, s.titre)}
                      title="Supprimer ce salon"
                      className="ml-1 p-1 text-slate-300 hover:text-red-600 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Espace de discussion / modération */}
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
        />

        {/* Modal création de nouveau salon */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0f2744]/10 text-[#0f2744] flex items-center justify-center">
                    <Plus className="w-4 h-4 text-[#e0521c]" />
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
                  className="p-1 text-slate-400 hover:text-slate-700 rounded-md"
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
                    className="w-full text-sm border border-slate-200/90 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
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
                      className="w-full text-sm border border-slate-200/90 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
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
                      className="w-full text-sm border border-slate-200/90 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
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
                    className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
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
      </div>
    </DashboardLayout>
  );
}
