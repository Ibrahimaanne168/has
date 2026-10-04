"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Trash2,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  MessagesSquare,
  AlertCircle,
  Hash,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ChatMessage, UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";

interface ChatRoomProps {
  currentUser: {
    id: string;
    fullName: string;
    role: UserRole;
    email?: string;
  };
  isAdmin?: boolean;
  roomId?: string;
  roomTitle?: string;
  roomDescription?: string;
}

function getWelcomeMessage(salonId: string): ChatMessage {
  return {
    id: `welcome-${salonId}`,
    user_id: "admin-1",
    salon_id: salonId,
    content: "Bienvenue !!",
    is_deleted: false,
    created_at: new Date().toISOString(),
    user: {
      id: "admin-1",
      full_name: "Administration HAS",
      role: "admin",
      email: "direction@halil-academie.com",
      username: "admin",
      phone: null,
      matricule: "ADM001",
      filiere_id: null,
      classe_id: null,
      bio: null,
      specialite: null,
      avatar_url: null,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  };
}

export function ChatRoom({
  currentUser,
  isAdmin = false,
  roomId = "general",
  roomTitle = "Salon Général de l'Académie",
  roomDescription = "Canal d'échanges officiel en direct de Halil Académie Scientifique",
}: ChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fonction utilitaire pour parser un message et son salon
  const parseMessageSalon = useCallback((rawText: string) => {
    const match = rawText.match(/^\[\[salon:([^\]]+)\]\]\s*([\s\S]*)$/);
    if (match) {
      return { salonId: match[1], content: match[2] };
    }
    return { salonId: "general", content: rawText };
  }, []);

  // Charger les messages réels depuis la base Supabase
  const loadRealMessages = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("chat_messages")
        .select(`
          id,
          user_id,
          message,
          created_at,
          users (
            id,
            nom,
            prenom,
            email,
            photo,
            roles (
              nom
            )
          )
        `)
        .order("created_at", { ascending: true });

      if (error) {
        console.warn("[CHAT DB ERROR]", error.message);
        // Fallback local storage si table non joignable
        const localKey = `has_chat_${roomId}_v1`;
        const localCached = localStorage.getItem(localKey);
        if (localCached) {
          const parsed = JSON.parse(localCached);
          setMessages(parsed.length > 0 ? parsed : [getWelcomeMessage(roomId)]);
        } else {
          setMessages([getWelcomeMessage(roomId)]);
        }
        return;
      }

      if (data) {
        // Filtrer les messages pour le salon actif
        const roomMessages: ChatMessage[] = [];

        for (const item of data) {
          const { salonId, content } = parseMessageSalon(item.message || "");
          if (salonId === roomId || (roomId === "general" && salonId === "general")) {
            // Identifier les infos de l'auteur
            const userObj = item.users as any;
            const roleName: UserRole =
              userObj?.roles?.nom === "admin"
                ? "admin"
                : userObj?.roles?.nom === "enseignant"
                ? "professeur"
                : "etudiant";

            const fullName = userObj
              ? `${userObj.prenom || ""} ${userObj.nom || ""}`.trim() || userObj.email || "Membre HAS"
              : "Membre HAS";

            roomMessages.push({
              id: String(item.id),
              user_id: String(item.user_id),
              salon_id: salonId,
              content: content.trim(),
              is_deleted: false,
              created_at: item.created_at,
              user: {
                id: String(item.user_id),
                full_name: fullName,
                role: roleName,
                email: userObj?.email || "",
                username: null,
                phone: null,
                matricule: null,
                filiere_id: null,
                classe_id: null,
                bio: null,
                specialite: null,
                avatar_url: userObj?.photo || null,
                is_active: true,
                created_at: item.created_at,
                updated_at: item.created_at,
              },
            });
          }
        }

        setMessages(roomMessages.length > 0 ? roomMessages : [getWelcomeMessage(roomId)]);
      }
    } catch (err: unknown) {
      console.warn("[CHAT LOAD ERROR]", err);
      setMessages([getWelcomeMessage(roomId)]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, parseMessageSalon]);

  useEffect(() => {
    loadRealMessages();

    // Abonnement Supabase Realtime
    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`chat-room-${roomId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages" },
          () => {
            // Recharger pour obtenir la jointure complète de l'utilisateur
            loadRealMessages();
          }
        )
        .on(
          "postgres_changes",
          { event: "DELETE", schema: "public", table: "chat_messages" },
          (payload) => {
            const deletedId = String((payload.old as any)?.id);
            setMessages((prev) => prev.filter((m) => m.id !== deletedId));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch {
      // Fallback
    }
  }, [roomId, loadRealMessages]);

  // Défilement automatique vers le bas lors de nouveaux messages
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

    // Format avec préfixe de salon si ce n'est pas le salon général
    const formattedPayload =
      roomId === "general" ? messageText : `[[salon:${roomId}]] ${messageText}`;

    const optimisticMessage: ChatMessage = {
      id: tempId,
      user_id: currentUser.id,
      salon_id: roomId,
      content: messageText,
      is_deleted: false,
      created_at: new Date().toISOString(),
      user: {
        id: currentUser.id,
        full_name: currentUser.fullName,
        role: currentUser.role,
        email: currentUser.email || "",
        username: null,
        phone: null,
        matricule: null,
        filiere_id: null,
        classe_id: null,
        bio: null,
        specialite: null,
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const supabase = createClient();

      // Résolution de l'identifiant numérique dans la table users
      let dbUserId = 1;
      const parsedNumeric = parseInt(currentUser.id, 10);
      if (!isNaN(parsedNumeric) && parsedNumeric > 0) {
        dbUserId = parsedNumeric;
      } else {
        // Chercher l'ID de l'utilisateur par son email s'il existe
        try {
          if (currentUser.email) {
            const { data: matchedUser } = await supabase
              .from("users")
              .select("id")
              .eq("email", currentUser.email)
              .maybeSingle();
            if (matchedUser?.id) {
              dbUserId = matchedUser.id;
            }
          }
        } catch {
          // Ignorer
        }
      }

      // Si c'est l'admin par défaut
      if (currentUser.role === "admin" && dbUserId !== 1) {
        dbUserId = 1;
      }

      const { data: inserted, error } = await supabase
        .from("chat_messages")
        .insert({
          user_id: dbUserId,
          message: formattedPayload,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (inserted) {
        // Mettre à jour l'ID temporaire par le véritable ID de la base
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: String(inserted.id) } : m))
        );
      }
    } catch (err: unknown) {
      console.warn("[CHAT SEND ERROR / LOCAL CACHE]", err);
      // Conserver dans le stockage local si déconnecté
      try {
        const localKey = `has_chat_${roomId}_v1`;
        const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
        localStorage.setItem(localKey, JSON.stringify([...existing, optimisticMessage]));
      } catch {
        // Ignorer
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteMessage = async (msgId: string) => {
    if (!isAdmin && currentUser.role !== "admin") return;
    setMessages((prev) => prev.filter((m) => m.id !== msgId));

    try {
      const supabase = createClient();
      const numId = parseInt(msgId, 10);
      if (!isNaN(numId)) {
        await supabase.from("chat_messages").delete().eq("id", numId);
      }
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
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col h-[900px] min-h-[700px] overflow-hidden">
      {/* Header du Chat */}
      <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#0f2744] text-white flex items-center justify-center shrink-0">
            <MessagesSquare className="w-5 h-5 text-[#e0521c]" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#0f2744] truncate">
                {roomTitle}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0f2744]/10 text-[#0f2744]">
                <Hash className="w-3 h-3 text-[#e0521c]" />
                {roomId}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 truncate mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="truncate">{roomDescription}</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Badge variant="warning" size="sm" className="shrink-0 hidden sm:inline-flex">
            Modérateur Actif
          </Badge>
        )}
      </div>

      {/* Zone des messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/30">
        {isLoading ? (
          <div className="h-full flex items-center justify-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f2744]"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#0f2744]/5 flex items-center justify-center text-[#0f2744]">
              <Sparkles className="w-6 h-6 text-[#e0521c]" />
            </div>
            <h3 className="font-serif text-base font-bold text-slate-900">
              Aucun message pour le moment
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ce salon d&apos;échange est prêt. Posez votre première question ou partagez une information académique avec votre communauté !
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe =
              msg.user_id === currentUser.id ||
              msg.user?.email === currentUser.email ||
              (currentUser.role === "admin" && msg.user_id === "1");

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
                      title="Supprimer ce message (Modération)"
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
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Saisie de message */}
      <div className="p-4 bg-white border-t border-slate-200/90">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            required
            placeholder={`Écrivez votre message dans ${roomTitle}...`}
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
          Appuyez sur Entrée pour envoyer votre message.
        </p>
      </div>
    </div>
  );
}
