"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language, translations, TranslationKey } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "fr",
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: TranslationKey, fallback?: string) => fallback || key,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("fr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("has_language") as Language | null;
      if (saved === "fr" || saved === "en") {
        setLanguageState(saved);
        if (typeof document !== "undefined") {
          document.documentElement.lang = saved;
        }
      }
    } catch {}

    const onUpdate = (e: any) => {
      const next = e.detail as Language;
      if (next === "fr" || next === "en") {
        setLanguageState(next);
      }
    };
    window.addEventListener("has_language_changed", onUpdate);
    return () => window.removeEventListener("has_language_changed", onUpdate);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("has_language", lang);
      if (typeof document !== "undefined") {
        document.documentElement.lang = lang;
      }
      window.dispatchEvent(new CustomEvent("has_language_changed", { detail: lang }));
    } catch {}
  };

  const toggleLanguage = () => {
    const next: Language = language === "fr" ? "en" : "fr";
    setLanguage(next);
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = translations[language] || translations.fr;
    return (dict as Record<string, string>)[key] || fallback || (translations.fr as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
