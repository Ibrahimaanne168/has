"use client";

import React, { useState, useEffect } from "react";
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
  Camera,
  Trash2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import { passwordRegex, passwordRequirementsMessage } from "@/lib/validators";
import { createClient } from "@/lib/supabase/client";
import { compressImage } from "@/lib/imageCompression";

export default function ProfesseurProfilPage() {
  const { prof, updateProfProfile } = useCurrentProfesseur();

  const [phone, setPhone] = useState(prof.phone || "");
  const [specialite, setSpecialite] = useState(prof.specialite || "");
  const [bio, setBio] = useState(prof.bio || "");
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

  useEffect(() => {
    setPhone(prof.phone || "");
    setSpecialite(prof.specialite || "");
    setBio(prof.bio || "");
  }, [prof]);

  // Initiales pour l'avatar
  const initials = prof.full_name
    ? prof.full_name.split(" ").filter(Boolean).map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "PR";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfProfile({ phone, specialite, bio });
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
      const compressedDataUrl = await compressImage(file, 512, 512, 0.82);
      await updateProfProfile({ photo: compressedDataUrl, avatar_url: compressedDataUrl });
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
      await updateProfProfile({ photo: null, avatar_url: null });
      setPhotoSuccess("Photo de profil retirée.");
      setTimeout(() => setPhotoSuccess(null), 3500);
    } catch {
      setPhotoError("Erreur lors de la suppression de la photo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
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
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #e0521c 0%, transparent 50%), radial-gradient(circle at 80% 20%, #ffffff 0%, transparent 40%)" }} />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar initiales ou photo compressée */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#e0521c] to-[#f07040] flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-lg border-4 border-white/20 overflow-hidden relative">
                  {(prof.photo || prof.avatar_url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={prof.photo || prof.avatar_url || ""}
                      alt={prof.full_name}
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

                <label
                  htmlFor="prof-photo-upload"
                  className="absolute -bottom-1 -right-1 p-2 rounded-full bg-[#0f2744] hover:bg-[#1a3a60] border-2 border-white text-white cursor-pointer shadow-md transition-all active:scale-95"
                  title="Ajouter ou modifier votre photo (compressée automatiquement)"
                >
                  <Camera className="w-3.5 h-3.5 text-[#e0521c]" />
                  <input
                    id="prof-photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                  />
                </label>
              </div>

              {/* Infos principales (sans email) */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-white/60">Enseignant HAS</span>
                  <span className="w-1 h-1 rounded-full bg-white/30" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-300">Actif</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white font-serif leading-tight">{prof.full_name}</h1>
                <p className="text-sm text-white/60 mt-0.5">{prof.specialite || "Enseignant-Chercheur HAS"}</p>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className="flex items-center gap-1.5 text-xs text-white/70">
                    <Hash className="w-3.5 h-3.5 text-[#e0521c]" />
                    {prof.matricule || "PROF001"}
                  </span>
                  {(prof.photo || prof.avatar_url) && (
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="inline-flex items-center gap-1 text-[11px] text-red-300 hover:text-red-200 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" /> Retirer la photo
                    </button>
                  )}
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
                <p className="text-xs text-slate-500">{prof.specialite || "Spécialité non renseignée"}</p>
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
                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">
                    Spécialité officielle
                  </label>
                  <select
                    value={specialite}
                    onChange={(e) => setSpecialite(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-white font-medium text-slate-800 focus:border-[#0f2744] focus:ring-1 focus:ring-[#0f2744]"
                  >
                    <option value="Informatique">Informatique</option>
                    <option value="Math">Math</option>
                    <option value="Physique">Physique</option>
                    <option value="Economie">Economie</option>
                  </select>
                </div>
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
                <p className="text-sm font-bold text-slate-900">Mot de passe & Sécurité</p>
                <p className="text-xs text-slate-500">Mettre à jour vos accès académiques</p>
              </div>
            </div>
            <Edit3 className={`w-4 h-4 transition-colors ${editingPassword ? "text-[#e0521c]" : "text-slate-400"}`} />
          </div>

          {editingPassword && (
            <div className="px-5 pb-5 border-t border-slate-100">
              {passwordSuccess && (
                <div className="mt-4 p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{passwordSuccess}</span>
                </div>
              )}
              {passwordError && (
                <div className="mt-4 p-3.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {passwordError}
                </div>
              )}
              <form onSubmit={handleUpdatePassword} className="mt-4 space-y-4">
                <div className="relative">
                  <Input
                    label="Nouveau mot de passe"
                    type={showNewPwd ? "text" : "password"}
                    required
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <div className="relative">
                  <Input
                    label="Confirmer le mot de passe"
                    type={showConfirmPwd ? "text" : "password"}
                    required
                    leftIcon={<Lock className="w-4 h-4" />}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPwd(!showConfirmPwd)}
                    className="absolute right-3 top-8 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-slate-400">{passwordRequirementsMessage}</p>
                <Button type="submit" variant="outline" size="sm" leftIcon={<Save className="w-3.5 h-3.5" />}>
                  Changer le mot de passe
                </Button>
              </form>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
