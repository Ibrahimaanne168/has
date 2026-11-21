"use client";

import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  X,
  Search,
  Filter,
  Upload,
  FileText,
  Eye,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Phone,
  User,
  DollarSign,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MarketplaceItem } from "@/lib/types";
import {
  getStoredMarketplaceItems,
  saveMarketplaceItem,
  deleteMarketplaceItem,
  syncMarketplaceWithServer,
  generateWhatsAppOrderUrl,
} from "@/lib/marketplaceStorage";
import { getStoredProfesseurs, getStoredMatieres } from "@/lib/academicStorage";
import { WhatsAppIcon } from "@/components/marketplace/MarketplaceCard";

export default function AdminMarketplacePage() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MarketplaceItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Données académiques pour pré-remplissage rapide
  const [profs, setProfs] = useState<any[]>([]);
  const [matieres, setMatieres] = useState<any[]>([]);

  // Champs de formulaire
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formPrice, setFormPrice] = useState("3500");
  const [formProfName, setFormProfName] = useState("");
  const [formProfPhone, setFormProfPhone] = useState("+221 77 551 81 96");
  const [formProfAvatar, setFormProfAvatar] = useState("");
  const [formMatiere, setFormMatiere] = useState("");
  const [formNiveau, setFormNiveau] = useState("L1");
  const [formPages, setFormPages] = useState("");
  const [formBadge, setFormBadge] = useState("");
  const [formCoverUrl, setFormCoverUrl] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formFeatured, setFormFeatured] = useState(false);

  const reload = () => {
    setItems(getStoredMarketplaceItems());
    setProfs(getStoredProfesseurs());
    setMatieres(getStoredMatieres());
  };

  useEffect(() => {
    reload();
    syncMarketplaceWithServer().then((res) => {
      if (res && res.length > 0) setItems(res);
    });

    const onUpdate = () => reload();
    window.addEventListener("has_marketplace_storage_updated", onUpdate);
    return () => window.removeEventListener("has_marketplace_storage_updated", onUpdate);
  }, []);

  // Déclencher remplissage automatique quand on change de prof
  const handleProfSelect = (profId: string) => {
    const p = profs.find((pr) => pr.id === profId);
    if (p) {
      setFormProfName(p.full_name || `${p.prenom || ""} ${p.nom || ""}`.trim());
      if (p.phone) setFormProfPhone(p.phone);
      if (p.avatar_url || p.photo) setFormProfAvatar(p.avatar_url || p.photo);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormTitle("");
    setFormDescription("");
    setFormPrice("3500");

    const defaultProf = profs[0];
    if (defaultProf) {
      setFormProfName(defaultProf.full_name || `${defaultProf.prenom || ""} ${defaultProf.nom || ""}`.trim());
      setFormProfPhone(defaultProf.phone || "+221 77 551 81 96");
      setFormProfAvatar(defaultProf.avatar_url || defaultProf.photo || "");
    } else {
      setFormProfName("Ibrahima Anne");
      setFormProfPhone("+221 77 551 81 96");
      setFormProfAvatar("");
    }

    setFormMatiere(matieres[0]?.name || "Analyse 1");
    setFormNiveau("L1");
    setFormPages("80");
    setFormBadge("");
    setFormCoverUrl("https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80");
    setFormPdfUrl("");
    setFormIsActive(true);
    setFormFeatured(false);
    setModalOpen(true);
  };

  const openEditModal = (item: MarketplaceItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormDescription(item.description);
    setFormPrice(item.price.toString());
    setFormProfName(item.professeur_name);
    setFormProfPhone(item.professeur_phone);
    setFormProfAvatar(item.professeur_avatar || "");
    setFormMatiere(item.matiere || "");
    setFormNiveau(item.niveau || "Tous");
    setFormPages(item.pages_count ? item.pages_count.toString() : "");
    setFormBadge(item.badge || "");
    setFormCoverUrl(item.cover_image_url);
    setFormPdfUrl(item.pdf_url || "");
    setFormIsActive(item.is_active !== false);
    setFormFeatured(Boolean(item.featured));
    setModalOpen(true);
  };

  // Upload d'image de couverture
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", "cover");

      const res = await fetch("/api/marketplace/upload", {
        method: "POST",
        body: fd,
      });

      if (res.ok) {
        const json = await res.json();
        if (json.url) setFormCoverUrl(json.url);
      } else {
        alert("Erreur lors de l'upload de la couverture.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau pendant l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // Upload de PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      } else {
        alert("Erreur lors de l'upload du fichier PDF.");
      }
    } catch (err) {
      console.error(err);
      alert("Erreur réseau pendant l'upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      alert("Veuillez renseigner un titre.");
      return;
    }
    const priceNum = parseInt(formPrice, 10);
    if (isNaN(priceNum) || priceNum < 0) {
      alert("Veuillez renseigner un prix valide en FCFA.");
      return;
    }
    if (!formProfPhone.trim()) {
      alert("Veuillez renseigner le numéro WhatsApp du professeur.");
      return;
    }

    const payload: Partial<MarketplaceItem> = {
      ...(editingItem ? { id: editingItem.id } : {}),
      title: formTitle.trim(),
      description: formDescription.trim(),
      price: priceNum,
      currency: "FCFA",
      professeur_name: formProfName.trim(),
      professeur_phone: formProfPhone.trim(),
      professeur_avatar: formProfAvatar || null,
      matiere: formMatiere.trim() || undefined,
      niveau: formNiveau,
      pages_count: formPages ? parseInt(formPages, 10) : undefined,
      badge: formBadge.trim() || undefined,
      cover_image_url: formCoverUrl.trim() || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      pdf_url: formPdfUrl.trim() || null,
      is_active: formIsActive,
      featured: formFeatured,
    };

    await saveMarketplaceItem(payload);
    setSuccessMsg(editingItem ? "Document mis à jour avec succès !" : "Document ajouté au Marketplace !");
    setModalOpen(false);
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

  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.professeur_name.toLowerCase().includes(q) ||
      (item.matiere && item.matiere.toLowerCase().includes(q))
    );
  });

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-6">
        {/* Header Supervision */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#e0521c]/10 text-[#e0521c] text-xs font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Boutique Académique · Gestion Administrateur</span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              Marketplace : Fascicules &amp; Documents PDF à Vendre
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              Gérez les documents payants mis en vente pour chaque enseignant. Le bouton de commande redirige directement vers le numéro WhatsApp du professeur concerné.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/marketplace"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 dark:bg-[#151D27] text-slate-700 dark:text-[#F5F7FA] text-xs font-semibold hover:bg-slate-200 transition-colors"
            >
              <Eye className="w-3.5 h-3.5 text-[#e0521c]" />
              <span>Voir la boutique publique</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <Button
              variant="accent"
              size="md"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={openCreateModal}
              className="rounded-xl text-xs sm:text-sm font-semibold shadow-xs"
            >
              Ajouter un document
            </Button>
          </div>
        </div>

        {/* Message de succès */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Barre de recherche */}
        <div className="bg-white dark:bg-[#111821] p-4 rounded-xl border border-slate-200/90 dark:border-[#263241] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#687585]" />
            <input
              type="text"
              placeholder="Rechercher par titre, enseignant ou matière..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-lg bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-[#AAB4C0] font-medium">
            Total : <strong>{filteredItems.length}</strong> document(s)
          </div>
        </div>

        {/* Grille des articles pour l'admin */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredItems.map((item) => {
            const waUrl = generateWhatsAppOrderUrl(item);

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] overflow-hidden flex flex-col justify-between shadow-xs transition-colors"
              >
                <div>
                  {/* Vignette miniature */}
                  <div className="relative aspect-[16/9] bg-slate-900 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.cover_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/95 text-[#0f2744] text-[10px] font-black uppercase tracking-wider shadow-xs">
                        {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                      </span>
                      {item.niveau && (
                        <span className="px-2 py-0.5 rounded-md bg-[#0f2744]/90 text-white text-[10px] font-bold uppercase tracking-wider">
                          {item.niveau}
                        </span>
                      )}
                    </div>

                    <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-xs ${
                          item.is_active !== false
                            ? "bg-emerald-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                        title="Cliquer pour basculer la visibilité"
                      >
                        {item.is_active !== false ? "En Vente" : "Désactivé"}
                      </button>
                    </div>

                    {/* Titre superposé */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <p className="font-serif font-bold text-sm leading-tight drop-shadow-xs line-clamp-1">
                        {item.title}
                      </p>
                    </div>
                  </div>

                  {/* Détails */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#e0521c] font-bold uppercase tracking-wider text-[10px]">
                        {item.matiere || "Ressource"}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    {/* Enseignant et son WhatsApp */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-semibold text-xs text-slate-800 dark:text-[#F5F7FA]">
                          Prof. {item.professeur_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                        <Phone className="w-3.5 h-3.5" />
                        <span>{item.professeur_phone}</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-[#AAB4C0] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Actions admin */}
                <div className="p-4 pt-0 border-t border-slate-100 dark:border-[#263241] mt-2 flex items-center justify-between gap-2">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] dark:text-[#25D366] text-xs font-bold transition-colors"
                    title="Tester le lien WhatsApp pré-rempli"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Tester WhatsApp</span>
                  </a>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(item)}
                      className="p-1.5 rounded-lg text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] hover:text-[#0f2744] transition-colors"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(item.id)}
                      className="p-1.5 rounded-lg text-red-600 dark:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 transition-colors"
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

        {/* Confirmation de suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-sm w-full p-6 space-y-4 border border-slate-200 dark:border-[#263241] shadow-2xl">
              <h3 className="font-serif text-lg font-bold text-red-600 dark:text-rose-400">
                Confirmer la suppression
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
                Êtes-vous sûr de vouloir retirer ce document du Marketplace ? Cette action est irréversible.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>
                  Annuler
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>
                  Supprimer définitivement
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* MODAL CRÉATION / MODIFICATION D'UN DOCUMENT                    */}
        {/* ============================================================== */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-[#263241] shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#263241]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    {editingItem ? "Modifier le document Marketplace" : "Ajouter un nouveau document au Marketplace"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-0.5">
                    Définissez le prix, la vignette et le numéro WhatsApp de l&apos;enseignant pour les commandes.
                  </p>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-[#151D27]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* 1. Titre & Prix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Titre du document <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Fascicule Ultime : POO Python & Corrigés d'Examens"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Prix (FCFA) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="500"
                      placeholder="3500"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs sm:text-sm font-bold text-[#e0521c] rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                    />
                  </div>
                </div>

                {/* 2. Matière & Niveau */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Niveau concerné
                    </label>
                    <select
                      value={formNiveau}
                      onChange={(e) => setFormNiveau(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-800 dark:text-white"
                    >
                      <option value="L1">Licence 1</option>
                      <option value="L2">Licence 2</option>
                      <option value="Tous">Tous Niveaux (L1 &amp; L2)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Matière
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Programmation Python, Analyse 1..."
                      value={formMatiere}
                      onChange={(e) => setFormMatiere(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Nombre de pages
                    </label>
                    <input
                      type="number"
                      placeholder="84"
                      value={formPages}
                      onChange={(e) => setFormPages(e.target.value)}
                      className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {/* 3. Enseignant & Numéro WhatsApp */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/90 dark:border-[#263241] space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#0f2744] dark:text-[#F5F7FA] flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#e0521c]" />
                      <span>Enseignant &amp; Coordonnées WhatsApp</span>
                    </label>

                    {profs.length > 0 && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-400">Remplissage rapide :</span>
                        <select
                          onChange={(e) => handleProfSelect(e.target.value)}
                          className="px-2 py-1 text-xs rounded-lg bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] text-slate-700 dark:text-[#F5F7FA]"
                        >
                          <option value="">Sélectionner un enseignant...</option>
                          {profs.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.full_name || p.nom}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-[#AAB4C0] block mb-1">
                        Nom de l&apos;enseignant
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ibrahima Anne"
                        value={formProfName}
                        onChange={(e) => setFormProfName(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-500 dark:text-[#AAB4C0] block mb-1">
                        Numéro WhatsApp pour recevoir les commandes (avec +221)
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+221 77 551 81 96"
                        value={formProfPhone}
                        onChange={(e) => setFormProfPhone(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 rounded-lg bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241]"
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                    Description &amp; Sommaire détaillé du document
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Détaillez le contenu, les chapitres abordés, les exercices corrigés, les astuces d'examens..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white"
                  />
                </div>

                {/* 5. Vignette & Fichier PDF */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Vignette couverture */}
                  <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-[#263241]">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block">
                      Vignette / Mockup de Couverture (Image)
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="URL de l'image de couverture"
                        value={formCoverUrl}
                        onChange={(e) => setFormCoverUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241]"
                      />
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151D27] text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Fichier</span>
                        <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                      </label>
                    </div>

                    {formCoverUrl && (
                      <div className="w-16 h-10 rounded-md overflow-hidden border border-slate-200">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={formCoverUrl} alt="Aperçu" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  {/* Fichier PDF lié */}
                  <div className="space-y-2 p-3.5 rounded-xl border border-dashed border-slate-200 dark:border-[#263241]">
                    <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block">
                      Fichier PDF source (Optionnel)
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Lien PDF (ou upload)"
                        value={formPdfUrl}
                        onChange={(e) => setFormPdfUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241]"
                      />
                      <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151D27] text-xs font-semibold hover:bg-slate-200 flex items-center gap-1 shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>PDF</span>
                        <input type="file" accept="application/pdf" onChange={handlePdfUpload} className="hidden" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* 6. Options de mise en avant et visibilité */}
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                    <input
                      type="checkbox"
                      checked={formIsActive}
                      onChange={(e) => setFormIsActive(e.target.checked)}
                      className="rounded text-[#0f2744] focus:ring-0 w-4 h-4"
                    />
                    <span>Document actif (visible pour la commande)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#e0521c]">
                    <input
                      type="checkbox"
                      checked={formFeatured}
                      onChange={(e) => setFormFeatured(e.target.checked)}
                      className="rounded text-[#e0521c] focus:ring-0 w-4 h-4"
                    />
                    <span>Mettre en avant sur la page d&apos;accueil</span>
                  </label>
                </div>

                {/* Actions modal */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#263241] flex items-center justify-end gap-3">
                  <Button variant="ghost" size="md" type="button" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button variant="primary" size="md" type="submit" isLoading={isUploading}>
                    {editingItem ? "Enregistrer les modifications" : "Publier sur le Marketplace"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
