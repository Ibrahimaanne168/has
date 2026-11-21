"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Search,
  Upload,
  FileText,
  Eye,
  ShieldCheck,
  Phone,
  User,
  Clock,
  Download,
  Check,
  Ban,
  Mail,
  Sparkles,
  Camera,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MarketplaceItem, MarketplaceOrder } from "@/lib/types";
import {
  getStoredMarketplaceItems,
  saveMarketplaceItem,
  deleteMarketplaceItem,
  syncMarketplaceWithServer,
  getStoredMarketplaceOrders,
  validateMarketplaceOrder,
  rejectMarketplaceOrder,
  syncMarketplaceOrdersWithServer,
  generateWhatsAppOrderUrl,
  createMarketplaceOrder,
} from "@/lib/marketplaceStorage";
import { WhatsAppIcon } from "@/components/marketplace/MarketplaceCard";

export default function AdminMarketplacePage() {
  const [activeTab, setActiveTab] = useState<"catalog" | "orders">("catalog");

  // Données
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [orders, setOrders] = useState<MarketplaceOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState<"all" | "en_attente" | "valide" | "refuse">("all");

  // Modals & Notifications
  const [modalOpen, setModalOpen] = useState(false);
  const [manualGrantModalOpen, setManualGrantModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Formulaire simplifié (Ultra-rapide, sans profs inutiles)
  const [formTitle, setFormTitle] = useState("");
  const [formPrice, setFormPrice] = useState("2000");
  const [formOriginalPrice, setFormOriginalPrice] = useState("");
  const [formWhatsApp, setFormWhatsApp] = useState("+221 77 551 81 96");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formFileSize, setFormFileSize] = useState("1.99 MB");
  const [formDescription, setFormDescription] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);

  // Formulaire d'octroi manuel d'accès direct
  const [grantItemId, setGrantItemId] = useState("");
  const [grantBuyerName, setGrantBuyerName] = useState("");
  const [grantBuyerEmail, setGrantBuyerEmail] = useState("");
  const [grantBuyerPhone, setGrantBuyerPhone] = useState("");

  const reload = () => {
    setItems(getStoredMarketplaceItems());
    setOrders(getStoredMarketplaceOrders());
  };

  useEffect(() => {
    reload();
    syncMarketplaceWithServer().then((res) => {
      if (res && res.length > 0) setItems(res);
    });
    syncMarketplaceOrdersWithServer().then((res) => {
      if (res && res.length > 0) setOrders(res);
    });

    const onUpdate = () => reload();
    window.addEventListener("has_marketplace_storage_updated", onUpdate);
    window.addEventListener("has_marketplace_orders_updated", onUpdate);
    return () => {
      window.removeEventListener("has_marketplace_storage_updated", onUpdate);
      window.removeEventListener("has_marketplace_orders_updated", onUpdate);
    };
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormPrice("2000");
    setFormOriginalPrice("");
    setFormWhatsApp("+221 77 551 81 96");
    setFormCoverUrl("");
    setFormPdfUrl("");
    setFormFileSize("1.99 MB");
    setFormDescription("");
    setFormIsActive(true);
    setModalOpen(true);
  };

  const openEditModal = (item: MarketplaceItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormPrice(item.price.toString());
    setFormOriginalPrice(item.original_price ? item.original_price.toString() : "");
    setFormWhatsApp(item.whatsapp_number || item.professeur_phone || "+221 77 551 81 96");
    setFormCoverUrl(item.cover_image_url || "");
    setFormPdfUrl(item.pdf_url || "");
    setFormFileSize(item.file_size || "1.99 MB");
    setFormDescription(item.description || "");
    setFormIsActive(item.is_active !== false);
    setModalOpen(true);
  };

  // Upload d'image de couverture optimisé pour mobile
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Aperçu local instantané sans attendre le réseau (0ms)
    try {
      const preview = URL.createObjectURL(file);
      setFormCoverUrl(preview);
    } catch {}

    setIsUploading(true);
    try {
      // Compression client si fichier photo volumineux (> 1MB)
      let uploadFile: Blob = file;
      if (file.type.startsWith("image/") && file.size > 1024 * 1024) {
        try {
          const img = new Image();
          img.src = URL.createObjectURL(file);
          await new Promise((res) => {
            img.onload = res;
          });
          const canvas = document.createElement("canvas");
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) {
              h = (h * maxDim) / w;
              w = maxDim;
            } else {
              w = (w * maxDim) / h;
              h = maxDim;
            }
          }
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, w, h);
          const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.85));
          if (blob) uploadFile = blob;
        } catch {}
      }

      const fd = new FormData();
      fd.append("file", uploadFile, file.name);
      fd.append("type", "cover");

      const res = await fetch("/api/marketplace/upload", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) setFormCoverUrl(json.url);
      }
    } catch {
      console.info("Upload serveur différé, aperçu local conservé");
    } finally {
      setIsUploading(false);
    }
  };

  // Upload du fichier PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const mb = (file.size / (1024 * 1024)).toFixed(2);
    setFormFileSize(`${mb} MB`);

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "pdf");

      const res = await fetch("/api/marketplace/upload", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) setFormPdfUrl(json.url);
      }
    } catch {
      console.info("Upload PDF différé");
    } finally {
      setIsUploading(false);
    }
  };

  // Validation et enregistrement fluide sans blocage
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Veuillez renseigner le titre du document.");
      return;
    }

    const priceNum = parseInt(formPrice, 10);
    const safePrice = isNaN(priceNum) || priceNum < 0 ? 2000 : priceNum;
    const originalPriceNum = formOriginalPrice.trim() ? parseInt(formOriginalPrice, 10) : null;
    const safePhone = formWhatsApp.trim() || "+221 77 551 81 96";
    const safeCover =
      formCoverUrl.trim() ||
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80";

    const payload: Partial<MarketplaceItem> = {
      ...(editingItem ? { id: editingItem.id } : {}),
      title: formTitle.trim(),
      description: formDescription.trim(),
      price: safePrice,
      original_price: originalPriceNum && !isNaN(originalPriceNum) ? originalPriceNum : null,
      file_size: formFileSize.trim() || "1.99 MB",
      currency: "FCFA",
      whatsapp_number: safePhone,
      professeur_phone: safePhone,
      professeur_name: "HAS Académie",
      cover_image_url: safeCover,
      pdf_url: formPdfUrl.trim() || null,
      is_active: formIsActive,
      featured: false,
    };

    // Fermeture immédiate de la modal pour ne pas bloquer l'admin
    setModalOpen(false);
    setSuccessMsg(editingItem ? "Document mis à jour avec succès !" : "Document ajouté au Marketplace !");

    await saveMarketplaceItem(payload);
    reload();

    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = async (id: string) => {
    await deleteMarketplaceItem(id);
    setDeleteConfirm(null);
    setSuccessMsg("Document retiré du Marketplace.");
    reload();
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleToggleActive = async (item: MarketplaceItem) => {
    await saveMarketplaceItem({
      ...item,
      is_active: !item.is_active,
    });
    reload();
  };

  // Validation d'une commande par l'admin
  const handleValidateDownload = async (order: MarketplaceOrder) => {
    await validateMarketplaceOrder(order.id, "Administrateur HAS");
    setSuccessMsg(`✓ Téléchargement validé pour ${order.buyer_name} (${order.item_title}) !`);
    reload();
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const handleRejectDownload = async (order: MarketplaceOrder) => {
    await rejectMarketplaceOrder(order.id);
    setSuccessMsg(`Commande #${order.id} refusée.`);
    reload();
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  // Octroi manuel direct
  const handleManualGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantItemId || !grantBuyerName.trim() || !grantBuyerEmail.trim()) {
      alert("Veuillez sélectionner un document et renseigner le nom et l'email.");
      return;
    }

    const item = items.find((i) => i.id === grantItemId);
    if (!item) return;

    const newOrder = await createMarketplaceOrder({
      item,
      buyerName: grantBuyerName.trim(),
      buyerEmail: grantBuyerEmail.trim(),
      buyerPhone: grantBuyerPhone.trim() || "+221 77 000 00 00",
    });

    await validateMarketplaceOrder(newOrder.id, "Administrateur HAS (Octroi direct)");

    setSuccessMsg(`✓ Accès au document « ${item.title} » accordé à ${grantBuyerName} !`);
    setManualGrantModalOpen(false);
    setGrantBuyerName("");
    setGrantBuyerEmail("");
    setGrantBuyerPhone("");
    reload();
    setTimeout(() => setSuccessMsg(null), 5000);
  };

  const pendingOrdersCount = orders.filter((o) => o.status === "en_attente").length;

  const filteredItems = items.filter((i) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      (i.whatsapp_number && i.whatsapp_number.includes(q)) ||
      (i.description && i.description.toLowerCase().includes(q))
    );
  });

  const filteredOrders = orders.filter((o) => {
    if (orderFilter !== "all" && o.status !== orderFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.item_title.toLowerCase().includes(q) ||
      o.buyer_name.toLowerCase().includes(q) ||
      o.buyer_email.toLowerCase().includes(q) ||
      o.id.toLowerCase().includes(q)
    );
  });

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@has-academie.online"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4 py-2">
        {/* En-tête de page responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-[#263241]">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-[#0f2744] text-white">
                <ShoppingBag className="w-5 h-5 text-[#e0521c]" />
              </span>
              <h1 className="font-serif text-xl sm:text-2xl font-black text-[#0f2744] dark:text-[#F5F7FA]">
                Marketplace des Fascicules &amp; Cours
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              Publiez des documents PDF avec commande WhatsApp et validation manuelle du téléchargement.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (items.length > 0) setGrantItemId(items[0].id);
                setManualGrantModalOpen(true);
              }}
              leftIcon={<ShieldCheck className="w-4 h-4 text-[#e0521c]" />}
              className="text-xs"
            >
              Octroyer un accès direct
            </Button>

            <Button
              variant="accent"
              size="sm"
              onClick={openCreateModal}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs"
            >
              Ajouter un document
            </Button>
          </div>
        </div>

        {/* Message de succès */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span className="font-semibold">{successMsg}</span>
          </div>
        )}

        {/* Onglets de navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-[#263241] pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab("catalog")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "catalog"
                ? "bg-[#0f2744] text-white shadow-xs"
                : "text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27]"
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catalogue ({items.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap relative ${
              activeTab === "orders"
                ? "bg-[#0f2744] text-white shadow-xs"
                : "text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27]"
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#e0521c]" />
            <span>Validations &amp; Téléchargements ({orders.length})</span>
            {pendingOrdersCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-[#e0521c] text-white text-[10px] font-black animate-pulse">
                {pendingOrdersCount}
              </span>
            )}
          </button>
        </div>

        {/* ============================================================== */}
        {/* ONGLET 1 : CATALOGUE DES DOCUMENTS                             */}
        {/* ============================================================== */}
        {activeTab === "catalog" && (
          <div className="space-y-4">
            {/* Barre de recherche */}
            <div className="bg-white dark:bg-[#111821] p-3 rounded-xl border border-slate-200 dark:border-[#263241] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher un document..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium self-end sm:self-center">
                Total : <strong>{filteredItems.length}</strong> document(s)
              </div>
            </div>

            {/* Grille des articles pour l'admin */}
            {filteredItems.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] space-y-3">
                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#151D27] text-slate-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6 text-[#e0521c]" />
                </div>
                <h3 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                  Aucun document publié pour le moment
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Cliquez sur « Ajouter un document » ci-dessous pour publier votre premier fascicule.
                </p>
                <Button variant="accent" size="sm" onClick={openCreateModal} leftIcon={<Plus className="w-4 h-4" />}>
                  Ajouter un document
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => {
                  const waUrl = generateWhatsAppOrderUrl(item);
                  const discountPercent =
                    item.original_price && item.original_price > item.price
                      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
                      : null;

                  return (
                    <div
                      key={item.id}
                      className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] overflow-hidden flex flex-col justify-between shadow-xs"
                    >
                      <div>
                        {/* Vignette couverture */}
                        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />

                          {/* Prix en haut à gauche */}
                          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 flex-wrap">
                            <span className="px-2 py-0.5 rounded-md bg-white text-red-600 text-[11px] font-black shadow-xs">
                              {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                            </span>
                            {item.original_price && (
                              <span className="px-1.5 py-0.5 rounded-md bg-black/70 text-white text-[10px] line-through font-semibold">
                                {item.original_price.toLocaleString("fr-FR")}
                              </span>
                            )}
                            {discountPercent && (
                              <span className="px-1.5 py-0.5 rounded-md bg-black text-white text-[10px] font-black">
                                -{discountPercent}% OFF
                              </span>
                            )}
                          </div>

                          {/* Statut actif / inactif */}
                          <div className="absolute top-2.5 right-2.5">
                            <button
                              onClick={() => handleToggleActive(item)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs cursor-pointer ${
                                item.is_active !== false ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                              }`}
                            >
                              {item.is_active !== false ? "En Vente" : "Désactivé"}
                            </button>
                          </div>

                          {/* Titre */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                            <p className="font-serif font-bold text-sm leading-tight drop-shadow-xs line-clamp-1">
                              {item.title}
                            </p>
                          </div>
                        </div>

                        {/* Coordonnées WhatsApp */}
                        <div className="p-3.5 space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 font-medium">WhatsApp Commande :</span>
                            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                              {item.whatsapp_number || item.professeur_phone || "+221 77 551 81 96"}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between gap-2">
                        <a
                          href={waUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-bold transition-colors"
                          title="Tester le lien WhatsApp"
                        >
                          <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>WhatsApp</span>
                        </a>

                        <div className="flex items-center gap-1">
                          <Link
                            href={`/marketplace/${item.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] hover:text-[#0f2744]"
                            title="Voir la page produit"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => openEditModal(item)}
                            className="p-1.5 rounded-lg text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] hover:text-[#0f2744] cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteConfirm(item.id)}
                            className="p-1.5 rounded-lg text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ONGLET 2 : DEMANDES DE VALIDATION & TÉLÉCHARGEMENTS            */}
        {/* ============================================================== */}
        {activeTab === "orders" && (
          <div className="space-y-4">
            {/* Filtres de statut */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {(["all", "en_attente", "valide", "refuse"] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderFilter(st)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                    orderFilter === st
                      ? "bg-[#0f2744] text-white"
                      : "bg-white dark:bg-[#111821] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#263241]"
                  }`}
                >
                  {st === "all"
                    ? "Toutes les commandes"
                    : st === "en_attente"
                    ? "En attente"
                    : st === "valide"
                    ? "Validées"
                    : "Refusées"}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-8 sm:p-12 text-center bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] space-y-2">
                <ShieldCheck className="w-8 h-8 text-slate-400 mx-auto" />
                <h3 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                  Aucune commande dans cette catégorie
                </h3>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-[#151D27] text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-[#263241]">
                      <tr>
                        <th className="p-3.5">Réf &amp; Date</th>
                        <th className="p-3.5">Document</th>
                        <th className="p-3.5">Acheteur</th>
                        <th className="p-3.5">Statut</th>
                        <th className="p-3.5 text-right">Action Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/60 dark:hover:bg-[#151D27]/50">
                          <td className="p-3.5 font-mono text-slate-400">
                            #{o.id}
                            <span className="block text-[10px] text-slate-400">
                              {new Date(o.created_at).toLocaleDateString("fr-FR")}
                            </span>
                          </td>
                          <td className="p-3.5 font-bold text-slate-900 dark:text-white">
                            {o.item_title}
                            <span className="block text-[11px] text-[#e0521c] font-normal">
                              {o.item_price.toLocaleString("fr-FR")} FCFA
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-slate-800 dark:text-slate-200 block">{o.buyer_name}</span>
                            <span className="text-[11px] text-slate-400">{o.buyer_email}</span>
                          </td>
                          <td className="p-3.5">
                            <Badge
                              variant={
                                o.status === "valide" ? "success" : o.status === "refuse" ? "danger" : "warning"
                              }
                              size="sm"
                            >
                              {o.status === "valide"
                                ? "Téléchargement Validé"
                                : o.status === "refuse"
                                ? "Refusé"
                                : "En attente"}
                            </Badge>
                          </td>
                          <td className="p-3.5 text-right">
                            {o.status === "en_attente" ? (
                              <div className="flex items-center justify-end gap-1.5">
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => handleValidateDownload(o)}
                                  className="text-[11px] py-1 px-2.5"
                                >
                                  Valider
                                </Button>
                                <button
                                  onClick={() => handleRejectDownload(o)}
                                  className="p-1 rounded-lg text-slate-400 hover:text-red-600"
                                  title="Refuser"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : o.status === "valide" ? (
                              <button
                                onClick={() => handleRejectDownload(o)}
                                className="text-[11px] text-red-500 hover:underline cursor-pointer"
                              >
                                Révoquer
                              </button>
                            ) : (
                              <button
                                onClick={() => handleValidateDownload(o)}
                                className="text-[11px] text-emerald-600 hover:underline cursor-pointer"
                              >
                                Réactiver
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL SIMPLIFIÉ D'AJOUT / MODIFICATION (100% MOBILE-FRIENDLY)   */}
        {/* ============================================================== */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4">
            <div className="w-full sm:max-w-xl bg-white dark:bg-[#111821] rounded-t-3xl sm:rounded-2xl max-h-[92dvh] sm:max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-[#263241] overflow-hidden animate-in slide-in-from-bottom duration-200">
              {/* En-tête modal fixe */}
              <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-[#263241] flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                      {editingItem ? "Modifier le document" : "Ajouter un document au Marketplace"}
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Renseignez le titre, le prix et le numéro WhatsApp pour les commandes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-[#151D27] cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Formulaire scrollable */}
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {/* 1. Titre du document */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                    Titre du document <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Décroche ton premier job"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                  />
                </div>

                {/* 2. Prix de vente & Prix d'origine barré */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Prix de Vente (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      placeholder="2000"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm font-bold text-red-600 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Prix barré (Optionnel)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      placeholder="10000"
                      value={formOriginalPrice}
                      onChange={(e) => setFormOriginalPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-base sm:text-sm rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-400 line-through focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                    />
                  </div>
                </div>

                {/* 3. Numéro WhatsApp pour recevoir les commandes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] flex items-center gap-1.5">
                    <WhatsAppIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Numéro WhatsApp de réception des commandes</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+221 77 551 81 96"
                    value={formWhatsApp}
                    onChange={(e) => setFormWhatsApp(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base sm:text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[11px] text-slate-400">Le bouton « Acheter » ouvrira directement une discussion WhatsApp vers ce numéro.</p>
                </div>

                {/* 4. Vignette / Image de couverture (Bouton photo tactile pour téléphone) */}
                <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-[#263241] bg-slate-50/50 dark:bg-[#151D27]/30">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block">
                    Vignette / Photo du Livre (Mockup)
                  </label>

                  {formCoverUrl ? (
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formCoverUrl} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Image sélectionnée
                        </span>
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-semibold cursor-pointer hover:bg-slate-300">
                          <Camera className="w-3.5 h-3.5" />
                          <span>Changer la photo</span>
                          <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full py-4 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-[#0f2744] flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-white dark:bg-[#111821] text-slate-600 dark:text-slate-300 transition-colors">
                      <Camera className="w-6 h-6 text-[#0f2744] dark:text-[#e0521c]" />
                      <span className="text-xs font-bold">Prendre une photo ou choisir une image</span>
                      <span className="text-[10px] text-slate-400">JPG, PNG ou WebP</span>
                      <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* 5. Document PDF lié (Optionnel à la création) */}
                <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-[#263241]">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block">
                    Fichier PDF du cours (Document final à télécharger)
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Lien PDF (ou cliquez sur Parcourir)"
                      value={formPdfUrl}
                      onChange={(e) => setFormPdfUrl(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-lg bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241]"
                    />
                    <label className="cursor-pointer px-3 py-2 rounded-lg bg-slate-100 dark:bg-[#151D27] text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>PDF</span>
                      <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                {/* 6. Description (Optionnelle) */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                    Description &amp; Sommaire (Optionnel)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Présentez brièvement les chapitres abordés..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white"
                  />
                </div>

                {/* Bouton de soumission tactile fixe dans le bas du modal */}
                <div className="pt-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-end gap-2">
                  <Button variant="ghost" size="md" type="button" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="primary" size="md" type="submit" isLoading={isUploading}>
                    {editingItem ? "Enregistrer" : "Publier le document"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal octroi manuel */}
        {manualGrantModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 dark:border-[#263241] shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#263241]">
                <h3 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                  Accorder un accès direct
                </h3>
                <button onClick={() => setManualGrantModalOpen(false)} className="p-1.5 text-slate-400">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleManualGrantSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-white block mb-1">
                    Sélectionner le document
                  </label>
                  <select
                    value={grantItemId}
                    onChange={(e) => setGrantItemId(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241]"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.title} ({i.price} FCFA)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-white block mb-1">
                    Nom de l&apos;étudiant
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ibrahima Anne"
                    value={grantBuyerName}
                    onChange={(e) => setGrantBuyerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-white block mb-1">
                    Email de l&apos;étudiant
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="etudiant@uam.edu.sn"
                    value={grantBuyerEmail}
                    onChange={(e) => setGrantBuyerEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241]"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" type="button" onClick={() => setManualGrantModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="primary" size="sm" type="submit">
                    Valider l&apos;accès
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Confirmation suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-sm w-full p-5 space-y-3 border border-slate-200 dark:border-[#263241] shadow-2xl">
              <h3 className="font-serif text-base font-bold text-red-600">Supprimer ce document ?</h3>
              <p className="text-xs text-slate-500">Cette action retirera le document de la vente.</p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                  Annuler
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>
                  Supprimer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
