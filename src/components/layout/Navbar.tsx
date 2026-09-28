"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LogIn, UserPlus, Menu, X } from "lucide-react";
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
      className={`sticky top-0 z-40 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-sm border-b border-slate-200" : "border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 min-w-0" onClick={close}>
            <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-serif text-[15px] sm:text-base font-bold text-[#0f2744] leading-tight truncate">
                Halil Académie Scientifique
              </span>
              <span className="text-[10px] font-semibold text-[#e0521c] tracking-wide hidden sm:block">
                Maths · Physique · Informatique
              </span>
            </div>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              href="/#presentation"
              className="text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Présentation
            </Link>
            <Link
              href="/#matieres"
              className="text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Matières
            </Link>
            <Link
              href="/#mot-directeur"
              className="text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Directeur
            </Link>
            <Link
              href="/#contact"
              className="text-sm font-medium text-slate-600 hover:text-[#0f2744] transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Actions desktop */}
          <div className="hidden md:flex items-center gap-2.5">
            <Link href="/inscription">
              <Button variant="outline" size="sm" className="border-slate-200">
                Inscription
              </Button>
            </Link>
            <Link href="/connexion">
              <Button variant="primary" size="sm">
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
        <div className="md:hidden absolute inset-x-0 top-full bg-white border-b border-slate-200 shadow-lg z-50">
          <nav className="flex flex-col px-5 pt-2 pb-6 gap-1">
            <Link
              href="/#presentation"
              onClick={close}
              className="flex items-center px-3 py-3.5 text-[15px] font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[48px]"
            >
              Présentation
            </Link>
            <Link
              href="/#matieres"
              onClick={close}
              className="flex items-center px-3 py-3.5 text-[15px] font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[48px]"
            >
              Matières
            </Link>
            <Link
              href="/#mot-directeur"
              onClick={close}
              className="flex items-center px-3 py-3.5 text-[15px] font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[48px]"
            >
              Mot du Directeur
            </Link>
            <Link
              href="/#contact"
              onClick={close}
              className="flex items-center px-3 py-3.5 text-[15px] font-medium text-slate-700 hover:text-[#0f2744] hover:bg-slate-50 rounded-lg transition-colors min-h-[48px]"
            >
              Contact
            </Link>

            <div className="mt-3 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <Link href="/inscription" onClick={close}>
                <Button variant="outline" className="w-full justify-center min-h-[48px] text-[15px] border-slate-200">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Inscription
                </Button>
              </Link>
              <Link href="/connexion" onClick={close}>
                <Button variant="primary" className="w-full justify-center min-h-[48px] text-[15px]">
                  <LogIn className="w-4 h-4 mr-2" />
                  Connexion
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
