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
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fonction utilitaire pour parser un message et son salon
  const parseMessageSalon = useCallback((rawText: string) => {
    const match = rawText.match(/^\[\[salon:([^\]]+)\]\]\s*([\s\S]*)$/);
    if (match) {
      return { salonId: match[1], content: match[2] };
    }
    return { salonId: "general", content: rawText };
  }, []);

  // Extrait les métadonnées expéditeur encodées dans le message (id, nom, rôle, email)
  const parseSenderMeta = useCallback((text: string): {
    id: string | null;
    name: string | null;
    role: UserRole | null;
    email: string | null;
    cleanContent: string;
  } => {
    // Format moderne à 4 éléments : [[sender:ID||NOM||ROLE||EMAIL]]
    const match4 = text.match(/^\[\[sender:([^\|]+)\|\|([^\|]+)\|\|([^\|]+)\|\|([^\]]*)\]\]\s*([\s\S]*)$/);
    if (match4) {
      return {
        id: match4[1].trim() || null,
        name: match4[2].trim() || null,
        role: (match4[3].trim() as UserRole) || null,
        email: match4[4].trim() || null,
        cleanContent: match4[5].trim(),
      };
    }
    // Format legacy à 2 éléments : [[sender:NOM||ROLE]]
    const match2 = text.match(/^\[\[sender:([^\|]+)\|\|([^\]]+)\]\]\s*([\s\S]*)$/);
    if (match2) {
      return {
        id: null,
        name: match2[1].trim() || null,
        role: (match2[2].trim() as UserRole) || null,
        email: null,
        cleanContent: match2[3].trim(),
      };
    }
    return { id: null, name: null, role: null, email: null, cleanContent: text };
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
          const parsed: ChatMessage[] = JSON.parse(localCached);
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
          const { salonId, content: rawAfterSalon } = parseMessageSalon(item.message || "");
          if (salonId === roomId || (roomId === "general" && salonId === "general")) {

            // Extraire les métadonnées expéditeur encodées dans le message (source fiable)
            const {
              id: embeddedId,
              name: embeddedName,
              role: embeddedRole,
              email: embeddedEmail,
              cleanContent,
            } = parseSenderMeta(rawAfterSalon);

            // Fallback : jointure DB (peut être incorrecte si user_id ne correspond pas)
            const userObj = item.users as any;
            const dbFullName = userObj
              ? `${userObj.prenom || ""} ${userObj.nom || ""}`.trim() || userObj.email || ""
              : "";
            const dbRole: UserRole =
              userObj?.roles?.nom === "admin"
                ? "admin"
                : userObj?.roles?.nom === "enseignant"
                ? "professeur"
                : "etudiant";

            // Priorité : métadonnées embarquées > jointure DB > fallback
            const finalUserId = embeddedId || String(item.user_id);
            const fullName = embeddedName || dbFullName || "Membre HAS";
            const roleName = embeddedRole || dbRole;
            const finalEmail = embeddedEmail || userObj?.email || "";

            roomMessages.push({
              id: String(item.id),
              user_id: finalUserId,
              salon_id: salonId,
              content: cleanContent || rawAfterSalon.trim(),
              is_deleted: false,
              created_at: item.created_at,
              user: {
                id: finalUserId,
                full_name: fullName,
                role: roleName,
                email: finalEmail,
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

        // Synchroniser le cache local avec les vrais messages
        try {
          const localKey = `has_chat_${roomId}_v1`;
          localStorage.setItem(localKey, JSON.stringify(roomMessages));
        } catch {
          // quota dépassé, ignorer
        }
      }
    } catch (err: unknown) {
      console.warn("[CHAT LOAD ERROR]", err);
      setMessages([getWelcomeMessage(roomId)]);
    } finally {
      setIsLoading(false);
    }
  }, [roomId, parseMessageSalon, parseSenderMeta]);

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
          (payload) => {
            // NE PAS recharger tous les messages sur INSERT :
            // le message optimistique (avec le bon nom de l'expéditeur)
            // est déjà dans le state. On recharge seulement si c'est
            // un message d'un AUTRE utilisateur (id différent du current user).
            const rawMsg = String((payload.new as any)?.message || "");
            const { id: embId, email: embEmail, name: embName } = parseSenderMeta(rawMsg);
            const insertedUserId = String((payload.new as any)?.user_id);
            const isMyMessage =
              (embId && embId === currentUser.id) ||
              (embEmail && currentUser.email && embEmail.toLowerCase() === currentUser.email.toLowerCase()) ||
              (embName && currentUser.fullName && embName.toLowerCase() === currentUser.fullName.toLowerCase()) ||
              insertedUserId === currentUser.id ||
              (currentUser.role === "admin" && insertedUserId === "1");
            if (!isMyMessage) {
              loadRealMessages();
            }
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

    // Format avec préfixe de salon + métadonnées expéditeur complètes
    // Structure: [[salon:ID]][[sender:ID||NOM||ROLE||EMAIL]] CONTENU
    // Cela garantit la persistance exacte de l'auteur même après reconnexion ou rechargement
    const senderMeta = `[[sender:${currentUser.id}||${currentUser.fullName}||${currentUser.role}||${currentUser.email || ""}]]`;
    const formattedPayload =
      roomId === "general"
        ? `${senderMeta} ${messageText}`
        : `[[salon:${roomId}]] ${senderMeta} ${messageText}`;

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

      // Résolution de l'identifiant numérique dans la table users :
      // admin -> 1, etudiant -> 10 (ou ID étudiant spécifique 12, 13)
      let dbUserId = currentUser.role === "admin" ? 1 : 10;
      const parsedNumeric = parseInt(currentUser.id, 10);
      if (!isNaN(parsedNumeric) && parsedNumeric > 0) {
        dbUserId = parsedNumeric;
      } else if (currentUser.email) {
        try {
          const { data: matchedUser } = await supabase
            .from("users")
            .select("id")
            .eq("email", currentUser.email)
            .maybeSingle();
          if (matchedUser?.id) {
            dbUserId = matchedUser.id;
          }
        } catch {
          // Ignorer
        }
      }

      if (currentUser.role === "admin") {
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
        // Garder TOUTES les données de l'optimistique (bon nom, bon rôle)
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: String(inserted.id) } : m))
        );
        // Synchroniser le cache local
        try {
          const localKey = `has_chat_${roomId}_v1`;
          const existing: ChatMessage[] = JSON.parse(localStorage.getItem(localKey) || "[]");
          const updated = existing.filter((m) => m.id !== tempId);
          updated.push({ ...optimisticMessage, id: String(inserted.id) });
          localStorage.setItem(localKey, JSON.stringify(updated));
        } catch { /* quota */ }
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3" />
            Admin
          </span>
        );
      case "professeur":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0f2744]/10 text-[#0f2744] border border-[#0f2744]/20">
            <GraduationCap className="w-3 h-3" />
            Enseignant
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-[#e0521c] border border-orange-200">
            <UserCheck className="w-3 h-3" />
            Étudiant
          </span>
        );
    }
  };

  // Couleurs par rôle
  const getRoleStyles = (role: UserRole, isMe: boolean) => {
    if (role === "admin") return {
      bubble: isMe ? "bg-purple-700 text-white" : "bg-purple-50 text-purple-900 border border-purple-200",
      avatar: "bg-purple-600 text-white",
      name: "text-purple-700",
    };
    if (role === "professeur") return {
      bubble: isMe ? "bg-[#0f2744] text-white" : "bg-blue-50 text-blue-900 border border-blue-200",
      avatar: "bg-[#0f2744] text-white",
      name: "text-[#0f2744]",
    };
    // etudiant
    return {
      bubble: isMe ? "bg-[#e0521c] text-white" : "bg-orange-50 text-orange-900 border border-orange-200",
      avatar: "bg-[#e0521c] text-white",
      name: "text-[#e0521c]",
    };
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
          <span className="shrink-0 hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700 border border-amber-200">
            <ShieldCheck className="w-3 h-3" />
            Modérateur
          </span>
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
            // Un message m'appartient ssi mon ID, mon email ou mon nom complet correspond
            const isMe =
              (currentUser.id && currentUser.id !== "" && (msg.user_id === currentUser.id || msg.user?.id === currentUser.id)) ||
              (currentUser.email && currentUser.email !== "" && msg.user?.email && msg.user.email.toLowerCase() === currentUser.email.toLowerCase()) ||
              (currentUser.fullName && currentUser.fullName !== "" && msg.user?.full_name && msg.user.full_name.toLowerCase() === currentUser.fullName.toLowerCase());

            const authorRole = msg.user?.role || "etudiant";
            const authorName = msg.user?.full_name || "Membre HAS";
            const styles = getRoleStyles(authorRole, Boolean(isMe));

            // Initiales avatar
            const avatarInitials = authorName
              .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} items-end`}
                onClick={() => setSelectedMsgId(null)}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 shadow-sm ${styles.avatar}`}>
                  {avatarInitials}
                </div>

                <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[72%] relative`}>
                  {/* Nom + badge + heure */}
                  <div className={`flex items-center gap-1.5 mb-1 flex-wrap ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                    <span className={`text-xs font-bold ${styles.name}`}>
                      {isMe ? "Moi" : authorName}
                    </span>
                    {renderRoleBadge(authorRole)}
                    <span className="text-[10px] text-slate-400">
                      {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>

                  {/* Bulle cliquable */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAdmin || currentUser.role === "admin") {
                        setSelectedMsgId((prev) => (prev === msg.id ? null : msg.id));
                      }
                    }}
                    className={`relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm cursor-pointer select-none ${
                      isMe ? `${styles.bubble} rounded-br-none` : `${styles.bubble} rounded-bl-none`
                    } ${selectedMsgId === msg.id ? "ring-2 ring-red-400/60" : ""}`}
                  >
                    {msg.content}

                    {/* Menu contextuel style WhatsApp */}
                    {selectedMsgId === msg.id && (isAdmin || currentUser.role === "admin") && (
                      <div
                        className={`absolute ${isMe ? "right-0" : "left-0"} top-full mt-1.5 z-50 bg-white rounded-xl shadow-xl border border-slate-200/80 overflow-hidden min-w-[130px]`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            handleDeleteMessage(msg.id);
                            setSelectedMsgId(null);
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer le message
                        </button>
                        <button
                          onClick={() => setSelectedMsgId(null)}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-slate-500 hover:bg-slate-50 transition-colors border-t border-slate-100"
                        >
                          Annuler
                        </button>
                      </div>
                    )}
                  </div>
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
