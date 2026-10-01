"use client";

import React, { useState, useEffect, useRef } from "react";
import { Send, Trash2, ShieldCheck, UserCheck, GraduationCap, MessagesSquare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChatMessage, UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface ChatRoomProps {
  currentUser: {
    id: string;
    fullName: string;
    role: UserRole;
  };
  isAdmin?: boolean;
  roomId?: string;
  roomTitle?: string;
}

export function ChatRoom({
  currentUser,
  isAdmin = false,
  roomId = "general",
  roomTitle = "Salon Général",
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Messages initiaux
  useEffect(() => {
    const initialMessages: ChatMessage[] = [
      {
        id: "msg-1",
        user_id: "admin-id",
        content:
          "Bienvenue sur le salon officiel de Halil Académie Scientifique (HAS). Les échanges doivent demeurer courtois et conformes au règlement académique.",
        is_deleted: false,
        created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
        user: {
          id: "admin-id",
          full_name: "Administration Centrale HAS",
          role: "admin",
          email: "admin@halil-academie.com",
          username: "admin",
          phone: null,
          matricule: "ADMIN-01",
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
      {
        id: "msg-2",
        user_id: "p1111111-1111-1111-1111-111111111111",
        content:
          "Rappel pour les étudiants de L2-ISN : les comptes-rendus du TP2 sur PostgreSQL sont attendus avant vendredi 18h sur l'espace cours.",
        is_deleted: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
        user: {
          id: "p1111111-1111-1111-1111-111111111111",
          full_name: "Dr. Ousmane Touré",
          role: "professeur",
          email: "o.toure@halil-academie.com",
          username: "otoure",
          phone: null,
          matricule: "ENS-ISN-001",
          filiere_id: null,
          classe_id: null,
          bio: null,
          specialite: "Génie Logiciel",
          avatar_url: null,
          is_active: true,
          created_at: "",
          updated_at: "",
        },
      },
    ];

    setMessages(initialMessages);

    // Initialisation Supabase Realtime si configuré
    try {
      const supabase = createClient();
      const channel = supabase
        .channel("general-chat-room")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages" },
          (payload) => {
            const incoming = payload.new as ChatMessage;
            if (!incoming.is_deleted) {
              setMessages((prev) => [...prev, incoming]);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "chat_messages" },
          (payload) => {
            const updated = payload.new as ChatMessage;
            if (updated.is_deleted) {
              setMessages((prev) => prev.filter((m) => m.id !== updated.id));
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Fallback
    }
  }, []);

  // Défilement automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    setErrorMsg(null);

    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: ChatMessage = {
      id: tempId,
      user_id: currentUser.id,
      content: messageText,
      is_deleted: false,
      created_at: new Date().toISOString(),
      user: {
        id: currentUser.id,
        full_name: currentUser.fullName,
        role: currentUser.role,
        email: "",
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

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const supabase = createClient();
      const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

      if (!isPlaceholder) {
        const { error } = await supabase.from("chat_messages").insert({
          user_id: currentUser.id,
          content: messageText,
        });

        if (error) {
          throw error;
        }
      }
    } catch (err: unknown) {
      console.warn("[CHAT ERROR / LOCAL MODE]", err);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!isAdmin && currentUser.role !== "admin") return;
    setMessages((prev) => prev.filter((m) => m.id !== msgId));

    try {
      const supabase = createClient();
      await supabase.from("chat_messages").update({ is_deleted: true }).eq("id", msgId);
    } catch (err) {
      console.warn("[MODERATION CHAT FAIL]", err);
    }
  };

  const renderRoleBadge = (role?: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="accent" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
            Administration
          </Badge>
        );
      case "professeur":
        return (
          <Badge variant="primary" size="sm" icon={<GraduationCap className="w-3 h-3" />}>
            Enseignant
          </Badge>
        );
      default:
        return (
          <Badge variant="neutral" size="sm" icon={<UserCheck className="w-3 h-3" />}>
            Étudiant
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col h-[650px] overflow-hidden">
      {/* Header du Chat */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#0f2744] text-white flex items-center justify-center">
            <MessagesSquare className="w-5 h-5 text-[#e0521c]" />
          </div>
          <div>
            <h2 className="font-serif text-base sm:text-lg font-bold text-[#0f2744]">
              Salon Général — Halil Académie Scientifique
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Canal temps réel ouvert à tous les membres connectés</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Badge variant="warning" size="sm">
            Mode Modérateur Actif
          </Badge>
        )}
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
        {messages.map((msg) => {
          const isMe = msg.user_id === currentUser.id;
          const authorRole = msg.user?.role || "etudiant";
          const authorName = msg.user?.full_name || "Membre HAS";

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"} group`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-slate-800">{authorName}</span>
                {renderRoleBadge(authorRole)}
                <span className="text-[10px] text-slate-400">
                  {new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {(isAdmin || currentUser.role === "admin") && (
                  <button
                    onClick={() => handleDeleteMessage(msg.id)}
                    title="Modérer / Supprimer ce message"
                    className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div
                className={`max-w-xl rounded-xl p-3.5 text-sm leading-relaxed ${
                  isMe
                    ? "bg-[#0f2744] text-white rounded-tr-none shadow-xs"
                    : "bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-xs"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Saisie de message */}
      <div className="p-4 bg-white border-t border-slate-200/90">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            required
            placeholder="Écrivez votre message public aux étudiants et enseignants..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded-lg border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744] transition-colors"
          />
          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={isSending}
            disabled={!newMessage.trim()}
            rightIcon={<Send className="w-4 h-4" />}
          >
            Envoyer
          </Button>
        </form>
        <p className="text-[11px] text-slate-400 mt-2">
          Appuyez sur Entrée pour envoyer. Tous les messages sont horodatés et archivés pour audit.
        </p>
      </div>
    </div>
  );
}
