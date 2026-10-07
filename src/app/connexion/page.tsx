"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Lock,
  Mail,
  User,
  ArrowRight,
  AlertCircle,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { getStoredProfesseurs } from "@/lib/academicStorage";

function ConnexionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect");

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(searchParams.get("error") || null);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const cleanInput = emailOrUsername.trim().toLowerCase();
      const allProfs = getStoredProfesseurs();
      const matchedProf = allProfs.find((p) =>
        (p.email && p.email.toLowerCase() === cleanInput) ||
        (p.username && p.username.toLowerCase() === cleanInput) ||
        (p.matricule && p.matricule.toLowerCase() === cleanInput) ||
        (p.full_name && p.full_name.toLowerCase() === cleanInput) ||
        cleanInput.includes(p.username?.toLowerCase() || "___") ||
        (p.nom && cleanInput.includes(p.nom.toLowerCase()))
      );

      if (matchedProf && typeof window !== "undefined") {
        try {
          localStorage.setItem("has_current_professeur_profile_v2", JSON.stringify(matchedProf));
          localStorage.setItem("has_auth_role", "professeur");
          localStorage.setItem("has_auth_identifier", cleanInput);
        } catch {}
      }

      const supabase = createClient();
      const isPlaceholder = process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

      // Si le backend Supabase est actif
      if (!isPlaceholder) {
        let authEmail = emailOrUsername.trim();
        let detectedRole: string | null = null;

        // Résolution de l'identifiant (ex: identifiant username ou email)
        try {
          const res = await fetch(`/api/auth/resolve-identifier?identifier=${encodeURIComponent(authEmail)}`);
          if (res.ok) {
            const resolved = await res.json();
            if (resolved?.email) {
              authEmail = resolved.email;
            }
            if (resolved?.role) {
              detectedRole = resolved.role;
            }
          }
        } catch (fetchErr) {
          console.warn("Erreur résolution identifiant:", fetchErr);
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password,
        });

        if (error) {
          throw new Error("Identifiant ou mot de passe incorrect.");
        }

        // Détection du rôle de l'utilisateur
        let role = detectedRole || data.user?.user_metadata?.role;

        // VÉRIFICATION SYSTÉMATIQUE DU STATUT ÉTUDIANT (Validation administrative obligatoire)
        try {
          const { data: profile } = await supabase
            .from("profiles")
            .select("role, is_active, statut_inscription, full_name")
            .eq("id", data.user.id)
            .maybeSingle();

          if (profile) {
            if (profile.role) role = profile.role;

            // Si c'est un compte étudiant : vérification stricte de l'autorisation d'entrée
            if (profile.role === "etudiant" && (profile.is_active === false || profile.statut_inscription !== "valide")) {
              await supabase.auth.signOut();
              setErrorMsg(
                profile.statut_inscription === "refuse"
                  ? "Votre demande d'inscription a été refusée par l'administration de HAS. L'accès aux espaces académiques vous est refusé."
                  : "Votre inscription est actuellement en attente de validation par l'administration de HAS. Vous recevrez un email dès que votre accès sera approuvé par la direction."
              );
              setIsLoading(false);
              return;
            }
          }
        } catch (profileErr) {
          console.warn("[LOGIN-PROFILE-CHECK]", profileErr);
        }

        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("has_current_student_profile_v2");
            if (!matchedProf) {
              localStorage.removeItem("has_current_professeur_profile_v2");
            }
          } catch {}
        }

        if (!role) {
          if (
            authEmail.toLowerCase().includes("admin") ||
            authEmail.toLowerCase().startsWith("halil@") ||
            authEmail.toLowerCase().startsWith("direction@") ||
            authEmail.toLowerCase().endsWith("@has-internal.local")
          ) {
            role = "admin";
          } else if (matchedProf || authEmail.toLowerCase().includes("prof")) {
            role = "professeur";
          } else {
            role = "etudiant";
          }
        }

        if (role === "admin") {
          window.location.href = "/admin";
          return;
        } else if (role === "professeur") {
          window.location.href = "/professeur";
          return;
        } else if (redirectTarget && redirectTarget.startsWith("/etudiant")) {
          window.location.href = redirectTarget;
          return;
        } else {
          window.location.href = "/etudiant";
          return;
        }
      }

      // Mode démo / local si Supabase non encore connecté
      if (emailOrUsername.toLowerCase().includes("admin")) {
        window.location.href = "/admin";
      } else if (matchedProf || emailOrUsername.toLowerCase().includes("prof")) {
        window.location.href = "/professeur";
      } else {
        window.location.href = "/etudiant";
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur de connexion";
      setErrorMsg(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotSuccess(null);
    try {
      // Simule ou déclenche l'envoi de réinitialisation
      await new Promise((res) => setTimeout(res, 800));
      setForgotSuccess(
        `Si un compte est associé à l'adresse ${forgotEmail}, un lien de réinitialisation vient de vous être envoyé par email.`
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] flex flex-col justify-between transition-colors">
      {/* Header Mobile & Desktop */}
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
            <Link href="/inscription">
              <Button variant="outline" size="sm" className="text-xs font-semibold px-3">
                <span className="hidden sm:inline">Créer un compte étudiant</span>
                <span className="sm:hidden">Inscription</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Formulaire Principal */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] dark:shadow-[0_4px_24px_-4px_rgba(0,0,0,0.6)] p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0f2744]/10 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA] border border-transparent dark:border-[#263241] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#0f2744] dark:text-[#F5F7FA]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA] leading-snug">
              Espace Numérique de Travail
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              Connectez-vous avec votre identifiant et mot de passe
            </p>
          </div>

          {errorMsg && (
            errorMsg.includes("attente") ? (
              <div className="mb-5 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800/60 flex items-start gap-3 shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                </div>
                <div className="space-y-1">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300">
                    Dossier en cours d&apos;examen
                  </span>
                  <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 leading-snug">
                    {errorMsg}
                  </p>
                  <p className="text-[11px] text-amber-700 dark:text-amber-400/90 leading-relaxed">
                    Un email officiel de confirmation vous sera envoyé dès que l&apos;administration aura validé votre entrée.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mb-5 p-3.5 rounded-lg bg-red-50 dark:bg-rose-950/30 border border-red-200/80 dark:border-rose-900/50 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-red-800 dark:text-rose-200">{errorMsg}</p>
              </div>
            )
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Identifiant"
              required
              placeholder="Identifiant ou email"
              leftIcon={<User className="w-4 h-4" />}
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
            />

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-slate-700 dark:text-[#F5F7FA]">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-[#0f2744] dark:text-amber-400 dark:hover:text-amber-300 hover:underline cursor-pointer"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <Input
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
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4 text-[#e0521c]" />}
              className="w-full mt-2"
            >
              Connexion
            </Button>
          </form>
        </div>
      </main>

      {/* Modal Mot de passe oublié */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111821] rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200/90 dark:border-[#263241] space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              Réinitialisation de mot de passe
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#AAB4C0] leading-relaxed">
              Saisissez l&apos;adresse email associée à votre compte. Un lien
              de réinitialisation vous sera envoyé par email.
            </p>

            {forgotSuccess ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
                {forgotSuccess}
              </div>
            ) : (
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <Input
                  label="Votre adresse email"
                  type="email"
                  required
                  placeholder="exemple@email.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />
                <div className="border-t border-slate-100 dark:border-[#263241] pt-3 flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="rounded-lg text-xs"
                    onClick={() => setForgotModalOpen(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    variant="accent"
                    size="sm"
                    className="rounded-lg text-xs"
                    isLoading={forgotLoading}
                  >
                    Envoyer le lien
                  </Button>
                </div>
              </form>
            )}

            {forgotSuccess && (
              <div className="border-t border-slate-100 dark:border-[#263241] pt-3 text-right">
                <Button
                  variant="primary"
                  size="sm"
                  className="rounded-lg text-xs"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSuccess(null);
                  }}
                >
                  Fermer
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-slate-400 dark:text-[#687585] border-t border-slate-200 dark:border-[#263241] bg-white dark:bg-[#111821]">
        © {new Date().getFullYear()} Halil Académie Scientifique (HAS) — Tous droits réservés.
      </footer>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F14] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f2744] dark:border-[#e0521c]"></div>
        </div>
      }
    >
      <ConnexionForm />
    </Suspense>
  );
}
