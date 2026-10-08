"use client";

import React, { useEffect, useState } from "react";
import { X, Download, ExternalLink, FileText, Loader2, Maximize2 } from "lucide-react";
import { dataUrlToBlob, isIOSDevice } from "@/lib/fileDownload";

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName?: string | null;
  title: string;
  matiereName?: string | null;
  professeurName?: string | null;
}

export function PdfViewerModal({
  isOpen,
  onClose,
  fileUrl,
  fileName,
  title,
  matiereName,
  professeurName,
}: PdfViewerModalProps) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !fileUrl) {
      setBlobUrl(null);
      return;
    }

    setLoading(true);
    setError(null);

    let activeBlobUrl: string | null = null;

    try {
      if (fileUrl.startsWith("data:")) {
        const blob = dataUrlToBlob(fileUrl);
        activeBlobUrl = URL.createObjectURL(blob);
        setBlobUrl(activeBlobUrl);
        setLoading(false);
      } else {
        // Pour les URLs standards
        setBlobUrl(fileUrl);
        setLoading(false);
      }
    } catch (err) {
      console.warn("Erreur préparation visualisation PDF:", err);
      setBlobUrl(fileUrl);
      setLoading(false);
    }

    return () => {
      if (activeBlobUrl && activeBlobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(activeBlobUrl);
      }
    };
  }, [isOpen, fileUrl]);

  // Fermer sur Échap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !fileUrl) return null;

  const downloadName = fileName || `${(title || "document").replace(/[/\\?%*:|"<>]/g, "_")}.pdf`;

  const handleOpenNewTab = () => {
    if (blobUrl) {
      window.open(blobUrl, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownload = () => {
    if (!blobUrl) return;
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = downloadName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Conteneur principal de la visionneuse */}
      <div className="relative w-full max-w-5xl h-[92vh] sm:h-[90vh] bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Barre d'outils supérieure */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3.5 border-b border-slate-200 dark:border-[#263241] bg-slate-50/90 dark:bg-[#151D27]/90 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-[#0f2744]/10 dark:bg-[#1E293B] text-[#0f2744] dark:text-[#F5F7FA] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                {matiereName && (
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] truncate">
                    {matiereName}
                  </span>
                )}
                {professeurName && (
                  <span className="text-[10px] text-slate-400 dark:text-[#687585] hidden sm:inline">
                    • {professeurName}
                  </span>
                )}
              </div>
              <h2 className="font-serif text-sm sm:text-base font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                {title}
              </h2>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenNewTab}
              title="Ouvrir dans un nouvel onglet"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] text-slate-700 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1a2533] text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">Plein écran</span>
            </button>

            <button
              type="button"
              onClick={handleDownload}
              title="Télécharger une copie locale"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#0f2744] hover:bg-[#183a62] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95 shadow-xs"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Télécharger</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              title="Fermer la visionneuse"
              aria-label="Fermer"
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#1E293B] transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Zone de lecture du PDF */}
        <div className="flex-1 w-full h-full bg-slate-100 dark:bg-[#0B0F14] relative overflow-hidden">
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/80 dark:bg-[#111821]/80 z-10">
              <Loader2 className="w-8 h-8 animate-spin text-[#0f2744] dark:text-[#e0521c]" />
              <p className="text-xs text-slate-600 dark:text-[#AAB4C0] font-medium">
                Chargement du document PDF en cours...
              </p>
            </div>
          )}

          {blobUrl ? (
            <iframe
              src={`${blobUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              title={title}
              className="w-full h-full border-0 bg-white"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-500 dark:text-[#AAB4C0]">
              <FileText className="w-12 h-12 text-slate-300 dark:text-[#263241] mb-3" />
              <p className="font-semibold text-sm text-slate-700 dark:text-[#F5F7FA]">
                Impossible de charger le document dans le lecteur intégré.
              </p>
              <button
                type="button"
                onClick={handleDownload}
                className="mt-4 px-4 py-2 rounded-xl bg-[#0f2744] text-white text-xs font-semibold flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger le fichier directement
              </button>
            </div>
          )}
        </div>

        {/* Pied de visionneuse avec rappel discret */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-[#111821] border-t border-slate-200/80 dark:border-[#263241] flex items-center justify-between text-[11px] text-slate-400 dark:text-[#687585]">
          <span>Lecteur officiel • Halil Académie Scientifique</span>
          <span className="hidden sm:inline">Appuyez sur Échap pour fermer</span>
        </div>
      </div>
    </div>
  );
}
