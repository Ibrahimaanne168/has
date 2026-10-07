"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  MessageSquare,
  Send,
  User,
  Inbox,
  SendHorizontal,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useCurrentUser } from "@/lib/useCurrentUser";
import {
  getStoredDirectMessages,
  saveDirectMessage,
  markDirectMessageRead,
  getAccessibleProfesseurs,
} from "@/lib/academicStorage";
import { Message, Professeur } from "@/lib/types";

function EtudiantMessagesContent() {
  const { user } = useCurrentUser();
  const searchParams = useSearchParams();
  const preDestId = searchParams.get("dest");
  const preDestName = searchParams.get("name");

  const niveau = user.classe?.niveau || "L1";
  const classeCode = user.classe?.code || "L1-MPI";

  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const [accessibleProfs, setAccessibleProfs] = useState<Professeur[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Formulaire nouveau message
  const [targetRecipient, setTargetRecipient] = useState(preDestId || "admin-id");
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  const loadData = () => {
    const msgs = getStoredDirectMessages();
    setAllMessages(msgs);
    const profs = getAccessibleProfesseurs(niveau, classeCode);
    setAccessibleProfs(profs);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("has_academic_storage_updated", loadData);
    return () => window.removeEventListener("has_academic_storage_updated", loadData);
  }, [niveau, classeCode]);

  useEffect(() => {
    if (preDestId) {
      setTargetRecipient(preDestId);
      setModalOpen(true);
    }
  }, [preDestId]);

  // Messages reçus par l'étudiant
  const inboxMessages = allMessages.filter(
    (m) => m.receiver_id === user.id || m.receiver_id === user.email
  );

  // Messages envoyés par l'étudiant
  const sentMessages = allMessages.filter(
    (m) => m.sender_id === user.id || m.sender_id === user.email || m.sender_id === "student-me"
  );

  const displayedList = tab === "inbox" ? inboxMessages : sentMessages;

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (tab === "inbox" && !msg.is_read) {
      markDirectMessageRead(msg.id);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) return;

    let receiverName = "Administration HAS";
    let receiverRole = "admin";

    if (targetRecipient !== "admin-id") {
      const foundProf = accessibleProfs.find((p) => p.id === targetRecipient);
      if (foundProf) {
        receiverName = foundProf.full_name;
        receiverRole = "professeur";
      }
    }

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender_id: user.id || user.email || "student-me",
      receiver_id: targetRecipient,
      subject: newSubject.trim(),
      content: newContent.trim(),
      is_read: false,
      parent_id: null,
      created_at: new Date().toISOString(),
      sender: {
        id: user.id || "student-me",
        full_name: user.full_name,
        email: user.email,
        role: "etudiant",
        username: user.username,
        phone: user.phone,
        matricule: user.matricule,
        filiere_id: user.filiere_id,
        classe_id: user.classe_id,
        bio: user.bio,
        specialite: user.specialite,
        avatar_url: user.avatar_url,
        is_active: true,
        created_at: "",
        updated_at: "",
      },
      receiver: {
        id: targetRecipient,
        full_name: receiverName,
        email: "",
        role: receiverRole as any,
        username: null,
        phone: null,
        matricule: null,
        filiere_id: null,
        classe_id: null,
        bio: null,
        specialite: null,
        avatar_url: null,
        is_active: true,
        created_at: "",
        updated_at: "",
      },
    };

    saveDirectMessage(newMsg);
    setSendSuccess(true);

    setTimeout(() => {
      setSendSuccess(false);
      setModalOpen(false);
      setNewSubject("");
      setNewContent("");
      setTab("sent");
      setSelectedMessage(newMsg);
    }, 1200);
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0f2744]/5 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA] text-[11px] font-semibold mb-1 border border-slate-200 dark:border-[#263241]">
              <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Messagerie interne • {classeCode}</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Messagerie Académique
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              Échangez de manière confidentielle avec vos professeurs référents et l&apos;administration
            </p>
          </div>

          <Button
            variant="accent"
            size="md"
            onClick={() => setModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nouveau message
          </Button>
        </div>

        {/* Onglets Réception / Envoyés */}
        <div className="flex gap-2 border-b border-slate-200 dark:border-[#263241]">
          <button
            onClick={() => {
              setTab("inbox");
              setSelectedMessage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === "inbox"
                ? "border-[#0f2744] dark:border-[#e0521c] text-[#0f2744] dark:text-[#F5F7FA]"
                : "border-transparent text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800 dark:hover:text-[#F5F7FA]"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Boîte de réception ({inboxMessages.length})</span>
          </button>

          <button
            onClick={() => {
              setTab("sent");
              setSelectedMessage(null);
            }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
              tab === "sent"
                ? "border-[#0f2744] dark:border-[#e0521c] text-[#0f2744] dark:text-[#F5F7FA]"
                : "border-transparent text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800 dark:hover:text-[#F5F7FA]"
            }`}
          >
            <SendHorizontal className="w-4 h-4" />
            <span>Messages envoyés ({sentMessages.length})</span>
          </button>
        </div>

        {/* Vue 2 colonnes : Liste et Détail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonne Liste */}
          <div className="lg:col-span-5 space-y-3">
            {displayedList.length === 0 ? (
              <div className="bg-white dark:bg-[#111821] rounded-xl border border-dashed border-slate-300 dark:border-[#263241] p-8 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-[#687585] mx-auto" />
                <p className="font-serif text-sm font-bold text-slate-800 dark:text-[#F5F7FA]">
                  {tab === "inbox" ? "Boîte de réception vide" : "Aucun message envoyé"}
                </p>
                <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-xs mx-auto">
                  {tab === "inbox"
                    ? "Vous n'avez pas encore reçu de message direct de vos enseignants."
                    : "Vous n'avez envoyé aucun message pour le moment. Cliquez sur Nouveau Message pour poser une question."}
                </p>
              </div>
            ) : (
              displayedList.map((msg) => {
                const correspondentName =
                  tab === "inbox"
                    ? msg.sender?.full_name || "Expéditeur HAS"
                    : msg.receiver?.full_name || "Destinataire";
                const isSelected = selectedMessage?.id === msg.id;

                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-[#0f2744] dark:border-[#e0521c] bg-[#0f2744]/5 dark:bg-[#151D27] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]"
                        : "border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#111821] hover:border-slate-300 dark:hover:border-[#38495d]"
                    } ${!msg.is_read && tab === "inbox" ? "font-semibold bg-blue-50/30 dark:bg-cyan-950/20 border-l-4 border-l-[#e0521c]" : ""}`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                        {correspondentName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-[#687585] shrink-0">
                        {new Date(msg.created_at).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </div>

                    <h4 className="text-sm font-serif font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                      {msg.subject}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-[#AAB4C0] line-clamp-2 mt-1">
                      {msg.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Colonne Détail Message */}
          <div className="lg:col-span-7 bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-6 min-h-[420px] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 dark:border-[#263241] pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                        {selectedMessage.subject}
                      </h2>
                      <div className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1 flex items-center gap-2">
                        <span>
                          {tab === "inbox" ? "De :" : "À :"}{" "}
                          <strong className="text-slate-800 dark:text-[#F5F7FA]">
                            {tab === "inbox"
                              ? selectedMessage.sender?.full_name
                              : selectedMessage.receiver?.full_name}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(selectedMessage.created_at).toLocaleString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-700 dark:text-[#F5F7FA] leading-relaxed whitespace-pre-line py-2">
                  {selectedMessage.content}
                </div>

                {tab === "inbox" && (
                  <div className="pt-4 border-t border-slate-100 dark:border-[#263241]">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTargetRecipient(selectedMessage.sender_id);
                        setNewSubject(`Re: ${selectedMessage.subject}`);
                        setModalOpen(true);
                      }}
                      leftIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Répondre à ce message
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 dark:text-[#687585] p-8">
                <MessageSquare className="w-12 h-12 text-slate-200 dark:text-[#263241] mb-3" />
                <p className="text-sm font-medium text-slate-600 dark:text-[#AAB4C0]">Sélectionnez un message</p>
                <p className="text-xs text-slate-400 dark:text-[#687585] mt-1">
                  Cliquez sur un élément de la liste pour en lire l&apos;intégralité
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Nouveau Message */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                Nouveau Message Académique
              </h3>

              {sendSuccess ? (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-sm font-medium">Votre message a été transmis avec succès.</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">
                      Destinataire (autorisé pour votre classe {classeCode})
                    </label>
                    <select
                      value={targetRecipient}
                      onChange={(e) => setTargetRecipient(e.target.value)}
                      className="w-full text-sm border border-slate-200/90 dark:border-[#263241] rounded-lg p-2.5 bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                    >
                      <optgroup label="Administration & Scolarité">
                        <option value="admin-id">Direction Générale & Scolarité HAS</option>
                      </optgroup>
                      <optgroup label={`Vos Professeurs (${classeCode})`}>
                        {accessibleProfs.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.full_name} ({p.specialite})
                          </option>
                        ))}
                      </optgroup>
                    </select>
                  </div>

                  <Input
                    label="Objet du message"
                    required
                    placeholder="Ex. Précision sur le cours d'Algèbre..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">
                      Contenu du message
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Rédigez votre demande ou question académique..."
                      className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] p-3 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                    />
                  </div>

                  <div className="border-t border-slate-100 dark:border-[#263241] pt-3 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="rounded-lg text-xs"
                      onClick={() => setModalOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      variant="accent"
                      size="sm"
                      className="rounded-lg text-xs"
                      rightIcon={<Send className="w-3.5 h-3.5" />}
                    >
                      Envoyer
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function EtudiantMessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f2744]"></div>
        </div>
      }
    >
      <EtudiantMessagesContent />
    </Suspense>
  );
}
