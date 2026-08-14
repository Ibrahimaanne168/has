"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/actions/auth";
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  Users,
  BookOpen,
  Calendar,
  Megaphone,
  MessageSquare,
  User,
  LogOut,
  ChevronRight,
  Shield,
} from "lucide-react";
import { clsx } from "clsx";

interface NavItem {
  label: string;
  href: string;
  icon: any;
  badge?: number;
}

interface SidebarProps {
  role: "admin" | "enseignant" | "etudiant";
  user: {
    prenom: string;
    nom: string;
    login: string;
    photo?: string;
  };
}

export function Sidebar({ role, user }: SidebarProps) {
  const pathname = usePathname();

  const getNavItems = (): NavItem[] => {
    if (role === "admin") {
      return [
        { label: "Vue d'ensemble", href: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Filières & Matières", href: "/admin/filieres", icon: Layers },
        { label: "Enseignants", href: "/admin/enseignants", icon: GraduationCap },
        { label: "Étudiants", href: "/admin/etudiants", icon: Users },
        { label: "Supports de Cours", href: "/admin/cours", icon: BookOpen },
        { label: "Emplois du Temps", href: "/admin/edt", icon: Calendar },
        { label: "Communiqués", href: "/admin/communiques", icon: Megaphone },
        { label: "Boîte de Contact", href: "/admin/messages", icon: MessageSquare },
        { label: "Mon Profil", href: "/admin/profil", icon: User },
      ];
    }
    if (role === "enseignant") {
      return [
        { label: "Tableau de bord", href: "/professeur/dashboard", icon: LayoutDashboard },
        { label: "Mes Cours", href: "/professeur/cours", icon: BookOpen },
        { label: "Emploi du temps", href: "/professeur/edt", icon: Calendar },
        { label: "Messages", href: "/professeur/messages", icon: MessageSquare },
        { label: "Mon Profil", href: "/professeur/profil", icon: User },
      ];
    }
    return [
      { label: "Tableau de bord", href: "/etudiant/dashboard", icon: LayoutDashboard },
      { label: "Mes Cours & Docs", href: "/etudiant/cours", icon: BookOpen },
      { label: "Emploi du Temps", href: "/etudiant/edt", icon: Calendar },
      { label: "Communiqués", href: "/etudiant/communiques", icon: Megaphone },
      { label: "Mon Profil", href: "/etudiant/profil", icon: User },
    ];
  };

  const navItems = getNavItems();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200/80 bg-white flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand */}
        <div className="flex h-20 items-center gap-3 px-6 border-b border-slate-100">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 shadow-sm">
            <Image
              src="/images/logo_has.jpg"
              alt="HAS Logo"
              fill
              className="object-cover"
              sizes="40px"
              priority
            />
          </div>
          <div>
            <span className="font-display font-bold text-lg text-slate-900 leading-none block">
              HAS Académie
            </span>
            <span className="text-[11px] font-semibold text-blue-700 uppercase tracking-wider block mt-1">
              Espace {role}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-14rem)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== `/${role}/dashboard` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all group",
                  isActive
                    ? "bg-blue-700 text-white shadow-md shadow-blue-700/20"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      "h-4 w-4 transition-colors",
                      isActive ? "text-white" : "text-slate-400 group-hover:text-blue-700"
                    )}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="h-3.5 w-3.5 opacity-70" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User profile & Logout */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
        <div className="flex items-center gap-3 px-2">
          <div className="relative h-9 w-9 overflow-hidden rounded-full border border-slate-200 bg-white flex items-center justify-center font-display font-bold text-sm text-blue-700 flex-shrink-0">
            {user.prenom[0]}
            {user.nom[0]}
          </div>
          <div className="overflow-hidden">
            <p className="font-display font-bold text-sm text-slate-900 truncate">
              {user.prenom} {user.nom}
            </p>
            <p className="text-xs text-slate-500 truncate">@{user.login}</p>
          </div>
        </div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/60 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 hover:border-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Déconnexion</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
