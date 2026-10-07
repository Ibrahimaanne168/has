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
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import { Cours, Classe, Matiere } from "@/lib/types";
import {
  getStoredCourses,
  saveCourse,
  deleteCourse,
  getStoredClasses,
  getStoredMatieres,
  fileToDataUrl,
} from "@/lib/academicStorage";

export default function ProfesseurCoursPage() {
  const { prof } = useCurrentProfesseur();
  const [courses, setCourses] = useState<Cours[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Cours | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMatiereId, setFormMatiereId] = useState("");
  const [formPdfName, setFormPdfName] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");

  const reloadData = () => {
    setCourses(getStoredCourses());
    const cList = getStoredClasses();
    const mList = getStoredMatieres();
    setClasses(cList);
    setMatieres(mList);
  };

  React.useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  // Matières enseignées par ce professeur (sans restriction préalable de classe)
  const profMatieres = React.useMemo(() => {
    if (!prof.matieres || prof.matieres.length === 0) return matieres;
    return matieres.filter((m) => {
      return prof.matieres?.some(
        (pm) =>
          pm.code?.toUpperCase() === m.code.toUpperCase() ||
          String(pm.id) === String(m.id) ||
          pm.nom.toLowerCase() === m.name.toLowerCase()
      );
    });
  }, [matieres, prof.matieres]);

  // Matière sélectionnée dans le formulaire
  const currentSelectedMatiere = React.useMemo(() => {
    return profMatieres.find((m) => m.id === formMatiereId) || profMatieres[0];
  }, [profMatieres, formMatiereId]);

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle("");
    setFormDescription("");
    setFormMatiereId(profMatieres[0]?.id || matieres[0]?.id || "");
    setFormPdfName("");
    setFormPdfUrl("");
    setModalOpen(true);
  };

  const openEditModal = (course: Cours) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description || "");
    setFormMatiereId(course.matiere_id);
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

    const matiere = matieres.find((m) => m.id === formMatiereId) || profMatieres[0];
    const resolvedPdfName = formPdfName || `${formTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}.pdf`;
    const targetClasses = matiere?.classes || [];
    const primaryClasse = classes.find((c) => targetClasses.includes(c.code)) || classes[0];

    if (editingCourse) {
      const updated: Cours = {
        ...editingCourse,
        title: formTitle,
        description: formDescription,
        matiere_id: matiere?.id || formMatiereId,
        classe_id: primaryClasse?.id,
        classes: targetClasses,
        file_url: formPdfUrl || editingCourse.file_url || "/documents/cours.pdf",
        file_name: resolvedPdfName,
        file_type: "application/pdf",
        external_url: null,
        matiere,
        classe: primaryClasse,
        updated_at: new Date().toISOString(),
      };
      saveCourse(updated);
      setSuccessMsg("Le cours (document PDF) a été mis à jour avec succès.");
    } else {
      const newCourse: Cours = {
        id: `cr-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        matiere_id: matiere?.id || formMatiereId,
        classe_id: primaryClasse?.id,
        classes: targetClasses,
        professeur_id: prof.id,
        file_url: formPdfUrl || "/documents/cours.pdf",
        file_name: resolvedPdfName,
        file_type: "application/pdf",
        file_size_bytes: 1024 * 1024 * 2,
        external_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        matiere,
        classe: primaryClasse,
        professeur: { ...prof, role: "professeur" as const, classe_id: null } as import("@/lib/types").Profile,
        is_favorite: false,
      };
      saveCourse(newCourse);
      setSuccessMsg("Le cours a été publié avec succès pour toutes les classes concernées !");
    }
    reloadData();
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (courseId: string) => {
    deleteCourse(courseId);
    reloadData();
    setDeleteConfirm(null);
    setSuccessMsg("Le cours a été supprimé de votre catalogue.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // Seuls les cours concernant ce professeur sont affichés
  const myCourses = courses.filter((c) => {
    const profIdMatch = c.professeur_id === prof.id || c.professeur?.id === prof.id;
    const profMatriculeMatch = prof.matricule && (c.professeur?.matricule === prof.matricule || c.professeur_id === prof.matricule);
    const profEmailMatch = prof.email && c.professeur?.email === prof.email;
    const profNameMatch = prof.nom && c.professeur?.full_name?.toLowerCase().includes(prof.nom.toLowerCase());
    return profIdMatch || profMatriculeMatch || profEmailMatch || profNameMatch;
  });

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Catalogue Personnel
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Gestion de Mes Cours
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
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
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800/40 flex items-center gap-3 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300">{successMsg}</p>
          </div>
        )}

        {/* Grille des cours en cartes géométriques */}
        {myCourses.length === 0 ? (
          <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-16 text-center shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <BookOpen className="w-12 h-12 text-slate-200 dark:text-[#687585] mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-[#AAB4C0]">Aucun cours publié pour vos matières et classes pour l&apos;instant.</p>
            <p className="text-xs text-slate-400 dark:text-[#687585] mt-1">Cliquez sur « Publier un nouveau cours » pour déposer un support PDF.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCourses.map((c) => {
              const displayClasses =
                c.classes && c.classes.length > 0
                  ? c.classes
                  : c.matiere?.classes && c.matiere.classes.length > 0
                  ? c.matiere.classes
                  : [c.classe?.code || "Tous"];

              return (
                <Card key={c.id} hoverEffect className="flex flex-col overflow-hidden">
                  <div className="p-5 flex-1 flex flex-col">
                    {/* 1. En-tête badges */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-2.5">
                      <Badge variant="primary" size="sm" uppercase>{c.matiere?.code || "MATIÈRE"}</Badge>
                      {displayClasses.map((cls) => (
                        <Badge key={cls} variant="neutral" size="sm">{cls}</Badge>
                      ))}
                    </div>

                    {/* 2. Catégorie matière */}
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                      {c.matiere?.name}
                    </p>

                    {/* 3. Titre principal */}
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA] line-clamp-2 leading-snug mb-1.5">
                      {c.title}
                    </h3>

                    {c.description && (
                      <p className="text-xs text-slate-500 dark:text-[#AAB4C0] line-clamp-2 leading-relaxed flex-1 mb-3">
                        {c.description}
                      </p>
                    )}

                    {/* 4. Métadonnées filaires */}
                    <div className="pt-3 border-t border-slate-100/90 dark:border-[#263241] space-y-1 text-xs text-slate-400 dark:text-[#687585]">
                      <div className="flex items-center gap-1.5">
                        <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                        <span className="font-medium text-slate-600 dark:text-[#AAB4C0]">
                          Classes concernées : {displayClasses.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 shrink-0" />
                          {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                        </span>
                        {c.file_url && (
                          <a href={c.file_url} download={c.file_name || `${c.title}.pdf`} className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#e0521c] font-medium transition-colors">
                            <Download className="w-3.5 h-3.5" />
                            PDF
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 5. Pied de carte : actions professeur */}
                  <CardFooter className="flex items-center justify-between p-3 bg-slate-50/70 dark:bg-[#151D27] border-t border-slate-100/90 dark:border-[#263241]">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 bg-[#0f2744]/10 dark:bg-[#111821] text-[#0f2744] dark:text-[#F5F7FA] border border-transparent dark:border-[#263241] rounded-md">
                        <FileText className="w-3.5 h-3.5 text-[#e0521c]" />
                        Document PDF permanent
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-500 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-white dark:hover:bg-[#111821] rounded-lg transition-colors border border-transparent hover:border-slate-200/90 dark:hover:border-[#263241]"
                        title="Modifier ce cours"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(c.id)}
                        className="p-1.5 text-slate-500 dark:text-[#AAB4C0] hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors border border-transparent hover:border-red-200/80 dark:hover:border-rose-900/40"
                        title="Supprimer ce cours"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {/* Modal Création / Édition */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">
                    {editingCourse ? "Édition du cours" : "Nouveau cours"}
                  </p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    {editingCourse ? "Modifier le cours" : "Publier un cours par Matière"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-500 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Zone dépôt fichier PDF */}
                <div className="p-5 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#263241] bg-[#F8FAFC] dark:bg-[#151D27]/60 flex flex-col items-center gap-2 text-center">
                  <Upload className="w-8 h-8 text-[#0f2744] dark:text-[#e0521c]" />
                  <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    Déposer le document du cours (Format PDF uniquement)
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0]">
                    Le nom de votre fichier PDF est automatiquement sauvegardé et assigné comme titre
                  </p>
                  
                  {formPdfName ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1">
                      <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span className="truncate max-w-xs">{formPdfName}</span>
                    </div>
                  ) : (
                    <label htmlFor="course-pdf-upload" className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] dark:bg-[#1a385c] text-white text-xs font-semibold hover:bg-[#0f2744]/90 dark:hover:bg-[#234b7a] transition-colors mt-1">
                        <FileText className="w-3.5 h-3.5" />
                        Choisir le fichier PDF
                      </span>
                      <input
                        id="course-pdf-upload"
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
                            setFormPdfName(file.name);
                            const cleanTitle = file.name.replace(/\.pdf$/i, "").replace(/[-_]/g, " ").trim();
                            setFormTitle(cleanTitle);
                            try {
                              const base64 = await fileToDataUrl(file);
                              setFormPdfUrl(base64);
                            } catch {
                              setFormPdfUrl(URL.createObjectURL(file));
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>

                <Input
                  label="Titre du cours (défini automatiquement par le PDF)"
                  required
                  placeholder="Ex. Analyse 1 — Suites et Limites"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />

                {/* Sélection directe de la matière sans avoir à choisir de classe */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
                    Matière enseignée <span className="text-[#e0521c]">*</span>
                  </label>
                  <select
                    required
                    value={formMatiereId}
                    onChange={(e) => setFormMatiereId(e.target.value)}
                    className="w-full text-xs sm:text-sm border border-slate-200/90 dark:border-[#263241] rounded-lg px-3 py-2.5 bg-white dark:bg-[#151D27] text-slate-800 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                  >
                    {profMatieres.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.code} — {m.name} ({m.niveau || "L1/L2"})
                      </option>
                    ))}
                  </select>

                  {/* Affichage automatique des classes concernées par cette matière */}
                  {currentSelectedMatiere && (
                    <div className="p-3 bg-slate-50 dark:bg-[#151D27] border border-slate-200/80 dark:border-[#263241] rounded-lg flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs text-slate-600 dark:text-[#AAB4C0] font-medium">
                        Classes cibles automatiques (visibilité immédiate) :
                      </span>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {(currentSelectedMatiere.classes || []).length > 0 ? (
                          currentSelectedMatiere.classes?.map((cCode) => (
                            <Badge key={cCode} variant="primary" size="sm">
                              {cCode}
                            </Badge>
                          ))
                        ) : (
                          <Badge variant="neutral" size="sm">
                            {currentSelectedMatiere.niveau ? `Niveau ${currentSelectedMatiere.niveau}` : "Toutes les promotions"}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">Description académique (optionnelle)</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Objectifs pédagogiques, prérequis et consignes de travail..."
                    className="block w-full rounded-lg border border-slate-200/90 dark:border-[#263241] bg-white dark:bg-[#151D27] p-3 text-xs sm:text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:border-[#0f2744] dark:focus:border-[#e0521c] focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] transition-colors"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
                  <Button type="button" variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" className="rounded-lg text-xs" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editingCourse ? "Enregistrer les modifications" : "Publier pour les classes concernées"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal confirmation suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-rose-950/40 border border-red-200/80 dark:border-rose-800/40 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Confirmer la suppression</h3>
                  <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1 leading-relaxed">
                    Ce cours sera définitivement retiré du portail académique et ne sera plus accessible aux étudiants concernés.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
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
