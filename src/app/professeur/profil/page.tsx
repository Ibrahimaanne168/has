"use client";

import React, { useState } from "react";
import {
  User, Phone, BookOpen, Lock, Save, CheckCircle2, KeyRound, Award, GraduationCap,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROFESSEURS } from "@/lib/data/mock-data";
import { passwordRegex, passwordRequirementsMessage } from "@/lib/validators";

const CURRENT_PROF = MOCK_PROFESSEURS[0];

export default function ProfesseurProfilPage() {
  const [bio, setBio] = useState(CURRENT_PROF.bio || "");
  const [phone, setPhone] = useState(CURRENT_PROF.phone || "");
  const [specialite, setSpecialite] = useState(CURRENT_PROF.specialite || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess("Votre profil académique a été mis à jour. Les étudiants verront les modifications sur le trombinoscope.");
    setTimeout(() => setProfileSuccess(null), 4000);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!passwordRegex.test(newPassword)) { setPasswordError(passwordRequirementsMessage); return; }
    if (newPassword !== confirmPassword) { setPasswordError("Les mots de passe ne correspondent pas."); return; }
    setPasswordSuccess("Votre mot de passe a été modifié avec succès.");
    setNewPassword(""); setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(null), 4000);
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={CURRENT_PROF.full_name}
      userEmail={CURRENT_PROF.email}
      matriculeOrTitle={CURRENT_PROF.matricule || "PROF001"}
    >
      <div className="space-y-6 max-w-4xl">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Espace Enseignant</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">Profil Académique</h1>
          <p className="text-xs text-slate-500 mt-1">
            Votre fiche enseignant — visible par les étudiants dans le trombinoscope HAS
          </p>
        </div>

        {/* Identité certifiée */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
            <div className="w-20 h-20 rounded-xl bg-[#0f2744] flex items-center justify-center text-white shrink-0">
              <GraduationCap className="w-10 h-10 text-[#e0521c]" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">{CURRENT_PROF.full_name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="primary" size="sm" icon={<Award className="w-3 h-3" />}>Enseignant-Chercheur</Badge>
              </div>
              <div className="text-xs font-mono text-slate-400 mt-1">{CURRENT_PROF.matricule}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Email académique</span>
              <strong className="text-slate-900">{CURRENT_PROF.email}</strong>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Discipline d'enseignement</span>
              <strong className="text-slate-900">{CURRENT_PROF.specialite || "Mathématiques & Sciences"}</strong>
            </div>
          </div>
        </div>

        {/* Mise à jour du profil public */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0f2744] border-b border-slate-100 pb-3">
            Profil Public (visible par les étudiants)
          </h3>
          {profileSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />{profileSuccess}
            </div>
          )}
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <Input
              label="Spécialité / Chaire académique"
              placeholder="Ex. Génie Logiciel & Bases de Données"
              leftIcon={<Award className="w-4 h-4" />}
              value={specialite}
              onChange={(e) => setSpecialite(e.target.value)}
            />
            <Input
              label="Téléphone de permanence"
              placeholder="+223 ..."
              leftIcon={<Phone className="w-4 h-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700">Biographie académique</label>
              <textarea
                rows={5}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Parcours académique, domaines d'expertise et projets de recherche..."
                className="block w-full rounded-lg border border-slate-200/90 bg-white p-3 text-sm text-slate-900 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
              />
              <p className="text-xs text-slate-400">Cette biographie sera affichée dans la page « Corps Professoral » de l&apos;espace étudiant.</p>
            </div>
            <Button type="submit" variant="outline" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Enregistrer les modifications du profil
            </Button>
          </form>
        </div>

        {/* Changement de mot de passe */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0f2744] border-b border-slate-100 pb-3">
            Sécurité — Modifier mon mot de passe
          </h3>
          {passwordSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />{passwordSuccess}
            </div>
          )}
          {passwordError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">{passwordError}</div>
          )}
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <Input label="Nouveau mot de passe" type="password" required placeholder="••••••••••••"
              leftIcon={<KeyRound className="w-4 h-4" />}
              helperText="Minimum 8 caractères, majuscule, minuscule, chiffre et symbole."
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input label="Confirmer le nouveau mot de passe" type="password" required placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button type="submit" variant="accent" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
              Mettre à jour le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
