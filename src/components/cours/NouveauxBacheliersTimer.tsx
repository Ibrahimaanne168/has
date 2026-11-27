"use client";

import React, { useState, useEffect } from "react";
import { Clock, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function NouveauxBacheliersTimer() {
  // Session spéciale Nouveaux Bacheliers : Du Samedi 28 Novembre 2026 au Dimanche 27 Décembre 2026 à 23h59:59
  // Début : 28 nov 2026 à 21h00 (heure du premier cours ou minuit)
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [phase, setPhase] = useState<"before_start" | "in_session" | "ended">("in_session");

  useEffect(() => {
    // Dates clés pour les Nouveaux Bacheliers
    // "demain" par rapport au 27 nov = 28 novembre 2026
    const startDate = new Date(2026, 10, 28, 20, 0, 0); // 28 Nov 2026 à 20h00 (1h avant le premier cours de 21h)
    const endDate = new Date(2026, 11, 27, 23, 59, 59); // 27 Décembre 2026 à 23h59:59

    const calculateTime = () => {
      const now = new Date();

      if (now < startDate) {
        // Compte à rebours avant le premier cours
        setPhase("before_start");
        const diff = startDate.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else if (now >= startDate && now <= endDate) {
        // En pleine session de cours : compte à rebours jusqu'à la fin (dimanche 27 décembre)
        setPhase("in_session");
        const diff = endDate.getTime() - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setPhase("ended");
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0f2744] via-[#16365c] to-[#0f2744] p-5 sm:p-6 text-white border border-[#e0521c]/40 shadow-md">
      {/* Halo décoratif discret */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#e0521c]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        {/* Intitulé & Période */}
        <div className="space-y-1.5 max-w-lg">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#e0521c] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
              <Sparkles className="w-3 h-3" />
              Session Intensive Nouveaux Bacheliers
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              • Du 28 Nov. au 27 Déc. 2026
            </span>
          </div>

          <h3 className="font-serif text-lg sm:text-xl font-bold text-white tracking-tight">
            {phase === "before_start"
              ? "Démarrage imminent des cours intensifs"
              : phase === "in_session"
              ? "Session préparatoire en cours — Compte à rebours"
              : "Session préparatoire terminée"}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed">
            {phase === "before_start"
              ? "Vos cours démarrent demain. Tenez-vous prêts pour la session d'intégration académique !"
              : phase === "in_session"
              ? "Vos cours se poursuivent jusqu'au dimanche 27 décembre 2026 inclus. Restez assidus !"
              : "La session intensive des Nouveaux Bacheliers est désormais achevée. Félicitations pour votre assiduité !"}
          </p>
        </div>

        {/* Blocs du Timer */}
        {phase !== "ended" ? (
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start md:self-auto">
            <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
              <span className="font-mono text-xl sm:text-2xl font-black text-white leading-none">
                {String(timeLeft.days).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold mt-1">
                Jours
              </span>
            </div>

            <span className="text-xl font-black text-[#e0521c]">:</span>

            <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
              <span className="font-mono text-xl sm:text-2xl font-black text-white leading-none">
                {String(timeLeft.hours).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold mt-1">
                Heures
              </span>
            </div>

            <span className="text-xl font-black text-[#e0521c]">:</span>

            <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 shadow-inner">
              <span className="font-mono text-xl sm:text-2xl font-black text-white leading-none">
                {String(timeLeft.minutes).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-300 font-bold mt-1">
                Min
              </span>
            </div>

            <span className="text-xl font-black text-[#e0521c]">:</span>

            <div className="flex flex-col items-center justify-center min-w-[56px] sm:min-w-[64px] py-2 px-2.5 rounded-xl bg-[#e0521c]/25 backdrop-blur-md border border-[#e0521c]/40 shadow-inner">
              <span className="font-mono text-xl sm:text-2xl font-black text-[#e0521c] leading-none">
                {String(timeLeft.seconds).padStart(2, "0")}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-slate-200 font-bold mt-1">
                Sec
              </span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Session complétée avec succès</span>
          </div>
        )}
      </div>
    </div>
  );
}
