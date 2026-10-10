"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, CheckCircle, Smartphone, Monitor, Laptop } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isPC, setIsPC] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [showPCModal, setShowPCModal] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // 1. Vérification si l'application est déjà exécutée en mode PWA standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Détection du type d'appareil (PC vs Mobile)
    const ua = window.navigator.userAgent.toLowerCase();
    const isMobileDevice = /iphone|ipad|ipod|android|mobile/.test(ua);
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);
    setIsPC(!isMobileDevice);

    // 3. Vérification si l'utilisateur a fermé la notification récemment (cooldown de 24h)
    const dismissedTime = localStorage.getItem("has_install_prompt_dismissed_time");
    if (dismissedTime) {
      const diff = Date.now() - parseInt(dismissedTime, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // 4. Enregistrement du Service Worker si supporté
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 5. Écoute de l'événement natif Chrome / Edge (PC et Mobile)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => {
        setIsVisible(true);
      }, 1500);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Écoute de la fin d'installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    const timer = setTimeout(() => {
      if (!isStandalone && !localStorage.getItem("has_install_prompt_dismissed_time")) {
        setIsVisible(true);
      }
    }, 2500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSModal(false);
    setShowPCModal(false);
    localStorage.setItem("has_install_prompt_dismissed_time", Date.now().toString());
  };

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === "accepted") {
          setIsVisible(false);
          setDeferredPrompt(null);
        } else {
          handleDismiss();
        }
      } catch {
        if (isPC) {
          setShowPCModal(true);
        } else {
          handleDismiss();
        }
      }
    } else {
      if (isPC) {
        setShowPCModal(true);
      } else {
        setShowIOSModal(true);
      }
    }
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Toast / Bouton flottant */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm w-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="relative bg-white/95 dark:bg-[#111821]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#263241] rounded-2xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3.5 transition-all hover:border-[#0f2744]/30 dark:hover:border-[#e0521c]/40">
          {/* Logo et infos */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200 dark:border-[#263241] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/apple-touch-icon.png"
                alt="HAS"
                className="w-full h-full object-contain"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111821] animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] flex items-center gap-1">
                  {isPC ? <Monitor className="w-3 h-3 inline" /> : <Smartphone className="w-3 h-3 inline" />}
                  {isPC ? "Application PC" : "Application Mobile"}
                </span>
                <span className="text-[10px] text-slate-400">• HAS</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                {isPC ? "Installer l'app sur votre PC" : "Installer l'application HAS"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] truncate">
                {isPC ? "Raccourci Bureau & fenêtre dédiée" : "Accès direct & notifications"}
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-[#0f2744] to-[#1e3a8a] dark:from-[#e0521c] dark:to-[#f97316] text-white text-xs font-bold shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isPC ? "Installer sur PC" : "Installer"}</span>
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Fermer la suggestion"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#151D27] transition-colors cursor-pointer"
              title="Fermer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal d'instructions pour PC (Chrome, Edge, Windows, Mac) */}
      {showPCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#263241] bg-white shadow-xs p-1 flex items-center justify-center">
                  <Laptop className="w-6 h-6 text-[#0f2744] dark:text-[#e0521c]" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                    Installer HAS sur votre PC
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0]">
                    Windows &amp; Mac — Fenêtre dédiée &amp; Bureau
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowPCModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#151D27] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700 dark:text-[#AAB4C0]">
              <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/60 dark:border-blue-900/40 space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0f2744] text-white inline-flex items-center justify-center text-[11px]">1</span>
                  Via la barre d&apos;adresse de votre navigateur :
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                  Regardez tout à droite de la barre d&apos;adresse en haut : cliquez sur l&apos;icône <strong>« Installer Halil Académie Scientifique »</strong> (petit ordinateur avec une flèche vers le bas <Download className="w-3 h-3 inline text-[#e0521c]" />).
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] space-y-1.5">
                <p className="font-bold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#0f2744] text-white inline-flex items-center justify-center text-[11px]">2</span>
                  Ou via le menu du navigateur (Chrome / Edge) :
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-300 pl-7 leading-relaxed">
                  Cliquez sur les <strong>3 points (⋮ ou …)</strong> en haut à droite du navigateur &gt; sélectionnez <strong>« Enregistrer et partager »</strong> ou <strong>« Applications »</strong> &gt; cliquez sur <strong>« Installer ce site en tant qu&apos;application »</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1.5">
                <p className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Raccourci Bureau automatique
                </p>
                <p className="text-[11px] text-emerald-800 dark:text-emerald-400 pl-6 leading-relaxed">
                  Une icône <strong>HAS</strong> sera immédiatement créée sur votre Bureau et dans votre barre des tâches Windows pour un lancement direct sans navigateur.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowPCModal(false);
                  handleDismiss();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0f2744] dark:bg-[#e0521c] text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm cursor-pointer"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'instructions pour iOS Safari */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl overflow-hidden border border-slate-200 dark:border-[#263241] bg-white shadow-xs p-0.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/apple-touch-icon.png" alt="HAS" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                    Installer l&apos;application HAS
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0]">
                    Ajoutez l&apos;application sur votre écran d&apos;accueil
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowIOSModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#151D27] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 dark:text-[#AAB4C0]">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#151D27] border border-slate-100 dark:border-[#263241]">
                <div className="w-7 h-7 rounded-lg bg-[#0f2744] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    Appuyez sur le bouton de Partage
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#687585] mt-0.5 flex items-center gap-1">
                    Dans la barre de navigation Safari : <Share2 className="w-3.5 h-3.5 inline text-[#0f2744] dark:text-[#e0521c]" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#151D27] border border-slate-100 dark:border-[#263241]">
                <div className="w-7 h-7 rounded-lg bg-[#0f2744] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    Sélectionnez « Sur l&apos;écran d&apos;accueil »
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#687585] mt-0.5 flex items-center gap-1">
                    Faites défiler le menu puis cliquez sur <PlusSquare className="w-3.5 h-3.5 inline text-[#0f2744] dark:text-[#e0521c]" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-[#151D27] border border-slate-100 dark:border-[#263241]">
                <div className="w-7 h-7 rounded-lg bg-[#0f2744] text-white flex items-center justify-center font-bold text-xs shrink-0">
                  3
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-[#F5F7FA]">
                    Confirmez en cliquant sur « Ajouter »
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#687585] mt-0.5">
                    L&apos;icône HAS apparaîtra directement sur votre écran de téléphone.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowIOSModal(false);
                  handleDismiss();
                }}
                className="w-full py-2.5 rounded-xl bg-[#0f2744] dark:bg-[#e0521c] text-white text-xs font-bold hover:opacity-95 transition-all shadow-sm cursor-pointer"
              >
                J&apos;ai compris
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
