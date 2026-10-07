"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Calendar, Bell, FileText, Download, Image as ImageIcon, Eye, X } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Badge } from "@/components/ui/Badge";
import { useCurrentUser } from "@/lib/useCurrentUser";
import { getStoredCommuniques } from "@/lib/academicStorage";
import { Communique } from "@/lib/types";

export default function EtudiantCommuniquesPage() {
  const { user } = useCurrentUser();
  const [communiques, setCommuniques] = useState<Communique[]>([]);
  const [filterImportant, setFilterImportant] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<{ url: string; title: string } | null>(null);

  useEffect(() => {
    setCommuniques(getStoredCommuniques());
    const handleUpdate = () => setCommuniques(getStoredCommuniques());
    window.addEventListener("has_academic_storage_updated", handleUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleUpdate);
  }, []);

  const filtered = communiques.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesImportant = !filterImportant || item.is_important;
    return matchesSearch && matchesImportant;
  });

  return (
    <DashboardLayout
      role="etudiant"
      userName={user.full_name}
      userEmail={user.email}
      matriculeOrTitle={user.matricule || "ETU001"}
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

        {/* Liste des communiqués ou état vide */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="font-serif text-base font-bold text-slate-800">
              {communiques.length === 0
                ? "Aucun communiqué officiel pour le moment"
                : "Aucun résultat correspondant"}
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {communiques.length === 0
                ? "L'administration publiera les notes de service, annonces pédagogiques et informations d'examens ici."
                : "Modifiez vos filtres ou réinitialisez la recherche."}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((item) => {
              const isImage = Boolean(
                item.file_url &&
                (item.file_url.startsWith("data:image") ||
                 /\.(jpg|jpeg|png|webp|gif)$/i.test(item.file_name || "") ||
                 /\.(jpg|jpeg|png|webp|gif)$/i.test(item.file_url || ""))
              );

              return (
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

                  {item.content && (
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line mb-4">
                      {item.content}
                    </p>
                  )}

                  {/* Fichier joint : Image ou PDF */}
                  {item.file_url && (
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      {isImage ? (
                        <div className="space-y-2">
                          <div
                            onClick={() => setPreviewImage({ url: item.file_url!, title: item.title })}
                            className="relative max-w-md max-h-72 rounded-lg overflow-hidden border border-slate-200 cursor-pointer group bg-slate-50 flex items-center justify-center"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.file_url}
                              alt={item.title}
                              className="max-h-72 w-full object-contain group-hover:scale-[1.02] transition-transform duration-200"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold">
                              <Eye className="w-4 h-4" /> Cliquer pour agrandir
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={item.file_url}
                              download={item.file_name || `${(item.title || "communique").replace(/[/\\?%*:|"<>]/g, "_")}.jpg`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] hover:bg-[#1a3a60] text-white text-xs font-semibold transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" /> Télécharger l&apos;affiche
                            </a>
                            <span className="text-[11px] text-slate-400 font-mono truncate max-w-xs">
                              {item.file_name || "Affiche officielle"}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 max-w-md">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate">
                                {item.file_name || `${item.title}.pdf`}
                              </p>
                              <span className="text-[10px] text-slate-400">Document officiel PDF</span>
                            </div>
                          </div>
                          <a
                            href={item.file_url}
                            download={item.file_name || `${(item.title || "communique").replace(/[/\\?%*:|"<>]/g, "_")}.pdf`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0f2744] hover:bg-[#1a3a60] text-white text-xs font-semibold transition-colors shrink-0"
                          >
                            <Download className="w-3.5 h-3.5" /> PDF
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Modal plein écran pour l'image */}
        {previewImage && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl p-2" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 truncate">{previewImage.title}</span>
                <button
                  onClick={() => setPreviewImage(null)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-2 max-h-[80vh] overflow-auto flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewImage.url}
                  alt={previewImage.title}
                  className="max-h-[75vh] w-auto object-contain rounded-lg"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
