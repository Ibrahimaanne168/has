"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Send,
  Trash2,
  ShieldCheck,
  UserCheck,
  GraduationCap,
  MessagesSquare,
  Hash,
  Sparkles,
  Mic,
  Square,
  X,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Search,
  Users,
  ChevronDown,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ChatMessage, ChatSalon, UserRole, Professeur } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { getStoredProfesseurs } from "@/lib/academicStorage";
import { WaterRippleBackground } from "./WaterRippleBackground";
import { TelegramVoiceNote } from "./TelegramVoiceNote";

interface ChatRoomProps {
  currentUser: {
    id: string;
    fullName: string;
    role: UserRole;
    email?: string;
    avatarUrl?: string | null;
  };
  isAdmin?: boolean;
  roomId?: string;
  roomTitle?: string;
  roomDescription?: string;
  // Modal / Popup props
  isPopup?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  salons?: ChatSalon[];
  onSelectSalon?: (salonId: string) => void;
}

function getWelcomeMessage(salonId: string): ChatMessage {
  return {
    id: `welcome-${salonId}`,
    user_id: "admin-1",
    salon_id: salonId,
    content: "Bienvenue dans cet espace d'échanges académiques officiel de Halil Académie Scientifique ! Respectez les règles de courtoisie et d'entraide.",
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
      avatar_url: "/images/logo-has.jpg",
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
  isPopup = false,
  isOpen = true,
  onClose,
  salons,
  onSelectSalon,
}: ChatRoomProps) {
  // Sécurisation de l'identité : si le profil étudiant hérite par mégarde du nom "Administration", rétablir "Ibrahima Anne"
  const effectiveCurrentUser = {
    ...currentUser,
    fullName:
      currentUser.role === "etudiant" && currentUser.fullName.toLowerCase().includes("administration")
        ? "Ibrahima Anne"
        : currentUser.fullName,
  };

  // Détection de l'avatar utilisateur (depuis props ou localStorage)
  const [detectedStoredAvatar, setDetectedStoredAvatar] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoredAvatar = () => {
      if (typeof window === "undefined") return;
      try {
        if (effectiveCurrentUser.role === "etudiant") {
          const raw = localStorage.getItem("has_current_student_profile_v2");
          if (raw) {
            const p = JSON.parse(raw);
            if (p.avatar_url) setDetectedStoredAvatar(p.avatar_url);
          }
        } else if (effectiveCurrentUser.role === "professeur") {
          const raw = localStorage.getItem("has_current_professeur_profile_v2");
          if (raw) {
            const p = JSON.parse(raw);
            if (p.photo || p.avatar_url) setDetectedStoredAvatar(p.photo || p.avatar_url);
          }
        }
      } catch {}
    };

    fetchStoredAvatar();
    window.addEventListener("has_academic_storage_updated", fetchStoredAvatar);
    return () => window.removeEventListener("has_academic_storage_updated", fetchStoredAvatar);
  }, [effectiveCurrentUser.role]);

  const myDetectedAvatar =
    currentUser.avatarUrl ||
    detectedStoredAvatar ||
    (effectiveCurrentUser.role === "admin" ? "/images/logo-has.jpg" : null);

  const [profsCache, setProfsCache] = useState<Professeur[]>([]);
  useEffect(() => {
    try {
      setProfsCache(getStoredProfesseurs());
    } catch {}
  }, []);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMsgId, setSelectedMsgId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [salonsDropdownOpen, setSalonsDropdownOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Helper : extraire URL audio d'un contenu vocal
  const extractVoiceUrl = (content: string): string | null => {
    const match = content.match(/\[\[voice:(data:audio[^\]]+)\]\]/);
    return match ? match[1] : null;
  };

  // Helper : nettoyer le contenu vocal ou sender pour l'affichage textuel
  const cleanMessageContent = (content: string): string => {
    return content.replace(/\[\[voice:data:audio[^\]]+\]\]/g, "").trim();
  };

  // Parse message salon prefix
  const parseMessageSalon = useCallback((rawText: string) => {
    const match = rawText.match(/^\[\[salon:([^\]]+)\]\]\s*([\s\S]*)$/);
    if (match) {
      return { salonId: match[1], content: match[2] };
    }
    return { salonId: "general", content: rawText };
  }, []);

  // Parse sender metadata
  const parseSenderMeta = useCallback((text: string): {
    id: string | null;
    name: string | null;
    role: UserRole | null;
    email: string | null;
    avatarUrl: string | null;
    cleanContent: string;
  } => {
    const match5 = text.match(/^\[\[sender:([^\|]+)\|\|([^\|]+)\|\|([^\|]+)\|\|([^\|]*)\|\|([^\]]*)\]\]\s*([\s\S]*)$/);
    if (match5) {
      let decodedAvatar: string | null = null;
      if (match5[5].trim()) {
        try {
          decodedAvatar = decodeURIComponent(match5[5].trim());
        } catch {
          decodedAvatar = match5[5].trim();
        }
      }
      return {
        id: match5[1].trim() || null,
        name: match5[2].trim() || null,
        role: (match5[3].trim() as UserRole) || null,
        email: match5[4].trim() || null,
        avatarUrl: decodedAvatar,
        cleanContent: match5[6].trim(),
      };
    }
    const match4 = text.match(/^\[\[sender:([^\|]+)\|\|([^\|]+)\|\|([^\|]+)\|\|([^\]]*)\]\]\s*([\s\S]*)$/);
    if (match4) {
      return {
        id: match4[1].trim() || null,
        name: match4[2].trim() || null,
        role: (match4[3].trim() as UserRole) || null,
        email: match4[4].trim() || null,
        avatarUrl: null,
        cleanContent: match4[5].trim(),
      };
    }
    const match2 = text.match(/^\[\[sender:([^\|]+)\|\|([^\]]+)\]\]\s*([\s\S]*)$/);
    if (match2) {
      return {
        id: null,
        name: match2[1].trim() || null,
        role: (match2[2].trim() as UserRole) || null,
        email: null,
        avatarUrl: null,
        cleanContent: match2[3].trim(),
      };
    }
    return { id: null, name: null, role: null, email: null, avatarUrl: null, cleanContent: text };
  }, []);

  // Charger les messages réels depuis la base Supabase
  const loadRealMessages = useCallback(async () => {
    setIsLoading(true);

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
        const localKey = `has_chat_${roomId}_v1`;
        const localCached = typeof window !== "undefined" ? localStorage.getItem(localKey) : null;
        if (localCached) {
          const parsed: ChatMessage[] = JSON.parse(localCached);
          setMessages(parsed.length > 0 ? parsed : [getWelcomeMessage(roomId)]);
        } else {
          setMessages([getWelcomeMessage(roomId)]);
        }
        return;
      }

      if (data) {
        const roomMessages: ChatMessage[] = [];

        for (const item of data) {
          const { salonId, content: rawAfterSalon } = parseMessageSalon(item.message || "");
          if (salonId === roomId || (roomId === "general" && salonId === "general")) {
            const {
              id: embeddedId,
              name: embeddedName,
              role: embeddedRole,
              email: embeddedEmail,
              avatarUrl: embeddedAvatar,
              cleanContent,
            } = parseSenderMeta(rawAfterSalon);

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

            const finalUserId = embeddedId || String(item.user_id);
            const fullName = embeddedName || dbFullName || "Membre HAS";
            const roleName = embeddedRole || dbRole;
            const finalEmail = embeddedEmail || userObj?.email || "";
            const finalAvatar = embeddedAvatar || userObj?.photo || null;

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
                avatar_url: finalAvatar,
                is_active: true,
                created_at: item.created_at,
                updated_at: item.created_at,
              },
            });
          }
        }

        setMessages(roomMessages.length > 0 ? roomMessages : [getWelcomeMessage(roomId)]);

        try {
          const localKey = `has_chat_${roomId}_v1`;
          localStorage.setItem(localKey, JSON.stringify(roomMessages));
        } catch {
          // quota
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

    try {
      const supabase = createClient();
      const channel = supabase
        .channel(`chat-room-${roomId}`)
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "chat_messages" },
          (payload) => {
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
  }, [roomId, loadRealMessages, currentUser, parseSenderMeta]);

  // Défilement automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Écoute de la touche Échap pour fermer la popup
  useEffect(() => {
    if (!isPopup || !isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && onClose) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPopup, isOpen, onClose]);

  // Envoyer un message texte
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || isSending) return;

    setIsSending(true);
    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}`;

    const avatarMeta = myDetectedAvatar && myDetectedAvatar.length < 1500 ? encodeURIComponent(myDetectedAvatar) : "";
    const senderMeta = `[[sender:${effectiveCurrentUser.id}||${effectiveCurrentUser.fullName}||${effectiveCurrentUser.role}||${effectiveCurrentUser.email || ""}||${avatarMeta}]]`;
    const formattedPayload =
      roomId === "general"
        ? `${senderMeta} ${messageText}`
        : `[[salon:${roomId}]] ${senderMeta} ${messageText}`;

    const optimisticMessage: ChatMessage = {
      id: tempId,
      user_id: effectiveCurrentUser.id,
      salon_id: roomId,
      content: messageText,
      is_deleted: false,
      created_at: new Date().toISOString(),
      user: {
        id: effectiveCurrentUser.id,
        full_name: effectiveCurrentUser.fullName,
        role: effectiveCurrentUser.role,
        email: effectiveCurrentUser.email || "",
        username: null,
        phone: null,
        matricule: null,
        filiere_id: null,
        classe_id: null,
        bio: null,
        specialite: null,
        avatar_url: myDetectedAvatar,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage("");

    try {
      const supabase = createClient();
      let dbUserId = currentUser.role === "admin" ? 1 : 10;
      if (currentUser.email) {
        const { data: u } = await supabase.from("users").select("id").eq("email", currentUser.email).maybeSingle();
        if (u?.id) dbUserId = u.id;
      }
      if (currentUser.role === "admin") dbUserId = 1;

      const { data: inserted, error } = await supabase
        .from("chat_messages")
        .insert({ user_id: dbUserId, message: formattedPayload })
        .select()
        .single();

      if (error) throw error;

      if (inserted) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? { ...m, id: String(inserted.id) } : m))
        );
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
      try {
        const localKey = `has_chat_${roomId}_v1`;
        const existing = JSON.parse(localStorage.getItem(localKey) || "[]");
        localStorage.setItem(localKey, JSON.stringify([...existing, optimisticMessage]));
      } catch { /* ignore */ }
    } finally {
      setIsSending(false);
    }
  };

  // Suppression d'un message pour admin
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

  // ─── Enregistrement vocal façon Telegram ──────────────────────────────────────
  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.start(100);
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      alert("Impossible d'accéder au microphone. Vérifiez les autorisations de votre navigateur.");
    }
  };

  const handleCancelRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (recorder) {
      recorder.stop();
      recorder.stream.getTracks().forEach((t) => t.stop());
    }
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const handleStopAndSendRecording = () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    recorder.stop();
    recorder.stream.getTracks().forEach((t) => t.stop());
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setIsRecording(false);

    recorder.onstop = () => {
      const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        const tempId = `voice-${Date.now()}`;
        const avatarMeta = myDetectedAvatar && myDetectedAvatar.length < 1500 ? encodeURIComponent(myDetectedAvatar) : "";
        const senderMeta = `[[sender:${effectiveCurrentUser.id}||${effectiveCurrentUser.fullName}||${effectiveCurrentUser.role}||${effectiveCurrentUser.email || ""}||${avatarMeta}]]`;
        const voicePayload =
          roomId === "general"
            ? `${senderMeta} [[voice:${base64}]]`
            : `[[salon:${roomId}]] ${senderMeta} [[voice:${base64}]]`;

        const optimistic: ChatMessage = {
          id: tempId,
          user_id: effectiveCurrentUser.id,
          salon_id: roomId,
          content: `[[voice:${base64}]]`,
          is_deleted: false,
          created_at: new Date().toISOString(),
          user: {
            id: effectiveCurrentUser.id,
            full_name: effectiveCurrentUser.fullName,
            role: effectiveCurrentUser.role,
            email: effectiveCurrentUser.email || "",
            username: null,
            phone: null,
            matricule: null,
            filiere_id: null,
            classe_id: null,
            bio: null,
            specialite: null,
            avatar_url: myDetectedAvatar,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        };
        setMessages((prev) => [...prev, optimistic]);

        try {
          const supabase = createClient();
          let dbUserId = currentUser.role === "admin" ? 1 : 10;
          if (currentUser.email) {
            const { data: u } = await supabase.from("users").select("id").eq("email", currentUser.email).maybeSingle();
            if (u?.id) dbUserId = u.id;
          }
          if (currentUser.role === "admin") dbUserId = 1;

          const { data: inserted } = await supabase
            .from("chat_messages")
            .insert({ user_id: dbUserId, message: voicePayload })
            .select()
            .single();

          if (inserted) {
            setMessages((prev) => prev.map((m) => (m.id === tempId ? { ...m, id: String(inserted.id) } : m)));
          }
        } catch {
          // garder optimistique
        }
      };
      reader.readAsDataURL(blob);
    };
  };

  const renderRoleBadge = (role?: UserRole) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            Admin
          </span>
        );
      case "professeur":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#0f2744] border border-[#0f2744]/20">
            <GraduationCap className="w-3 h-3 text-[#0f2744]" />
            Enseignant
          </span>
        );
      default:
        // Pas de badge pour les étudiants (uniquement admin et enseignant)
        return null;
    }
  };

  // Styles visuels des bulles WhatsApp avec coins arrondis élégants
  const getBubbleStyles = (role: UserRole, isMe: boolean) => {
    if (isMe) {
      return {
        bubble: "bg-[#0f2744] dark:bg-[#e0521c] text-white rounded-2xl sm:rounded-[22px] rounded-br-xs shadow-[0_2px_8px_rgba(15,39,68,0.18)] dark:shadow-[0_2px_12px_rgba(224,82,28,0.25)]",
        name: "text-orange-200 dark:text-orange-100",
        avatar: "bg-[#0f2744] dark:bg-[#e0521c] text-white border-2 border-white dark:border-[#151D27]",
        accent: "#ffffff",
      };
    }

    if (role === "admin") {
      return {
        bubble: "bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] border border-purple-200 dark:border-purple-900/50 rounded-2xl sm:rounded-[22px] rounded-bl-xs shadow-[0_2px_8px_rgba(147,51,234,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
        name: "text-purple-700 dark:text-purple-400 font-bold",
        avatar: "bg-purple-600 text-white",
        accent: "#7e22ce",
      };
    }

    if (role === "professeur") {
      return {
        bubble: "bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] border border-blue-200/90 dark:border-[#263241] rounded-2xl sm:rounded-[22px] rounded-bl-xs shadow-[0_2px_8px_rgba(15,39,68,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
        name: "text-[#0f2744] dark:text-sky-400 font-bold",
        avatar: "bg-[#0f2744] dark:bg-sky-700 text-white",
        accent: "#0f2744",
      };
    }

    // etudiant
    return {
      bubble: "bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] border border-slate-200/90 dark:border-[#263241] rounded-2xl sm:rounded-[22px] rounded-bl-xs shadow-[0_2px_6px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]",
      name: "text-[#e0521c] dark:text-[#ff7539] font-bold",
      avatar: "bg-[#e0521c] text-white",
      accent: "#e0521c",
    };
  };

  // Filtrage recherche
  const filteredMessages = searchQuery.trim()
    ? messages.filter((m) => m.content.toLowerCase().includes(searchQuery.toLowerCase()))
    : messages;

  if (isPopup && !isOpen) return null;

  const chatContainer = (
    <div
      className={`bg-white dark:bg-[#111821] rounded-2xl flex flex-col overflow-hidden border border-slate-200/90 dark:border-[#263241] shadow-2xl relative ${
        isPopup
          ? isFullscreen
            ? "fixed inset-0 z-50 rounded-none w-screen h-screen"
            : "w-full max-w-6xl h-[92vh] max-h-[960px] mx-auto transition-all duration-300"
          : "h-[850px] min-h-[680px] w-full"
      }`}
    >
      {/* ─── Top Header WhatsApp ────────────────────────────────────────────── */}
      <div className="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50/95 dark:bg-[#111821]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-[#263241] flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          {/* Bouton retour / fermer WhatsApp */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Fermer le chat"
              className="p-2 -ml-1 text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-200/70 dark:hover:bg-[#151D27] rounded-full transition-colors flex items-center justify-center shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          {/* Avatar du salon avec ondulation circulaire */}
          <div className="relative shrink-0">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0f2744] to-[#1e3a5f] text-white flex items-center justify-center shadow-sm">
              <MessagesSquare className="w-5 h-5 text-[#e0521c]" />
            </div>
            <span
              className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#111821] animate-pulse"
              title="Salon en direct"
            />
          </div>

          {/* Titre & métadonnées du salon */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA] truncate">
                {roomTitle}
              </h2>

              {/* Dropdown de changement rapide de salon */}
              {salons && salons.length > 1 && onSelectSalon && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSalonsDropdownOpen((prev) => !prev)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/70 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] hover:bg-slate-300/70 dark:hover:bg-[#1c2633] transition-colors cursor-pointer"
                  >
                    <span>Changer</span>
                    <ChevronDown className="w-3 h-3 text-slate-500 dark:text-[#687585]" />
                  </button>

                  {salonsDropdownOpen && (
                    <div className="absolute left-0 top-full mt-1.5 w-56 bg-white dark:bg-[#151D27] rounded-xl shadow-xl border border-slate-200/90 dark:border-[#263241] py-1.5 z-50">
                      <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#687585]">
                        Basculer vers un salon
                      </div>
                      {salons.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onSelectSalon(s.id);
                            setSalonsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-[#111821] transition-colors cursor-pointer ${
                            s.id === roomId ? "font-bold text-[#0f2744] dark:text-[#F5F7FA] bg-blue-50/50 dark:bg-white/5" : "text-slate-700 dark:text-[#AAB4C0]"
                          }`}
                        >
                          <span className="truncate">{s.titre}</span>
                          {s.id === roomId && <span className="w-1.5 h-1.5 rounded-full bg-[#e0521c]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#AAB4C0] truncate mt-0.5">
              <span className="inline-flex items-center gap-1 font-mono text-[10.5px] text-[#e0521c] font-semibold">
                <Hash className="w-3 h-3" />
                {roomId}
              </span>
              <span className="text-slate-300 dark:text-[#263241]">•</span>
              <span className="truncate">{roomDescription}</span>
            </div>
          </div>
        </div>

        {/* Boutons d'actions WhatsApp (Recherche, plein écran, fermer) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen((prev) => !prev)}
            title="Rechercher dans la conversation"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isSearchOpen ? "bg-[#0f2744] dark:bg-[#e0521c] text-white" : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#151D27]"
            }`}
          >
            <Search className="w-4 h-4" />
          </button>

          {isPopup && (
            <button
              type="button"
              onClick={() => setIsFullscreen((prev) => !prev)}
              title={isFullscreen ? "Réduire la fenêtre" : "Plein écran"}
              className="p-2 text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#151D27] rounded-full transition-colors hidden sm:flex items-center justify-center cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}

          {isAdmin && (
            <span className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
              <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              Modérateur
            </span>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              title="Fermer"
              className="p-2 text-slate-400 dark:text-[#687585] hover:text-slate-700 dark:hover:text-[#F5F7FA] hover:bg-slate-200/70 dark:hover:bg-[#151D27] rounded-full transition-colors ml-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Barre de recherche toggleable */}
      {isSearchOpen && (
        <div className="px-4 py-2 bg-slate-100/90 dark:bg-[#151D27] border-b border-slate-200 dark:border-[#263241] flex items-center gap-2 z-20">
          <Search className="w-4 h-4 text-slate-400 dark:text-[#687585] shrink-0" />
          <input
            type="text"
            placeholder="Rechercher dans les messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-slate-800 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:outline-none"
            autoFocus
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-400 dark:text-[#687585] hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
            >
              Effacer
            </button>
          )}
        </div>
      )}

      {/* ─── Zone centrale avec fond fixe et liste défilante indépendante ── */}
      <div className="relative flex-1 min-h-0 overflow-hidden bg-white">
        {/* Fond blanc fixe avec les ondulations concentriques de gouttes d'eau (ne bouge jamais) */}
        <WaterRippleBackground />

        {/* Contenu des messages qui défile indépendamment par-dessus le fond fixe */}
        <div
          ref={messagesContainerRef}
          className="absolute inset-0 overflow-y-auto p-4 sm:p-6 space-y-4 z-10"
          onClick={() => setSelectedMsgId(null)}
        >
          {isLoading ? (
            <div className="h-96 flex flex-col items-center justify-center text-slate-400 gap-3">
              <div className="animate-spin rounded-full h-9 w-9 border-b-2 border-[#0f2744]"></div>
              <span className="text-xs font-medium text-slate-500">Chargement de la conversation…</span>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0f2744]/10 to-[#e0521c]/10 flex items-center justify-center text-[#0f2744] shadow-inner">
                <Sparkles className="w-7 h-7 text-[#e0521c]" />
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                {searchQuery ? "Aucun message trouvé" : "Salon de discussion ouvert"}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchQuery
                  ? "Aucun message ne correspond à votre recherche. Essayez un autre mot-clé."
                  : "Partagez vos questions, réponses ou notes vocales avec la communauté étudiante et le corps enseignant."}
              </p>
            </div>
          ) : (
            filteredMessages.map((msg) => {
              const isMe =
                (effectiveCurrentUser.id && effectiveCurrentUser.id !== "" && (msg.user_id === effectiveCurrentUser.id || msg.user?.id === effectiveCurrentUser.id)) ||
                (effectiveCurrentUser.email && effectiveCurrentUser.email !== "" && msg.user?.email && msg.user.email.toLowerCase() === effectiveCurrentUser.email.toLowerCase()) ||
                (effectiveCurrentUser.fullName && effectiveCurrentUser.fullName !== "" && msg.user?.full_name && msg.user.full_name.toLowerCase() === effectiveCurrentUser.fullName.toLowerCase());

              const authorRole = msg.user?.role || "etudiant";
              const authorName = msg.user?.full_name || "Membre HAS";
              const styles = getBubbleStyles(authorRole, Boolean(isMe));
              const voiceUrl = extractVoiceUrl(msg.content);
              const textContent = cleanMessageContent(msg.content);

              const avatarInitials = authorName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "HA";

              const formattedTime = new Date(msg.created_at).toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              // Résolution de l'avatar réel :
              let displayAvatar = (msg.user as { avatar_url?: string | null })?.avatar_url || null;
              if (isMe && !displayAvatar && myDetectedAvatar) {
                displayAvatar = myDetectedAvatar;
              }
              if (!displayAvatar && authorRole === "professeur") {
                const matchedProf = profsCache.find(
                  (p) =>
                    p.id === msg.user_id ||
                    (p.email && msg.user?.email && p.email.toLowerCase() === msg.user.email.toLowerCase()) ||
                    (p.full_name && p.full_name.toLowerCase() === authorName.toLowerCase())
                );
                if (matchedProf?.photo) {
                  displayAvatar = matchedProf.photo;
                }
              }
              if (!displayAvatar && authorRole === "admin") {
                displayAvatar = "/images/logo-has.jpg";
              }

              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${isMe ? "flex-row-reverse" : "flex-row"} items-end group`}
                >
                  {/* Avatar : photo de profil réelle si disponible, sinon initiales de secours */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 shadow-sm overflow-hidden ${styles.avatar}`}
                  >
                    {displayAvatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={displayAvatar}
                        alt={authorName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      avatarInitials
                    )}
                  </div>

                  <div className={`flex flex-col ${isMe ? "items-end" : "items-start"} max-w-[85%] sm:max-w-[75%] relative`}>
                    {/* Nom de l'expéditeur + badge de rôle */}
                    <div className={`flex items-center gap-1.5 mb-1 flex-wrap ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                      <span className={`text-xs font-bold ${styles.name}`}>
                        {isMe ? "Moi" : authorName}
                      </span>
                      {renderRoleBadge(authorRole)}
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formattedTime}
                      </span>
                    </div>

                    {/* Bulle de message façon WhatsApp avec coins arrondis */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAdmin || currentUser.role === "admin") {
                          setSelectedMsgId((prev) => (prev === msg.id ? null : msg.id));
                        }
                      }}
                      className={`relative px-4 py-2.5 text-sm leading-relaxed transition-all ${styles.bubble} ${
                        selectedMsgId === msg.id ? "ring-2 ring-red-400" : ""
                      }`}
                    >
                      {/* Message vocal Telegram */}
                      {voiceUrl ? (
                        <div className="py-0.5">
                          <TelegramVoiceNote
                            src={voiceUrl}
                            isMe={Boolean(isMe)}
                            roleAccent={styles.accent}
                            timestamp={formattedTime}
                            messageId={msg.id}
                          />
                          {textContent && (
                            <p className="mt-2 text-xs border-t border-white/20 pt-1.5">{textContent}</p>
                          )}
                        </div>
                      ) : (
                        <div className="break-words">
                          <p className="whitespace-pre-wrap">{msg.content}</p>
                          {isMe && (
                            <div className="flex items-center justify-end text-[9px] text-orange-200 mt-1">
                              <span className="font-bold text-emerald-300 tracking-wider">Lu</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Menu de modération pour administrateurs */}
                      {selectedMsgId === msg.id && (isAdmin || currentUser.role === "admin") && (
                        <div
                          className={`absolute ${isMe ? "right-0" : "left-0"} top-full mt-1.5 z-50 bg-white dark:bg-[#151D27] rounded-xl shadow-2xl border border-slate-200 dark:border-[#263241] overflow-hidden min-w-[150px] animate-in fade-in zoom-in-95`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              handleDeleteMessage(msg.id);
                              setSelectedMsgId(null);
                            }}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Supprimer ce message
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
      </div>

      {/* ─── Barre de saisie inférieure (WhatsApp / Telegram) ──────────────── */}
      <div className="p-3 sm:p-4 bg-slate-50/95 dark:bg-[#111821]/95 backdrop-blur-md border-t border-slate-200/90 dark:border-[#263241] shrink-0 z-20">
        {isRecording ? (
          /* Enregistreur vocal professionnel façon Telegram */
          <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-red-50/90 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl shadow-sm animate-in fade-in duration-150">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-600 animate-ping shrink-0" />
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-red-600 dark:text-red-400 animate-pulse" />
                <span className="font-mono text-xs font-bold text-red-700 dark:text-red-300">
                  {Math.floor(recordingSeconds / 60)}:
                  {(recordingSeconds % 60).toString().padStart(2, "0")}
                </span>
              </div>

              {/* Ondulations égaliseur dynamiques */}
              <div className="hidden sm:flex items-center gap-1 h-5 ml-2">
                {[14, 22, 10, 26, 18, 12, 28, 16, 24, 12, 18].map((h, i) => (
                  <span
                    key={i}
                    style={{
                      height: `${h}px`,
                      animationDuration: `${0.4 + (i % 3) * 0.2}s`,
                    }}
                    className="w-1 bg-red-500 rounded-full animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelRecording}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-[#AAB4C0] hover:text-red-700 dark:hover:text-rose-300 hover:bg-red-100 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleStopAndSendRecording}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-md hover:bg-red-700 transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Envoyer la note vocale</span>
              </button>
            </div>
          </div>
        ) : (
          /* Saisie classique de texte + bouton micro */
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                placeholder={`Écrivez votre message dans ${roomTitle}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (newMessage.trim()) handleSendMessage();
                  }
                }}
                className="w-full rounded-2xl border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] px-4 py-3 text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:ring-2 focus:ring-[#0f2744]/15 dark:focus:ring-[#e0521c]/20 transition-all shadow-xs"
              />
            </div>

            {/* Bouton Enregistrement Vocal façon Telegram */}
            <button
              type="button"
              onClick={handleStartRecording}
              title="Enregistrer un message vocal (façon Telegram)"
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-[#0f2744] dark:text-[#F5F7FA] hover:bg-orange-50 dark:hover:bg-orange-950/30 hover:text-[#e0521c] hover:border-orange-200 dark:hover:border-orange-900/50 shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Bouton Envoyer WhatsApp */}
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              title="Envoyer le message"
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-[#0f2744] dark:bg-[#e0521c] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#163860] dark:hover:bg-[#f06129] active:scale-95 shadow-md transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4 text-[#e0521c] dark:text-white" />
            </button>
          </form>
        )}

        <div className="flex items-center justify-between text-[11px] text-slate-400 dark:text-[#687585] mt-2 px-1">
          <span>Touche Entrée pour envoyer • Cliquez sur le micro 🎙 pour une note vocale</span>
          <span className="hidden sm:inline font-mono">Halil Académie Scientifique • Live Chat</span>
        </div>
      </div>
    </div>
  );

  // Si c'est en mode popup, l'encapsuler dans un backdrop WhatsApp moderne
  if (isPopup) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
        {chatContainer}
      </div>
    );
  }

  return chatContainer;
}
