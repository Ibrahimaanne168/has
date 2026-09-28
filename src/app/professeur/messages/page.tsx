"use client";

import React, { useState } from "react";
import {
  MessageSquare, Inbox, SendHorizontal, Send, CheckCircle2, X,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_STUDENT } from "@/lib/data/mock-data";
import { Message } from "@/lib/types";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurMessagesPage() {
  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replySent, setReplySent] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "prof-msg-1",
      sender_id: MOCK_STUDENT.id,
      receiver_id: CURRENT_PROF.id,
      subject: "Clarification TP n°2 PostgreSQL — Triggers et journalisation",
      content: "Bonjour Monsieur Touré,\n\nConcernant la question 3 du TP sur les triggers de journalisation : devons-nous créer une table d'audit séparée avec SECURITY DEFINER, ou enregistrer directement dans la table principale via un champ updated_by ?\n\nMerci d'avance pour vos précisions.",
      is_read: false,
      parent_id: null,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
      sender: MOCK_STUDENT,
    },
    {
      id: "prof-msg-2",
      sender_id: MOCK_STUDENT.id,
      receiver_id: CURRENT_PROF.id,
      subject: "Demande d'absence excusée — Séance du 18 octobre",
      content: "Bonjour Monsieur,\n\nJe vous contacte pour vous informer de mon absence lors de la séance du 18 octobre en raison d'une convocation médicale urgente. Un certificat médical sera remis au secrétariat dans les meilleurs délais.",
      is_read: true,
      parent_id: null,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      sender: MOCK_STUDENT,
    },
  ]);

  const [sentMessages, setSentMessages] = useState<Message[]>([]);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyContent.trim()) return;

    const reply: Message = {
      id: `reply-${Date.now()}`,
      sender_id: CURRENT_PROF.id,
      receiver_id: selectedMessage.sender_id,
      subject: `Re: ${selectedMessage.subject}`,
      content: replyContent,
      is_read: false,
      parent_id: selectedMessage.id,
      created_at: new Date().toISOString(),
      receiver: selectedMessage.sender,
    };
    setSentMessages((prev) => [reply, ...prev]);
    setMessages((prev) => prev.map((m) => m.id === selectedMessage.id ? { ...m, is_read: true } : m));
    setReplySent(true);
    setReplyContent("");
    setTimeout(() => { setReplySent(false); setReplyOpen(false); }, 2000);
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.specialite || "Enseignant HAS"}
    >
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Messagerie Académique</h1>
          <p className="text-xs text-slate-500 mt-1">Questions et demandes de vos étudiants</p>
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => { setTab("inbox"); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${tab === "inbox" ? "border-[#0f2744] text-[#0f2744]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <Inbox className="w-4 h-4" />
            <span>Réception</span>
            {unreadCount > 0 && (
              <span className="bg-[#e0521c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </button>
          <button
            onClick={() => { setTab("sent"); setSelectedMessage(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${tab === "sent" ? "border-[#0f2744] text-[#0f2744]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Messages envoyés ({sentMessages.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Liste */}
          <div className="lg:col-span-5 space-y-2.5">
            {(tab === "inbox" ? messages : sentMessages).map((msg) => {
              const name = tab === "inbox" ? msg.sender?.full_name : msg.receiver?.full_name;
              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedMessage?.id === msg.id ? "border-[#0f2744] bg-[#0f2744]/5" : "border-slate-200 bg-white hover:border-slate-300"} ${!msg.is_read && tab === "inbox" ? "border-l-4 border-l-[#e0521c]" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-900 truncate">{name || "—"}</span>
                    <span className="text-[10px] text-slate-400 shrink-0">{new Date(msg.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                  </div>
                  <h4 className="text-sm font-serif font-bold text-slate-900 truncate">{msg.subject}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{msg.content}</p>
                </div>
              );
            })}
            {(tab === "inbox" ? messages : sentMessages).length === 0 && (
              <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">
                Aucun message dans cette catégorie.
              </div>
            )}
          </div>

          {/* Détail */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 min-h-[400px] shadow-xs">
            {selectedMessage ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="font-serif text-lg font-bold text-[#0f2744]">{selectedMessage.subject}</h2>
                  <div className="text-xs text-slate-500 mt-1">
                    {tab === "inbox" ? "De" : "À"} : <strong>{tab === "inbox" ? selectedMessage.sender?.full_name : selectedMessage.receiver?.full_name}</strong>
                    {" • "}
                    {new Date(selectedMessage.created_at).toLocaleString("fr-FR", { day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedMessage.content}</div>

                {tab === "inbox" && !replyOpen && (
                  <Button variant="outline" size="sm" onClick={() => setReplyOpen(true)} leftIcon={<Send className="w-3.5 h-3.5" />}>
                    Répondre à cet étudiant
                  </Button>
                )}

                {replyOpen && (
                  <div className="border border-slate-200 rounded-xl p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Votre réponse</span>
                      <button onClick={() => setReplyOpen(false)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {replySent ? (
                      <div className="flex items-center gap-2 text-emerald-700 text-sm"><CheckCircle2 className="w-4 h-4" /> Réponse envoyée !</div>
                    ) : (
                      <form onSubmit={handleSendReply} className="space-y-3">
                        <textarea
                          required
                          rows={4}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Rédigez votre réponse académique..."
                          className="block w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
                        />
                        <Button type="submit" variant="accent" size="sm" rightIcon={<Send className="w-3.5 h-3.5" />}>
                          Envoyer la réponse
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
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
