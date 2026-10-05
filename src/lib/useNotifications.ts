"use client";

/**
 * useNotifications - Hook HAS University
 * Gere l'inscription aux notifications push (Service Worker + Notification API)
 * et l'envoi de notifications locales directement via le SW.
 */

export type HASNotifType = "cours" | "edt" | "communique";

export interface HASNotifPayload {
  type: HASNotifType;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

/** Enregistre le service worker et demande la permission a l'utilisateur */
export async function registerPushNotifications(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return false;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  try {
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return true;
  } catch (err) {
    console.error("[HAS] SW registration error:", err);
    return false;
  }
}

/** Verifie si les notifications sont autorisees */
export function areNotificationsGranted(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window && Notification.permission === "granted";
}

/**
 * Envoie une notification locale via le Service Worker enregistre.
 * Si le SW n'est pas disponible, utilise Notification() directement.
 */
export async function sendLocalNotification(payload: HASNotifPayload): Promise<void> {
  if (!areNotificationsGranted()) return;

  const { title, body, url = "/", tag = payload.type } = payload;

  try {
    const reg = await navigator.serviceWorker.ready;
    const options: NotificationOptions & Record<string, unknown> = {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag,
      renotify: true,
      data: { url },
      vibrate: [200, 100, 200],
    };
    await reg.showNotification(title, options);
  } catch {
    new Notification(title, { body, tag });
  }
}
