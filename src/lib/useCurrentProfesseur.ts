"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getStoredProfesseurs, saveProfesseur } from "@/lib/academicStorage";
import { Professeur } from "@/lib/types";

const LOCAL_STORAGE_KEY = "has_current_professeur_profile_v2";

export function useCurrentProfesseur() {
  const [prof, setProf] = useState<Professeur>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.id && parsed.full_name) return parsed;
        }

        const authIdent = (localStorage.getItem("has_auth_identifier") || "").trim().toLowerCase();
        const all = getStoredProfesseurs();
        if (authIdent) {
          const matched = all.find(
            (p) =>
              (p.email && p.email.toLowerCase() === authIdent) ||
              (p.username && p.username.toLowerCase() === authIdent) ||
              (p.matricule && p.matricule.toLowerCase() === authIdent) ||
              (p.full_name && p.full_name.toLowerCase() === authIdent) ||
              (p.username && authIdent.includes(p.username.toLowerCase())) ||
              (p.nom && authIdent.includes(p.nom.toLowerCase()))
          );
          if (matched) return matched;
        }
        return all[0];
      } catch {
        // ignore
      }
    }
    const all = getStoredProfesseurs();
    return all[0];
  });
  const [loading, setLoading] = useState(true);

  // Écouter les changements de professeur depuis n'importe quel composant
  useEffect(() => {
    const handleStorageUpdate = () => {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.id && parsed.full_name) {
            setProf(parsed);
          }
        }
      } catch {
        // ignore
      }
    };

    window.addEventListener("has_academic_storage_updated", handleStorageUpdate);
    return () => window.removeEventListener("has_academic_storage_updated", handleStorageUpdate);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadProf() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser && mounted) {
          const meta = authUser.user_metadata || {};
          const authEmail = (authUser.email || "").toLowerCase().trim();
          const authUsername = (meta.username || authEmail.split("@")[0] || "").toLowerCase().trim();
          const authFullName = (meta.full_name || meta.name || "").toLowerCase().trim();
          const authMatricule = (meta.matricule || "").trim();

          const allProfs = getStoredProfesseurs();

          // Recherche précise du professeur connecté par ID, email, username, matricule ou nom complet
          let found = allProfs.find((p) => p.id === authUser.id);
          if (!found && authEmail) {
            found = allProfs.find((p) => p.email && p.email.toLowerCase().trim() === authEmail);
          }
          if (!found && authUsername) {
            found = allProfs.find((p) => p.username && p.username.toLowerCase().trim() === authUsername);
          }
          if (!found && authMatricule) {
            found = allProfs.find((p) => p.matricule && p.matricule.toLowerCase().trim() === authMatricule.toLowerCase());
          }
          if (!found && authFullName) {
            found = allProfs.find((p) => p.full_name && p.full_name.toLowerCase().trim() === authFullName);
          }

          if (found) {
            const updatedProf: Professeur = {
              ...found,
              id: authUser.id || found.id,
              email: authUser.email || found.email,
              phone: meta.phone !== undefined ? meta.phone : found.phone,
              bio: meta.bio !== undefined ? meta.bio : found.bio,
              specialite: meta.specialite !== undefined ? meta.specialite : found.specialite,
            };
            setProf(updatedProf);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProf));
          } else {
            // Création d'un profil professeur dynamique si non présent dans la liste
            const newProf: Professeur = {
              id: authUser.id,
              full_name: meta.full_name || meta.name || authUser.email?.split("@")[0] || "Enseignant HAS",
              email: authUser.email || "",
              username: meta.username || authUser.email?.split("@")[0] || null,
              phone: meta.phone || null,
              matricule: meta.matricule || "PROF-HAS",
              specialite: meta.specialite || "Enseignement Supérieur",
              bio: meta.bio || "Enseignant-chercheur à Halil Académie Scientifique.",
              is_active: true,
              matieres: [],
              niveaux: ["L1", "L2"],
              classes: ["L1 MPI", "L2 MPI"],
            };
            setProf(newProf);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProf));
          }
        }
      } catch (err) {
        console.warn("Erreur chargement useCurrentProfesseur:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadProf();
    return () => {
      mounted = false;
    };
  }, []);

  const switchProfAccount = (profId: string) => {
    const allProfs = getStoredProfesseurs();
    const target = allProfs.find((p) => p.id === profId || p.username === profId || p.matricule === profId);
    if (target) {
      setProf(target);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(target));
          localStorage.setItem("has_auth_identifier", target.username || target.email || target.matricule);
          window.dispatchEvent(new Event("has_academic_storage_updated"));
        } catch {
          // ignore
        }
      }
    }
  };

  const updateProfProfile = async (updates: Partial<Professeur>) => {
    try {
      const updated: Professeur = { ...prof, ...updates };
      setProf(updated);
      saveProfesseur(updated);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          window.dispatchEvent(new Event("has_academic_storage_updated"));
        } catch {
          // ignore
        }
      }

      // Mettre à jour metadata Supabase si connecté
      try {
        const supabase = createClient();
        await supabase.auth.updateUser({
          data: {
            phone: updated.phone,
            bio: updated.bio,
            specialite: updated.specialite,
          },
        });
      } catch {
        // ignore
      }

      return { success: true };
    } catch (err) {
      console.error("Erreur updateProfProfile:", err);
      return { success: false, error: err };
    }
  };

  return {
    prof,
    loading,
    updateProfProfile,
    switchProfAccount,
    allProfesseurs: getStoredProfesseurs(),
  };
}
