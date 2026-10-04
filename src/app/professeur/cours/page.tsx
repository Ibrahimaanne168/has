"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  BookOpen,
  Edit2,
  Trash2,
  Download,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
  Calendar,
  GraduationCap,
  FileText,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_MATIERES, MOCK_CLASSES } from "@/lib/data/mock-data";
import { Cours } from "@/lib/types";
import { getStoredCourses, saveCourse, deleteCourse } from "@/lib/academicStorage";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurCoursPage() {
  const [courses, setCourses] = useState<Cours[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Cours | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMatiereId, setFormMatiereId] = useState(MOCK_MATIERES[0]?.id || "");
  const [formClasseId, setFormClasseId] = useState(MOCK_CLASSES[0]?.id || "");
  const [formPdfName, setFormPdfName] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");

  React.useEffect(() => {
    setCourses(getStoredCourses());
    const handleUpdate = () => setCourses(getStoredCourses());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle("");
    setFormDescription("");
    setFormMatiereId(MOCK_MATIERES[0]?.id || "");
    setFormClasseId(MOCK_CLASSES[0]?.id || "");
    setFormPdfName("");
    setFormPdfUrl("");
    setModalOpen(true);
  };

  const openEditModal = (course: Cours) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description || "");
    setFormMatiereId(course.matiere_id);
    setFormClasseId(course.classe_id);
    setFormPdfName(course.file_name || "");
    setFormPdfUrl(course.file_url || "");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse && !formPdfName) {
      alert("Veuillez sélectionner un fichier PDF pour ce cours.");
      return;
    }

    const matiere = MOCK_MATIERES.find((m) => m.id === formMatiereId);
    const classe = MOCK_CLASSES.find((c) => c.id === formClasseId);
    const resolvedPdfName = formPdfName || `${formTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`;

    if (editingCourse) {
      const updated: Cours = {
        ...editingCourse,
        title: formTitle,
        description: formDescription,
        matiere_id: formMatiereId,
        classe_id: formClasseId,
        file_url: formPdfUrl || editingCourse.file_url || "/documents/cours.pdf",
        file_name: resolvedPdfName,
        file_type: "application/pdf",
        external_url: null,
        matiere,
        classe,
        updated_at: new Date().toISOString(),
      };
      saveCourse(updated);
      setSuccessMsg("Le cours (document PDF) a été mis à jour avec succès.");
    } else {
      const newCourse: Cours = {
        id: `cr-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        matiere_id: formMatiereId,
        classe_id: formClasseId,
        professeur_id: CURRENT_PROF.id,
        file_url: formPdfUrl || "/documents/cours.pdf",
        file_name: resolvedPdfName,
        file_type: "application/pdf",
        file_size_bytes: 1024 * 1024 * 2,
        external_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        matiere,
        classe,
        professeur: CURRENT_PROF,
        is_favorite: false,
      };
      saveCourse(newCourse);
      setSuccessMsg("Le cours au format PDF a été publié avec succès.");
    }
    setCourses(getStoredCourses());
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (courseId: string) => {
    deleteCourse(courseId);
    setCourses(getStoredCourses());
    setDeleteConfirm(null);
    setSuccessMsg("Le cours a été supprimé de votre catalogue.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.matricule || "PROF001"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Catalogue Personnel
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Gestion de Mes Cours
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publiez, modifiez ou retirez vos supports — seuls vos cours sont accessibles ici
            </p>
          </div>
          <Button
            variant="accent"
            size="md"
            onClick={openCreateModal}
            className="rounded-lg text-xs sm:text-sm font-semibold shrink-0"
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Publier un nouveau cours
          </Button>
        </div>

        {/* Message de succès */}
        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/90 flex items-center gap-3 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Grille des cours en cartes géométriques */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/90 p-16 text-center shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">Aucun cours publié pour l&apos;instant.</p>
            <p className="text-xs text-slate-400 mt-1">Cliquez sur « Publier un nouveau cours » pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c) => (
              <Card key={c.id} hoverEffect className="flex flex-col overflow-hidden">
                <div className="p-5 flex-1 flex flex-col">
                  {/* 1. En-tête badges */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                    <Badge variant="primary" size="sm" uppercase>{c.matiere?.code || "MATIÈRE"}</Badge>
                    <Badge variant="neutral" size="sm">{c.classe?.code || "CLASSE"}</Badge>
                  </div>

                  {/* 2. Catégorie matière */}
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    {c.matiere?.name}
                  </p>

                  {/* 3. Titre principal */}
                  <h3 className="font-serif text-base font-bold text-slate-900 line-clamp-2 leading-snug mb-1.5">
                    {c.title}
                  </h3>

                  {c.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1 mb-3">
                      {c.description}
                    </p>
                  )}

                  {/* 4. Métadonnées filaires */}
                  <div className="pt-3 border-t border-slate-100/90 space-y-1 text-xs text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium text-slate-600">{c.classe?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                      </span>
                      {c.file_url && (
                        <a href={c.file_url} download className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-[#0f2744] font-medium transition-colors">
                          <Download className="w-3.5 h-3.5" />
                          {c.file_name?.split(".").pop()?.toUpperCase()}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Pied de carte : actions professeur */}
                <CardFooter className="flex items-center justify-between p-3 bg-slate-50/70">
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-[#0f2744]/10 text-[#0f2744] rounded-md">
                      <FileText className="w-3.5 h-3.5 text-[#e0521c]" />
                      Document PDF
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(c)}
                      className="p-1.5 text-slate-500 hover:text-[#0f2744] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200/90"
                      title="Modifier ce cours"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(c.id)}
                      className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200/80"
                      title="Supprimer ce cours"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Création / Édition */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    {editingCourse ? "Édition du cours" : "Nouveau cours"}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                    {editingCourse ? "Modifier le cours" : "Publier un nouveau cours"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Titre du cours"
                  required
                  placeholder="Ex. Chapitre 3 : Normalisation des bases de données"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Description académique</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Objectifs pédagogiques, prérequis et points essentiels du cours..."
                    className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Matière <span className="text-[#e0521c]">*</span>
                    </label>
                    <select
                      required
                      value={formMatiereId}
                      onChange={(e) => setFormMatiereId(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200/90 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      {MOCK_MATIERES.map((m) => (
                        <option key={m.id} value={m.id}>{m.code} — {m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Classe cible <span className="text-[#e0521c]">*</span>
                    </label>
                    <select
                      required
                      value={formClasseId}
                      onChange={(e) => setFormClasseId(e.target.value)}
                      className="w-full text-xs sm:text-sm border border-slate-200/90 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      {MOCK_CLASSES.map((cl) => (
                        <option key={cl.id} value={cl.id}>{cl.code} — {cl.niveau}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Zone dépôt fichier PDF */}
                <div className="p-5 rounded-lg border-2 border-dashed border-slate-300 bg-[#F8FAFC] flex flex-col items-center gap-2 text-center">
                  <Upload className="w-8 h-8 text-[#0f2744]" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800">
                    Déposer le document de cours (Format PDF uniquement)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Seuls les fichiers .pdf sont acceptés — Taille max. 50 Mo
                  </p>
                  
                  {formPdfName ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mt-1">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      <span>{formPdfName}</span>
                    </div>
                  ) : (
                    <label htmlFor="course-pdf-upload" className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] text-white text-xs font-semibold hover:bg-[#0f2744]/90 transition-colors mt-1">
                        Sélectionner le PDF
                      </span>
                      <input
                        id="course-pdf-upload"
                        type="file"
                        accept=".pdf,application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (!file.name.toLowerCase().endsWith(".pdf")) {
                              alert("Veuillez sélectionner un fichier PDF uniquement.");
                              return;
                            }
                            setFormPdfName(file.name);
                            const url = URL.createObjectURL(file);
                            setFormPdfUrl(url);
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" className="rounded-lg text-xs" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editingCourse ? "Enregistrer les modifications" : "Publier le cours"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal confirmation suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Confirmer la suppression</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ce cours sera définitivement retiré du portail académique et ne sera plus accessible aux étudiants concernés.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" className="rounded-lg text-xs" onClick={() => handleDelete(deleteConfirm)}>Supprimer définitivement</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
