"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  UserCheck,
  UserX,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Mail,
  Phone,
  GraduationCap,
  Calendar,
  Send,
  User,
  Check,
  X,
  ExternalLink,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface StudentCandidate {
  id: string;
  email: string;
  full_name: string;
  username: string | null;
  telephone: string | null;
  matricule: string | null;
  is_active: boolean;
  statut_inscription: "en_attente" | "valide" | "refuse" | null;
  created_at: string;
  updated_at?: string;
  user_metadata?: {
    filiere?: string;
    niveau?: string;
  };
}

export default function AdminInscriptionsPage() {
  const [candidates, setCandidates] = useState<StudentCandidate[]>([]);
  const [counts, setCounts] = useState({ pending: 0, validated: 0, rejected: 0, total: 0 });
  const [statusFilter, setStatusFilter] = useState<"pending" | "valide" | "refuse" | "all">("pending");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const loadCandidates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/validation-inscriptions?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setCandidates(data.students || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (err) {
      console.warn("[LOAD-CANDIDATES-ERROR]", err);
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  const handleAction = async (studentId: string, action: "accept" | "reject" | "pending") => {
    setActionLoading(studentId);
    setNotification(null);
    try {
      const res = await fetch("/api/admin/validation-inscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, action }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification({
          type: "success",
          message: data.message || `Action effectuée avec succès.`,
        });
        loadCandidates();
      } else {
        setNotification({
          type: "error",
          message: data.error || "Une erreur est survenue lors de l'exécution de l'action.",
        });
      }
    } catch {
      setNotification({
        type: "error",
        message: "Erreur réseau lors de la communication avec le serveur.",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      (c.full_name && c.full_name.toLowerCase().includes(q)) ||
      (c.email && c.email.toLowerCase().includes(q)) ||
      (c.telephone && c.telephone.includes(q)) ||
      (c.matricule && c.matricule.toLowerCase().includes(q)) ||
      (c.username && c.username.toLowerCase().includes(q))
    );
  });

  return (
    <DashboardLayout
      role="admin"
      userName="Administration HAS"
      userEmail="admin@has.sn"
      matriculeOrTitle="Directeur des Admissions"
    >
      <div className="space-y-6">
        {/* En-tête de la page */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-2xl p-6 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#e0521c]">
                Portail des Admissions & Validation
              </p>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] dark:text-[#F5F7FA]">
              Validation des Inscriptions
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-[#AAB4C0] max-w-2xl">
              Examinez, acceptez ou refusez les demandes des nouveaux étudiants. Toute décision envoie automatiquement un email officiel (Resend) avec un lien direct vers le site.
            </p>
          </div>

          <button
            onClick={loadCandidates}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-[#151D27] hover:bg-slate-200 dark:hover:bg-[#1e293b] text-slate-700 dark:text-[#F5F7FA] text-xs font-semibold border border-slate-200 dark:border-[#263241] transition-colors cursor-pointer shrink-0"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            <span>Actualiser</span>
          </button>
        </div>

        {/* Bannière de notification flash */}
        {notification && (
          <div
            className={`p-4 rounded-xl border flex items-start justify-between gap-3 animate-in fade-in duration-200 ${
              notification.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200"
                : "bg-red-50 dark:bg-rose-950/30 border-red-200 dark:border-rose-800 text-red-900 dark:text-rose-200"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {notification.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-rose-400 shrink-0 mt-0.5" />
              )}
              <p className="text-xs sm:text-sm font-medium leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Compteurs statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div
            onClick={() => setStatusFilter("pending")}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "pending"
                ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700 shadow-sm ring-2 ring-amber-400/20"
                : "bg-white dark:bg-[#111821] border-slate-200 dark:border-[#263241] hover:border-amber-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                En attente
              </span>
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-slate-900 dark:text-[#F5F7FA]">
              {counts.pending}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-[#687585] mt-0.5">Nécessite votre validation</p>
          </div>

          <div
            onClick={() => setStatusFilter("valide")}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "valide"
                ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 shadow-sm ring-2 ring-emerald-400/20"
                : "bg-white dark:bg-[#111821] border-slate-200 dark:border-[#263241] hover:border-emerald-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                Validés & Actifs
              </span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-slate-900 dark:text-[#F5F7FA]">
              {counts.validated}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-[#687585] mt-0.5">Accès autorisé au portail</p>
          </div>

          <div
            onClick={() => setStatusFilter("refuse")}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "refuse"
                ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-300 dark:border-rose-700 shadow-sm ring-2 ring-rose-400/20"
                : "bg-white dark:bg-[#111821] border-slate-200 dark:border-[#263241] hover:border-rose-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
                Refusés
              </span>
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            </div>
            <p className="text-2xl font-serif font-bold text-slate-900 dark:text-[#F5F7FA]">
              {counts.rejected}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-[#687585] mt-0.5">Dossiers non retenus</p>
          </div>

          <div
            onClick={() => setStatusFilter("all")}
            className={`p-4 rounded-xl border transition-all cursor-pointer ${
              statusFilter === "all"
                ? "bg-slate-100 dark:bg-[#151D27] border-slate-400 dark:border-slate-600 shadow-sm ring-2 ring-slate-400/20"
                : "bg-white dark:bg-[#111821] border-slate-200 dark:border-[#263241] hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-[#AAB4C0]">
                Total Candidatures
              </span>
              <User className="w-4 h-4 text-slate-500" />
            </div>
            <p className="text-2xl font-serif font-bold text-slate-900 dark:text-[#F5F7FA]">
              {counts.total}
            </p>
            <p className="text-[11px] text-slate-400 dark:text-[#687585] mt-0.5">Historique des demandes</p>
          </div>
        </div>

        {/* Barre de recherche et filtres d'onglets */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-xl p-3 shadow-xs">
          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setStatusFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "pending"
                  ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                  : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100"
              }`}
            >
              En attente ({counts.pending})
            </button>
            <button
              onClick={() => setStatusFilter("valide")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "valide"
                  ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                  : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100"
              }`}
            >
              Validés ({counts.validated})
            </button>
            <button
              onClick={() => setStatusFilter("refuse")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "refuse"
                  ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                  : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100"
              }`}
            >
              Refusés ({counts.rejected})
            </button>
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                statusFilter === "all"
                  ? "bg-[#0f2744] text-white dark:bg-[#e0521c]"
                  : "bg-slate-50 dark:bg-[#151D27] text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100"
              }`}
            >
              Tous ({counts.total})
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher par nom, email, tél..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] rounded-lg text-xs text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#0f2744] dark:focus:ring-[#e0521c]"
            />
          </div>
        </div>

        {/* Liste des candidatures */}
        {isLoading ? (
          <div className="p-16 text-center bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241]">
            <RefreshCw className="w-8 h-8 text-[#0f2744] dark:text-[#e0521c] animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600 dark:text-[#AAB4C0]">
              Chargement des dossiers d&apos;inscription...
            </p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-[#111821] rounded-2xl border border-slate-200 dark:border-[#263241] space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-[#151D27] border border-slate-200 dark:border-[#263241] flex items-center justify-center mx-auto text-[#0f2744] dark:text-[#F5F7FA]">
              <UserCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-lg font-bold text-slate-800 dark:text-[#F5F7FA]">
                {statusFilter === "pending"
                  ? "Toutes les demandes en attente ont été traitées"
                  : statusFilter === "valide"
                  ? "Aucun dossier validé pour l'instant"
                  : statusFilter === "refuse"
                  ? "Aucun dossier refusé pour l'instant"
                  : "Aucun dossier ne correspond à votre recherche"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#AAB4C0] max-w-lg mx-auto">
                {statusFilter === "pending"
                  ? `Aucun nouveau candidat n'attend actuellement de validation. Vous pouvez consulter les dossiers déjà traités (${counts.validated} validé(s), ${counts.rejected} refusé(s)) ci-dessous :`
                  : "Modifiez votre recherche ou utilisez les filtres d'onglets pour accéder aux autres dossiers."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="px-4 py-2 rounded-xl bg-[#0f2744] dark:bg-[#e0521c] text-white text-xs font-bold transition-all shadow-xs cursor-pointer hover:opacity-90"
              >
                Afficher tous les dossiers ({counts.total})
              </button>
              {counts.validated > 0 && statusFilter !== "valide" && (
                <button
                  type="button"
                  onClick={() => setStatusFilter("valide")}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Voir les validés ({counts.validated})
                </button>
              )}
              {counts.rejected > 0 && statusFilter !== "refuse" && (
                <button
                  type="button"
                  onClick={() => setStatusFilter("refuse")}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Voir les refusés ({counts.rejected})
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredCandidates.map((c) => {
              const isPending = !c.statut_inscription || c.statut_inscription === "en_attente";
              const isValidated = c.statut_inscription === "valide";
              const isRejected = c.statut_inscription === "refuse";

              return (
                <div
                  key={c.id}
                  className="bg-white dark:bg-[#111821] border border-slate-200/90 dark:border-[#263241] rounded-2xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  {/* Informations de base */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0f2744] to-[#1e3a8a] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-sm">
                      {(c.full_name || "E").charAt(0).toUpperCase()}
                    </div>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-serif text-base font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                          {c.full_name}
                        </h3>

                        {isPending && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                            <Clock className="w-3 h-3 animate-pulse" />
                            En attente de validation
                          </span>
                        )}

                        {isValidated && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" />
                            Validé &amp; Actif
                          </span>
                        )}

                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                            <XCircle className="w-3 h-3" />
                            Refusé
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-[#AAB4C0]">
                        <span className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-700 dark:text-[#F5F7FA]">{c.email}</span>
                        </span>

                        {c.telephone && (
                          <span className="flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{c.telephone}</span>
                          </span>
                        )}

                        {c.matricule && (
                          <span className="bg-slate-100 dark:bg-[#151D27] px-2 py-0.5 rounded text-[11px] font-mono text-slate-600 dark:text-[#AAB4C0]">
                            Matricule: {c.matricule}
                          </span>
                        )}

                        <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          {new Date(c.created_at).toLocaleDateString("fr-FR", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Boutons d'action administrative */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-[#263241]">
                    {isPending ? (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading === c.id}
                          onClick={() => handleAction(c.id, "accept")}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{actionLoading === c.id ? "Traitement..." : "Accepter l'inscription"}</span>
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading === c.id}
                          onClick={() => handleAction(c.id, "reject")}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Refuser</span>
                        </button>
                      </>
                    ) : isValidated ? (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading === c.id}
                          onClick={() => handleAction(c.id, "reject")}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 transition-colors cursor-pointer"
                          title="Désactiver et révoquer l'accès"
                        >
                          <UserX className="w-3.5 h-3.5" />
                          <span>Révoquer l&apos;accès</span>
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading === c.id}
                          onClick={() => handleAction(c.id, "pending")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] border border-slate-200 dark:border-[#263241] transition-colors cursor-pointer"
                          title="Remettre le dossier en attente d'examen"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Remettre en attente</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={actionLoading === c.id}
                          onClick={() => handleAction(c.id, "accept")}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 transition-colors cursor-pointer"
                          title="Réexaminer et activer le compte"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Réexaminer &amp; Accepter</span>
                        </button>

                        <button
                          type="button"
                          disabled={actionLoading === c.id}
                          onClick={() => handleAction(c.id, "pending")}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-[#AAB4C0] hover:bg-slate-100 dark:hover:bg-[#151D27] border border-slate-200 dark:border-[#263241] transition-colors cursor-pointer"
                          title="Remettre le dossier en attente d'examen"
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span>Remettre en attente</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
