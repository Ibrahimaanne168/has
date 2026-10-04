"use client";

import React, { useState, useEffect } from "react";
import {
  MessageSquare,
  Inbox,
  SendHorizontal,
  Send,
  CheckCircle2,
  X,
  User,
  GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  getStoredProfesseurs,
  getStoredDirectMessages,
  saveDirectMessage,
  markDirectMessageRead,
} from "@/lib/academicStorage";
import { Message, Professeur } from "@/lib/types";

export default function ProfesseurMessagesPage() {
  const [prof, setProf] = useState<Professeur>(() => {
    const list = getStoredProfesseurs();
    return list[0];
  });

  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replySent, setReplySent] = useState(false);

  const loadData = () => {
    const profs = getStoredProfesseurs();
    const current = profs[0];
    setProf(current);
    const msgs = getStoredDirectMessages();
    setAllMessages(msgs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("has_academic_storage_updated", loadData);
    return () => window.removeEventListener("has_academic_storage_updated", loadData);
  }, []);

  // Messages reçus par ce professeur
  const inboxMessages = allMessages.filter(
    (m) =>
      m.receiver_id === prof.id ||
      m.receiver_id === prof.email ||
      m.receiver_id === String(prof.user_id)
  );

  // Messages envoyés par ce professeur
  const sentMessages = allMessages.filter(
    (m) =>
      m.sender_id === prof.id ||
      m.sender_id === prof.email ||
      m.sender_id === String(prof.user_id)
  );

  const displayedList = tab === "inbox" ? inboxMessages : sentMessages;
  const unreadCount = inboxMessages.filter((m) => !m.is_read).length;

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (tab === "inbox" && !msg.is_read) {
      markDirectMessageRead(msg.id);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || !replyContent.trim()) return;

    const reply: Message = {
      id: `reply-${Date.now()}`,
      sender_id: prof.id,
      receiver_id: selectedMessage.sender_id,
      subject: `Re: ${selectedMessage.subject}`,
      content: replyContent.trim(),
      is_read: false,
      parent_id: selectedMessage.id,
      created_at: new Date().toISOString(),
      sender: {
        id: prof.id,
        full_name: prof.full_name,
        role: "professeur",
        email: prof.email,
        username: prof.username || null,
        phone: prof.phone,
        matricule: prof.matricule,
        filiere_id: null,
        classe_id: null,
        bio: prof.bio,
        specialite: prof.specialite,
        avatar_url: prof.avatar_url || null,
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      receiver: selectedMessage.sender,
    };

    saveDirectMessage(reply);
    setReplySent(true);
    setReplyContent("");

    setTimeout(() => {
      setReplySent(false);
      setReplyOpen(false);
    }, 1800);
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
    >
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
            Messagerie Interne
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
            Messagerie Académique Étudiants
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Questions, demandes d&apos;éclaircissements et permanences des étudiants de vos classes
          </p>
        </div>

        <div className="flex gap-2 border-b border-slate-200">
          <button
            onClick={() => {
              setTab("inbox");
              setSelectedMessage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === "inbox"
                ? "border-[#0f2744] text-[#0f2744]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Boîte de Réception</span>
            {unreadCount > 0 && (
              <span className="bg-[#e0521c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => {
              setTab("sent");
              setSelectedMessage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === "sent"
                ? "border-[#0f2744] text-[#0f2744]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Messages envoyés ({sentMessages.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Liste des messages */}
          <div className="lg:col-span-5 space-y-2.5">
            {displayedList.length === 0 ? (
              <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-serif text-sm font-bold text-slate-800">
                  {tab === "inbox" ? "Aucun message reçu" : "Aucun message envoyé"}
                </p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  {tab === "inbox"
                    ? "Vous n'avez aucune question étudiante en attente pour le moment."
                    : "Vous n'avez envoyé aucune réponse pour l'instant."}
                </p>
              </div>
            ) : (
              displayedList.map((msg) => {
                const name =
                  tab === "inbox"
                    ? msg.sender?.full_name || "Étudiant HAS"
                    : msg.receiver?.full_name || "Destinataire";
                const isSelected = selectedMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#0f2744] bg-[#0f2744]/5"
                        : "border-slate-200/90 bg-white hover:border-slate-300"
                    } ${!msg.is_read && tab === "inbox" ? "border-l-4 border-l-[#e0521c] font-semibold" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {name}
                      </span>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>
                    <h4 className="text-sm font-serif font-bold text-slate-900 truncate">
                      {msg.subject}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                      {msg.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Détail du message sélectionné */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-6 min-h-[400px] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            {selectedMessage ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="font-serif text-lg font-bold text-[#0f2744]">
                    {selectedMessage.subject}
                  </h2>
                  <div className="text-xs text-slate-500 mt-1">
                    {tab === "inbox" ? "De" : "À"} :{" "}
                    <strong>
                      {tab === "inbox"
                        ? selectedMessage.sender?.full_name
                        : selectedMessage.receiver?.full_name}
                    </strong>
                    {" • "}
                    {new Date(selectedMessage.created_at).toLocaleString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {selectedMessage.content}
                </div>

                {tab === "inbox" && !replyOpen && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setReplyOpen(true)}
                    leftIcon={<Send className="w-3.5 h-3.5" />}
                  >
                    Répondre à cet étudiant
                  </Button>
                )}

                {replyOpen && (
                  <div className="border border-slate-200/90 rounded-xl p-4 space-y-3 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Votre réponse académique</span>
                      <button
                        onClick={() => setReplyOpen(false)}
                        className="text-slate-400 hover:text-slate-700"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {replySent ? (
                      <div className="flex items-center gap-2 text-emerald-700 text-sm py-2">
                        <CheckCircle2 className="w-4 h-4" /> Réponse transmise avec succès !
                      </div>
                    ) : (
                      <form onSubmit={handleSendReply} className="space-y-3">
                        <textarea
                          required
                          rows={4}
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Rédigez vos explications ou consignes pour l'étudiant..."
                          className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
                        />
                        <Button
                          type="submit"
                          variant="accent"
                          size="sm"
                          rightIcon={<Send className="w-3.5 h-3.5" />}
                        >
                          Envoyer la réponse
                        </Button>
                      </form>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[300px]">
                <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-600">Sélectionnez un message</p>
                <p className="text-xs text-slate-400 mt-1">
                  Les messages envoyés par vos étudiants apparaîtront ici
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
