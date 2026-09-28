"use client";

import React, { useState } from "react";
import { User, Phone, Lock, Save, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT } from "@/lib/data/mock-data";
import { passwordRegex, passwordRequirementsMessage } from "@/lib/validators";

export default function EtudiantProfilPage() {
  const [phone, setPhone] = useState(MOCK_STUDENT.phone || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [infoSuccess, setInfoSuccess] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleUpdateContact = (e: React.FormEvent) => {
    e.preventDefault();
    setInfoSuccess("Votre numéro de téléphone a été mis à jour dans votre dossier étudiant.");
    setTimeout(() => setInfoSuccess(null), 3500);
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
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

    setPasswordSuccess("Votre mot de passe a été modifié avec succès.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(null), 4000);
  };

  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-6 max-w-4xl">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Espace Étudiant</p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
            Mon Profil Académique
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Données administratives certifiées et paramètres de sécurité
          </p>
        </div>

        {/* Coordonnées académiques certifiées (Lecture seule sécurisée) */}
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
              <strong className="text-slate-900 text-sm">{MOCK_STUDENT.full_name}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Matricule Étudiant</span>
              <strong className="font-mono text-sm text-[#0f2744]">{MOCK_STUDENT.matricule}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Filière d&apos;inscription</span>
              <strong className="text-slate-900 text-sm">{MOCK_STUDENT.filiere?.name}</strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block mb-1">Classe actuelle</span>
              <strong className="text-slate-900 text-sm">
                {MOCK_STUDENT.classe?.name} ({MOCK_STUDENT.classe?.code})
              </strong>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 sm:col-span-2">
              <span className="text-slate-400 block mb-1">Email académique de contact</span>
              <strong className="text-slate-900 text-sm">{MOCK_STUDENT.email}</strong>
            </div>
          </div>
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
              placeholder="+223 75 00 00 00"
              leftIcon={<Phone className="w-4 h-4" />}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Button
              type="submit"
              variant="outline"
              size="sm"
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
              label="Mot de passe actuel"
              type="password"
              required
              placeholder="••••••••••••"
              leftIcon={<Lock className="w-4 h-4" />}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <Input
              label="Nouveau mot de passe"
              type="password"
              required
              placeholder="••••••••••••"
              leftIcon={<KeyRound className="w-4 h-4" />}
              helperText="Minimum 8 caractères, majuscule, minuscule, chiffre et symbole."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <Input
              label="Confirmer le nouveau mot de passe"
              type="password"
              required
              placeholder="••••••••••••"
              leftIcon={<KeyRound className="w-4 h-4" />}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button
              type="submit"
              variant="accent"
              size="sm"
              leftIcon={<Save className="w-3.5 h-3.5" />}
            >
              Mettre à jour le mot de passe
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
