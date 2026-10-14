"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  Trash2,
  Save,
  Clock,
  BookOpen,
} from "lucide-react";
import { SeanceEDT } from "@/lib/types";
import {
  saveMeetLink,
  saveSeanceEDT,
  syncSeanceMeetToServer,
} from "@/lib/academicStorage";
import { Button } from "@/components/ui/Button";

interface ProfMeetModalProps {
  seance: SeanceEDT | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved?: (updatedSeance: SeanceEDT) => void;
  userEmail?: string;
}

export function ProfMeetModal({
  seance,
  isOpen,
  onClose,
  onSaved,
  userEmail,
}: ProfMeetModalProps) {
  const [meetUrl, setMeetUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (seance) {
      setMeetUrl(seance.meet_url || "");
      setToastMessage(null);
    }
  }, [seance]);

  if (!isOpen || !seance) return null;

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setMeetUrl(text.trim());
        setToastMessage("✓ Lien collé depuis le presse-papier");
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      alert("Veuillez coller le lien directement dans le champ avec Ctrl+V.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    let cleanMeet = meetUrl.trim() || null;
    if (cleanMeet && !cleanMeet.startsWith("http://") && !cleanMeet.startsWith("https://")) {
      cleanMeet = `https://${cleanMeet}`;
    }

    const updatedSeance: SeanceEDT = {
      ...seance,
      meet_url: cleanMeet,
    };

    // 1. Sauvegarder dans le cache local persistant
    saveMeetLink(seance.id, cleanMeet);
    saveSeanceEDT(updatedSeance, userEmail);

    // 2. Synchroniser sur le serveur en direct pour tous les étudiants
    await syncSeanceMeetToServer(seance.id, cleanMeet, userEmail);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("has_academic_storage_updated"));
    }

    setIsSaving(false);
    if (onSaved) {
      onSaved(updatedSeance);
    }
    onClose();
  };

  const handleClear = async () => {
    setIsSaving(true);
    setMeetUrl("");
    saveMeetLink(seance.id, null);
    const updatedSeance: SeanceEDT = {
      ...seance,
      meet_url: null,
    };
    saveSeanceEDT(updatedSeance, userEmail);

    // Synchroniser la suppression sur le serveur
    await syncSeanceMeetToServer(seance.id, null, userEmail);

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("has_academic_storage_updated"));
    }

    setIsSaving(false);
    if (onSaved) {
      onSaved(updatedSeance);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#111821] rounded-2xl shadow-2xl border border-slate-200 dark:border-[#263241] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#0f2744] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-[#e0521c]">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif">Gérer mon lien Google Meet</h3>
              <p className="text-xs text-white/70">Salle virtuelle pour vos étudiants</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Corps */}
        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Récapitulatif du cours */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] space-y-1.5">
            <div className="flex items-center gap-2 text-sm font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              <BookOpen className="w-4 h-4 text-[#e0521c] shrink-0" />
              <span>{seance.matiere_nom}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-[#AAB4C0] flex-wrap">
              <span className="font-bold text-[#0f2744] dark:text-[#F5F7FA]">{seance.jour}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#e0521c]" />
                {seance.heure_debut} – {seance.heure_fin}
              </span>
              <span>•</span>
              <span>Promotion {seance.niveau || "HAS"}</span>
            </div>
          </div>

          {toastMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Étape 1 : Ouvrir Google Meet */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
              Étape 1 : Créer votre réunion sur Google Meet
            </label>
            <a
              href="https://meet.google.com/new"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-bold text-xs shadow-xs transition-all text-center"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>Ouvrir Google Meet (Créer la réunion)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>
            <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0] leading-relaxed">
              Google Meet s&apos;ouvre dans un nouvel onglet. Copiez l&apos;adresse de votre réunion puis collez-la à l&apos;étape 2 ci-dessous.
            </p>
          </div>

          {/* Étape 2 : Coller le lien */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                Étape 2 : Coller le lien de votre réunion :
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 dark:text-cyan-400 inline-flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3 h-3" />
                Coller depuis presse-papier
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={meetUrl}
                onChange={(e) => setMeetUrl(e.target.value)}
                className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] font-mono text-xs focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-[#687585] mt-1.5">
              Ce lien sera immédiatement affiché aux étudiants dans leur emploi du temps et leur permettra de rejoindre votre cours.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="pt-2 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between gap-2">
            <div>
              {seance.meet_url && (
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold cursor-pointer disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Retirer le lien
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSaving}>
                Annuler
              </Button>
              <Button
                type="submit"
                size="sm"
                isLoading={isSaving}
                className="bg-[#0f2744] hover:bg-[#1a3a5c] dark:bg-[#e0521c] dark:hover:bg-[#f0632d] text-white font-bold"
              >
                <Save className="w-4 h-4 mr-1.5" />
                Enregistrer le lien Meet
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
