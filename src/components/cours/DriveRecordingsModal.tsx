"use client";

import React, { useState } from "react";
import {
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  Video,
  FolderOpen,
  UploadCloud,
  Film,
  Sparkles,
  Info,
} from "lucide-react";
import { DRIVE_RECORDINGS, DriveFolderInfo } from "@/lib/driveLinks";

export function GoogleDriveIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 87.3 78" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
      <path d="M43.65 25 29.9 1.2C28.55 2 27.4 3.1 26.6 4.5L1.2 48.55C.4 49.95 0 51.5 0 53.05h27.5z" fill="#00ac47"/>
      <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.1z" fill="#ea4335"/>
      <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.9 0H34.4c-1.6 0-3.15.4-4.5 1.2z" fill="#00832d"/>
      <path d="M59.8 53.05H27.5L13.75 76.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.4 4.5-1.2z" fill="#2684fc"/>
      <path d="M73.4 26.5 60.7 4.5c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25l16.15 28.05h27.5c0-1.55-.4-3.1-1.2-4.5z" fill="#ffba00"/>
    </svg>
  );
}

interface DriveRecordingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: "etudiant" | "professeur" | "admin";
  userNiveau?: "L1" | "L2" | string;
}

export function DriveRecordingsModal({
  isOpen,
  onClose,
  role,
  userNiveau,
}: DriveRecordingsModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const isProf = role === "professeur" || role === "admin";
  const preferredNiveau = userNiveau?.toUpperCase().includes("2") ? "L2" : "L1";

  const handleCopy = (key: string, url: string) => {
    try {
      navigator?.clipboard?.writeText(url);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      // fallback
    }
  };

  const folders: DriveFolderInfo[] = [DRIVE_RECORDINGS.L1, DRIVE_RECORDINGS.L2];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#111821] w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 dark:border-[#263241] overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0f2744] to-[#183a62] text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-xs">
              <GoogleDriveIcon className="w-3.5 h-3.5" />
              <span>Google Drive Officiel</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold">
              {isProf
                ? "Dépôt des Enregistrements de Cours"
                : "Enregistrements & Replays des Cours"}
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              {isProf
                ? "Déposez vos enregistrements vidéo des cours en ligne pour permettre aux étudiants absents de rattraper leurs séances."
                : "Vous étiez absent ou souhaitez réviser ? Visionnez l'intégralité des cours en ligne enregistrés par vos professeurs."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            title="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contenu */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Note informative */}
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-xl p-3.5 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">
                {isProf
                  ? "Consigne de dépôt pour les enseignants :"
                  : "Accès libre pour tous les étudiants de HAS :"}
              </p>
              <p className="text-amber-800/90 dark:text-amber-300/80 text-[11px] leading-relaxed">
                {isProf
                  ? "Après chaque cours sur Google Meet, téléchargez l'enregistrement ou importez-le directement dans le dossier Drive de la promotion (L1 ou L2). Nommez idéalement le fichier : DATE_MATIERE_TITRE.mp4 (ex: 2026-10-19_Analyse_Chapitre1.mp4)."
                  : "Les vidéos sont classées par promotion. Cliquez sur le dossier de votre classe pour ouvrir Google Drive et visionner les séances passées en streaming ou les télécharger."}
              </p>
            </div>
          </div>

          {/* Grille des 2 dossiers L1 & L2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {folders.map((folder) => {
              const isUserNiveau = folder.niveau === preferredNiveau;
              const isCopied = copiedKey === folder.niveau;

              return (
                <div
                  key={folder.niveau}
                  className={`rounded-xl border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                    isUserNiveau && !isProf
                      ? "bg-slate-50/80 dark:bg-[#151D27] border-[#0f2744] dark:border-[#e0521c] ring-2 ring-[#0f2744]/10 dark:ring-[#e0521c]/20"
                      : "bg-white dark:bg-[#151D27] border-slate-200 dark:border-[#263241] hover:border-slate-300 dark:hover:border-slate-600"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0f2744]/10 dark:bg-[#e0521c]/10 text-[#0f2744] dark:text-[#e0521c] font-black text-xs">
                        <FolderOpen className="w-3.5 h-3.5" />
                        <span>{folder.badge}</span>
                      </span>

                      {isUserNiveau && !isProf && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                          Votre Promotion
                        </span>
                      )}
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                        {folder.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1 leading-relaxed">
                        {folder.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#263241] flex flex-col gap-2">
                    <a
                      href={folder.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                        folder.niveau === "L1"
                          ? "bg-[#0f2744] hover:bg-[#1a3a5c] text-white"
                          : "bg-[#e0521c] hover:bg-[#c84418] text-white"
                      }`}
                    >
                      <GoogleDriveIcon className="w-4 h-4" />
                      <span>
                        {isProf ? folder.profActionText : folder.studentActionText}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(folder.niveau, folder.url)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#111821] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-50 dark:hover:bg-[#182230] text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 dark:text-emerald-400">Lien copié dans le presse-papier</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copier le lien direct du Drive</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pied de boîte */}
        <div className="p-4 bg-slate-50 dark:bg-[#151D27] border-t border-slate-200 dark:border-[#263241] flex items-center justify-between gap-3 text-xs text-slate-500 dark:text-[#AAB4C0]">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-[#e0521c]" />
            <span>Accès sécurisé réservé aux membres de HAS</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 dark:bg-[#263241] text-slate-700 dark:text-[#F5F7FA] font-bold text-xs hover:bg-slate-300 dark:hover:bg-[#324155] transition-colors cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
