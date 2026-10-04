"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Calendar, Clock, Video, Plus, Trash2, Edit2, User, BookOpen,
  CheckCircle2, Copy, ExternalLink, X, Save, Sparkles, AlertCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Matiere, Professeur, SeanceEDT, JourSemaine } from "@/lib/types";
import {
  getStoredMatieres, getStoredProfesseurs, getStoredSeancesEDT,
  saveSeanceEDT, deleteSeanceEDT, generateMeetLink,
} from "@/lib/academicStorage";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const FILIERES = ["MPI", "SML", "MIASS"] as const;
type FiliereCode = "MPI" | "SML" | "MIASS";

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
};

const emptyForm = () => ({
  jour: "Lundi" as JourSemaine,
  heureDebut: "08:30",
  heureFin: "10:30",
  type: "CM" as "CM" | "TD" | "TP",
  profId: "",
  matiereId: "",
  meetUrl: "",
  niveau: "L1" as "L1" | "L2",
  filieres: [] as FiliereCode[],
});

export default function AdminEDTPage() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [seances, setSeances] = useState<SeanceEDT[]>([]);

  const [activeNiveau, setActiveNiveau] = useState<"L1" | "L2">("L1");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Modal / formulaire
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<SeanceEDT | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const reload = () => {
    setMatieres(getStoredMatieres());
    setProfs(getStoredProfesseurs());
    setSeances(getStoredSeancesEDT());
  };

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, []);

  // Séances filtrées par niveau actif
  const seancesDuNiveau = useMemo(() =>
    seances.filter((s) => (s.niveau || "L1") === activeNiveau),
    [seances, activeNiveau]
  );

  // Créneaux horaires uniques triés
  const timeSlots = useMemo(() => {
    const slots = new Set<string>();
    seancesDuNiveau.forEach((s) => slots.add(`${s.heure_debut}–${s.heure_fin}`));
    return Array.from(slots).sort();
  }, [seancesDuNiveau]);

  // Prof sélectionné
  const currentProf = profs.find((p) => p.id === form.profId);

  // Matières disponibles selon le niveau sélectionné dans le formulaire
  const availableMatieres = useMemo(() => {
    return matieres.filter((m) => {
      if (!m.niveau && !m.classes?.length) return true;
      if (m.niveau && m.niveau !== form.niveau) return false;
      return true;
    });
  }, [matieres, form.niveau]);

  // Matières filtrées selon le prof sélectionné
  const profMatieres = useMemo(() => {
    if (!currentProf) return availableMatieres;
    return availableMatieres.filter((m) =>
      currentProf.matieres?.some((pm) => pm.id === m.id || pm.code === m.code) ||
      !currentProf.matieres?.length
    );
  }, [availableMatieres, currentProf]);

  const openCreate = () => {
    setEditingSeance(null);
    setForm({ ...emptyForm(), niveau: activeNiveau });
    setModalOpen(true);
  };

  const openEdit = (s: SeanceEDT) => {
    setEditingSeance(s);
    setForm({
      jour: s.jour,
      heureDebut: s.heure_debut,
      heureFin: s.heure_fin,
      type: s.type_seance || "CM",
      profId: s.professeur_id || "",
      matiereId: "",
      meetUrl: s.meet_url || "",
      niveau: s.niveau || "L1",
      filieres: (s.filieres || []) as FiliereCode[],
    });
    setModalOpen(true);
  };

  const handleGenMeet = () => {
    setForm((f) => ({ ...f, meetUrl: generateMeetLink() }));
  };

  const toggleFiliere = (f: FiliereCode) => {
    setForm((prev) => ({
      ...prev,
      filieres: prev.filieres.includes(f)
        ? prev.filieres.filter((x) => x !== f)
        : [...prev.filieres, f],
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMat = matieres.find((m) => m.id === form.matiereId);
    const selectedProf = profs.find((p) => p.id === form.profId);

    const seance: SeanceEDT = {
      id: editingSeance?.id || `seance-${Date.now()}`,
      classe_id: editingSeance?.classe_id || "",
      jour: form.jour,
      heure_debut: form.heureDebut,
      heure_fin: form.heureFin,
      matiere_nom: selectedMat?.name || editingSeance?.matiere_nom || "Matière",
      matiere_code: selectedMat?.code || editingSeance?.matiere_code || "MAT",
      professeur_nom: selectedProf?.full_name || editingSeance?.professeur_nom || "Prof",
      professeur_id: form.profId || editingSeance?.professeur_id,
      type_seance: form.type,
      meet_url: form.meetUrl || null,
      niveau: form.niveau,
      filieres: form.filieres,
      created_at: editingSeance?.created_at || new Date().toISOString(),
    };

    saveSeanceEDT(seance);
    setSuccessMsg(`Séance ${editingSeance ? "modifiée" : "ajoutée"} — ${seance.matiere_nom} (${form.niveau})`);
    setTimeout(() => setSuccessMsg(null), 3500);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSeanceEDT(id);
    setDeleteConfirm(null);
    setSuccessMsg("Séance supprimée.");
    setTimeout(() => setSuccessMsg(null), 2500);
  };

  const handleCopyMeet = (url: string) => {
    navigator?.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <DashboardLayout role="admin" userName="Administration" userEmail="" matriculeOrTitle="Directeur">
      <div className="space-y-5">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c]">Gestion des Emplois du Temps</span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Tableau hebdomadaire
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Ajoutez des séances par niveau et filière — les étudiants voient automatiquement celles qui les concernent
            </p>
          </div>
          <Button onClick={openCreate} variant="accent" leftIcon={<Plus className="w-4 h-4" />}>
            Ajouter une séance
          </Button>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successMsg}
          </div>
        )}

        {/* Onglets L1 / L2 */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
          {(["L1", "L2"] as const).map((niv) => {
            const cnt = seances.filter((s) => (s.niveau || "L1") === niv).length;
            return (
              <button
                key={niv}
                onClick={() => setActiveNiveau(niv)}
                className={`px-5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
                  activeNiveau === niv ? "bg-[#0f2744] text-white shadow-sm" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Licence {niv === "L1" ? "1" : "2"}
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeNiveau === niv ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"}`}>
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tableau EDT */}
        {timeSlots.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-12 text-center">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-500">Aucune séance pour {activeNiveau}</p>
            <p className="text-xs text-slate-400 mt-1">Cliquez sur « Ajouter une séance » pour commencer.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-sm">
            <table className="w-full min-w-[900px] bg-white text-sm">
              <thead>
                <tr className="bg-[#0f2744]">
                  <th className="px-4 py-3 text-left text-xs font-bold text-white/70 uppercase tracking-wider w-28">Heure</th>
                  {JOURS.map((jour) => {
                    const cnt = seancesDuNiveau.filter((s) => s.jour === jour).length;
                    return (
                      <th key={jour} className="px-3 py-3 text-center text-xs font-bold text-white uppercase tracking-wider">
                        {jour}
                        {cnt > 0 && <div className="text-[10px] font-normal text-white/50 mt-0.5">{cnt}</div>}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, i) => (
                  <tr key={slot} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/60"}>
                    <td className="px-4 py-3 border-r border-slate-100">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-[#e0521c]" />
                        {slot}
                      </div>
                    </td>
                    {JOURS.map((jour) => {
                      const cells = seancesDuNiveau.filter(
                        (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                      );
                      return (
                        <td key={jour} className="px-2 py-2 border-r border-slate-100 align-top min-w-[130px]">
                          {cells.map((s) => {
                            const tc = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                            const fLabel = s.filieres?.length ? s.filieres.join(", ") : "Toutes filières";
                            return (
                              <div key={s.id} className={`rounded-lg border p-2.5 mb-1.5 ${tc.bg} ${tc.border} group relative`}>
                                {/* Actions admin */}
                                <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                                  <button onClick={() => openEdit(s)} className="w-5 h-5 rounded bg-white/80 border border-slate-200 flex items-center justify-center hover:bg-white text-slate-600">
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  <button onClick={() => setDeleteConfirm(s.id)} className="w-5 h-5 rounded bg-white/80 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500">
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                {/* Type */}
                                <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${tc.text} bg-white/60 border ${tc.border}`}>
                                  {s.type_seance || "CM"}
                                </span>

                                {/* Filières */}
                                <div className="mt-1">
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${s.filieres?.length ? "text-[#e0521c] bg-orange-50 border border-orange-200" : "text-slate-500 bg-slate-100 border border-slate-200"}`}>
                                    {fLabel}
                                  </span>
                                </div>

                                {/* Matière */}
                                <p className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mt-1">{s.matiere_nom}</p>
                                <p className="text-[10px] font-mono text-slate-500">{s.matiere_code}</p>

                                {/* Prof */}
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-600">
                                  <User className="w-2.5 h-2.5" />
                                  <span className="truncate">{s.professeur_nom}</span>
                                </div>

                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded mt-1">
                                  🌐 En ligne
                                </span>

                                {/* Meet */}
                                {s.meet_url ? (
                                  <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-slate-200/60">
                                    <a href={s.meet_url} target="_blank" rel="noopener noreferrer"
                                      className="flex-1 flex items-center justify-center gap-1 py-1 rounded text-[10px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                      <Video className="w-2.5 h-2.5" />
                                      Meet
                                      <ExternalLink className="w-2 h-2" />
                                    </a>
                                    <button onClick={() => handleCopyMeet(s.meet_url!)}
                                      className="p-1 border border-slate-200 rounded hover:bg-white text-slate-500">
                                      {copiedLink === s.meet_url
                                        ? <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                        : <Copy className="w-3 h-3" />}
                                    </button>
                                  </div>
                                ) : (
                                  <button onClick={() => openEdit(s)}
                                    className="mt-1.5 w-full text-[10px] text-slate-400 hover:text-[#0f2744] border border-dashed border-slate-200 rounded py-1 flex items-center justify-center gap-1">
                                    <Video className="w-2.5 h-2.5" /> Ajouter Meet
                                  </button>
                                )}

                                {/* Confirm delete */}
                                {deleteConfirm === s.id && (
                                  <div className="mt-2 pt-2 border-t border-red-200 space-y-1">
                                    <p className="text-[10px] text-red-700 font-semibold">Supprimer cette séance ?</p>
                                    <div className="flex gap-1">
                                      <button onClick={() => handleDelete(s.id)} className="flex-1 py-1 rounded bg-red-600 text-white text-[10px] font-bold hover:bg-red-700">
                                        Oui
                                      </button>
                                      <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-1 rounded border border-slate-200 text-[10px] text-slate-600">
                                        Non
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {/* Bouton rapide ajouter */}
                          <button
                            onClick={() => {
                              setEditingSeance(null);
                              const [start, end] = slot.split("–");
                              setForm({ ...emptyForm(), niveau: activeNiveau, jour, heureDebut: start, heureFin: end });
                              setModalOpen(true);
                            }}
                            className="w-full mt-1 py-1.5 text-[10px] text-slate-300 hover:text-[#e0521c] border border-dashed border-slate-100 hover:border-[#e0521c]/30 rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            <Plus className="w-2.5 h-2.5" /> Ajouter
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* === MODAL AJOUT / ÉDITION === */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="font-serif text-base font-bold text-[#0f2744]">
                  {editingSeance ? "Modifier la séance" : "Nouvelle séance"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-5">
                {/* Niveau */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Niveau *</label>
                  <div className="flex gap-2">
                    {(["L1", "L2"] as const).map((n) => (
                      <button key={n} type="button"
                        onClick={() => setForm((f) => ({ ...f, niveau: n }))}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-bold border transition-all ${
                          form.niveau === n ? "bg-[#0f2744] text-white border-[#0f2744]" : "border-slate-200 text-slate-600 hover:border-[#0f2744]"
                        }`}
                      >
                        Licence {n === "L1" ? "1 (L1)" : "2 (L2)"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Filières concernées */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Filières concernées <span className="font-normal text-slate-400">(laisser vide = toutes les filières du niveau)</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {FILIERES.map((f) => (
                      <button key={f} type="button"
                        onClick={() => toggleFiliere(f)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border transition-all ${
                          form.filieres.includes(f)
                            ? "bg-[#e0521c] text-white border-[#e0521c]"
                            : "border-slate-200 text-slate-600 hover:border-[#e0521c]"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                  {form.filieres.length === 0 && (
                    <p className="text-[11px] text-emerald-600 mt-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Tronc commun — visible par toute la {form.niveau}
                    </p>
                  )}
                </div>

                {/* Jour + heures */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jour *</label>
                    <select value={form.jour} onChange={(e) => setForm((f) => ({ ...f, jour: e.target.value as JourSemaine }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]">
                      {JOURS.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Début *</label>
                    <input type="time" value={form.heureDebut} onChange={(e) => setForm((f) => ({ ...f, heureDebut: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fin *</label>
                    <input type="time" value={form.heureFin} onChange={(e) => setForm((f) => ({ ...f, heureFin: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]" />
                  </div>
                </div>

                {/* Type + Prof */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Type de séance *</label>
                    <div className="flex gap-1.5">
                      {(["CM", "TD", "TP"] as const).map((t) => {
                        const tc = TYPE_COLORS[t];
                        return (
                          <button key={t} type="button"
                            onClick={() => setForm((f) => ({ ...f, type: t }))}
                            className={`flex-1 py-2 rounded-lg text-xs font-bold border transition-all ${
                              form.type === t ? `${tc.bg} ${tc.text} ${tc.border}` : "border-slate-200 text-slate-500"
                            }`}
                          >
                            {t}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Enseignant</label>
                    <select value={form.profId} onChange={(e) => setForm((f) => ({ ...f, profId: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]">
                      <option value="">— Sélectionner —</option>
                      {profs.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                    </select>
                  </div>
                </div>

                {/* Matière */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Matière <span className="font-normal text-slate-400">(filtrée selon le niveau)</span>
                  </label>
                  <select value={form.matiereId} onChange={(e) => setForm((f) => ({ ...f, matiereId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]">
                    <option value="">— Sélectionner une matière —</option>
                    {profMatieres.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                    ))}
                  </select>
                  {!editingSeance && !form.matiereId && (
                    <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Sélectionnez une matière ou modifiez une séance existante
                    </p>
                  )}
                </div>

                {/* Lien Meet */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lien Google Meet</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      leftIcon={<Video className="w-4 h-4" />}
                      value={form.meetUrl}
                      onChange={(e) => setForm((f) => ({ ...f, meetUrl: e.target.value }))}
                    />
                    <button type="button" onClick={handleGenMeet}
                      className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold transition-colors">
                      <Sparkles className="w-3.5 h-3.5" />
                      Générer
                    </button>
                  </div>
                  {form.meetUrl && (
                    <p className="text-[11px] text-emerald-600 mt-1 font-mono truncate">{form.meetUrl}</p>
                  )}
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editingSeance ? "Enregistrer" : "Ajouter la séance"}
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
