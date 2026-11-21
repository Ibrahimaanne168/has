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
  Clock,
  ShieldCheck,
  User,
  Phone,
  Mail,
  ChevronRight,
  Sparkles,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceItem, MarketplaceOrder } from "@/lib/types";
import {
  getStoredMarketplaceItems,
  createMarketplaceOrder,
  generateWhatsAppOrderUrl,
  syncMarketplaceWithServer,
} from "@/lib/marketplaceStorage";
import { WhatsAppIcon } from "@/components/marketplace/MarketplaceCard";

export default function MarketplaceProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);

  // Formulaire de commande
  const [buyerName, setBuyerName] = useState("");
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSubmitted, setOrderSubmitted] = useState<MarketplaceOrder | null>(null);

  // Vérification téléchargement
  const [downloadCheckLoading, setDownloadCheckLoading] = useState(false);
  const [downloadCheckMsg, setDownloadCheckMsg] = useState<{ type: "success" | "pending" | "error"; text: string } | null>(null);

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
          if (parsed.email) setBuyerEmail(parsed.email);
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
    if (!buyerName.trim() || !buyerEmail.trim() || !buyerPhone.trim()) {
      alert("Veuillez renseigner votre nom, email et numéro pour valider la commande.");
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

      // Ouvrir WhatsApp avec message personnalisé
      const phoneClean = item.professeur_phone.replace(/[^0-9]/g, "");
      const finalPhone = phoneClean.length === 9 ? "221" + phoneClean : phoneClean;
      const formattedPrice = item.price.toLocaleString("fr-FR");
      const waMsg = `Bonjour Professeur ${item.professeur_name},\n\nJe souhaite commander votre document sur le Marketplace HAS :\n📄 *${item.title}*\n💰 *Prix :* ${formattedPrice} ${item.currency || "FCFA"}\n👤 *Acheteur :* ${buyerName.trim()} (${buyerEmail.trim()})\n🔖 *Réf Commande :* #${order.id}\n\nMerci de m'indiquer la démarche pour effectuer le paiement et que l'administrateur valide mon téléchargement.`;

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
    if (!buyerEmail.trim()) {
      alert("Veuillez renseigner votre adresse email pour vérifier votre accès.");
      return;
    }

    setDownloadCheckLoading(true);
    setDownloadCheckMsg(null);

    try {
      const res = await fetch(
        `/api/marketplace/download?itemId=${encodeURIComponent(item.id)}&email=${encodeURIComponent(buyerEmail.trim())}`
      );
      if (res.ok) {
        setDownloadCheckMsg({
          type: "success",
          text: "Votre commande a été validée par l'administrateur ! Téléchargement en cours...",
        });
        window.location.href = `/api/marketplace/download?itemId=${encodeURIComponent(item.id)}&email=${encodeURIComponent(buyerEmail.trim())}`;
      } else {
        const data = await res.json().catch(() => ({}));
        if (res.status === 403) {
          setDownloadCheckMsg({
            type: "pending",
            text: "Votre commande est bien reçue, mais toujours en attente de validation par l'administration HAS après vérification du paiement.",
          });
        } else {
          setDownloadCheckMsg({
            type: "error",
            text: data.error || "Aucune commande validée trouvée pour cette adresse email.",
          });
        }
      }
    } catch {
      setDownloadCheckMsg({
        type: "error",
        text: "Erreur de connexion au serveur de vérification.",
      });
    } finally {
      setDownloadCheckLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] transition-colors">
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 space-y-8">
          {/* Breadcrumb & Retour */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-slate-600 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-white font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Retour au catalogue</span>
            </Link>

            <span className="text-[11px] font-mono text-slate-400">Réf : {item.id}</span>
          </div>

          {/* Grille principale style Chariow */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* ============================================================== */}
            {/* COLONNE GAUCHE : DÉTAILS DU DOCUMENT (STYLE CHARIOW IMAGE 2)   */}
            {/* ============================================================== */}
            <div className="lg:col-span-7 space-y-8">
              {/* Titre & Statut */}
              <div className="space-y-2">
                <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-[#0f2744] dark:text-[#F5F7FA] leading-tight">
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

              {/* SECTION FICHIERS (STYLE CHARIOW IMAGE 2) */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  Fichiers (1)
                </h3>

                {/* Bandeau jaune doux prévisualisation */}
                <div className="p-3.5 rounded-xl bg-[#FEF9C3] dark:bg-[#713F12]/30 border border-[#FDE047] dark:border-[#854D0E] flex items-center gap-2.5 text-xs text-[#854D0E] dark:text-[#FEF08A]">
                  <Eye className="w-4 h-4 shrink-0" />
                  <span className="font-medium">
                    Consultez les détails et prévisualisez la description complète avant l&apos;achat.
                  </span>
                </div>

                {/* Carte Fichier PDF avec Icône, Nom, Taille et Bouton Aperçu */}
                <div className="p-4 rounded-2xl bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] flex items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-[#0f2744] dark:text-[#F5F7FA]" />
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
              <div id="description-section" className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#263241]">
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-white">
                  Description du fascicule
                </h3>
                <div className="prose dark:prose-invert max-w-none text-sm text-slate-700 dark:text-[#C5D0DC] leading-relaxed whitespace-pre-line bg-white dark:bg-[#111821] p-6 rounded-2xl border border-slate-200/80 dark:border-[#263241]">
                  {item.description}
                </div>
              </div>

              {/* Profil de l'enseignant */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-full bg-[#0f2744] text-white flex items-center justify-center overflow-hidden shrink-0">
                    {item.professeur_avatar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.professeur_avatar} alt={item.professeur_name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">Auteur &amp; Enseignant HAS</span>
                    <span className="font-serif font-bold text-base text-[#0f2744] dark:text-white">
                      Prof. {item.professeur_name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">WhatsApp Enseignant</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.professeur_phone}
                  </span>
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* COLONNE DROITE : SIDEBAR D'ACHAT STICKY (STYLE CHARIOW IMAGE 2) */}
            {/* ============================================================== */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="bg-white dark:bg-[#111821] rounded-3xl border border-slate-200/90 dark:border-[#263241] p-6 sm:p-8 shadow-[0_4px_24px_-4px_rgba(15,23,42,0.08)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] space-y-6">
                {/* Vignette couverture postée par l'admin */}
                <div className="aspect-[16/10] bg-slate-900 rounded-2xl overflow-hidden relative shadow-md">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.cover_image_url} alt={item.title} className="w-full h-full object-cover" />
                  {item.badge && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-md bg-black text-white text-[10px] font-black uppercase tracking-wider">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Bloc Prix Chariow : Prix barré en gris + Prix rouge vif */}
                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-3">
                    {item.original_price && (
                      <span className="text-base sm:text-lg text-slate-400 line-through font-semibold">
                        {item.original_price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                      </span>
                    )}
                    <span className="font-serif text-3xl sm:text-4xl font-black text-red-600 tracking-tight">
                      {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Accès immédiat et permanent après validation administrative
                  </p>
                </div>

                {/* Formulaire & Action de commande */}
                {orderSubmitted ? (
                  <div className="space-y-4 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                    <h4 className="font-serif font-bold text-sm text-emerald-900 dark:text-emerald-200">
                      Demande enregistrée avec succès !
                    </h4>
                    <p className="text-xs text-emerald-800 dark:text-emerald-300 leading-relaxed">
                      La discussion WhatsApp est ouverte avec Prof. <strong>{item.professeur_name}</strong>. Réglez votre commande par Wave ou Orange Money.
                    </p>
                    <div className="text-[11px] font-mono text-slate-500 bg-white/60 dark:bg-black/30 py-1 rounded-lg">
                      Réf : #{orderSubmitted.id}
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
                        Votre Adresse Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="etudiant@email.com"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
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

                    {/* GRAND BOUTON JAUNE CHARIOW */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-[0_4px_14px_0_rgba(251,191,36,0.39)] transition-all cursor-pointer active:scale-98"
                    >
                      <WhatsAppIcon className="w-5 h-5 text-slate-950" />
                      <span>{isSubmitting ? "Traitement..." : "Commander maintenant"}</span>
                    </button>
                  </form>
                )}

                {/* Section vérification si l'étudiant a déjà commandé */}
                {!orderSubmitted && (
                  <div className="pt-2 border-t border-slate-100 dark:border-[#263241] text-center">
                    <button
                      type="button"
                      onClick={handleCheckDownload}
                      disabled={downloadCheckLoading}
                      className="text-xs text-[#0f2744] dark:text-[#AAB4C0] hover:underline font-semibold"
                    >
                      {downloadCheckLoading ? "Vérification..." : "Déjà commandé ? Télécharger mon document"}
                    </button>

                    {downloadCheckMsg && (
                      <div
                        className={`mt-2 p-2.5 rounded-lg text-xs leading-relaxed text-left ${
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

                {/* MOYENS DE PAIEMENT DISPONIBLES (STYLE CHARIOW IMAGE 2) */}
                <div className="pt-4 border-t border-slate-100 dark:border-[#263241] text-center space-y-2.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                    Moyens de paiement disponibles
                  </span>

                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 dark:bg-[#151D27] text-blue-700 dark:text-cyan-400 text-[10px] font-black border border-blue-200/80 dark:border-blue-900">
                      Wave
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-orange-50 dark:bg-[#151D27] text-orange-600 dark:text-orange-400 text-[10px] font-black border border-orange-200/80 dark:border-orange-900">
                      Orange Money
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-[#151D27] text-emerald-700 dark:text-emerald-400 text-[10px] font-black border border-emerald-200/80 dark:border-emerald-900">
                      Free Money
                    </span>
                    <span className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#151D27] text-slate-700 dark:text-slate-300 text-[10px] font-black border border-slate-200 dark:border-[#263241]">
                      Virement / Cash
                    </span>
                  </div>
                </div>

                {/* Validation administrative garantie */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] flex items-center gap-2.5 text-xs text-slate-600 dark:text-[#AAB4C0]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Validation administrative manuelle garantie pour chaque achat.</span>
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
