"use client";

import React, { useState } from "react";
import {
  PlusCircle,
  BookOpen,
  Edit2,
  Trash2,
  Download,
  ExternalLink,
  FileText,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_COURS, MOCK_MATIERES, MOCK_CLASSES } from "@/lib/data/mock-data";
import { Cours } from "@/lib/types";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurCoursPage() {
  const [courses, setCourses] = useState<Cours[]>(MOCK_COURS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Cours | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Formulaire
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formMatiereId, setFormMatiereId] = useState(MOCK_MATIERES[0]?.id || "");
  const [formClasseId, setFormClasseId] = useState(MOCK_CLASSES[1]?.id || "");
  const [formExternalUrl, setFormExternalUrl] = useState("");

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormTitle("");
    setFormDescription("");
    setFormMatiereId(MOCK_MATIERES[0]?.id || "");
    setFormClasseId(MOCK_CLASSES[1]?.id || "");
    setFormExternalUrl("");
    setModalOpen(true);
  };

  const openEditModal = (course: Cours) => {
    setEditingCourse(course);
    setFormTitle(course.title);
    setFormDescription(course.description || "");
    setFormMatiereId(course.matiere_id);
    setFormClasseId(course.classe_id);
    setFormExternalUrl(course.external_url || "");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matiere = MOCK_MATIERES.find((m) => m.id === formMatiereId);
    const classe = MOCK_CLASSES.find((c) => c.id === formClasseId);

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                title: formTitle,
                description: formDescription,
                matiere_id: formMatiereId,
                classe_id: formClasseId,
                external_url: formExternalUrl,
                matiere,
                classe,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );
      setSuccessMsg("Le cours a été mis à jour avec succès.");
    } else {
      const newCourse: Cours = {
        id: `cr-${Date.now()}`,
        title: formTitle,
        description: formDescription,
        matiere_id: formMatiereId,
        classe_id: formClasseId,
        professeur_id: CURRENT_PROF.id,
        file_url: null,
        file_name: null,
        file_type: null,
        file_size_bytes: null,
        external_url: formExternalUrl || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        matiere,
        classe,
        professeur: CURRENT_PROF,
        is_favorite: false,
      };
      setCourses((prev) => [newCourse, ...prev]);
      setSuccessMsg("Le cours a été publié et est maintenant visible par vos étudiants.");
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setDeleteConfirm(null);
    setSuccessMsg("Le cours a été supprimé de votre catalogue.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.specialite || "Enseignant HAS"}
    >
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Gestion de Mes Cours</h1>
            <p className="text-xs text-slate-500 mt-1">
              Publiez, modifiez ou retirez vos supports — seuls vos cours sont accessibles ici
            </p>
          </div>
          <Button
            variant="accent"
            size="md"
            onClick={openCreateModal}
            leftIcon={<PlusCircle className="w-4 h-4" />}
          >
            Publier un nouveau cours
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Liste de mes cours */}
        {courses.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">Aucun cours publié pour l&apos;instant.</p>
            <p className="text-xs text-slate-400 mt-1">Cliquez sur « Publier un nouveau cours » pour commencer.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((c) => (
              <Card key={c.id} hoverEffect>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="primary" size="sm">{c.matiere?.code || "MATIÈRE"}</Badge>
                        <Badge variant="neutral" size="sm">{c.classe?.code || "CLASSE"}</Badge>
                      </div>
                      <h3 className="font-serif text-base font-bold text-slate-900 line-clamp-2">{c.title}</h3>
                      {c.description && (
                        <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{c.description}</p>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {c.file_url && (
                      <a href={c.file_url} download className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
                        <Download className="w-3.5 h-3.5" /> {c.file_name || "Télécharger"}
                      </a>
                    )}
                    {c.external_url && (
                      <a href={c.external_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" /> Ressource externe
                      </a>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">
                      {new Date(c.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(c)}
                        className="p-1.5 text-slate-500 hover:text-[#0f2744] hover:bg-slate-100 rounded-md transition-colors"
                        title="Modifier ce cours"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(c.id)}
                        className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Supprimer ce cours"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Modal Création / Édition */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                  {editingCourse ? "Modifier le cours" : "Publier un nouveau cours"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md">
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
                  <label className="block text-sm font-medium text-slate-700">Description académique</label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Objectifs pédagogiques, prérequis et points essentiels du cours..."
                    className="block w-full rounded-md border border-slate-300 bg-white p-3 text-sm text-slate-900 placeholder-slate-400 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Matière <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formMatiereId}
                      onChange={(e) => setFormMatiereId(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      {MOCK_MATIERES.map((m) => (
                        <option key={m.id} value={m.id}>{m.code} — {m.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">
                      Classe cible <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={formClasseId}
                      onChange={(e) => setFormClasseId(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      {MOCK_CLASSES.map((cl) => (
                        <option key={cl.id} value={cl.id}>{cl.code} — {cl.niveau}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center gap-2 text-center">
                  <Upload className="w-7 h-7 text-slate-400" />
                  <p className="text-sm font-medium text-slate-700">Déposer le support PDF ou présentation</p>
                  <p className="text-xs text-slate-400">PDF, PPTX ou images — taille maximale 50 Mo</p>
                  <Button type="button" variant="secondary" size="sm">
                    Choisir un fichier
                  </Button>
                </div>

                <Input
                  label="Lien de ressource externe (optionnel)"
                  type="url"
                  placeholder="https://docs.example.com/cours"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  helperText="Lien vers une vidéo, documentation officielle ou cours en ligne complémentaire."
                  value={formExternalUrl}
                  onChange={(e) => setFormExternalUrl(e.target.value)}
                />

                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editingCourse ? "Enregistrer les modifications" : "Publier le cours"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal confirmation suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Confirmer la suppression</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Ce cours sera définitivement retiré du portail académique et ne sera plus accessible aux étudiants concernés.
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>Supprimer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
