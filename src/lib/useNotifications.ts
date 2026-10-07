"use client";

/**
 * useNotifications - Hook HAS University v2.0
 * - Logo PNG net (192px) pour les notifications système
 * - Stockage des notifs manquées → affichage à la reconnexion
 * - Envoi via SW avec message channel (icône correcte)
 */

export type HASNotifType = "cours" | "edt" | "communique";

export interface HASNotifPayload {
  type: HASNotifType;
  title: string;
  body: string;
  url?: string;
  tag?: string;
}

interface PendingNotif extends HASNotifPayload {
  id: string;
  stored_at: number;
}

const ICON = "/images/logo-has.jpg";
const BADGE = "/android-chrome-192x192.png";
const PENDING_KEY = "has_pending_notifs_v2";
const LAST_SYNC_KEY = "has_last_sync_publications_v2";

// ── Helpers localStorage pour notifs manquées ───────────────────────────────
function getPendingNotifs(): PendingNotif[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || "[]");
  } catch {
    return [];
  }
}

function setPendingNotifs(list: PendingNotif[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify(list));
  } catch {}
}

function storePendingNotif(payload: HASNotifPayload): void {
  const current = getPendingNotifs();
  const id = `${payload.tag || payload.type}-${Date.now()}`;
  // Éviter les doublons (même tag dans les 10 dernières secondes)
  const isDuplicate = current.some(
    (p) => p.tag === payload.tag && Date.now() - p.stored_at < 10000
  );
  if (!isDuplicate) {
    current.push({ ...payload, id, stored_at: Date.now() });
    setPendingNotifs(current);
  }
}

function clearPendingNotifs(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(PENDING_KEY);
}

// ── Enregistrement SW ───────────────────────────────────────────────────────
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

export function areNotificationsGranted(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window && Notification.permission === "granted";
}

// ── Envoi d'une notification locale via SW ──────────────────────────────────
export async function sendLocalNotification(payload: HASNotifPayload): Promise<void> {
  const granted = areNotificationsGranted();

  // Toujours stocker pour les utilisateurs hors-ligne
  storePendingNotif(payload);

  if (!granted) return;

  const { title, body, url = "/", tag = payload.type } = payload;

  try {
    // Priorité : SW (logo correct)
    const reg = await navigator.serviceWorker.ready;
    const controller = reg.active || navigator.serviceWorker.controller;

    if (controller) {
      controller.postMessage({
        type: "SHOW_NOTIF",
        payload: { title, body, url, tag },
      });
    } else {
      // Fallback : showNotification direct avec bon icône
      await reg.showNotification(title, {
        body,
        icon: ICON,
        badge: BADGE,
        tag,
        renotify: true,
        data: { url },
        vibrate: [200, 100, 200],
      } as NotificationOptions);
    }

    // Notif envoyée → supprimer du pending
    const pending = getPendingNotifs();
    setPendingNotifs(pending.filter((p) => p.tag !== tag));
  } catch {
    try {
      new Notification(title, { body, tag, icon: ICON });
    } catch {}
  }
}

/**
 * Appelé au montage du layout (connexion utilisateur).
 * Vérifie toutes les publications (cours, EDT, communiqués) parues
 * pendant que l'utilisateur n'était pas connecté, et les lui notifie immédiatement.
 */
export async function flushPendingNotifications(): Promise<PendingNotif[]> {
  if (typeof window === "undefined") return [];

  // 1. Détection des nouveautés parues hors-ligne depuis la dernière visite
  try {
    const rawLastSync = localStorage.getItem(LAST_SYNC_KEY);
    const now = Date.now();
    // Si premier chargement, regarder les publications des dernières 24h
    const lastSyncTime = rawLastSync ? parseInt(rawLastSync, 10) : now - 24 * 3600 * 1000;

    // Cours récents
    try {
      const coursesRaw = localStorage.getItem("has_academic_courses_v1");
      if (coursesRaw) {
        const courses = JSON.parse(coursesRaw);
        for (const c of courses) {
          const t = new Date(c.created_at).getTime();
          if (t > lastSyncTime) {
            storePendingNotif({
              type: "cours",
              title: "Nouveau cours disponible 📚",
              body: `${c.title}${c.matiere?.name ? " — " + c.matiere.name : ""}`.trim(),
              url: "/etudiant/cours",
              tag: `cours-${c.id}`,
            });
          }
        }
      }
    } catch {}

    // Emplois du temps récents
    try {
      const edtsRaw = localStorage.getItem("has_academic_edts_v1");
      if (edtsRaw) {
        const edts = JSON.parse(edtsRaw);
        for (const e of edts) {
          const t = new Date(e.created_at).getTime();
          if (t > lastSyncTime) {
            storePendingNotif({
              type: "edt",
              title: "Emploi du temps mis à jour 📅",
              body: `${e.title || "Nouvel emploi du temps"} disponible.`,
              url: "/etudiant/edt",
              tag: `edt-${e.id}`,
            });
          }
        }
      }
    } catch {}

    // Communiqués récents
    try {
      const comsRaw = localStorage.getItem("has_academic_communiques_v1");
      if (comsRaw) {
        const coms = JSON.parse(comsRaw);
        for (const c of coms) {
          const t = new Date(c.created_at).getTime();
          if (t > lastSyncTime) {
            storePendingNotif({
              type: "communique",
              title: "Nouveau communiqué officiel 📢",
              body: c.title || "Une note d'information a été publiée.",
              url: "/etudiant/communiques",
              tag: `communique-${c.id}`,
            });
          }
        }
      }
    } catch {}

    // Mettre à jour l'horodatage de synchronisation
    localStorage.setItem(LAST_SYNC_KEY, String(now));
  } catch (err) {
    console.warn("[HAS] Erreur sync publications hors-ligne:", err);
  }

  const pending = getPendingNotifs();
  if (!pending.length) return [];

  // Trier par date
  const sorted = [...pending].sort((a, b) => a.stored_at - b.stored_at);

  if (areNotificationsGranted()) {
    try {
      const reg = await navigator.serviceWorker.ready;
      const controller = reg.active || navigator.serviceWorker.controller;
      if (controller) {
        for (const p of sorted) {
          controller.postMessage({
            type: "SHOW_NOTIF",
            payload: {
              title: p.title,
              body: p.body,
              url: p.url || "/",
              tag: p.tag || p.type,
            },
          });
        }
      } else {
        for (const p of sorted) {
          await reg.showNotification(p.title, {
            body: p.body,
            icon: ICON,
            badge: BADGE,
            tag: p.tag || p.type,
            renotify: true,
            data: { url: p.url || "/" },
          } as NotificationOptions);
        }
      }
    } catch {}
  }

  clearPendingNotifs();
  return sorted;
}
