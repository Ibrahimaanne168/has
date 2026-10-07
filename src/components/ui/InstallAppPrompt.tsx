"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, CheckCircle, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

export function InstallAppPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
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

    // 2. Vérification si l'utilisateur a fermé la notification récemment (cooldown de 24h)
    const dismissedTime = localStorage.getItem("has_install_prompt_dismissed_time");
    if (dismissedTime) {
      const diff = Date.now() - parseInt(dismissedTime, 10);
      if (diff < 24 * 60 * 60 * 1000) {
        return; // Éphémère : ne pas afficher si déjà fermé aujourd'hui
      }
    }

    // 3. Détection iOS (Safari iPhone / iPad)
    const ua = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(ua) && !(window as unknown as { MSStream?: unknown }).MSStream;
    setIsIOS(isIOSDevice);

    // 4. Enregistrement du Service Worker si supporté
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 5. Écoute de l'événement natif Chrome / Edge / Android
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Apparition éphémère après 2 secondes pour ne pas surcharger le premier rendu
      setTimeout(() => {
        setIsVisible(true);
      }, 2000);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Écoute de la fin d'installation
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
    };
    window.addEventListener("appinstalled", handleAppInstalled);

    // Pour iOS ou si beforeinstallprompt n'est pas encore émis après 3.5s, on l'affiche quand même si non dismiss
    const timer = setTimeout(() => {
      if (!isStandalone && !localStorage.getItem("has_install_prompt_dismissed_time")) {
        setIsVisible(true);
      }
    }, 3500);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIOSModal(false);
    // Mémoriser la fermeture pour rester éphémère et discret
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
        handleDismiss();
      }
    } else {
      // Navigateurs sans prompt direct
      setShowIOSModal(true);
    }
  };

  if (isInstalled || !isVisible) {
    return null;
  }

  return (
    <>
      {/* Toast / Bouton flottant éphémère */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-50 max-w-sm w-auto animate-in fade-in slide-in-from-bottom-5 duration-500">
        <div className="relative bg-white/95 dark:bg-[#111821]/95 backdrop-blur-xl border border-slate-200/90 dark:border-[#263241] rounded-2xl p-4 shadow-[0_12px_36px_rgba(0,0,0,0.18)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] flex items-center justify-between gap-3.5 transition-all hover:border-[#0f2744]/30 dark:hover:border-[#e0521c]/40">
          {/* Logo et infos */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 shadow-xs border border-slate-200 dark:border-[#263241] bg-white">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="HAS"
                className="w-full h-full object-cover"
              />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-[#111821] animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c]">
                  Application
                </span>
                <span className="text-[10px] text-slate-400">• Web &amp; Mobile</span>
              </div>
              <p className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                Installer Halil Académie
              </p>
              <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] truncate">
                Accès direct &amp; notifications
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
              <span>Installer</span>
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

      {/* Modal d'instructions pour iOS Safari ou navigateurs standards */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 dark:border-[#263241]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/images/logo-has.jpg" alt="HAS" className="w-full h-full object-cover" />
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
