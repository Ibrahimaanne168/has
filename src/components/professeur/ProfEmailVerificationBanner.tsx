"use client";

import React, { useState } from "react";
import {
  Mail,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  X,
  Loader2,
  Clock,
  Sparkles,
} from "lucide-react";
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import { Button } from "@/components/ui/Button";

export function isProfEmailVerified(prof?: { email?: string | null; is_email_verified?: boolean } | null): boolean {
  if (!prof || !prof.email) return false;
  if (prof.is_email_verified === true) return true;
  const lower = prof.email.toLowerCase().trim();
  // Les faux mails / temporaires par défaut de la plateforme
  if (
    lower.includes("@halil-academie.com") ||
    lower.includes("@has.sn") ||
    lower.endsWith(".local") ||
    lower.includes("example.com")
  ) {
    return false;
  }
  return Boolean(prof.is_email_verified);
}

export function ProfEmailVerificationBanner() {
  const { prof, updateProfProfile } = useCurrentProfesseur();
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState<"input_email" | "input_code" | "success">("input_email");

  const [realEmail, setRealEmail] = useState("");
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dismissed, setDismissed] = useState(false);

  const isVerified = isProfEmailVerified(prof);

  if (isVerified || dismissed) {
    return null;
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = realEmail.trim().toLowerCase();

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage("Veuillez saisir une adresse email valide (ex: mon.nom@gmail.com).");
      return;
    }

    if (cleanEmail.includes("@halil-academie.com") || cleanEmail.includes("@has.sn")) {
      setErrorMessage("Veuillez entrer votre véritable adresse email personnelle ou professionnelle (ex: Gmail, Yahoo, etc.).");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/professeur/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: prof.full_name,
          profId: prof.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Échec d'envoi du code.");
      }
      setStep("input_code");
      setSuccessMessage(data.message || `Code à 6 chiffres envoyé à ${cleanEmail}`);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanCode = code.trim();

    if (!cleanCode || cleanCode.length < 6) {
      setErrorMessage("Veuillez saisir le code complet à 6 chiffres.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/professeur/confirm-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: realEmail.trim().toLowerCase(),
          code: cleanCode,
          profId: prof.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Code invalide.");
      }

      // Succès : mise à jour du profil local
      const verifiedAt = new Date().toISOString();
      await updateProfProfile({
        email: realEmail.trim().toLowerCase(),
        is_email_verified: true,
        email_verified_at: verifiedAt,
      });

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("has_auth_identifier", realEmail.trim().toLowerCase());
        } catch {}
      }

      setStep("success");
      setSuccessMessage("Votre adresse email a été certifiée avec succès !");
      setTimeout(() => {
        setModalOpen(false);
      }, 2500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Erreur lors de la validation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* ── BANNIÈRE EN TÊTE ULTRA VISIBLE & SOIGNÉE ── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border-2 border-amber-500/30 p-4 sm:p-5 shadow-sm transition-all animate-fadeIn">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                  Action requise : Certifiez votre véritable adresse email
                </h4>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  Rappel Google Meet 1h
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-[#AAB4C0] mt-1 max-w-2xl leading-relaxed">
                Votre compte utilise actuellement une adresse temporaire (<strong>{prof.email}</strong>).
                Renseignez votre vrai email personnel pour <strong>recevoir votre rappel 1h avant chaque cours</strong> et ajouter votre lien Google Meet pour vos étudiants.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <Button
              onClick={() => {
                setModalOpen(true);
                setStep("input_email");
                setErrorMessage(null);
              }}
              size="sm"
              className="bg-[#0f2744] hover:bg-[#1a3a5c] dark:bg-[#e0521c] dark:hover:bg-[#f0632d] text-white font-bold text-xs shadow-md gap-1.5 cursor-pointer"
            >
              <Mail className="w-4 h-4" />
              <span>Valider mon email</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Fermer temporairement"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL DE VÉRIFICATION AVEC CODE OTP À 6 CHIFFRES ── */}
      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="relative w-full max-w-md bg-white dark:bg-[#111821] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#263241] overflow-hidden">
            {/* Header du modal */}
            <div className="flex items-center justify-between p-5 bg-[#0f2744] text-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-[#e0521c]" />
                </div>
                <div>
                  <h3 className="font-bold text-sm font-serif">Vérification de l'adresse email</h3>
                  <p className="text-[11px] text-white/70">Espace Corps Professoral HAS</p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Corps du modal */}
            <div className="p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/50 text-xs text-red-700 dark:text-red-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && step !== "success" && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Étape 1 : Saisie du véritable email */}
              {step === "input_email" && (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                      Votre véritable adresse email personnelle ou pro * :
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ex: prenom.nom@gmail.com"
                      value={realEmail}
                      onChange={(e) => setRealEmail(e.target.value)}
                      className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-sm focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-hidden transition-all"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-[#687585] mt-1.5 leading-relaxed">
                      L'administrateur planifie les cours sur l'emploi du temps. Vous recevrez à cette adresse un rappel <strong>1h avant chaque cours</strong> pour ajouter votre lien Meet.
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setModalOpen(false)}
                    >
                      Annuler
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isLoading}
                      className="bg-[#0f2744] hover:bg-[#1a3a5c] dark:bg-[#e0521c] text-white font-bold"
                    >
                      M'envoyer le code (6 chiffres)
                    </Button>
                  </div>
                </form>
              )}

              {/* Étape 2 : Saisie du code à 6 chiffres */}
              {step === "input_code" && (
                <form onSubmit={handleConfirmCode} className="space-y-4">
                  <div className="text-center py-2">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#e0521c] flex items-center justify-center mx-auto mb-2 border border-orange-200/60 dark:border-orange-800/40">
                      <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#AAB4C0]">
                      Un code secret à 6 chiffres a été envoyé à :<br />
                      <strong className="text-slate-900 dark:text-white">{realEmail}</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-center text-slate-700 dark:text-[#F5F7FA] mb-2">
                      Code de vérification (6 chiffres) :
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      autoFocus
                      placeholder="••••••"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      className="w-full h-12 text-center font-mono font-black text-2xl tracking-[8px] rounded-xl border-2 border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA] focus:border-[#e0521c] focus:outline-hidden"
                    />
                    <p className="text-[11px] text-center text-slate-400 mt-1.5">
                      Code valable pendant 15 minutes.
                    </p>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStep("input_email")}
                      className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 underline cursor-pointer"
                    >
                      Changer d'adresse email
                    </button>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setModalOpen(false)}
                      >
                        Fermer
                      </Button>
                      <Button
                        type="submit"
                        size="sm"
                        isLoading={isLoading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        Valider mon adresse
                      </Button>
                    </div>
                  </div>
                </form>
              )}

              {/* Étape 3 : Confirmation */}
              {step === "success" && (
                <div className="text-center py-6 space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-300 dark:border-emerald-700">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Adresse certifiée avec succès !
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#AAB4C0]">
                    Votre adresse <strong>{realEmail}</strong> est désormais active. Vous recevrez vos rappels 1 heure avant chaque cours.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
