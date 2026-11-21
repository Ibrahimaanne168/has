"use client";

import React from "react";
import Link from "next/link";
import { FileText, User } from "lucide-react";
import { MarketplaceItem } from "@/lib/types";

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

export function MarketplaceCard({ item, featured = false }: MarketplaceCardProps) {
  // Calcul automatique du pourcentage de réduction si original_price existe
  const discountPercent =
    item.original_price && item.original_price > item.price
      ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
      : null;

  return (
    <div className="group bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] transition-all duration-300 flex flex-col overflow-hidden hover:shadow-[0_12px_30px_-8px_rgba(15,39,68,0.12)] dark:hover:shadow-[0_12px_30px_-8px_rgba(0,0,0,0.6)]">
      {/* ============================================================== */}
      {/* VIGNETTE STYLE CHARIOW (IMAGE 1)                               */}
      {/* ============================================================== */}
      <Link href={`/marketplace/${item.id}`} className="relative aspect-[4/3] bg-slate-100 dark:bg-slate-900 overflow-hidden block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.cover_image_url}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge noir de réduction en haut à droite (Style Chariow Image 1) */}
        {(discountPercent || item.badge) && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2.5 py-1 rounded-md bg-black/90 text-white text-[11px] font-black uppercase tracking-wider shadow-sm">
              {discountPercent ? `${discountPercent}% OFF` : item.badge}
            </span>
          </div>
        )}

        {/* Badge niveau / matière discret en bas à gauche */}
        {item.niveau && (
          <div className="absolute bottom-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider">
              {item.niveau}
            </span>
          </div>
        )}
      </Link>

      {/* ============================================================== */}
      {/* INFOS DU PRODUIT STYLE CHARIOW (IMAGE 1)                       */}
      {/* ============================================================== */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          {/* Titre */}
          <Link href={`/marketplace/${item.id}`} className="block">
            <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-[#F5F7FA] leading-snug line-clamp-2 hover:text-[#e0521c] transition-colors">
              {item.title}
            </h3>
          </Link>

          {/* Badge format numérique discret */}
          <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>Document PDF Téléchargeable</span>
          </p>
        </div>

        {/* ============================================================== */}
        {/* PRIX BARRÉ + PRIX ROUGE VIF + BOUTON JAUNE CHARIOW             */}
        {/* ============================================================== */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-[#263241]">
          {/* Ligne de prix */}
          <div className="flex items-baseline gap-2.5">
            {item.original_price && (
              <span className="text-xs sm:text-sm text-slate-400 line-through font-semibold">
                {item.original_price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
              </span>
            )}
            <span className="font-serif text-lg sm:text-xl font-black text-red-600 dark:text-red-500">
              {item.price.toLocaleString("fr-FR")} {item.currency || "FCFA"}
            </span>
          </div>

          {/* Grand bouton jaune Chariow : Acheter maintenant -> mène vers la vraie page produit */}
          <Link
            href={`/marketplace/${item.id}`}
            className="w-full py-2.5 px-4 rounded-xl bg-[#FBBF24] hover:bg-[#F59E0B] text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center transition-all shadow-xs active:scale-98 text-center"
          >
            Acheter maintenant
          </Link>
        </div>
      </div>
    </div>
  );
}
