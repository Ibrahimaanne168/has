import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/lib/auth";
import { User, LogIn, LayoutDashboard, Sparkles } from "lucide-react";

export async function Navbar() {
  const user = await getCurrentUser();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role_id === 1) return "/admin/dashboard";
    if (user.role_id === 2) return "/professeur/dashboard";
    return "/etudiant/dashboard";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-slate-200 shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src="/images/logo_has.jpg"
              alt="HAS Logo"
              fill
              className="object-cover"
              sizes="48px"
              priority
            />
          </div>
          <div>
            <span className="block font-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-700 transition-colors">
              HAS
            </span>
            <span className="block text-xs font-medium text-slate-500 tracking-wider uppercase">
              Halil Académie Scientifique
            </span>
          </div>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
          <Link
            href="/"
            className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/presentation"
            className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Présentation
          </Link>
          <Link
            href="/professeurs"
            className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Professeurs
          </Link>
          <Link
            href="/contact"
            className="rounded-lg px-4 py-2 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Contact
          </Link>
        </nav>

        {/* CTA Login / Dashboard */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link
              href={getDashboardLink()}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-700/20 hover:bg-blue-800 hover:shadow-lg transition-all active:scale-95"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Mon Espace ({user.prenom})</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-700 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-700/20 hover:from-blue-800 hover:to-indigo-800 hover:shadow-lg transition-all active:scale-95"
            >
              <LogIn className="h-4 w-4" />
              <span>Connexion</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
