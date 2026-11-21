"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageToggleProps {
  className?: string;
  variant?: "pill" | "icon" | "dropdown";
}

export function LanguageToggle({ className = "", variant = "pill" }: LanguageToggleProps) {
  const { language, setLanguage, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-slate-200 dark:border-[#263241] bg-slate-50/80 dark:bg-[#151D27] hover:bg-slate-100 dark:hover:bg-[#1b2533] text-slate-700 dark:text-[#F5F7FA] shadow-xs active:scale-95 ${className}`}
      title={language === "fr" ? "Passer en anglais (English)" : "Switch to French (Français)"}
      aria-label="Changer de langue / Change language"
    >
      <Globe className="w-3.5 h-3.5 text-[#e0521c]" />
      <span className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider">
        <span className={language === "fr" ? "text-[#e0521c] font-black" : "text-slate-400 font-normal"}>
          FR
        </span>
        <span className="text-slate-300 dark:text-slate-600">/</span>
        <span className={language === "en" ? "text-[#e0521c] font-black" : "text-slate-400 font-normal"}>
          EN
        </span>
      </span>
    </button>
  );
}
