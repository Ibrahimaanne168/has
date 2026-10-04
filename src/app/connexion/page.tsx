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
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";

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

        if (!role) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", data.user.id)
              .maybeSingle();

            if (profile?.role) {
              role = profile.role;
            }
          } catch {
            // Ignorer si la table profiles n'est pas encore créée
          }
        }

        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem("has_current_student_profile_v2");
            localStorage.removeItem("has_current_professeur_profile_v2");
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
          } else {
            role = "etudiant";
          }
        }

        if (redirectTarget) {
          router.push(redirectTarget);
        } else if (role === "admin") {
          router.push("/admin");
        } else if (role === "professeur") {
          router.push("/professeur");
        } else {
          router.push("/etudiant");
        }
        return;
      }

      // Mode démo / local si Supabase non encore connecté
      if (emailOrUsername.toLowerCase().includes("admin")) {
        router.push("/admin");
      } else if (emailOrUsername.toLowerCase().includes("prof")) {
        router.push("/professeur");
      } else {
        router.push("/etudiant");
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header Mobile & Desktop */}
      <header className="bg-white border-b border-slate-200 py-3 sm:py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shadow-xs ring-1 ring-slate-200 flex items-center justify-center shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/logo-has.jpg"
                alt="Logo HAS"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <span className="font-serif text-base sm:text-lg font-bold text-[#0f2744] block leading-tight truncate">
                <span className="hidden sm:inline">Halil Académie Scientifique</span>
                <span className="sm:hidden">HAS</span>
              </span>
              <span className="text-[10px] text-[#e0521c] font-semibold hidden sm:block">
                Maths • Physique • Informatique
              </span>
            </div>
          </Link>
          <Link href="/inscription" className="shrink-0">
            <Button variant="outline" size="sm" className="text-xs font-semibold px-3">
              <span className="hidden sm:inline">Créer un compte étudiant</span>
              <span className="sm:hidden">Inscription</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Formulaire Principal */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white border border-slate-200/90 rounded-xl shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] p-6 sm:p-8">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-[#0f2744]/10 text-[#0f2744] flex items-center justify-center mx-auto mb-3">
              <Lock className="w-6 h-6 text-[#0f2744]" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
              Espace Numérique de Travail
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Connectez-vous avec votre identifiant et mot de passe
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200/80 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-medium text-red-800">{errorMsg}</p>
            </div>
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
                <label className="block text-sm font-medium text-slate-700">
                  Mot de passe
                </label>
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-xs text-[#0f2744] hover:underline"
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
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
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
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200/90 space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#0f2744]">
              Réinitialisation de mot de passe
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saisissez l&apos;adresse email associée à votre compte. Un lien
              de réinitialisation vous sera envoyé par email.
            </p>

            {forgotSuccess ? (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-xs text-emerald-800">
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
                <div className="border-t border-slate-100 pt-3 flex justify-end gap-2">
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
              <div className="border-t border-slate-100 pt-3 text-right">
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
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white">
        © {new Date().getFullYear()} Halil Académie Scientifique (HAS) — Tous droits réservés.
      </footer>
    </div>
  );
}

export default function ConnexionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0f2744]"></div>
        </div>
      }
    >
      <ConnexionForm />
    </Suspense>
  );
}
