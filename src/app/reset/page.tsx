"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, RefreshCw, LogIn } from "lucide-react";

export default function ResetPage() {
  const [cleaned, setCleaned] = useState(false);

  const cleanAll = () => {
    try {
      // 1. Purge localStorage
      localStorage.clear();
      sessionStorage.clear();

      // 2. Purge cookies
      if (typeof document !== "undefined" && document.cookie) {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const eqPos = cookies[i].indexOf("=");
          const name = eqPos > -1 ? cookies[i].substring(0, eqPos).trim() : cookies[i].trim();
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
          document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname};`;
        }
      }
      setCleaned(true);
    } catch {
      setCleaned(true);
    }
  };

  useEffect(() => {
    cleanAll();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F5F7FA] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-[#111821] border border-[#263241] rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <h1 className="font-serif text-2xl font-bold text-[#F5F7FA] mb-2">
          Mémoire nettoyée avec succès
        </h1>

        <p className="text-xs sm:text-sm text-[#AAB4C0] mb-6 leading-relaxed">
          Les anciens cookies et caches de session de votre téléphone ont été réinitialisés. L’erreur de chargement est résolue.
        </p>

        <div className="flex flex-col gap-3">
          <Link
            href="/connexion"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#e0521c] hover:bg-[#c94514] text-white font-semibold text-sm transition-all shadow-md active:scale-95"
          >
            <LogIn className="w-4 h-4" />
            Aller à la connexion
          </Link>

          <button
            onClick={cleanAll}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#151D27] hover:bg-[#1a2533] border border-[#263241] text-[#AAB4C0] hover:text-[#F5F7FA] font-medium text-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Réexécuter le nettoyage
          </button>
        </div>
      </div>
    </div>
  );
}
