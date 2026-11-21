"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0f2744] dark:bg-[#070b10] border-t border-slate-800 dark:border-[#263241] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          {/* Logo + Nom */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-white shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-serif font-bold text-white text-sm">
              Halil Académie Scientifique
            </span>
            <span className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden sm:inline text-slate-400">
              © {new Date().getFullYear()} {t("footer_rights")}
            </span>
          </div>

          {/* Copyright mobile */}
          <span className="sm:hidden text-slate-500">
            © {new Date().getFullYear()} {t("footer_rights")}
          </span>

          {/* Liens */}
          <div className="flex items-center gap-5">
            <Link href="/#contact" className="hover:text-white transition-colors">
              {t("footer_contact")}
            </Link>
            <Link href="/connexion" className="hover:text-white transition-colors">
              {t("footer_ent")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
