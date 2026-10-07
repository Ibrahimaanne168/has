"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, ArrowLeft, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/Button";

function PaymentCancelContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] flex flex-col justify-between transition-colors">
      {/* Header épuré */}
      <header className="bg-white dark:bg-[#111821] border-b border-slate-200 dark:border-[#263241] py-3 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-white ring-1 ring-slate-200 dark:ring-[#263241]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo-has.jpg" alt="Logo HAS" className="w-full h-full object-cover" />
            </div>
            <span className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              Halil Académie Scientifique
            </span>
          </Link>
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-semibold bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Paiement Non Finalisé</span>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-md w-full bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center mx-auto shadow-inner">
            <XCircle className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              Paiement annulé
            </h1>
            <p className="text-sm text-slate-600 dark:text-[#AAB4C0] max-w-sm mx-auto">
              La transaction Wave a été interrompue ou annulée. Aucun montant n&apos;a été prélevé sur votre compte.
            </p>
          </div>

          {ref && (
            <div className="bg-slate-50 dark:bg-[#151D27] rounded-xl border border-slate-200/90 dark:border-[#263241] p-3 text-xs text-slate-500 dark:text-[#AAB4C0]">
              Référence du dossier : <span className="font-mono font-bold text-[#0f2744] dark:text-[#F5F7FA]">{ref}</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/inscription">
              <Button
                variant="accent"
                size="lg"
                leftIcon={<RefreshCw className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Réessayer
              </Button>
            </Link>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                Accueil
              </Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-[#687585] border-t border-slate-200 dark:border-[#263241] bg-white dark:bg-[#111821]">
        © {new Date().getFullYear()} Halil Académie Scientifique (HAS) — Service de paiement sécurisé.
      </footer>
    </div>
  );
}

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-[#0B0F14]" />}>
      <PaymentCancelContent />
    </Suspense>
  );
}
