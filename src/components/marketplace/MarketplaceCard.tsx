"use client";

import React from "react";
import Link from "next/link";
import { MarketplaceItem } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";

interface MarketplaceCardProps {
  item: MarketplaceItem;
  featured?: boolean;
}

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

export function MarketplaceCard({ item }: MarketplaceCardProps) {
  const { t } = useLanguage();

  // Calcul automatique du pourcentage de réduction si original_price existe
  const discountPercent =
    item.original_price && item.original_price > item.price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : null;

  return (
    <div className="group bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_12px_28px_-8px_rgba(15,39,68,0.12)] dark:hover:shadow-[0_12px_28px_-8px_rgba(0,0,0,0.6)]">
      {/* ============================================================== */}
      {/* VIGNETTE 1:1 CONSERVÉE TELLE QUELLE (SANS ROGNAGE NI ÉTIREMENT) */}
      {/* ============================================================== */}
      <Link
        href={`/marketplace/${item.id}`}
        className="relative aspect-square bg-[#0f2744]/[0.03] dark:bg-[#151D27]/60 overflow-hidden block p-2 sm:p-3 flex items-center justify-center"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.cover_image_url}
          alt={item.title}
          className="w-full h-full object-contain drop-shadow-sm transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge réduction avec les couleurs du site (Navy HAS ou Noir) */}
        {(discountPercent || item.badge) && (
          <div className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10">
            <span className="px-2 py-0.5 rounded-md bg-[#0f2744] dark:bg-black/90 text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-xs">
              {discountPercent ? `-${discountPercent}%` : item.badge}
            </span>
          </div>
        )}
      </Link>

      {/* ============================================================== */}
      {/* INFOS DU PRODUIT & BOUTON COMMANDE COULEURS DU SITE HAS        */}
      {/* ============================================================== */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between space-y-2.5 sm:space-y-3">
        <div className="space-y-1">
          {/* Titre */}
          <Link href={`/marketplace/${item.id}`} className="block">
            <h3 className="font-serif font-bold text-xs sm:text-sm text-slate-900 dark:text-[#F5F7FA] leading-snug line-clamp-2 hover:text-[#e0521c] transition-colors">
              {item.title}
            </h3>
          </Link>

          <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate">
            {t("mkt_downloadable_pdf")}
          </p>
        </div>

        {/* ============================================================== */}
        {/* PRIX BARRÉ + PRIX ACCENT HAS (#e0521c) + BOUTON HAS             */}
        {/* ============================================================== */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
          {/* Ligne de prix */}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            {item.original_price && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through font-semibold">
                {item.original_price.toLocaleString("fr-FR")} F
              </span>
            )}
            <span className="font-serif text-sm sm:text-base font-black text-[#e0521c] dark:text-[#ff6b35]">
              {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
            </span>
          </div>

          {/* Bouton Acheter / Commander aux couleurs de HAS */}
          <Link
            href={`/marketplace/${item.id}`}
            className="w-full py-2 px-2.5 sm:px-4 rounded-xl bg-[#0f2744] hover:bg-[#1a3a60] dark:bg-[#e0521c] dark:hover:bg-[#c94210] text-white font-bold text-[11px] sm:text-xs flex items-center justify-center transition-all shadow-xs active:scale-98 text-center"
          >
            {t("mkt_buy_now")}
          </Link>
        </div>
      </div>
    </div>
  );
}
