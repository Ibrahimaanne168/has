"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Clock, Video, Plus, Trash2, Edit2, CheckCircle2, Copy,
  ExternalLink, X, Save, Sparkles, BookOpen, Settings,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Matiere, SeanceEDT, JourSemaine } from "@/lib/types";
import {
  getStoredMatieres, getStoredSeancesEDT,
  saveSeanceEDT, deleteSeanceEDT,
} from "@/lib/academicStorage";

const JOURS: JourSemaine[] = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
const SLOTS_KEY = "has_edt_custom_slots_v1";

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  CM: { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200" },
  TD: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  TP: { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200" },
};

function getFilieresFromMatiere(mat: Matiere): string[] {
  if (!mat.classes || mat.classes.length === 0) return [];
  const set: string[] = [];
  if (mat.classes.some((c) => c.toUpperCase().includes("MPI")))   set.push("MPI");
  if (mat.classes.some((c) => c.toUpperCase().includes("SML")))   set.push("SML");
  if (mat.classes.some((c) => c.toUpperCase().includes("MIASS"))) set.push("MIASS");
  return set;
}

function getCurrentWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
  return `du ${fmt(monday)} au ${fmt(sunday)}`;
}

function loadSlots(): string[] {
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSlots(slots: string[]) {
  localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
}

const emptyForm = (niveau: "L1" | "L2" = "L1", jour: JourSemaine = "Lundi", slot = "") => {
  const [debut, fin] = slot.split("–");
  return {
    jour,
    heureDebut: debut || "08:00",
    heureFin:   fin   || "10:00",
    type: "CM" as "CM" | "TD" | "TP",
    matiereId: "",
    meetUrl: "",
    niveau,
  };
};

export default function AdminEDTPage() {
  const [matieres,      setMatieres]      = useState<Matiere[]>([]);
  const [seances,       setSeances]       = useState<SeanceEDT[]>([]);
  const [slots,         setSlots]         = useState<string[]>([]);
  const [successMsg,    setSuccessMsg]    = useState<string | null>(null);
  const [copiedLink,    setCopiedLink]    = useState<string | null>(null);
  const [modalOpen,     setModalOpen]     = useState(false);
  const [slotPanelOpen, setSlotPanelOpen] = useState(false);
  const [editingSeance, setEditingSeance] = useState<SeanceEDT | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [form,          setForm]          = useState(emptyForm());
  const [newSlotDebut,  setNewSlotDebut]  = useState("08:00");
  const [newSlotFin,    setNewSlotFin]    = useState("10:00");

  const reload = useCallback(() => {
    setMatieres(getStoredMatieres());
    setSeances(getStoredSeancesEDT());
  }, []);

  useEffect(() => {
    setSlots(loadSlots());
    reload();
    window.addEventListener("has_academic_storage_updated", reload);
    return () => window.removeEventListener("has_academic_storage_updated", reload);
  }, [reload]);

  const seancesL1 = useMemo(() => seances.filter((s) => (s.niveau || "L1") === "L1"), [seances]);
  const seancesL2 = useMemo(() => seances.filter((s) => s.niveau === "L2"),            [seances]);

  const selectedMat  = matieres.find((m) => m.id === form.matiereId);
  const autoFilieres = selectedMat ? getFilieresFromMatiere(selectedMat) : [];
  const matieresNiveau = useMemo(
    () => matieres.filter((m) => !m.niveau || m.niveau === form.niveau),
    [matieres, form.niveau]
  );

  const flash = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  // ─── Gestion des créneaux ────────────────────────────────────────
  const addSlot = () => {
    if (!newSlotDebut || !newSlotFin || newSlotDebut >= newSlotFin) return;
    const key = `${newSlotDebut}–${newSlotFin}`;
    if (slots.includes(key)) return;
    const next = [...slots, key].sort();
    setSlots(next);
    saveSlots(next);
    flash(`✓ Créneau ${key} ajouté`);
  };

  const removeSlot = (key: string) => {
    const next = slots.filter((s) => s !== key);
    setSlots(next);
    saveSlots(next);
  };

  // ─── Modal cours ─────────────────────────────────────────────────
  const openAdd = (niveau: "L1" | "L2", jour: JourSemaine, slot: string) => {
    setEditingSeance(null);
    setForm(emptyForm(niveau, jour, slot));
    setModalOpen(true);
  };

  const openEdit = (s: SeanceEDT) => {
    setEditingSeance(s);
    setForm({
      jour: s.jour, heureDebut: s.heure_debut, heureFin: s.heure_fin,
      type: s.type_seance || "CM", matiereId: "", meetUrl: s.meet_url || "", niveau: s.niveau || "L1",
    });
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const mat = matieres.find((m) => m.id === form.matiereId);
    const filieres = mat
      ? getFilieresFromMatiere(mat) as ("MPI" | "SML" | "MIASS")[]
      : (editingSeance?.filieres as ("MPI" | "SML" | "MIASS")[] | undefined) || [];

    const seance: SeanceEDT = {
      id:            editingSeance?.id || `seance-${Date.now()}`,
      classe_id:     editingSeance?.classe_id || "",
      jour:          form.jour,
      heure_debut:   form.heureDebut,
      heure_fin:     form.heureFin,
      matiere_nom:   mat?.name || editingSeance?.matiere_nom || "",
      matiere_code:  mat?.code || editingSeance?.matiere_code || "",
      professeur_nom: editingSeance?.professeur_nom || "",
      professeur_id: editingSeance?.professeur_id,
      type_seance:   form.type,
      meet_url:      form.meetUrl || null,
      niveau:        form.niveau,
      filieres,
      created_at:    editingSeance?.created_at || new Date().toISOString(),
    };

    saveSeanceEDT(seance);

    // Si le créneau n'existe pas encore dans les slots, l'ajouter automatiquement
    const slotKey = `${form.heureDebut}–${form.heureFin}`;
    if (!slots.includes(slotKey)) {
      const next = [...slots, slotKey].sort();
      setSlots(next);
      saveSlots(next);
    }

    flash(`✓ ${editingSeance ? "Séance modifiée" : "Cours ajouté"} — ${seance.matiere_nom || "cours"} (${form.niveau})`);
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteSeanceEDT(id);
    setDeleteConfirm(null);
    flash("Séance supprimée.");
  };

  const weekLabel = getCurrentWeekRange();

  return (
    <DashboardLayout role="admin" userName="Administration" userEmail="" matriculeOrTitle="Directeur">

      {/* ── MODAL COURS ─────────────────────────────────────────── */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h2 className="font-serif text-base font-bold text-[#0f2744]">
                  {editingSeance ? "Modifier le cours" : `Ajouter — ${form.niveau} · ${form.jour}`}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {form.heureDebut} → {form.heureFin} · Filières déduites de la matière
                </p>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              {/* Horaire */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heure début *</label>
                  <input type="time" value={form.heureDebut}
                    onChange={(e) => setForm((f) => ({ ...f, heureDebut: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0f2744]" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Heure fin *</label>
                  <input type="time" value={form.heureFin}
                    onChange={(e) => setForm((f) => ({ ...f, heureFin: e.target.value }))}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0f2744]" />
                </div>
              </div>
              {/* Type */}
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
              {/* Matière */}
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
                {form.matiereId && (
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-500">Filières :</span>
                    {autoFilieres.length === 0 ? (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        Toutes filières {form.niveau}
                      </span>
                    ) : autoFilieres.map((f) => (
                      <span key={f} className="text-[11px] font-bold text-[#e0521c] bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">{f}</span>
                    ))}
                  </div>
                )}
              </div>
              {/* Meet */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lien Google Meet</label>
                <div className="flex gap-2">
                  <Input placeholder="https://meet.google.com/abc-defg-hij" leftIcon={<Video className="w-4 h-4" />}
                    value={form.meetUrl} onChange={(e) => setForm((f) => ({ ...f, meetUrl: e.target.value }))} />
                  <a href="https://meet.new" target="_blank" rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-1 px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 text-xs font-bold whitespace-nowrap">
                    <Sparkles className="w-3.5 h-3.5" /> Créer un Meet
                  </a>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Cliquez « Créer un Meet », copiez le lien depuis Google, puis collez-le ici.
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
                <Button type="button" variant="outline" size="sm" onClick={() => setModalOpen(false)}>Annuler</Button>
                <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                  {editingSeance ? "Enregistrer" : "Ajouter le cours"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PANNEAU CRÉNEAUX ────────────────────────────────────── */}
      {slotPanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h2 className="font-serif text-base font-bold text-[#0f2744]">Gérer les créneaux</h2>
              <button onClick={() => setSlotPanelOpen(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {/* Ajouter un créneau */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">Ajouter un créneau horaire</p>
                <div className="flex items-center gap-2">
                  <input type="time" value={newSlotDebut}
                    onChange={(e) => setNewSlotDebut(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0f2744]" />
                  <span className="text-slate-400 text-xs font-bold">→</span>
                  <input type="time" value={newSlotFin}
                    onChange={(e) => setNewSlotFin(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-[#0f2744]" />
                  <button onClick={addSlot}
                    className="h-10 px-3 bg-[#0f2744] hover:bg-[#183a62] text-white rounded-lg text-xs font-bold shrink-0">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {newSlotDebut >= newSlotFin && newSlotDebut && newSlotFin && (
                  <p className="text-[10px] text-red-500 mt-1">L&apos;heure de fin doit être après le début</p>
                )}
              </div>

              {/* Liste des créneaux */}
              <div>
                <p className="text-xs font-bold text-slate-700 mb-2">
                  Créneaux actuels ({slots.length})
                </p>
                {slots.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Aucun créneau — ajoutez-en ci-dessus</p>
                ) : (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                    {slots.map((slot) => (
                      <div key={slot} className="flex items-center justify-between px-3 py-2 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-[#e0521c]" />
                          <span className="text-xs font-bold text-slate-700">{slot}</span>
                        </div>
                        <button onClick={() => removeSlot(slot)}
                          className="p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
              Emploi du Temps — <span className="text-slate-500 font-semibold normal-case">{weekLabel}</span>
            </p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744]">Gestion des Emplois du Temps</h1>
            <p className="text-xs text-slate-500 mt-1">
              {slots.length === 0
                ? "Commencez par ajouter vos créneaux horaires avec le bouton ⚙ puis cliquez une case pour ajouter un cours"
                : "Cliquez sur une case pour ajouter un cours"}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button onClick={() => setSlotPanelOpen(true)} variant="outline" size="sm"
              leftIcon={<Settings className="w-4 h-4" />}>
              Gérer les créneaux ({slots.length})
            </Button>
            <Button onClick={() => openAdd("L1", "Lundi", slots[0] || "")} variant="accent"
              leftIcon={<Plus className="w-4 h-4" />}>
              Ajouter un cours
            </Button>
          </div>
        </div>

        {successMsg && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" /> {successMsg}
          </div>
        )}

        {/* Tableaux */}
        <EdtTable niveau="L1" seances={seancesL1} slots={slots}
          onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteConfirm}
          deleteConfirm={deleteConfirm} confirmDelete={handleDelete} cancelDelete={() => setDeleteConfirm(null)}
          copiedLink={copiedLink}
          onCopyMeet={(u) => { navigator?.clipboard?.writeText(u); setCopiedLink(u); setTimeout(() => setCopiedLink(null), 2000); }}
          onOpenSlots={() => setSlotPanelOpen(true)}
        />
        <EdtTable niveau="L2" seances={seancesL2} slots={slots}
          onAdd={openAdd} onEdit={openEdit} onDelete={setDeleteConfirm}
          deleteConfirm={deleteConfirm} confirmDelete={handleDelete} cancelDelete={() => setDeleteConfirm(null)}
          copiedLink={copiedLink}
          onCopyMeet={(u) => { navigator?.clipboard?.writeText(u); setCopiedLink(u); setTimeout(() => setCopiedLink(null), 2000); }}
          onOpenSlots={() => setSlotPanelOpen(true)}
        />
      </div>
    </DashboardLayout>
  );
}

// ─── Tableau EDT ──────────────────────────────────────────────────────────────

interface EdtTableProps {
  niveau: "L1" | "L2";
  seances: SeanceEDT[];
  slots: string[];
  onAdd: (niveau: "L1" | "L2", jour: JourSemaine, slot: string) => void;
  onEdit: (s: SeanceEDT) => void;
  onDelete: (id: string) => void;
  deleteConfirm: string | null;
  confirmDelete: (id: string) => void;
  cancelDelete: () => void;
  copiedLink: string | null;
  onCopyMeet: (url: string) => void;
  onOpenSlots: () => void;
}

function EdtTable({ niveau, seances, slots, onAdd, onEdit, onDelete, deleteConfirm, confirmDelete, cancelDelete, copiedLink, onCopyMeet, onOpenSlots }: EdtTableProps) {
  const niveauLabel = niveau === "L1" ? "Licence 1" : "Licence 2";
  const bg = niveau === "L1" ? "bg-[#0f2744]" : "bg-[#1a3a5c]";

  return (
    <div>
      <div className={`flex items-center justify-between px-5 py-3 rounded-t-xl ${bg}`}>
        <div className="flex items-center gap-3">
          <span className="font-serif text-sm font-bold text-white">{niveauLabel}</span>
          <span className="text-[11px] text-white/50">{seances.length} séance{seances.length !== 1 ? "s" : ""}</span>
        </div>
        <button onClick={() => onAdd(niveau, "Lundi", slots[0] || "")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold border border-white/20">
          <Plus className="w-3 h-3" /> Ajouter
        </button>
      </div>

      {slots.length === 0 ? (
        <div className="bg-white border border-t-0 border-slate-200/90 rounded-b-xl py-12 text-center">
          <Clock className="w-8 h-8 text-slate-200 mx-auto mb-3" />
          <p className="text-sm text-slate-400 font-semibold">Aucun créneau horaire défini</p>
          <p className="text-xs text-slate-300 mt-1 mb-4">Ajoutez vos créneaux pour afficher le tableau</p>
          <button onClick={onOpenSlots}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0f2744] text-white text-xs font-bold rounded-lg hover:bg-[#183a62]">
            <Settings className="w-3.5 h-3.5" /> Gérer les créneaux
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto border border-t-0 border-slate-200/90 rounded-b-xl shadow-sm">
          <table className="w-full min-w-[900px] bg-white text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-2.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wider w-32 border-r border-slate-200">
                  Heure
                </th>
                {JOURS.map((jour) => (
                  <th key={jour} className="px-3 py-2.5 text-center text-[11px] font-bold text-slate-500 uppercase tracking-wider border-r border-slate-200 last:border-r-0">
                    {jour}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {slots.map((slot, i) => {
                const [debut, fin] = slot.split("–");
                return (
                  <tr key={slot} className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-4 py-2 border-r border-slate-100 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700">
                        <Clock className="w-3 h-3 text-[#e0521c] shrink-0" />
                        {debut} – {fin}
                      </div>
                    </td>
                    {JOURS.map((jour) => {
                      const cells = seances.filter(
                        (s) => s.jour === jour && s.heure_debut === debut && s.heure_fin === fin
                      );
                      return (
                        <td key={jour}
                          className="px-1.5 py-1.5 border-r border-slate-100 last:border-r-0 align-top min-w-[130px] cursor-pointer hover:bg-[#e0521c]/5 transition-colors group/cell"
                          onClick={(e) => {
                            if ((e.target as HTMLElement).closest("[data-seance]")) return;
                            onAdd(niveau, jour, slot);
                          }}
                        >
                          {cells.map((s) => {
                            const tc = TYPE_COLORS[s.type_seance || "CM"] || TYPE_COLORS.CM;
                            const fLabel = s.filieres?.length
                              ? s.filieres.length >= 3 ? "Toutes" : s.filieres.join(", ")
                              : "Toutes";
                            return (
                              <div key={s.id} data-seance="1"
                                className={`rounded-lg border p-2 mb-1 ${tc.bg} ${tc.border} relative group/card`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <div className="absolute top-1 right-1 opacity-0 group-hover/card:opacity-100 flex gap-0.5 z-10">
                                  <button onClick={() => onEdit(s)} className="w-5 h-5 rounded bg-white/90 border border-slate-200 flex items-center justify-center hover:bg-white shadow-xs">
                                    <Edit2 className="w-2.5 h-2.5 text-slate-600" />
                                  </button>
                                  <button onClick={() => onDelete(s.id)} className="w-5 h-5 rounded bg-white/90 border border-red-200 flex items-center justify-center hover:bg-red-50">
                                    <Trash2 className="w-2.5 h-2.5 text-red-500" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1 mb-1 pr-10">
                                  <span className={`text-[9px] font-black uppercase px-1 py-0.5 rounded bg-white/60 border ${tc.border} ${tc.text}`}>{s.type_seance || "CM"}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${fLabel === "Toutes" ? "text-emerald-700 bg-emerald-50 border border-emerald-200" : "text-[#e0521c] bg-orange-50 border border-orange-200"}`}>{fLabel}</span>
                                </div>
                                <p className="text-[11px] font-bold text-slate-900 leading-tight line-clamp-2">{s.matiere_nom}</p>
                                <p className="text-[9px] font-mono text-slate-400">{s.matiere_code}</p>
                                <span className="inline-flex items-center text-[9px] font-semibold text-emerald-700 bg-white/60 border border-emerald-200 px-1.5 py-0.5 rounded mt-1">🌐 En ligne</span>
                                {s.meet_url ? (
                                  <div className="flex gap-1 mt-1.5 pt-1 border-t border-slate-200/40">
                                    <a href={s.meet_url} target="_blank" rel="noopener noreferrer"
                                      className="flex-1 flex items-center justify-center gap-0.5 py-1 rounded text-[9px] font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                                      <Video className="w-2.5 h-2.5" /> Meet <ExternalLink className="w-2 h-2" />
                                    </a>
                                    <button onClick={() => onCopyMeet(s.meet_url!)} className="p-1 border border-slate-200 rounded hover:bg-white text-slate-400">
                                      {copiedLink === s.meet_url ? <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" /> : <Copy className="w-2.5 h-2.5" />}
                                    </button>
                                  </div>
                                ) : (
                                  <button onClick={() => onEdit(s)} className="mt-1 w-full text-[9px] text-slate-300 hover:text-[#0f2744] border border-dashed border-slate-100 hover:border-slate-300 rounded py-0.5 flex items-center justify-center gap-1">
                                    <Video className="w-2.5 h-2.5" /> Ajouter Meet
                                  </button>
                                )}
                                {deleteConfirm === s.id && (
                                  <div className="mt-1.5 pt-1.5 border-t border-red-200 space-y-1">
                                    <p className="text-[9px] text-red-700 font-semibold">Supprimer ?</p>
                                    <div className="flex gap-1">
                                      <button onClick={() => confirmDelete(s.id)} className="flex-1 py-0.5 rounded bg-red-600 text-white text-[9px] font-bold">Oui</button>
                                      <button onClick={cancelDelete} className="flex-1 py-0.5 rounded border border-slate-200 text-[9px] text-slate-600">Non</button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          {cells.length === 0 && (
                            <div className="w-full h-10 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity">
                              <Plus className="w-4 h-4 text-[#e0521c]/50" />
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
