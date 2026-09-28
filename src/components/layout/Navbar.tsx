"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, LogIn, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = () => setMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-40 bg-white transition-all duration-200 ${
        scrolled ? "shadow-sm border-b border-slate-200/90" : "border-b border-slate-200/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 min-w-0" onClick={close}>
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg overflow-hidden shrink-0 ring-1 ring-slate-200/90 bg-white shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-sm sm:text-base font-bold text-[#0f2744] leading-tight truncate">
                <span className="hidden sm:inline">Halil Académie Scientifique</span>
                <span className="sm:hidden">HAS</span>
              </span>
              <span className="text-[10px] font-bold text-[#e0521c] uppercase tracking-wider hidden sm:block">
                Maths · Physique · Informatique
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/#presentation"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Présentation
            </Link>
            <Link
              href="/#matieres"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Matières
            </Link>
            <Link
              href="/#mot-directeur"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Directeur
            </Link>
            <Link
              href="/#contact"
              className="text-xs sm:text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/inscription">
              <Button variant="outline" size="sm" className="border-slate-200/90 text-xs rounded-lg font-semibold">
                Inscription
              </Button>
            </Link>
            <Link href="/connexion">
              <Button variant="primary" size="sm" className="text-xs rounded-lg font-semibold">
                Connexion
              </Button>
            </Link>
          </div>

          {/* Bouton hamburger mobile */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Drawer mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute inset-x-0 top-full bg-white border-b border-slate-200/90 shadow-lg z-50" role="dialog" aria-modal="true">
          <nav className="flex flex-col px-4 pt-1 pb-4 gap-0.5">
            <Link
              href="/#presentation"
              onClick={close}
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[44px]"
            >
              Présentation
            </Link>
            <Link
              href="/#matieres"
              onClick={close}
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[44px]"
            >
              Matières
            </Link>
            <Link
              href="/#mot-directeur"
              onClick={close}
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[44px]"
            >
              Mot du Directeur
            </Link>
            <Link
              href="/#contact"
              onClick={close}
              className="flex items-center px-3 py-2.5 text-sm font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[44px]"
            >
              Contact
            </Link>

            <div className="mt-2 pt-3 border-t border-slate-100/90 flex flex-col gap-2">
              <Link href="/inscription" onClick={close}>
                <Button
                  variant="outline"
                  className="w-full justify-center min-h-[44px] text-sm border-slate-200/90 rounded-lg"
                  leftIcon={<UserPlus className="w-4 h-4" />}
                >
                  Inscription
                </Button>
              </Link>
              <Link href="/connexion" onClick={close}>
                <Button
                  variant="primary"
                  className="w-full justify-center min-h-[44px] text-sm rounded-lg"
                  leftIcon={<LogIn className="w-4 h-4" />}
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
