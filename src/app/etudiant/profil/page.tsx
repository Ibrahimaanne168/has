"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  Save,
  CheckCircle2,
  ShieldCheck,
  GraduationCap,
  Layers,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { passwordRegex, passwordRequirementsMessage } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";

export default function EtudiantProfilPage() {
  const { user, updateProfile } = useCurrentUser();

  const [phone, setPhone] = useState("");
  const [filiere, setFiliere] = useState<"MPI" | "SML" | "MIASS">("MPI");
  const [niveau, setNiveau] = useState<"L1" | "L2">("L1");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);
  const [academiqueSuccess, setAcademiqueSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
      if (user.classe?.code?.includes("SML")) setFiliere("SML");
      else if (user.classe?.code?.includes("MIASS")) setFiliere("MIASS");
      else setFiliere("MPI");

      if (user.classe?.code?.startsWith("L2") || user.classe?.niveau === "L2") setNiveau("L2");
      else setNiveau("L1");
    }
  }, [user]);

  const handleUpdateContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ phone });
    setIsSaving(false);
    setInfoSuccess("Votre numéro de téléphone a été mis à jour dans votre dossier étudiant.");
    setTimeout(() => setInfoSuccess(null), 3500);
  };

  const handleUpdateAcademique = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({ filiere, niveau });
    setIsSaving(false);
    setAcademiqueSuccess(`Votre classe a été mise à jour avec succès : ${niveau} ${filiere}.`);
    setTimeout(() => setAcademiqueSuccess(null), 3500);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!passwordRegex.test(newPassword)) {
      setPasswordError(passwordRequirementsMessage);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordSuccess("Votre mot de passe a été modifié avec succès.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordSuccess(null), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de modification";
      setPasswordError(msg);
    }
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6 max-w-4xl">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Espace Étudiant</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
            Mon Profil Académique
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Données administratives certifiées, classe et paramètres de sécurité
          </p>
        </div>

        {/* Coordonnées académiques certifiées */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-serif text-base font-bold text-[#0f2744]">
              Informations Officielles de l&apos;Étudiant
            </h3>
            <Badge variant="primary" size="sm" icon={<ShieldCheck className="w-3 h-3" />}>
              Certifié HAS
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Nom complet</span>
              <strong className="text-slate-900 text-sm">{user.full_name}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Matricule Étudiant</span>
              <strong className="font-mono text-sm text-[#0f2744]">{user.matricule}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Filière actuelle</span>
              <strong className="text-slate-900 text-sm">{user.filiere?.name || `${filiere}`}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Classe & Niveau</span>
              <strong className="text-slate-900 text-sm">
                {user.classe?.name || `${niveau} ${filiere}`} ({user.classe?.code || `${niveau}-${filiere}`})
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block mb-1">Email de l&apos;étudiant</span>
              <strong className="text-slate-900 text-sm">{user.email}</strong>
            </div>
          </div>
        </div>

        {/* Choix de Filière & Niveau (MPI, SML, MIASS / L1, L2) */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-serif text-base font-bold text-[#0f2744]">
                Affectation Académique : Filière & Niveau
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Sélectionnez votre classe pour adapter automatiquement vos cours, plannings et groupes de discussion
              </p>
            </div>
            <GraduationCap className="w-5 h-5 text-[#e0521c]" />
          </div>

          {academiqueSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{academiqueSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateAcademique} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Filière de Formation
                </label>
                <select
                  value={filiere}
                  onChange={(e) => setFiliere(e.target.value as "MPI" | "SML" | "MIASS")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                >
                  <option value="MPI">MPI — Maths, Physique, Informatique</option>
                  <option value="SML">SML — Sciences de la Matière & Logiciel</option>
                  <option value="MIASS">MIASS — Maths & Informatique Appliquées</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Niveau d&apos;Études
                </label>
                <select
                  value={niveau}
                  onChange={(e) => setNiveau(e.target.value as "L1" | "L2")}
                  className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                >
                  <option value="L1">Licence 1 (L1)</option>
                  <option value="L2">Licence 2 (L2)</option>
                </select>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200/70 text-[11px] text-blue-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-700 shrink-0" />
              <span>
                Classe sélectionnée : <strong>{niveau} {filiere}</strong>. Votre groupe de discussion sera le <strong>Salon {niveau}</strong>.
              </span>
            </div>

            <Button
              type="submit"
              variant="accent"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Mettre à jour ma classe
            </Button>
          </form>
        </div>

        {/* Mise à jour du téléphone */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0f2744] border-b border-slate-100 pb-3">
            Coordonnées de Contact
          </h3>

          {infoSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{infoSuccess}</span>
            </div>
          )}

          <form onSubmit={handleUpdateContact} className="space-y-4 max-w-md">
            <Input
              label="Numéro de téléphone mobile"
              placeholder="+221 77 000 00 00"
              leftIcon={<Phone className="w-4 h-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Button
              type="submit"
              variant="outline"
              size="sm"
              isLoading={isSaving}
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Enregistrer le numéro
            </Button>
          </form>
        </div>

        {/* Changement de mot de passe */}
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] space-y-4">
          <h3 className="font-serif text-base font-bold text-[#0f2744] border-b border-slate-100 pb-3">
            Sécurité du Compte — Modifier mon mot de passe
          </h3>

          {passwordSuccess && (
            <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800">
              {passwordError}
            </div>
          )}

          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <Input
              label="Nouveau mot de passe"
              type="password"
              placeholder="••••••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              helperText="Min. 8 caractères dont majuscule, minuscule, chiffre et symbole."
            />

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={!newPassword || newPassword !== confirmPassword}
            >
              Mettre à jour le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
