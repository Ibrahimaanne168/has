"use client";

import React, { useState, useEffect } from "react";
import {
  Search, Plus, Edit2, Trash2, User, GraduationCap, Shield,
  CheckCircle2, AlertCircle, X, Save, UserCheck, BookOpen,
  Clock, Check, UserPlus,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_CLASSES, MOCK_FILIERES, MOCK_MATIERES } from "@/lib/data/mock-data";
import {
  getStoredProfesseurs,
  saveProfesseur,
  deleteProfesseur,
  getStoredStudents,
  saveStudent,
  deleteStudent,
  deduceSpecialiteFromMatieres,
} from "@/lib/academicStorage";
import { Profile, UserRole, Professeur, MatiereAssignee } from "@/lib/types";

export default function AdminComptesPage() {
  const [profs, setProfs] = useState<Professeur[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<Profile | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);

  // Form state
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<UserRole>("etudiant");
  const [formFiliereId, setFormFiliereId] = useState("");
  const [formClasseId, setFormClasseId] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formSpecialite, setFormSpecialite] = useState("Informatique");
  const [formBio, setFormBio] = useState("");

  // Pour les professeurs: matières, niveaux et classes
  const [selectedMatieres, setSelectedMatieres] = useState<string[]>([]);
  const [selectedNiveaux, setSelectedNiveaux] = useState<string[]>(["L1"]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["L1 MPI"]);

  const loadData = () => {
    const storedProfs = getStoredProfesseurs();
    const storedStudents = getStoredStudents();
    setProfs(storedProfs);

    // Charger les inscriptions en attente de validation administrative et tous les comptes du serveur
    fetch("/api/admin/validation-inscriptions?status=all")
      .then((res) => res.json())
      .then((data) => {
        if (data.pendingStudents) setPendingStudents(data.pendingStudents);

        const serverStudents: Profile[] = (data.students || []).map((s: any) => ({
          id: s.id,
          email: s.email,
          username: s.username || null,
          full_name: s.full_name,
          role: "etudiant" as UserRole,
          phone: s.telephone || null,
          matricule: s.matricule || null,
          filiere_id: s.filiere || null,
          classe_id: s.niveau ? `${s.niveau} ${s.filiere || "MPI"}` : null,
          is_active: s.is_active,
          created_at: s.created_at || new Date().toISOString(),
          updated_at: s.updated_at || new Date().toISOString(),
        }));

        // Fusionner avec les étudiants locaux sans doublons (clé: email ou id)
        const studentMap = new Map<string, Profile>();
        for (const st of storedStudents) {
          studentMap.set(st.email?.toLowerCase() || st.id, st);
        }
        for (const st of serverStudents) {
          studentMap.set(st.email?.toLowerCase() || st.id, st);
        }

        const combined: Profile[] = [
          ...Array.from(studentMap.values()),
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
      })
      .catch(() => {
        const combined: Profile[] = [
          ...storedStudents,
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
      });
  };

  const handleValidateStudent = async (studentId: string, action: "accept" | "reject") => {
    try {
      const res = await fetch("/api/admin/validation-inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(data.message);
        setTimeout(() => setSuccessMsg(null), 4000);
        loadData();
      } else {
        alert(data.error || "Erreur lors de la validation");
      }
    } catch {
      alert("Erreur de communication avec le serveur");
    }
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
      const deducedSpecialite = formSpecialite || deduceSpecialiteFromMatieres(matieresAssignees);
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
        specialite: deducedSpecialite,
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
        const updated: Profile = {
          ...editUser,
          full_name: formName,
          email: formEmail,
          role: formRole,
          filiere_id: formFiliereId || null,
          classe_id: formClasseId || null,
          phone: formPhone || null,
          specialite: null,
          updated_at: new Date().toISOString(),
        };
        if (formRole === "etudiant") {
          saveStudent(updated);
        }
        setUsers((prev) => prev.map((u) => (u.id === editUser.id ? updated : u)));
        setSuccessMsg(`Le compte de ${formName} a été mis à jour.`);
      } else {
        const newUser: Profile = {
          id: `user-${Date.now()}`,
          email: formEmail,
          full_name: formName,
          role: formRole,
          username: formEmail.split("@")[0].toLowerCase(),
          phone: formPhone || null,
          matricule:
            formRole === "etudiant"
              ? `ETU${String(
                  Math.max(
                    0,
                    ...users
                      .filter((u) => u.role === "etudiant")
                      .map((u) => {
                        const m = (u.matricule || "").match(/^ETU(\d+)$/i);
                        return m ? parseInt(m[1], 10) : 0;
                      })
                  ) + 1
                ).padStart(3, "0")}`
              : `HAS-${year}-${formRole.toUpperCase().slice(0, 3)}-${Math.floor(1000 + Math.random() * 9000)}`,
          filiere_id: formFiliereId || null,
          classe_id: formClasseId || null,
          bio: formBio || null,
          specialite: null,
          avatar_url: null,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        if (formRole === "etudiant") {
          saveStudent(newUser);
        }
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
    } else if (u?.role === "etudiant") {
      deleteStudent(userId);
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">Gestion des Comptes &amp; Enseignants</h1>
            <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">Création de comptes, affectation de matières, niveaux et classes aux professeurs</p>
          </div>
          <Button variant="accent" size="md" onClick={openCreate} leftIcon={<Plus className="w-4 h-4" />}>
            Ajouter un compte / Professeur
          </Button>
        </div>

        {successMsg && (
          <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/90 dark:border-emerald-800 flex items-center gap-3 shadow-xs">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{successMsg}</p>
          </div>
        )}

        {/* SECTION : INSCRIPTIONS EN ATTENTE DE VALIDATION */}
        {pendingStudents.length > 0 && (
          <div className="bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-300 dark:border-amber-800 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">
                    Demandes d&apos;inscription en attente de validation ({pendingStudents.length})
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#AAB4C0]">
                    Ces étudiants ont soumis leur inscription et attendent votre autorisation pour accéder à la plateforme.
                  </p>
                </div>
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 border border-amber-300/80 dark:border-amber-700/80 self-start sm:self-auto">
                Action requise
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {pendingStudents.map((st) => (
                <div
                  key={st.id}
                  className="bg-white dark:bg-[#111821] border border-amber-200 dark:border-[#263241] rounded-xl p-4 flex flex-col justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-[#F5F7FA]">
                        {st.full_name || "Candidat sans nom"}
                      </span>
                      <span className="font-mono text-[11px] font-bold text-[#e0521c] bg-orange-50 dark:bg-[#151D27] px-2 py-0.5 rounded border border-orange-200 dark:border-[#263241]">
                        {st.matricule || "Nouveau"}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 dark:text-[#AAB4C0] space-y-0.5">
                      <p>📧 {st.email}</p>
                      {st.phone && <p>📞 {st.phone}</p>}
                      <p>🎓 {st.filiere_id || st.classe || "MPI"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
                    <button
                      type="button"
                      onClick={() => handleValidateStudent(st.id, "accept")}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accepter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleValidateStudent(st.id, "reject")}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-100 dark:bg-[#151D27] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-600 hover:text-rose-600 dark:text-[#AAB4C0] dark:hover:text-rose-300 border border-slate-200 dark:border-[#263241] text-xs font-semibold transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                      Refuser
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filtres */}
        <div className="bg-white dark:bg-[#111821] p-4 rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 dark:text-[#687585] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom, email ou matricule..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 dark:border-[#263241] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {(["all", "professeur", "etudiant", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  roleFilter === r
                    ? "bg-[#0f2744] dark:bg-[#e0521c] text-white border-[#0f2744] dark:border-[#e0521c]"
                    : "bg-white dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] border-slate-200 dark:border-[#263241] hover:bg-slate-50 dark:hover:bg-[#1c2633]"
                }`}
              >
                {r === "all" ? "Tous" : r === "professeur" ? "Enseignants" : r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Table des utilisateurs */}
        <div className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-[#151D27] border-b border-slate-200 dark:border-[#263241]">
                  {["Utilisateur", "Matricule", "Rôle", "Matières / Affectation", "Contact", "Actions"].map((h) => (
                    <th key={h} className="text-left text-xs font-bold text-slate-500 dark:text-[#AAB4C0] uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-[#263241]">
                {filtered.map((u) => {
                  const profDetails = profs.find((p) => p.id === u.id);

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-[#151D27]/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#0f2744]/10 dark:bg-[#151D27] flex items-center justify-center text-[#0f2744] dark:text-[#F5F7FA] shrink-0 font-bold border border-transparent dark:border-[#263241]">
                            {roleInfo[u.role].icon}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-900 dark:text-[#F5F7FA] text-xs">{u.full_name}</div>
                            <div className="text-[11px] text-slate-400 dark:text-[#687585] font-mono">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-700 dark:text-[#AAB4C0]">{u.matricule || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1 items-start">
                          {roleInfo[u.role].badge}
                          {u.role === "etudiant" && (
                            u.is_active ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                Validé &amp; Actif
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                                En attente / Inactif
                              </span>
                            )
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {profDetails ? (
                          <div className="space-y-1">
                            <div className="text-xs font-semibold text-[#0f2744] dark:text-cyan-400">
                              {profDetails.matieres?.length || 0} matière(s) • {profDetails.niveaux?.join(", ")}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-[#AAB4C0] truncate max-w-xs">
                              {profDetails.classes?.join(", ") || "Classes non assignées"}
                            </div>
                          </div>
                        ) : u.role === "etudiant" ? (
                          <div>
                            <div className="text-xs text-slate-700 dark:text-[#AAB4C0] font-semibold">
                              {u.classe_id || "L1 MPI"}
                            </div>
                            <div className="text-[11px] text-slate-400 dark:text-[#687585]">
                              {u.filiere_id ? `Filière ${u.filiere_id}` : "Licence 1"}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 dark:text-[#687585]">—</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-600 dark:text-[#AAB4C0] font-mono">{u.phone || "—"}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          {u.role === "etudiant" && !u.is_active && (
                            <button
                              type="button"
                              onClick={() => handleValidateStudent(u.id, "accept")}
                              title="Valider et activer ce compte étudiant"
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Activer
                            </button>
                          )}
                          <button onClick={() => openEdit(u)} title="Modifier" className="p-1.5 text-slate-500 dark:text-[#AAB4C0] hover:text-[#0f2744] dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#151D27] rounded-md cursor-pointer">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(u.id)} title="Supprimer" className="p-1.5 text-slate-500 dark:text-[#AAB4C0] hover:text-red-600 dark:hover:text-rose-400 hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-md cursor-pointer">
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-[#263241]">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c] mb-0.5">Administration</p>
                  <h3 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                    {editUser ? `Modifier ${editUser.full_name}` : "Ajouter un Enseignant ou Utilisateur"}
                  </h3>
                </div>
                <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 dark:text-[#687585] hover:bg-slate-100 dark:hover:bg-[#151D27] hover:text-slate-600 dark:hover:text-[#F5F7FA] rounded-md cursor-pointer">
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
                    <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">Rôle <span className="text-red-500">*</span></label>
                    <select
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value as UserRole)}
                      className="w-full text-sm border border-slate-300 dark:border-[#263241] rounded-md px-3 py-2.5 bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
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
                  <div className="p-4 bg-slate-50 dark:bg-[#151D27] rounded-xl border border-slate-200/90 dark:border-[#263241] space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">
                        Spécialité officielle
                      </label>
                      <select
                        value={formSpecialite}
                        onChange={(e) => setFormSpecialite(e.target.value)}
                        className="w-full text-sm border border-slate-300 dark:border-[#263241] rounded-md p-2.5 bg-white dark:bg-[#111821] font-medium text-slate-800 dark:text-[#F5F7FA]"
                      >
                        <option value="Informatique">Informatique</option>
                        <option value="Math">Math</option>
                        <option value="Physique">Physique</option>
                        <option value="Economie">Economie</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">Biographie académique</label>
                      <textarea
                        rows={2}
                        value={formBio}
                        onChange={(e) => setFormBio(e.target.value)}
                        placeholder="Titres universitaires, domaine de recherche..."
                        className="w-full text-sm border border-slate-300 dark:border-[#263241] rounded-md p-2.5 bg-white dark:bg-[#111821] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585]"
                      />
                    </div>

                    {/* Niveaux enseignés */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA]">
                        Niveaux enseignés (L1 / L2)
                      </label>
                      <div className="flex gap-3">
                        {["L1", "L2"].map((niv) => (
                          <label key={niv} className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer text-slate-800 dark:text-[#F5F7FA]">
                            <input
                              type="checkbox"
                              checked={selectedNiveaux.includes(niv)}
                              onChange={() => toggleNiveau(niv)}
                              className="rounded text-[#0f2744] dark:text-[#e0521c] focus:ring-[#0f2744]"
                            />
                            <span>Licence {niv === "L1" ? "1 (L1)" : "2 (L2)"}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Classes assignées */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA]">
                        Classes assignées à cet enseignant
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {availableClassesList.map((cls) => (
                          <label key={cls} className="inline-flex items-center gap-2 p-2 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#111821] text-xs cursor-pointer hover:bg-slate-100 dark:hover:bg-[#1c2633]">
                            <input
                              type="checkbox"
                              checked={selectedClasses.includes(cls)}
                              onChange={() => toggleClasse(cls)}
                              className="rounded text-[#0f2744] dark:text-[#e0521c] focus:ring-[#0f2744]"
                            />
                            <span className="font-semibold text-slate-800 dark:text-[#F5F7FA]">{cls}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Matières enseignées */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-[#F5F7FA]">
                        Matières enseignées ({selectedMatieres.length} sélectionnée(s))
                      </label>
                      <div className="max-h-40 overflow-y-auto border border-slate-200 dark:border-[#263241] rounded-lg p-2 bg-white dark:bg-[#111821] space-y-1">
                        {MOCK_MATIERES.map((mat) => (
                          <label key={mat.id} className="flex items-center gap-2 text-xs p-1.5 rounded hover:bg-slate-50 dark:hover:bg-[#151D27] cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedMatieres.includes(mat.name)}
                              onChange={() => toggleMatiere(mat.name)}
                              className="rounded text-[#0f2744] dark:text-[#e0521c] focus:ring-[#0f2744]"
                            />
                            <span className="font-mono text-[10px] text-slate-400 dark:text-[#687585]">{mat.code}</span>
                            <span className="text-slate-800 dark:text-[#F5F7FA]">{mat.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-[#263241]">
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
          <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#111821] rounded-xl max-w-sm w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-50 dark:bg-rose-950/40 border border-red-200/80 dark:border-rose-900/60 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-400" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Supprimer ce compte</h3>
                  <p className="text-xs text-slate-600 dark:text-[#AAB4C0] mt-1">Le compte sera retiré de la liste académique. Cette action est irréversible.</p>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-[#263241]">
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
