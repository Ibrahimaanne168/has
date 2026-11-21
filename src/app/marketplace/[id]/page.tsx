"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  FileText,
  Eye,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  Phone,
  User,
  Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceItem, MarketplaceOrder } from "@/lib/types";
import {
  getStoredMarketplaceItems,
  createMarketplaceOrder,
  syncMarketplaceWithServer,
} from "@/lib/marketplaceStorage";
import { WhatsAppIcon } from "@/components/marketplace/MarketplaceCard";

export default function MarketplaceProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulaire de commande (Nom + Numéro uniquement)
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState<MarketplaceOrder | null>(null);

  // Vérification de téléchargement par code de commande ou numéro WhatsApp
  const [downloadIdentifier, setDownloadIdentifier] = useState("");
  const [showCheckDownloadInput, setShowCheckDownloadInput] = useState(false);
  const [downloadCheckLoading, setDownloadCheckLoading] = useState(false);
  const [downloadCheckMsg, setDownloadCheckMsg] = useState<{
    type: "success" | "pending" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const loadProduct = () => {
      const items = getStoredMarketplaceItems();
      const found = items.find((i) => i.id === productId);
      if (found) {
        setItem(found);
      }
      setLoading(false);
    };

    loadProduct();

    syncMarketplaceWithServer().then((res) => {
      if (res && res.length > 0) {
        const found = res.find((i) => i.id === productId);
        if (found) setItem(found);
      }
    });

    // Pré-remplissage avec l'étudiant connecté si présent
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("has_current_student_profile_v2");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.full_name) setBuyerName(parsed.full_name);
          if (parsed.phone || parsed.telephone) setBuyerPhone(parsed.phone || parsed.telephone);
        }
      } catch {}
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F14]">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f2744] dark:border-[#e0521c]"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F14]">
        <Navbar />
        <main className="flex-1 max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-[#151D27] flex items-center justify-center mx-auto text-slate-400">
            <FileText className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
            Document introuvable
          </h1>
          <p className="text-sm text-slate-500">
            Ce document n&apos;existe pas ou a été retiré de la vente par l&apos;administration.
          </p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0f2744] text-white text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retourner au Marketplace</span>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName.trim() || !buyerPhone.trim()) {
      alert("Veuillez renseigner votre nom et votre numéro WhatsApp.");
      return;
    }

    setIsSubmitting(true);
    try {
      const order = await createMarketplaceOrder({
        item,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
      });

      setOrderSubmitted(order);
      setDownloadIdentifier(order.id);

      // Ouvrir directement WhatsApp vers le numéro configuré
      const contactPhone = item.whatsapp_number || item.professeur_phone || "+221 77 551 81 96";
      const phoneClean = contactPhone.replace(/[^0-9]/g, "");
      const finalPhone = phoneClean.length === 9 ? "221" + phoneClean : phoneClean;
      const formattedPrice = item.price.toLocaleString("fr-FR");

      const waMsg = `Bonjour,\n\nJe souhaite commander le document sur le Marketplace HAS :\n📄 *${item.title}*\n💰 *Prix :* ${formattedPrice} ${item.currency || "FCFA"}\n👤 *Acheteur :* ${buyerName.trim()}\n📱 *Numéro WhatsApp :* ${buyerPhone.trim()}\n🔖 *Code Commande :* #${order.id}\n\nMerci de m'indiquer la démarche pour effectuer le paiement et valider le téléchargement.`;

      const customWaUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(waMsg)}`;
      window.open(customWaUrl, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement de la commande.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckDownload = async () => {
    const ident = downloadIdentifier.trim();
    if (!ident) {
      alert("Veuillez renseigner votre code de commande (ex: ord-...) ou votre numéro de téléphone.");
      return;
    }

    setDownloadCheckLoading(true);
    setDownloadCheckMsg(null);

    try {
      const cleanIdent = ident.replace(/^#/, "").trim();
      const isDigitsOnly = /^[0-9+\s\-()]+$/.test(cleanIdent);
      const queryParam = isDigitsOnly
        ? `phone=${encodeURIComponent(cleanIdent)}`
        : `code=${encodeURIComponent(cleanIdent)}`;

      const downloadUrl = `/api/marketplace/download?itemId=${encodeURIComponent(item.id)}&${queryParam}`;
      const res = await fetch(downloadUrl);

      if (res.ok) {
        setDownloadCheckMsg({
          type: "success",
          text: "✓ Commande validée ! Votre document PDF est en cours de téléchargement sur votre appareil...",
        });

        // Déclenchement d'un VRAI téléchargement de fichier physique
        const blob = await res.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = blobUrl;
        const safeDocTitle = item.title.replace(/[^a-zA-Z0-9_\-]/g, "_");
        a.download = `${safeDocTitle}.pdf`;
        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(blobUrl);
        }, 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setDownloadCheckMsg({
            type: "pending",
            text: "Votre commande est bien reçue mais toujours en attente de validation par l'administration après confirmation de votre paiement.",
          });
        } else {
          setDownloadCheckMsg({
            type: "error",
            text: data.error || "Aucune commande validée trouvée avec ce code ou numéro.",
          });
        }
      }
    } catch {
      setDownloadCheckMsg({
        type: "error",
        text: "Erreur de connexion au serveur de téléchargement.",
      });
    } finally {
      setDownloadCheckLoading(false);
    }
  };

  const discountPercent =
    item.original_price && item.original_price > item.price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] transition-colors">
      <Navbar />

      <main className="flex-1 py-6 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 space-y-6 sm:space-y-8">
          {/* Breadcrumb & Retour */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-slate-600 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#e0521c] font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au catalogue</span>
            </Link>

            <span className="text-[11px] font-mono text-slate-400">Réf : {item.id}</span>
          </div>

          {/* Grille principale */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ============================================================== */}
            {/* COLONNE GAUCHE : DÉTAILS DU DOCUMENT                            */}
            {/* ============================================================== */}
            <div className="lg:col-span-7 space-y-6">
              {/* Titre & Statut */}
              <div className="space-y-2">
                <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0f2744] dark:text-[#F5F7FA] leading-tight">
                  {item.title}
                </h1>

                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#AAB4C0] pt-1">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Download className="w-4 h-4" />
                    <span>Téléchargeable</span>
                  </div>
                  {item.niveau && (
                    <>
                      <span>•</span>
                      <span className="font-medium text-[#e0521c]">{item.niveau}</span>
                    </>
                  )}
                  {item.matiere && (
                    <>
                      <span>•</span>
                      <span className="font-medium">{item.matiere}</span>
                    </>
                  )}
                </div>
              </div>

              {/* SECTION FICHIERS */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0f2744] dark:text-white">
                  Fichiers inclus (1)
                </h3>

                {/* Carte Fichier PDF avec Icône, Nom, Taille et Bouton Aperçu */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] flex items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-[#0f2744]/10 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#0f2744] dark:text-[#e0521c]" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-[#AAB4C0] font-medium">
                        {item.file_size || "Format PDF"} • {item.pages_count ? `${item.pages_count} pages` : "Document complet"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const el = document.getElementById("description-section");
                      el?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#151D27] shrink-0"
                  >
                    <span>Détails</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Description détaillée */}
              <div id="description-section" className="space-y-3 pt-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0f2744] dark:text-white">
                  Description &amp; Sommaire
                </h3>
                <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-[#C5D0DC] leading-relaxed whitespace-pre-line bg-white dark:bg-[#111821] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-[#263241] shadow-xs">
                  {item.description || "Aucune description détaillée fournie pour ce fascicule."}
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* COLONNE DROITE : SIDEBAR D'ACHAT (COULEURS DU SITE HAS)         */}
            {/* ============================================================== */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="bg-white dark:bg-[#111821] rounded-3xl border border-slate-200/90 dark:border-[#263241] p-5 sm:p-7 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] space-y-5">
                {/* Vignette format 1:1 conservée telle quelle sans rognage */}
                <div className="aspect-square bg-[#0f2744]/[0.03] dark:bg-[#151D27]/60 rounded-2xl overflow-hidden relative shadow-xs p-3 flex items-center justify-center border border-slate-100 dark:border-[#263241]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.cover_image_url}
                    alt={item.title}
                    className="w-full h-full object-contain drop-shadow-sm"
                  />
                  {(discountPercent || item.badge) && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md bg-[#0f2744] dark:bg-black/90 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                        {discountPercent ? `-${discountPercent}%` : item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bloc Prix aux couleurs de HAS */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    {item.original_price && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                        {item.original_price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                      </span>
                    )}
                    <span className="font-serif text-3xl sm:text-4xl font-black text-[#e0521c] tracking-tight">
                      {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Fascicule officiel HAS · Format PDF haute qualité
                  </p>
                </div>

                {/* Formulaire & Action de commande */}
                {orderSubmitted ? (
                  <div className="space-y-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                      Commande envoyée sur WhatsApp !
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      La discussion WhatsApp a été ouverte. Dès validation du paiement, vous pouvez télécharger votre document directement ci-dessous.
                    </p>
                    <div className="p-2 rounded-xl bg-white dark:bg-[#111821] border border-emerald-200 dark:border-emerald-800 text-xs font-mono">
                      <span className="text-slate-400 block text-[10px]">Votre Code de commande :</span>
                      <strong className="text-slate-900 dark:text-white text-sm">#{orderSubmitted.id}</strong>
                    </div>

                    <button
                      onClick={handleCheckDownload}
                      disabled={downloadCheckLoading}
                      className="w-full py-3 rounded-xl bg-[#0f2744] hover:bg-[#18395f] text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>{downloadCheckLoading ? "Vérification..." : "Télécharger mon document validé"}</span>
                    </button>

                    {downloadCheckMsg && (
                      <div
                        className={`p-3 rounded-lg text-xs leading-relaxed text-left ${
                          downloadCheckMsg.type === "success"
                            ? "bg-emerald-100 text-emerald-900 font-semibold"
                            : downloadCheckMsg.type === "pending"
                            ? "bg-amber-100 text-amber-900 font-medium"
                            : "bg-red-100 text-red-900 font-medium"
                        }`}
                      >
                        {downloadCheckMsg.text}
                      </div>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleOrderSubmit} className="space-y-3.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block mb-1">
                        Votre Nom complet <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Ibrahima Diop"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block mb-1">
                        Votre Numéro WhatsApp <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="+221 77 000 00 00"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                      />
                    </div>

                    {/* GRAND BOUTON COMMANDE AUX COULEURS DU SITE HAS */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 px-6 rounded-xl bg-[#0f2744] hover:bg-[#18395f] dark:bg-[#e0521c] dark:hover:bg-[#c94210] text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                      <span>{isSubmitting ? "Connexion WhatsApp..." : "Commander via WhatsApp"}</span>
                    </button>
                  </form>
                )}

                {/* Section débloquer le téléchargement si déjà commandé */}
                {!orderSubmitted && (
                  <div className="pt-3 border-t border-slate-100 dark:border-[#263241] space-y-2 text-center">
                    {!showCheckDownloadInput ? (
                      <button
                        type="button"
                        onClick={() => setShowCheckDownloadInput(true)}
                        className="text-xs text-[#0f2744] dark:text-[#e0521c] hover:underline font-semibold"
                      >
                        Déjà commandé ? Télécharger avec mon code
                      </button>
                    ) : (
                      <div className="space-y-2 text-left bg-slate-50 dark:bg-[#151D27] p-3 rounded-xl border border-slate-200 dark:border-[#263241]">
                        <label className="text-[11px] font-bold text-slate-700 dark:text-white block">
                          Code de commande ou Numéro WhatsApp
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Ex: ord-... ou 77 000 00 00"
                            value={downloadIdentifier}
                            onChange={(e) => setDownloadIdentifier(e.target.value)}
                            className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241]"
                          />
                          <button
                            type="button"
                            onClick={handleCheckDownload}
                            disabled={downloadCheckLoading}
                            className="px-3 py-1.5 rounded-lg bg-[#0f2744] text-white text-xs font-bold hover:bg-[#1a3b66]"
                          >
                            {downloadCheckLoading ? "..." : "Télécharger"}
                          </button>
                        </div>
                      </div>
                    )}

                    {downloadCheckMsg && (
                      <div
                        className={`p-2.5 rounded-lg text-xs leading-relaxed text-left ${
                          downloadCheckMsg.type === "success"
                            ? "bg-emerald-50 text-emerald-800"
                            : downloadCheckMsg.type === "pending"
                            ? "bg-amber-50 text-amber-800"
                            : "bg-red-50 text-red-800"
                        }`}
                      >
                        {downloadCheckMsg.text}
                      </div>
                    )}
                  </div>
                )}

                {/* Badge réassurance validation */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] flex items-center gap-2 text-xs text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validation administrative manuelle sécurisée par code.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
