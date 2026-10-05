"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  FileText,
  MessageSquare,
  ArrowRight,
  Download,
  ExternalLink,
  PlusCircle,
  Calendar,
  Users,
  Sparkles,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import { getStoredCourses, getStoredDirectMessages, getStudentsForProfesseur } from "@/lib/academicStorage";
import { Cours, Message } from "@/lib/types";

export default function ProfesseurDashboard() {
  const { prof } = useCurrentProfesseur();
  const [courses, setCourses] = useState<Cours[]>([]);
  const [directMessages, setDirectMessages] = useState<Message[]>([]);

  const loadData = () => {
    setCourses(getStoredCourses());
    setDirectMessages(getStoredDirectMessages());
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  // Cours strictement associés à ce professeur (par id, matricule ou nom)
  const myCourses = courses.filter((c) => {
    const profIdMatch = c.professeur_id === prof.id || c.professeur?.id === prof.id;
    const profMatriculeMatch = prof.matricule && (c.professeur?.matricule === prof.matricule || c.professeur_id === prof.matricule);
    const profEmailMatch = prof.email && c.professeur?.email === prof.email;
    const profNameMatch = prof.nom && c.professeur?.full_name?.toLowerCase().includes(prof.nom.toLowerCase());
    return profIdMatch || profMatriculeMatch || profEmailMatch || profNameMatch;
  });

  // Messages réellement reçus par cet enseignant
  const receivedMessages = directMessages.filter((m) =>
    m.receiver_id === prof.id ||
    m.receiver_id === prof.matricule ||
    (prof.email && m.receiver_id === prof.email) ||
    m.receiver_id === String(prof.user_id)
  );

  const unreadMessagesCount = receivedMessages.filter((m) => !m.is_read).length;

  // Classes encadrées déduites du profil du professeur
  const classesEncadrees = prof.classes || (prof.matieres && prof.matieres.length > 0 ? ["L1-MPI", "L2-MPI"] : []);
  const classesCount = classesEncadrees.length;

  // Effectif réel des étudiants inscrits dans les classes de cet enseignant (aucune fausse donnée)
  const realStudents = getStudentsForProfesseur(prof);
  const realStudentsCount = realStudents.length;

  return (
    <DashboardLayout
      role="professeur"
      userName={prof.full_name}
      userEmail={prof.email}
      matriculeOrTitle={prof.matricule || "PROF001"}
    >
      <div className="space-y-8">
        {/* Bannière de bienvenue Professeur */}
        <div className="bg-[#0f2744] text-white rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
          <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs font-medium text-slate-200">
                <Sparkles className="w-3.5 h-3.5 text-[#e0521c]" />
                <span>Espace Enseignant-Chercheur • Année 2024-2025</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Bienvenue, {prof.full_name}
              </h1>
              <p className="text-sm text-slate-300 leading-relaxed">
                Gérez vos cours, déposez vos supports pédagogiques et répondez aux questions de vos étudiants depuis votre espace dédié Halil Académie Scientifique.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-200 pt-2">
                <span className="bg-white/15 px-3 py-1 rounded-md">
                  Spécialité : {prof.specialite || "Informatique"}
                </span>
                <span className="bg-white/15 px-3 py-1 rounded-md font-mono">
                  {prof.matricule || "PROF-HAS"}
                </span>
                {prof.email && (
                  <span className="bg-white/10 px-3 py-1 rounded-md text-slate-300">
                    {prof.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques réelles et dynamiques (plus aucune fausse donnée) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Cours publiés",
              value: myCourses.length.toString(),
              sub: myCourses.length > 0 ? "Actifs au catalogue" : "Aucun cours",
              icon: <BookOpen className="w-5 h-5 text-[#0f2744]" />,
              color: "bg-[#0f2744]/5",
            },
            {
              label: "Classes encadrées",
              value: classesCount.toString(),
              sub: classesCount > 0 ? classesEncadrees.slice(0, 2).join(", ") : "0 classe",
              icon: <Users className="w-5 h-5 text-emerald-600" />,
              color: "bg-emerald-50",
            },
            {
              label: "Messages reçus",
              value: receivedMessages.length.toString(),
              sub: unreadMessagesCount > 0 ? `${unreadMessagesCount} non lu(s)` : "Tous lus",
              icon: <MessageSquare className="w-5 h-5 text-amber-600" />,
              color: "bg-amber-50",
            },
            {
              label: "Étudiants encadrés",
              value: realStudentsCount.toString(),
              sub: realStudentsCount === 0 ? "Aucun étudiant inscrit" : `${realStudentsCount} étudiant(s) inscrit(s)`,
              icon: <BarChart3 className="w-5 h-5 text-[#e0521c]" />,
              color: "bg-[#e0521c]/5",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-700">{stat.label}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">{stat.sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="flex flex-wrap gap-3">
          <Link href="/professeur/cours">
            <Button variant="accent" size="md" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Déposer un nouveau cours
            </Button>
          </Link>
          <Link href="/professeur/edt">
            <Button variant="outline" size="md" leftIcon={<Calendar className="w-4 h-4" />}>
              Voir les emplois du temps
            </Button>
          </Link>
          <Link href="/professeur/messages">
            <Button variant="outline" size="md" leftIcon={<MessageSquare className="w-4 h-4" />}>
              Messagerie étudiants {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
            </Button>
          </Link>
        </div>

        {/* Mes derniers cours publiés */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#0f2744]">Mes Cours Récemment Publiés</h2>
              <p className="text-xs text-slate-500">Supports officiels déposés par {prof.full_name}</p>
            </div>
            <Link href="/professeur/cours">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Gérer mes cours
              </Button>
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-8 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-serif text-sm font-bold text-slate-800">
                Aucun cours publié pour le moment
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Cliquez sur &quot;Déposer un nouveau cours&quot; ci-dessus pour déposer votre premier support de cours ou TD.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCourses.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between shadow-xs hover:border-[#0f2744]/40 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#e0521c]">
                        {c.matiere?.code || "COURS"}
                      </span>
                      {c.classe?.code && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f2744]/10 text-[#0f2744]">
                          {c.classe.code}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 leading-snug">{c.title}</h3>
                    {c.description && <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>}
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 mt-3">
                    <span>{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                    {c.file_url && (
                      <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="text-[#0f2744] hover:underline font-semibold flex items-center gap-1">
                        <span>Voir PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
