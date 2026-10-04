"use client";

import React, { useState, useEffect } from "react";
import {
  Sliders, Plus, Trash2, Edit2, BookOpen, Building, Zap, TrendingUp,
  CheckCircle2, AlertCircle, X, Save, Cpu,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Filiere, Classe, Matiere } from "@/lib/types";
import {
  getStoredFilieres,
  saveFiliere,
  deleteFiliere,
  getStoredClasses,
  saveClasse,
  deleteClasse,
  getStoredMatieres,
  saveMatiere,
  deleteMatiere,
} from "@/lib/academicStorage";

const FILIERE_ICONS: Record<string, React.ReactNode> = {
  MPI: <Cpu className="w-5 h-5" />,
  SML: <Building className="w-5 h-5" />,
  MIASS: <TrendingUp className="w-5 h-5" />,
};

export default function AdminAcademiquePage() {
  const [tab, setTab] = useState<"filieres" | "classes" | "matieres">("filieres");
  const [filieres, setFilieres] = useState<Filiere[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: string; name: string } | null>(null);

  // Modals création
  const [filiereModal, setFiliereModal] = useState(false);
  const [classeModal, setClasseModal] = useState(false);
  const [matiereModal, setMatiereModal] = useState(false);

  // Form states
  const [filiereCode, setFiliereCode] = useState("");
  const [filiereName, setFiliereName] = useState("");
  const [filiereDesc, setFiliereDesc] = useState("");

  const [classeCode, setClasseCode] = useState("");
  const [classeName, setClasseName] = useState("");
  const [classeNiveau, setClasseNiveau] = useState<"L1" | "L2">("L1");
  const [classeFiliereId, setClasseFiliereId] = useState("");

  const [matiereCode, setMatiereCode] = useState("");
  const [matiereName, setMatiereName] = useState("");
  const [matiereCoeff, setMatiereCoeff] = useState("3");
  const [matiereEcts, setMatiereEcts] = useState("5");
  const [matiereFiliereId, setMatiereFiliereId] = useState("");
  const [matiereClasses, setMatiereClasses] = useState<string[]>(["L1-MPI", "L1-SML", "L1-MIASS"]);

  const reloadData = () => {
    const fList = getStoredFilieres();
    const cList = getStoredClasses();
    const mList = getStoredMatieres();
    setFilieres(fList);
    setClasses(cList);
    setMatieres(mList);
    if (!classeFiliereId && fList.length > 0) setClasseFiliereId(fList[0].id);
    if (!matiereFiliereId && fList.length > 0) setMatiereFiliereId(fList[0].id);
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => reloadData();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const showSuccess = (msg: string) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(null), 3500); };

  const handleCreateFiliere = (e: React.FormEvent) => {
    e.preventDefault();
    if (!filiereCode.trim() || !filiereName.trim()) return;
    const newF: Filiere = {
      id: `filiere-${Date.now()}`,
      code: filiereCode.toUpperCase().trim(),
      name: filiereName.trim(),
      description: filiereDesc.trim() || "Filière académique d'excellence.",
      cycle: "Tutorat Supérieur L1-L2",
      duration_years: 2,
      icon: "cpu",
    };
    saveFiliere(newF);
    reloadData();
    setFiliereModal(false);
    setFiliereCode(""); setFiliereName(""); setFiliereDesc("");
    showSuccess(`La filière ${newF.code} a été ajoutée.`);
  };

  const handleCreateClasse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!classeCode.trim() || !classeName.trim()) return;
    const newC: Classe = {
      id: `cls-${Date.now()}`,
      filiere_id: classeFiliereId || filieres[0]?.id || "",
      code: classeCode.toUpperCase().trim(),
      name: classeName.trim(),
      niveau: classeNiveau,
      annee_scolaire: "2024-2025",
    };
    saveClasse(newC);
    reloadData();
    setClasseModal(false);
    setClasseCode(""); setClasseName("");
    showSuccess(`La classe ${newC.code} (${newC.niveau}) a été ajoutée.`);
  };

  const handleCreateMatiere = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matiereCode.trim() || !matiereName.trim()) return;
    if (matiereClasses.length === 0) {
      alert("Veuillez sélectionner au moins une classe concernée par cette matière.");
      return;
    }
    const isL1 = matiereClasses.some((c) => c.startsWith("L1"));
    const isL2 = matiereClasses.some((c) => c.startsWith("L2"));
    const niveau = isL1 && !isL2 ? "L1" : isL2 && !isL1 ? "L2" : "L1";

    const newM: Matiere = {
      id: `mat-${Date.now()}`,
      filiere_id: matiereFiliereId || filieres[0]?.id || "",
      code: matiereCode.toUpperCase().trim(),
      name: matiereName.trim(),
      coefficient: parseInt(matiereCoeff, 10) || 3,
      credits_ects: parseInt(matiereEcts, 10) || 5,
      classes: matiereClasses,
      niveau,
      description: "Module d'enseignement académique conforme à la maquette.",
    };
    saveMatiere(newM);
    reloadData();
    setMatiereModal(false);
    setMatiereCode(""); setMatiereName("");
    setMatiereClasses(["L1-MPI", "L1-SML", "L1-MIASS"]);
    showSuccess(`La matière ${newM.name} (${newM.code}) a été ajoutée.`);
  };

  const handleDeleteFiliere = (id: string) => {
    deleteFiliere(id);
    reloadData();
    setDeleteConfirm(null);
    showSuccess("La filière a été supprimée définitivement.");
  };

  const handleDeleteClasse = (id: string) => {
    deleteClasse(id);
    reloadData();
    setDeleteConfirm(null);
    showSuccess("La classe a été supprimée définitivement.");
  };

  const handleDeleteMatiere = (id: string) => {
    deleteMatiere(id);
    reloadData();
    setDeleteConfirm(null);
    showSuccess("La matière a été supprimée définitivement.");
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Administration Académique</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Structure Académique &amp; Matières</h1>
          <p className="text-xs text-slate-500 mt-1">Filières, classes et modules de formation L1 &amp; L2 — Halil Académie Scientifique</p>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Onglets */}
        <div className="flex gap-1 border-b border-slate-200">
          {([["filieres", `Filières (${filieres.length})`], ["classes", `Classes (${classes.length})`], ["matieres", `Matières (${matieres.length})`]] as const).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key as any)}
              className={`px-5 py-2.5 text-xs font-bold border-b-2 transition-colors ${tab === key ? "border-[#0f2744] text-[#0f2744]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>
              {label}
            </button>
          ))}
        </div>

        {/* === FILIÈRES === */}
        {tab === "filieres" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button variant="accent" size="sm" onClick={() => setFiliereModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Ajouter une filière
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filieres.map((f) => (
                <div key={f.id} className="bg-white p-6 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] hover:border-slate-300 transition-colors">
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
              <Button variant="accent" size="sm" onClick={() => setClasseModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Ajouter une classe
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
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
                    const filiere = filieres.find((f) => f.id === cls.filiere_id);
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#0f2744]">{cls.code}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900">{cls.name}</td>
                        <td className="px-4 py-3"><Badge variant="primary" size="sm">{cls.niveau}</Badge></td>
                        <td className="px-4 py-3 text-xs text-slate-600">{filiere?.code || "MPI"}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{cls.annee_scolaire}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setDeleteConfirm({ id: cls.id, type: "classe", name: cls.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Définissez les matières et associez-les à une ou plusieurs classes (tronc commun L1 ou filière spécifique).
                </p>
              </div>
              <Button variant="accent" size="sm" onClick={() => setMatiereModal(true)} leftIcon={<Plus className="w-4 h-4" />}>
                Ajouter une matière
              </Button>
            </div>
            <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    {["Code", "Intitulé", "Classes Concernées (Tronc Commun)", "Crédits ECTS", "Coefficient", "Actions"].map((h) => (
                      <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {matieres.map((m) => {
                    const filiere = filieres.find((f) => f.id === m.filiere_id);
                    const displayClasses = m.classes && m.classes.length > 0
                      ? m.classes
                      : [filiere?.code ? `L1-${filiere.code}` : "L1-MPI"];

                    return (
                      <tr key={m.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-mono text-xs font-bold text-[#e0521c]">{m.code}</td>
                        <td className="px-4 py-3 text-sm font-medium text-slate-900 max-w-xs">{m.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {displayClasses.map((cCode) => (
                              <span
                                key={cCode}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-[#0f2744] text-white shadow-2xs"
                              >
                                {cCode}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center"><Badge variant="primary" size="sm">{m.credits_ects}</Badge></td>
                        <td className="px-4 py-3 text-center text-xs text-slate-700 font-semibold">{m.coefficient}</td>
                        <td className="px-4 py-3">
                          <button onClick={() => setDeleteConfirm({ id: m.id, type: "matiere", name: m.name })} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal Créer Filière */}
        {filiereModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif text-lg font-bold text-[#0f2744]">Ajouter une Filière</h3>
                <button onClick={() => setFiliereModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateFiliere} className="space-y-4">
                <Input label="Code de la filière" required placeholder="Ex. MPI, SML, MIASS..." value={filiereCode} onChange={(e) => setFiliereCode(e.target.value)} />
                <Input label="Nom complet" required placeholder="Ex. Mathématiques, Physique et Informatique" value={filiereName} onChange={(e) => setFiliereName(e.target.value)} />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Description</label>
                  <textarea rows={3} value={filiereDesc} onChange={(e) => setFiliereDesc(e.target.value)} placeholder="Objectifs et compétences..." className="w-full text-sm border border-slate-200 rounded-lg p-2.5" />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setFiliereModal(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm">Créer la filière</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Créer Classe */}
        {classeModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-serif text-lg font-bold text-[#0f2744]">Ajouter une Classe</h3>
                <button onClick={() => setClasseModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateClasse} className="space-y-4">
                <Input label="Code de la classe" required placeholder="Ex. L1-MPI, L2-SML..." value={classeCode} onChange={(e) => setClasseCode(e.target.value)} />
                <Input label="Intitulé officiel" required placeholder="Ex. Licence 1 — MPI" value={classeName} onChange={(e) => setClasseName(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Niveau</label>
                    <select value={classeNiveau} onChange={(e) => setClasseNiveau(e.target.value as any)} className="w-full text-sm border border-slate-200 rounded-lg p-2.5">
                      <option value="L1">Licence 1 (L1)</option>
                      <option value="L2">Licence 2 (L2)</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Filière</label>
                    <select value={classeFiliereId} onChange={(e) => setClasseFiliereId(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg p-2.5">
                      {filieres.map((f) => <option key={f.id} value={f.id}>{f.code}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setClasseModal(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm">Créer la classe</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Créer Matière */}
        {matiereModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200/90 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#0f2744]">Ajouter une Matière</h3>
                  <p className="text-xs text-slate-500">Configurez l&apos;intitulé et assignez les classes concernées</p>
                </div>
                <button onClick={() => setMatiereModal(false)} className="text-slate-400 hover:text-slate-700"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreateMatiere} className="space-y-4">
                <Input label="Code matière" required placeholder="Ex. ANA-1, ELEC, MATH-2..." value={matiereCode} onChange={(e) => setMatiereCode(e.target.value)} />
                <Input label="Intitulé complet" required placeholder="Ex. Analyse Réelle 1, Électricité..." value={matiereName} onChange={(e) => setMatiereName(e.target.value)} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Coefficient" type="number" min="1" max="10" required value={matiereCoeff} onChange={(e) => setMatiereCoeff(e.target.value)} />
                  <Input label="Crédits ECTS" type="number" min="1" max="30" required value={matiereEcts} onChange={(e) => setMatiereEcts(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Filière de référence</label>
                  <select value={matiereFiliereId} onChange={(e) => setMatiereFiliereId(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg p-2.5">
                    {filieres.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.name}</option>)}
                  </select>
                </div>

                {/* Sélecteur de classes concernées / Tronc commun */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Classes concernées (Tronc Commun ou filière) <span className="text-[#e0521c]">*</span>
                  </label>
                  <p className="text-[11px] text-slate-500">
                    Sélectionnez toutes les classes où cette matière est enseignée.
                  </p>
                  
                  {/* Raccourcis de sélection */}
                  <div className="flex flex-wrap gap-1.5 pb-1">
                    <button
                      type="button"
                      onClick={() => setMatiereClasses(["L1-MPI", "L1-SML", "L1-MIASS"])}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      Tout L1 (Maths 1 &amp; 2)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatiereClasses(["L1-MPI", "L1-SML"])}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      L1 MPI + SML (Électricité)
                    </button>
                    <button
                      type="button"
                      onClick={() => setMatiereClasses(["L2-MPI", "L2-SML", "L2-MIASS"])}
                      className="px-2 py-1 text-[11px] font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    >
                      Tout L2
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                    {classes.map((cls) => {
                      const checked = matiereClasses.includes(cls.code);
                      return (
                        <label
                          key={cls.id}
                          className={`flex items-center gap-2 p-2 rounded-md border text-xs font-medium cursor-pointer transition-colors ${
                            checked
                              ? "bg-white border-[#0f2744] text-[#0f2744] shadow-2xs font-bold"
                              : "border-slate-200 text-slate-600 hover:bg-slate-100/60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setMatiereClasses([...matiereClasses, cls.code]);
                              } else {
                                setMatiereClasses(matiereClasses.filter((c) => c !== cls.code));
                              }
                            }}
                            className="rounded border-slate-300 text-[#0f2744] focus:ring-[#0f2744]"
                          />
                          <span>{cls.code}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setMatiereModal(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm">Créer la matière</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Supprimer « {deleteConfirm.name} »</h3>
                  <p className="text-xs text-slate-600 mt-1">Cette action est irréversible et peut affecter les étudiants et cours associés.</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
                <Button variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" className="rounded-lg text-xs" onClick={() => {
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
