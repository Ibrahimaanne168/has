"use client";
/**
 * useNotifications � Hook HAS University
 * G�re l'inscription aux notifications push (Service Worker + Notification API)
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

/** Enregistre le service worker et demande la permission � l'utilisateur */
export async function registerPushNotifications(): Promise<boolean> {
  if (typeof window === "undefined") return false;
  if (!("Notification" in window) || !("serviceWorker" in navigator)) return false;

  // Demande la permission si pas encore accord�e
  const permission = await Notification.requestPermission();
  if (permission !== "granted") return false;

  try {
    // Enregistrer le SW si ce n'est pas d�j� fait
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    return true;
  } catch (err) {
    console.error("[HAS] SW registration error:", err);
    return false;
  }
}

/** V�rifie si les notifications sont autoris�es */
export function areNotificationsGranted(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window && Notification.permission === "granted";
}

/**
 * Envoie une notification locale via le Service Worker enregistr�.
 * Si le SW n'est pas disponible, utilise Notification() directement.
 */
export async function sendLocalNotification(payload: HASNotifPayload): Promise<void> {
  if (!areNotificationsGranted()) return;

  const { title, body, url = "/", tag = payload.type } = payload;

  try {
    const reg = await navigator.serviceWorker.ready;
    await reg.showNotification(title, {
      body,
      icon: "/favicon.ico",
      badge: "/favicon.ico",
      tag,
      renotify: true,
      data: { url },
      // @ts-expect-error � vibrate not in all TS typings
      vibrate: [200, 100, 200],
    });
  } catch {
    // Fallback
    new Notification(title, { body, tag });
  }
}
