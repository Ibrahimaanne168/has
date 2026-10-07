"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
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
  Loader2,
  XCircle,
  Clock,
  ShieldCheck,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function InscriptionPage() {
  const router = useRouter();

  // Étape courante : 1 = Coordonnées, 2 = Code 2FA, 3 = Identifiants & Mot de passe, 4 = Succès
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [filiere, setFiliere] = useState<"MPI" | "SML" | "MIASS">("MPI");
  const [niveau, setNiveau] = useState<"L1" | "L2">("L1");
  const [code2FA, setCode2FA] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Username availability
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameMsg, setUsernameMsg] = useState<string | null>(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Messages & Loading
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [createdUser, setCreatedUser] = useState<{
    id?: string;
    email?: string;
    matricule: string;
    fullName: string;
  } | null>(null);

  // Timer cooldown pour le renvoi de code
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const interval = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendCooldown]);

  // Vérification username en temps réel (debounce 500ms)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      setUsernameMsg(null);
      setUsernameSuggestions([]);
      return;
    }

    setUsernameStatus("checking");
    setUsernameMsg(null);
    setUsernameSuggestions([]);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/auth/check-username?username=${encodeURIComponent(username.trim().toLowerCase())}`);
        const data = await res.json();

        if (data.error && !data.available) {
          setUsernameStatus("invalid");
          setUsernameMsg(data.error);
          setUsernameSuggestions([]);
        } else if (data.available) {
          setUsernameStatus("available");
          setUsernameMsg(data.message || `« ${username} » est disponible ✓`);
          setUsernameSuggestions([]);
        } else {
          setUsernameStatus("taken");
          setUsernameMsg(data.message || `« ${username} » est déjà utilisé.`);
          setUsernameSuggestions(data.suggestions || []);
        }
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);
  }, [username]);

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
    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      setErrorMsg("Cet identifiant est déjà pris ou invalide. Choisissez-en un autre.");
      return;
    }
    if (usernameStatus === "checking") {
      setErrorMsg("Vérification de l'identifiant en cours, patientez un instant.");
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
          filiere,
          niveau,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        // Si le serveur retourne des suggestions (username pris)
        if (res.status === 409 && data.suggestions?.length) {
          setUsernameSuggestions(data.suggestions);
          setUsernameStatus("taken");
          setUsernameMsg(data.error);
        }
        throw new Error(data.error || "Échec de création du compte.");
      }

      setCreatedUser({
        id: data.user?.id,
        email: data.user?.email || email,
        matricule: data.user?.matricule || "ETU001",
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
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] flex flex-col justify-between transition-colors">
      {/* Header simplifié */}
      <header className="bg-white dark:bg-[#111821] border-b border-slate-200 dark:border-[#263241] py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shadow-xs ring-1 ring-slate-200 dark:ring-[#263241] flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif text-base sm:text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA] block leading-tight truncate">
                <span className="hidden sm:inline">Halil Académie Scientifique</span>
                <span className="sm:hidden">HAS</span>
              </span>
              <span className="text-[10px] text-[#e0521c] font-semibold hidden sm:block">
                Maths • Physique • Informatique
              </span>
            </div>
          </Link>
          <div className="flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <Link href="/connexion">
              <Button variant="ghost" size="sm" className="text-xs font-semibold px-2.5 sm:px-3">
                <span className="hidden sm:inline">Déjà inscrit ? Se connecter</span>
                <span className="sm:hidden">Connexion</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-xl bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] p-6 sm:p-10">
          {/* Fil d'Ariane des étapes */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-[#263241] -z-0" />
              {[
                { num: 1, label: "Identité" },
                { num: 2, label: "Confirmation Email" },
                { num: 3, label: "Compte" },
                { num: 4, label: "Validation Admin" },
              ].map((s) => (
                <div key={s.num} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      step >= s.num
                        ? "bg-[#0f2744] dark:bg-[#e0521c] text-white"
                        : "bg-white dark:bg-[#151D27] border-2 border-slate-300 dark:border-[#263241] text-slate-400 dark:text-[#687585]"
                    }`}
                  >
                    {step > s.num ? "✓" : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-medium mt-1.5 ${
                      step >= s.num ? "text-[#0f2744] dark:text-[#F5F7FA] font-semibold" : "text-slate-400 dark:text-[#687585]"
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
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              {step === 1 && "Inscription Étudiant — Étape 1/2"}
              {step === 2 && "Code de confirmation par email"}
              {step === 3 && "Finalisation du Compte — Étape 2/2"}
              {step === 4 && "Inscription Validée"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              {step === 1 && "Renseignez vos coordonnées pour recevoir votre code de confirmation."}
              {step === 2 && `Un code à 6 chiffres a été expédié à l'adresse ${email}.`}
              {step === 3 && "Définissez votre identifiant et votre mot de passe."}
              {step === 4 && "Votre dossier étudiant est prêt. Vous pouvez maintenant accéder à votre espace."}
            </p>
          </div>

          {/* Alertes d'information & d'erreur */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-rose-950/30 border border-red-200/80 dark:border-rose-900/50 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-800 dark:text-rose-200">{errorMsg}</p>
            </div>
          )}

          {infoMsg && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">{infoMsg}</p>
            </div>
          )}

          {devCode && (
            <div className="mb-6 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
              <strong>Code de confirmation (Test local / Démo) :</strong>{" "}
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
                placeholder="Ex. Prénom et Nom"
                leftIcon={<User className="w-4 h-4" />}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Adresse email personnelle"
                type="email"
                required
                placeholder="exemple@email.com"
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="Un code de confirmation vous sera envoyé sur votre adresse email."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Filière d&apos;inscription
                  </label>
                  <select
                    value={filiere}
                    onChange={(e) => setFiliere(e.target.value as "MPI" | "SML" | "MIASS")}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-xs font-medium text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                  >
                    <option value="MPI">MPI (Maths, Physique, Info)</option>
                    <option value="SML">SML (Sciences Matière, Logiciel)</option>
                    <option value="MIASS">MIASS (Maths & Info Appliquées)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#F5F7FA] mb-1.5">
                    Niveau d&apos;études
                  </label>
                  <select
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value as "L1" | "L2")}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 dark:border-[#263241] bg-white dark:bg-[#151D27] text-xs font-medium text-slate-900 dark:text-[#F5F7FA] focus:outline-none focus:ring-2 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                  >
                    <option value="L1">Licence 1 (L1)</option>
                    <option value="L2">Licence 2 (L2)</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="accent"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="w-full"
              >
                Recevoir le code de confirmation
              </Button>
            </form>
          )}

          {/* ============================================================================== */}
          {/* ÉTAPE 2 : VÉRIFICATION CODE 2FA */}
          {/* ============================================================================== */}
          {step === 2 && (
            <form onSubmit={handleStep2Submit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA] text-center">
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
                    className="w-48 text-center tracking-[12px] font-mono font-bold text-2xl py-3 border-2 border-[#0f2744] dark:border-[#e0521c] bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                  />
                </div>
                <p className="text-xs text-center text-slate-400 dark:text-[#687585]">
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
                  Valider le code de confirmation
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-slate-500 dark:text-[#AAB4C0] hover:text-slate-800 dark:hover:text-[#F5F7FA] flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Modifier l&apos;adresse email
                  </button>

                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-xs text-[#0f2744] dark:text-[#e0521c] font-medium hover:underline disabled:opacity-50 disabled:no-underline flex items-center gap-1 cursor-pointer"
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
              {/* Champ identifiant avec vérification temps réel */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">
                  Identifiant unique (Login) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-[#687585] pointer-events-none">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="username-input"
                    type="text"
                    required
                    placeholder="Ex. mtraore"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.replace(/\s/g, "").toLowerCase())}
                    className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg bg-white dark:bg-[#151D27] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#687585] focus:outline-none focus:ring-1 transition-colors ${
                      usernameStatus === "available"
                        ? "border-emerald-400 focus:ring-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20"
                        : usernameStatus === "taken" || usernameStatus === "invalid"
                        ? "border-red-400 focus:ring-red-400 bg-red-50/30 dark:bg-rose-950/20"
                        : "border-slate-200 dark:border-[#263241] focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {usernameStatus === "checking" && <Loader2 className="w-4 h-4 text-slate-400 dark:text-[#687585] animate-spin" />}
                    {usernameStatus === "available" && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {(usernameStatus === "taken" || usernameStatus === "invalid") && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                </div>

                {/* Message de statut */}
                {usernameMsg && (
                  <p className={`text-[11px] font-medium flex items-center gap-1 ${
                    usernameStatus === "available" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-rose-400"
                  }`}>
                    {usernameMsg}
                  </p>
                )}
                {usernameStatus === "idle" && (
                  <p className="text-[11px] text-slate-400 dark:text-[#687585]">Lettres, chiffres, tirets ou underscore. 3–30 caractères.</p>
                )}

                {/* Suggestions d'identifiants alternatifs */}
                {usernameSuggestions.length > 0 && (
                  <div className="mt-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 rounded-lg space-y-1.5">
                    <p className="text-[11px] font-semibold text-amber-800 dark:text-amber-200">
                      Identifiants disponibles suggérés — cliquez pour choisir :
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {usernameSuggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setUsername(s)}
                          className="px-3 py-1 rounded-full text-[11px] font-bold bg-white dark:bg-[#111821] border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-amber-900/40 hover:border-amber-400 transition-colors font-mono cursor-pointer"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
                      className="text-slate-400 dark:text-[#687585] hover:text-slate-600 dark:hover:text-[#F5F7FA] focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {/* Critères de robustesse affichés et validés en temps réel */}
                <div className="p-3 bg-slate-50 dark:bg-[#151D27] rounded-md border border-slate-200 dark:border-[#263241] space-y-1 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-[#F5F7FA] block mb-1">
                    Exigences de sécurité du mot de passe :
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
                    <div className={passwordChecks.length ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-[#687585]"}>
                      {passwordChecks.length ? "✓" : "○"} Au moins 8 caractères
                    </div>
                    <div className={passwordChecks.hasUpper ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-[#687585]"}>
                      {passwordChecks.hasUpper ? "✓" : "○"} Une majuscule (A-Z)
                    </div>
                    <div className={passwordChecks.hasLower ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-[#687585]"}>
                      {passwordChecks.hasLower ? "✓" : "○"} Une minuscule (a-z)
                    </div>
                    <div className={passwordChecks.hasNumber ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-[#687585]"}>
                      {passwordChecks.hasNumber ? "✓" : "○"} Un chiffre (0-9)
                    </div>
                    <div className={passwordChecks.hasSpecial ? "text-emerald-700 dark:text-emerald-400 font-medium" : "text-slate-500 dark:text-[#687585]"}>
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
          {/* ÉTAPE 4 : CONFIRMATION & EN ATTENTE DE VALIDATION ADMIN */}
          {/* ============================================================================== */}
          {step === 4 && (
            <div className="text-center space-y-6 py-2">
              <div className="w-16 h-16 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  <span>Dossier transmis • En attente de validation</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                  Demande d&apos;inscription transmise !
                </h3>
                <p className="text-sm text-slate-600 dark:text-[#AAB4C0] max-w-md mx-auto">
                  Félicitations <strong>{createdUser?.fullName}</strong> ! Votre dossier a été transmis à l&apos;administration de Halil Académie Scientifique.
                </p>
              </div>

              {/* Récapitulatif du dossier */}
              <div className="bg-slate-50 dark:bg-[#151D27] rounded-2xl border border-slate-200/90 dark:border-[#263241] p-4 text-left space-y-2 text-xs w-full">
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#263241]">
                  <span className="text-slate-500 dark:text-[#AAB4C0]">Candidat :</span>
                  <span className="font-bold text-slate-900 dark:text-[#F5F7FA]">{createdUser?.fullName}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#263241]">
                  <span className="text-slate-500 dark:text-[#AAB4C0]">Matricule officiel :</span>
                  <span className="font-mono font-bold text-[#0f2744] dark:text-[#e0521c]">
                    {createdUser?.matricule}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-200/60 dark:border-[#263241]">
                  <span className="text-slate-500 dark:text-[#AAB4C0]">Filière & Niveau :</span>
                  <span className="font-semibold text-slate-800 dark:text-[#F5F7FA]">
                    {filiere} — {niveau}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 items-center">
                  <span className="text-slate-500 dark:text-[#AAB4C0]">Statut du compte :</span>
                  <span className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-full text-[11px]">
                    <Clock className="w-3 h-3" />
                    En attente de validation admin
                  </span>
                </div>
              </div>

              {/* Message explicatif Telegram / Administration */}
              <div className="p-4 bg-blue-50/70 dark:bg-[#1E4976]/20 border border-blue-200 dark:border-[#2b5ca5]/40 rounded-xl text-left space-y-1.5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-[#0f2744] dark:text-sky-300">
                  <Bell className="w-4 h-4 text-[#e0521c]" />
                  <span>Notification transmise à l&apos;administration</span>
                </div>
                <p className="text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
                  L&apos;administration a été alertée de votre demande d&apos;inscription. Dès que les administrateurs auront validé votre dossier, votre compte sera activé et vous pourrez vous connecter à votre espace à n&apos;importe quel moment.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push("/connexion")}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Aller à la page de connexion
                </Button>
                <Link href="/">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Retour à l&apos;accueil
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-[#687585] border-t border-slate-200 dark:border-[#263241] bg-white dark:bg-[#111821]">
        © {new Date().getFullYear()} Halil Académie Scientifique (HAS) — Tous droits réservés.
      </footer>
    </div>
  );
}
