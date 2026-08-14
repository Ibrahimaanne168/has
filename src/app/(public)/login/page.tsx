"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { toast } from "sonner";
import { Lock, User as UserIcon, ArrowRight, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await loginAction(formData);
      if (res.success && res.redirectTo) {
        toast.success("Connexion réussie !");
        router.push(res.redirectTo);
        router.refresh();
      } else {
        toast.error(res.error || "Échec de connexion.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Erreur de connexion.");
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/10 to-orange-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white/90 p-8 sm:p-10 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="mx-auto relative h-16 w-16 overflow-hidden rounded-2xl border border-slate-200 shadow-md">
              <Image
                src="/images/logo_has.jpg"
                alt="HAS Logo"
                fill
                className="object-cover"
              />
            </div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
              Espace Académique
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Accédez à votre compte Administrateur, Enseignant ou Étudiant
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Identifiant / Login
              </label>
              <div className="relative flex items-center">
                <UserIcon className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  name="login"
                  required
                  placeholder="Ex: halil, papa, batoura..."
                  autoComplete="username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Mot de passe
                </label>
              </div>
              <div className="relative flex items-center">
                <Lock className="absolute left-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-600/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-700/25 hover:from-blue-800 hover:to-indigo-800 hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-98 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Vérification en cours...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Notice */}
          <div className="mt-8 rounded-xl bg-slate-50 p-3 border border-slate-200/60 text-center">
            <p className="text-xs text-slate-500 flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>Accès sécurisé par jeton de session chiffré</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
