"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Users,
  Search,
  Filter,
  Download,
  Printer,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Mail,
  Phone,
  ArrowUpDown,
  BookOpen,
  Calendar,
  Building,
  Cpu,
  TrendingUp,
  X,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  UserCheck,
  Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Profile, UserRole, Filiere, Classe } from "@/lib/types";
import {
  getStoredStudents,
  saveStudent,
  deleteStudent,
  isAccountDeleted,
} from "@/lib/academicStorage";
import { MOCK_FILIERES, MOCK_CLASSES } from "@/lib/data/mock-data";

type NiveauType = "L1" | "L2" | "NB";
type FiliereFilter = "ALL" | "MPI" | "SML" | "MIASS";
type SortOption = "name-asc" | "name-desc" | "matricule" | "recent";
type ViewMode = "table" | "grid";

interface StudentItem {
  id: string;
  full_name: string;
  email: string;
  username: string | null;
  matricule: string;
  phone: string | null;
  niveau: NiveauType;
  filiere: "MPI" | "SML" | "MIASS";
  filiere_nom: string;
  classe_nom: string;
  is_active: boolean;
  statut_inscription: "valide" | "en_attente" | "refuse";
  created_at: string;
  avatar_url?: string | null;
}

const FILIERE_META: Record<"MPI" | "SML" | "MIASS", { nom: string; color: string; badgeBg: string; icon: React.ReactNode }> = {
  MPI: {
    nom: "Mathématiques, Physique & Informatique",
    color: "text-blue-700 dark:text-cyan-400 border-blue-200 dark:border-cyan-800/60 bg-blue-50/70 dark:bg-cyan-950/30",
    badgeBg: "bg-blue-600 text-white",
    icon: <Cpu className="w-4 h-4" />,
  },
  SML: {
    nom: "Science de la Mer et du Littoral",
    color: "text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/30",
    badgeBg: "bg-emerald-600 text-white",
    icon: <Building className="w-4 h-4" />,
  },
  MIASS: {
    nom: "Math. & Info. Appliquées aux Sc. Sociales",
    color: "text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800/60 bg-purple-50/70 dark:bg-purple-950/30",
    badgeBg: "bg-purple-600 text-white",
    icon: <TrendingUp className="w-4 h-4" />,
  },
};

export default function AdminEtudiantsPage() {
  // Navigation principale demandée : L1 et L2
  const [selectedNiveau, setSelectedNiveau] = useState<NiveauType>("L1");
  // Sous-navigation par licence : Liste Complète, Liste MPI, Liste SML, Liste MIASS
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereFilter>("ALL");

  // Données
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Recherche & Affichage
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name-asc");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  // Feedback & Actions
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Modals
  const [studentDetailsModal, setStudentDetailsModal] = useState<StudentItem | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Formulaire d'ajout / édition
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formNiveau, setFormNiveau] = useState<NiveauType>("L1");
  const [formFiliere, setFormFiliere] = useState<"MPI" | "SML" | "MIASS">("MPI");
  const [editingStudent, setEditingStudent] = useState<StudentItem | null>(null);

  // Fonction de normalisation universelle pour tout objet étudiant
  const normalizeStudent = useCallback((raw: any): StudentItem => {
    const meta = raw.user_metadata || {};

    // Détection Niveau
    let niveau: NiveauType = "L1";
    const rawNiv = String(raw.niveau || meta.niveau || raw.classe?.niveau || raw.classe_id || "").toUpperCase();
    if (rawNiv.includes("NB") || rawNiv.includes("BACHELIER")) {
      niveau = "NB";
    } else if (rawNiv.includes("L2") || rawNiv.includes("LICENCE 2")) {
      niveau = "L2";
    }

    // Détection Filière
    let filiere: "MPI" | "SML" | "MIASS" = "MPI";
    const rawFil = String(
      raw.filiere ||
      meta.filiere ||
      raw.filiere_id ||
      raw.specialite ||
      raw.classe_id ||
      raw.classe?.code ||
      raw.classe?.name ||
      ""
    ).toUpperCase();

    if (rawFil.includes("SML") || rawFil.includes("MER") || rawFil.includes("LITTORAL") || rawFil.includes("22222222")) {
      filiere = "SML";
    } else if (rawFil.includes("MIASS") || rawFil.includes("SOCIALE") || rawFil.includes("33333333")) {
      filiere = "MIASS";
    } else if (rawFil.includes("MPI") || rawFil.includes("PHYSIQUE") || rawFil.includes("11111111")) {
      filiere = "MPI";
    }

    const fullName = String(
      raw.full_name ||
      meta.full_name ||
      raw.fullName ||
      (raw.prenom && raw.nom ? `${raw.prenom} ${raw.nom}` : "") ||
      raw.email?.split("@")[0] ||
      "Étudiant HAS"
    ).trim();

    const matricule = String(
      raw.matricule ||
      meta.matricule ||
      `ETU-${String(raw.id || "").slice(0, 4).toUpperCase()}`
    );

    const statut: "valide" | "en_attente" | "refuse" =
      raw.statut_inscription ||
      meta.statut_inscription ||
      (raw.is_active ? "valide" : "en_attente");

    return {
      id: String(raw.id || `stu-${Math.random()}`),
      full_name: fullName,
      email: String(raw.email || ""),
      username: raw.username || meta.username || null,
      matricule,
      phone: raw.phone || raw.telephone || meta.phone || null,
      niveau,
      filiere,
      filiere_nom: FILIERE_META[filiere].nom,
      classe_nom: `${niveau === "NB" ? "Nouveaux Bacheliers" : `Licence ${niveau === "L1" ? "1" : "2"}`} — ${filiere}`,
      is_active: raw.is_active ?? true,
      statut_inscription: statut,
      created_at: raw.created_at || new Date().toISOString(),
      avatar_url: raw.avatar_url || null,
    };
  }, []);

  // Chargement strict des vrais utilisateurs : Supabase Auth & LocalStorage
  const loadAllStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Nettoyage immédiat de tout ancien résidu factice dans le localStorage
      if (typeof window !== "undefined") {
        try {
          const raw = localStorage.getItem("has_academic_students_v1");
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              const cleaned = parsed.filter(
                (p: any) => !p.id?.startsWith("s-l1-") && !p.id?.startsWith("s-l2-")
              );
              if (cleaned.length !== parsed.length) {
                localStorage.setItem("has_academic_students_v1", JSON.stringify(cleaned));
              }
            }
          }
        } catch {}
      }

      const localStudents = getStoredStudents().filter(
        (s) =>
          !isAccountDeleted(s.id, s.email) &&
          !s.id.startsWith("s-l1-") &&
          !s.id.startsWith("s-l2-")
      );
      const studentMap = new Map<string, StudentItem>();

      // 1. Charger les comptes réels depuis l'API serveur Supabase
      try {
        const res = await fetch("/api/admin/validation-inscriptions?status=all");
        if (res.ok) {
          const data = await res.json();
          const serverList = [
            ...(data.students || []),
            ...(data.pendingStudents || []),
          ];

          for (const s of serverList) {
            if (
              !isAccountDeleted(s.id, s.email) &&
              !s.id?.startsWith("s-l1-") &&
              !s.id?.startsWith("s-l2-")
            ) {
              const norm = normalizeStudent(s);
              studentMap.set(norm.email.toLowerCase() || norm.id, norm);
            }
          }
        }
      } catch (apiErr) {
        console.warn("[ETUDIANTS-PAGE] Note: utilisation du stockage local:", apiErr);
      }

      // 2. Fusionner avec les étudiants locaux réels sans écraser les données serveur
      for (const st of localStudents) {
        if (!studentMap.has(st.email?.toLowerCase() || st.id)) {
          const norm = normalizeStudent(st);
          studentMap.set(norm.email?.toLowerCase() || norm.id, norm);
        }
      }

      const mergedList = Array.from(studentMap.values());
      setStudents(mergedList);
    } catch (err) {
      console.error("[ETUDIANTS-PAGE] Erreur loadAllStudents:", err);
    } finally {
      setIsLoading(false);
    }
  }, [normalizeStudent]);

  useEffect(() => {
    loadAllStudents();
    const handleUpdate = () => loadAllStudents();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, [loadAllStudents]);

  // Filtrage par Licence (L1 ou L2) et par Filière (ALL / MPI / SML / MIASS)
  const filteredStudents = useMemo(() => {
    return students
      .filter((s) => {
        // Filtrer par niveau (L1 ou L2)
        if (s.niveau !== selectedNiveau) return false;

        // Filtrer par filière
        if (selectedFiliere !== "ALL" && s.filiere !== selectedFiliere) return false;

        // Filtrer par recherche (Nom complet ou ID)
        if (search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = s.full_name.toLowerCase().includes(q);
          const matchMatricule = s.matricule.toLowerCase().includes(q);
          return matchName || matchMatricule;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") {
          return a.full_name.localeCompare(b.full_name, "fr", { sensitivity: "base" });
        }
        if (sortBy === "name-desc") {
          return b.full_name.localeCompare(a.full_name, "fr", { sensitivity: "base" });
        }
        if (sortBy === "matricule") {
          return a.matricule.localeCompare(b.matricule);
        }
        if (sortBy === "recent") {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
        return 0;
      });
  }, [students, selectedNiveau, selectedFiliere, search, sortBy]);

  // Compteurs dynamiques pour NB, Licence 1 et Licence 2
  const stats = useMemo(() => {
    const nb = students.filter((s) => s.niveau === "NB");
    const l1 = students.filter((s) => s.niveau === "L1");
    const l2 = students.filter((s) => s.niveau === "L2");

    return {
      total: students.length,
      nb: {
        total: nb.length,
        mpi: nb.filter((s) => s.filiere === "MPI").length,
        sml: nb.filter((s) => s.filiere === "SML").length,
        miass: nb.filter((s) => s.filiere === "MIASS").length,
      },
      l1: {
        total: l1.length,
        mpi: l1.filter((s) => s.filiere === "MPI").length,
        sml: l1.filter((s) => s.filiere === "SML").length,
        miass: l1.filter((s) => s.filiere === "MIASS").length,
      },
      l2: {
        total: l2.length,
        mpi: l2.filter((s) => s.filiere === "MPI").length,
        sml: l2.filter((s) => s.filiere === "SML").length,
        miass: l2.filter((s) => s.filiere === "MIASS").length,
      },
    };
  }, [students]);

  // Copier la liste des noms complets dans le presse-papier
  const handleCopyFullNames = (numbered: boolean = true) => {
    if (filteredStudents.length === 0) return;

    const currentListName = `LISTE OFFICIELLE DES ÉTUDIANTS — ${
      selectedNiveau === "NB"
        ? "NOUVEAUX BACHELIERS (NB)"
        : selectedNiveau === "L1"
        ? "LICENCE 1 (L1)"
        : "LICENCE 2 (L2)"
    } — ${
      selectedFiliere === "ALL" ? "TOUTES FILIÈRES (COMPLÈTE)" : selectedFiliere
    } (${filteredStudents.length} étudiants)`;

    const namesText = filteredStudents
      .map((s, idx) =>
        numbered
          ? `${idx + 1}. ${s.full_name} (ID: ${s.matricule} — ${s.filiere})`
          : `${s.full_name} (ID: ${s.matricule})`
      )
      .join("\n");

    const fullExport = `${currentListName}\nHalil Académie Scientifique\nDate : ${new Date().toLocaleDateString(
      "fr-FR"
    )}\n\n${namesText}`;

    navigator.clipboard.writeText(fullExport);
    setCopiedSuccess(`${filteredStudents.length} étudiants (noms & ID) copiés avec succès !`);
    setTimeout(() => setCopiedSuccess(null), 3500);
  };

  // Exporter la liste actuelle en fichier CSV (Noms et ID uniquement)
  const handleExportCSV = () => {
    if (filteredStudents.length === 0) return;

    const headers = ["N°", "Nom Complet", "ID / Matricule", "Niveau", "Filière", "Statut"];
    const rows = filteredStudents.map((s, idx) => [
      `"${idx + 1}"`,
      `"${s.full_name}"`,
      `"${s.matricule}"`,
      `"${s.niveau}"`,
      `"${s.filiere}"`,
      `"${s.statut_inscription}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `HAS_Etudiants_${selectedNiveau}_${selectedFiliere}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Supprimer un étudiant
  const handleDeleteStudent = (id: string, email: string) => {
    deleteStudent(id, email);
    setStudents((prev) => prev.filter((s) => s.id !== id && s.email.toLowerCase() !== email.toLowerCase()));
    setDeleteConfirmId(null);
    setNotification({
      type: "success",
      message: "L'étudiant a été retiré de la liste avec succès.",
    });
    setTimeout(() => setNotification(null), 4000);
  };

  // Ouvrir modal d'ajout ou modification
  const handleOpenCreateModal = (student?: StudentItem) => {
    if (student) {
      setEditingStudent(student);
      setFormName(student.full_name);
      setFormEmail(student.email);
      setFormPhone(student.phone || "");
      setFormNiveau(student.niveau);
      setFormFiliere(student.filiere);
    } else {
      setEditingStudent(null);
      setFormName("");
      setFormEmail("");
      setFormPhone("");
      setFormNiveau(selectedNiveau);
      setFormFiliere(selectedFiliere === "ALL" ? "MPI" : selectedFiliere);
    }
    setCreateModalOpen(true);
  };

  // Enregistrer nouvel étudiant ou modifier existant
  const handleSaveStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const classeObj = MOCK_CLASSES.find(
      (c) => c.niveau === formNiveau && c.code.toUpperCase().includes(formFiliere)
    );
    const filiereObj = MOCK_FILIERES.find((f) => f.code === formFiliere);

    if (editingStudent) {
      // Modification
      const updatedProfile: Profile = {
        id: editingStudent.id,
        email: formEmail.trim(),
        username: formEmail.split("@")[0].toLowerCase(),
        full_name: formName.trim(),
        role: "etudiant",
        phone: formPhone.trim() || null,
        matricule: editingStudent.matricule,
        filiere_id: filiereObj?.id || null,
        classe_id: classeObj?.id || `${formNiveau.toLowerCase()}-${formFiliere.toLowerCase()}`,
        bio: `Étudiant en Licence ${formNiveau} ${formFiliere}`,
        specialite: formFiliere,
        avatar_url: editingStudent.avatar_url || null,
        is_active: true,
        created_at: editingStudent.created_at,
        updated_at: new Date().toISOString(),
        classe: classeObj,
        filiere: filiereObj,
      };

      saveStudent(updatedProfile);
      setNotification({
        type: "success",
        message: `Fiche de ${formName} mise à jour avec succès.`,
      });
    } else {
      // Création d'un nouvel étudiant
      const maxNum = students.reduce((acc, curr) => {
        const num = parseInt(curr.matricule.replace(/\D/g, "") || "0", 10);
        return Math.max(acc, isNaN(num) ? 0 : num);
      }, 0);
      const nextMatricule = `ETU${String(maxNum + 1).padStart(3, "0")}`;

      const newProfile: Profile = {
        id: `stu-${Date.now()}`,
        email: formEmail.trim(),
        username: formEmail.split("@")[0].toLowerCase(),
        full_name: formName.trim(),
        role: "etudiant",
        phone: formPhone.trim() || null,
        matricule: nextMatricule,
        filiere_id: filiereObj?.id || null,
        classe_id: classeObj?.id || `${formNiveau.toLowerCase()}-${formFiliere.toLowerCase()}`,
        bio: `Étudiant inscrit à HAS en Licence ${formNiveau} — Filière ${formFiliere}.`,
        specialite: formFiliere,
        avatar_url: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        classe: classeObj,
        filiere: filiereObj,
      };

      saveStudent(newProfile);
      setNotification({
        type: "success",
        message: `L'étudiant ${formName} a été ajouté dans la liste ${formNiveau} ${formFiliere} (Matricule: ${nextMatricule}).`,
      });
    }

    setCreateModalOpen(false);
    loadAllStudents();
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-7 pb-16">
        {/* En-tête principal de la page */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-[#263241] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#0f2744] dark:bg-[#e0521c] text-white flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                  Liste Officielle des Étudiants
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-0.5">
                  Consultation des promotions par Licence (L1 & L2) et par filière (MPI, SML, MIASS) avec émargement.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadAllStudents()}
              disabled={isLoading}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />}
              className="text-xs"
            >
              Actualiser
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyFullNames(true)}
              disabled={filteredStudents.length === 0}
              leftIcon={<Copy className="w-3.5 h-3.5 text-blue-600 dark:text-cyan-400" />}
              className="text-xs font-semibold"
            >
              Copier les Noms
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPrintModalOpen(true)}
              disabled={filteredStudents.length === 0}
              leftIcon={<Printer className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />}
              className="text-xs"
            >
              Imprimer Feuille d'émargement
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={filteredStudents.length === 0}
              leftIcon={<FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
              className="text-xs"
            >
              Exporter CSV
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleOpenCreateModal()}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs shadow-sm bg-[#0f2744] hover:bg-[#1a3a60] dark:bg-[#e0521c] dark:hover:bg-[#c94514] text-white"
            >
              Ajouter un étudiant
            </Button>
          </div>
        </div>

        {/* Notifications & Confirmations */}
        {copiedSuccess && (
          <div className="p-3.5 bg-blue-50 dark:bg-cyan-950/40 border border-blue-200 dark:border-cyan-800 rounded-xl flex items-center justify-between text-xs sm:text-sm text-blue-900 dark:text-cyan-200 animate-fadeIn">
            <div className="flex items-center gap-2 font-medium">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{copiedSuccess}</span>
            </div>
            <button onClick={() => setCopiedSuccess(null)} className="text-blue-500 hover:text-blue-700 dark:hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {notification && (
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs sm:text-sm ${
              notification.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200"
            }`}
          >
            <div className="flex items-center gap-2 font-medium">
              {notification.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{notification.message}</span>
            </div>
            <button onClick={() => setNotification(null)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ========================================================================= */}
        {/* GRANDE SÉLECTION DU NIVEAU : NB, L1 VS L2                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* CARTE NOUVEAUX BACHELIERS (NB) */}
          <button
            onClick={() => setSelectedNiveau("NB")}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
              selectedNiveau === "NB"
                ? "bg-white dark:bg-[#111821] border-[#0f2744] dark:border-[#e0521c] ring-2 ring-[#0f2744]/20 dark:ring-[#e0521c]/30 shadow-md"
                : "bg-white/60 dark:bg-[#111821]/60 border-slate-200 dark:border-[#263241] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-[#111821]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold transition-colors ${
                    selectedNiveau === "NB"
                      ? "bg-emerald-600 text-white dark:bg-emerald-700"
                      : "bg-slate-100 text-slate-700 dark:bg-[#182330] dark:text-[#AAB4C0]"
                  }`}
                >
                  NB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                      Nouveaux Bacheliers (NB)
                    </span>
                    {selectedNiveau === "NB" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-0.5">
                    Nouvelle cohorte entrante — MPI, SML &amp; MIASS
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif text-2xl font-black text-slate-900 dark:text-[#F5F7FA]">
                  {stats.nb.total}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-[#AAB4C0] uppercase font-bold tracking-wider">
                  Étudiants
                </span>
              </div>
            </div>

            {/* Répartition par filière NB */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-600 dark:text-[#AAB4C0]">
                <span className="flex items-center gap-1 font-semibold text-blue-700 dark:text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> MPI : {stats.nb.mpi}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> SML : {stats.nb.sml}
                </span>
                <span className="flex items-center gap-1 font-semibold text-purple-700 dark:text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> MIASS : {stats.nb.miass}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#0f2744] dark:group-hover:text-[#e0521c] transition-colors flex items-center gap-1">
                Afficher <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>

          {/* CARTE LICENCE 1 (L1) */}
          <button
            onClick={() => setSelectedNiveau("L1")}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
              selectedNiveau === "L1"
                ? "bg-white dark:bg-[#111821] border-[#0f2744] dark:border-[#e0521c] ring-2 ring-[#0f2744]/20 dark:ring-[#e0521c]/30 shadow-md"
                : "bg-white/60 dark:bg-[#111821]/60 border-slate-200 dark:border-[#263241] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-[#111821]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold transition-colors ${
                    selectedNiveau === "L1"
                      ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                      : "bg-slate-100 text-slate-700 dark:bg-[#182330] dark:text-[#AAB4C0]"
                  }`}
                >
                  L1
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                      Licence 1 (L1)
                    </span>
                    {selectedNiveau === "L1" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0f2744] text-white dark:bg-[#e0521c]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-0.5">
                    Première année universitaire — Promotions MPI, SML & MIASS
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif text-2xl font-black text-slate-900 dark:text-[#F5F7FA]">
                  {stats.l1.total}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-[#AAB4C0] uppercase font-bold tracking-wider">
                  Étudiants
                </span>
              </div>
            </div>

            {/* Répartition par filière L1 */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-600 dark:text-[#AAB4C0]">
                <span className="flex items-center gap-1 font-semibold text-blue-700 dark:text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> MPI : {stats.l1.mpi}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> SML : {stats.l1.sml}
                </span>
                <span className="flex items-center gap-1 font-semibold text-purple-700 dark:text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> MIASS : {stats.l1.miass}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#0f2744] dark:group-hover:text-[#e0521c] transition-colors flex items-center gap-1">
                Afficher <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>

          {/* CARTE LICENCE 2 (L2) */}
          <button
            onClick={() => setSelectedNiveau("L2")}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
              selectedNiveau === "L2"
                ? "bg-white dark:bg-[#111821] border-[#0f2744] dark:border-[#e0521c] ring-2 ring-[#0f2744]/20 dark:ring-[#e0521c]/30 shadow-md"
                : "bg-white/60 dark:bg-[#111821]/60 border-slate-200 dark:border-[#263241] hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-[#111821]"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-serif text-lg font-bold transition-colors ${
                    selectedNiveau === "L2"
                      ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                      : "bg-slate-100 text-slate-700 dark:bg-[#182330] dark:text-[#AAB4C0]"
                  }`}
                >
                  L2
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                      Licence 2 (L2)
                    </span>
                    {selectedNiveau === "L2" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#0f2744] text-white dark:bg-[#e0521c]">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-0.5">
                    Deuxième année universitaire — Spécialisation et approfondissement
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="font-serif text-2xl font-black text-slate-900 dark:text-[#F5F7FA]">
                  {stats.l2.total}
                </span>
                <span className="block text-[10px] text-slate-500 dark:text-[#AAB4C0] uppercase font-bold tracking-wider">
                  Étudiants
                </span>
              </div>
            </div>

            {/* Répartition par filière L2 */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-600 dark:text-[#AAB4C0]">
                <span className="flex items-center gap-1 font-semibold text-blue-700 dark:text-cyan-400">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> MPI : {stats.l2.mpi}
                </span>
                <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> SML : {stats.l2.sml}
                </span>
                <span className="flex items-center gap-1 font-semibold text-purple-700 dark:text-purple-400">
                  <span className="w-2 h-2 rounded-full bg-purple-600"></span> MIASS : {stats.l2.miass}
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-[#0f2744] dark:group-hover:text-[#e0521c] transition-colors flex items-center gap-1">
                Afficher <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </button>
        </div>

        {/* ========================================================================= */}
        {/* SOUS-NAVIGATION DES FILIÈRES POUR LA LICENCE SÉLECTIONNÉE                   */}
        {/* Demandé expressément : Liste Complète, Liste MPI, Liste SML, Liste MIASS */}
        {/* ========================================================================= */}
        <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#0f2744] dark:text-[#e0521c]">
                  PROMOTION {selectedNiveau === "L1" ? "LICENCE 1 (L1)" : "LICENCE 2 (L2)"}
                </span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span className="text-xs text-slate-500 dark:text-[#AAB4C0]">
                  {filteredStudents.length} étudiant(s) affiché(s)
                </span>
              </div>
              <h2 className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA] mt-0.5">
                {selectedFiliere === "ALL" && `Liste Complète — ${selectedNiveau}`}
                {selectedFiliere === "MPI" && `Liste MPI (Mathématiques Physique et Informatique) — ${selectedNiveau}`}
                {selectedFiliere === "SML" && `Liste SML (Science de la Mer et du Littoral) — ${selectedNiveau}`}
                {selectedFiliere === "MIASS" && `Liste MIASS (Math. & Info. Appliquées aux Sc. Sociales) — ${selectedNiveau}`}
              </h2>
            </div>

            {/* Onglets de filière */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#182330] rounded-xl border border-slate-200/80 dark:border-[#263241]">
              {/* LISTE COMPLÈTE */}
              <button
                onClick={() => setSelectedFiliere("ALL")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedFiliere === "ALL"
                    ? "bg-[#0f2744] text-white shadow-xs dark:bg-[#e0521c]"
                    : "text-slate-700 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Liste Complète</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    selectedFiliere === "ALL"
                      ? "bg-white/20 text-white"
                      : "bg-slate-200 text-slate-700 dark:bg-[#263241] dark:text-slate-300"
                  }`}
                >
                  {selectedNiveau === "L1" ? stats.l1.total : stats.l2.total}
                </span>
              </button>

              {/* LISTE MPI */}
              <button
                onClick={() => setSelectedFiliere("MPI")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedFiliere === "MPI"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-[#AAB4C0] hover:text-blue-600 dark:hover:text-cyan-400"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                <span>Liste MPI</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    selectedFiliere === "MPI"
                      ? "bg-white/20 text-white"
                      : "bg-blue-100 text-blue-700 dark:bg-cyan-950/50 dark:text-cyan-300"
                  }`}
                >
                  {selectedNiveau === "L1" ? stats.l1.mpi : stats.l2.mpi}
                </span>
              </button>

              {/* LISTE SML */}
              <button
                onClick={() => setSelectedFiliere("SML")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedFiliere === "SML"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-[#AAB4C0] hover:text-emerald-600 dark:hover:text-emerald-400"
                }`}
              >
                <Building className="w-3.5 h-3.5" />
                <span>Liste SML</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    selectedFiliere === "SML"
                      ? "bg-white/20 text-white"
                      : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                  }`}
                >
                  {selectedNiveau === "L1" ? stats.l1.sml : stats.l2.sml}
                </span>
              </button>

              {/* LISTE MIASS */}
              <button
                onClick={() => setSelectedFiliere("MIASS")}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedFiliere === "MIASS"
                    ? "bg-purple-600 text-white shadow-xs"
                    : "text-slate-700 dark:text-[#AAB4C0] hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Liste MIASS</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    selectedFiliere === "MIASS"
                      ? "bg-white/20 text-white"
                      : "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                  }`}
                >
                  {selectedNiveau === "L1" ? stats.l1.miass : stats.l2.miass}
                </span>
              </button>
            </div>
          </div>

          {/* Barre d'outils : Recherche, Tri & Bascule Vue */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-[#263241]">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom complet ou ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-8 text-xs py-2 bg-slate-50 dark:bg-[#151D27] border-slate-200 dark:border-[#263241]"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Tri */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-2.5 py-1.5 bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] rounded-lg text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                >
                  <option value="name-asc">Nom complet (A → Z)</option>
                  <option value="name-desc">Nom complet (Z → A)</option>
                  <option value="matricule">Par Matricule</option>
                  <option value="recent">Plus récents</option>
                </select>
              </div>

              {/* Mode Table vs Cartes */}
              <div className="flex items-center bg-slate-100 dark:bg-[#182330] p-0.5 rounded-lg border border-slate-200 dark:border-[#263241]">
                <button
                  onClick={() => setViewMode("table")}
                  title="Vue Tableau (Émargement)"
                  className={`p-1.5 rounded text-xs font-medium transition-colors ${
                    viewMode === "table"
                      ? "bg-white dark:bg-[#111821] text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[11px] font-bold px-1">Tableau</span>
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  title="Vue Cartes"
                  className={`p-1.5 rounded text-xs font-medium transition-colors ${
                    viewMode === "grid"
                      ? "bg-white dark:bg-[#111821] text-slate-900 dark:text-white shadow-xs"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                  }`}
                >
                  <span className="text-[11px] font-bold px-1">Cartes</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CONTENU : LISTE DES ÉTUDIANTS (NOM COMPLET MIS EN AVANT)                   */}
        {/* ========================================================================= */}
        {isLoading ? (
          <div className="p-12 text-center bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241]">
            <RefreshCw className="w-8 h-8 animate-spin text-[#0f2744] dark:text-[#e0521c] mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-[#AAB4C0]">
              Chargement des listes officielles...
            </p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] space-y-3">
            <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-[#182330] flex items-center justify-center mx-auto text-slate-400">
              <Users className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
              Aucun étudiant trouvé
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] max-w-md mx-auto">
              {search
                ? `Aucun résultat pour la recherche "${search}". Vérifiez l'orthographe.`
                : `Aucun étudiant n'est encore enregistré pour la promotion ${selectedNiveau} — ${selectedFiliere}.`}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleOpenCreateModal()}
                leftIcon={<Plus className="w-4 h-4" />}
                className="text-xs"
              >
                Inscrire un étudiant dans cette classe
              </Button>
            </div>
          </div>
        ) : viewMode === "table" ? (
          /* ======================================================================= */
          /* VUE TABLEAU (STYLE FEUILLE D'ÉMARGEMENT ADMINISTRATIVE)                  */
          /* ======================================================================= */
          <div className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/90 dark:bg-[#151D27] border-b border-slate-200 dark:border-[#263241] text-slate-600 dark:text-[#AAB4C0] font-bold">
                    <th className="py-3.5 px-4 w-12 text-center">N°</th>
                    <th className="py-3.5 px-4 min-w-[240px]">
                      Nom Complet de l'Étudiant
                    </th>
                    <th className="py-3.5 px-4 w-36">Identifiant (ID)</th>
                    <th className="py-3.5 px-4 w-44">Filière & Promotion</th>
                    <th className="py-3.5 px-4 w-28 text-center">Statut</th>
                    <th className="py-3.5 px-4 w-28 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                  {filteredStudents.map((st, idx) => {
                    const filMeta = FILIERE_META[st.filiere];
                    const initials = st.full_name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase();

                    return (
                      <tr
                        key={st.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-[#182330]/50 transition-colors group"
                      >
                        {/* N° */}
                        <td className="py-3 px-4 text-center text-xs font-mono font-bold text-slate-400">
                          {String(idx + 1).padStart(2, "0")}
                        </td>

                        {/* NOM COMPLET DE L'ÉTUDIANT */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-[#1a2533] border border-slate-200 dark:border-[#263241] flex items-center justify-center font-bold text-xs text-[#0f2744] dark:text-[#F5F7FA] shrink-0">
                              {initials}
                            </div>
                            <div>
                              <span
                                className="font-serif text-sm sm:text-base font-bold text-slate-900 dark:text-[#F5F7FA] block leading-tight hover:text-[#0f2744] dark:hover:text-[#e0521c] transition-colors cursor-pointer"
                                onClick={() => setStudentDetailsModal(st)}
                              >
                                {st.full_name}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* IDENTIFIANT (ID / MATRICULE) */}
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#263241]">
                            {st.matricule}
                          </span>
                        </td>

                        {/* FILIÈRE & PROMOTION */}
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.8 rounded-md text-xs font-bold border ${filMeta.color}`}
                          >
                            {filMeta.icon}
                            <span>{st.filiere}</span>
                            <span className="opacity-60">• {st.niveau}</span>
                          </span>
                        </td>

                        {/* STATUT */}
                        <td className="py-3 px-4 text-center">
                          {st.statut_inscription === "valide" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Validé
                            </span>
                          ) : st.statut_inscription === "refuse" ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800">
                              Refusé
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800">
                              En attente
                            </span>
                          )}
                        </td>

                        {/* ACTIONS */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setStudentDetailsModal(st)}
                              title="Voir détails"
                              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#182330] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleOpenCreateModal(st)}
                              title="Modifier la filière ou les infos"
                              className="p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#182330] text-slate-500 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(st.id)}
                              title="Retirer cet étudiant"
                              className="p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 transition-colors"
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

            {/* Pied de tableau récapitulatif */}
            <div className="p-3 bg-slate-50/70 dark:bg-[#151D27] border-t border-slate-200 dark:border-[#263241] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-[#AAB4C0] gap-2">
              <span className="font-medium">
                Total de cette liste : <strong className="text-slate-900 dark:text-white font-bold">{filteredStudents.length}</strong> étudiant(s) en {selectedNiveau} ({selectedFiliere === "ALL" ? "Toutes filières confondues" : selectedFiliere})
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyFullNames(true)}
                  leftIcon={<Copy className="w-3 h-3" />}
                  className="text-xs h-7"
                >
                  Copier ces noms
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExportCSV}
                  leftIcon={<Download className="w-3 h-3" />}
                  className="text-xs h-7"
                >
                  Télécharger CSV
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================================= */
          /* VUE CARTES ÉTUDIANTES (MODERNE ET VISUELLE)                             */
          /* ======================================================================= */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStudents.map((st, idx) => {
              const filMeta = FILIERE_META[st.filiere];
              const initials = st.full_name
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase();

              return (
                <div
                  key={st.id}
                  className="bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] p-5 shadow-xs hover:border-[#0f2744]/40 dark:hover:border-[#e0521c]/40 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div>
                    {/* Header carte */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-[#182330] border border-slate-200 dark:border-[#263241] flex items-center justify-center font-bold text-sm text-[#0f2744] dark:text-[#F5F7FA]">
                          {initials}
                        </div>
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block font-bold">
                            N° {String(idx + 1).padStart(2, "0")} • {st.matricule}
                          </span>
                          <h3
                            onClick={() => setStudentDetailsModal(st)}
                            className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA] leading-tight hover:text-[#0f2744] dark:hover:text-[#e0521c] cursor-pointer transition-colors"
                          >
                            {st.full_name}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold border ${filMeta.color}`}
                      >
                        {st.filiere}
                      </span>
                    </div>

                    {/* Informations détaillées (Nom, ID et classe uniquement - pas de mail) */}
                    <div className="mt-4 space-y-2.5 text-xs text-slate-600 dark:text-[#AAB4C0]">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-[#151D27] border border-slate-100 dark:border-[#263241]">
                        <span className="text-[11px] font-bold text-slate-400">Identifiant (ID)</span>
                        <span className="font-mono font-bold text-slate-900 dark:text-white">{st.matricule}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>Licence {st.niveau === "L1" ? "1" : "2"} — {filMeta.nom}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions carte */}
                  <div className="pt-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Inscrit le {new Date(st.created_at).toLocaleDateString("fr-FR")}
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setStudentDetailsModal(st)}
                        className="text-xs h-7 px-2"
                      >
                        Fiche
                      </Button>
                      <button
                        onClick={() => handleOpenCreateModal(st)}
                        className="p-1.5 rounded text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400"
                        title="Modifier"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(st.id)}
                        className="p-1.5 rounded text-slate-400 hover:text-red-600"
                        title="Supprimer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL : FEUILLE D'ÉMARGEMENT OFFICIELLE PRÊTE POUR IMPRESSION             */}
        {/* ========================================================================= */}
        {printModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-[#263241] shadow-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-[#263241]">
                <div>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    Feuille d'Émargement Officielle
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aperçu avant impression pour examens, cours et réunions académiques.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => window.print()}
                    leftIcon={<Printer className="w-4 h-4" />}
                    className="text-xs bg-[#0f2744] text-white"
                  >
                    Imprimer Maintenant
                  </Button>
                  <button
                    onClick={() => setPrintModalOpen(false)}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Document à imprimer */}
              <div className="p-6 border border-slate-300 dark:border-slate-700 rounded-xl bg-white text-slate-900 space-y-6 print:border-none print:p-0">
                {/* En-tête HAS */}
                <div className="text-center border-b pb-4 border-slate-300">
                  <h2 className="text-xl font-bold tracking-wider font-serif uppercase text-[#0f2744]">
                    HALIL ACADÉMIE SCIENTIFIQUE (HAS)
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 uppercase tracking-widest mt-0.5">
                    Direction des Études et des Examens
                  </p>
                  <div className="mt-3 inline-block px-4 py-1.5 bg-slate-100 rounded-lg border border-slate-300 text-xs font-bold uppercase">
                    FEUILLE D'ÉMARGEMENT — {selectedNiveau === "L1" ? "LICENCE 1 (L1)" : "LICENCE 2 (L2)"} — {selectedFiliere === "ALL" ? "TOUTES FILIÈRES" : selectedFiliere}
                  </div>
                  <div className="mt-2 text-xs text-slate-500 flex justify-center gap-6">
                    <span>Date : ____________________</span>
                    <span>Matière : ____________________</span>
                    <span>Enseignant : ____________________</span>
                  </div>
                </div>

                {/* Tableau émargement (ID et Nom complet uniquement) */}
                <table className="w-full text-left border-collapse text-xs border border-slate-300">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 font-bold">
                      <th className="py-2 px-3 border-r border-slate-300 w-10 text-center">N°</th>
                      <th className="py-2 px-3 border-r border-slate-300 w-32">Identifiant (ID)</th>
                      <th className="py-2 px-3 border-r border-slate-300">Nom Complet</th>
                      <th className="py-2 px-3 border-r border-slate-300 w-24 text-center">Filière</th>
                      <th className="py-2 px-3 w-48 text-center">Signature / Présence</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredStudents.map((s, idx) => (
                      <tr key={s.id} className="h-8">
                        <td className="py-1 px-3 border-r border-slate-300 text-center font-mono font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-1 px-3 border-r border-slate-300 font-mono font-bold">
                          {s.matricule}
                        </td>
                        <td className="py-1 px-3 border-r border-slate-300 font-bold">
                          {s.full_name}
                        </td>
                        <td className="py-1 px-3 border-r border-slate-300 text-center font-bold">
                          {s.filiere}
                        </td>
                        <td className="py-1 px-3 text-center border-slate-300"></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Bas de page officiel */}
                <div className="pt-4 flex justify-between text-xs text-slate-600 font-medium border-t border-slate-300">
                  <span>Effectif total : {filteredStudents.length} étudiants</span>
                  <span>Signature du Responsable Pédagogique : ____________________</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL : FICHE DÉTAILLÉE D'UN ÉTUDIANT                                      */}
        {/* ========================================================================= */}
        {studentDetailsModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-lg w-full border border-slate-200 dark:border-[#263241] shadow-2xl p-6 space-y-6">
              <div className="flex items-center justify-between border-b pb-4 border-slate-200 dark:border-[#263241]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0f2744] text-white flex items-center justify-center font-bold text-base">
                    {studentDetailsModal.full_name
                      .split(" ")
                      .map((p) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider">
                      Fiche Étudiant • {studentDetailsModal.matricule}
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                      {studentDetailsModal.full_name}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setStudentDetailsModal(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 dark:bg-[#151D27] rounded-xl border border-slate-200 dark:border-[#263241]">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Niveau d'études</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      Licence {studentDetailsModal.niveau === "L1" ? "1 (L1)" : "2 (L2)"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Filière assignée</span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {studentDetailsModal.filiere} ({studentDetailsModal.filiere_nom})
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Identifiant (ID)</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white block">
                      {studentDetailsModal.matricule}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Statut du compte</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {studentDetailsModal.statut_inscription === "valide" ? "Validé & Actif" : studentDetailsModal.statut_inscription}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[11px] text-slate-400 block font-medium">Date d'inscription</span>
                    <span className="text-slate-700 dark:text-slate-300">
                      {new Date(studentDetailsModal.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full text-xs bg-[#0f2744] text-white"
                    onClick={() => {
                      setStudentDetailsModal(null);
                      handleOpenCreateModal(studentDetailsModal);
                    }}
                    leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                  >
                    Modifier la filière ou licence
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs text-red-600 border-red-200 dark:border-red-800 hover:bg-red-50"
                    onClick={() => {
                      const id = studentDetailsModal.id;
                      const em = studentDetailsModal.email;
                      setStudentDetailsModal(null);
                      handleDeleteStudent(id, em);
                    }}
                    leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                  >
                    Retirer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL : AJOUTER OU MODIFIER UN ÉTUDIANT                                   */}
        {/* ========================================================================= */}
        {createModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-md w-full border border-slate-200 dark:border-[#263241] shadow-2xl p-6 space-y-5">
              <div className="flex items-center justify-between border-b pb-3 border-slate-200 dark:border-[#263241]">
                <h3 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                  {editingStudent ? "Modifier l'Étudiant" : "Inscrire un Nouvel Étudiant"}
                </h3>
                <button
                  onClick={() => setCreateModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveStudentSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#AAB4C0] mb-1">
                    Nom Complet de l'Étudiant *
                  </label>
                  <Input
                    type="text"
                    required
                    placeholder="ex: Cheikh Anta Diop"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#AAB4C0] mb-1">
                    Adresse Email *
                  </label>
                  <Input
                    type="email"
                    required
                    placeholder="etudiant@halil-academie.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#AAB4C0] mb-1">
                    Numéro de Téléphone (WhatsApp)
                  </label>
                  <Input
                    type="text"
                    placeholder="+221 77 000 00 00"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="text-xs"
                  />
                </div>

                {/* SÉLECTION NIVEAU */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#AAB4C0] mb-1">
                    Niveau / Promotion *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormNiveau("NB")}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        formNiveau === "NB"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      NB (Bacheliers)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormNiveau("L1")}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        formNiveau === "L1"
                          ? "bg-[#0f2744] text-white border-[#0f2744] dark:bg-[#e0521c] dark:border-[#e0521c]"
                          : "bg-slate-50 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      Licence 1 (L1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormNiveau("L2")}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        formNiveau === "L2"
                          ? "bg-[#0f2744] text-white border-[#0f2744] dark:bg-[#e0521c] dark:border-[#e0521c]"
                          : "bg-slate-50 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      Licence 2 (L2)
                    </button>
                  </div>
                </div>

                {/* SÉLECTION FILIÈRE */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-[#AAB4C0] mb-1">
                    Filière Officielle *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setFormFiliere("MPI")}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        formFiliere === "MPI"
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-slate-50 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      MPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormFiliere("SML")}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        formFiliere === "SML"
                          ? "bg-emerald-600 text-white border-emerald-600"
                          : "bg-slate-50 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      SML
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormFiliere("MIASS")}
                      className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                        formFiliere === "MIASS"
                          ? "bg-purple-600 text-white border-purple-600"
                          : "bg-slate-50 dark:bg-[#182330] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#263241]"
                      }`}
                    >
                      MIASS
                    </button>
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-[#263241]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCreateModalOpen(false)}
                    className="text-xs"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="text-xs bg-[#0f2744] dark:bg-[#e0521c] text-white"
                  >
                    {editingStudent ? "Enregistrer les modifications" : "Inscrire l'étudiant"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* MODAL DE CONFIRMATION DE SUPPRESSION                                     */}
        {/* ========================================================================= */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-2xl max-w-sm w-full border border-slate-200 dark:border-[#263241] shadow-2xl p-6 space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 mx-auto flex items-center justify-center">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  Confirmer le retrait
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Êtes-vous sûr de vouloir retirer cet étudiant de la liste officielle ?
                </p>
              </div>
              <div className="flex items-center gap-2 justify-center pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteConfirmId(null)}
                  className="text-xs"
                >
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const target = students.find((s) => s.id === deleteConfirmId);
                    if (target) handleDeleteStudent(target.id, target.email);
                  }}
                  className="text-xs bg-red-600 hover:bg-red-700 text-white"
                >
                  Confirmer le retrait
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
