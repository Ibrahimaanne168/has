"use client";

import { useEffect, useState, useCallback } from "react";

export type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("has_theme") as Theme | null;
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        if (stored === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        // Mode blanc par défaut
        setTheme("light");
        document.documentElement.classList.remove("dark");
      }
    } catch {
      document.documentElement.classList.remove("dark");
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "has_theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setTheme(e.newValue);
        if (e.newValue === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("has_theme", next);
      } catch {}
      if (next === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme, mounted };
}
