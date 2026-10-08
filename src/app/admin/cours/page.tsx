"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen, Plus, Trash2, Edit2, Download,
  CheckCircle2, X, GraduationCap, Calendar, Search, Filter,
  Upload, FileText, Eye,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Card, CardFooter } from "@/components/ui/Card";
import { Cours, Classe, Matiere, Professeur } from "@/lib/types";
import {
  getStoredCourses,
  saveCourse,
  deleteCourse,
  getStoredClasses,
  getStoredMatieres,
  getStoredProfesseurs,
  fileToDataUrl,
} from "@/lib/academicStorage";
import { PdfViewerModal } from "@/components/ui/PdfViewerModal";

export default function AdminCoursPage() {
  const [courses, setCourses] = useState<Cours[]>([]);
  const [viewingCourse, setViewingCourse] = useState<Cours | null>(null);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Cours | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClasse, setSelectedClasse] = useState("all");
  const [isUploading, setIsUploading] = useState(false);

  // Formulaire
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formProfId, setFormProfId] = useState("");
  const [formMatiereId, setFormMatiereId] = useState("");
  const [formPdfName, setFormPdfName] = useState("");
  const [formFileUrl, setFormFileUrl] = useState("");

  const reloadData = () => {
    setCourses(getStoredCourses());
    const cList = getStoredClasses();
    const mList = getStoredMatieres();
    const pList = getStoredProfesseurs();
    setClasses(cList);
    setMatieres(mList);
    setProfs(pList);
    if (!formProfId && pList.length > 0) setFormProfId(pList[0].id);
    if (!formMatiereId && mList.length > 0) setFormMatiereId(mList[0].id);
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const selectedProf = profs.find((p) => p.id === formProfId) || profs[0];
  const selectedMatiereObj = matieres.find((m) => m.id === formMatiereId) || matieres[0];

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle("");
    setFormDescription("");
    const pId = profs[0]?.id || "";
    const mId = matieres[0]?.id || "";
    setFormProfId(pId);
    setFormMatiereId(mId);
    setFormPdfName("");
    setFormFileUrl("");
    setModalOpen(true);
  };

  const openEditModal = (c: Cours) => {
    setEditingCourse(c);
    setFormTitle(c.title);
    setFormDescription(c.description || "");
    setFormProfId(c.professeur_id || profs[0]?.id || "");
    setFormMatiereId(c.matiere_id);
    setFormPdfName(c.file_name || "");
    setFormFileUrl(c.file_url || "");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse && !formPdfName && !formFileUrl) {
      alert("Veuillez sélectionner un document PDF.");
      return;
    }

    const matiere = matieres.find((m) => m.id === formMatiereId) || matieres[0];
    const prof = profs.find((p) => p.id === formProfId) || profs[0];
    const targetClasses = matiere?.classes && matiere.classes.length > 0 ? matiere.classes : [];
    const primaryClasse = classes.find((c) => targetClasses.includes(c.code)) || classes[0];

    const resolvedPdfName = formPdfName || (formFileUrl ? formFileUrl.split("/").pop() : `${formTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`);

    if (editingCourse) {
      const updated: Cours = {
        ...editingCourse,
        title: formTitle,
        description: formDescription,
        matiere_id: formMatiereId,
        classe_id: primaryClasse?.id || editingCourse.classe_id,
        classes: targetClasses.length > 0 ? targetClasses : (editingCourse.classes || []),
        professeur_id: formProfId,
        file_url: formFileUrl || editingCourse.file_url || "/documents/cours.pdf",
        file_name: resolvedPdfName || null,
        file_type: "application/pdf",
        external_url: null,
        matiere,
        classe: primaryClasse,
        professeur: prof as any,
        updated_at: new Date().toISOString(),
      };
      saveCourse(updated);
      setSuccessMsg("Le cours a été mis à jour.");
    } else {
      const newCourse: Cours = {
        id: `cr-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        matiere_id: formMatiereId,
        classe_id: primaryClasse?.id || "",
        classes: targetClasses,
        professeur_id: formProfId,
        file_url: formFileUrl || "/documents/cours.pdf",
        file_name: resolvedPdfName || null,
        file_type: "application/pdf",
        file_size_bytes: null,
        external_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        matiere,
        classe: primaryClasse,
        professeur: prof as any,
        is_favorite: false,
      };
      saveCourse(newCourse);
      setSuccessMsg("Le cours a été publié avec succès pour toutes les classes concernées !");
    }

    reloadData();
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (id: string) => {
    deleteCourse(id);
    reloadData();
    setDeleteConfirm(null);
    setSuccessMsg("Le cours a été supprimé.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const selectedClasseObj = classes.find((c) => c.id === selectedClasse);

  const filtered = courses.filter((c) => {
    const matchSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.description && c.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    let matchClasse = true;
    if (selectedClasse !== "all" && selectedClasseObj) {
      const targetCode = selectedClasseObj.code.toUpperCase();
      const courseClasses = c.classes && c.classes.length > 0
        ? c.classes.map((cls) => cls.toUpperCase())
        : (c.matiere?.classes ? c.matiere.classes.map((cls) => cls.toUpperCase()) : []);
      
      matchClasse =
        c.classe_id === selectedClasse ||
        (c.classe?.code && c.classe.code.toUpperCase() === targetCode) ||
        courseClasses.includes(targetCode);
    }
    return matchSearch && matchClasse;
  });

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="direction@halil-academie.com"
      matriculeOrTitle="ADM001"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Administration Académique
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Gestion des Cours &amp; Chapitres
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
              Seule l&apos;administration gère et publie les supports de cours officiels par classe.
            </p>
          </div>

          <Button
            variant="accent"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={openCreateModal}
          >
            Publier un cours / chapitre
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/50 flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{successMsg}</p>
          </div>
        )}

        {/* Barre de recherche et filtres */}
        <div className="bg-white dark:bg-[#111821] p-4 rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#687585] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher un cours..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedClasse}
              onChange={(e) => setSelectedClasse(e.target.value)}
              className="text-xs border border-slate-200/90 dark:border-[#263241] rounded-lg px-3 py-2 bg-white dark:bg-[#151D27] text-slate-700 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] w-full sm:w-auto"
            >
              <option value="all">Toutes les classes</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Liste des cours ou état vide */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-[#111821] p-12 rounded-xl border border-dashed border-slate-300 dark:border-[#263241] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#151D27] flex items-center justify-center mx-auto text-slate-400 dark:text-[#687585]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#F5F7FA]">
              {courses.length === 0 ? "Aucun cours ou chapitre créé" : "Aucun cours trouvé"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-md mx-auto">
              {courses.length === 0
                ? "Toutes les fausses données ont été supprimées. Utilisez le bouton ci-dessus pour ajouter et publier le premier cours officiel."
                : "Modifiez vos filtres de recherche."}
            </p>
            {courses.length === 0 && (
              <div className="pt-2">
                <Button
                  variant="accent"
                  size="sm"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={openCreateModal}
                >
                  Ajouter un cours maintenant
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((c) => (
              <Card key={c.id} className="flex flex-col justify-between overflow-hidden bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241]">
                <div className="p-5 flex-1 flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    {(() => {
                      const displayClasses = (c.classes && c.classes.length > 0)
                        ? c.classes
                        : (c.matiere?.classes && c.matiere.classes.length > 0)
                          ? c.matiere.classes
                          : [c.classe?.code || "L1"];
                      return (
                        <div className="flex flex-wrap gap-1">
                          {displayClasses.map((cls) => (
                            <Badge key={cls} variant="primary" size="sm">
                              {cls}
                            </Badge>
                          ))}
                        </div>
                      );
                    })()}
                    <span className="text-[10px] text-slate-400 dark:text-[#687585] font-mono">
                      {new Date(c.created_at).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    {c.matiere?.name || "Matière"}
                  </p>

                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA] leading-snug line-clamp-2 mb-2">
                    {c.title}
                  </h3>

                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] line-clamp-3 leading-relaxed mb-4 flex-1">
                    {c.description || "Aucune description renseignée."}
                  </p>

                  <div className="pt-3 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between text-xs text-slate-500 dark:text-[#AAB4C0]">
                    <div className="flex items-center gap-1 truncate mr-2">
                      <GraduationCap className="w-3.5 h-3.5 text-[#0f2744] dark:text-cyan-400 shrink-0" />
                      <span className="truncate">{c.professeur?.full_name || "Direction HAS"}</span>
                    </div>
                  </div>
                </div>

                <CardFooter className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-[#151D27] border-t border-slate-100 dark:border-[#263241]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 text-slate-400 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#111821] rounded-md transition-colors cursor-pointer"
                      title="Modifier"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(c.id)}
                      className="p-1.5 text-slate-400 dark:text-[#AAB4C0] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md transition-colors cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {c.file_url && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setViewingCourse(c)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-[#0f2744] hover:bg-[#1a385c] text-white rounded-lg cursor-pointer transition-colors shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" /> Consulter
                      </button>
                      <a
                        href={c.file_url}
                        download={c.file_name || `${c.title}.pdf`}
                        title="Télécharger une copie PDF"
                        className="inline-flex items-center gap-1 text-xs font-semibold p-1.5 bg-white dark:bg-[#111821] border border-slate-200 dark:border-[#263241] rounded-lg text-slate-700 dark:text-[#F5F7FA] hover:bg-slate-50 dark:hover:bg-[#151D27] cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Création / Édition */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    Administration Pédagogique
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    {editingCourse ? "Modifier le cours" : "Publier un cours / chapitre"}
                  </h3>
                </div>
                <button
                  onClick={() => setModalOpen(false)}
                  className="p-1.5 text-slate-400 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] rounded-md cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Zone dépôt fichier PDF */}
                <div className="p-5 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#263241] bg-[#F8FAFC] dark:bg-[#151D27] flex flex-col items-center gap-2 text-center">
                  <Upload className="w-8 h-8 text-[#0f2744] dark:text-[#e0521c]" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    Déposer le document du cours (Format PDF uniquement)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0]">
                    Le nom de votre fichier PDF est automatiquement assigné au titre du cours et sauvegardé de manière permanente
                  </p>
                  {isUploading ? (
                    <div className="text-xs text-slate-500 dark:text-[#AAB4C0] py-1 font-medium animate-pulse">
                      Chargement et sauvegarde permanente du PDF...
                    </div>
                  ) : formPdfName ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate max-w-xs">{formPdfName}</span>
                    </div>
                  ) : (
                    <label htmlFor="admin-pdf-upload" className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] dark:bg-[#e0521c] text-white text-xs font-semibold hover:bg-[#0f2744]/90 dark:hover:bg-[#c84418] transition-colors mt-1">
                        <FileText className="w-3.5 h-3.5" />
                        Choisir le fichier PDF
                      </span>
                      <input
                        id="admin-pdf-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.name.toLowerCase().endsWith(".pdf")) {
                              alert("Veuillez sélectionner un fichier PDF uniquement.");
                              return;
                            }
                            setIsUploading(true);
                            try {
                              setFormPdfName(file.name);
                              const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim();
                              setFormTitle(cleanTitle);
                              const dataUrl = await fileToDataUrl(file);
                              setFormFileUrl(dataUrl);
                            } catch (err) {
                              console.error(err);
                              alert("Erreur lors de la lecture du fichier PDF.");
                            } finally {
                              setIsUploading(false);
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <Input
                  label="Titre du cours (défini par le fichier PDF)"
                  required
                  placeholder="Ex. Chapitre 1 : Espaces Vectoriels & Applications"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA] mb-1">
                      Enseignant responsable <span className="text-[#e0521c]">*</span>
                    </label>
                    <select
                      value={formProfId}
                      onChange={(e) => setFormProfId(e.target.value)}
                      className="w-full text-xs border border-slate-200 dark:border-[#263241] rounded-lg p-2.5 bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                    >
                      {profs.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.full_name} ({p.specialite})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA] mb-1">
                      Matière académique <span className="text-[#e0521c]">*</span>
                    </label>
                    <select
                      value={formMatiereId}
                      onChange={(e) => setFormMatiereId(e.target.value)}
                      className="w-full text-xs border border-slate-200 dark:border-[#263241] rounded-lg p-2.5 bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                    >
                      {matieres.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.code} — {m.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Information automatique sur les classes concernées */}
                {selectedMatiereObj && (
                  <div className="p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-800/40 rounded-lg">
                    <p className="text-[11px] font-bold text-amber-900 dark:text-amber-300 mb-1.5 flex items-center gap-1.5">
                      <GraduationCap className="w-4 h-4 text-[#e0521c]" />
                      Classes automatiquement concernées par cette matière :
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {(selectedMatiereObj.classes && selectedMatiereObj.classes.length > 0
                        ? selectedMatiereObj.classes
                        : ["L1-MPI", "L1-SML", "L1-MIASS"]
                      ).map((cls) => (
                        <span
                          key={cls}
                          className="inline-flex items-center px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0f2744] dark:bg-[#1E4976] text-white shadow-xs"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                    <p className="text-[10px] text-amber-800/80 dark:text-amber-400/80 mt-1.5">
                      Pas besoin de choisir la classe manuellement : les étudiants de ces classes auront immédiatement accès au cours.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA] mb-1">
                    Description ou objectifs pédagogiques
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Présentation des notions abordées, prérequis et consignes de travail..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full text-xs border border-slate-200 dark:border-[#263241] rounded-lg p-2.5 bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-[#263241]">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm">
                    {editingCourse ? "Enregistrer les modifications" : "Publier le cours"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Confirmation Suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">
                Supprimer ce cours ?
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0]">
                Ce support sera immédiatement retiré de l&apos;espace étudiant. Cette action est irréversible.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <Button variant="outline" size="sm" onClick={() => setDeleteConfirm(null)}>
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => handleDelete(deleteConfirm)}
                >
                  Confirmer la suppression
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Visionneuse PDF intégrée sans téléchargement obligatoire */}
        <PdfViewerModal
          isOpen={!!viewingCourse}
          onClose={() => setViewingCourse(null)}
          fileUrl={viewingCourse?.file_url || null}
          fileName={viewingCourse?.file_name}
          title={viewingCourse?.title || "Support de cours"}
          matiereName={viewingCourse?.matiere?.name}
          professeurName={viewingCourse?.professeur?.full_name}
        />
      </div>
    </DashboardLayout>
  );
}
