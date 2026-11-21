"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  ShoppingBag,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MarketplaceCard, WhatsAppIcon } from "@/components/marketplace/MarketplaceCard";
import { MarketplaceItem } from "@/lib/types";
import { getStoredMarketplaceItems, syncMarketplaceWithServer } from "@/lib/marketplaceStorage";
import { useLanguage } from "@/context/LanguageContext";

export default function MarketplacePage() {
  const { t } = useLanguage();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNiveau, setSelectedNiveau] = useState<string>("all");
  const [selectedMatiere, setSelectedMatiere] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"featured" | "price_asc" | "price_desc" | "recent">("featured");

  useEffect(() => {
    setItems(getStoredMarketplaceItems());
    syncMarketplaceWithServer().then((res) => {
      if (res && res.length > 0) setItems(res);
    });

    const onUpdate = () => setItems(getStoredMarketplaceItems());
    window.addEventListener("has_marketplace_storage_updated", onUpdate);
    return () => window.removeEventListener("has_marketplace_storage_updated", onUpdate);
  }, []);

  // Extraire les matières uniques
  const matieresList = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => {
      if (item.matiere) set.add(item.matiere);
    });
    return Array.from(set);
  }, [items]);

  // Filtrage et tri
  const filteredItems = useMemo(() => {
    return items
      .filter((item) => {
        if (item.is_active === false) return false;

        // Filtre recherche
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchDesc = item.description?.toLowerCase().includes(q);
          const matchProf = item.professeur_name?.toLowerCase().includes(q);
          const matchMatiere = item.matiere?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchProf && !matchMatiere) {
            return false;
          }
        }

        // Filtre niveau
        if (selectedNiveau !== "all") {
          if (item.niveau && !item.niveau.toLowerCase().includes(selectedNiveau.toLowerCase()) && item.niveau !== "Tous") {
            return false;
          }
        }

        // Filtre matière
        if (selectedMatiere !== "all") {
          if (item.matiere !== selectedMatiere) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price_asc") return a.price - b.price;
        if (sortBy === "price_desc") return b.price - a.price;
        if (sortBy === "recent") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        // Featured en premier
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
  }, [items, searchQuery, selectedNiveau, selectedMatiere, sortBy]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] transition-colors">
      <Navbar />

      <main className="flex-1">
        {/* ============================================================== */}
        {/* BANNIÈRE HERO MARKETPLACE STYLE CHARIOW                         */}
        {/* ============================================================== */}
        <section className="bg-[#0f2744] text-white py-12 sm:py-16 relative overflow-hidden border-b border-[#0f2744]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                {t("nav_presentation") === "About Us" ? "Home" : "Accueil"}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-white font-medium">Marketplace &amp; Fascicules</span>
            </div>

            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#e0521c]/20 text-[#e0521c] text-xs font-bold tracking-wider uppercase border border-[#e0521c]/30">
                <ShoppingBag className="w-4 h-4" />
                <span>{t("mkt_sec_badge")}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                {t("mkt_page_title")}
              </h1>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                {t("mkt_page_desc")}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Supports certifiés par l&apos;Académie</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
                  <span>Contact direct de l&apos;enseignant</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  <span>Format PDF Haute Définition</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BARRE DE RECHERCHE & FILTRES                                   */}
        {/* ============================================================== */}
        <section className="sticky top-14 sm:top-16 z-30 bg-white/95 dark:bg-[#111821]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-[#263241] py-3.5 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Champ de recherche */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-[#687585]" />
                <input
                  type="text"
                  placeholder={t("mkt_search_placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] text-slate-900 dark:text-[#F5F7FA] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0f2744] dark:focus:ring-cyan-500"
                />
              </div>

              {/* Filtres par boutons / sélecteurs */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Filtre Niveau */}
                <div className="flex items-center rounded-lg bg-slate-100 dark:bg-[#151D27] p-1 border border-slate-200/80 dark:border-[#263241]">
                  <button
                    onClick={() => setSelectedNiveau("all")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedNiveau === "all"
                        ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900"
                    }`}
                  >
                    {t("mkt_filter_all_levels")}
                  </button>
                  <button
                    onClick={() => setSelectedNiveau("l1")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedNiveau === "l1"
                        ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900"
                    }`}
                  >
                    {t("mkt_filter_l1")}
                  </button>
                  <button
                    onClick={() => setSelectedNiveau("l2")}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                      selectedNiveau === "l2"
                        ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-white shadow-xs"
                        : "text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900"
                    }`}
                  >
                    {t("mkt_filter_l2")}
                  </button>
                </div>

                {/* Sélecteur Matière */}
                {matieresList.length > 0 && (
                  <select
                    value={selectedMatiere}
                    onChange={(e) => setSelectedMatiere(e.target.value)}
                    className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] text-slate-800 dark:text-[#F5F7FA] focus:outline-none"
                  >
                    <option value="all">{t("mkt_filter_all_subjects")}</option>
                    {matieresList.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                )}

                {/* Tri */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] text-slate-800 dark:text-[#F5F7FA] focus:outline-none"
                >
                  <option value="featured">{t("mkt_sort_featured")}</option>
                  <option value="price_asc">{t("mkt_sort_price_asc")}</option>
                  <option value="price_desc">{t("mkt_sort_price_desc")}</option>
                  <option value="recent">{t("mkt_sort_recent")}</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* GRILLE DU CATALOGUE                                            */}
        {/* ============================================================== */}
        <section className="py-10 sm:py-14 max-w-6xl mx-auto px-4 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0]">
              <strong className="text-slate-900 dark:text-white">{filteredItems.length}</strong> {t("mkt_total_docs")}
            </p>

            {(searchQuery || selectedNiveau !== "all" || selectedMatiere !== "all") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedNiveau("all");
                  setSelectedMatiere("all");
                }}
                className="text-xs text-[#e0521c] hover:underline font-semibold"
              >
                {t("mkt_reset_filters")}
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] p-8 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-[#151D27] text-slate-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#F5F7FA]">
                {t("mkt_no_docs_title")}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-md mx-auto">
                {t("mkt_no_docs_desc")}
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedNiveau("all");
                  setSelectedMatiere("all");
                }}
                className="px-4 py-2 rounded-xl bg-[#0f2744] text-white text-xs font-semibold"
              >
                {t("mkt_view_all_docs")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filteredItems.map((item) => (
                <MarketplaceCard key={item.id} item={item} featured={item.featured} />
              ))}
            </div>
          )}
        </section>

        {/* ============================================================== */}
        {/* GUIDE PRATIQUE : COMMENT COMMANDER (RÉASSURANCE)                */}
        {/* ============================================================== */}
        <section className="py-12 bg-white dark:bg-[#0E131B] border-t border-slate-200/90 dark:border-[#263241]">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 lg:px-10">
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-[#e0521c] text-xs font-bold uppercase tracking-wider block mb-1">
                {t("mkt_guide_badge")}
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                {t("mkt_guide_title")}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111821] border border-slate-200/80 dark:border-[#263241] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0f2744] text-white font-serif font-black flex items-center justify-center text-lg">
                  1
                </div>
                <h4 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                  {t("mkt_step1_title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
                  {t("mkt_step1_desc")}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111821] border border-slate-200/80 dark:border-[#263241] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                  {t("mkt_step2_title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
                  {t("mkt_step2_desc")}
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-[#111821] border border-slate-200/80 dark:border-[#263241] space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#e0521c] text-white flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#0f2744] dark:text-[#F5F7FA]">
                  {t("mkt_step3_title")}
                </h4>
                <p className="text-xs text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
                  {t("mkt_step3_desc")}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
