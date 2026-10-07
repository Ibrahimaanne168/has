"use client";

import React, { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  Save,
  CheckCircle2,
  GraduationCap,
  Edit3,
  Hash,
  Lock,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Upload,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { passwordRegex, passwordRequirementsMessage } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/imageCompression";

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

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoSuccess, setPhotoSuccess] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Veuillez sélectionner un fichier image valide (JPG, PNG, WEBP).");
      setTimeout(() => setPhotoError(null), 3500);
      return;
    }

    try {
      setUploadingPhoto(true);
      setPhotoError(null);
      // Compression de l'image (max 512x512, qualité 0.8)
      const compressedDataUrl = await compressImage(file, 512, 512, 0.82);
      await updateProfile({ avatar_url: compressedDataUrl });
      setPhotoSuccess("Photo de profil mise à jour et compressée avec succès !");
      setTimeout(() => setPhotoSuccess(null), 3500);
    } catch (err) {
      console.error(err);
      setPhotoError("Erreur lors de la compression de la photo.");
      setTimeout(() => setPhotoError(null), 3500);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const handleRemovePhoto = async () => {
    try {
      setUploadingPhoto(true);
      await updateProfile({ avatar_url: null });
      setPhotoSuccess("Photo de profil retirée.");
      setTimeout(() => setPhotoSuccess(null), 3500);
    } catch {
      setPhotoError("Erreur lors de la suppression de la photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

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

  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [editingContact, setEditingContact] = useState(false);
  const [editingClasse, setEditingClasse] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  // Initiales de l'avatar
  const initials = user.full_name
    ? user.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "ET";

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
    >
      <div className="space-y-6 max-w-4xl">

        {photoSuccess && (
          <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{photoSuccess}</span>
          </div>
        )}
        {photoError && (
          <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-800 flex items-center gap-2">
            <span className="font-bold">Erreur :</span>
            <span>{photoError}</span>
          </div>
        )}

        {/* === CARTE PROFIL PRINCIPALE === */}
        <div className="relative bg-gradient-to-br from-[#0f2744] via-[#1a3a5c] to-[#0f2744] rounded-2xl overflow-hidden shadow-xl">
          {/* Pattern décoratif */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #e0521c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }} />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar avec initiales ou photo compressée */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#e0521c] to-[#f07040] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg border-4 border-white/20 overflow-hidden relative">
                  {user.avatar_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatar_url}
                      alt={user.full_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-[10px] font-bold">
                      Traitement...
                    </div>
                  )}
                </div>

                {/* Bouton changer photo */}
                <label
                  htmlFor="etudiant-photo-upload"
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#0f2744] hover:bg-[#1a3a60] border-2 border-white text-white cursor-pointer shadow-md transition-all active:scale-95"
                  title="Ajouter ou modifier votre photo (compressée automatiquement)"
                >
                  <Camera className="w-3.5 h-3.5 text-[#e0521c]" />
                  <input
                    id="etudiant-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>

              {/* Infos principales */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Étudiant HAS</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Actif</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight">{user.full_name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-white/70">
                    <Hash className="w-3.5 h-3.5 text-[#e0521c]" />
                    {user.matricule || "ETU001"}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-white/70">
                    <Mail className="w-3.5 h-3.5 text-[#e0521c]" />
                    {user.email}
                  </span>
                </div>
              </div>

              {/* Badge classe */}
              <div className="shrink-0">
                <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-sm text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/50 mb-0.5">Classe</p>
                  <p className="text-sm font-black text-white">{user.classe?.code || `${niveau}-${filiere}`}</p>
                  <p className="text-[10px] text-white/60">{user.classe?.name || `${niveau} ${filiere}`}</p>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-white/10">
              <div className="text-center">
                <p className="text-lg font-black text-white">{user.classe?.niveau || niveau}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Niveau</p>
              </div>
              <div className="text-center border-x border-white/10">
                <p className="text-lg font-black text-white">{user.filiere?.code || filiere}</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Filière</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black text-emerald-400">Actif</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wider">Statut</p>
              </div>
            </div>
          </div>
        </div>

        {/* === MODIFICATION DE LA CLASSE === */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setEditingClasse(!editingClasse)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#0f2744]/10 flex items-center justify-center">
                <GraduationCap className="w-4.5 h-4.5 text-[#0f2744]" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Filière & Niveau</p>
                <p className="text-xs text-slate-500">{user.classe?.name || `${niveau} ${filiere}`}</p>
              </div>
            </div>
            <Edit3 className={`w-4 h-4 transition-colors ${editingClasse ? "text-[#e0521c]" : "text-slate-400"}`} />
          </div>

          {editingClasse && (
            <div className="px-5 pb-5 border-t border-slate-100">
              {academiqueSuccess && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{academiqueSuccess}</span>
                </div>
              )}
              <form onSubmit={handleUpdateAcademique} className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Filière</label>
                    <select
                      value={filiere}
                      onChange={(e) => setFiliere(e.target.value as "MPI" | "SML" | "MIASS")}
                      className="w-full h-10 px-3 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                    >
                      <option value="MPI">MPI — Mathématiques, Physique et Informatique</option>
                      <option value="SML">SML — Sciences de la mer et du Littoral</option>
                      <option value="MIASS">MIASS — Mathématiques et Informatique Appliquées aux Sciences Sociales</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Niveau</label>
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
                <Button type="submit" variant="accent" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Enregistrer ma classe
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* === CONTACT === */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setEditingContact(!editingContact)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Phone className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Numéro de contact</p>
                <p className="text-xs text-slate-500">{user.phone || "Non renseigné"}</p>
              </div>
            </div>
            <Edit3 className={`w-4 h-4 transition-colors ${editingContact ? "text-[#e0521c]" : "text-slate-400"}`} />
          </div>

          {editingContact && (
            <div className="px-5 pb-5 border-t border-slate-100">
              {infoSuccess && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{infoSuccess}</span>
                </div>
              )}
              <form onSubmit={handleUpdateContact} className="mt-4 space-y-4 max-w-md">
                <Input
                  label="Numéro de téléphone"
                  placeholder="+221 77 000 00 00"
                  leftIcon={<Phone className="w-4 h-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Button type="submit" variant="outline" size="sm" isLoading={isSaving} leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Enregistrer
                </Button>
              </form>
            </div>
          )}
        </div>

        {/* === SÉCURITÉ — Mot de passe === */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] overflow-hidden">
          <div
            className="flex items-center justify-between p-5 cursor-pointer hover:bg-slate-50 transition-colors"
            onClick={() => setEditingPassword(!editingPassword)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                <Lock className="w-4.5 h-4.5 text-amber-600" />
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
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{passwordSuccess}</span>
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
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-700"
                  >
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
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-700"
                  >
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
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
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
