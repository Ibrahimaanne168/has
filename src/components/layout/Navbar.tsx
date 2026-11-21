"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, LogIn, Menu, X, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageToggle } from "@/components/ui/LanguageToggle";
import { useLanguage } from "@/context/LanguageContext";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 bg-white/95 dark:bg-[#111821]/95 backdrop-blur-md transition-all duration-200 ${
        scrolled
          ? "shadow-sm border-b border-slate-200/90 dark:border-[#263241]"
          : "border-b border-slate-200/60 dark:border-[#263241]/70"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 min-w-0" onClick={close}>
            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full overflow-hidden shrink-0 bg-white ring-1 ring-slate-200 dark:ring-[#263241]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-sm sm:text-base font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-tight truncate">
                <span className="hidden sm:inline">Halil Académie Scientifique</span>
                <span className="sm:hidden font-bold tracking-tight">HAS</span>
              </span>
              <span className="text-[10px] font-bold text-[#e0521c] uppercase tracking-wider hidden sm:block">
                {t("nav_tagline")}
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/#presentation"
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] transition-colors"
            >
              {t("nav_presentation")}
            </Link>
            <Link
              href="/#matieres"
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] transition-colors"
            >
              {t("nav_matieres")}
            </Link>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#e0521c] hover:text-[#c44314] transition-colors px-2.5 py-1 rounded-full bg-[#e0521c]/10 dark:bg-[#e0521c]/20 border border-[#e0521c]/30"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>{t("nav_marketplace")}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-[#e0521c] text-white text-[9px] font-extrabold uppercase tracking-wide">
                PDF
              </span>
            </Link>
            <Link
              href="/#mot-directeur"
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] transition-colors"
            >
              {t("nav_directeur")}
            </Link>
            <Link
              href="/#contact"
              className="text-xs sm:text-sm font-medium text-slate-600 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] transition-colors"
            >
              {t("nav_contact")}
            </Link>
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />
            <Link href="/inscription">
              <Button variant="outline" size="sm" className="text-xs rounded-lg font-semibold">
                {t("nav_inscription")}
              </Button>
            </Link>
            <Link href="/connexion">
              <Button variant="primary" size="sm" className="text-xs rounded-lg font-semibold">
                {t("nav_connexion")}
              </Button>
            </Link>
          </div>

          {/* Mobile right items (LanguageToggle + ThemeToggle + Hamburger) */}
          <div className="md:hidden flex items-center gap-1.5">
            <LanguageToggle />
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] transition-colors"
              aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-white dark:bg-[#111821] border-b border-slate-200/90 dark:border-[#263241] shadow-lg z-50" role="dialog" aria-modal="true">
          <nav className="flex flex-col px-3 pt-2 pb-4 gap-1">
            <Link
              href="/#presentation"
              onClick={close}
              className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#151D27] rounded-md transition-colors"
            >
              Présentation
            </Link>
            <Link
              href="/#matieres"
              onClick={close}
              className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#151D27] rounded-md transition-colors"
            >
              Matières
            </Link>
            <Link
              href="/marketplace"
              onClick={close}
              className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#e0521c] bg-[#e0521c]/10 dark:bg-[#e0521c]/20 rounded-md transition-colors border border-[#e0521c]/20"
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Marketplace &amp; Fascicules</span>
              </div>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#e0521c] text-white">
                PDF
              </span>
            </Link>
            <Link
              href="/#mot-directeur"
              onClick={close}
              className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#151D27] rounded-md transition-colors"
            >
              Mot du Directeur
            </Link>
            <Link
              href="/#contact"
              onClick={close}
              className="flex items-center px-3 py-2 text-xs font-medium text-slate-700 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#151D27] rounded-md transition-colors"
            >
              Contact
            </Link>

            <div className="mt-2 pt-3 border-t border-slate-100 dark:border-[#263241] flex flex-col gap-2">
              <Link href="/inscription" onClick={close}>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center text-xs rounded-md py-2"
                  leftIcon={<UserPlus className="w-3.5 h-3.5" />}
                >
                  Inscription
                </Button>
              </Link>
              <Link href="/connexion" onClick={close}>
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center text-xs rounded-md py-2"
                  leftIcon={<LogIn className="w-3.5 h-3.5" />}
                >
                  Connexion à l&apos;ENT
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
