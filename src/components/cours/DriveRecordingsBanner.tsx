"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  Copy,
  CheckCircle2,
  FolderOpen,
  Film,
} from "lucide-react";
import { DRIVE_RECORDINGS, getDriveLinkForNiveau } from "@/lib/driveLinks";
import { GoogleDriveIcon, DriveRecordingsModal } from "./DriveRecordingsModal";

interface DriveRecordingsBannerProps {
  role: "etudiant" | "professeur" | "admin";
  userNiveau?: "L1" | "L2" | string;
  variant?: "card" | "banner" | "compact";
  className?: string;
}

export function DriveRecordingsBanner({
  role,
  userNiveau,
  variant = "card",
  className = "",
}: DriveRecordingsBannerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const isProf = role === "professeur" || role === "admin";
  // Strict cloisonnement étudiant : L1 ne voit QUE L1, L2 ne voit QUE L2
  const preferredNiveau: "L1" | "L2" = userNiveau?.toUpperCase().includes("2") ? "L2" : "L1";
  const userDrive = getDriveLinkForNiveau(preferredNiveau);

  const handleCopy = (key: string, url: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      navigator?.clipboard?.writeText(url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // ignore
    }
  };

  // -------------------------------------------------------------
  // VARIANT COMPACT / BANNER
  // -------------------------------------------------------------
  if (variant === "compact" || variant === "banner") {
    return (
      <>
        <div
          className={`bg-gradient-to-r from-blue-50 via-indigo-50/50 to-orange-50/40 dark:from-[#111c2e] dark:via-[#151D27] dark:to-[#221711] border border-blue-200/80 dark:border-[#2b4465] rounded-xl p-3.5 sm:p-4 shadow-xs transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${className}`}
        >
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-white dark:bg-[#1a293d] border border-blue-200 dark:border-[#35537d] flex items-center justify-center shrink-0 shadow-xs">
              <GoogleDriveIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0f2744] dark:text-cyan-400">
                  {isProf ? "Dépôt des Cours Enregistrés" : `Replays & Absences — ${userDrive.badge}`}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-semibold">
                  Google Drive
                </span>
              </div>
              <h4 className="font-serif text-sm font-bold text-slate-900 dark:text-[#F5F7FA] truncate mt-0.5">
                {isProf
                  ? "Enregistrements vidéo des cours en direct"
                  : `Vidéothèque officielle — ${userDrive.label}`}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] line-clamp-1">
                {isProf
                  ? "Déposez vos enregistrements Meet pour les étudiants absents (L1 & L2)."
                  : `Accédez à l'intégralité des enregistrements vidéo de ${userDrive.label} pour réviser ou rattraper un cours manqué.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            {isProf ? (
              // Le professeur enseigne aux deux promotions : accès L1 et L2
              <>
                <a
                  href={DRIVE_RECORDINGS.L1.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Drive L1</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
                <a
                  href={DRIVE_RECORDINGS.L2.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#e0521c] hover:bg-[#c84418] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <FolderOpen className="w-3.5 h-3.5" />
                  <span>Drive L2</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </>
            ) : (
              // L'étudiant ne voit STRICTEMENT que le lien de sa promotion
              <a
                href={userDrive.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0f2744] dark:bg-[#1e3a63] hover:bg-[#183a62] dark:hover:bg-[#284c7f] text-white text-xs font-bold transition-all shadow-xs"
              >
                <GoogleDriveIcon className="w-3.5 h-3.5" />
                <span>Ouvrir le Drive {userDrive.niveau}</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            )}
          </div>
        </div>

        {isProf && (
          <DriveRecordingsModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            role={role}
            userNiveau={userNiveau}
          />
        )}
      </>
    );
  }

  // -------------------------------------------------------------
  // VARIANT CARD (DÉTAILLÉE, RICHE ET STRICTEMENT CLOISONNÉE)
  // -------------------------------------------------------------
  return (
    <>
      <div
        className={`bg-white dark:bg-[#111821] rounded-2xl border-2 border-slate-200/90 dark:border-[#263241] p-5 sm:p-6 shadow-[0_2px_12px_-2px_rgba(15,23,42,0.06)] dark:shadow-[0_2px_12px_-2px_rgba(0,0,0,0.5)] relative overflow-hidden ${className}`}
      >
        {/* Accent de fond subtil */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-blue-400/10 via-orange-400/10 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          {/* Bloc texte */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f2744]/10 dark:bg-[#1e3a63]/50 text-[#0f2744] dark:text-cyan-300 font-bold text-xs">
                <GoogleDriveIcon className="w-3.5 h-3.5" />
                <span>Google Drive HAS</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100/70 dark:bg-orange-950/40 text-[#e0521c] font-black text-xs">
                <Film className="w-3 h-3" />
                <span>Replays &amp; Enregistrements</span>
              </span>

              {isProf ? (
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                  Espace Dépôt Professeur
                </span>
              ) : (
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/40">
                  {userDrive.badge} uniquement
                </span>
              )}
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              {isProf
                ? "Dépôt des Enregistrements Vidéo des Cours en Ligne"
                : `Vidéothèque & Enregistrements — ${userDrive.label}`}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
              {isProf
                ? "Certains étudiants sont parfois absents lors des séances en direct. Enregistrez vos cours Google Meet et déposez les vidéos dans les dossiers Drive L1 ou L2 correspondants."
                : `Vous étiez absent ou souhaitez réécouter une explication ? Tous les enregistrements des cours en ligne de votre promotion (${userDrive.label}) sont archivés sur ce dossier Google Drive officiel.`}
            </p>
          </div>

          {/* Bloc d'actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[240px]">
            {isProf ? (
              // Actions PROFESSEUR : les deux boutons L1 et L2 bien distincts
              <>
                <div className="flex items-center gap-2">
                  <a
                    href={DRIVE_RECORDINGS.L1.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f2744] hover:bg-[#183a62] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-[#e0521c]" />
                    <span>Déposer sur Drive L1</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopy("L1", DRIVE_RECORDINGS.L1.url, e)}
                    title="Copier le lien Drive L1"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] hover:bg-slate-100 text-slate-600 dark:text-[#AAB4C0] cursor-pointer"
                  >
                    {copiedKey === "L1" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={DRIVE_RECORDINGS.L2.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#e0521c] hover:bg-[#c84418] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-white" />
                    <span>Déposer sur Drive L2</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>
                  <button
                    type="button"
                    onClick={(e) => handleCopy("L2", DRIVE_RECORDINGS.L2.url, e)}
                    title="Copier le lien Drive L2"
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] hover:bg-slate-100 text-slate-600 dark:text-[#AAB4C0] cursor-pointer"
                  >
                    {copiedKey === "L2" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </>
            ) : (
              // Actions ÉTUDIANT : STRICTEMENT LE DRIVE DE SA PROMOTION (aucun lien vers l'autre promotion)
              <div className="flex items-center gap-2">
                <a
                  href={userDrive.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all cursor-pointer ${
                    userDrive.niveau === "L2"
                      ? "bg-[#e0521c] hover:bg-[#c84418] text-white"
                      : "bg-[#0f2744] hover:bg-[#183a62] text-white"
                  }`}
                >
                  <GoogleDriveIcon className="w-4 h-4" />
                  <span>Visionner les cours ({userDrive.niveau})</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>
                <button
                  type="button"
                  onClick={(e) => handleCopy(userDrive.niveau, userDrive.url, e)}
                  title={`Copier le lien Drive ${userDrive.niveau}`}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] hover:bg-slate-100 text-slate-600 dark:text-[#AAB4C0] cursor-pointer"
                >
                  {copiedKey === userDrive.niveau ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isProf && (
        <DriveRecordingsModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          role={role}
          userNiveau={userNiveau}
        />
      )}
    </>
  );
}
