import { MarketplaceItem } from "@/lib/types";
import { MOCK_MARKETPLACE_ITEMS } from "@/lib/data/marketplace-data";

const STORAGE_KEY = "has_marketplace_items_v1";

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
  const phone = formatWhatsAppNumber(item.professeur_phone);
  const formattedPrice = item.price.toLocaleString("fr-FR");
  const message = `Bonjour Professeur ${item.professeur_name},\n\nJe souhaite commander votre document sur le Marketplace HAS :\n📄 *${item.title}*\n💰 *Prix :* ${formattedPrice} ${item.currency || "FCFA"}\n🎓 *Niveau :* ${item.niveau || "Tous"}\n\nMerci de m'indiquer la démarche pour effectuer le paiement et recevoir le document PDF.`;
  
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

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
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_MARKETPLACE_ITEMS));
      return MOCK_MARKETPLACE_ITEMS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn("[Marketplace] Erreur lecture localStorage:", err);
  }

  return MOCK_MARKETPLACE_ITEMS;
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

  // Tentative de synchronisation vers l'API serveur si disponible
  try {
    await fetch("/api/marketplace", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedItem),
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
