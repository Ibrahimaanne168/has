"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, User, GraduationCap, Shield,
  CheckCircle2, AlertCircle, X, Save, UserCheck, BookOpen,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT, MOCK_CLASSES, MOCK_FILIERES, MOCK_MATIERES } from "@/lib/data/mock-data";
import { getStoredProfesseurs, saveProfesseur, deleteProfesseur } from "@/lib/academicStorage";
import { Profile, UserRole, Professeur, MatiereAssignee } from "@/lib/types";

export default function AdminComptesPage() {
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [users, setUsers] = useState<Profile[]>([MOCK_STUDENT]);
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
  const [formBio, setFormBio] = useState("");

  // Pour les professeurs: matières, niveaux et classes
  const [selectedMatieres, setSelectedMatieres] = useState<string[]>([]);
  const [selectedNiveaux, setSelectedNiveaux] = useState<string[]>(["L1"]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["L1 MPI"]);

  const loadData = () => {
    const storedProfs = getStoredProfesseurs();
    setProfs(storedProfs);
    const combined: Profile[] = [
      MOCK_STUDENT,
      ...storedProfs.map((p) => ({
        id: p.id,
        email: p.email,
        username: p.username || null,
        full_name: p.full_name,
        role: "professeur" as UserRole,
        phone: p.phone,
        matricule: p.matricule,
        filiere_id: p.filiere_id || null,
        classe_id: null,
        bio: p.bio,
        specialite: p.specialite,
        avatar_url: p.photo || p.avatar_url || null,
        is_active: p.is_active,
        created_at: p.created_at || new Date().toISOString(),
        updated_at: p.updated_at || new Date().toISOString(),
      })),
    ];
    setUsers(combined);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("has_academic_storage_updated", loadData);
    return () => window.removeEventListener("has_academic_storage_updated", loadData);
  }, []);

  const openCreate = () => {
    setEditUser(null);
    setFormName("");
    setFormEmail("");
    setFormRole("professeur");
    setFormFiliereId("");
    setFormClasseId("");
    setFormPhone("");
    setFormSpecialite("");
    setFormBio("");
    setSelectedMatieres([]);
    setSelectedNiveaux(["L1"]);
    setSelectedClasses(["L1 MPI"]);
    setModalOpen(true);
  };

  const openEdit = (u: Profile) => {
    setEditUser(u);
    setFormName(u.full_name);
    setFormEmail(u.email);
    setFormRole(u.role);
    setFormFiliereId(u.filiere_id || "");
    setFormClasseId(u.classe_id || "");
    setFormPhone(u.phone || "");
    setFormSpecialite(u.specialite || "");
    setFormBio(u.bio || "");

    const foundProf = profs.find((p) => p.id === u.id);
    if (foundProf) {
      setSelectedMatieres(foundProf.matieres.map((m) => m.nom));
      setSelectedNiveaux(foundProf.niveaux);
      setSelectedClasses(foundProf.classes);
    } else {
      setSelectedMatieres([]);
      setSelectedNiveaux(["L1"]);
      setSelectedClasses(["L1 MPI"]);
    }
    setModalOpen(true);
  };

  const toggleMatiere = (nom: string) => {
    setSelectedMatieres((prev) =>
      prev.includes(nom) ? prev.filter((m) => m !== nom) : [...prev, nom]
    );
  };

  const toggleNiveau = (niv: string) => {
    setSelectedNiveaux((prev) =>
      prev.includes(niv) ? prev.filter((n) => n !== niv) : [...prev, niv]
    );
  };

  const toggleClasse = (cls: string) => {
    setSelectedClasses((prev) =>
      prev.includes(cls) ? prev.filter((c) => c !== cls) : [...prev, cls]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = new Date().getFullYear();

    if (formRole === "professeur") {
      // Préparer les matières assignées avec niveau et classes
      const matieresAssignees: MatiereAssignee[] = selectedMatieres.map((nom, idx) => {
        const foundM = MOCK_MATIERES.find((m) => m.name === nom);
        return {
          id: foundM?.id || idx + 1,
          nom,
          code: foundM?.code || "MAT",
          niveau: selectedNiveaux[0] || "L1",
          classes: selectedClasses,
        };
      });

      const profId = editUser ? editUser.id : `prof-${Date.now()}`;
      const newProf: Professeur = {
        id: profId,
        user_id: editUser?.id || profs.length + 2,
        email: formEmail,
        username: formEmail.split("@")[0].toLowerCase(),
        full_name: formName,
        prenom: formName.split(" ")[0] || "",
        nom: formName.split(" ").slice(1).join(" ") || "",
        phone: formPhone || null,
        matricule: editUser?.matricule || `HAS-ENS-${year}-${Math.floor(100 + Math.random() * 900)}`,
        specialite: formSpecialite || "Enseignant-Chercheur",
        bio: formBio || "Enseignant à Halil Académie Scientifique.",
        photo: editUser?.avatar_url || null,
        avatar_url: editUser?.avatar_url || null,
        is_active: true,
        matieres: matieresAssignees,
        niveaux: selectedNiveaux.length > 0 ? selectedNiveaux : ["L1"],
        classes: selectedClasses.length > 0 ? selectedClasses : ["L1 MPI"],
      };

      saveProfesseur(newProf);
      setSuccessMsg(`L'enseignant ${formName} a été enregistré avec succès (matières et classes assignées).`);
    } else {
      // Étudiant ou Admin
      if (editUser) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editUser.id
              ? {
                  ...u,
                  full_name: formName,
                  email: formEmail,
                  role: formRole,
                  filiere_id: formFiliereId || null,
                  classe_id: formClasseId || null,
                  phone: formPhone || null,
                  specialite: formSpecialite || null,
                  updated_at: new Date().toISOString(),
                }
              : u
          )
        );
        setSuccessMsg(`Le compte de ${formName} a été mis à jour.`);
      } else {
        const newUser: Profile = {
          id: `user-${Date.now()}`,
          email: formEmail,
          full_name: formName,
          role: formRole,
          username: formEmail.split("@")[0].toLowerCase(),
          phone: formPhone || null,
          matricule: `HAS-${year}-${formRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
          filiere_id: formFiliereId || null,
          classe_id: formClasseId || null,
          bio: formBio || null,
          specialite: formSpecialite || null,
          avatar_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        setUsers((prev) => [newUser, ...prev]);
        setSuccessMsg(`Le compte de ${formName} a été créé.`);
      }
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleDelete = (userId: string) => {
    const u = users.find((x) => x.id === userId);
    if (u?.role === "professeur") {
      deleteProfesseur(userId);
    }
    setUsers((prev) => prev.filter((x) => x.id !== userId));
    setDeleteConfirm(null);
    setSuccessMsg(`Le compte de ${u?.full_name || "l'utilisateur"} a été supprimé.`);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
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

  const availableClassesList = ["L1 MPI", "L2 MPI", "L1 SML", "L2 SML", "L1 MIASS", "L2 MIASS"];

  return (
    <DashboardLayout role="admin" userName="Administration HAS" userEmail="direction@halil-academie.com" matriculeOrTitle="ADM001">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Administration</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Gestion des Comptes &amp; Enseignants</h1>
            <p className="text-xs text-slate-500 mt-1">Création de comptes, affectation de matières, niveaux et classes aux professeurs</p>
          </div>
          <Button variant="accent" size="md" onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Ajouter un compte / Professeur
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200/90 flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <p className="text-sm font-medium text-emerald-800">{successMsg}</p>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou matricule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {(["all", "professeur", "etudiant", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  roleFilter === r
                    ? "bg-[#0f2744] text-white border-[#0f2744]"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                {r === "all" ? "Tous" : r === "professeur" ? "Enseignants" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table des utilisateurs */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {["Utilisateur", "Matricule", "Rôle", "Matières / Affectation", "Contact", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => {
                  const profDetails = profs.find((p) => p.id === u.id);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0f2744]/10 flex items-center justify-center text-[#0f2744] shrink-0 font-bold">
                            {roleInfo[u.role].icon}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 text-xs">{u.full_name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-700">{u.matricule || "—"}</span>
                      </td>
                      <td className="px-4 py-3">{roleInfo[u.role].badge}</td>
                      <td className="px-4 py-3">
                        {profDetails ? (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-[#0f2744]">
                              {profDetails.matieres?.length || 0} matière(s) • {profDetails.niveaux?.join(", ")}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">
                              {profDetails.classes?.join(", ") || "Classes non assignées"}
                            </div>
                          </div>
                        ) : u.role === "etudiant" ? (
                          <div>
                            <div className="text-xs text-slate-700 font-semibold">L1 MPI</div>
                            <div className="text-[11px] text-slate-400">Licence 1</div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400">—</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 font-mono">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(u)} title="Modifier" className="p-1.5 text-slate-500 hover:text-[#0f2744] hover:bg-slate-100 rounded-md">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(u.id)} title="Supprimer" className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Création / Édition */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200/90 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-0.5">Administration</p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744]">
                    {editUser ? `Modifier ${editUser.full_name}` : "Ajouter un Enseignant ou Utilisateur"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-md">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Nom complet" required placeholder="Ex. Pr. Papa Samb, Dr. Ousmane Touré..." value={formName} onChange={(e) => setFormName(e.target.value)} />
                  <Input label="Email académique" type="email" required placeholder="nom.prenom@has.sn" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-slate-700">Rôle <span className="text-red-500">*</span></label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as UserRole)}
                      className="w-full text-sm border border-slate-300 rounded-md px-3 py-2.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
                    >
                      <option value="professeur">Professeur / Enseignant</option>
                      <option value="etudiant">Étudiant</option>
                      <option value="admin">Administrateur</option>
                    </select>
                  </div>
                  <Input label="Téléphone" placeholder="+221 ..." value={formPhone} onChange={(e) => setFormPhone(e.target.value)} />
                </div>

                {/* Configuration spécifique Enseignant */}
                {formRole === "professeur" && (
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-4">
                    <Input
                      label="Spécialité / Discipline"
                      placeholder="Ex. Mathématiques Pures, Génie Logiciel, Physique..."
                      value={formSpecialite}
                      onChange={(e) => setFormSpecialite(e.target.value)}
                    />

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700">Biographie académique</label>
                      <textarea
                        rows={2}
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        placeholder="Titres universitaires, domaine de recherche..."
                        className="w-full text-sm border border-slate-300 rounded-md p-2.5 bg-white"
                      />
                    </div>

                    {/* Niveaux enseignés */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Niveaux enseignés (L1 / L2)
                      </label>
                      <div className="flex gap-3">
                        {["L1", "L2"].map((niv) => (
                          <label key={niv} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedNiveaux.includes(niv)}
                              onChange={() => toggleNiveau(niv)}
                              className="rounded text-[#0f2744] focus:ring-[#0f2744]"
                            />
                            <span>Licence {niv === "L1" ? "1 (L1)" : "2 (L2)"}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Classes assignées */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Classes assignées à cet enseignant
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableClassesList.map((cls) => (
                          <label key={cls} className="inline-flex items-center gap-2 p-2 rounded-lg border bg-white text-xs cursor-pointer hover:bg-slate-100">
                            <input
                              type="checkbox"
                              checked={selectedClasses.includes(cls)}
                              onChange={() => toggleClasse(cls)}
                              className="rounded text-[#0f2744] focus:ring-[#0f2744]"
                            />
                            <span className="font-semibold text-slate-800">{cls}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Matières enseignées */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Matières enseignées ({selectedMatieres.length} sélectionnée(s))
                      </label>
                      <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-2 bg-white space-y-1">
                        {MOCK_MATIERES.map((mat) => (
                          <label key={mat.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-slate-50 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMatieres.includes(mat.name)}
                              onChange={() => toggleMatiere(mat.name)}
                              className="rounded text-[#0f2744] focus:ring-[#0f2744]"
                            />
                            <span className="font-mono text-[10px] text-slate-400">{mat.code}</span>
                            <span className="text-slate-800">{mat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                  <Button type="button" variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setModalOpen(false)}>Annuler</Button>
                  <Button type="submit" variant="accent" size="sm" className="rounded-lg text-xs" leftIcon={<Save className="w-3.5 h-3.5" />}>
                    {editUser ? "Enregistrer les modifications" : "Créer le compte"}
                  </Button>
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
                <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200/80 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900">Supprimer ce compte</h3>
                  <p className="text-xs text-slate-600 mt-1">Le compte sera retiré de la liste académique. Cette action est irréversible.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <Button variant="ghost" size="sm" className="rounded-lg text-xs" onClick={() => setDeleteConfirm(null)}>Annuler</Button>
                <Button variant="danger" size="sm" className="rounded-lg text-xs" onClick={() => handleDelete(deleteConfirm)}>Supprimer</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
