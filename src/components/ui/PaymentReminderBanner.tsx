"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle, Calendar, Clock, X } from "lucide-react";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStudentPaymentStatus, StudentPaymentStatus } from "@/lib/paymentValidation";

interface PaymentReminderBannerProps {
  className?: string;
  forceShow?: boolean;
}

/**
 * Petite bande discrète et élégante affichant le rappel de renouvellement
 * sur l'accueil de l'espace étudiant : "Paiement à renouveler avant le ....."
 */
export function PaymentReminderBanner({ className = "", forceShow = false }: PaymentReminderBannerProps) {
  const { user } = useCurrentUser();
  const [dismissed, setDismissed] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<StudentPaymentStatus | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.role && user.role !== "etudiant") return;

    const status = getStudentPaymentStatus(user);
    setPaymentStatus(status);
  }, [user]);

  if (!paymentStatus) return null;
  if (dismissed && !forceShow) return null;

  const shouldShowReminder = paymentStatus.isReminderActive || forceShow;
  const isExpired = paymentStatus.isExpired;

  if (!shouldShowReminder && !isExpired) {
    return null;
  }

  return (
    <div
      role="alert"
      className={`w-full rounded-xl transition-all duration-200 border px-3.5 py-2.5 sm:px-4 sm:py-2.5 flex items-center justify-between gap-3 text-xs shadow-2xs ${
        isExpired
          ? "bg-rose-50/95 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900/60 text-rose-900 dark:text-rose-200"
          : "bg-gradient-to-r from-amber-50/95 via-orange-50/70 to-amber-50/95 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border-amber-300/80 dark:border-amber-700/50 text-amber-950 dark:text-amber-200"
      } ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span
          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
            isExpired
              ? "bg-rose-100 dark:bg-rose-900/60 border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400"
              : "bg-amber-100 dark:bg-amber-900/50 border-amber-200 dark:border-amber-700 text-[#e0521c] dark:text-amber-400"
          }`}
        >
          {isExpired ? <AlertCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
        </span>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 min-w-0">
          <span className="font-semibold text-xs leading-tight">
            {isExpired ? (
              <>
                <span className="font-bold">Accès expiré :</span> Paiement à renouveler auprès de l&apos;administration
              </>
            ) : (
              // Message simple demandé explicitement : "Paiement à renouveler avant le ....."
              <span className="font-bold text-[#0f2744] dark:text-amber-200">
                {paymentStatus.reminderMessage}
              </span>
            )}
          </span>

          {!isExpired && paymentStatus.daysRemaining > 0 && (
            <span className="text-[11px] text-slate-500 dark:text-amber-300/80">
              ({paymentStatus.daysRemaining} jour{paymentStatus.daysRemaining > 1 ? "s" : ""} restant{paymentStatus.daysRemaining > 1 ? "s" : ""})
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {!isExpired && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-amber-500/15 border border-amber-400/30 text-amber-800 dark:text-amber-300">
            <Calendar className="w-2.5 h-2.5" />
            {paymentStatus.shortExpirationDate}
          </span>
        )}

        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Masquer le rappel"
          className="p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/10 opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
