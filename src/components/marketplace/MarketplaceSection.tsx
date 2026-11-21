"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ShoppingBag, Sparkles, BookOpen } from "lucide-react";
import { MarketplaceItem } from "@/lib/types";
import { getStoredMarketplaceItems, syncMarketplaceWithServer } from "@/lib/marketplaceStorage";
import { MarketplaceCard } from "./MarketplaceCard";
import { Button } from "@/components/ui/Button";

export function MarketplaceSection() {
  const [items, setItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    setItems(getStoredMarketplaceItems());
    syncMarketplaceWithServer().then((res) => {
      if (res && res.length > 0) setItems(res);
    });

    const onUpdate = () => setItems(getStoredMarketplaceItems());
    window.addEventListener("has_marketplace_storage_updated", onUpdate);
    return () => window.removeEventListener("has_marketplace_storage_updated", onUpdate);
  }, []);

  // Afficher en priorité les documents actifs et mis en avant (ou les 3 à 4 premiers)
  const displayItems = items
    .filter((i) => i.is_active !== false)
    .slice(0, 3);

  if (displayItems.length === 0) return null;

  return (
    <section id="marketplace" className="py-16 sm:py-24 bg-[#F8FAFC] dark:bg-[#0E131B] border-b border-slate-200/80 dark:border-[#263241] transition-colors relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
        {/* En-tête de section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#e0521c]/10 dark:bg-[#e0521c]/20 text-[#e0521c] text-[11px] font-bold tracking-wider uppercase mb-3 border border-[#e0521c]/20">
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Boutique Académique · Ressources Professeurs</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Marketplace HAS : Fascicules &amp; Corrigés Officiels
            </h2>
            <p className="mt-3 text-slate-600 dark:text-[#AAB4C0] text-sm sm:text-base leading-relaxed">
              Procurez-vous les supports PDF de haute valeur rédigés par vos enseignants :
              recueils d&apos;examens décortiqués, formulaires et synthèses méthodologiques.
              Commandez directement sur WhatsApp auprès de chaque professeur.
            </p>
          </div>

          <Link href="/marketplace" className="shrink-0">
            <Button
              variant="outline"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4 text-[#e0521c]" />}
              className="text-xs sm:text-sm font-semibold rounded-xl bg-white dark:bg-[#111821] border-slate-300 dark:border-[#263241] hover:border-[#0f2744] dark:hover:border-slate-500 shadow-xs"
            >
              Explorer tout le catalogue
            </Button>
          </Link>
        </div>

        {/* Grille des fascicules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item) => (
            <MarketplaceCard key={item.id} item={item} featured={item.featured} />
          ))}
        </div>

        {/* Bandeau d'appel vers le catalogue complet */}
        <div className="mt-10 p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <div className="w-10 h-10 rounded-xl bg-[#0f2744]/10 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA] flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-[#e0521c]" />
            </div>
            <div>
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                Plus de fascicules disponibles dans le catalogue
              </h4>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0]">
                Mathématiques, Physique, Informatique, MERISE, Algèbre, Analyse matricielle...
              </p>
            </div>
          </div>

          <Link href="/marketplace">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#e0521c] hover:underline uppercase tracking-wider">
              <span>Voir les autres fascicules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
