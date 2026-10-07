"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export function ThemeToggle({
  className = "",
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { theme, toggleTheme, mounted } = useTheme();

  const isDark = mounted ? theme === "dark" : false; // Mode blanc par défaut durant SSR

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label="Basculer le thème clair / sombre"
      className={`inline-flex items-center gap-2 p-2 rounded-xl transition-all duration-200 border text-slate-600 hover:text-slate-900 bg-white/90 hover:bg-slate-100 border-slate-200/90 dark:bg-[#111821] dark:hover:bg-[#151D27] dark:text-[#AAB4C0] dark:hover:text-[#F5F7FA] dark:border-[#263241] focus:outline-none focus:ring-2 focus:ring-[#e0521c]/40 active:scale-95 shadow-xs cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 shrink-0 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-[#0f2744] shrink-0 transition-transform hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold select-none">
          {isDark ? "Mode clair" : "Mode sombre"}
        </span>
      )}
    </button>
  );
}
