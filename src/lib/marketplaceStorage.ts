import { MarketplaceItem, MarketplaceOrder } from "@/lib/types";
import { MOCK_MARKETPLACE_ITEMS } from "@/lib/data/marketplace-data";

const STORAGE_KEY = "has_marketplace_items_v1";
const ORDERS_STORAGE_KEY = "has_marketplace_orders_v1";

const INITIAL_MOCK_ORDERS: MarketplaceOrder[] = [];

/**
 * Nettoie et formate un numéro de téléphone pour WhatsApp (ex: +221 77 551 81 96 -> 221775518196)
 */
export function formatWhatsAppNumber(phone: string): string {
  if (!phone) return "221775518196"; // Numéro officiel HAS par défaut
  let cleaned = phone.replace(/[^0-9]/g, "");
  // Si numéro sénégalais à 9 chiffres sans indicatif (ex: 775518196)
  if (cleaned.length === 9) {
    cleaned = "221" + cleaned;
  }
  return cleaned;
}

/**
 * Construit l'URL WhatsApp avec message prérempli professionnel façon Chariow
 */
export function generateWhatsAppOrderUrl(item: MarketplaceItem): string {
  const phone = formatWhatsAppNumber(item.whatsapp_number || item.professeur_phone || "+221 77 551 81 96");
  const formattedPrice = item.price.toLocaleString("fr-FR");
  const message = `Bonjour,\n\nJe souhaite commander le document sur le Marketplace HAS :\n📄 *${item.title}*\n💰 *Prix :* ${formattedPrice} ${item.currency || "FCFA"}\n\nMerci de m'indiquer la démarche pour effectuer le paiement et recevoir le document PDF.`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

const DEMO_FAKE_IDS = [
  "mkt-poo-python-guide",
  "mkt-analyse-1-pack",
  "mkt-meca-point-thermo",
  "mkt-algebre-lineaire-3",
  "mkt-electromagnetisme-l2",
  "mkt-sql-bdd-guide",
];

/**
 * Récupère les articles en cache local ou mock
 */
export function getStoredMarketplaceItems(): MarketplaceItem[] {
  if (typeof window === "undefined") {
    return MOCK_MARKETPLACE_ITEMS;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Éliminer les anciens faux cours de démo
      const cleaned = parsed.filter((i: MarketplaceItem) => !DEMO_FAKE_IDS.includes(i.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
  } catch (err) {
    console.warn("[Marketplace] Erreur lecture localStorage:", err);
  }

  return [];
}

/**
 * Sauvegarde les articles localement et déclenche un événement
 */
export function saveStoredMarketplaceItems(items: MarketplaceItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("has_marketplace_storage_updated", { detail: items }));
  } catch (err) {
    console.error("[Marketplace] Erreur sauvegarde localStorage:", err);
  }
}

/**
 * Sauvegarde ou met à jour un item
 */
export async function saveMarketplaceItem(item: Partial<MarketplaceItem>): Promise<MarketplaceItem> {
  const current = getStoredMarketplaceItems();
  let updatedItem: MarketplaceItem;

  if (item.id) {
    const idx = current.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      updatedItem = {
        ...current[idx],
        ...item,
        updated_at: new Date().toISOString(),
      } as MarketplaceItem;
      current[idx] = updatedItem;
    } else {
      updatedItem = {
        id: item.id,
        title: item.title || "Document sans titre",
        description: item.description || "",
        price: Number(item.price) || 0,
        currency: item.currency || "FCFA",
        cover_image_url: item.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
        pdf_url: item.pdf_url || null,
        professeur_id: item.professeur_id || null,
        professeur_name: item.professeur_name || "Enseignant HAS",
        professeur_phone: item.professeur_phone || "+221 77 551 81 96",
        professeur_avatar: item.professeur_avatar || null,
        matiere: item.matiere || "Général",
        niveau: item.niveau || "Tous",
        pages_count: item.pages_count ? Number(item.pages_count) : undefined,
        badge: item.badge || undefined,
        is_active: item.is_active !== undefined ? item.is_active : true,
        featured: Boolean(item.featured),
        created_at: item.created_at || new Date().toISOString(),
      };
      current.unshift(updatedItem);
    }
  } else {
    updatedItem = {
      id: `mkt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: item.title || "Document sans titre",
      description: item.description || "",
      price: Number(item.price) || 0,
      currency: item.currency || "FCFA",
      cover_image_url: item.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      pdf_url: item.pdf_url || null,
      professeur_id: item.professeur_id || null,
      professeur_name: item.professeur_name || "Enseignant HAS",
      professeur_phone: item.professeur_phone || "+221 77 551 81 96",
      professeur_avatar: item.professeur_avatar || null,
      matiere: item.matiere || "Général",
      niveau: item.niveau || "Tous",
      pages_count: item.pages_count ? Number(item.pages_count) : undefined,
      badge: item.badge || undefined,
      is_active: item.is_active !== undefined ? item.is_active : true,
      featured: Boolean(item.featured),
      created_at: new Date().toISOString(),
    };
    current.unshift(updatedItem);
  }

  saveStoredMarketplaceItems(current);

  // Synchronisation immédiate vers l'API serveur (en arrière-plan avec timeout pour ne JAMAIS bloquer l'interface)
  try {
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

    fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
      signal: controller?.signal,
    })
      .catch(() => {})
      .finally(() => {
        if (timeoutId) clearTimeout(timeoutId);
      });
  } catch (err) {
    console.info("[Marketplace] Synchro serveur non bloquante");
  }

  return updatedItem;
}

/**
 * Supprime un item
 */
export async function deleteMarketplaceItem(id: string): Promise<boolean> {
  const current = getStoredMarketplaceItems();
  const filtered = current.filter((i) => i.id !== id);
  saveStoredMarketplaceItems(filtered);

  try {
    await fetch(`/api/marketplace?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.info("[Marketplace] Suppression serveur non bloquante");
  }

  return true;
}

/**
 * Synchronise les items avec le serveur
 */
export async function syncMarketplaceWithServer(): Promise<MarketplaceItem[]> {
  try {
    const res = await fetch("/api/marketplace");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveStoredMarketplaceItems(data);
        return data;
      }
    }
  } catch (err) {
    // Mode hors-ligne / fallback local
  }
  return getStoredMarketplaceItems();
}

/**
 * ==============================================================================
 * GESTION DES COMMANDES & VALIDATION ADMINISTRATIVE DES TÉLÉCHARGEMENTS
 * ==============================================================================
 */

export function getStoredMarketplaceOrders(): MarketplaceOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleaned = parsed.filter((o: MarketplaceOrder) => !["ord-demo-01", "ord-demo-02"].includes(o.id));
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
  } catch (err) {
    console.warn("[Orders] Erreur lecture localStorage:", err);
  }
  return [];
}

export function saveStoredMarketplaceOrders(orders: MarketplaceOrder[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    window.dispatchEvent(new CustomEvent("has_marketplace_orders_updated", { detail: orders }));
  } catch (err) {
    console.error("[Orders] Erreur sauvegarde localStorage:", err);
  }
}

/**
 * Enregistre une nouvelle demande d'achat / téléchargement (statut initial: en_attente)
 */
export async function createMarketplaceOrder(params: {
  item: MarketplaceItem;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerUserId?: string | null;
}): Promise<MarketplaceOrder> {
  const current = getStoredMarketplaceOrders();
  const newOrder: MarketplaceOrder = {
    id: `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    item_id: params.item.id,
    item_title: params.item.title,
    item_price: params.item.price,
    item_pdf_url: params.item.pdf_url || null,
    buyer_name: params.buyerName.trim(),
    buyer_email: params.buyerEmail.trim().toLowerCase(),
    buyer_phone: params.buyerPhone.trim(),
    buyer_user_id: params.buyerUserId || null,
    status: "en_attente",
    validated_at: null,
    validated_by: null,
    download_count: 0,
    created_at: new Date().toISOString(),
  };

  current.unshift(newOrder);
  saveStoredMarketplaceOrders(current);

  // Sync API
  try {
    await fetch("/api/marketplace/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });
  } catch {}

  return newOrder;
}

/**
 * L'administrateur valide manuellement le téléchargement du document
 */
export async function validateMarketplaceOrder(orderId: string, adminName = "Administration HAS"): Promise<boolean> {
  const current = getStoredMarketplaceOrders();
  const idx = current.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;

  current[idx] = {
    ...current[idx],
    status: "valide",
    validated_at: new Date().toISOString(),
    validated_by: adminName,
    updated_at: new Date().toISOString(),
  };

  saveStoredMarketplaceOrders(current);

  try {
    await fetch("/api/marketplace/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        status: "valide",
        validated_by: adminName,
      }),
    });
  } catch {}

  return true;
}

/**
 * L'administrateur refuse ou révoque l'accès
 */
export async function rejectMarketplaceOrder(orderId: string): Promise<boolean> {
  const current = getStoredMarketplaceOrders();
  const idx = current.findIndex((o) => o.id === orderId);
  if (idx === -1) return false;

  current[idx] = {
    ...current[idx],
    status: "refuse",
    updated_at: new Date().toISOString(),
  };

  saveStoredMarketplaceOrders(current);

  try {
    await fetch("/api/marketplace/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: orderId,
        status: "refuse",
      }),
    });
  } catch {}

  return true;
}

/**
 * Synchronise les commandes avec le serveur
 */
export async function syncMarketplaceOrdersWithServer(): Promise<MarketplaceOrder[]> {
  try {
    const res = await fetch("/api/marketplace/orders");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        saveStoredMarketplaceOrders(data);
        return data;
      }
    }
  } catch {}
  return getStoredMarketplaceOrders();
}

