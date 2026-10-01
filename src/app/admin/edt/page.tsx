"use client";

import React, { useState, useEffect } from "react";
import { Upload, Calendar, Download, Plus, Trash2, CheckCircle2, AlertCircle, X, Save } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_CLASSES } from "@/lib/data/mock-data";
import { EmploiDuTemps } from "@/lib/types";
import { getStoredEDTs, saveEDT, deleteEDT } from "@/lib/academicStorage";

export default function AdminEDTPage() {
  const [emplois, setEmplois] = useState<EmploiDuTemps[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formClasseId, setFormClasseId] = useState(MOCK_CLASSES[0]?.id || "");
  const [formTitle, setFormTitle] = useState("");
  const [formSemestre, setFormSemestre] = useState("Semestre 1");
  const [formAnnee, setFormAnnee] = useState("2024-2025");

  useEffect(() => {
    setEmplois(getStoredEDTs());
    const handleUpdate = () => setEmplois(getStoredEDTs());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const classe = MOCK_CLASSES.find((c) => c.id === formClasseId);
    const newEDT: EmploiDuTemps = {
      id: `edt-${Date.now()}`,
      classe_id: formClasseId,
      title: formTitle,
      semestre: formSemestre,
      annee_universitaire: formAnnee,
      file_url: `/documents/EDT_${classe?.code}_${formSemestre.replace(" ", "_")}.pdf`,
      file_name: `EDT_${classe?.code}_${formSemestre.replace(" ", "_")}_HAS.pdf`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      classe,
    };
    saveEDT(newEDT);
    setEmplois(getStoredEDTs());
    setModalOpen(false);
    setFormTitle("");
    setFormClasseId(MOCK_CLASSES[0]?.id || "");
    setFormSemestre("Semestre 1");
    setSuccessMsg("Le nouvel emploi du temps a été publié et est maintenant accessible aux étudiants de la classe.");
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (id: string) => {
    deleteEDT(id);
    setEmplois(getStoredEDTs());
    setDeleteConfirm(null);
    setSuccessMsg("L'emploi du temps a été retiré du portail.");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Administration</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Gestion des Emplois du Temps</h1>
            <p className="text-xs text-slate-500 mt-1">
              Publication et gestion officielle des plannings par classe et semestre
            </p>
          </div>
          <Button variant="accent" size="md" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
            Publier un emploi du temps
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/90 flex items-center gap-3 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Liste des EDT publiés ou état vide */}
        {emplois.length === 0 ? (
          <div className="bg-white p-10 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-slate-800">Aucun emploi du temps publié</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Aucun planning hebdomadaire n&apos;a encore été créé. Cliquez sur le bouton ci-dessus pour publier le premier emploi du temps officiel.
            </p>
            <div className="pt-2">
              <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setModalOpen(true)}>
                Publier un planning
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {emplois.map((edt) => (
              <div key={edt.id} className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-[#0f2744]/10 flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-[#0f2744]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="primary" size="sm">{edt.classe?.code || "—"}</Badge>
                      <Badge variant="neutral" size="sm">{edt.semestre}</Badge>
                      {edt.is_active && <Badge variant="success" size="sm">Actif</Badge>}
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 truncate">{edt.title}</h3>
                    <p className="text-xs text-slate-500">
                      {edt.annee_universitaire} • Publié le {new Date(edt.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a href={edt.file_url} download className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors">
                    <Download className="w-3.5 h-3.5" /> Télécharger
                  </a>
                  <button onClick={() => setDeleteConfirm(edt.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Supprimer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Publication EDT */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-xl border border-slate-200/90">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-1">Administration</p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744]">Publier un Emploi du Temps</h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="space-y-5">
                <Input label="Titre du planning" required placeholder="Ex. Emploi du Temps Semestre 1 — L2 ISN"
                  value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Classe <span className="text-red-500">*</span></label>
                    <select required value={formClasseId} onChange={(e) => setFormClasseId(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]">
                      {MOCK_CLASSES.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.niveau}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Semestre</label>
                    <select value={formSemestre} onChange={(e) => setFormSemestre(e.target.value)}
                      className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]">
                      <option>Semestre 1</option>
                      <option>Semestre 2</option>
                    </select>
                  </div>
                </div>
                <Input label="Année universitaire" value={formAnnee} onChange={(e) => setFormAnnee(e.target.value)} placeholder="2024-2025" />
                <div className="p-5 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center gap-3 text-center">
                  <Upload className="w-8 h-8 text-slate-400" />
                  <div>
                    <p className="text-sm font-semibold text-slate-700">Glisser-déposer le fichier PDF</p>
                    <p className="text-xs text-slate-400">ou cliquez pour sélectionner — PDF uniquement, 20 Mo max</p>
                  </div>
                  <Button type="button" variant="secondary" size="sm">Choisir le fichier PDF</Button>
                </div>
                <div className="flex justify-end gap-2 border-t border-slate-100 pt-2">
                  <Button type="button" variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setModalOpen(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm" className="rounded-lg text-xs" leftIcon={<Save className="w-3.5 h-3.5" />}>Publier l&apos;emploi du temps</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Retirer cet emploi du temps ?</h3>
                  <p className="text-xs text-slate-600 mt-1">Les étudiants de cette classe ne pourront plus le consulter ni le télécharger.</p>
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
