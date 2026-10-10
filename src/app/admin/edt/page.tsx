"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock, Video, Plus, Trash2, Edit2, CheckCircle2, Copy,
  ExternalLink, X, Save, BookOpen, Settings,
  Calendar, Layers, Table as TableIcon, Filter, RotateCcw,
  Mail, Loader2, Send,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { SeanceEDT, JourSemaine, Professeur, Matiere } from "@/lib/types";
import {
  getStoredSeancesEDT, saveSeanceEDT, deleteSeanceEDT,
  getStoredProfesseurs, getStoredMatieres, resetDefaultSeancesEDT,
} from "@/lib/academicStorage";
import { recordAuditLog } from "@/lib/auditLogger";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

const DEFAULT_SLOTS = [
  "21:00–23:00",
  "19:00–21:00",
  "18:00–20:00",
  "16:15–18:15",
  "14:00–16:00",
  "10:15–12:15",
  "08:00–10:00",
];

const PRESET_HORAIRES = [
  { label: "★ 21h00 - 23h00 (Horaire officiel HAS)", debut: "21:00", fin: "23:00" },
  { label: "19h00 - 21h00", debut: "19:00", fin: "21:00" },
  { label: "18h00 - 20h00", debut: "18:00", fin: "20:00" },
  { label: "16h15 - 18h15", debut: "16:15", fin: "18:15" },
  { label: "14h00 - 16h00", debut: "14:00", fin: "16:00" },
  { label: "10h15 - 12h15", debut: "10:15", fin: "12:15" },
  { label: "08h00 - 10h00", debut: "08:00", fin: "10:00" },
];

const FILIERES_OPTIONS: Array<"MPI" | "SML" | "MIASS"> = ["MPI", "SML", "MIASS"];

const ENSEIGNANTS_PRESETS = [
  "Pape Ibrahima Samb",
  "Ibrahima Anne",
  "Ndiogou Ndiaye",
  "M. Diop",
  "El Hadji Ibrahima Diop Sow",
  "Pape Thiam",
  "Kalidou Ba",
];

// Catalogue des matières officielles avec mapping rigoureux filières & professeur attitré (liens Meet non fixes)
const CATALOGUE_MATIERES: Record<
  string,
  {
    niveau: "L1" | "L2";
    filieres: ("MPI" | "SML" | "MIASS")[];
    professeurDefaut: string;
  }
> = {
  // --- LICENCE 1 ---
  "Analyse 1": {
    niveau: "L1",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Analyse 2": {
    niveau: "L1",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Algèbre 1": {
    niveau: "L1",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Algèbre 2": {
    niveau: "L1",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Electricité": {
    niveau: "L1",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Kalidou Ba",
  },
  "Mécanique du point": {
    niveau: "L1",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Optique Géométrique": {
    niveau: "L1",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Programmation Python": {
    niveau: "L1",
    filieres: ["MPI", "MIASS"],
    professeurDefaut: "Pape Thiam",
  },
  "Langage C": {
    niveau: "L1",
    filieres: ["MPI"],
    professeurDefaut: "Pape Thiam",
  },
  "Magnétostatique": {
    niveau: "L1",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Finance des entreprises": {
    niveau: "L1",
    filieres: ["MIASS"],
    professeurDefaut: "M. Diop",
  },
  "Economie Générale": {
    niveau: "L1",
    filieres: ["MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },

  // --- LICENCE 2 ---
  "Analyse 3": {
    niveau: "L2",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Analyse 4": {
    niveau: "L2",
    filieres: ["MPI", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Probabilité": {
    niveau: "L2",
    filieres: ["MPI", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Électromagnétismes": {
    niveau: "L2",
    filieres: ["MPI"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Chimie Organique": {
    niveau: "L2",
    filieres: ["SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Chimie Inorganique": {
    niveau: "L2",
    filieres: ["SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Algèbre 3": {
    niveau: "L2",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Analyse Numérique Matricielle": {
    niveau: "L2",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Programmation Orientée Objet Python": {
    niveau: "L2",
    filieres: ["MPI", "MIASS"],
    professeurDefaut: "Ibrahima Anne",
  },
  "Base de données": {
    niveau: "L2",
    filieres: ["MPI", "MIASS"],
    professeurDefaut: "Ibrahima Anne",
  },
  "Mécanique Générale": {
    niveau: "L2",
    filieres: ["MPI", "SML"],
    professeurDefaut: "El Hadji Ibrahima Diop Sow",
  },
  "Thermodynamique": {
    niveau: "L2",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Magnétostatique et Régime Variable": {
    niveau: "L2",
    filieres: ["MPI", "SML"],
    professeurDefaut: "Ndiogou Ndiaye",
  },
  "Probabilités et Statistiques": {
    niveau: "L2",
    filieres: ["MPI", "SML", "MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
  "Economie": {
    niveau: "L2",
    filieres: ["MIASS"],
    professeurDefaut: "Pape Ibrahima Samb",
  },
};

function formatHeureDisplay(h: string) {
  if (!h) return "";
  if (h.includes("h")) return h;
  const parts = h.split(":");
  if (parts.length >= 2) return `${parts[0]}h${parts[1]}`;
  return h;
}

function parseSlotString(slotStr: string): { debut: string; fin: string } {
  const parts = slotStr.includes("–") ? slotStr.split("–") : slotStr.split("-");
  return {
    debut: (parts[0] || "21:00").trim(),
    fin: (parts[1] || "23:00").trim(),
  };
}

function isSeanceInSlot(seance: SeanceEDT, slotStr: string): boolean {
  const { debut, fin } = parseSlotString(slotStr);
  return (
    (seance.heure_debut || "").trim() === debut &&
    (seance.heure_fin || "").trim() === fin
  );
}

function getFiliereBadgeInfo(filieres?: ("MPI" | "SML" | "MIASS")[]) {
  if (!filieres || filieres.length === 0 || filieres.length >= 3) {
    return {
      label: "Tronc Commun",
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

function loadPromoSlots(niveau: "L1" | "L2"): string[] {
  if (typeof window === "undefined") return DEFAULT_SLOTS;
  try {
    const raw = localStorage.getItem(`has_edt_slots_${niveau}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return DEFAULT_SLOTS;
}

function savePromoSlots(niveau: "L1" | "L2", slots: string[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(`has_edt_slots_${niveau}`, JSON.stringify(slots));
  } catch {
    // fallback
  }
}

export default function AdminEDTPage() {
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [matieresList, setMatieresList] = useState<Matiere[]>([]);

  // Promotion sélectionnée : L1 ou L2 (un seul EDT par promo)
  const [activeNiveau, setActiveNiveau] = useState<"L1" | "L2">("L2");
  // Filtre filière interne
  const [filiereFilter, setFiliereFilter] = useState<string>("ALL");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Lignes / tranches horaires par promotion
  const [slotsMap, setSlotsMap] = useState<Record<"L1" | "L2", string[]>>({
    L1: DEFAULT_SLOTS,
    L2: DEFAULT_SLOTS,
  });

  // Modal d'ajout de ligne
  const [addLineModalOpen, setAddLineModalOpen] = useState(false);
  const [newLineDebut, setNewLineDebut] = useState("14:00");
  const [newLineFin, setNewLineFin] = useState("16:00");

  // Modal d'ajout / modification de cours
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<SeanceEDT | null>(null);
  const [isSendingReminder, setIsSendingReminder] = useState(false);

  // Formulaire modal cours (le niveau est verrouillé à activeNiveau !)
  const [formFilieres, setFormFilieres] = useState<("MPI" | "SML" | "MIASS")[]>(["MIASS"]);
  const [formJour, setFormJour] = useState<JourSemaine>("Mardi");
  const [formDebut, setFormDebut] = useState("21:00");
  const [formFin, setFormFin] = useState("23:00");
  const [formMatiere, setFormMatiere] = useState("Analyse 4");
  const [formEnseignant, setFormEnseignant] = useState("Mister Halil");
  const [formMeetUrl, setFormMeetUrl] = useState("https://meet.google.com/has-anal-four");

  const reloadData = useCallback(() => {
    let list = getStoredSeancesEDT();
    if (list.length === 0) {
      list = resetDefaultSeancesEDT();
    }
    setSeances(list);
    setProfs(getStoredProfesseurs());
    setMatieresList(getStoredMatieres());
  }, []);

  useEffect(() => {
    reloadData();
    setSlotsMap({
      L1: loadPromoSlots("L1"),
      L2: loadPromoSlots("L2"),
    });
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

  // Liste globale des enseignants
  const enseignantsList = useMemo(() => {
    const fromProfs = profs
      .map((p) => (p.full_name || p.nom || "").trim())
      .filter((n): n is string => Boolean(n));
    return Array.from(new Set([...ENSEIGNANTS_PRESETS, ...fromProfs]));
  }, [profs]);

  // Matières disponibles pour la promotion active (L1 ou L2)
  const matieresForCurrentLevel = useMemo(() => {
    const fromCatalogue = Object.entries(CATALOGUE_MATIERES)
      .filter(([_, info]) => info.niveau === activeNiveau)
      .map(([name]) => name);

    const fromStorage = matieresList
      .filter((m) => (m.niveau || (m.classes?.some((c) => c.startsWith("L2")) ? "L2" : "L1")) === activeNiveau)
      .map((m) => m.name);

    return Array.from(new Set([...fromCatalogue, ...fromStorage]));
  }, [activeNiveau, matieresList]);

  // Séances de la promotion active (L1 ou L2)
  const promoSeances = useMemo(() => {
    return seances.filter((s) => (s.niveau || "L1") === activeNiveau);
  }, [seances, activeNiveau]);

  // Séances filtrées par filière
  const filteredSeances = useMemo(() => {
    let list = promoSeances;
    if (filiereFilter !== "ALL") {
      if (filiereFilter === "TRONC_COMMUN") {
        list = list.filter((s) => !s.filieres || s.filieres.length === 0 || s.filieres.length >= 3);
      } else {
        list = list.filter((s) => s.filieres && s.filieres.includes(filiereFilter as any));
      }
    }
    return [...list].sort((a, b) => {
      const idxA = JOURS.indexOf(a.jour);
      const idxB = JOURS.indexOf(b.jour);
      if (idxA !== idxB) return idxA - idxB;
      return a.heure_debut.localeCompare(b.heure_debut);
    });
  }, [promoSeances, filiereFilter]);

  // Lignes distinctes (fusion des lignes configurées + des cours existants)
  const distinctSlots = useMemo(() => {
    const configured = slotsMap[activeNiveau] || DEFAULT_SLOTS;
    const set = new Set<string>(configured);
    promoSeances.forEach((s) => set.add(`${s.heure_debut}–${s.heure_fin}`));
    return Array.from(set).sort((a, b) => {
      // Le créneau officiel 21h00 - 23h00 est toujours affiché en premier
      if (a.includes("21:00")) return -1;
      if (b.includes("21:00")) return 1;
      const startA = a.split(/[–-]/)[0]?.trim() || "";
      const startB = b.split(/[–-]/)[0]?.trim() || "";
      return startB.localeCompare(startA);
    });
  }, [slotsMap, activeNiveau, promoSeances]);

  // Compteurs
  const countL1 = useMemo(() => seances.filter((s) => (s.niveau || "L1") === "L1").length, [seances]);
  const countL2 = useMemo(() => seances.filter((s) => s.niveau === "L2").length, [seances]);

  // Sélection intelligente de la matière : pré-remplit automatiquement filières & prof par défaut
  const handleSelectMatiere = (matiereNom: string) => {
    setFormMatiere(matiereNom);
    const cat = CATALOGUE_MATIERES[matiereNom];

    if (cat) {
      // 1. Déduction automatique des filières
      setFormFilieres(cat.filieres);
      // 2. Déduction automatique de l'enseignant par défaut
      setFormEnseignant(cat.professeurDefaut);
    } else {
      // Recherche dans la base des matières
      const found = matieresList.find(
        (m) => m.name.toLowerCase() === matiereNom.toLowerCase() || m.code?.toLowerCase() === matiereNom.toLowerCase()
      );
      if (found) {
        if (found.classes && found.classes.length > 0) {
          const text = found.classes.join(" ").toUpperCase();
          const fils: ("MPI" | "SML" | "MIASS")[] = [];
          if (text.includes("MPI")) fils.push("MPI");
          if (text.includes("SML")) fils.push("SML");
          if (text.includes("MIASS")) fils.push("MIASS");
          setFormFilieres(fils.length > 0 ? fils : ["MPI", "SML", "MIASS"]);
        }
        if (found.professeur?.full_name) {
          setFormEnseignant(found.professeur.full_name);
        } else if (found.professeur?.nom) {
          setFormEnseignant(found.professeur.nom);
        }
      } else {
        // Heuristiques intelligentes avec les professeurs officiels HAS
        const lower = matiereNom.toLowerCase();
        if (lower.includes("analyse") || lower.includes("algèbre") || lower.includes("math") || lower.includes("proba")) {
          setFormFilieres(["MPI", "SML", "MIASS"]);
          setFormEnseignant("Pape Ibrahima Samb");
        } else if (lower.includes("élec")) {
          setFormFilieres(["MPI", "SML"]);
          setFormEnseignant("Kalidou Ba");
        } else if (lower.includes("mécanique générale")) {
          setFormFilieres(["MPI", "SML"]);
          setFormEnseignant("El Hadji Ibrahima Diop Sow");
        } else if (lower.includes("mécanique") || lower.includes("thermo") || lower.includes("optique") || lower.includes("magnéto")) {
          setFormFilieres(["MPI", "SML"]);
          setFormEnseignant("Ndiogou Ndiaye");
        } else if (lower.includes("finance")) {
          setFormFilieres(["MIASS"]);
          setFormEnseignant("M. Diop");
        } else if (lower.includes("écono")) {
          setFormFilieres(["MIASS"]);
          setFormEnseignant("Pape Ibrahima Samb");
        } else if (lower.includes("python") || lower.includes("base de données") || lower.includes("langage c") || lower.includes("info")) {
          setFormFilieres(lower.includes("langage c") ? ["MPI"] : ["MPI", "MIASS"]);
          setFormEnseignant(activeNiveau === "L1" ? "Pape Thiam" : "Ibrahima Anne");
        }
      }
    }
  };

  // Ouvrir modal pour modifier un cours existant
  const openEditModal = (s: SeanceEDT) => {
    setEditingSeance(s);
    setFormFilieres(s.filieres && s.filieres.length > 0 ? s.filieres : ["MPI", "SML", "MIASS"]);
    setFormJour(s.jour);
    setFormDebut(s.heure_debut || "21:00");
    setFormFin(s.heure_fin || "23:00");
    setFormMatiere(s.matiere_nom);
    setFormEnseignant(s.professeur_nom || "Pape Ibrahima Samb");
    setFormMeetUrl(s.meet_url || "");
    setModalOpen(true);
  };

  // Ouvrir modal pour ajouter dans un créneau spécifique (par défaut 21h00 - 23h00)
  const openAddModal = (
    jour: JourSemaine = "Lundi",
    slotStr: string = "21:00–23:00"
  ) => {
    setEditingSeance(null);
    setFormJour(jour);
    const { debut, fin } = parseSlotString(slotStr);
    setFormDebut(debut);
    setFormFin(fin);
    setFormMeetUrl("");

    // Choix d'une première matière par défaut selon le niveau
    const defaultMatiere = activeNiveau === "L2" ? "Analyse 4" : "Analyse 2";
    handleSelectMatiere(defaultMatiere);
    setModalOpen(true);
  };

  // Ajouter une ligne horaire
  const handleAddLine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLineDebut || !newLineFin) {
      alert("Veuillez renseigner l'heure de début et l'heure de fin.");
      return;
    }
    const slotStr = `${newLineDebut}–${newLineFin}`;
    const current = slotsMap[activeNiveau] || DEFAULT_SLOTS;
    if (current.includes(slotStr)) {
      alert("Cette ligne horaire existe déjà dans la grille.");
      return;
    }
    const next = [...current, slotStr];
    setSlotsMap((prev) => ({ ...prev, [activeNiveau]: next }));
    savePromoSlots(activeNiveau, next);
    flash(`✓ Ligne horaire « ${slotStr} » ajoutée à l'EDT Licence ${activeNiveau === "L2" ? "2" : "1"}`);
    setAddLineModalOpen(false);
  };

  // Supprimer une ligne horaire
  const handleRemoveLine = (slotStr: string) => {
    const inSlot = promoSeances.filter(
      (s) => `${s.heure_debut}–${s.heure_fin}` === slotStr
    );
    if (inSlot.length > 0) {
      const ok = confirm(
        `Attention : la ligne « ${slotStr} » contient ${inSlot.length} cours pour la Licence ${activeNiveau === "L2" ? "2" : "1"}.\n\nVoulez-vous supprimer cette ligne ET supprimer tous les cours qui s'y trouvent ?`
      );
      if (!ok) return;
      inSlot.forEach((s) => {
        deleteSeanceEDT(s.id);
        recordAuditLog({
          action: "SUPPRESSION_EDT",
          details: {
            source: "suppression_ligne",
            slot: slotStr,
            promotion: activeNiveau,
            matiere: s.matiere_nom,
            seance_id: s.id,
          },
        });
      });
    } else {
      const ok = confirm(
        `Supprimer la ligne horaire « ${slotStr} » de la grille Licence ${activeNiveau === "L2" ? "2" : "1"} ?`
      );
      if (!ok) return;
    }

    const current = slotsMap[activeNiveau] || DEFAULT_SLOTS;
    const next = current.filter((x) => x !== slotStr);
    setSlotsMap((prev) => ({ ...prev, [activeNiveau]: next }));
    savePromoSlots(activeNiveau, next);
    reloadData();
    flash(`Ligne « ${slotStr} » supprimée.`);
  };

  // Dupliquer une séance
  const handleDuplicate = (s: SeanceEDT, e?: React.MouseEvent) => {
    e?.stopPropagation();
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
  const handleDelete = (id: string, matiere: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (confirm(`Confirmez-vous la suppression du cours « ${matiere} » ?`)) {
      deleteSeanceEDT(id);
      recordAuditLog({
        action: "SUPPRESSION_EDT",
        details: { matiere, seance_id: id },
      });
      flash(`Cours « ${matiere} » supprimé.`);
      if (modalOpen && editingSeance?.id === id) {
        setModalOpen(false);
      }
    }
  };

  // Enregistrer depuis modal
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formMatiere.trim()) {
      alert("Veuillez indiquer le nom de la matière.");
      return;
    }
    if (!formEnseignant.trim()) {
      alert("Veuillez indiquer le nom de l'enseignant.");
      return;
    }

    const seanceData: SeanceEDT = {
      id: editingSeance?.id || `seance-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      classe_id: `promo-${activeNiveau.toLowerCase()}`,
      classe_nom: activeNiveau === "L2" ? "Licence 2" : "Licence 1",
      semestre: activeNiveau === "L2" ? "Semestre 4" : "Semestre 2",
      jour: formJour,
      heure_debut: formDebut,
      heure_fin: formFin,
      matiere_nom: formMatiere.trim(),
      matiere_code: editingSeance?.matiere_code || (formMatiere.toLowerCase().includes("analyse") ? "MAT004" : formMatiere.toLowerCase().includes("probabilité") ? "MAT020" : "MAT001"),
      professeur_nom: formEnseignant.trim(),
      meet_url: formMeetUrl.trim() || null,
      type_seance: "COURS",
      niveau: activeNiveau,
      filieres: formFilieres.length === 3 ? [] : formFilieres,
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

    flash(`✓ Cours enregistré : ${seanceData.matiere_nom} (${seanceData.jour})`);
    setModalOpen(false);
  };

  // Envoi de rappel email pour les cours du jour
  const handleSendDayReminders = async () => {
    const JOURS_FR = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const todayFr = JOURS_FR[new Date().getDay()] as JourSemaine;
    const defaultDay = JOURS.includes(todayFr) ? todayFr : "Lundi";

    const choice = prompt(
      `Pour quel jour souhaitez-vous envoyer le rappel email aux étudiants de Licence ${activeNiveau === "L2" ? "2" : "1"} ? (Lundi, Mardi, Mercredi, Jeudi, Vendredi, Samedi, Dimanche)`,
      defaultDay
    );
    if (!choice) return;
    const cleanDay = choice.trim();
    if (!JOURS.includes(cleanDay as JourSemaine)) {
      alert(`Jour non valide. Choisissez parmi : ${JOURS.join(", ")}`);
      return;
    }

    setIsSendingReminder(true);
    try {
      const currentSeances = getStoredSeancesEDT();
      const res = await fetch("/api/notifications/course-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jour: cleanDay,
          niveau: activeNiveau,
          seances: currentSeances,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      flash(`✓ ${data.message || `Rappels envoyés (${data.sentCount || 0} emails).`}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      alert(`Erreur d'envoi des rappels : ${msg}`);
    } finally {
      setIsSendingReminder(false);
    }
  };

  // Envoi de rappel email pour un cours précis
  const handleSendSingleCourseReminder = async (seance: SeanceEDT) => {
    const ok = confirm(
      `Envoyer un email de rappel à tous les étudiants inscrits au cours de « ${seance.matiere_nom} » (${seance.jour} ${formatHeureDisplay(seance.heure_debut)}–${formatHeureDisplay(seance.heure_fin)}) ?`
    );
    if (!ok) return;

    setIsSendingReminder(true);
    try {
      const currentSeances = getStoredSeancesEDT();
      const res = await fetch("/api/notifications/course-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          seanceId: seance.id,
          seances: currentSeances,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'envoi");
      flash(`✓ ${data.message || `Rappel envoyé pour ${seance.matiere_nom} (${data.sentCount || 0} emails).`}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      alert(`Erreur d'envoi du rappel : ${msg}`);
    } finally {
      setIsSendingReminder(false);
    }
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">

        {/* ── EN-TÊTE PRINCIPAL ────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="w-4 h-4 text-[#e0521c]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">
                Emplois du Temps HAS
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Grille Tableau des Cours
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              Un seul emploi du temps par promotion (<strong>Licence 1</strong> et <strong>Licence 2</strong>) avec filières différenciées (<strong>MPI</strong>, <strong>SML</strong>, <strong>MIASS</strong>).
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Button
              onClick={handleSendDayReminders}
              variant="outline"
              size="sm"
              disabled={isSendingReminder}
              leftIcon={
                isSendingReminder ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#e0521c]" />
                ) : (
                  <Mail className="w-4 h-4 text-[#e0521c]" />
                )
              }
              title="Envoyer un rappel par email aux étudiants pour les cours du jour"
            >
              {isSendingReminder ? "Envoi du rappel..." : "Rappel Email Cours"}
            </Button>
            <Button
              onClick={() => setAddLineModalOpen(true)}
              variant="outline"
              size="sm"
              leftIcon={<Plus className="w-4 h-4 text-[#e0521c]" />}
            >
              Ajouter une ligne
            </Button>
            <Button
              onClick={() => openAddModal("Lundi")}
              variant="accent"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Nouveau Cours
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

        {/* ── SÉLECTION DES PROMOTIONS (L1 vs L2) & FILTRES ─────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-2 bg-slate-100/90 dark:bg-[#151D27] rounded-2xl border border-slate-200 dark:border-[#263241]">
          <div className="flex gap-2">
            {(["L1", "L2"] as const).map((niv) => {
              const isActive = activeNiveau === niv;
              const count = niv === "L1" ? countL1 : countL2;
              return (
                <button
                  key={niv}
                  type="button"
                  onClick={() => setActiveNiveau(niv)}
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

          {/* Filtres filières & réinitialisation si nécessaire */}
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

            {(countL1 === 0 || countL2 === 0) && (
              <button
                type="button"
                onClick={() => {
                  resetDefaultSeancesEDT();
                  reloadData();
                  flash("✓ Cours de référence réinitialisés avec succès");
                }}
                className="ml-2 text-[11px] text-[#e0521c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                title="Recharger les cours officiels HAS"
              >
                <RotateCcw className="w-3 h-3" />
                Charger les cours par défaut
              </button>
            )}
          </div>
        </div>

        {/* ── 1. GRILLE TABLEAU HEBDOMADAIRE (LUNDI AU DIMANCHE) ──────── */}
        <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-[#151D27]/50">
            <div>
              <h2 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#e0521c]" />
                Grille Tableau — Licence {activeNiveau === "L2" ? "2" : "1"} (Lundi au Dimanche)
              </h2>
              <p className="text-xs text-slate-400 dark:text-[#AAB4C0] mt-0.5">
                Cliquez sur un cours pour le modifier, ou sur une case vide pour y ajouter un cours directement en Licence {activeNiveau === "L2" ? "2" : "1"}.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                leftIcon={<Plus className="w-3.5 h-3.5 text-[#e0521c]" />}
                onClick={() => setAddLineModalOpen(true)}
              >
                + Ajouter une ligne
              </Button>
              <Button
                size="sm"
                variant="accent"
                leftIcon={<Plus className="w-3.5 h-3.5" />}
                onClick={() => openAddModal("Lundi")}
              >
                Nouveau cours ({activeNiveau})
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-xs border-collapse">
              <thead>
                <tr className="bg-[#0f2744] dark:bg-[#151D27] text-white divide-x divide-white/10 dark:divide-[#263241]">
                  <th className="py-3 px-3 text-left uppercase tracking-wider font-bold w-36">
                    Ligne (Heure)
                  </th>
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
                {distinctSlots.map((slot, i) => (
                  <tr key={slot} className={i % 2 === 0 ? "bg-white dark:bg-[#111821]" : "bg-slate-50/40 dark:bg-[#151D27]/30"}>
                    {/* Colonne Header Ligne avec suppression */}
                    <td className="p-3 border-r border-slate-100 dark:border-[#263241] whitespace-nowrap bg-slate-50/80 dark:bg-[#151D27]/60 group/line">
                      <div className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-[#F5F7FA]">
                          <Clock className="w-3.5 h-3.5 text-[#e0521c] shrink-0" />
                          <span>{slot}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveLine(slot)}
                          title={`Supprimer la tranche horaire ${slot}`}
                          className="opacity-40 group-hover/line:opacity-100 hover:opacity-100 p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[10px] text-slate-400 dark:text-[#687585] mt-1">
                        {promoSeances.filter((s) => isSeanceInSlot(s, slot)).length} cours placés
                      </div>
                    </td>

                    {/* Colonnes Jours Lundi au Dimanche */}
                    {JOURS.map((j) => {
                      const cells = filteredSeances.filter(
                        (s) => s.jour === j && isSeanceInSlot(s, slot)
                      );
                      return (
                        <td
                          key={j}
                          onClick={() => {
                            if (cells.length === 0) {
                              openAddModal(j, slot);
                            }
                          }}
                          className={`p-2 border-r border-slate-100 dark:border-[#263241] last:border-r-0 min-w-[135px] transition-colors ${
                            cells.length === 0 ? "hover:bg-blue-50/40 dark:hover:bg-blue-950/20 cursor-pointer" : ""
                          }`}
                        >
                          <div className="space-y-1.5">
                            {cells.map((s) => {
                              const fBadge = getFiliereBadgeInfo(s.filieres);
                              return (
                                <div
                                  key={s.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(s);
                                  }}
                                  className="p-2.5 rounded-xl border border-blue-200/90 dark:border-blue-900/60 bg-blue-50/70 dark:bg-[#151D27] shadow-2xs space-y-1.5 relative group cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-md transition-all"
                                >
                                  <div className="flex items-center justify-between text-[10px]">
                                    <span className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-black border ${fBadge.color}`}>
                                      {fBadge.short}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditModal(s);
                                        }}
                                        title="Modifier ce cours"
                                        className="p-1 rounded bg-white dark:bg-[#111821] text-slate-600 hover:text-blue-600 shadow-xs cursor-pointer"
                                      >
                                        <Edit2 className="w-2.5 h-2.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => handleDuplicate(s, e)}
                                        title="Dupliquer"
                                        className="p-1 rounded bg-white dark:bg-[#111821] text-slate-600 hover:text-emerald-600 shadow-xs cursor-pointer"
                                      >
                                        <Copy className="w-2.5 h-2.5" />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={(e) => handleDelete(s.id, s.matiere_nom, e)}
                                        title="Supprimer ce cours"
                                        className="p-1 rounded bg-white dark:bg-[#111821] text-slate-400 hover:text-red-600 shadow-xs cursor-pointer"
                                      >
                                        <Trash2 className="w-2.5 h-2.5" />
                                      </button>
                                    </div>
                                  </div>

                                  <div className="font-bold text-xs text-slate-900 dark:text-[#F5F7FA] leading-tight">
                                    {s.matiere_nom}
                                  </div>

                                  <div className="text-[11px] text-slate-600 dark:text-[#AAB4C0] font-medium truncate">
                                    👤 {s.professeur_nom || "Mister Halil"}
                                  </div>

                                  {s.meet_url ? (
                                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-[#263241] flex gap-1">
                                      <a
                                        href={s.meet_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 py-1 px-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center justify-center gap-1"
                                      >
                                        <Video className="w-3 h-3" /> Meet
                                      </a>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleCopyMeet(s.meet_url!);
                                        }}
                                        className="p-1 rounded border border-slate-200 dark:border-[#263241] text-slate-500 hover:bg-white cursor-pointer"
                                      >
                                        {copiedLink === s.meet_url ? (
                                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        ) : (
                                          <Copy className="w-3 h-3" />
                                        )}
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="pt-1.5 border-t border-slate-200/50 dark:border-[#263241] flex gap-1">
                                      <a
                                        href="https://meet.google.com/new"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 py-1 px-1.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] font-bold text-[10px] flex items-center justify-center gap-1"
                                        title="Créer une réunion sur Google Meet"
                                      >
                                        <Video className="w-3 h-3 text-[#e0521c]" /> Créer Meet
                                      </a>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          openEditModal(s);
                                        }}
                                        className="px-1.5 py-1 rounded border border-slate-200 dark:border-[#263241] text-slate-500 hover:bg-white cursor-pointer text-[10px] font-bold"
                                        title="Coller le lien Meet"
                                      >
                                        Coller
                                      </button>
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                openAddModal(j, slot);
                              }}
                              className="w-full py-1.5 rounded-lg border border-dashed border-slate-200 dark:border-[#263241] hover:border-slate-400 text-slate-400 hover:text-slate-700 dark:hover:text-[#F5F7FA] text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                            >
                              <Plus className="w-3 h-3" /> Ajouter
                            </button>
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pied de grille : Bouton d'ajout de ligne */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-[#151D27]/80 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-[#AAB4C0]">
              {distinctSlots.length} lignes d&apos;horaires configurées pour Licence {activeNiveau === "L2" ? "2" : "1"}
            </span>
            <button
              type="button"
              onClick={() => setAddLineModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] text-slate-700 dark:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#151D27] flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-[#e0521c]" />
              Ajouter une nouvelle ligne d&apos;horaires
            </button>
          </div>
        </div>

        {/* ── 2. TABLEAU RÉCAPITULATIF DES COURS DE LA PROMO ─────────── */}
        <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200/90 dark:border-[#263241] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-[#263241] flex items-center justify-between">
            <h2 className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA] flex items-center gap-2">
              <TableIcon className="w-4 h-4 text-[#e0521c]" />
              Tableau des Cours — Licence {activeNiveau === "L2" ? "2" : "1"} ({filteredSeances.length} séance{filteredSeances.length !== 1 ? "s" : ""})
            </h2>
            <span className="text-xs text-slate-400 dark:text-[#687585]">
              Filières différenciées (MPI, SML, MIASS) — Cliquez sur une ligne pour la modifier
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0f2744] text-white dark:bg-[#151D27] uppercase tracking-wider font-extrabold divide-x divide-white/10 dark:divide-[#263241]">
                  <th className="py-3 px-4 text-center w-28">JOUR</th>
                  <th className="py-3 px-4 text-center w-36">HORAIRES</th>
                  <th className="py-3 px-5">MATIÈRE</th>
                  <th className="py-3 px-4 text-center w-36">FILIÈRE</th>
                  <th className="py-3 px-5">ENSEIGNANT</th>
                  <th className="py-3 px-4 text-center w-36">LIEN MEET</th>
                  <th className="py-3 px-3 text-center w-28">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                {filteredSeances.map((s, idx) => {
                  const isEven = idx % 2 === 0;
                  const fBadge = getFiliereBadgeInfo(s.filieres);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => openEditModal(s)}
                      className={`hover:bg-slate-50/80 dark:hover:bg-[#151D27]/80 transition-colors cursor-pointer ${
                        isEven ? "bg-white dark:bg-[#111821]" : "bg-slate-50/40 dark:bg-[#151D27]/30"
                      }`}
                    >
                      <td className="py-3.5 px-4 text-center font-bold text-xs text-[#0f2744] dark:text-[#F5F7FA]">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/50 text-[#0f2744] dark:text-blue-300 font-extrabold">
                          {s.jour}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-xs text-slate-700 dark:text-[#AAB4C0] whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#151D27] border border-slate-200/60 dark:border-[#263241]">
                          <Clock className="w-3.5 h-3.5 text-[#e0521c]" />
                          <span>{formatHeureDisplay(s.heure_debut)} – {formatHeureDisplay(s.heure_fin)}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-5 font-bold text-sm text-slate-900 dark:text-[#F5F7FA]">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#0f2744] dark:text-[#e0521c] shrink-0" />
                          <span>{s.matiere_nom}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-black border ${fBadge.color}`}>
                          {fBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-5 font-bold text-xs text-slate-800 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-950/50 text-[#e0521c] flex items-center justify-center font-black text-[10px] shrink-0">
                            {(s.professeur_nom || "H")[0]}
                          </div>
                          <span>{s.professeur_nom || "Mister Halil"}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
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
                            </a>
                            <button
                              type="button"
                              onClick={() => handleCopyMeet(s.meet_url!)}
                              title="Copier le lien"
                              className="p-1.5 rounded-lg border border-slate-200 dark:border-[#263241] hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500 cursor-pointer"
                            >
                              {copiedLink === s.meet_url ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-1.5">
                            <a
                              href="https://meet.google.com/new"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-slate-300 dark:border-[#263241] text-slate-500 hover:text-slate-800 dark:hover:text-[#F5F7FA] text-[10px] font-medium"
                              title="Ouvrir meet.new pour générer le lien"
                            >
                              <Video className="w-3 h-3 text-[#e0521c]" />
                              Créer Meet
                            </a>
                            <button
                              type="button"
                              onClick={() => openEditModal(s)}
                              className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              Coller
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEditModal(s)}
                            title="Modifier"
                            className="p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDuplicate(s, e)}
                            title="Dupliquer"
                            className="p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-500 hover:text-emerald-600 transition-colors cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(s.id, s.matiere_nom, e)}
                            title="Supprimer"
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
        </div>

        {/* ── MODAL D'AJOUT DE LIGNE D'HORAIRES ──────────────────────── */}
        {addLineModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#263241]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    Ajouter une ligne d&apos;horaires
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-[#AAB4C0] mt-0.5">
                    Grille Licence {activeNiveau === "L2" ? "2" : "1"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddLineModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddLine} className="p-6 space-y-4">
                {/* Raccourcis rapides */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Créneaux fréquents :
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {PRESET_HORAIRES.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => {
                          setNewLineDebut(p.debut);
                          setNewLineFin(p.fin);
                        }}
                        className={`py-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all text-left cursor-pointer ${
                          newLineDebut === p.debut && newLineFin === p.fin
                            ? "bg-[#0f2744] text-white dark:bg-[#e0521c] border-transparent"
                            : "bg-slate-50 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241] hover:bg-slate-100"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saisie personnalisée */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                      Heure de début * :
                    </label>
                    <input
                      type="time"
                      required
                      value={newLineDebut}
                      onChange={(e) => setNewLineDebut(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1">
                      Heure de fin * :
                    </label>
                    <input
                      type="time"
                      required
                      value={newLineFin}
                      onChange={(e) => setNewLineFin(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cette tranche apparaîtra immédiatement du Lundi au Dimanche sur la grille.</span>
                </div>

                <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#263241]">
                  <Button type="button" variant="outline" size="sm" onClick={() => setAddLineModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                    Ajouter cette ligne
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL D'AJOUT / MODIFICATION DE COURS (PROMO VERROUILLÉE) ──── */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-[#263241]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    {editingSeance ? "Modifier le cours" : "Ajouter un cours"}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-[#0f2744] dark:bg-[#e0521c] text-white">
                      Licence {activeNiveau === "L2" ? "2 (L2)" : "1 (L1)"}
                    </span>
                    <span className="text-xs text-slate-400">
                      Promotion automatiquement définie
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#151D27] text-slate-500 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="p-6 space-y-4">

                {/* 1. Matière avec sélection intelligente */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Matière au programme (Licence {activeNiveau === "L2" ? "2" : "1"}) * :
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ⚡ Règle auto : filières & prof pré-remplis
                    </span>
                  </div>

                  {/* Sélecteur déroulant des matières du niveau */}
                  <select
                    value={matieresForCurrentLevel.includes(formMatiere) ? formMatiere : ""}
                    onChange={(e) => {
                      if (e.target.value) {
                        handleSelectMatiere(e.target.value);
                      }
                    }}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold mb-2 cursor-pointer"
                  >
                    <option value="">-- Choisir une matière au programme ({activeNiveau}) --</option>
                    {matieresForCurrentLevel.map((mName) => (
                      <option key={mName} value={mName}>
                        {mName}
                      </option>
                    ))}
                  </select>

                  {/* Champ texte direct modifiable */}
                  <input
                    type="text"
                    required
                    placeholder="Ou saisissez un nom de matière..."
                    value={formMatiere}
                    onChange={(e) => handleSelectMatiere(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-slate-50 dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-medium"
                  />

                  {/* Suggestions rapides sous forme de pilules cliquables */}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {matieresForCurrentLevel.slice(0, 5).map((mName) => (
                      <button
                        key={mName}
                        type="button"
                        onClick={() => handleSelectMatiere(mName)}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold transition-all cursor-pointer ${
                          formMatiere === mName
                            ? "bg-[#0f2744] dark:bg-[#e0521c] text-white"
                            : "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
                        }`}
                      >
                        {mName}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Enseignant avec déduction automatique & modification libre */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Nom de l&apos;Enseignant * :
                    </label>
                    <span className="text-[10px] text-slate-400">
                      Modifiable selon vos désirs
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Mister Halil"
                    value={formEnseignant}
                    onChange={(e) => setFormEnseignant(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                  />
                  {/* Boutons pour changer le prof en 1 clic */}
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {enseignantsList.map((name) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setFormEnseignant(name)}
                        className={`text-[10px] px-2 py-0.5 rounded transition-all cursor-pointer ${
                          formEnseignant === name
                            ? "bg-[#e0521c] text-white font-bold"
                            : "bg-slate-100 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-200"
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Filière(s) concernée(s) (automatique mais personnalisable) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Filière(s) concernée(s) :
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

                {/* 4. Jour de la semaine */}
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

                {/* 5. Horaires (21h00 - 23h00 rapide en 1 clic) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Créneau horaire * :
                    </label>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      ★ Horaire standard HAS : 21h00 – 23h00
                    </span>
                  </div>

                  {/* Boutons d'accès rapide aux tranches horaires */}
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {PRESET_HORAIRES.slice(0, 4).map((p) => {
                      const isSelected = formDebut === p.debut && formFin === p.fin;
                      return (
                        <button
                          key={p.label}
                          type="button"
                          onClick={() => {
                            setFormDebut(p.debut);
                            setFormFin(p.fin);
                          }}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#0f2744] dark:bg-[#e0521c] text-white border-transparent shadow-xs scale-[1.01]"
                              : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241] hover:bg-slate-100"
                          }`}
                        >
                          {p.debut === "21:00" ? "★ 21h00 – 23h00 (Principal)" : p.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Saisie fine personnalisée des heures */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Heure début :
                      </label>
                      <input
                        type="time"
                        value={formDebut}
                        onChange={(e) => setFormDebut(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-slate-500 mb-1">
                        Heure fin :
                      </label>
                      <input
                        type="time"
                        value={formFin}
                        onChange={(e) => setFormFin(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* 6. Lien Google Meet (généré puis copié) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-700 dark:text-[#F5F7FA]">
                      Lien Google Meet (visio) :
                    </label>
                    <a
                      href="https://meet.google.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800"
                    >
                      <Video className="w-3.5 h-3.5" />
                      1. Créer la réunion sur Meet (meet.new)
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      placeholder="2. Collez ici le lien copié (ex: https://meet.google.com/abc-defg-hij)..."
                      value={formMeetUrl}
                      onChange={(e) => setFormMeetUrl(e.target.value)}
                      className="flex-1 h-10 px-3 rounded-xl border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const text = await navigator.clipboard.readText();
                          if (text && text.trim()) {
                            setFormMeetUrl(text.trim());
                            flash("✓ Lien Meet collé depuis le presse-papier");
                          }
                        } catch {
                          alert("Collez directement le lien copié dans le champ avec Ctrl+V.");
                        }
                      }}
                      title="Coller le lien copié depuis Google Meet"
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#151D27] dark:hover:bg-[#263241] border border-slate-200 dark:border-[#263241] text-xs font-bold text-slate-700 dark:text-[#AAB4C0] flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      Coller
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Les liens Meet ne sont pas statiques : cliquez sur <em>Créer la réunion</em>, copiez le lien généré par Google Meet puis collez-le ici.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#263241] flex-wrap gap-2">
                  {editingSeance ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(editingSeance.id, editingSeance.matiere_nom)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Supprimer
                      </button>
                      <button
                        type="button"
                        disabled={isSendingReminder}
                        onClick={() => handleSendSingleCourseReminder(editingSeance)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950/40 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        title="Envoyer un rappel email aux étudiants inscrits"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        Envoyer rappel email
                      </button>
                    </div>
                  ) : <div />}

                  <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                      Annuler
                    </Button>
                    <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                      {editingSeance ? "Mettre à jour" : "Enregistrer"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
