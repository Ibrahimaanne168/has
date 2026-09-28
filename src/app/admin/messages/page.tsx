"use client";

import React, { useState } from "react";
import {
  MessageSquare, Mail, Phone, User, Clock, Tag, CheckCircle, X,
  Archive, Eye, Send, CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ContactMessage } from "@/lib/types";

const INITIAL_CONTACTS: ContactMessage[] = [
  {
    id: "cm-1", full_name: "Boubacar Diarra", email: "b.diarra@gmail.com",
    phone: "+223 76 12 88 45", subject: "Informations admission Licence 1 ISN",
    message: "Bonjour, je suis bachelier série D et je souhaite m'inscrire en Licence 1 Informatique. Quels sont les prérequis et la date limite de dépôt de dossier ?",
    status: "nouveau", created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: "cm-2", full_name: "Mariam Kouyaté", email: "mkouyate@outlook.com",
    phone: "+223 66 90 34 21", subject: "Coût de la scolarité 2024-2025",
    message: "Bonjour, pourriez-vous m'indiquer le montant des frais d'inscription pour la filière Génie Civil ainsi que les modalités de paiement acceptées ? Je souhaite m'inscrire pour la rentrée prochaine.",
    status: "nouveau", created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: "cm-3", full_name: "Seydou Traoré", email: "seydoutraore45@yahoo.fr",
    phone: null, subject: "Stage de fin d'études — Partenariat entreprise",
    message: "Nous représentons une société de technologies basée à Bamako et souhaitons proposer des stages de fin d'études à vos étudiants en L3 ISN. Comment procéder pour formaliser un accord de partenariat académique ?",
    status: "en_cours", created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: "cm-4", full_name: "Aïssata Bah", email: "aissata.bah@email.com",
    phone: "+223 79 55 10 66", subject: "Récupération de documents officiels",
    message: "Bonjour, j'ai terminé ma formation en Licence 3 en 2023 et j'ai besoin d'une attestation de diplôme certifiée pour une candidature à l'étranger. Quelle est la procédure ?",
    status: "traite", created_at: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

const statusLabel: Record<string, { label: string; variant: "accent" | "warning" | "success" | "neutral" }> = {
  nouveau: { label: "Nouveau", variant: "accent" },
  en_cours: { label: "En traitement", variant: "warning" },
  traite: { label: "Traité", variant: "success" },
  archive: { label: "Archivé", variant: "neutral" },
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(INITIAL_CONTACTS);
  const [selectedMsg, setSelectedMsg] = useState<ContactMessage | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"all" | string>("all");

  const updateStatus = (id: string, status: ContactMessage["status"]) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, status } : m));
    if (selectedMsg?.id === id) setSelectedMsg((prev) => prev ? { ...prev, status } : null);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    setReplySent(true);
    updateStatus(selectedMsg!.id, "traite");
    setReplyContent("");
    setTimeout(() => { setReplySent(false); setReplyOpen(false); }, 2000);
  };

  const filtered = messages.filter((m) => statusFilter === "all" || m.status === statusFilter);

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Messagerie & Formulaires de Contact</h1>
          <p className="text-xs text-slate-500 mt-1">
            Demandes reçues via le formulaire public — {messages.filter((m) => m.status === "nouveau").length} nouveau(x) message(s)
          </p>
        </div>

        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-2">
          {[{ key: "all", label: `Tous (${messages.length})` }, { key: "nouveau", label: `Nouveaux (${messages.filter((m) => m.status === "nouveau").length})` }, { key: "en_cours", label: "En traitement" }, { key: "traite", label: "Traités" }].map((f) => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${statusFilter === f.key ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Layout 2 colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Liste */}
          <div className="lg:col-span-5 space-y-2.5">
            {filtered.map((msg) => {
              const statusInfo = statusLabel[msg.status];
              return (
                <div key={msg.id} onClick={() => { setSelectedMsg(msg); setReplyOpen(false); setReplySent(false); }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMsg?.id === msg.id ? "border-[#0f2744] bg-[#0f2744]/5" : "border-slate-200 bg-white hover:border-slate-300"} ${msg.status === "nouveau" ? "border-l-4 border-l-[#e0521c]" : ""}`}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900">{msg.full_name}</span>
                    <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-900 truncate">{msg.subject}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{msg.message}</p>
                  <div className="text-[10px] text-slate-400 mt-2">{new Date(msg.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              );
            })}
          </div>

          {/* Détail */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 min-h-[460px] shadow-xs flex flex-col">
            {selectedMsg ? (
              <div className="space-y-5 flex-1 flex flex-col">
                {/* En-tête du message */}
                <div className="border-b border-slate-100 pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-lg font-bold text-[#0f2744]">{selectedMsg.subject}</h2>
                    <Badge variant={statusLabel[selectedMsg.status].variant} size="sm">{statusLabel[selectedMsg.status].label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span><strong>{selectedMsg.full_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(selectedMsg.created_at).toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span>{selectedMsg.email}</span>
                    </div>
                    {selectedMsg.phone && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{selectedMsg.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line flex-1">{selectedMsg.message}</p>

                {/* Actions */}
                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {selectedMsg.status === "nouveau" && (
                      <Button variant="secondary" size="sm" onClick={() => updateStatus(selectedMsg.id, "en_cours")} leftIcon={<Tag className="w-3.5 h-3.5" />}>
                        Marquer En traitement
                      </Button>
                    )}
                    {selectedMsg.status !== "traite" && (
                      <Button variant="secondary" size="sm" onClick={() => updateStatus(selectedMsg.id, "traite")} leftIcon={<CheckCircle className="w-3.5 h-3.5" />}>
                        Marquer Traité
                      </Button>
                    )}
                    <Button variant="secondary" size="sm" onClick={() => updateStatus(selectedMsg.id, "archive")} leftIcon={<Archive className="w-3.5 h-3.5" />}>
                      Archiver
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setReplyOpen(!replyOpen)} leftIcon={<Send className="w-3.5 h-3.5" />}>
                      Répondre par email
                    </Button>
                  </div>

                  {replyOpen && (
                    <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                      <div className="text-xs font-semibold text-slate-700">Réponse à : {selectedMsg.email}</div>
                      {replySent ? (
                        <div className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" /> Réponse envoyée via Brevo !</div>
                      ) : (
                        <form onSubmit={handleSendReply} className="space-y-3">
                          <textarea required rows={4} value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Rédigez votre réponse officielle..."
                            className="block w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]" />
                          <div className="flex gap-2">
                            <Button type="submit" variant="accent" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>Envoyer</Button>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setReplyOpen(false)}>Annuler</Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-600">Sélectionnez un message</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
