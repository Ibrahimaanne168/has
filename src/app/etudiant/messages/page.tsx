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
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS } from "@/lib/data/mock-data";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { Message } from "@/lib/types";

function EtudiantMessagesContent() {
  const { user } = useCurrentUser();
  const searchParams = useSearchParams();
  const preDestId = searchParams.get("dest");
  const preDestName = searchParams.get("name");

  const [tab, setTab] = useState<"inbox" | "sent">("inbox");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "m-1",
      sender_id: "p1111111-1111-1111-1111-111111111111",
      receiver_id: user.id || "student-id",
      subject: "Validation de votre sujet de mini-projet BDD",
      content:
        "Bonjour, j'ai examiné votre proposition de modèle relationnel pour la gestion de pharmacie hospitalière. Les entités sont bien posées. Vous pouvez passer à l'implémentation des contraintes et des index PostgreSQL.",
      is_read: true,
      parent_id: null,
      created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
      sender: MOCK_PROFESSEURS[0],
    },
    {
      id: "m-2",
      sender_id: "admin-id",
      receiver_id: user.id || "student-id",
      subject: "Attestation d'inscription 2024-2025 disponible",
      content:
        "Votre attestation d'inscription officielle pour l'année 2024-2025 est désormais signée par le secrétariat académique. Vous pouvez retirer l'original auprès du bureau des admissions.",
      is_read: false,
      parent_id: null,
      created_at: new Date(Date.now() - 3600000 * 6).toISOString(),
      sender: {
        id: "admin-id",
        full_name: "Administration Scolarité HAS",
        role: "admin",
        email: "scolarite@halil-academie.com",
        username: "scolarite",
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
    },
  ]);

  const [sentMessages, setSentMessages] = useState<Message[]>([
    {
      id: "m-sent-1",
      sender_id: user.id || "student-id",
      receiver_id: "p1111111-1111-1111-1111-111111111111",
      subject: "Question sur le TP n°2 PostgreSQL",
      content:
        "Bonjour Monsieur, concernant la question 3 du TP sur les triggers de journalisation, doit-on créer une table d'audit séparée ou enregistrer les logs dans la même table ?",
      is_read: true,
      parent_id: null,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString(),
      receiver: MOCK_PROFESSEURS[0],
    },
  ]);

  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Formulaire nouveau message
  const [targetRecipient, setTargetRecipient] = useState(preDestId || "admin-id");
  const [newSubject, setNewSubject] = useState("");
  const [newContent, setNewContent] = useState("");
  const [sendSuccess, setSendSuccess] = useState(false);

  useEffect(() => {
    if (preDestId) {
      setTargetRecipient(preDestId);
      setModalOpen(true);
    }
  }, [preDestId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newContent.trim()) return;

    const recipientProf = MOCK_PROFESSEURS.find((p) => p.id === targetRecipient);
    const receiverProfile = recipientProf || {
      id: "admin-id",
      full_name: "Direction Académique HAS",
      role: "admin",
      email: "direction@halil-academie.com",
      username: "direction",
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
    };

    const newMsg: Message = {
      id: `sent-${Date.now()}`,
      sender_id: user.id || "student-id",
      receiver_id: targetRecipient,
      subject: newSubject,
      content: newContent,
      is_read: false,
      parent_id: null,
      created_at: new Date().toISOString(),
      receiver: receiverProfile,
    };

    setSentMessages((prev) => [newMsg, ...prev]);
    setSendSuccess(true);
    setTimeout(() => {
      setSendSuccess(false);
      setModalOpen(false);
      setNewSubject("");
      setNewContent("");
      setTab("sent");
    }, 1200);
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Messagerie HAS</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Messagerie Académique Interne
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Échangez directement et de manière confidentielle avec vos professeurs et l&apos;administration
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
            <span>Boîte de réception ({messages.length})</span>
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

        {/* Vue 2 colonnes : Liste et Détail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Colonne Liste */}
          <div className="lg:col-span-5 space-y-3">
            {(tab === "inbox" ? messages : sentMessages).map((msg) => {
              const correspondentName =
                tab === "inbox"
                  ? msg.sender?.full_name || "Expéditeur"
                  : msg.receiver?.full_name || "Destinataire";
              const correspondentRole =
                tab === "inbox" ? msg.sender?.role : msg.receiver?.role;
              const isSelected = selectedMessage?.id === msg.id;

              return (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "border-[#0f2744] bg-[#0f2744]/5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]"
                      : "border-slate-200/90 bg-white hover:border-slate-300"
                  } ${!msg.is_read && tab === "inbox" ? "font-semibold bg-blue-50/30" : ""}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs text-slate-900 truncate">
                      {correspondentName}
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

                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {msg.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Colonne Détail Message */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200/90 p-6 min-h-[420px] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col justify-between">
            {selectedMessage ? (
              <div className="space-y-5">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-[#0f2744]">
                        {selectedMessage.subject}
                      </h2>
                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                        <span>
                          {tab === "inbox" ? "De :" : "À :"}{" "}
                          <strong>
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
                    <Badge variant="primary" size="sm">
                      Sécurisé HAS
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line py-2">
                  {selectedMessage.content}
                </div>

                {tab === "inbox" && (
                  <div className="pt-4 border-t border-slate-100">
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
              <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-400 p-8">
                <MessageSquare className="w-12 h-12 text-slate-200 mb-3" />
                <p className="text-sm font-medium text-slate-600">Sélectionnez un message</p>
                <p className="text-xs text-slate-400 mt-1">
                  Cliquez sur un élément de la liste pour en lire l&apos;intégralité
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Nouveau Message */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                Nouveau Message Académique
              </h3>

              {sendSuccess ? (
                <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="text-sm font-medium">Votre message a été transmis avec succès.</span>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Destinataire</label>
                    <select
                      value={targetRecipient}
                      onChange={(e) => setTargetRecipient(e.target.value)}
                      className="w-full text-sm border border-slate-200/90 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      <optgroup label="Administration & Scolarité">
                        <option value="admin-id">Direction Générale & Scolarité</option>
                      </optgroup>
                      <optgroup label="Enseignants & Chercheurs">
                        {MOCK_PROFESSEURS.map((p) => (
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
                    placeholder="Ex. Précision sur le devoir maison..."
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                  />

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Contenu du message</label>
                    <textarea
                      required
                      rows={5}
                      value={newContent}
                      onChange={(e) => setNewContent(e.target.value)}
                      placeholder="Exprimez clairement votre demande en respectant les convenances universitaires..."
                      className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
                    />
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
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
