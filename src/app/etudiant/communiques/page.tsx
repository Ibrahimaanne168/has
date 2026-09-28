"use client";

import React, { useState } from "react";
import { Bell, Search, AlertCircle, Calendar, ShieldCheck, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { MOCK_STUDENT, MOCK_COMMUNIQUES } from "@/lib/data/mock-data";

export default function EtudiantCommuniquesPage() {
  const [communiques, setCommuniques] = useState(MOCK_COMMUNIQUES);
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
          <h1 className="font-serif text-2xl font-bold text-[#0f2744]">
            Communiqués & Notes Officielles
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Annonces de la Direction Générale et de la Scolarité de Halil Académie Scientifique
          </p>
        </div>

        {/* Barre de recherche et filtre */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0f2744]"
            />
          </div>

          <button
            onClick={() => setFilterImportant(!filterImportant)}
            className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium border transition-colors ${
              filterImportant
                ? "bg-[#e0521c]/10 border-[#e0521c]/40 text-[#e0521c] font-semibold"
                : "bg-white border-slate-300 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Important uniquement</span>
          </button>
        </div>

        {/* Liste des communiqués */}
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl border p-6 shadow-xs transition-shadow hover:shadow-md ${
                item.is_important ? "border-amber-300 bg-linear-to-r from-amber-50/20 to-white" : "border-slate-200"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  {item.is_important && (
                    <Badge variant="accent" size="sm">
                      Important / Urgent
                    </Badge>
                  )}
                  <span className="text-xs text-slate-500 font-medium">
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

              <h2 className="font-serif text-lg font-bold text-slate-900 mb-2">
                {item.title}
              </h2>

              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
