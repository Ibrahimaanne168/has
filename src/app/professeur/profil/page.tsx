"use client";

import React, { useState } from "react";
import {
  Phone,
  Mail,
  Save,
  CheckCircle2,
  Award,
  GraduationCap,
  Edit3,
  Hash,
  Lock,
  Eye,
  EyeOff,
  BookOpen,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { passwordRegex, passwordRequirementsMessage } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";

export default function ProfesseurProfilPage() {
  const { user, updateProfile } = useCurrentUser();

  const [phone, setPhone] = useState(user.phone || "");
  const [specialite, setSpecialite] = useState(user.specialite || "");
  const [bio, setBio] = useState(user.bio || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initiales pour l'avatar
  const initials = user.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PR";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ phone, specialite, bio });
    setIsSaving(false);
    setProfileSuccess("Votre profil académique a été mis à jour.");
    setTimeout(() => setProfileSuccess(null), 3500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);
    if (!passwordRegex.test(newPassword)) { setPasswordError(passwordRequirementsMessage); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Les mots de passe ne correspondent pas."); return; }
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordSuccess("Mot de passe modifié avec succès.");
      setNewPassword(""); setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Erreur de modification");
    }
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "PROF001"}
    >
      <div className="space-y-6 max-w-4xl">

        {/* === CARTE PROFIL PRINCIPALE === */}
        <div className="relative bg-gradient-to-br from-[#0f2744] via-[#1a3a5c] to-[#0f2744] rounded-2xl overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #e0521c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }} />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar initiales */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#e0521c] to-[#f07040] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg border-4 border-white/20">
                  {initials}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-blue-400 border-2 border-white flex items-center justify-center">
                  <GraduationCap className="w-3 h-3 text-white" />
                </div>
              </div>

              {/* Infos principales */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Enseignant HAS</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Actif</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight">{user.full_name}</h1>
                <p className="text-sm text-white/60 mt-0.5">{user.specialite || "Enseignant-Chercheur HAS"}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-white/70">
                    <Hash className="w-3.5 h-3.5 text-[#e0521c]" />
                    {user.matricule || "PROF001"}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/70">
                    <Mail className="w-3.5 h-3.5 text-[#e0521c]" />
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Badge rôle */}
              <div className="shrink-0">
                <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">Rôle</p>
                  <p className="text-sm font-black text-white">Enseignant</p>
                  <p className="text-[10px] text-white/60">Corps Professoral</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
              <div className="text-center">
                <p className="text-lg font-black text-white">HAS</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Académie</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-lg font-black text-white">L1 & L2</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Niveaux</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-blue-300">Actif</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Statut</p>
              </div>
            </div>
          </div>
        </div>

        {/* === PROFIL PUBLIC (Bio, spécialité, téléphone) === */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setEditingProfile(!editingProfile)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0f2744]/10 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-[#0f2744]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Profil Public & Coordonnées</p>
                <p className="text-xs text-slate-500">{user.specialite || "Spécialité non renseignée"}</p>
              </div>
            </div>
            <Edit3 className={`w-4 h-4 transition-colors ${editingProfile ? "text-[#e0521c]" : "text-slate-400"}`} />
          </div>

          {editingProfile && (
            <div className="px-5 pb-5 border-t border-slate-100">
              {profileSuccess && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{profileSuccess}</span>
                </div>
              )}
              <form onSubmit={handleUpdateProfile} className="mt-4 space-y-4">
                <Input
                  label="Spécialité / Chaire académique"
                  placeholder="Ex. Génie Logiciel & Bases de Données"
                  leftIcon={<Award className="w-4 h-4" />}
                  value={specialite}
                  onChange={(e) => setSpecialite(e.target.value)}
                />
                <Input
                  label="Téléphone de permanence"
                  placeholder="+221 77 000 00 00"
                  leftIcon={<Phone className="w-4 h-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Biographie académique</label>
                  <textarea
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Parcours académique, domaines d'expertise et projets de recherche..."
                    className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
                  />
                  <p className="text-xs text-slate-400">Cette biographie sera affichée dans la page « Corps Professoral ».</p>
                </div>
                <Button type="submit" variant="outline" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Enregistrer les modifications
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* === SÉCURITÉ === */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setEditingPassword(!editingPassword)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lock className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Mot de passe</p>
                <p className="text-xs text-slate-500">Modifier mon mot de passe de connexion</p>
              </div>
            </div>
            <Edit3 className={`w-4 h-4 transition-colors ${editingPassword ? "text-[#e0521c]" : "text-slate-400"}`} />
          </div>

          {editingPassword && (
            <div className="px-5 pb-5 border-t border-slate-100">
              {passwordSuccess && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /><span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">{passwordError}</div>
              )}
              <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4 max-w-md">
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showNewPwd ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    helperText="Min. 8 caractères dont majuscule, minuscule, chiffre et symbole."
                  />
                  <button type="button" onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-700">
                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirmer le nouveau mot de passe"
                    type={showConfirmPwd ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button type="button" onClick={() => setShowConfirmPwd(!showConfirmPwd)} className="absolute right-3 top-8 text-slate-400 hover:text-slate-700">
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button type="submit" variant="accent" size="sm" disabled={!newPassword || newPassword !== confirmPassword}>
                  Mettre à jour le mot de passe
                </Button>
              </form>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
