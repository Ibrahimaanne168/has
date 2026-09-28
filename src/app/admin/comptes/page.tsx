"use client";

import React, { useState } from "react";
import {
  Search, Plus, Edit2, Trash2, User, GraduationCap, Shield,
  CheckCircle2, AlertCircle, X, Save, UserCheck, KeyRound,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS, MOCK_STUDENT, MOCK_CLASSES, MOCK_FILIERES } from "@/lib/data/mock-data";
import { Profile, UserRole } from "@/lib/types";

// Simulated combined user list
const ALL_USERS: Profile[] = [MOCK_STUDENT, ...MOCK_PROFESSEURS];

export default function AdminComptesPage() {
  const [users, setUsers] = useState<Profile[]>(ALL_USERS);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("etudiant");
  const [formFiliereId, setFormFiliereId] = useState("");
  const [formClasseId, setFormClasseId] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSpecialite, setFormSpecialite] = useState("");

  const openCreate = () => {
    setEditUser(null);
    setFormName(""); setFormEmail(""); setFormRole("etudiant");
    setFormFiliereId(""); setFormClasseId(""); setFormPhone(""); setFormSpecialite("");
    setModalOpen(true);
  };

  const openEdit = (u: Profile) => {
    setEditUser(u);
    setFormName(u.full_name); setFormEmail(u.email); setFormRole(u.role);
    setFormFiliereId(u.filiere_id || ""); setFormClasseId(u.classe_id || "");
    setFormPhone(u.phone || ""); setFormSpecialite(u.specialite || "");
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();
    if (editUser) {
      setUsers((prev) => prev.map((u) => u.id === editUser.id ? {
        ...u, full_name: formName, email: formEmail, role: formRole,
        filiere_id: formFiliereId || null, classe_id: formClasseId || null,
        phone: formPhone || null, specialite: formSpecialite || null,
        updated_at: new Date().toISOString(),
      } : u));
      setSuccessMsg(`Le compte de ${formName} a été mis à jour.`);
    } else {
      const newUser: Profile = {
        id: `user-${Date.now()}`,
        email: formEmail, full_name: formName, role: formRole,
        username: formEmail.split("@")[0].toLowerCase(),
        phone: formPhone || null, matricule: `HAS-${year}-${formRole.toUpperCase().slice(0,3)}-${Math.floor(1000+Math.random()*9000)}`,
        filiere_id: formFiliereId || null, classe_id: formClasseId || null,
        bio: null, specialite: formSpecialite || null, avatar_url: null,
        is_active: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      };
      setUsers((prev) => [newUser, ...prev]);
      setSuccessMsg(`Le compte de ${formName} a été créé. Un email de bienvenue a été envoyé.`);
    }
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (userId: string) => {
    const u = users.find((u) => u.id === userId);
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setDeleteConfirm(null);
    setSuccessMsg(`Le compte de ${u?.full_name || "l'utilisateur"} a été désactivé.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      (u.matricule?.toLowerCase() || "").includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleInfo: Record<UserRole, { badge: React.ReactNode; icon: React.ReactNode }> = {
    etudiant: { badge: <Badge variant="neutral" size="sm"><UserCheck className="w-3 h-3 mr-1 inline" />Étudiant</Badge>, icon: <User className="w-4 h-4" /> },
    professeur: { badge: <Badge variant="primary" size="sm"><GraduationCap className="w-3 h-3 mr-1 inline" />Enseignant</Badge>, icon: <GraduationCap className="w-4 h-4" /> },
    admin: { badge: <Badge variant="accent" size="sm"><Shield className="w-3 h-3 mr-1 inline" />Admin</Badge>, icon: <Shield className="w-4 h-4" /> },
  };

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="Directeur Général">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#0f2744]">Gestion des Comptes Utilisateurs</h1>
            <p className="text-xs text-slate-500 mt-1">Création, modification et gestion des accès — {users.length} comptes actifs</p>
          </div>
          <Button variant="accent" size="md" onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Créer un compte
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Rechercher par nom, email ou matricule..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744]" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {(["all", "etudiant", "professeur", "admin"] as const).map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${roleFilter === r ? "bg-[#0f2744] text-white border-[#0f2744]" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"}`}>
                {r === "all" ? "Tous" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table des utilisateurs */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Utilisateur", "Matricule", "Rôle", "Filière / Classe", "Contact", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#0f2744]/10 flex items-center justify-center text-[#0f2744] shrink-0">
                          {roleInfo[u.role].icon}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 text-xs">{u.full_name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-xs text-slate-700">{u.matricule || "—"}</span>
                    </td>
                    <td className="px-4 py-3">{roleInfo[u.role].badge}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-600">{u.filiere_id ? "ISN" : "—"}</div>
                      <div className="text-[11px] text-slate-400">{u.classe_id ? "L2-ISN" : u.specialite || "—"}</div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{u.phone || "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(u)} title="Modifier" className="p-1.5 text-slate-500 hover:text-[#0f2744] hover:bg-slate-100 rounded-md">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(u.id)} title="Désactiver" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="p-12 text-center text-sm text-slate-500">Aucun utilisateur trouvé avec ces critères.</div>
            )}
          </div>
        </div>

        {/* Modal Création / Édition */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                  {editUser ? "Modifier le compte" : "Créer un compte"}
                </h3>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Nom complet" required placeholder="Ex. Aminata Diallo" value={formName} onChange={(e) => setFormName(e.target.value)} />
                  <Input label="Email" type="email" required placeholder="aminata@halil-academie.com" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Rôle <span className="text-red-500">*</span></label>
                    <select value={formRole} onChange={(e) => setFormRole(e.target.value as UserRole)}
                      className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]">
                      <option value="etudiant">Étudiant</option>
                      <option value="professeur">Professeur / Enseignant</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <Input label="Téléphone" placeholder="+223 ..." value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                </div>
                {formRole === "etudiant" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Filière</label>
                      <select value={formFiliereId} onChange={(e) => setFormFiliereId(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]">
                        <option value="">— Choisir une filière —</option>
                        {MOCK_FILIERES.map((f) => <option key={f.id} value={f.id}>{f.code} — {f.name}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Classe</label>
                      <select value={formClasseId} onChange={(e) => setFormClasseId(e.target.value)}
                        className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]">
                        <option value="">— Choisir une classe —</option>
                        {MOCK_CLASSES.map((c) => <option key={c.id} value={c.id}>{c.code} — {c.niveau}</option>)}
                      </select>
                    </div>
                  </div>
                )}
                {(formRole === "professeur" || formRole === "admin") && (
                  <Input label="Spécialité / Département" placeholder="Ex. Génie Logiciel & Bases de Données" value={formSpecialite} onChange={(e) => setFormSpecialite(e.target.value)} />
                )}
                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editUser ? "Enregistrer" : "Créer le compte"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal suppression */}
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0"><AlertCircle className="w-5 h-5 text-red-600" /></div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Désactiver ce compte</h3>
                  <p className="text-xs text-slate-600 mt-1">Le compte sera désactivé et l&apos;accès révoqué immédiatement. Cette action est réversible.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(deleteConfirm)}>Désactiver</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
