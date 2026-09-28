"use client";

import React, { useState } from "react";
import { Search, AlertCircle, Calendar } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT, MOCK_COMMUNIQUES } from "@/lib/data/mock-data";

export default function EtudiantCommuniquesPage() {
  const [communiques] = useState(MOCK_COMMUNIQUES);
  const [filterImportant, setFilterImportant] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = communiques.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImportant = !filterImportant || item.is_important;
    return matchesSearch && matchesImportant;
  });

  return (
    <DashboardLayout
      role="etudiant"
      userName={MOCK_STUDENT.full_name}
      userEmail={MOCK_STUDENT.email}
      matriculeOrTitle={MOCK_STUDENT.matricule || "HAS-ETU"}
    >
      <div className="space-y-6">
        <div>
          <p className="text-[11px] font-bold tracking-wider uppercase text-[#e0521c] mb-1">
            Communication Officielle
          </p>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#0f2744] leading-snug">
            Communiqués &amp; Notes de Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Annonces de la Direction Générale et du Secrétariat Académique de Halil Académie Scientifique
          </p>
        </div>

        {/* Barre de recherche et filtre */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une annonce ou mot-clé..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-200/90 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744] focus:border-[#0f2744] transition-colors"
            />
          </div>

          <button
            onClick={() => setFilterImportant(!filterImportant)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              filterImportant
                ? "bg-[#e0521c]/10 border-[#e0521c]/30 text-[#e0521c]"
                : "bg-white border-slate-200/90 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Important uniquement</span>
          </button>
        </div>

        {/* Liste des communiqués (cartes géométriques) */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-5 sm:p-6 shadow-[0_2px_8px_-2px_rgba(15,23,42,0.05)] transition-all duration-200 hover:shadow-md ${
                item.is_important ? "border-amber-300/80 bg-gradient-to-r from-amber-50/15 to-white" : "border-slate-200/90"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2">
                  {item.is_important && (
                    <Badge variant="accent" size="sm" uppercase>
                      Important
                    </Badge>
                  )}
                  <span className="text-[11px] text-slate-500 font-semibold tracking-wide">
                    Émis par : {item.published_by || "Direction Générale HAS"}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {new Date(item.created_at).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <h2 className="font-serif text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
