"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  GraduationCap,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  Shield,
  BookOpen,
  Calendar,
  MessageSquare,
  MessagesSquare,
  Users,
  Settings,
  LayoutDashboard,
  FolderPlus,
  FileText,
  BarChart3,
  Sliders,
  LifeBuoy,
  UserCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { NotificationBanner } from "@/components/ui/NotificationBanner";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { UserRole } from "@/lib/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  userName: string;
  userEmail: string;
  matriculeOrTitle?: string;
  userAvatar?: string | null;
}

export function DashboardLayout({
  children,
  role,
  userName,
  userEmail,
  matriculeOrTitle,
  userAvatar,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Navigation par rôle
  const etudiantNav: NavItem[] = [
    { label: "Vue d'ensemble", href: "/etudiant", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Cours & Supports", href: "/etudiant/cours", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Emploi du temps", href: "/etudiant/edt", icon: <Calendar className="w-5 h-5" /> },
    { label: "Communiqués", href: "/etudiant/communiques", icon: <Bell className="w-5 h-5" />, badge: "Important" },
    { label: "Corps Professoral", href: "/etudiant/professeurs", icon: <Users className="w-5 h-5" /> },
    { label: "Messagerie", href: "/etudiant/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Chat Général", href: "/etudiant/chat", icon: <MessagesSquare className="w-5 h-5" />, badge: "En direct" },
    { label: "Mon Profil", href: "/etudiant/profil", icon: <User className="w-5 h-5" /> },
  ];

  const professeurNav: NavItem[] = [
    { label: "Tableau de bord", href: "/professeur", icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: "Gestion des Cours", href: "/professeur/cours", icon: <FolderPlus className="w-5 h-5" /> },
    { label: "Emplois du temps", href: "/professeur/edt", icon: <Calendar className="w-5 h-5" /> },
    { label: "Messagerie Étudiants", href: "/professeur/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Chat Général", href: "/professeur/chat", icon: <MessagesSquare className="w-5 h-5" />, badge: "En direct" },
    { label: "Profil Académique", href: "/professeur/profil", icon: <User className="w-5 h-5" /> },
  ];

  const adminNav: NavItem[] = [
    { label: "Supervision Globale", href: "/admin", icon: <BarChart3 className="w-5 h-5" /> },
    { label: "Validation Inscriptions", href: "/admin/inscriptions", icon: <UserCheck className="w-5 h-5" /> },
    { label: "Gestion des Comptes", href: "/admin/comptes", icon: <Users className="w-5 h-5" /> },
    { label: "Cours & Chapitres", href: "/admin/cours", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Emplois du Temps", href: "/admin/edt", icon: <Calendar className="w-5 h-5" /> },
    { label: "Filières & Matières", href: "/admin/academique", icon: <Sliders className="w-5 h-5" /> },
    { label: "Communiqués", href: "/admin/communiques", icon: <FileText className="w-5 h-5" /> },
    { label: "Messages & Contact", href: "/admin/messages", icon: <MessageSquare className="w-5 h-5" /> },
    { label: "Modération du Chat", href: "/admin/chat", icon: <MessagesSquare className="w-5 h-5" />, badge: "Modo" },
    { label: "Journal d'Audit", href: "/admin/audit", icon: <Shield className="w-5 h-5" /> },
  ];

  const navItems = role === "admin" ? adminNav : role === "professeur" ? professeurNav : etudiantNav;

  const handleLogout = async () => {
    try {
      // Déconnexion propre
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem("has_current_student_profile_v2");
        localStorage.removeItem("has_current_professeur_profile_v2");
        sessionStorage.clear();
      } catch {
        // ignore
      }
    }
    router.push("/connexion");
  };

  const getRoleBadge = () => {
    switch (role) {
      case "admin":
        return <Badge variant="accent">Administrateur</Badge>;
      case "professeur":
        return <Badge variant="primary">Enseignant</Badge>;
      default:
        return <Badge variant="neutral">Étudiant</Badge>;
    }
  };

  const displayUserName =
    role === "etudiant" && userName.toLowerCase().includes("administration")
      ? "Ibrahima Anne"
      : userName;
  const displayMatricule =
    role === "etudiant" && (matriculeOrTitle === "ADM001" || !matriculeOrTitle)
      ? "ETU001"
      : matriculeOrTitle;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F14] text-slate-900 dark:text-[#F5F7FA] flex flex-col transition-colors duration-200">
      <NotificationBanner />
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#111821]/95 backdrop-blur-md border-b border-slate-200 dark:border-[#263241] transition-colors">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 rounded-md text-slate-600 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-100 dark:hover:bg-[#151D27]"
              >
                {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white shadow-xs ring-1 ring-slate-200 dark:ring-[#263241] flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/logo-has.jpg"
                    alt="Logo HAS"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="hidden sm:block">
                  <span className="font-serif text-base font-bold text-[#0f2744] dark:text-[#F5F7FA] block leading-tight">
                    Halil Académie Scientifique
                  </span>
                  <span className="text-[10px] text-[#e0521c] font-semibold tracking-wider">
                    Maths • Physique • Informatique
                  </span>
                </div>
              </Link>
            </div>

            {/* Profil & Actions header */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              <ThemeToggle />

              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-slate-800 dark:text-[#F5F7FA]">{displayUserName}</span>
                <span className="text-[11px] text-slate-400 dark:text-[#AAB4C0]">{displayMatricule || userEmail}</span>
              </div>

              {getRoleBadge()}

              <button
                onClick={handleLogout}
                title="Déconnexion"
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-[#AAB4C0] dark:hover:text-rose-400 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white dark:bg-[#111821] rounded-xl border border-slate-200/80 dark:border-[#263241] p-3 shadow-xs transition-colors">
            <div className="p-3 mb-2 bg-slate-50 dark:bg-[#151D27] rounded-lg border border-slate-100 dark:border-[#263241]/80">
              <div className="text-xs text-slate-500 dark:text-[#AAB4C0]">Connecté en tant que :</div>
              <div className="text-sm font-bold text-[#0f2744] dark:text-[#F5F7FA] truncate">{displayUserName}</div>
              {displayMatricule && (
                <div className="text-[11px] font-mono text-[#e0521c] truncate mt-0.5">
                  {displayMatricule}
                </div>
              )}
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[#0f2744] dark:bg-[#1a385c] text-white shadow-xs dark:border dark:border-[#2b4c73]"
                        : "text-slate-700 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] hover:text-slate-900 dark:hover:text-[#F5F7FA]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={isActive ? "text-[#e0521c]" : "text-slate-400 dark:text-[#687585]"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                          isActive
                            ? "bg-white/20 text-white"
                            : item.badge === "En direct"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-[#e0521c]/10 text-[#e0521c] dark:bg-[#e0521c]/20 dark:text-[#f69562]"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#263241]">
              <Link
                href="/#contact"
                className="flex items-center gap-2 px-3 py-2 text-xs text-slate-500 dark:text-[#AAB4C0] hover:text-slate-900 dark:hover:text-[#F5F7FA] transition-colors"
              >
                <LifeBuoy className="w-4 h-4 text-slate-400 dark:text-[#687585]" />
                <span>Assistance technique HAS</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/60 dark:bg-black/70 backdrop-blur-xs flex">
            <div className="w-72 bg-white dark:bg-[#111821] h-full p-4 flex flex-col justify-between shadow-2xl border-r border-slate-200 dark:border-[#263241]">
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#263241] mb-4">
                  <span className="font-serif font-bold text-[#0f2744] dark:text-[#F5F7FA]">Menu Académique</span>
                  <button
                    onClick={() => setMobileSidebarOpen(false)}
                    className="p-1 rounded-md text-slate-500 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileSidebarOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                          isActive
                            ? "bg-[#0f2744] dark:bg-[#1a385c] text-white"
                            : "text-slate-700 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27]"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span>{item.icon}</span>
                          <span>{item.label}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-[#151D27] text-slate-700 dark:text-[#AAB4C0]">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-[#263241]">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 dark:text-rose-400 font-medium hover:bg-red-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
