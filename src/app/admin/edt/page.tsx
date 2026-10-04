"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  Clock,
  Video,
  Plus,
  Trash2,
  Edit2,
  User,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Copy,
  ExternalLink,
  X,
  Save,
  Download,
  Upload,
  AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Classe, Matiere, Professeur, SeanceEDT, JourSemaine, EmploiDuTemps } from "@/lib/types";
import {
  getStoredClasses,
  getStoredMatieres,
  getStoredProfesseurs,
  getStoredSeancesEDT,
  saveSeanceEDT,
  deleteSeanceEDT,
  generateMeetLink,
  getStoredEDTs,
  saveEDT,
  deleteEDT,
} from "@/lib/academicStorage";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

export default function AdminEDTPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [edts, setEdts] = useState<EmploiDuTemps[]>([]);

  const [selectedClasseId, setSelectedClasseId] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Modal Séance
  const [seanceModalOpen, setSeanceModalOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<SeanceEDT | null>(null);
  const [deleteConfirmSeance, setDeleteConfirmSeance] = useState<string | null>(null);

  // Form Séance
  const [formJour, setFormJour] = useState<JourSemaine>("Lundi");
  const [formHeureDebut, setFormHeureDebut] = useState("08:30");
  const [formHeureFin, setFormHeureFin] = useState("10:30");
  const [formType, setFormType] = useState<"CM" | "TD" | "TP">("CM");
  const [formProfId, setFormProfId] = useState("");
  const [formMatiereId, setFormMatiereId] = useState("");
  const [formMeetUrl, setFormMeetUrl] = useState("");

  // Modal PDF optionnel
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [formPdfTitle, setFormPdfTitle] = useState("");
  const [formPdfSemestre, setFormPdfSemestre] = useState("Semestre 1");
  const [formPdfFile, setFormPdfFile] = useState<File | null>(null);

  const reloadData = () => {
    const cList = getStoredClasses();
    const mList = getStoredMatieres();
    const pList = getStoredProfesseurs();
    const sList = getStoredSeancesEDT();
    const eList = getStoredEDTs();

    setClasses(cList);
    setMatieres(mList);
    setProfs(pList);
    setSeances(sList);
    setEdts(eList);

    if (!selectedClasseId && cList.length > 0) {
      setSelectedClasseId(cList[0].id);
    }
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const activeClasse = classes.find((c) => c.id === selectedClasseId) || classes[0];

  // Séances de la classe active pour la semaine en cours
  const classeSeances = useMemo(() => {
    if (!activeClasse) return [];
    return seances.filter((s) => s.classe_id === activeClasse.id);
  }, [seances, activeClasse]);

  // Enseignant sélectionné dans le formulaire
  const currentFormProf = profs.find((p) => p.id === formProfId) || profs[0];

  // Matières filtrées pour la classe et le prof dans le formulaire
  const availableMatieresForForm = useMemo(() => {
    if (!currentFormProf || !activeClasse) return matieres;
    const targetClassCode = activeClasse.code.replace("-", " ").toUpperCase();
    const targetNiveau = activeClasse.niveau.toUpperCase();

    const matches = matieres.filter((m) => {
      return currentFormProf.matieres?.some((pm) => {
        const isSameMatiere =
          pm.code?.toUpperCase() === m.code.toUpperCase() ||
          String(pm.id) === String(m.id) ||
          pm.nom.toLowerCase() === m.name.toLowerCase();
        const isForClass =
          pm.classes?.some((c) => c.replace("-", " ").toUpperCase() === targetClassCode) ||
          pm.niveau?.toUpperCase() === targetNiveau;
        return isSameMatiere && (isForClass || !pm.classes || pm.classes.length === 0);
      });
    });

    return matches.length > 0 ? matches : matieres;
  }, [currentFormProf, activeClasse, matieres]);

  useEffect(() => {
    if (availableMatieresForForm.length > 0 && !availableMatieresForForm.some((m) => m.id === formMatiereId)) {
      setFormMatiereId(availableMatieresForForm[0].id);
    }
  }, [availableMatieresForForm, formMatiereId]);

  const openAddSeanceModal = (prefillJour?: JourSemaine, prefillDebut?: string, prefillFin?: string) => {
    setEditingSeance(null);
    setFormJour(prefillJour || "Lundi");
    setFormHeureDebut(prefillDebut || "08:30");
    setFormHeureFin(prefillFin || "10:30");
    setFormType("CM");
    const defaultProf = profs[0]?.id || "";
    setFormProfId(defaultProf);
    setFormMeetUrl("");
    setSeanceModalOpen(true);
  };

  const openEditSeanceModal = (s: SeanceEDT) => {
    setEditingSeance(s);
    setFormJour(s.jour);
    setFormHeureDebut(s.heure_debut);
    setFormHeureFin(s.heure_fin);
    setFormType(s.type_seance || "CM");
    setFormProfId(s.professeur_id || profs[0]?.id || "");
    const matchingMat = matieres.find((m) => m.code === s.matiere_code || m.name === s.matiere_nom);
    setFormMatiereId(matchingMat?.id || matieres[0]?.id || "");
    setFormMeetUrl(s.meet_url || "");
    setSeanceModalOpen(true);
  };

  const handleGenerateMeet = () => {
    const newMeet = generateMeetLink();
    setFormMeetUrl(newMeet);
  };

  const handleCopyMeet = (url: string) => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(url);
      setTimeout(() => setCopiedLink(null), 2500);
    }
  };

  const handleSubmitSeance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClasse) return;

    const prof = profs.find((p) => p.id === formProfId) || profs[0];
    const matiere = matieres.find((m) => m.id === formMatiereId) || availableMatieresForForm[0];

    const newSeance: SeanceEDT = {
      id: editingSeance ? editingSeance.id : `seance-${Date.now()}`,
      classe_id: activeClasse.id,
      jour: formJour,
      heure_debut: formHeureDebut,
      heure_fin: formHeureFin,
      matiere_nom: matiere?.name || "Matière académique",
      matiere_code: matiere?.code || "MAT",
      professeur_nom: prof?.full_name || "Enseignant HAS",
      professeur_id: prof?.id,
      meet_url: formMeetUrl.trim() || null,
      type_seance: formType,
      semaine: "Semaine en cours",
      created_at: new Date().toISOString(),
    };

    saveSeanceEDT(newSeance);
    reloadData();
    setSeanceModalOpen(false);
    setSuccessMsg(
      editingSeance
        ? `Le créneau ${newSeance.matiere_code} du ${newSeance.jour} a été modifié.`
        : `Le cours de ${newSeance.matiere_code} (${newSeance.jour} ${newSeance.heure_debut}-${newSeance.heure_fin}) a été ajouté en temps réel.`
    );
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDeleteSeance = (id: string) => {
    deleteSeanceEDT(id);
    reloadData();
    setDeleteConfirmSeance(null);
    setSuccessMsg("Le créneau de cours a été retiré de l'emploi du temps.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCreatePdfEDT = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClasse) return;
    const title = formPdfTitle.trim() || `Emploi du Temps Hebdomadaire — ${activeClasse.code}`;
    const newEDT: EmploiDuTemps = {
      id: `edt-${Date.now()}`,
      classe_id: activeClasse.id,
      title,
      semestre: formPdfSemestre,
      annee_universitaire: "2024-2025",
      file_url: formPdfFile ? URL.createObjectURL(formPdfFile) : `/documents/EDT_${activeClasse.code}.pdf`,
      file_name: formPdfFile ? formPdfFile.name : `EDT_${activeClasse.code}_HAS.pdf`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      classe: activeClasse,
    };
    saveEDT(newEDT);
    reloadData();
    setPdfModalOpen(false);
    setFormPdfTitle("");
    setFormPdfFile(null);
    setSuccessMsg(`L'emploi du temps officiel PDF de ${activeClasse.code} a été publié.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">
                Planning &amp; Séances en Direct
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Temps Réel
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Emploi du Temps Hebdomadaire
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Tableau interactif des semaines en cours avec générateur Google Meet instantané
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPdfModalOpen(true)}
              leftIcon={<Upload className="w-4 h-4" />}
              className="text-xs font-semibold"
            >
              Attacher un document PDF
            </Button>
            <Button
              variant="accent"
              size="sm"
              onClick={() => openAddSeanceModal()}
              leftIcon={<Plus className="w-4 h-4" />}
              className="text-xs font-semibold shadow-sm"
            >
              Ajouter un cours
            </Button>
          </div>
        </div>

        {/* Message de succès */}
        {successMsg && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-semibold text-emerald-900">{successMsg}</p>
          </div>
        )}

        {/* Sélecteur de Classe */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Classe active
            </label>
            <span className="text-xs text-slate-500">
              Semaine en cours : <strong>Lundi au Samedi</strong>
            </span>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-1">
            {classes.map((cl) => {
              const isSelected = cl.id === selectedClasseId;
              const count = seances.filter((s) => s.classe_id === cl.id).length;
              return (
                <button
                  key={cl.id}
                  onClick={() => setSelectedClasseId(cl.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold shrink-0 transition-all flex items-center gap-2 border ${
                    isSelected
                      ? "bg-[#0f2744] text-white border-[#0f2744] shadow-sm"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <span>{cl.code}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tableau hebdomadaire (Grid Lundi - Samedi) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {JOURS.map((jour) => {
            const jourSeances = classeSeances
              .filter((s) => s.jour === jour)
              .sort((a, b) => a.heure_debut.localeCompare(b.heure_debut));

            return (
              <div
                key={jour}
                className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col overflow-hidden"
              >
                {/* En-tête du jour */}
                <div className="px-4 py-3 bg-[#0f2744]/5 border-b border-slate-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-bold text-[#0f2744]">{jour}</span>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#0f2744]/10 text-[#0f2744]">
                      {jourSeances.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openAddSeanceModal(jour)}
                    className="p-1 text-slate-500 hover:text-[#0f2744] hover:bg-white rounded transition-colors"
                    title={`Ajouter un cours le ${jour}`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Contenu des séances */}
                <div className="p-3 flex-1 flex flex-col gap-3 min-h-[320px]">
                  {jourSeances.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                      <Clock className="w-5 h-5 text-slate-300 mb-1" />
                      <p className="text-[11px] text-slate-400 font-medium">Aucun cours</p>
                      <button
                        onClick={() => openAddSeanceModal(jour)}
                        className="mt-2 text-[10px] text-[#e0521c] font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Programmer
                      </button>
                    </div>
                  ) : (
                    jourSeances.map((s) => {
                      const typeBadge = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                      return (
                        <div
                          key={s.id}
                          className="rounded-lg border border-slate-200/90 bg-white p-3 shadow-xs hover:border-[#0f2744]/40 transition-all flex flex-col gap-2"
                        >
                          {/* Horaires et Type */}
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#e0521c]" />
                              {s.heure_debut} - {s.heure_fin}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${typeBadge.bg} ${typeBadge.text} ${typeBadge.border}`}
                            >
                              {s.type_seance || "CM"}
                            </span>
                          </div>

                          {/* Matière */}
                          <div>
                            <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                              {s.matiere_nom}
                            </p>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase">
                              {s.matiere_code}
                            </span>
                          </div>

                          {/* Détails : Prof & Salle */}
                          <div className="space-y-1 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                            <div className="flex items-center gap-1.5 truncate" title={s.professeur_nom}>
                              <User className="w-3 h-3 text-slate-400 shrink-0" />
                              <span className="truncate">{s.professeur_nom}</span>
                            </div>
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">🌐 En ligne</span>
                            </div>
                          </div>

                          {/* Lien Google Meet en temps réel */}
                          {s.meet_url ? (
                            <div className="mt-1 pt-1.5 border-t border-slate-100 flex items-center justify-between gap-1 bg-emerald-50/70 p-1.5 rounded-md">
                              <a
                                href={s.meet_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 hover:text-emerald-950 truncate"
                                title="Rejoindre la visio Google Meet"
                              >
                                <Video className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span className="truncate">Meet actif</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                              </a>
                              <button
                                onClick={() => handleCopyMeet(s.meet_url!)}
                                className="p-1 text-emerald-700 hover:text-emerald-900 rounded shrink-0 transition-colors"
                                title="Copier le lien Google Meet"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const meet = generateMeetLink();
                                saveSeanceEDT({ ...s, meet_url: meet });
                                reloadData();
                                setSuccessMsg(`Lien Google Meet généré pour le cours de ${s.matiere_code} !`);
                                setTimeout(() => setSuccessMsg(null), 3000);
                              }}
                              className="mt-1 text-[10px] text-slate-500 hover:text-[#0f2744] font-semibold inline-flex items-center gap-1 pt-1 border-t border-slate-100"
                            >
                              <Sparkles className="w-3 h-3 text-[#e0521c]" />
                              + Ajouter un Meet
                            </button>
                          )}

                          {/* Actions de gestion */}
                          <div className="flex items-center justify-end gap-1 pt-1">
                            <button
                              onClick={() => openEditSeanceModal(s)}
                              className="p-1 text-slate-400 hover:text-[#0f2744] hover:bg-slate-100 rounded transition-colors"
                              title="Modifier ce créneau"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmSeance(s.id)}
                              className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Supprimer ce créneau"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}

                  {/* Bouton rapide d'ajout en bas du jour */}
                  <button
                    onClick={() => openAddSeanceModal(jour)}
                    className="w-full py-1.5 text-[11px] font-semibold text-slate-500 hover:text-[#0f2744] hover:bg-slate-50 border border-dashed border-slate-200 rounded-md transition-colors flex items-center justify-center gap-1 mt-auto"
                  >
                    <Plus className="w-3 h-3" /> Nouveau cours
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Programmation / Édition d'une Séance */}
        {seanceModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    {editingSeance ? "Mise à jour séance" : "Nouveau cours à l'emploi du temps"}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                    {editingSeance ? "Modifier le créneau" : `Ajouter un cours — ${activeClasse?.code}`}
                  </h3>
                </div>
                <button
                  onClick={() => setSeanceModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitSeance} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Jour de la semaine <span className="text-[#e0521c]">*</span>
                    </label>
                    <select
                      value={formJour}
                      onChange={(e) => setFormJour(e.target.value as JourSemaine)}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      {JOURS.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Type de séance
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as "CM" | "TD" | "TP")}
                      className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      <option value="CM">Cours Magistral (CM)</option>
                      <option value="TD">Travaux Dirigés (TD)</option>
                      <option value="TP">Travaux Pratiques (TP)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Heure de début"
                    type="time"
                    required
                    value={formHeureDebut}
                    onChange={(e) => setFormHeureDebut(e.target.value)}
                  />
                  <Input
                    label="Heure de fin"
                    type="time"
                    required
                    value={formHeureFin}
                    onChange={(e) => setFormHeureFin(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Enseignant responsable <span className="text-[#e0521c]">*</span>
                  </label>
                  <select
                    value={formProfId}
                    onChange={(e) => setFormProfId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                  >
                    {profs.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.full_name} ({p.specialite})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Matière (concernant le prof &amp; la classe) <span className="text-[#e0521c]">*</span>
                  </label>
                  <select
                    value={formMatiereId}
                    onChange={(e) => setFormMatiereId(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                  >
                    {availableMatieresForForm.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.code} — {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Générateur de liens Google Meet */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/90 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                      Lien Google Meet (Visio en temps réel)
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateMeet}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#e0521c] hover:bg-[#c94514] text-white text-[11px] font-bold transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3 h-3" />
                      Générer Meet
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      value={formMeetUrl}
                      onChange={(e) => setFormMeetUrl(e.target.value)}
                      className="w-full text-xs border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744] font-mono"
                    />
                    {formMeetUrl && (
                      <button
                        type="button"
                        onClick={() => handleCopyMeet(formMeetUrl)}
                        className="px-2.5 py-2 border border-slate-200 bg-white hover:bg-slate-100 rounded-lg text-slate-600 text-xs font-semibold shrink-0"
                        title="Copier le lien"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Format officiel : <code>https://meet.google.com/xxx-xxxx-xxx</code>. Les étudiants pourront rejoindre en 1 clic.
                  </p>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSeanceModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editingSeance ? "Enregistrer" : "Ajouter en temps réel"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Confirmation Suppression Séance */}
        {deleteConfirmSeance && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900">
                Supprimer ce créneau ?
              </h3>
              <p className="text-xs text-slate-500">
                Ce cours sera immédiatement retiré de la grille hebdomadaire de la classe.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirmSeance(null)}>
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDeleteSeance(deleteConfirmSeance)}
                >
                  Confirmer
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Document PDF Officiel */}
        {pdfModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    Document PDF
                  </p>
                  <h3 className="font-serif text-lg font-bold text-[#0f2744]">
                    Attacher un Emploi du Temps PDF ({activeClasse?.code})
                  </h3>
                </div>
                <button onClick={() => setPdfModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePdfEDT} className="space-y-4">
                <Input
                  label="Titre du document"
                  placeholder={`Ex. Planning Officiel S1 — ${activeClasse?.code}`}
                  value={formPdfTitle}
                  onChange={(e) => setFormPdfTitle(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Semestre
                  </label>
                  <select
                    value={formPdfSemestre}
                    onChange={(e) => setFormPdfSemestre(e.target.value)}
                    className="w-full text-xs border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                  >
                    <option value="Semestre 1">Semestre 1</option>
                    <option value="Semestre 2">Semestre 2</option>
                  </select>
                </div>

                <div className="p-4 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <p className="text-xs font-semibold text-slate-700">Sélectionner le document PDF</p>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    className="mt-2 text-xs"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setFormPdfFile(file);
                    }}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => setPdfModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm">
                    Publier le PDF
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
