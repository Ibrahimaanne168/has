"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  ShieldCheck,
  Mail,
  User,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function InscriptionPage() {
  const router = useRouter();

  // Étape courante : 1 = Coordonnées, 2 = Code 2FA, 3 = Identifiants & Mot de passe, 4 = Succès
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [code2FA, setCode2FA] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Messages & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [createdUser, setCreatedUser] = useState<{ matricule: string; fullName: string } | null>(null);

  // Timer cooldown pour le renvoi de code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Validation mot de passe en direct
  const passwordChecks = {
    length: password.length >= 8,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[@$!%*?&_\-#]/.test(password),
  };
  const isPasswordValid = Object.values(passwordChecks).every(Boolean);

  // 1. Soumission Étape 1 : Demande de code 2FA
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch("/api/auth/signup-step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Impossible d'envoyer le code.");
      }

      setInfoMsg(data.message || "Code de vérification envoyé.");
      if (data.devCode) {
        setDevCode(data.devCode);
      }
      setResendCooldown(60);
      setStep(2);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur réseau";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Renvoi du code 2FA
  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/auth/signup-step1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de renvoi");
      setInfoMsg("Un nouveau code a été envoyé.");
      if (data.devCode) setDevCode(data.devCode);
      setResendCooldown(60);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Soumission Étape 2 : Vérification du code 2FA
  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: code2FA.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Code invalide.");
      }

      setInfoMsg("Code vérifié avec succès.");
      setStep(3);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de validation";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Soumission Étape 3 : Création du compte final
  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setErrorMsg("Veuillez respecter l'ensemble des critères de robustesse du mot de passe.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Les deux mots de passe ne sont pas identiques.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setInfoMsg(null);

    try {
      const res = await fetch("/api/auth/signup-step2", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          code: code2FA.trim(),
          fullName,
          username: username.trim().toLowerCase(),
          password,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Échec de création du compte.");
      }

      setCreatedUser({
        matricule: data.user?.matricule || "HAS-ETU-NOUVEAU",
        fullName,
      });
      setStep(4);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header simplifié */}
      <header className="bg-white border-b border-slate-200 py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-xs ring-1 ring-slate-200 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-[#0f2744] block leading-tight">
                Halil Académie Scientifique
              </span>
              <span className="text-[10px] text-[#e0521c] font-semibold">
                Maths • Physique • Informatique
              </span>
            </div>
          </Link>
          <Link href="/connexion">
            <Button variant="ghost" size="sm">
              Déjà inscrit ? Se connecter
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-xl bg-white border border-slate-200/90 rounded-xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] p-6 sm:p-10">
          {/* Fil d'Ariane des étapes */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
              {[
                { num: 1, label: "Identité" },
                { num: 2, label: "Sécurité 2FA" },
                { num: 3, label: "Compte" },
              ].map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s.num
                        ? "bg-[#0f2744] text-white"
                        : "bg-white border-2 border-slate-300 text-slate-400"
                    }`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 ${
                      step >= s.num ? "text-[#0f2744] font-semibold" : "text-slate-400"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* En-tête de section */}
          <div className="mb-6 text-center">
            <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">Portail d&apos;Admission</p>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              {step === 1 && "Inscription Étudiant — Étape 1/2"}
              {step === 2 && "Vérification de sécurité 2FA"}
              {step === 3 && "Finalisation du Compte — Étape 2/2"}
              {step === 4 && "Inscription Validée"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {step === 1 && "Renseignez vos coordonnées officielles pour recevoir votre code sécurisé."}
              {step === 2 && `Un code à 6 chiffres a été expédié à l'adresse ${email}.`}
              {step === 3 && "Définissez votre identifiant de connexion et un mot de passe robuste."}
              {step === 4 && "Votre dossier étudiant est prêt. Vous pouvez maintenant accéder à votre espace."}
            </p>
          </div>

          {/* Alertes d'information & d'erreur */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200/80 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800">{errorMsg}</p>
            </div>
          )}

          {infoMsg && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200/80 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-800">{infoMsg}</p>
            </div>
          )}

          {devCode && (
            <div className="mb-6 p-3 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <strong>Code 2FA (Test local / Démo) :</strong>{" "}
              <span className="font-mono text-sm font-bold tracking-widest text-[#e0521c]">
                {devCode}
              </span>
            </div>
          )}

          {/* ============================================================================== */}
          {/* ÉTAPE 1 : NOM COMPLET & EMAIL */}
          {/* ============================================================================== */}
          {step === 1 && (
            <form onSubmit={handleStep1Submit} className="space-y-5">
              <Input
                label="Nom complet et prénom(s)"
                required
                placeholder="Ex. Mamadou Traoré"
                leftIcon={<User className="w-4 h-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Adresse email"
                type="email"
                required
                placeholder="m.traore@exemple.com"
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Un code de confirmation vous sera envoyé via l'API sécurisée Brevo."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-2.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#0f2744] shrink-0 mt-0.5" />
                <span>
                  L&apos;inscription autonome sur ce portail est réservée au statut <strong>Étudiant</strong>.
                  Les accès Professeurs et Administrateurs sont créés exclusivement par la Direction.
                </span>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                Continuer et Recevoir le Code 2FA
              </Button>
            </form>
          )}

          {/* ============================================================================== */}
          {/* ÉTAPE 2 : VÉRIFICATION CODE 2FA */}
          {/* ============================================================================== */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 text-center">
                  Saisissez le code à 6 chiffres reçu
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    autoFocus
                    placeholder="••••••"
                    value={code2FA}
                    onChange={(e) => setCode2FA(e.target.value.replace(/\D/g, ""))}
                    className="w-48 text-center tracking-[12px] font-mono font-bold text-2xl py-3 border-2 border-[#0f2744] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2744]"
                  />
                </div>
                <p className="text-xs text-center text-slate-400">
                  Code valable pendant 10 minutes (5 tentatives max).
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  disabled={code2FA.length !== 6}
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full"
                >
                  Valider le code de sécurité
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Modifier l&apos;adresse email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-xs text-[#0f2744] font-medium hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {resendCooldown > 0 ? `Renvoyer (${resendCooldown}s)` : "Renvoyer un nouveau code"}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ============================================================================== */}
          {/* ÉTAPE 3 : IDENTIFIANT & MOT DE PASSE SÉCURISÉ */}
          {/* ============================================================================== */}
          {step === 3 && (
            <form onSubmit={handleStep3Submit} className="space-y-5">
              <Input
                label="Identifiant unique (Login)"
                required
                placeholder="Ex. mtraore"
                leftIcon={<KeyRound className="w-4 h-4" />}
                helperText="Lettres, chiffres, points ou tirets sans espace."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <div className="space-y-1.5">
                <Input
                  label="Mot de passe"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••••••"
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Critères de robustesse affichés et validés en temps réel */}
                <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1 text-xs">
                  <span className="font-semibold text-slate-700 block mb-1">
                    Exigences de sécurité du mot de passe :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    <div className={passwordChecks.length ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      {passwordChecks.length ? "✓" : "○"} Au moins 8 caractères
                    </div>
                    <div className={passwordChecks.hasUpper ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      {passwordChecks.hasUpper ? "✓" : "○"} Une majuscule (A-Z)
                    </div>
                    <div className={passwordChecks.hasLower ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      {passwordChecks.hasLower ? "✓" : "○"} Une minuscule (a-z)
                    </div>
                    <div className={passwordChecks.hasNumber ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      {passwordChecks.hasNumber ? "✓" : "○"} Un chiffre (0-9)
                    </div>
                    <div className={passwordChecks.hasSpecial ? "text-emerald-700 font-medium" : "text-slate-500"}>
                      {passwordChecks.hasSpecial ? "✓" : "○"} Un caractère spécial (@$!%*?&_-#)
                    </div>
                  </div>
                </div>
              </div>

              <Input
                label="Confirmer le mot de passe"
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                leftIcon={<Lock className="w-4 h-4" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="accent"
                size="lg"
                isLoading={isLoading}
                disabled={!isPasswordValid || password !== confirmPassword}
                className="w-full"
              >
                Finaliser la création de mon compte
              </Button>
            </form>
          )}

          {/* ============================================================================== */}
          {/* ÉTAPE 4 : SUCCÈS & ATTRIBUTION MATRICULE */}
          {/* ============================================================================== */}
          {step === 4 && (
            <div className="text-center space-y-6 py-4">
              <div className="w-16 h-16 bg-emerald-50 border border-emerald-200/80 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl font-bold text-[#0f2744]">
                  Bienvenue à Halil Académie Scientifique !
                </h3>
                <p className="text-sm text-slate-600">
                  Félicitations <strong>{createdUser?.fullName}</strong>, votre compte étudiant a été créé
                  et votre identité a été certifiée par double facteur.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 inline-block text-left w-full max-w-sm">
                <span className="text-xs text-slate-500 uppercase tracking-wider block">
                  Matricule officiel attribué :
                </span>
                <span className="font-mono text-lg font-bold text-[#0f2744] block mt-1">
                  {createdUser?.matricule}
                </span>
                <span className="text-xs text-slate-400 block mt-2">
                  Conservez ce matricule pour vos examens et relevés de notes.
                </span>
              </div>

              <div className="pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/connexion")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Accéder à la page de Connexion
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} Halil Académie Scientifique (HAS) — Portail Sécurisé
      </footer>
    </div>
  );
}
