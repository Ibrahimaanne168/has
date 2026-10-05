"use client";
/**
 * NotificationBanner – HAS University
 * Invite l'utilisateur à activer les notifications push au premier chargement.
 * S'affiche uniquement si la permission n'est pas encore accordée ou refusée.
 */

import React, { useEffect, useState } from "react";
import { Bell, X, CheckCircle2 } from "lucide-react";
import { registerPushNotifications } from "@/lib/useNotifications";

export function NotificationBanner() {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "granted" | "denied">("idle");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;
    // Show only if permission not yet decided
    if (Notification.permission === "default") {
      setVisible(true);
    }
  }, []);

  const handleAccept = async () => {
    setStatus("loading");
    const granted = await registerPushNotifications();
    if (granted) {
      setStatus("granted");
      setTimeout(() => setVisible(false), 2000);
    } else {
      setStatus("denied");
      setTimeout(() => setVisible(false), 2500);
    }
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[92vw] max-w-md"
      role="alert"
      aria-live="polite"
    >
      <div className="bg-[#0f2744] text-white rounded-2xl shadow-2xl px-5 py-4 flex items-start gap-4 border border-white/10">
        {/* Icon */}
        <div className="mt-0.5 shrink-0">
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#e0521c]/20">
            <Bell className="w-5 h-5 text-[#e0521c]" />
          </span>
        </div>

        {/* Text */}
        <div className="flex-1">
          <p className="text-sm font-bold leading-tight mb-0.5">Activer les notifications</p>
          <p className="text-xs text-white/70 leading-snug">
            Soyez alerté dès qu&apos;un cours, un EDT ou un communiqué est publié.
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
                onClick={() => setVisible(false)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs text-white/80 font-semibold transition-all"
              >
                Plus tard
              </button>
            </div>
          )}

          {status === "loading" && (
            <p className="mt-2 text-xs text-white/60 animate-pulse">Activation en cours…</p>
          )}
        </div>

        {/* Close */}
        <button
          id="notif-close-btn"
          onClick={() => setVisible(false)}
          className="shrink-0 p-1 rounded-lg hover:bg-white/10 transition-all"
          aria-label="Fermer"
        >
          <X className="w-4 h-4 text-white/60" />
        </button>
      </div>
    </div>
  );
}
