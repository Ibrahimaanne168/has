// HAS University - Service Worker for Push Notifications v2.0.0
// Logo clair (PNG 192px) + stockage des notifs manquées

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));

const ICON = "/images/logo-has.jpg";
const BADGE = "/android-chrome-192x192.png";
const PENDING_STORE = "has_pending_notifs_sw";

// ── Utilitaire IDB minimaliste ─────────────────────────────────────────────
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("has_sw_store", 1);
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(PENDING_STORE, { keyPath: "id" });
    };
    req.onsuccess = (e) => resolve(e.target.result);
    req.onerror = (e) => reject(e.target.error);
  });
}

async function storePending(notif) {
  try {
    const db = await openDB();
    const tx = db.transaction(PENDING_STORE, "readwrite");
    tx.objectStore(PENDING_STORE).put({ ...notif, stored_at: Date.now() });
    await new Promise((r, j) => { tx.oncomplete = r; tx.onerror = j; });
    db.close();
  } catch (err) {
    console.warn("[HAS SW] storePending error:", err);
  }
}

async function getPending() {
  try {
    const db = await openDB();
    const tx = db.transaction(PENDING_STORE, "readonly");
    const all = await new Promise((r, j) => {
      const req = tx.objectStore(PENDING_STORE).getAll();
      req.onsuccess = () => r(req.result);
      req.onerror = () => j(req.error);
    });
    db.close();
    return all || [];
  } catch {
    return [];
  }
}

async function clearPending(ids) {
  try {
    const db = await openDB();
    const tx = db.transaction(PENDING_STORE, "readwrite");
    const store = tx.objectStore(PENDING_STORE);
    ids.forEach((id) => store.delete(id));
    await new Promise((r, j) => { tx.oncomplete = r; tx.onerror = j; });
    db.close();
  } catch {}
}

// ── Réception push distant ──────────────────────────────────────────────────
self.addEventListener("push", (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || "",
    icon: ICON,
    badge: BADGE,
    tag: data.tag || "has-notif",
    renotify: true,
    data: { url: data.url || "/" },
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(data.title || "HAS", options));
});

// ── Message depuis la page (envoi local via SW) ─────────────────────────────
self.addEventListener("message", (event) => {
  if (!event.data) return;

  if (event.data.type === "SHOW_NOTIF") {
    const { title, body, url, tag } = event.data.payload;
    const options = {
      body: body || "",
      icon: ICON,
      badge: BADGE,
      tag: tag || "has-notif",
      renotify: true,
      data: { url: url || "/" },
      vibrate: [200, 100, 200],
    };
    event.waitUntil(
      self.registration.showNotification(title || "HAS", options)
    );
  }

  // Stocker une notif pour plus tard (hors-ligne)
  if (event.data.type === "STORE_PENDING") {
    event.waitUntil(storePending(event.data.payload));
  }

  // La page se reconnecte → envoyer les notifs manquées
  if (event.data.type === "FLUSH_PENDING") {
    event.waitUntil(
      getPending().then(async (pending) => {
        if (!pending.length) return;
        for (const p of pending) {
          await self.registration.showNotification(p.title || "HAS", {
            body: p.body || "",
            icon: ICON,
            badge: BADGE,
            tag: p.tag || "has-notif",
            renotify: true,
            data: { url: p.url || "/" },
          });
        }
        await clearPending(pending.map((p) => p.id));
      })
    );
  }
});

// ── Clic sur une notification ───────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && "focus" in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
