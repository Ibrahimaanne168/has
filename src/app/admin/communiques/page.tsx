"use client";

import React, { useState } from "react";
import { Bell, Plus, Trash2, AlertCircle, CheckCircle2, X, Save } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_COMMUNIQUES } from "@/lib/data/mock-data";
import { Communique } from "@/lib/types";

export default function AdminCommuniquesPage() {
  const [communiques, setCommuniques] = useState<Communique[]>(MOCK_COMMUNIQUES);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formIsImportant, setFormIsImportant] = useState(false);
  const [formTargetRole, setFormTargetRole] = useState<"" | "etudiant" | "professeur">(""); 

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newCom: Communique = {
      id: `c-${Date.now()}`,
      title: formTitle,
      content: formContent,
      is_important: formIsImportant,
      target_role: formTargetRole || null,
      published_by: "Direction Générale HAS",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setCommuniques((prev) => [newCom, ...prev]);
    setModalOpen(false);
    setFormTitle(""); setFormContent(""); setFormIsImportant(false); setFormTargetRole("");
    setSuccessMsg("Le communiqué a été publié et est désormais visible par les destinataires.");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (id: string) => {
    setCommuniques((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
    setSuccessMsg("Le communiqué a été retiré du portail.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Administration</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Communiqués Officiels</h1>
            <p className="text-xs text-slate-500 mt-1">Annonces et notes de service à destination des étudiants et/ou enseignants</p>
          </div>
          <Button variant="accent" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Rédiger un communiqué
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/90 flex items-center gap-3 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        <div className="space-y-4">
          {communiques.map((com) => (
            <div key={com.id} className={`bg-white p-6 rounded-xl border shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] ${com.is_important ? "border-amber-300 border-l-4 border-l-[#e0521c]" : "border-slate-200/90"}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {com.is_important && <Badge variant="accent" size="sm">Important</Badge>}
                    {com.target_role && (
                      <Badge variant="primary" size="sm">
                        {com.target_role === "etudiant" ? "Étudiants" : "Enseignants"}
                      </Badge>
                    )}
                    {!com.target_role && <Badge variant="neutral" size="sm">Tous</Badge>}
                    <span className="text-xs text-slate-400">
                      {new Date(com.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-slate-900">{com.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{com.content}</p>
                  {com.published_by && (
                    <p className="text-xs text-slate-400">Publié par : {com.published_by}</p>
                  )}
                </div>
                <button onClick={() => setDeleteConfirm(com.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0" title="Retirer ce communiqué">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Nouveau Communiqué */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">Administration</p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744]">Rédiger un Communiqué Officiel</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-5">
                <Input label="Titre du communiqué" required placeholder="Ex. Calendrier des examens de fin de semestre" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Contenu officiel <span className="text-red-500">*</span></label>
                  <textarea required rows={6} value={formContent} onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Rédigez le texte officiel du communiqué..."
                    className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-xs sm:text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Destinataires</label>
                    <select value={formTargetRole} onChange={(e) => setFormTargetRole(e.target.value as "" | "etudiant" | "professeur")}
                      className="w-full text-xs sm:text-sm border border-slate-200/90 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]">
                      <option value="">Toute la communauté HAS</option>
                      <option value="etudiant">Étudiants uniquement</option>
                      <option value="professeur">Enseignants uniquement</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" className="sr-only" checked={formIsImportant} onChange={(e) => setFormIsImportant(e.target.checked)} />
                        <div className={`w-10 h-6 rounded-full transition-colors ${formIsImportant ? "bg-[#e0521c]" : "bg-slate-200"}`}>
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formIsImportant ? "translate-x-5" : "translate-x-1"}`} />
                        </div>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-700 block">Marquer comme Important</span>
                        <span className="text-xs text-slate-400">Affiché en priorité avec badge rouge</span>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setModalOpen(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm" className="rounded-lg text-xs" leftIcon={<Save className="w-3.5 h-3.5" />}>Publier le communiqué</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Retirer ce communiqué</h3>
                  <p className="text-xs text-slate-600 mt-1">Ce communiqué sera immédiatement retiré du portail et ne sera plus consultable.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" className="rounded-lg text-xs" onClick={() => handleDelete(deleteConfirm)}>Retirer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
