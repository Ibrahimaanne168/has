"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock, Video, Plus, Trash2, Edit2, User,
  CheckCircle2, Copy, ExternalLink, X, Save, Sparkles, BookOpen,
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

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string; hdr: string }> = {
  CM: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    hdr: "bg-blue-100" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", hdr: "bg-emerald-100" },
  TP: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   hdr: "bg-amber-100" },
};

type FiliereCode = "MPI" | "SML" | "MIASS";

/** Déduit les filières depuis les classes de la matière (ex: ["L1-MPI","L1-SML"] → ["MPI","SML"]) */
function getFilieresFromMatiere(mat: Matiere): FiliereCode[] {
  if (!mat.classes || mat.classes.length === 0) return [];
  const set: FiliereCode[] = [];
  if (mat.classes.some((c) => c.toUpperCase().includes("MPI")))   set.push("MPI");
  if (mat.classes.some((c) => c.toUpperCase().includes("SML")))   set.push("SML");
  if (mat.classes.some((c) => c.toUpperCase().includes("MIASS"))) set.push("MIASS");
  return set;
}

const emptyForm = (niveau: "L1" | "L2" = "L1", jour: JourSemaine = "Lundi") => ({
  jour,
  heureDebut: "08:00",
  heureFin: "10:00",
  type: "CM" as "CM" | "TD" | "TP",
  profId: "",
  matiereId: "",
  meetUrl: "",
  niveau,
});

export default function AdminEDTPage() {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [seances, setSeances] = useState<SeanceEDT[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<SeanceEDT | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm());

  const reload = useCallback(() => {
    setMatieres(getStoredMatieres());
    setProfs(getStoredProfesseurs());
    setSeances(getStoredSeancesEDT());
  }, []);

  useEffect(() => {
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, [reload]);

  // Séances par niveau
  const seancesL1 = useMemo(() => seances.filter((s) => (s.niveau || "L1") === "L1"), [seances]);
  const seancesL2 = useMemo(() => seances.filter((s) => s.niveau === "L2"), [seances]);

  // Créneaux horaires uniques par niveau
  const slotsL1 = useMemo(() => uniqueSlots(seancesL1), [seancesL1]);
  const slotsL2 = useMemo(() => uniqueSlots(seancesL2), [seancesL2]);

  // Matière sélectionnée dans le formulaire (pour affichage auto-filières)
  const selectedMat = matieres.find((m) => m.id === form.matiereId);
  const autoFilieres: FiliereCode[] = selectedMat ? getFilieresFromMatiere(selectedMat) : [];

  // Matières filtrées selon le niveau du formulaire
  const matieresNiveau = useMemo(
    () => matieres.filter((m) => !m.niveau || m.niveau === form.niveau),
    [matieres, form.niveau]
  );

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const openAdd = (niveau: "L1" | "L2", jour: JourSemaine, heureDebut?: string, heureFin?: string) => {
    setEditingSeance(null);
    setForm({ ...emptyForm(niveau, jour), heureDebut: heureDebut || "08:00", heureFin: heureFin || "10:00" });
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
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const mat = matieres.find((m) => m.id === form.matiereId);
    const prof = profs.find((p) => p.id === form.profId);
    const filieres = mat ? getFilieresFromMatiere(mat) : (editingSeance?.filieres as FiliereCode[] | undefined) || [];

    const seance: SeanceEDT = {
      id: editingSeance?.id || `seance-${Date.now()}`,
      classe_id: editingSeance?.classe_id || "",
      jour: form.jour,
      heure_debut: form.heureDebut,
      heure_fin: form.heureFin,
      matiere_nom: mat?.name || editingSeance?.matiere_nom || "",
      matiere_code: mat?.code || editingSeance?.matiere_code || "",
      professeur_nom: prof?.full_name || editingSeance?.professeur_nom || "",
      professeur_id: form.profId || editingSeance?.professeur_id,
      type_seance: form.type,
      meet_url: form.meetUrl || null,
      niveau: form.niveau,
      filieres,
      created_at: editingSeance?.created_at || new Date().toISOString(),
    };

    saveSeanceEDT(seance);
    flash(`✓ ${editingSeance ? "Séance modifiée" : "Cours ajouté"} — ${seance.matiere_nom || "cours"} (${form.niveau})`);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSeanceEDT(id);
    setDeleteConfirm(null);
    flash("Séance supprimée.");
  };

  const handleCopyMeet = (url: string) => {
    navigator?.clipboard?.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <DashboardLayout role="admin" userName="Administration" userEmail="" matriculeOrTitle="Directeur">
      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744]">Emplois du Temps</h1>
            <p className="text-xs text-slate-500 mt-1">
              Cliquez sur une case du tableau pour ajouter un cours — les filières sont déduites automatiquement de la matière
            </p>
          </div>
          <Button onClick={() => openAdd("L1", "Lundi")} variant="accent" leftIcon={<Plus className="w-4 h-4" />}>
            Ajouter un cours
          </Button>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {successMsg}
          </div>
        )}

        {/* === TABLEAU L1 === */}
        <EdtTable
          niveau="L1"
          seances={seancesL1}
          slots={slotsL1}
          profs={profs}
          onAdd={(jour, heureDebut, heureFin) => openAdd("L1", jour, heureDebut, heureFin)}
          onEdit={openEdit}
          onDelete={setDeleteConfirm}
          deleteConfirm={deleteConfirm}
          confirmDelete={handleDelete}
          cancelDelete={() => setDeleteConfirm(null)}
          copiedLink={copiedLink}
          onCopyMeet={handleCopyMeet}
        />

        {/* === TABLEAU L2 === */}
        <EdtTable
          niveau="L2"
          seances={seancesL2}
          slots={slotsL2}
          profs={profs}
          onAdd={(jour, heureDebut, heureFin) => openAdd("L2", jour, heureDebut, heureFin)}
          onEdit={openEdit}
          onDelete={setDeleteConfirm}
          deleteConfirm={deleteConfirm}
          confirmDelete={handleDelete}
          cancelDelete={() => setDeleteConfirm(null)}
          copiedLink={copiedLink}
          onCopyMeet={handleCopyMeet}
        />

        {/* === MODAL AJOUT / ÉDITION === */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <div>
                  <h2 className="font-serif text-base font-bold text-[#0f2744]">
                    {editingSeance ? "Modifier le cours" : `Nouveau cours — ${form.niveau} ${form.jour}`}
                  </h2>
                  {!editingSeance && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      Les filières concernées seront déduites automatiquement de la matière
                    </p>
                  )}
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-5 space-y-4">
                {/* Jour + Heures */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jour *</label>
                    <select value={form.jour}
                      onChange={(e) => setForm((f) => ({ ...f, jour: e.target.value as JourSemaine }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]">
                      {JOURS.map((j) => <option key={j} value={j}>{j}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Début *</label>
                    <input type="time" value={form.heureDebut}
                      onChange={(e) => setForm((f) => ({ ...f, heureDebut: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0f2744]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Fin *</label>
                    <input type="time" value={form.heureFin}
                      onChange={(e) => setForm((f) => ({ ...f, heureFin: e.target.value }))}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0f2744]" />
                  </div>
                </div>

                {/* Type de séance */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Type *</label>
                  <div className="flex gap-2">
                    {(["CM", "TD", "TP"] as const).map((t) => {
                      const tc = TYPE_COLORS[t];
                      return (
                        <button key={t} type="button"
                          onClick={() => setForm((f) => ({ ...f, type: t }))}
                          className={`flex-1 py-2.5 rounded-lg text-xs font-bold border transition-all ${
                            form.type === t ? `${tc.bg} ${tc.text} ${tc.border}` : "border-slate-200 text-slate-500 hover:border-slate-300"
                          }`}>{t}</button>
                      );
                    })}
                  </div>
                </div>

                {/* Matière — avec auto-détection filières */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Matière * <span className="font-normal text-slate-400">({form.niveau})</span>
                  </label>
                  <select value={form.matiereId}
                    onChange={(e) => setForm((f) => ({ ...f, matiereId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]">
                    <option value="">— Choisir une matière —</option>
                    {matieresNiveau.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                    ))}
                  </select>

                  {/* Filières auto-détectées */}
                  {form.matiereId && (
                    <div className="mt-2 flex items-center gap-2 flex-wrap">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="text-[11px] text-slate-500">Filières concernées :</span>
                      {autoFilieres.length === 0 ? (
                        <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          Toutes les filières {form.niveau}
                        </span>
                      ) : (
                        autoFilieres.map((f) => (
                          <span key={f} className="text-[11px] font-bold text-[#e0521c] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                            {f}
                          </span>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Enseignant */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Enseignant</label>
                  <select value={form.profId}
                    onChange={(e) => setForm((f) => ({ ...f, profId: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs focus:ring-1 focus:ring-[#0f2744]">
                    <option value="">— Sélectionner un enseignant —</option>
                    {profs.map((p) => <option key={p.id} value={p.id}>{p.full_name}</option>)}
                  </select>
                </div>

                {/* Lien Google Meet */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lien Google Meet</label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      leftIcon={<Video className="w-4 h-4" />}
                      value={form.meetUrl}
                      onChange={(e) => setForm((f) => ({ ...f, meetUrl: e.target.value }))}
                    />
                    <button type="button"
                      onClick={() => setForm((f) => ({ ...f, meetUrl: generateMeetLink() }))}
                      className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" /> Générer
                    </button>
                  </div>
                  {form.meetUrl && (
                    <p className="text-[10px] text-emerald-600 mt-1 font-mono truncate">{form.meetUrl}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                  <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editingSeance ? "Enregistrer" : "Ajouter le cours"}
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

// ─── Composant tableau EDT ───────────────────────────────────────────────────

interface EdtTableProps {
  niveau: "L1" | "L2";
  seances: SeanceEDT[];
  slots: string[];
  profs: Professeur[];
  onAdd: (jour: JourSemaine, heureDebut: string, heureFin: string) => void;
  onEdit: (s: SeanceEDT) => void;
  onDelete: (id: string) => void;
  deleteConfirm: string | null;
  confirmDelete: (id: string) => void;
  cancelDelete: () => void;
  copiedLink: string | null;
  onCopyMeet: (url: string) => void;
}

function EdtTable({
  niveau, seances, slots, onAdd, onEdit, onDelete,
  deleteConfirm, confirmDelete, cancelDelete, copiedLink, onCopyMeet,
}: EdtTableProps) {
  const niveauLabel = niveau === "L1" ? "Licence 1" : "Licence 2";
  const niveauColor = niveau === "L1" ? "bg-[#0f2744]" : "bg-[#1a3a5c]";

  return (
    <div>
      {/* Section header */}
      <div className={`flex items-center justify-between px-5 py-3 ${niveauColor} rounded-t-xl`}>
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm font-bold text-white">{niveauLabel}</span>
          <span className="text-[11px] text-white/60">{seances.length} séance{seances.length !== 1 ? "s" : ""} cette semaine</span>
        </div>
        <button
          onClick={() => onAdd("Lundi", "08:00", "10:00")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold transition-colors border border-white/20"
        >
          <Plus className="w-3 h-3" /> Ajouter
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200/90 py-12 text-center">
          <p className="text-sm text-slate-400 font-semibold">Aucun cours pour {niveauLabel}</p>
          <p className="text-xs text-slate-300 mt-1">Cliquez sur « Ajouter » ou sur une case du tableau pour commencer</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-t-0 border-slate-200/90 rounded-b-xl shadow-sm">
          <table className="w-full min-w-[900px] bg-white text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-28">Heure</th>
                {JOURS.map((jour) => {
                  const cnt = seances.filter((s) => s.jour === jour).length;
                  return (
                    <th key={jour}
                      className="px-2 py-2.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors group"
                      onClick={() => onAdd(jour, "08:00", "10:00")}
                      title={`Ajouter un cours le ${jour} en ${niveau}`}
                    >
                      <div className="flex flex-col items-center gap-0.5">
                        <span>{jour}</span>
                        <div className="flex items-center gap-1">
                          {cnt > 0 && <span className="text-[9px] text-slate-400">{cnt}</span>}
                          <Plus className="w-2.5 h-2.5 text-slate-300 group-hover:text-[#e0521c] transition-colors" />
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, i) => {
                const [debut, fin] = slot.split("–");
                return (
                  <tr key={slot} className={i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}>
                    <td className="px-4 py-2 border-r border-slate-100">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-slate-600 whitespace-nowrap">
                        <Clock className="w-3 h-3 text-[#e0521c]" />
                        {slot}
                      </div>
                    </td>
                    {JOURS.map((jour) => {
                      const cells = seances.filter(
                        (s) => s.jour === jour && `${s.heure_debut}–${s.heure_fin}` === slot
                      );
                      return (
                        <td key={jour}
                          className="px-1.5 py-1.5 border-r border-slate-100 align-top min-w-[130px] group/cell cursor-pointer hover:bg-slate-50/80"
                          onClick={(e) => {
                            // Clic sur la cellule vide = ajouter
                            if ((e.target as HTMLElement).closest("[data-seance]")) return;
                            onAdd(jour, debut || "08:00", fin || "10:00");
                          }}
                        >
                          {cells.map((s) => {
                            const tc = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                            const fLabel = s.filieres?.length
                              ? s.filieres.length === 3 ? "Toutes" : s.filieres.join(", ")
                              : "Toutes";
                            return (
                              <div key={s.id} data-seance="1"
                                className={`rounded-lg border p-2 mb-1 ${tc.bg} ${tc.border} relative group/card`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                {/* Actions hover */}
                                <div className="absolute top-1 right-1 opacity-0 group-hover/card:opacity-100 flex gap-0.5 transition-opacity z-10">
                                  <button onClick={() => onEdit(s)}
                                    className="w-5 h-5 rounded bg-white/90 border border-slate-200 flex items-center justify-center hover:bg-white text-slate-600 shadow-xs">
                                    <Edit2 className="w-2.5 h-2.5" />
                                  </button>
                                  <button onClick={() => onDelete(s.id)}
                                    className="w-5 h-5 rounded bg-white/90 border border-red-200 flex items-center justify-center hover:bg-red-50 text-red-500 shadow-xs">
                                    <Trash2 className="w-2.5 h-2.5" />
                                  </button>
                                </div>

                                {/* Type + filières */}
                                <div className="flex items-center gap-1 mb-1 pr-6">
                                  <span className={`text-[9px] font-black uppercase px-1 py-0.5 rounded ${tc.text} bg-white/60 border ${tc.border}`}>
                                    {s.type_seance || "CM"}
                                  </span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    fLabel === "Toutes" ? "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                      : "text-[#e0521c] bg-orange-50 border border-orange-200"
                                  }`}>{fLabel}</span>
                                </div>

                                {/* Matière */}
                                <p className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-2">{s.matiere_nom}</p>
                                <p className="text-[9px] font-mono text-slate-400">{s.matiere_code}</p>

                                {/* Prof */}
                                {s.professeur_nom && (
                                  <div className="flex items-center gap-1 mt-1 text-[9px] text-slate-500">
                                    <User className="w-2 h-2" />
                                    <span className="truncate">{s.professeur_nom}</span>
                                  </div>
                                )}

                                <span className="inline-flex items-center text-[9px] font-semibold text-emerald-700 bg-white/60 border border-emerald-200 px-1.5 py-0.5 rounded mt-1">
                                  🌐 En ligne
                                </span>

                                {/* Meet */}
                                {s.meet_url ? (
                                  <div className="flex gap-1 mt-1.5 pt-1 border-t border-slate-200/40">
                                    <a href={s.meet_url} target="_blank" rel="noopener noreferrer"
                                      className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                      <Video className="w-2.5 h-2.5" /> Meet
                                      <ExternalLink className="w-2 h-2" />
                                    </a>
                                    <button onClick={() => onCopyMeet(s.meet_url!)}
                                      className="p-1 border border-slate-200 rounded hover:bg-white text-slate-400">
                                      {copiedLink === s.meet_url
                                        ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                                        : <Copy className="w-2.5 h-2.5" />}
                                    </button>
                                  </div>
                                ) : (
                                  <button onClick={() => onEdit(s)}
                                    className="mt-1 w-full text-[9px] text-slate-300 hover:text-[#0f2744] border border-dashed border-slate-100 hover:border-slate-300 rounded py-0.5 flex items-center justify-center gap-1">
                                    <Video className="w-2.5 h-2.5" /> Meet
                                  </button>
                                )}

                                {/* Confirm delete */}
                                {deleteConfirm === s.id && (
                                  <div className="mt-1.5 pt-1.5 border-t border-red-200 space-y-1">
                                    <p className="text-[9px] text-red-700 font-semibold">Supprimer ?</p>
                                    <div className="flex gap-1">
                                      <button onClick={() => confirmDelete(s.id)}
                                        className="flex-1 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold">Oui</button>
                                      <button onClick={cancelDelete}
                                        className="flex-1 py-0.5 rounded border border-slate-200 text-[9px] text-slate-600">Non</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}

                          {/* Zone cliquable vide */}
                          {cells.length === 0 && (
                            <div className="w-full h-full min-h-[40px] flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                              <Plus className="w-3.5 h-3.5 text-[#e0521c]" />
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function uniqueSlots(seances: SeanceEDT[]): string[] {
  const set = new Set<string>();
  seances.forEach((s) => set.add(`${s.heure_debut}–${s.heure_fin}`));
  return Array.from(set).sort();
}
