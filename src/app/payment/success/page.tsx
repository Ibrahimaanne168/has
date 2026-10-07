"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  LogIn,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const ref = searchParams.get("ref");
  const orderId = searchParams.get("order_id");
  const checkoutId = searchParams.get("checkout_id");
  const simulated = searchParams.get("simulated");

  const [status, setStatus] = useState<"checking" | "paid" | "pending" | "failed">("checking");
  const [orderData, setOrderData] = useState<{
    id?: string;
    client_reference?: string;
    amount?: number;
    currency?: string;
    matricule?: string;
    full_name?: string;
    filiere?: string;
  } | null>(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let isCancelled = false;

    const checkStatus = async () => {
      try {
        const query = new URLSearchParams();
        if (ref) query.set("ref", ref);
        if (orderId) query.set("order_id", orderId);
        if (checkoutId) query.set("checkout_id", checkoutId);

        // Si simulation sans clé Wave en mode local
        if (simulated === "1") {
          setStatus("paid");
          setOrderData({
            client_reference: ref || "HAS-SIMULATED",
            amount: 25000,
            currency: "XOF",
          });
          return;
        }

        const res = await fetch(`/api/payments/wave/status?${query.toString()}`);
        if (!res.ok) {
          if (!isCancelled && attempts > 10) setStatus("pending");
          return;
        }

        const data = await res.json();
        if (isCancelled) return;

        if (data.status === "paid") {
          setStatus("paid");
          setOrderData(data.order || null);
        } else if (data.status === "failed" || data.status === "cancelled") {
          setStatus("failed");
          setOrderData(data.order || null);
        } else {
          // Encore en attente du webhook Wave
          setStatus("pending");
          setOrderData(data.order || null);
        }
      } catch (err) {
        console.warn("[CHECK-STATUS-ERR]", err);
      } finally {
        if (!isCancelled) setAttempts((prev) => prev + 1);
      }
    };

    // Premier appel immédiat
    checkStatus();

    // Sondage automatique toutes les 2.5 secondes si le webhook n'est pas encore confirmé
    interval = setInterval(() => {
      if (status !== "paid" && attempts < 15) {
        checkStatus();
      }
    }, 2500);

    return () => {
      isCancelled = true;
      clearInterval(interval);
    };
  }, [ref, orderId, checkoutId, attempts, status, simulated]);

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
          <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Paiement Sécurisé Wave</span>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="max-w-lg w-full bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-3xl p-6 sm:p-10 shadow-2xl text-center space-y-6">
          {/* État 1 : Vérification en cours */}
          {status === "checking" && (
            <div className="space-y-4 py-6">
              <div className="w-16 h-16 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-500 border border-sky-200 dark:border-sky-800 flex items-center justify-center mx-auto animate-pulse">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                Vérification du paiement en cours…
              </h1>
              <p className="text-sm text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto">
                Nous interrogeons les serveurs sécurisés de Wave pour confirmer votre transaction. Veuillez patienter quelques secondes.
              </p>
            </div>
          )}

          {/* État 2 : En attente du webhook Wave */}
          {status === "pending" && (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 border border-amber-200 dark:border-amber-800 flex items-center justify-center mx-auto">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                Nous vérifions votre paiement…
              </h1>
              <p className="text-sm text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto">
                Votre transaction Wave a été initiée. Dès réception de la confirmation officielle, votre compte sera activé automatiquement.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAttempts((p) => p + 1)}
                  leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                  Actualiser la vérification
                </Button>
              </div>
            </div>
          )}

          {/* État 3 : Paiement Confirmé avec succès */}
          {status === "paid" && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Paiement Wave Validé avec Succès</span>
                </div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                  Félicitations & Bienvenue !
                </h1>
                <p className="text-sm text-slate-600 dark:text-[#AAB4C0] max-w-md mx-auto">
                  Votre inscription académique à Halil Académie Scientifique est officiellement validée.
                  Vous pouvez désormais accéder à votre espace à n&apos;importe quel moment.
                </p>
              </div>

              {/* Récapitulatif de la transaction */}
              <div className="bg-slate-50 dark:bg-[#151D27] rounded-2xl border border-slate-200/90 dark:border-[#263241] p-4 text-left space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#263241]">
                  <span className="text-slate-500 dark:text-[#AAB4C0]">Frais d&apos;inscription :</span>
                  <span className="font-bold text-slate-900 dark:text-[#F5F7FA]">
                    {orderData?.amount ? `${orderData.amount.toLocaleString("fr-FR")} FCFA` : "25 000 FCFA"}
                  </span>
                </div>
                {orderData?.client_reference && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#263241]">
                    <span className="text-slate-500 dark:text-[#AAB4C0]">Référence Wave :</span>
                    <span className="font-mono font-bold text-[#0f2744] dark:text-[#e0521c]">
                      {orderData.client_reference}
                    </span>
                  </div>
                )}
                {orderData?.matricule && (
                  <div className="flex justify-between py-1 border-b border-slate-200/60 dark:border-[#263241]">
                    <span className="text-slate-500 dark:text-[#AAB4C0]">Matricule attribué :</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-[#F5F7FA]">
                      {orderData.matricule}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 dark:text-[#AAB4C0]">Statut du compte :</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">Actif & Certifié ✓</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/connexion")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Accéder à mon espace étudiant
                </Button>
              </div>
            </div>
          )}

          {/* État 4 : Échec de validation */}
          {status === "failed" && (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-500 border border-rose-200 dark:border-rose-800 flex items-center justify-center mx-auto">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h1 className="font-serif text-2xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                Paiement non confirmé
              </h1>
              <p className="text-sm text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto">
                La transaction n&apos;a pas pu être validée par les serveurs Wave. Aucun débit définitif n&apos;a été retenu.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
                <Link href="/inscription">
                  <Button variant="accent" size="md" leftIcon={<RefreshCw className="w-4 h-4" />}>
                    Réessayer le paiement
                  </Button>
                </Link>
                <Link href="/connexion">
                  <Button variant="outline" size="md">
                    Retour à la connexion
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-[#687585] border-t border-slate-200 dark:border-[#263241] bg-white dark:bg-[#111821]">
        © {new Date().getFullYear()} Halil Académie Scientifique (HAS) — Service de paiement certifié.
      </footer>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F14] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#e0521c]" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
