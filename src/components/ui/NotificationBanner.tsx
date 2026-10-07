"use client";

import React, { useEffect, useState } from "react";
import { Bell, X, CheckCircle2, BookOpen, Calendar, Megaphone } from "lucide-react";
import { registerPushNotifications, flushPendingNotifications } from "@/lib/useNotifications";

interface MissedNotif {
  id: string;
  type: string;
  title: string;
  body: string;
  url?: string;
  stored_at: number;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
  cours: <BookOpen className="w-4 h-4 text-blue-400" />,
  edt: <Calendar className="w-4 h-4 text-amber-400" />,
  communique: <Megaphone className="w-4 h-4 text-[#e0521c]" />,
};

export function NotificationBanner() {
  const [askVisible, setAskVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");
  const [missed, setMissed] = useState<MissedNotif[]>([]);
  const [showMissed, setShowMissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    // 1. Demander permission si pas encore répondue
    if (Notification.permission === "default") {
      setAskVisible(true);
    }

    // 2. Flush notifs manquées à la connexion (délai court pour laisser le SW démarrer)
    const timer = setTimeout(async () => {
      try {
        const flushed = await flushPendingNotifications();
        if (flushed.length > 0) {
          setMissed(flushed as MissedNotif[]);
          setShowMissed(true);
        }
      } catch {}
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAccept = async () => {
    setStatus("loading");
    const granted = await registerPushNotifications();
    if (granted) {
      setStatus("granted");
      setTimeout(() => setAskVisible(false), 2000);
    } else {
      setStatus("denied");
      setTimeout(() => setAskVisible(false), 2500);
    }
  };

  return (
    <>
      {/* ── Bannière demande permission ─────────────────────────── */}
      {askVisible && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-md"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-[#0f2744] text-white rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-4 border border-white/10">
            {/* Icône officielle nette HAS */}
            <div className="mt-0.5 shrink-0">
              <div className="w-11 h-11 rounded-xl overflow-hidden bg-white shadow-md ring-1 ring-white/20 flex items-center justify-center p-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo-has.jpg"
                  alt="Logo HAS"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold leading-tight mb-0.5">Activer les notifications</p>
              <p className="text-xs text-white/70 leading-snug">
                Soyez notifié dès qu&apos;un cours, un EDT ou un communiqué est publié — même hors-ligne.
              </p>

              {status === "granted" && (
                <p className="mt-1.5 text-xs text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Notifications activées !
                </p>
              )}
              {status === "denied" && (
                <p className="mt-1.5 text-xs text-red-400">Permission refusée.</p>
              )}

              {status === "idle" && (
                <div className="flex items-center gap-2 mt-3">
                  <button
                    id="notif-accept-btn"
                    onClick={handleAccept}
                    className="px-4 py-1.5 rounded-lg bg-[#e0521c] hover:bg-[#c84418] text-white text-xs font-bold transition-all active:scale-95"
                  >
                    Accepter
                  </button>
                  <button
                    id="notif-dismiss-btn"
                    onClick={() => setAskVisible(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/80 font-semibold transition-all"
                  >
                    Plus tard
                  </button>
                </div>
              )}

              {status === "loading" && (
                <p className="mt-2 text-xs text-white/60 animate-pulse">Activation en cours...</p>
              )}
            </div>

            <button
              id="notif-close-btn"
              onClick={() => setAskVisible(false)}
              className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-all"
              aria-label="Fermer"
            >
              <X className="w-4 h-4 text-white/60" />
            </button>
          </div>
        </div>
      )}

      {/* ── Notifs manquées à la reconnexion ───────────────────── */}
      {showMissed && missed.length > 0 && (
        <div
          className="fixed top-20 right-4 z-[9998] w-[92vw] max-w-sm space-y-2"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-white dark:bg-[#111821] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#263241] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0f2744] dark:bg-[#151D27] text-white border-b border-transparent dark:border-[#263241]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg overflow-hidden bg-white shadow-xs flex items-center justify-center p-0.5 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo-has.jpg"
                    alt="Logo HAS"
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-xs font-bold text-white dark:text-[#F5F7FA]">
                  {missed.length} notification{missed.length > 1 ? "s" : ""} récente{missed.length > 1 ? "s" : ""}
                </span>
              </div>
              <button
                onClick={() => setShowMissed(false)}
                className="p-1 rounded-md hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Liste */}
            <div className="divide-y divide-slate-100 dark:divide-[#263241] max-h-72 overflow-y-auto">
              {missed.map((n) => (
                <a
                  key={n.id}
                  href={n.url || "/"}
                  onClick={() => setShowMissed(false)}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-[#151D27] transition-colors group"
                >
                  <span className="mt-0.5 shrink-0">
                    {TYPE_ICON[n.type] || <Bell className="w-4 h-4 text-slate-400 dark:text-[#687585]" />}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] truncate group-hover:text-[#0f2744] dark:group-hover:text-[#e0521c]">
                      {n.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] truncate">{n.body}</p>
                    <p className="text-[10px] text-slate-400 dark:text-[#687585] mt-0.5">
                      {new Date(n.stored_at).toLocaleString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#151D27] border-t border-slate-100 dark:border-[#263241] flex justify-end">
              <button
                onClick={() => setShowMissed(false)}
                className="text-xs font-semibold text-[#0f2744] dark:text-[#e0521c] hover:underline transition-colors cursor-pointer"
              >
                Tout marquer comme lu
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
