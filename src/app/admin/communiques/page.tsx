"use client";

import React, { useState } from "react";
import { Bell, Plus, Trash2, AlertCircle, CheckCircle2, X, FileText, Image, Upload, Download } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Communique } from "@/lib/types";
import { getStoredCommuniques, saveCommunique, deleteCommunique, fileToDataUrl } from "@/lib/academicStorage";

export default function AdminCommuniquesPage() {
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().slice(0, 10));
  const [formIsImportant, setFormIsImportant] = useState(false);
  const [formTargetRole, setFormTargetRole] = useState<"" | "etudiant" | "professeur">("");
  const [formPdfName, setFormPdfName] = useState("");
  const [formPdfUrl, setFormPdfUrl] = useState("");

  React.useEffect(() => {
    setCommuniques(getStoredCommuniques());
    const handleUpdate = () => setCommuniques(getStoredCommuniques());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const resetForm = () => {
    setFormTitle("");
    setFormDate(new Date().toISOString().slice(0, 10));
    setFormIsImportant(false);
    setFormTargetRole("");
    setFormPdfName("");
    setFormPdfUrl("");
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formPdfUrl) {
      alert("Veuillez joindre un fichier (PDF ou image) au communiqué.");
      return;
    }
    const exactDate = new Date(formDate + "T12:00:00.000Z").toISOString();
    const newCom: Communique = {
      id: `c-${Date.now()}`,
      title: formTitle,
      content: "",
      is_important: formIsImportant,
      target_role: formTargetRole || null,
      published_by: "Direction Générale HAS",
      created_at: exactDate,
      updated_at: exactDate,
      file_url: formPdfUrl,
      file_name: formPdfName,
    };
    saveCommunique(newCom);
    setCommuniques(getStoredCommuniques());
    setModalOpen(false);
    resetForm();
    setSuccessMsg("Le communiqué a été publié et est désormais visible par les destinataires.");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (id: string) => {
    deleteCommunique(id);
    setCommuniques(getStoredCommuniques());
    setDeleteConfirm(null);
    setSuccessMsg("Le communiqué a été retiré du portail.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Administration</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">Communiqués Officiels</h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">Publications PDF officielles à destination des étudiants et/ou enseignants</p>
          </div>
          <Button variant="accent" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Publier un communiqué
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/50 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">{successMsg}</p>
          </div>
        )}

        {communiques.length === 0 ? (
          <div className="bg-white dark:bg-[#111821] p-12 rounded-xl border border-dashed border-slate-300 dark:border-[#263241] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#151D27] flex items-center justify-center mx-auto text-slate-400 dark:text-[#687585]">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#F5F7FA]">Aucun communiqué officiel publié</h3>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-md mx-auto">
              Cliquez sur le bouton ci-dessus pour publier un communiqué officiel (document PDF).
            </p>
            <div className="pt-2">
              <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                Publier un communiqué
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {communiques.map((com) => (
              <div
                key={com.id}
                className={`bg-white dark:bg-[#111821] p-5 rounded-xl border shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] flex items-start gap-4 ${
                  com.is_important ? "border-amber-300 dark:border-amber-700/60 border-l-4 border-l-[#e0521c]" : "border-slate-200/90 dark:border-[#263241]"
                }`}
              >
                {/* Aperçu : image ou icône PDF */}
                {com.file_url && com.file_url.startsWith("data:image") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={com.file_url}
                    alt={com.title}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-200 dark:border-[#263241] shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200/70 dark:border-red-800/50 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    {com.is_important && <Badge variant="accent" size="sm">Important</Badge>}
                    {com.target_role && (
                      <Badge variant="primary" size="sm">
                        {com.target_role === "etudiant" ? "Étudiants" : "Enseignants"}
                      </Badge>
                    )}
                    {!com.target_role && <Badge variant="neutral" size="sm">Tous</Badge>}
                    <span className="text-xs text-slate-400 dark:text-[#687585] font-medium">
                      {new Date(com.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">{com.title}</h3>
                  {com.file_name && (
                    <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-0.5 font-mono truncate">{com.file_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {com.file_url && (
                    com.file_url.startsWith("data:image") ? (
                      <a
                        href={com.file_url}
                        download={com.file_name || `${com.title}.jpg`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0f2744] dark:bg-[#e0521c] text-white rounded-lg hover:bg-[#0f2744]/90 dark:hover:bg-[#c84418] transition-colors cursor-pointer"
                      >
                        <Image className="w-3.5 h-3.5" /> Image
                      </a>
                    ) : (
                      <a
                        href={com.file_url}
                        download={com.file_name || `${com.title}.pdf`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#0f2744] dark:bg-[#e0521c] text-white rounded-lg hover:bg-[#0f2744]/90 dark:hover:bg-[#c84418] transition-colors cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> PDF
                      </a>
                    )
                  )}
                  <button
                    onClick={() => setDeleteConfirm(com.id)}
                    className="p-2 text-slate-400 dark:text-[#AAB4C0] hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Nouveau Communiqué */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">Administration</p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">Publier un Communiqué Officiel</h3>
                </div>
                <button onClick={() => { setModalOpen(false); resetForm(); }} className="p-1.5 text-slate-400 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] rounded-md cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                {/* Zone fichier PDF ou Image */}
                <div className="p-5 rounded-lg border-2 border-dashed border-slate-300 dark:border-[#263241] bg-[#F8FAFC] dark:bg-[#151D27] flex flex-col items-center gap-2 text-center">
                  <Upload className="w-8 h-8 text-[#0f2744] dark:text-[#e0521c]" />
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    Document PDF ou Image <span className="text-[#e0521c]">*</span>
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-[#AAB4C0]">PDF officiel ou image (JPG, PNG, WEBP...)</p>
                  {isUploading ? (
                    <div className="text-xs text-slate-500 dark:text-[#AAB4C0] py-1 font-medium animate-pulse">Chargement du fichier...</div>
                  ) : formPdfName ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mt-1 w-full max-w-xs">
                      {formPdfUrl.startsWith("data:image") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={formPdfUrl} alt="" className="w-8 h-8 object-cover rounded" />
                      ) : (
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate flex-1">{formPdfName}</span>
                      <button type="button" onClick={() => { setFormPdfName(""); setFormPdfUrl(""); }} className="ml-auto text-slate-400 hover:text-red-500 cursor-pointer">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label htmlFor="communique-file-upload" className="cursor-pointer">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] dark:bg-[#e0521c] text-white text-xs font-semibold hover:bg-[#0f2744]/90 dark:hover:bg-[#c84418] transition-colors mt-1">
                        <FileText className="w-3.5 h-3.5" /> Choisir PDF ou image
                      </span>
                      <input
                        id="communique-file-upload"
                        type="file"
                        accept=".pdf,application/pdf,image/*"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setIsUploading(true);
                            try {
                              const dataUrl = await fileToDataUrl(file);
                              setFormPdfName(file.name);
                              setFormPdfUrl(dataUrl);
                              if (!formTitle) {
                                const cleanTitle = file.name
                                  .replace(/\.(pdf|jpg|jpeg|png|webp|gif)$/i, "")
                                  .replace(/[-_]/g, " ")
                                  .trim();
                                setFormTitle(cleanTitle);
                              }
                            } catch (err) {
                              console.error(err);
                              alert("Erreur lors de la lecture du fichier.");
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
                  label="Intitulé du communiqué"
                  required
                  placeholder="Ex. Calendrier des examens — Session 1 2024-2025"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                />

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA] mb-1">
                    Date de publication exacte <span className="text-[#e0521c]">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full text-xs border border-slate-200/90 dark:border-[#263241] rounded-lg px-3 py-2.5 bg-white dark:bg-[#151D27] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] text-slate-800 dark:text-[#F5F7FA]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA] mb-1">Destinataires</label>
                    <select
                      value={formTargetRole}
                      onChange={(e) => setFormTargetRole(e.target.value as "" | "etudiant" | "professeur")}
                      className="w-full text-xs border border-slate-200/90 dark:border-[#263241] rounded-lg px-3 py-2.5 bg-white dark:bg-[#151D27] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c] text-slate-800 dark:text-[#F5F7FA]"
                    >
                      <option value="">Toute la communauté HAS</option>
                      <option value="etudiant">Étudiants uniquement</option>
                      <option value="professeur">Enseignants uniquement</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={formIsImportant} onChange={(e) => setFormIsImportant(e.target.checked)} />
                        <div className={`w-10 h-6 rounded-full transition-colors ${formIsImportant ? "bg-[#e0521c]" : "bg-slate-200 dark:bg-[#263241]"}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formIsImportant ? "translate-x-5" : "translate-x-1"}`} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-700 dark:text-[#F5F7FA] block">Marquer Important</span>
                        <span className="text-[11px] text-slate-400 dark:text-[#687585]">Badge prioritaire</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
                  <Button type="button" variant="ghost" size="sm" onClick={() => { setModalOpen(false); resetForm(); }}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Upload className="w-3.5 h-3.5" />}>
                    Publier le communiqué
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200/80 dark:border-red-800/50 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Retirer ce communiqué</h3>
                  <p className="text-xs text-slate-600 dark:text-[#AAB4C0] mt-1">Ce communiqué sera immédiatement retiré du portail et ne sera plus consultable.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>Retirer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

