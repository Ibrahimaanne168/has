"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  X,
  ExternalLink,
  Copy,
  CheckCircle2,
  Sparkles,
  Trash2,
  Save,
  Clock,
  BookOpen,
} from "lucide-react";
import { SeanceEDT } from "@/lib/types";
import {
  generateMeetLink,
  saveMeetLink,
  saveSeanceEDT,
  getStoredSeancesEDT,
  pushSeancesToServer,
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
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (seance) {
      setMeetUrl(seance.meet_url || "");
      setToastMessage(null);
    }
  }, [seance]);

  if (!isOpen || !seance) return null;

  const handleGenerate = () => {
    const generated = generateMeetLink();
    setMeetUrl(generated);
    setToastMessage("✓ Nouveau lien Google Meet généré automatiquement");
    setTimeout(() => setToastMessage(null), 3000);
  };

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

  const handleSave = (e: React.FormEvent) => {
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

    // 1. Sauvegarder dans le cache persistant des liens Meet
    saveMeetLink(seance.id, cleanMeet);

    // 2. Sauvegarder dans la séance EDT globale
    saveSeanceEDT(updatedSeance, userEmail);

    // 3. Synchroniser avec le serveur
    const all = getStoredSeancesEDT();
    pushSeancesToServer(all, userEmail);

    setIsSaving(false);
    if (onSaved) {
      onSaved(updatedSeance);
    }
    onClose();
  };

  const handleClear = () => {
    setMeetUrl("");
    saveMeetLink(seance.id, null);
    const updatedSeance: SeanceEDT = {
      ...seance,
      meet_url: null,
    };
    saveSeanceEDT(updatedSeance, userEmail);
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

          {/* Actions rapides pour créer ou générer */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-2">
              Créer ou insérer votre réunion :
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="https://meet.google.com/new"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all text-center"
              >
                <Video className="w-4 h-4 shrink-0" />
                <span>1. Ouvrir Google Meet</span>
                <ExternalLink className="w-3 h-3 opacity-80" />
              </a>

              <button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-orange-50 hover:bg-orange-100 dark:bg-orange-950/40 dark:hover:bg-orange-900/50 border border-orange-200 dark:border-orange-800/60 text-[#e0521c] font-bold text-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>2. Générer lien HAS</span>
              </button>
            </div>
          </div>

          {/* Champ du lien */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                Lien Google Meet (https://meet.google.com/...) :
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
                  className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 font-bold cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Retirer le lien
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose}>
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
