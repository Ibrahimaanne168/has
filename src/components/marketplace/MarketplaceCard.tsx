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
} from "lucide-react";
import { MarketplaceItem } from "@/lib/types";
import { generateWhatsAppOrderUrl } from "@/lib/marketplaceStorage";

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
  const whatsappUrl = generateWhatsAppOrderUrl(item);

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
          {/* PRIX ET BOUTON WHATSAPP STYLE CHARIOW                          */}
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
                <span>Vérifié HAS</span>
              </div>
            </div>

            {/* BOUTON COMMANDER WHATSAPP */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm shadow-[0_2px_10px_-2px_rgba(37,211,102,0.4)] transition-all transform active:scale-98"
            >
              <WhatsAppIcon className="w-4 h-4 text-white shrink-0" />
              <span>Commander sur WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

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
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
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
                  <span>{item.pages_count || "Plusieurs dizaines"} de pages</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-[#151D27]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Envoi direct WhatsApp / Mail</span>
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

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-md transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 text-white" />
                  <span>Commander maintenant</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
