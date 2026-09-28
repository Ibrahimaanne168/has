"use client";

import React, { useState } from "react";
import {
  Sliders, Plus, Trash2, Edit2, BookOpen, Building, Zap, TrendingUp,
  CheckCircle2, AlertCircle, X, Save, Cpu,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_FILIERES, MOCK_CLASSES, MOCK_MATIERES } from "@/lib/data/mock-data";
import { Filiere, Classe, Matiere } from "@/lib/types";

const FILIERE_ICONS: Record<string, React.ReactNode> = {
  ISN: <Cpu className="w-5 h-5" />,
  GCB: <Building className="w-5 h-5" />,
  EER: <Zap className="w-5 h-5" />,
  SEG: <TrendingUp className="w-5 h-5" />,
};

export default function AdminAcademiquePage() {
  const [tab, setTab] = useState<"filieres" | "classes" | "matieres">("filieres");
  const [filieres, setFilieres] = useState<Filiere[]>(MOCK_FILIERES);
  const [classes, setClasses] = useState<Classe[]>(MOCK_CLASSES);
  const [matieres, setMatieres] = useState<Matiere[]>(MOCK_MATIERES);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: string; name: string } | null>(null);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3500); };

  const handleDeleteFiliere = (id: string) => {
    setFilieres((prev) => prev.filter((f) => f.id !== id));
    setDeleteConfirm(null);
    showSuccess("La filière a été supprimée.");
  };

  const handleDeleteClasse = (id: string) => {
    setClasses((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
    showSuccess("La classe a été supprimée.");
  };

  const handleDeleteMatiere = (id: string) => {
    setMatieres((prev) => prev.filter((m) => m.id !== id));
    setDeleteConfirm(null);
    showSuccess("La matière a été supprimée.");
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Structure Académique</h1>
          <p className="text-xs text-slate-500 mt-1">Filières, classes et modules de formation — Halil Académie Scientifique</p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 border-b border-slate-200">
          {([["filieres", "Filières"], ["classes", "Classes"], ["matieres", "Matières"]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-colors ${tab === key ? "border-[#0f2744] text-[#0f2744]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* === FILIÈRES === */}
        {tab === "filieres" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Ajouter une filière</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filieres.map((f) => (
                <div key={f.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-[#0f2744]/10 text-[#0f2744] flex items-center justify-center">
                        {FILIERE_ICONS[f.code] || <BookOpen className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#e0521c]">{f.code}</span>
                          <Badge variant="neutral" size="sm">{f.duration_years} ans</Badge>
                        </div>
                        <h3 className="font-serif text-base font-bold text-slate-900 mt-0.5">{f.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-[#0f2744] hover:bg-slate-100 rounded-md"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteConfirm({ id: f.id, type: "filiere", name: f.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{f.description}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">{f.cycle}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === CLASSES === */}
        {tab === "classes" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Ajouter une classe</Button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Code", "Nom de la classe", "Niveau", "Filière", "Année", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {classes.map((cls) => {
                    const filiere = MOCK_FILIERES.find((f) => f.id === cls.filiere_id);
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#0f2744]">{cls.code}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{cls.name}</td>
                        <td className="px-4 py-3"><Badge variant="primary" size="sm">{cls.niveau}</Badge></td>
                        <td className="px-4 py-3 text-xs text-slate-600">{filiere?.code || "—"}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{cls.annee_scolaire}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-[#0f2744] hover:bg-slate-100 rounded-md"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm({ id: cls.id, type: "classe", name: cls.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === MATIÈRES === */}
        {tab === "matieres" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="accent" size="sm" leftIcon={<Plus className="w-4 h-4" />}>Ajouter une matière</Button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Code", "Intitulé", "Filière", "Crédits ECTS", "Coefficient", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matieres.map((m) => {
                    const filiere = MOCK_FILIERES.find((f) => f.id === m.filiere_id);
                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#e0521c]">{m.code}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-xs truncate">{m.name}</td>
                        <td className="px-4 py-3 text-xs text-slate-600">{filiere?.code || "—"}</td>
                        <td className="px-4 py-3 text-center"><Badge variant="primary" size="sm">{m.credits_ects}</Badge></td>
                        <td className="px-4 py-3 text-center text-xs text-slate-700 font-semibold">{m.coefficient}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button className="p-1.5 text-slate-400 hover:text-[#0f2744] hover:bg-slate-100 rounded-md"><Edit2 className="w-4 h-4" /></button>
                            <button onClick={() => setDeleteConfirm({ id: m.id, type: "matiere", name: m.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Supprimer « {deleteConfirm.name} »</h3>
                  <p className="text-xs text-slate-600 mt-1">Cette action est irréversible et peut affecter les étudiants et cours associés.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" onClick={() => {
                  if (deleteConfirm.type === "filiere") handleDeleteFiliere(deleteConfirm.id);
                  else if (deleteConfirm.type === "classe") handleDeleteClasse(deleteConfirm.id);
                  else handleDeleteMatiere(deleteConfirm.id);
                }}>Supprimer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
