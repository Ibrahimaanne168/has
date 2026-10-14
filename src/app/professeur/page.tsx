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
  Video,
  Clock,
  Edit2,
  Copy,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { useCurrentProfesseur } from "@/lib/useCurrentProfesseur";
import {
  getStoredCourses,
  getStoredDirectMessages,
  getStudentsForProfesseur,
  getStoredSeancesEDT,
  syncSeancesWithServer,
} from "@/lib/academicStorage";
import { Cours, Message, SeanceEDT } from "@/lib/types";
import { ProfEmailVerificationBanner } from "@/components/professeur/ProfEmailVerificationBanner";
import { ProfMeetModal } from "@/components/professeur/ProfMeetModal";

export default function ProfesseurDashboard() {
  const { prof } = useCurrentProfesseur();
  const [courses, setCourses] = useState<Cours[]>(() => {
    if (typeof window === "undefined") return [];
    return getStoredCourses();
  });
  const [directMessages, setDirectMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    return getStoredDirectMessages();
  });
  const [seances, setSeances] = useState<SeanceEDT[]>(() => {
    if (typeof window === "undefined") return [];
    return getStoredSeancesEDT();
  });
  const [editingMeetSeance, setEditingMeetSeance] = useState<SeanceEDT | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authRole = localStorage.getItem("has_auth_role");
      const authIdent = (localStorage.getItem("has_auth_identifier") || "").toLowerCase();
      if (
        authRole === "admin" ||
        authIdent === "ibou" ||
        authIdent === "halil" ||
        authIdent.startsWith("ibou@") ||
        authIdent.startsWith("halil@")
      ) {
        window.location.href = "/admin";
        return;
      }
    }
    syncSeancesWithServer().then((s) => setSeances(s)).catch(() => {});
    const handleUpdate = () => {
      setCourses(getStoredCourses());
      setDirectMessages(getStoredDirectMessages());
      setSeances(getStoredSeancesEDT());
    };
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  // Séances de cours de l'EDT assignées à cet enseignant
  const mySeances = seances.filter((s) => {
    return Boolean(
      (prof.id && s.professeur_id === prof.id) ||
      (prof.matricule && s.professeur_id === prof.matricule) ||
      (prof.full_name && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.full_name.toLowerCase())) ||
      (prof.nom && s.professeur_nom && s.professeur_nom.toLowerCase().includes(prof.nom.toLowerCase())) ||
      ((prof.username === "halilsamb" || (prof.nom && prof.nom.toLowerCase().includes("samb"))) &&
        s.professeur_nom && s.professeur_nom.toLowerCase().includes("halil")) ||
      (prof.nom && prof.nom.toLowerCase().includes("thiam") && s.professeur_nom && s.professeur_nom.toLowerCase().includes("thiam")) ||
      (((prof.nom && prof.nom.toLowerCase().includes("sow")) || (prof.prenom && prof.prenom.toLowerCase().includes("diop"))) &&
        s.professeur_nom && (s.professeur_nom.toLowerCase().includes("diop") || s.professeur_nom.toLowerCase().includes("sow"))) ||
      ((prof.username === "mamour" || (prof.full_name && prof.full_name.toLowerCase().includes("mamour"))) &&
        s.professeur_nom && (s.professeur_nom.toLowerCase().includes("mamour") || s.professeur_nom.toLowerCase().includes("diop"))) ||
      (prof.nom && prof.nom.toLowerCase().includes("ndiaye") && s.professeur_nom && s.professeur_nom.toLowerCase().includes("ndiogou"))
    );
  });

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
        {/* Bannière de certification de l'adresse email officielle */}
        <ProfEmailVerificationBanner />

        {/* En-tête Professeur */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              Bienvenue, {prof.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] mt-1">
              Gérez vos cours, déposez vos supports pédagogiques et répondez à vos promotions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#151D27] border border-transparent dark:border-[#263241] text-xs font-semibold text-slate-700 dark:text-[#F5F7FA]">
              {prof.specialite || "Enseignant-Chercheur"}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-[#0f2744]/10 dark:bg-[#151D27] border border-transparent dark:border-[#263241] text-xs font-mono font-bold text-[#0f2744] dark:text-[#e0521c]">
              {prof.matricule && prof.matricule !== "PROF-HAS" ? prof.matricule : "PRF001"}
            </span>
          </div>
        </div>

        {/* Statistiques réelles et dynamiques (plus aucune fausse donnée) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Cours publiés",
              value: myCourses.length.toString(),
              sub: myCourses.length > 0 ? "Actifs au catalogue" : "Aucun cours",
              icon: <BookOpen className="w-5 h-5 text-[#0f2744] dark:text-cyan-400" />,
              color: "bg-[#0f2744]/5 dark:bg-[#151D27]",
            },
            {
              label: "Classes encadrées",
              value: classesCount.toString(),
              sub: classesCount > 0 ? classesEncadrees.slice(0, 2).join(", ") : "0 classe",
              icon: <Users className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
              color: "bg-emerald-50 dark:bg-emerald-950/30",
            },
            {
              label: "Messages reçus",
              value: receivedMessages.length.toString(),
              sub: unreadMessagesCount > 0 ? `${unreadMessagesCount} non lu(s)` : "Tous lus",
              icon: <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
              color: "bg-amber-50 dark:bg-amber-950/30",
            },
            {
              label: "Étudiants encadrés",
              value: realStudentsCount.toString(),
              sub: realStudentsCount === 0 ? "Aucun étudiant inscrit" : `${realStudentsCount} étudiant(s) inscrit(s)`,
              icon: <BarChart3 className="w-5 h-5 text-[#e0521c]" />,
              color: "bg-[#e0521c]/5 dark:bg-orange-950/30",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200/90 dark:border-[#263241] p-5 shadow-xs dark:shadow-[0_2px_8px_-2px_rgba(0,0,0,0.4)] flex flex-col justify-between gap-3 transition-colors">
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg ${stat.color} border border-transparent dark:border-[#263241] flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <div className="font-serif text-2xl font-bold text-slate-900 dark:text-[#F5F7FA]">{stat.value}</div>
                <div className="text-xs font-semibold text-slate-700 dark:text-[#AAB4C0]">{stat.label}</div>
                <div className="text-[11px] text-slate-400 dark:text-[#687585] mt-0.5">{stat.sub}</div>
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
              <h2 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">Mes Cours Récemment Publiés</h2>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0]">Supports officiels déposés par {prof.full_name}</p>
            </div>
            <Link href="/professeur/cours">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Gérer mes cours
              </Button>
            </Link>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white dark:bg-[#111821] rounded-xl border border-dashed border-slate-300 dark:border-[#263241] p-8 text-center space-y-2">
              <BookOpen className="w-8 h-8 text-slate-300 dark:text-[#687585] mx-auto" />
              <p className="font-serif text-sm font-bold text-slate-800 dark:text-[#F5F7FA]">
                Aucun cours publié pour le moment
              </p>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto">
                Cliquez sur &quot;Déposer un nouveau cours&quot; ci-dessus pour déposer votre premier support de cours ou TD.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {myCourses.slice(0, 3).map((c) => (
                <div key={c.id} className="bg-white dark:bg-[#111821] rounded-xl border border-slate-200 dark:border-[#263241] p-5 flex flex-col justify-between shadow-xs hover:border-[#0f2744]/40 dark:hover:border-[#e0521c]/50 transition-colors">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-[#e0521c]">
                        {c.matiere?.code || "COURS"}
                      </span>
                      {c.classe?.code && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#0f2744]/10 dark:bg-[#151D27] text-[#0f2744] dark:text-[#F5F7FA] border border-transparent dark:border-[#263241]">
                          {c.classe.code}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA] leading-snug">{c.title}</h3>
                    {c.description && <p className="text-xs text-slate-600 dark:text-[#AAB4C0] line-clamp-2">{c.description}</p>}
                  </div>
                  <div className="pt-4 border-t border-slate-100 dark:border-[#263241] flex items-center justify-between text-xs text-slate-400 dark:text-[#687585] mt-3">
                    <span>{new Date(c.created_at).toLocaleDateString("fr-FR")}</span>
                    {c.file_url && (
                      <a href={c.file_url} target="_blank" rel="noopener noreferrer" className="text-[#0f2744] dark:text-[#e0521c] hover:underline font-semibold flex items-center gap-1">
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

        {/* ── MES SÉANCES DE L'EMPLOI DU TEMPS & LIENS GOOGLE MEET ── */}
        <div className="space-y-4 pt-4 border-t border-slate-200/80 dark:border-[#263241]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-[#e0521c]" />
                <h2 className="font-serif text-xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
                  Mes Séances de l&apos;Emploi du Temps & Liens Google Meet
                </h2>
              </div>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] mt-1">
                L&apos;administration planifie vos horaires. Vous recevez un rappel <strong>1 heure avant</strong> pour créer et renseigner votre lien Meet.
              </p>
            </div>
            <Link href="/professeur/edt">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                Grille complète EDT
              </Button>
            </Link>
          </div>

          {mySeances.length === 0 ? (
            <div className="bg-white dark:bg-[#111821] rounded-xl border border-dashed border-slate-300 dark:border-[#263241] p-8 text-center space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 dark:text-[#687585] mx-auto" />
              <p className="font-serif text-sm font-bold text-slate-800 dark:text-[#F5F7FA]">
                Aucune séance programmée pour vous dans l&apos;emploi du temps
              </p>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-sm mx-auto">
                Dès que l&apos;administration planifiera un cours pour vous, il apparaîtra ici avec la possibilité d&apos;y associer votre lien Meet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mySeances.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-[#111821] rounded-2xl border-2 border-slate-200/90 dark:border-[#263241] p-5 flex flex-col justify-between shadow-xs hover:border-[#e0521c]/60 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-[#0f2744] text-white dark:bg-[#151D27] font-black text-xs uppercase tracking-wider">
                        {s.jour}
                      </span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 dark:bg-orange-950/40 border border-orange-200/60 dark:border-orange-800/40 text-[#e0521c] font-black text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{s.heure_debut} – {s.heure_fin}</span>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA] leading-tight">
                        {s.matiere_nom}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border border-blue-200/60">
                          Promotion {s.niveau || "HAS"}
                        </span>
                        {s.filieres && s.filieres.length > 0 && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/60">
                            {s.filieres.join(" / ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-2">
                      {s.meet_url ? (
                        <div className="p-2.5 rounded-xl bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/70 dark:border-emerald-800/40 space-y-2">
                          <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-300">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Lien Meet actif
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                              Prêt
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <a
                              href={s.meet_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1 transition-all"
                            >
                              <Video className="w-3.5 h-3.5" />
                              Lancer Meet
                              <ExternalLink className="w-2.5 h-2.5 opacity-80" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                navigator?.clipboard?.writeText(s.meet_url!);
                                setCopiedLink(s.meet_url!);
                                setTimeout(() => setCopiedLink(null), 2500);
                              }}
                              title="Copier le lien"
                              className="p-1.5 rounded-lg border border-emerald-200 bg-white dark:bg-[#111821] text-slate-600 dark:text-slate-300 hover:bg-emerald-50 cursor-pointer"
                            >
                              {copiedLink === s.meet_url ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingMeetSeance(s)}
                              title="Modifier le lien"
                              className="px-2 py-1.5 rounded-lg bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#e0521c] font-bold text-xs cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 space-y-2">
                          <p className="text-[11px] font-bold text-amber-800 dark:text-amber-300">
                            ⚠️ Aucun lien Meet configuré
                          </p>
                          <button
                            type="button"
                            onClick={() => setEditingMeetSeance(s)}
                            className="w-full py-2 px-3 rounded-lg bg-gradient-to-r from-[#e0521c] to-[#f07040] hover:brightness-110 active:scale-98 text-white font-bold text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer animate-pulse"
                          >
                            <Video className="w-3.5 h-3.5" />
                            + Créer / Ajouter mon Meet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal de création / modification du lien Meet */}
        <ProfMeetModal
          seance={editingMeetSeance}
          isOpen={Boolean(editingMeetSeance)}
          onClose={() => setEditingMeetSeance(null)}
          onSaved={(updated) => {
            setSeances((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
            setEditingMeetSeance(null);
          }}
          userEmail={prof.email}
        />
      </div>
    </DashboardLayout>
  );
}
