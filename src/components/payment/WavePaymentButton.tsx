"use client";

import React, { useState } from "react";
import { Loader2, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

export interface WavePaymentButtonProps {
  orderId?: string;
  userId?: string;
  email?: string;
  fullName?: string;
  matricule?: string;
  filiere?: string;
  niveau?: string;
  amount?: number;
  className?: string;
  onSuccess?: (order: { orderId: string; clientReference: string }) => void;
  onError?: (error: string) => void;
}

export function WavePaymentButton({
  orderId,
  userId,
  email,
  fullName,
  matricule,
  filiere,
  niveau,
  amount,
  className = "",
  onError,
}: WavePaymentButtonProps) {
  // États : 'idle' | 'loading' | 'redirecting' | 'success' | 'error'
  const [status, setStatus] = useState<"idle" | "loading" | "redirecting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePayWithWave = async () => {
    if (status === "loading" || status === "redirecting") return;

    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch("/api/payments/wave/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          userId,
          email,
          fullName,
          matricule,
          filiere,
          niveau,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Impossible d'initialiser le paiement avec Wave.");
      }

      // Si la commande est déjà payée
      if (data.alreadyPaid) {
        setStatus("success");
        window.location.href = `/payment/success?ref=${encodeURIComponent(data.client_reference)}`;
        return;
      }

      // URL de redirection Wave Checkout
      if (data.wave_launch_url) {
        setStatus("redirecting");
        window.location.href = data.wave_launch_url;
      } else {
        throw new Error("L'URL de paiement Wave est introuvable.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inattendue lors du paiement Wave";
      setErrorMessage(msg);
      setStatus("error");
      if (onError) onError(msg);
    }
  };

  const displayAmount = amount ? `${amount.toLocaleString("fr-FR")} FCFA` : "25 000 FCFA";

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        type="button"
        onClick={handlePayWithWave}
        disabled={status === "loading" || status === "redirecting"}
        className={`group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm sm:text-base transition-all duration-200 cursor-pointer shadow-lg active:scale-[0.98] disabled:opacity-80 disabled:cursor-wait text-white bg-gradient-to-r from-[#1dc4eb] via-[#00B2FE] to-[#0091db] hover:from-[#17b3d7] hover:to-[#0081c7] shadow-sky-500/20 hover:shadow-sky-500/35 border border-sky-300/40 ${className}`}
      >
        {/* Logo Wave SVG Officiel (Pingouin / Oiseau Wave stylisé) */}
        <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0 p-1 ring-1 ring-white/40">
          <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M50 8C26.8 8 8 26.8 8 50s18.8 42 42 42 42-18.8 42-42S73.2 8 50 8z"
              fill="#00B2FE"
            />
            <path
              d="M51.5 24c-12.4 0-22.5 10.1-22.5 22.5 0 9.8 6.3 18.2 15.2 21.2l-2.2 8.3 11-4.8c1.6.4 3.3.6 5 .6 12.4 0 22.5-10.1 22.5-22.5S70.4 24 51.5 24z"
              fill="#FFFFFF"
            />
            <circle cx="45" cy="42" r="3.5" fill="#1A2B49" />
            <path
              d="M48 50c0-2.2 3.5-2.2 3.5 0 0 3-3.5 3-3.5 0z"
              fill="#F47C20"
            />
          </svg>
        </div>

        {/* État du libellé */}
        {status === "idle" && (
          <span className="flex items-center gap-2">
            <span>Payer avec Wave</span>
            <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-mono font-black tracking-tight">
              {displayAmount}
            </span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}

        {status === "loading" && (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>Création du paiement...</span>
          </span>
        )}

        {status === "redirecting" && (
          <span className="flex items-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-white" />
            <span>Redirection vers Wave...</span>
          </span>
        )}

        {status === "success" && (
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <span>Paiement confirmé ✓</span>
          </span>
        )}

        {status === "error" && (
          <span className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-200" />
            <span>Réessayer avec Wave</span>
          </span>
        )}
      </button>

      {/* Message d'erreur en cas d'échec */}
      {errorMessage && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
