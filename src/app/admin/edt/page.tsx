"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import {
  Clock, Video, Plus, Trash2, Edit2, CheckCircle2, Copy,
  ExternalLink, X, Save, Sparkles, BookOpen, Settings,
  Calendar, Layers, Monitor, Filter, Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { SeanceEDT, JourSemaine, Professeur } from "@/lib/types";
import {
  getStoredSeancesEDT, saveSeanceEDT, deleteSeanceEDT,
  getStoredProfesseurs,
} from "@/lib/academicStorage";
import { recordAuditLog } from "@/lib/auditLogger";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const PRESET_HORAIRES = [
  { label: "21h00 - 23h00", debut: "21:00", fin: "23:00" },
  { label: "19h00 - 21h00", debut: "19:00", fin: "21:00" },
  { label: "18h00 - 20h00", debut: "18:00", fin: "20:00" },
  { label: "08h00 - 10h00", debut: "08:00", fin: "10:00" },
  { label: "10h00 - 12h00", debut: "10:00", fin: "12:00" },
  { label: "14h00 - 16h00", debut: "14:00", fin: "16:00" },
  { label: "16h00 - 18h00", debut: "16:00", fin: "18:00" },
];

const FILIERES_OPTIONS: Array<"MPI" | "SML" | "MIASS"> = ["MPI", "SML", "MIASS"];

const ENSEIGNANTS_PRESETS = [
  "Mister Halil",
  "Pape Ibrahima Samb",
  "Ibrahima Anne",
  "Dr. Abdoulaye Diallo",
  "Dr. Mamadou Ndiaye",
  "Dr. Fatou Sow",
];

function formatHeureDisplay(h: string) {
  if (!h) return "";
  if (h.includes("h")) return h;
  const parts = h.split(":");
  if (parts.length >= 2) return `${parts[0]}h${parts[1]}`;
  return h;
}

function getFiliereBadgeInfo(filieres?: ("MPI" | "SML" | "MIASS")[]) {
  if (!filieres || filieres.length === 0 || filieres.length >= 3) {
    return {
      label: "Tronc Commun (Toutes filières)",
      short: "Tronc Commun",
      color: "bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60",
    };
  }
  if (filieres.length === 1) {
    const f = filieres[0];
    if (f === "MIASS") {
      return {
        label: "MIASS",
        short: "MIASS",
        color: "bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60",
      };
    }
    if (f === "MPI") {
      return {
        label: "MPI",
        short: "MPI",
        color: "bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60",
      };
    }
    if (f === "SML") {
      return {
        label: "SML",
        short: "SML",
        color: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60",
      };
    }
  }
  return {
    label: filieres.join(" & "),
    short: filieres.join(" & "),
    color: "bg-orange-100 dark:bg-orange-950/50 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800/60",
  };
}

export default function AdminEDTPage() {
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [profs, setProfs] = useState<Professeur[]>([]);

  // 1 SEUL EDT PAR PROMO : Onglet actif L1 ou L2
  const [activeNiveau, setActiveNiveau] = useState<"L1" | "L2">("L2");
  // Filtre filière interne à la promo
  const [filiereFilter, setFiliereFilter] = useState<string>("ALL");
  const [viewMode, setViewMode] = useState<"fiche" | "grille">("fiche");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Modal d'ajout / modification complète
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<SeanceEDT | null>(null);

  // Formulaire modal
  const [formNiveau, setFormNiveau] = useState<"L1" | "L2">("L2");
  const [formFilieres, setFormFilieres] = useState<("MPI" | "SML" | "MIASS")[]>(["MIASS"]);
  const [formJour, setFormJour] = useState<JourSemaine>("Mardi");
  const [formDebut, setFormDebut] = useState("21:00");
  const [formFin, setFormFin] = useState("23:00");
  const [formMatiere, setFormMatiere] = useState("Analyse 4");
  const [formEnseignant, setFormEnseignant] = useState("Mister Halil");
  const [formMeetUrl, setFormMeetUrl] = useState("https://meet.google.com/has-anal-four");

  // Barre d'ajout rapide (Directe)
  const [quickNiveau, setQuickNiveau] = useState<"L1" | "L2">("L2");
  const [quickFilieres, setQuickFilieres] = useState<("MPI" | "SML" | "MIASS")[]>(["MIASS"]);
  const [quickJour, setQuickJour] = useState<JourSemaine>("Mardi");
  const [quickSlot, setQuickSlot] = useState("21:00-23:00");
  const [quickMatiere, setQuickMatiere] = useState("");
  const [quickEnseignant, setQuickEnseignant] = useState("Mister Halil");
  const [quickMeet, setQuickMeet] = useState("");

  const reloadData = useCallback(() => {
    setSeances(getStoredSeancesEDT());
    setProfs(getStoredProfesseurs());
  }, []);

  useEffect(() => {
    reloadData();
    window.addEventListener("has_academic_storage_updated", reloadData);
    return () => window.removeEventListener("has_academic_storage_updated", reloadData);
  }, [reloadData]);

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleCopyMeet = (url: string) => {
    if (!url) return;
    navigator?.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  // Liste des enseignants
  const enseignantsList = useMemo(() => {
    const fromProfs = profs
      .map((p) => (p.full_name || p.nom || "").trim())
      .filter((n): n is string => Boolean(n));
    return Array.from(new Set([...ENSEIGNANTS_PRESETS, ...fromProfs]));
  }, [profs]);

  // Séances de la promotion active (L1 ou L2)
  const promoSeances = useMemo(() => {
    return seances.filter((s) => (s.niveau || "L1") === activeNiveau);
  }, [seances, activeNiveau]);

  // Séances filtrées par filière dans la promotion active
  const filteredSeances = useMemo(() => {
    let list = promoSeances;
    if (filiereFilter !== "ALL") {
      if (filiereFilter === "TRONC_COMMUN") {
        list = list.filter((s) => !s.filieres || s.filieres.length === 0 || s.filieres.length >= 3);
      } else {
        list = list.filter((s) => s.filieres && s.filieres.includes(filiereFilter as any));
      }
    }
    // Tri par jour (Lundi -> Dimanche) puis par heure
    return [...list].sort((a, b) => {
      const idxA = JOURS.indexOf(a.jour);
      const idxB = JOURS.indexOf(b.jour);
      if (idxA !== idxB) return idxA - idxB;
      return a.heure_debut.localeCompare(b.heure_debut);
    });
  }, [promoSeances, filiereFilter]);

  // Compteurs
  const countL1 = useMemo(() => seances.filter((s) => (s.niveau || "L1") === "L1").length, [seances]);
  const countL2 = useMemo(() => seances.filter((s) => s.niveau === "L2").length, [seances]);

  // Ouvrir modal pour modifier
  const openEditModal = (s: SeanceEDT) => {
    setEditingSeance(s);
    setFormNiveau((s.niveau || "L1") as "L1" | "L2");
    setFormFilieres(s.filieres && s.filieres.length > 0 ? s.filieres : ["MPI", "SML", "MIASS"]);
    setFormJour(s.jour);
    setFormDebut(s.heure_debut || "21:00");
    setFormFin(s.heure_fin || "23:00");
    setFormMatiere(s.matiere_nom);
    setFormEnseignant(s.professeur_nom || "Mister Halil");
    setFormMeetUrl(s.meet_url || "");
    setModalOpen(true);
  };

  // Ouvrir modal pour ajouter
  const openAddModal = (niveau: "L1" | "L2" = activeNiveau, jour: JourSemaine = "Lundi") => {
    setEditingSeance(null);
    setFormNiveau(niveau);
    setFormFilieres(["MIASS"]);
    setFormJour(jour);
    setFormDebut("21:00");
    setFormFin("23:00");
    setFormMatiere("");
    setFormEnseignant("Mister Halil");
    setFormMeetUrl("");
    setModalOpen(true);
  };

  // Dupliquer une séance
  const handleDuplicate = (s: SeanceEDT) => {
    const newSeance: SeanceEDT = {
      ...s,
      id: `seance-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      created_at: new Date().toISOString(),
    };
    saveSeanceEDT(newSeance);
    recordAuditLog({
      action: "PUBLICATION_EDT",
      details: {
        action: "duplication",
        promotion: s.niveau || "L1",
        matiere: newSeance.matiere_nom,
        filieres: newSeance.filieres,
        enseignant: newSeance.professeur_nom,
        jour: newSeance.jour,
      },
    });
    flash(`✓ Cours « ${s.matiere_nom} » dupliqué`);
  };

  // Supprimer une séance
  const handleDelete = (id: string, matiere: string) => {
    if (confirm(`Confirmez-vous la suppression du cours « ${matiere} » ?`)) {
      deleteSeanceEDT(id);
      recordAuditLog({
        action: "SUPPRESSION_EDT",
        details: { matiere, seance_id: id },
      });
      flash(`Cours « ${matiere} » supprimé.`);
    }
  };

  // Enregistrer depuis modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMatiere.trim()) {
      alert("Veuillez indiquer le nom de la matière (ex: Analyse 4).");
      return;
    }
    if (!formEnseignant.trim()) {
      alert("Veuillez indiquer le nom de l'enseignant (ex: Mister Halil).");
      return;
    }

    const seanceData: SeanceEDT = {
      id: editingSeance?.id || `seance-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      classe_id: `promo-${formNiveau.toLowerCase()}`,
      classe_nom: formNiveau === "L2" ? "Licence 2" : "Licence 1",
      semestre: formNiveau === "L2" ? "Semestre 4" : "Semestre 2",
      jour: formJour,
      heure_debut: formDebut,
      heure_fin: formFin,
      matiere_nom: formMatiere.trim(),
      matiere_code: editingSeance?.matiere_code || (formMatiere.toLowerCase().includes("analyse") ? "MAT004" : formMatiere.toLowerCase().includes("probabilité") ? "MAT020" : "MAT001"),
      professeur_nom: formEnseignant.trim(),
      meet_url: formMeetUrl.trim() || null,
      type_seance: "COURS",
      niveau: formNiveau,
      filieres: formFilieres.length === 3 ? [] : formFilieres, // vide = Tronc commun toutes filières
      created_at: editingSeance?.created_at || new Date().toISOString(),
    };

    saveSeanceEDT(seanceData);

    recordAuditLog({
      action: editingSeance ? "MODIFICATION_EDT" : "PUBLICATION_EDT",
      details: {
        promotion: seanceData.niveau,
        matiere: seanceData.matiere_nom,
        filieres: seanceData.filieres && seanceData.filieres.length > 0 ? seanceData.filieres : "Tronc Commun",
        enseignant: seanceData.professeur_nom,
        jour: seanceData.jour,
        horaires: `${formatHeureDisplay(seanceData.heure_debut)} - ${formatHeureDisplay(seanceData.heure_fin)}`,
      },
    });

    flash(`✓ Cours enregistré dans l'EDT ${formNiveau} : ${seanceData.matiere_nom} — ${seanceData.professeur_nom}`);
    setModalOpen(false);
  };

  // Ajout rapide en 1 clic
  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMatiere.trim()) {
      alert("Veuillez renseigner le nom de la matière (ex: Analyse 4).");
      return;
    }
    const [d, f] = quickSlot.split("-");

    const seanceData: SeanceEDT = {
      id: `seance-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      classe_id: `promo-${quickNiveau.toLowerCase()}`,
      classe_nom: quickNiveau === "L2" ? "Licence 2" : "Licence 1",
      semestre: quickNiveau === "L2" ? "Semestre 4" : "Semestre 2",
      jour: quickJour,
      heure_debut: d || "21:00",
      heure_fin: f || "23:00",
      matiere_nom: quickMatiere.trim(),
      matiere_code: quickMatiere.toLowerCase().includes("analyse") ? "MAT004" : quickMatiere.toLowerCase().includes("probabilité") ? "MAT020" : "MAT001",
      professeur_nom: quickEnseignant.trim() || "Mister Halil",
      meet_url: quickMeet.trim() || null,
      type_seance: "COURS",
      niveau: quickNiveau,
      filieres: quickFilieres.length === 3 ? [] : quickFilieres,
      created_at: new Date().toISOString(),
    };

    saveSeanceEDT(seanceData);

    recordAuditLog({
      action: "PUBLICATION_EDT",
      details: {
        source: "ajout_rapide",
        promotion: seanceData.niveau,
        matiere: seanceData.matiere_nom,
        filieres: seanceData.filieres && seanceData.filieres.length > 0 ? seanceData.filieres : "Tronc Commun",
        enseignant: seanceData.professeur_nom,
        jour: seanceData.jour,
      },
    });

    flash(`✓ Cours ajouté à l'EDT ${quickNiveau} : ${seanceData.matiere_nom} (${seanceData.jour})`);
    setQuickMatiere("");
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">

        {/* ── EN-TÊTE PRINCIPAL ────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">
                Emplois du Temps HAS
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Un Emploi du Temps par Promotion
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              Deux emplois du temps uniques (<strong>Licence 1</strong> et <strong>Licence 2</strong>) avec filières différenciées (<strong>MPI</strong>, <strong>SML</strong>, <strong>MIASS</strong>)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Bascule Mode Fiche vs Grille */}
            <div className="flex p-1 bg-slate-100 dark:bg-[#151D27] rounded-xl border border-slate-200 dark:border-[#263241]">
              <button
                type="button"
                onClick={() => setViewMode("fiche")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "fiche"
                    ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-[#F5F7FA] shadow-xs"
                    : "text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800"
                }`}
              >
                <Monitor className="w-3.5 h-3.5 text-[#e0521c]" />
                Format Fiche HAS
              </button>
              <button
                type="button"
                onClick={() => setViewMode("grille")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewMode === "grille"
                    ? "bg-white dark:bg-[#0f2744] text-[#0f2744] dark:text-[#F5F7FA] shadow-xs"
                    : "text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800"
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-blue-500" />
                Grille Lundi-Dimanche
              </button>
            </div>

            <Button
              onClick={() => openAddModal(activeNiveau, "Mardi")}
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Ajouter un cours
            </Button>
          </div>
        </div>

        {/* Message Flash */}
        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 shadow-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
        )}

        {/* ── SÉLECTION DES PROMOTIONS (L1 vs L2) ───────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-slate-100/80 dark:bg-[#151D27] rounded-2xl border border-slate-200 dark:border-[#263241]">
          <div className="flex gap-2">
            {(["L1", "L2"] as const).map((niv) => {
              const isActive = activeNiveau === niv;
              const count = niv === "L1" ? countL1 : countL2;
              return (
                <button
                  key={niv}
                  type="button"
                  onClick={() => {
                    setActiveNiveau(niv);
                    setQuickNiveau(niv);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all flex items-center gap-2.5 cursor-pointer ${
                    isActive
                      ? "bg-[#0f2744] text-white dark:bg-[#e0521c] shadow-md scale-[1.01]"
                      : "bg-white dark:bg-[#111821] text-slate-700 dark:text-[#AAB4C0] hover:text-slate-900 border border-slate-200/60 dark:border-[#263241]"
                  }`}
                >
                  <span>Licence {niv === "L1" ? "1 (L1)" : "2 (L2)"}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-[#263241] text-slate-600 dark:text-[#AAB4C0]"
                  }`}>
                    {count} cours
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filtre différenciation des filières dans cette promo */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-[#AAB4C0] mr-1">Filière :</span>
            {[
              { id: "ALL", label: "Toutes" },
              { id: "MIASS", label: "MIASS" },
              { id: "MPI", label: "MPI" },
              { id: "SML", label: "SML" },
              { id: "TRONC_COMMUN", label: "Tronc Commun" },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFiliereFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filiereFilter === f.id
                    ? "bg-[#0f2744] dark:bg-[#e0521c] text-white shadow-xs"
                    : "bg-white dark:bg-[#111821] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200/60 border border-slate-200/70 dark:border-[#263241]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── BARRE D'AJOUT RAPIDE EN 1 CLIC ───────────────────────── */}
        <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#e0521c]" />
              <h2 className="text-xs font-bold text-slate-800 dark:text-[#F5F7FA] uppercase tracking-wider">
                Ajouter un cours dans l&apos;EDT {quickNiveau === "L1" ? "Licence 1" : "Licence 2"}
              </h2>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-[#687585]">
              Sélectionnez les filières concernées et validez
            </span>
          </div>

          <form onSubmit={handleQuickAdd} className="space-y-3.5">
            {/* Ligne 1 : Promotion + Filières différenciées */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 border-b border-slate-100 dark:border-[#263241]">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1.5">
                  1. Promotion :
                </label>
                <div className="flex gap-2">
                  {(["L1", "L2"] as const).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => {
                        setQuickNiveau(n);
                        setActiveNiveau(n);
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        quickNiveau === n
                          ? "bg-[#0f2744] text-white dark:bg-[#e0521c] border-transparent shadow-xs"
                          : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      Licence {n === "L1" ? "1" : "2"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1.5">
                  2. Filière(s) concernée(s) :
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {/* Option Tronc Commun */}
                  <button
                    type="button"
                    onClick={() => setQuickFilieres(["MPI", "SML", "MIASS"])}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                      quickFilieres.length === 3
                        ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                        : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                    }`}
                  >
                    Tronc Commun (Toutes)
                  </button>

                  {/* Boutons filières individuelles */}
                  {FILIERES_OPTIONS.map((fil) => {
                    const isSelected = quickFilieres.includes(fil) && quickFilieres.length < 3;
                    return (
                      <button
                        key={fil}
                        type="button"
                        onClick={() => {
                          if (quickFilieres.length === 3) {
                            setQuickFilieres([fil]);
                          } else if (quickFilieres.includes(fil)) {
                            const next = quickFilieres.filter((x) => x !== fil);
                            setQuickFilieres(next.length === 0 ? [fil] : next);
                          } else {
                            setQuickFilieres([...quickFilieres, fil]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#e0521c] text-white border-[#e0521c] shadow-xs"
                            : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                        }`}
                      >
                        {fil}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Ligne 2 : Jour de la semaine (Lundi au Dimanche) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1.5">
                3. Jour du cours (Lundi au Dimanche) :
              </label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {JOURS.map((j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setQuickJour(j)}
                    className={`py-2 px-1 rounded-lg text-xs font-bold transition-all text-center cursor-pointer border ${
                      quickJour === j
                        ? "bg-[#0f2744] dark:bg-[#e0521c] text-white border-transparent shadow-xs scale-[1.02]"
                        : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241] hover:bg-slate-100"
                    }`}
                  >
                    {j}
                  </button>
                ))}
              </div>
            </div>

            {/* Ligne 3 : Horaires rapides */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1.5">
                4. Horaires :
              </label>
              <div className="flex flex-wrap gap-1.5">
                {PRESET_HORAIRES.map((h) => {
                  const key = `${h.debut}-${h.fin}`;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setQuickSlot(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                        quickSlot === key
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                          : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241] hover:bg-slate-100"
                      }`}
                    >
                      {h.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ligne 4 : Matière, Enseignant, Lien Meet */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1">
                  Matière * :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Analyse 4, Probabilité..."
                  value={quickMatiere}
                  onChange={(e) => setQuickMatiere(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                />
                <div className="flex gap-1 mt-1">
                  {["Analyse 4", "Probabilité", "Algèbre 2"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setQuickMatiere(sug)}
                      className="text-[10px] text-slate-400 hover:text-[#0f2744] dark:hover:text-[#F5F7FA] underline cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1">
                  Enseignant :
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mister Halil"
                  value={quickEnseignant}
                  onChange={(e) => setQuickEnseignant(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-medium"
                />
                <div className="flex gap-1 mt-1">
                  {["Mister Halil", "Ibrahima Anne"].map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setQuickEnseignant(sug)}
                      className="text-[10px] text-slate-400 hover:text-[#0f2744] dark:hover:text-[#F5F7FA] underline cursor-pointer"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 dark:text-[#AAB4C0] mb-1">
                  Lien Google Meet :
                </label>
                <div className="flex gap-1.5">
                  <input
                    type="url"
                    placeholder="https://meet.google.com/..."
                    value={quickMeet}
                    onChange={(e) => setQuickMeet(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs"
                  />
                  <a
                    href="https://meet.new"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Ouvrir meet.new"
                    className="h-10 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800 flex items-center justify-center shrink-0"
                  >
                    <Video className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100 dark:border-[#263241]">
              <Button type="submit" variant="accent" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                Ajouter à l&apos;EDT {quickNiveau === "L1" ? "Licence 1" : "Licence 2"}
              </Button>
            </div>
          </form>
        </div>

        {/* ── MODE 1 : VUE FICHE OFFICIELLE HAS (1 SEUL EDT PAR PROMOTION) ── */}
        {viewMode === "fiche" && (
          <div className="bg-white dark:bg-[#111821] rounded-3xl border border-slate-200/90 dark:border-[#263241] shadow-xl overflow-hidden max-w-5xl mx-auto">
            {/* EN-TÊTE DE LA FICHE OFFICIELLE */}
            <div className="p-6 sm:p-8 text-center bg-gradient-to-b from-slate-50 via-white to-slate-50/50 dark:from-[#151D27] dark:via-[#111821] dark:to-[#111821] border-b border-slate-200/80 dark:border-[#263241] relative">
              <div className="absolute top-4 right-4 flex items-center gap-1.5">
                <button
                  onClick={() => openAddModal(activeNiveau, "Mardi")}
                  className="px-3 py-1.5 rounded-lg bg-[#0f2744] dark:bg-[#e0521c] hover:bg-[#183a62] dark:hover:bg-[#c84418] text-white text-xs font-bold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Ajouter un cours
                </button>
              </div>

              {/* LOGO HAS */}
              <div className="flex justify-center mb-3">
                <div className="w-20 h-20 relative rounded-full overflow-hidden border-2 border-slate-200 dark:border-[#263241] shadow-md bg-white p-1">
                  <Image
                    src="/images/logo-has.jpg"
                    alt="Halil Académie Scientifique"
                    width={80}
                    height={80}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0f2744] dark:text-[#F5F7FA] tracking-tight uppercase">
                HALIL ACADÉMIE SCIENTIFIQUE
              </h2>
              <h3 className="font-sans text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 mt-1 uppercase tracking-wide">
                EMPLOI DU TEMPS {activeNiveau === "L2" ? "LICENCE 2" : "LICENCE 1"} (COURS EN LIGNE)
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-0.5">
                Filières différenciées : MPI · SML · MIASS
              </p>
            </div>

            {/* TABLEAU DES COURS */}
            <div className="p-5 sm:p-7">
              {filteredSeances.length === 0 ? (
                <div className="py-12 text-center space-y-3 bg-slate-50/50 dark:bg-[#151D27]/30 rounded-2xl border border-dashed border-slate-200 dark:border-[#263241]">
                  <Calendar className="w-10 h-10 text-slate-300 dark:text-[#687585] mx-auto" />
                  <p className="text-sm font-bold text-slate-600 dark:text-[#AAB4C0]">
                    Aucun cours dans l&apos;emploi du temps {activeNiveau}
                  </p>
                  <p className="text-xs text-slate-400 dark:text-[#687585]">
                    Utilisez le formulaire ci-dessus pour ajouter des cours à cette promotion.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#0f2744] text-white dark:bg-[#151D27] text-xs uppercase tracking-wider font-extrabold divide-x divide-white/10 dark:divide-[#263241]">
                        <th className="py-3.5 px-4 text-center w-32">JOURS</th>
                        <th className="py-3.5 px-4 text-center w-40">HORAIRES</th>
                        <th className="py-3.5 px-5">MATIÈRE</th>
                        <th className="py-3.5 px-4 text-center w-36">FILIÈRE</th>
                        <th className="py-3.5 px-5">ENSEIGNANT</th>
                        <th className="py-3.5 px-4 text-center w-36">LIEN MEET</th>
                        <th className="py-3.5 px-3 text-center w-28">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-[#263241] text-xs">
                      {filteredSeances.map((s, idx) => {
                        const isEven = idx % 2 === 0;
                        const fBadge = getFiliereBadgeInfo(s.filieres);
                        return (
                          <tr
                            key={s.id}
                            className={`transition-colors hover:bg-slate-50/80 dark:hover:bg-[#151D27]/80 ${
                              isEven ? "bg-white dark:bg-[#111821]" : "bg-slate-50/40 dark:bg-[#151D27]/40"
                            }`}
                          >
                            {/* JOUR */}
                            <td className="py-4 px-4 text-center font-bold text-sm text-[#0f2744] dark:text-[#F5F7FA] whitespace-nowrap">
                              <span className="inline-block px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 text-[#0f2744] dark:text-blue-300 font-extrabold">
                                {s.jour}
                              </span>
                            </td>

                            {/* HORAIRES */}
                            <td className="py-4 px-4 text-center font-bold text-xs text-slate-700 dark:text-[#AAB4C0] whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#151D27] border border-slate-200/60 dark:border-[#263241]">
                                <Clock className="w-3.5 h-3.5 text-[#e0521c]" />
                                <span>
                                  {formatHeureDisplay(s.heure_debut)} – {formatHeureDisplay(s.heure_fin)}
                                </span>
                              </div>
                            </td>

                            {/* MATIÈRE */}
                            <td className="py-4 px-5 font-bold text-sm text-slate-900 dark:text-[#F5F7FA]">
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-[#0f2744] dark:text-[#e0521c] shrink-0" />
                                <span>{s.matiere_nom}</span>
                              </div>
                            </td>

                            {/* FILIÈRE DIFFÉRENCIÉE */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${fBadge.color}`}>
                                {fBadge.label}
                              </span>
                            </td>

                            {/* ENSEIGNANT */}
                            <td className="py-4 px-5 font-bold text-xs text-slate-800 dark:text-slate-200">
                              <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#e0521c] flex items-center justify-center font-black text-[10px] shrink-0">
                                  {(s.professeur_nom || "H")[0]}
                                </div>
                                <span>{s.professeur_nom || "Mister Halil"}</span>
                              </div>
                            </td>

                            {/* LIEN MEET */}
                            <td className="py-4 px-4 text-center">
                              {s.meet_url ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <a
                                    href={s.meet_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    Rejoindre
                                    <ExternalLink className="w-2.5 h-2.5" />
                                  </a>
                                  <button
                                    type="button"
                                    onClick={() => handleCopyMeet(s.meet_url!)}
                                    title="Copier le lien Meet"
                                    className="p-1.5 rounded-lg border border-slate-200 dark:border-[#263241] hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500 dark:text-[#AAB4C0] cursor-pointer"
                                  >
                                    {copiedLink === s.meet_url ? (
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                                    ) : (
                                      <Copy className="w-3.5 h-3.5" />
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => openEditModal(s)}
                                  className="text-[10px] text-slate-400 hover:text-[#0f2744] dark:hover:text-[#F5F7FA] underline cursor-pointer"
                                >
                                  + Ajouter Meet
                                </button>
                              )}
                            </td>

                            {/* ACTIONS */}
                            <td className="py-4 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => openEditModal(s)}
                                  title="Modifier ce cours"
                                  className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDuplicate(s)}
                                  title="Dupliquer ce cours"
                                  className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(s.id, s.matiere_nom)}
                                  title="Supprimer ce cours"
                                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* PIED DE PAGE */}
            <div className="p-6 text-center bg-slate-50/60 dark:bg-[#151D27]/40 border-t border-slate-200/80 dark:border-[#263241] space-y-2">
              <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] shadow-xs flex items-center justify-center mx-auto text-[#0f2744] dark:text-[#e0521c]">
                <Monitor className="w-5 h-5" />
              </div>
              <p className="font-sans text-xs sm:text-sm font-extrabold text-[#0f2744] dark:text-[#F5F7FA] tracking-wide uppercase">
                TOUS LES COURS ET EMPLOIS DU TEMPS SONT PARTAGÉS DANS LA PLATEFORME HAS
              </p>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] font-medium flex items-center justify-center gap-1.5">
                <span>🌐 Site Web :</span>
                <a
                  href="https://has-academie.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#e0521c] hover:underline"
                >
                  has-académie.online
                </a>
              </p>
            </div>
          </div>
        )}

        {/* ── MODE 2 : VUE GRILLE SEMAINE (LUNDI AU DIMANCHE) ──────── */}
        {viewMode === "grille" && (
          <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                  Grille Semaine Licence {activeNiveau === "L2" ? "2" : "1"} (Lundi au Dimanche)
                </h3>
                <p className="text-xs text-slate-400 dark:text-[#AAB4C0]">
                  Les cours affichent distinctement leur filière (MPI, SML, MIASS ou Tronc Commun)
                </p>
              </div>
              <Button
                size="sm"
                variant="accent"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => openAddModal(activeNiveau, "Lundi")}
              >
                Ajouter un cours
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] text-xs border-collapse">
                <thead>
                  <tr className="bg-[#0f2744] dark:bg-[#151D27] text-white divide-x divide-white/10 dark:divide-[#263241]">
                    {JOURS.map((j) => {
                      const count = filteredSeances.filter((s) => s.jour === j).length;
                      return (
                        <th key={j} className="py-3 px-3 text-center uppercase tracking-wider font-bold">
                          <div>{j}</div>
                          <span className="text-[10px] font-normal text-white/60">
                            {count} cours
                          </span>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#263241] align-top">
                  <tr>
                    {JOURS.map((j) => {
                      const daySeances = filteredSeances.filter((s) => s.jour === j);
                      return (
                        <td
                          key={j}
                          className="p-2 border-r border-slate-100 dark:border-[#263241] last:border-r-0 min-w-[140px] bg-slate-50/20 dark:bg-[#151D27]/20"
                        >
                          <div className="space-y-2">
                            {daySeances.map((s) => {
                              const fBadge = getFiliereBadgeInfo(s.filieres);
                              return (
                                <div
                                  key={s.id}
                                  className="p-3 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-[#151D27] shadow-2xs space-y-1.5 relative group"
                                >
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className="font-extrabold text-[#e0521c] flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {formatHeureDisplay(s.heure_debut)} - {formatHeureDisplay(s.heure_fin)}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <button
                                        onClick={() => openEditModal(s)}
                                        className="p-1 rounded bg-white dark:bg-[#111821] text-slate-600 hover:text-blue-600 shadow-xs cursor-pointer"
                                      >
                                        <Edit2 className="w-2.5 h-2.5" />
                                      </button>
                                      <button
                                        onClick={() => handleDelete(s.id, s.matiere_nom)}
                                        className="p-1 rounded bg-white dark:bg-[#111821] text-slate-400 hover:text-red-600 shadow-xs cursor-pointer"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="font-bold text-xs text-slate-900 dark:text-[#F5F7FA]">
                                    {s.matiere_nom}
                                  </div>

                                  {/* Filière badge */}
                                  <div>
                                    <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-black border ${fBadge.color}`}>
                                      {fBadge.short}
                                    </span>
                                  </div>

                                  <div className="text-[11px] text-slate-600 dark:text-[#AAB4C0] font-medium truncate">
                                    👤 {s.professeur_nom || "Mister Halil"}
                                  </div>

                                  {s.meet_url && (
                                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-[#263241] flex gap-1">
                                      <a
                                        href={s.meet_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 py-1 px-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                                      >
                                        <Video className="w-3 h-3" /> Meet
                                      </a>
                                      <button
                                        onClick={() => handleCopyMeet(s.meet_url!)}
                                        className="p-1 rounded border border-slate-200 dark:border-[#263241] text-slate-500 hover:bg-white cursor-pointer"
                                      >
                                        {copiedLink === s.meet_url ? (
                                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            <button
                              onClick={() => openAddModal(activeNiveau, j)}
                              className="w-full py-2 rounded-xl border border-dashed border-slate-200 dark:border-[#263241] hover:border-slate-400 text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" /> Ajouter
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODAL D'AJOUT / MODIFICATION ──────────────────────────── */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#263241]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    {editingSeance ? "Modifier le cours" : "Ajouter un cours"}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-[#AAB4C0] mt-0.5">
                    Emploi du temps {formNiveau === "L2" ? "Licence 2" : "Licence 1"} — Halil Académie
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="p-6 space-y-4">
                {/* Promotion (L1 ou L2) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                    Promotion * :
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["L1", "L2"] as const).map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setFormNiveau(n)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          formNiveau === n
                            ? "bg-[#0f2744] text-white dark:bg-[#e0521c] border-transparent shadow-xs"
                            : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                        }`}
                      >
                        Licence {n === "L1" ? "1 (L1)" : "2 (L2)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filière(s) différenciées */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Filière(s) concernée(s) * :
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setFormFilieres(["MPI", "SML", "MIASS"])}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                        formFilieres.length === 3
                          ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                          : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      Tronc Commun (Toutes)
                    </button>
                    {FILIERES_OPTIONS.map((fil) => {
                      const isSelected = formFilieres.includes(fil) && formFilieres.length < 3;
                      return (
                        <button
                          key={fil}
                          type="button"
                          onClick={() => {
                            if (formFilieres.length === 3) {
                              setFormFilieres([fil]);
                            } else if (formFilieres.includes(fil)) {
                              const next = formFilieres.filter((x) => x !== fil);
                              setFormFilieres(next.length === 0 ? [fil] : next);
                            } else {
                              setFormFilieres([...formFilieres, fil]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#e0521c] text-white border-[#e0521c] shadow-xs"
                              : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                          }`}
                        >
                          {fil}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Jour de la semaine (Lundi au Dimanche) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Jour de la semaine * :
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-1">
                    {JOURS.map((j) => (
                      <button
                        key={j}
                        type="button"
                        onClick={() => setFormJour(j)}
                        className={`py-2 text-xs font-bold rounded-lg border transition-all text-center cursor-pointer ${
                          formJour === j
                            ? "bg-[#0f2744] dark:bg-[#e0521c] text-white border-transparent"
                            : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241]"
                        }`}
                      >
                        {j.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horaires */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                      Heure début * :
                    </label>
                    <input
                      type="time"
                      value={formDebut}
                      onChange={(e) => setFormDebut(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                      Heure fin * :
                    </label>
                    <input
                      type="time"
                      value={formFin}
                      onChange={(e) => setFormFin(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Matière */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                    Nom de la Matière * :
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Analyse 4, Probabilité..."
                    value={formMatiere}
                    onChange={(e) => setFormMatiere(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                  />
                </div>

                {/* Enseignant */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                    Nom de l&apos;Enseignant * :
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mister Halil"
                    value={formEnseignant}
                    onChange={(e) => setFormEnseignant(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                  />
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {enseignantsList.slice(0, 4).map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormEnseignant(name)}
                        className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Lien Meet */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                    Lien Google Meet :
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="https://meet.google.com/abc-defg-hij"
                      value={formMeetUrl}
                      onChange={(e) => setFormMeetUrl(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs"
                    />
                    <a
                      href="https://meet.new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold flex items-center gap-1 shrink-0"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Créer
                    </a>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#263241]">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    Enregistrer le cours
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
