"use client";

import React, { useState } from "react";
import {
  FileText,
  User,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Eye,
  X,
  Clock,
  Download,
  AlertCircle,
  Phone,
  Mail,
} from "lucide-react";
import { MarketplaceItem, MarketplaceOrder } from "@/lib/types";
import { generateWhatsAppOrderUrl, createMarketplaceOrder } from "@/lib/marketplaceStorage";

interface MarketplaceCardProps {
  item: MarketplaceItem;
  featured?: boolean;
}

// Icône WhatsApp officielle SVG soignée
export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.71 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function MarketplaceCard({ item, featured = false }: MarketplaceCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  // Formulaire de commande
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [orderSubmitted, setOrderSubmitted] = useState<MarketplaceOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vérification de téléchargement
  const [downloadCheckLoading, setDownloadCheckLoading] = useState(false);
  const [downloadCheckMsg, setDownloadCheckMsg] = useState<{ type: "success" | "pending" | "error"; text: string } | null>(null);

  const whatsappUrl = generateWhatsAppOrderUrl(item);

  // Pré-remplissage avec l'utilisateur connecté si présent
  const handleOpenOrder = () => {
    if (typeof window !== "undefined") {
      try {
        const student = localStorage.getItem("has_current_student_profile_v2");
        if (student) {
          const parsed = JSON.parse(student);
          if (parsed.full_name) setBuyerName(parsed.full_name);
          if (parsed.email) setBuyerEmail(parsed.email);
          if (parsed.phone || parsed.telephone) setBuyerPhone(parsed.phone || parsed.telephone);
        }
      } catch {}
    }
    setOrderSubmitted(null);
    setDownloadCheckMsg(null);
    setOrderModalOpen(true);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      alert("Veuillez renseigner votre nom, email et téléphone pour enregistrer la commande.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createMarketplaceOrder({
        item,
        buyerName: buyerName.trim(),
        buyerEmail: buyerEmail.trim(),
        buyerPhone: buyerPhone.trim(),
      });

      setOrderSubmitted(order);

      // Ouvrir WhatsApp dans un nouvel onglet avec message personnalisé contenant le numéro de commande
      const phoneClean = item.professeur_phone.replace(/[^0-9]/g, "");
      const finalPhone = phoneClean.length === 9 ? "221" + phoneClean : phoneClean;
      const formattedPrice = item.price.toLocaleString("fr-FR");
      const waMsg = `Bonjour Professeur ${item.professeur_name},\n\nJe souhaite commander votre document sur HAS :\n📄 *${item.title}*\n💰 *Prix :* ${formattedPrice} ${item.currency || "FCFA"}\n👤 *Acheteur :* ${buyerName.trim()} (${buyerEmail.trim()})\n🔖 *Réf Commande :* #${order.id}\n\nMerci de m'indiquer la démarche pour régler afin que l'administration valide mon téléchargement.`;
      
      const customWaUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(waMsg)}`;
      window.open(customWaUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckDownloadStatus = async () => {
    if (!buyerEmail.trim()) {
      alert("Veuillez renseigner votre adresse email pour vérifier votre accès.");
      return;
    }

    setDownloadCheckLoading(true);
    setDownloadCheckMsg(null);

    try {
      const res = await fetch(`/api/marketplace/download?itemId=${encodeURIComponent(item.id)}&email=${encodeURIComponent(buyerEmail.trim())}`);
      if (res.ok) {
        setDownloadCheckMsg({
          type: "success",
          text: "Votre accès est validé par l'administration ! Téléchargement en cours...",
        });
        window.location.href = `/api/marketplace/download?itemId=${encodeURIComponent(item.id)}&email=${encodeURIComponent(buyerEmail.trim())}`;
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setDownloadCheckMsg({
            type: "pending",
            text: "Votre commande est bien enregistrée mais toujours EN ATTENTE de validation par l'administration HAS après vérification du règlement.",
          });
        } else {
          setDownloadCheckMsg({
            type: "error",
            text: data.error || "Aucune commande validée trouvée pour cet email.",
          });
        }
      }
    } catch (err) {
      setDownloadCheckMsg({
        type: "error",
        text: "Erreur de connexion au serveur de vérification.",
      });
    } finally {
      setDownloadCheckLoading(false);
    }
  };

  return (
    <>
      <div
        className={`group bg-white dark:bg-[#111821] rounded-2xl border transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_12px_30px_-8px_rgba(15,39,68,0.15)] dark:hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)] ${
          featured
            ? "border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-400/20"
            : "border-slate-200/90 dark:border-[#263241] hover:border-slate-300 dark:hover:border-[#38485c]"
        }`}
      >
        {/* ============================================================== */}
        {/* VIGNETTE STYLE CHARIOW (MOCKUP COUVERTURE 3D / CARD VISUAL)      */}
        {/* ============================================================== */}
        <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setDetailsOpen(true)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.cover_image_url}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          />

          {/* Dégradé d'ombre pour lisibilité textuelle */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

          {/* Badge format en haut à gauche */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white/95 text-[#0f2744] text-[10px] font-extrabold uppercase tracking-wider shadow-sm backdrop-blur-xs">
              <FileText className="w-3 h-3 text-[#e0521c]" />
              PDF {item.pages_count ? `· ${item.pages_count} p.` : ""}
            </span>

            {item.niveau && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0f2744]/90 text-white text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs">
                {item.niveau}
              </span>
            )}
          </div>

          {/* Badge marketing (Best-seller, Nouveau, etc.) */}
          {item.badge && (
            <div className="absolute top-3 right-3 z-10">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3 h-3" />
                {item.badge}
              </span>
            </div>
          )}

          {/* Auteur incrusté en bas de la vignette */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-white/20 ring-1 ring-white/50 overflow-hidden shrink-0 flex items-center justify-center text-xs">
                {item.professeur_avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.professeur_avatar} alt={item.professeur_name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <span className="text-xs font-semibold truncate text-slate-100 drop-shadow-xs">
                Prof. {item.professeur_name}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setDetailsOpen(true);
              }}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 text-white/90 hover:text-white backdrop-blur-xs transition-colors shrink-0"
              title="Aperçu des détails"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CORPS DE LA CARTE                                              */}
        {/* ============================================================== */}
        <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            {/* Matière */}
            {item.matiere && (
              <span className="text-[11px] font-bold text-[#e0521c] tracking-wider uppercase block">
                {item.matiere}
              </span>
            )}

            {/* Titre */}
            <h3
              onClick={() => setDetailsOpen(true)}
              className="font-serif text-base sm:text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug line-clamp-2 hover:text-[#e0521c] dark:hover:text-[#e0521c] cursor-pointer transition-colors"
            >
              {item.title}
            </h3>

            {/* Extrait description */}
            <p className="text-xs text-slate-600 dark:text-[#AAB4C0] line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* ============================================================== */}
          {/* PRIX ET BOUTON COMMANDER                                       */}
          {/* ============================================================== */}
          <div className="pt-3 border-t border-slate-100 dark:border-[#263241] space-y-3">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-[#687585] uppercase tracking-wider block">
                  Prix officiel
                </span>
                <span className="font-serif text-xl sm:text-2xl font-black text-[#0f2744] dark:text-[#F5F7FA]">
                  {item.price.toLocaleString("fr-FR")}{" "}
                  <span className="text-xs font-bold text-[#e0521c]">
                    {item.currency || "FCFA"}
                  </span>
                </span>
              </div>

              <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Validation Admin</span>
              </div>
            </div>

            {/* BOUTON COMMANDER AVEC VALIDATION ADMIN */}
            <button
              onClick={handleOpenOrder}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-[0_2px_10px_-2px_rgba(37,211,102,0.4)] transition-all transform active:scale-98 cursor-pointer"
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span>Commander via WhatsApp</span>
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* MODAL DE COMMANDE & ENREGISTREMENT DE VALIDATION ADMIN          */}
      {/* ============================================================== */}
      {orderModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-[#263241] p-6 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#263241]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#25D366]/15 text-[#25D366] flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                    Commander le document
                  </h3>
                  <span className="text-[11px] text-slate-400 block font-medium">Validation administrative requise</span>
                </div>
              </div>
              <button
                onClick={() => setOrderModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Récapitulatif du document */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-serif font-bold text-xs text-[#0f2744] dark:text-white line-clamp-1">
                  {item.title}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0]">
                  Par Prof. {item.professeur_name}
                </p>
                <span className="text-xs font-black text-[#e0521c]">
                  {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                </span>
              </div>
            </div>

            {/* Note d'information sur la validation de l'admin */}
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
              <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Fonctionnement :</strong> Votre commande est enregistrée dans le système HAS. Après avoir contacté l&apos;enseignant et réglé par Wave / OM, <strong>l&apos;administrateur valide le téléchargement</strong> pour débloquer votre accès au document PDF.
              </p>
            </div>

            {orderSubmitted ? (
              /* Écran de succès après enregistrement */
              <div className="space-y-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <h4 className="font-serif font-bold text-emerald-900 dark:text-emerald-200 text-sm">
                    Demande de commande enregistrée !
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 leading-relaxed">
                    La discussion WhatsApp s&apos;est ouverte avec Prof. <strong>{item.professeur_name}</strong>.
                    Une fois votre règlement vérifié, l&apos;administration validera votre téléchargement.
                  </p>
                  <div className="pt-1 text-[11px] font-mono text-slate-500">
                    Réf : #{orderSubmitted.id}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
                  <button
                    onClick={handleCheckDownloadStatus}
                    disabled={downloadCheckLoading}
                    className="w-full py-2.5 rounded-xl bg-[#0f2744] hover:bg-[#1a3d66] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloadCheckLoading ? "Vérification en cours..." : "Vérifier si l'admin a validé mon téléchargement"}</span>
                  </button>

                  {downloadCheckMsg && (
                    <div
                      className={`p-3 rounded-lg text-xs leading-relaxed ${
                        downloadCheckMsg.type === "success"
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : downloadCheckMsg.type === "pending"
                          ? "bg-amber-50 text-amber-800 border border-amber-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {downloadCheckMsg.text}
                    </div>
                  )}

                  <button
                    onClick={() => setOrderModalOpen(false)}
                    className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:text-[#AAB4C0]"
                  >
                    Fermer cette fenêtre
                  </button>
                </div>
              </div>
            ) : (
              /* Formulaire de coordonnées acheteur */
              <form onSubmit={handleOrderSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block mb-1">
                    Votre Nom &amp; Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Cheikh Anta Diop"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block mb-1">
                    Votre Adresse Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="exemple@email.com"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Sert à activer votre droit de téléchargement une fois validé.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block mb-1">
                    Votre Numéro WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="+221 77 000 00 00"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all active:scale-98"
                  >
                    <WhatsAppIcon className="w-4 h-4 text-white" />
                    <span>{isSubmitting ? "Enregistrement..." : "Commander et ouvrir WhatsApp"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL D'APERÇU DÉTAILLÉ DU DOCUMENT                           */}
      {/* ============================================================== */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 dark:border-[#263241] my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Header modal */}
            <div className="relative aspect-[16/9] bg-slate-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <button
                onClick={() => setDetailsOpen(false)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] bg-white/10 px-2.5 py-0.5 rounded-md backdrop-blur-xs inline-block mb-1">
                  {item.matiere || "Ressource Académique"} · {item.niveau || "Tous Niveaux"}
                </span>
                <h2 className="font-serif text-lg sm:text-xl font-bold leading-tight drop-shadow-xs">
                  {item.title}
                </h2>
              </div>
            </div>

            {/* Contenu */}
            <div className="p-6 space-y-5">
              {/* Enseignant */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#0f2744] text-white flex items-center justify-center overflow-hidden shrink-0">
                    {item.professeur_avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.professeur_avatar} alt={item.professeur_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 dark:text-[#687585] block font-medium">Auteur & Enseignant</span>
                    <span className="font-serif font-bold text-sm text-[#0f2744] dark:text-[#F5F7FA]">
                      Prof. {item.professeur_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 dark:text-[#687585] block font-medium">WhatsApp direct</span>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 font-mono">
                    {item.professeur_phone}
                  </span>
                </div>
              </div>

              {/* Description complète */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#AAB4C0]">
                  Présentation du document
                </h4>
                <p className="text-sm text-slate-700 dark:text-[#C5D0DC] leading-relaxed whitespace-pre-line">
                  {item.description}
                </p>
              </div>

              {/* Avantages & Garanties */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-[#AAB4C0]">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#151D27]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Format PDF Haute Définition</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#151D27]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{item.pages_count ? `${item.pages_count} pages` : "Support complet"}</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#151D27]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validation admin requise</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#151D27]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Conforme au programme HAS</span>
                </div>
              </div>

              {/* Action commande */}
              <div className="pt-4 border-t border-slate-100 dark:border-[#263241] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 dark:text-[#687585] block font-medium">Montant :</span>
                  <span className="font-serif text-2xl font-black text-[#0f2744] dark:text-[#F5F7FA]">
                    {item.price.toLocaleString("fr-FR")}{" "}
                    <span className="text-sm font-bold text-[#e0521c]">{item.currency || "FCFA"}</span>
                  </span>
                </div>

                <button
                  onClick={() => {
                    setDetailsOpen(false);
                    handleOpenOrder();
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Commander maintenant</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
