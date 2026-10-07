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

const INITIAL_CONTACTS: ContactMessage[] = [];

const statusLabel: Record<string, { label: string; variant: "accent" | "warning" | "success" | "neutral" }> = {
  nouveau: { label: "Nouveau", variant: "accent" },
  en_cours: { label: "En traitement", variant: "warning" },
  traite: { label: "Traité", variant: "success" },
  archive: { label: "Archivé", variant: "neutral" },
};

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    if (typeof window === "undefined") return INITIAL_CONTACTS;
    try {
      const stored = localStorage.getItem("has_contact_messages_v1");
      return stored ? JSON.parse(stored) : INITIAL_CONTACTS;
    } catch {
      return INITIAL_CONTACTS;
    }
  });
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
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Administration</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">Messagerie &amp; Formulaires de Contact</h1>
          <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
            Demandes reçues via le formulaire public — {messages.filter((m) => m.status === "nouveau").length} nouveau(x) message(s)
          </p>
        </div>

        {/* Filtres par statut */}
        <div className="flex flex-wrap gap-2">
          {[{ key: "all", label: `Tous (${messages.length})` }, { key: "nouveau", label: `Nouveaux (${messages.filter((m) => m.status === "nouveau").length})` }, { key: "en_cours", label: "En traitement" }, { key: "traite", label: "Traités" }].map((f) => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                statusFilter === f.key
                  ? "bg-[#0f2744] dark:bg-[#e0521c] text-white border-[#0f2744] dark:border-[#e0521c]"
                  : "bg-white dark:bg-[#111821] text-slate-600 dark:text-[#AAB4C0] border-slate-200/90 dark:border-[#263241] hover:bg-slate-50 dark:hover:bg-[#151D27]"
              }`}>
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
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selectedMsg?.id === msg.id
                      ? "border-[#0f2744] dark:border-[#e0521c] bg-[#0f2744]/5 dark:bg-[#151D27]"
                      : "border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#111821] hover:border-slate-300 dark:hover:border-[#38495d]"
                  } ${msg.status === "nouveau" ? "border-l-4 border-l-[#e0521c]" : ""}`}>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA]">{msg.full_name}</span>
                    <Badge variant={statusInfo.variant} size="sm">{statusInfo.label}</Badge>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-[#F5F7FA] truncate">{msg.subject}</h4>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] line-clamp-1 mt-0.5">{msg.message}</p>
                  <div className="text-[10px] text-slate-400 dark:text-[#687585] mt-2">{new Date(msg.created_at).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</div>
                </div>
              );
            })}
          </div>

          {/* Détail */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-6 min-h-[460px] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] flex flex-col">
            {selectedMsg ? (
              <div className="space-y-5 flex-1 flex flex-col">
                {/* En-tête du message */}
                <div className="border-b border-slate-100 dark:border-[#263241] pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">{selectedMsg.subject}</h2>
                    <Badge variant={statusLabel[selectedMsg.status].variant} size="sm">{statusLabel[selectedMsg.status].label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-[#AAB4C0]">
                      <User className="w-3.5 h-3.5 text-slate-400 dark:text-[#687585]" />
                      <span><strong className="text-slate-900 dark:text-[#F5F7FA]">{selectedMsg.full_name}</strong></span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-[#AAB4C0]">
                      <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-[#687585]" />
                      <span>{new Date(selectedMsg.created_at).toLocaleString("fr-FR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 dark:text-[#AAB4C0]">
                      <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-[#687585]" />
                      <span>{selectedMsg.email}</span>
                    </div>
                    {selectedMsg.phone && (
                      <div className="flex items-center gap-2 text-slate-600 dark:text-[#AAB4C0]">
                        <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-[#687585]" />
                        <span>{selectedMsg.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-700 dark:text-[#F5F7FA] leading-relaxed whitespace-pre-line flex-1">{selectedMsg.message}</p>

                {/* Actions */}
                <div className="border-t border-slate-100 dark:border-[#263241] pt-4 space-y-3">
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
                    <div className="border border-slate-200/90 dark:border-[#263241] rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-[#151D27]">
                      <div className="text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">Réponse à : {selectedMsg.email}</div>
                      {replySent ? (
                        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 text-sm"><CheckCircle2 className="w-4 h-4" /> Réponse envoyée via Brevo !</div>
                      ) : (
                        <form onSubmit={handleSendReply} className="space-y-3">
                          <textarea required rows={4} value={replyContent} onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Rédigez votre réponse officielle..."
                            className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#111821] p-3 text-sm text-slate-900 dark:text-[#F5F7FA] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]" />
                          <div className="border-t border-slate-100 dark:border-[#263241] pt-3 flex justify-end gap-2">
                            <Button type="button" variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setReplyOpen(false)}>Annuler</Button>
                            <Button type="submit" variant="accent" size="sm" className="rounded-lg text-xs" rightIcon={<Send className="w-3.5 h-3.5" />}>Envoyer</Button>
                          </div>
                        </form>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400 dark:text-[#687585] p-8 text-center">
                <MessageSquare className="w-12 h-12 text-slate-200 dark:text-[#263241] mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-[#AAB4C0]">Sélectionnez un message</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
