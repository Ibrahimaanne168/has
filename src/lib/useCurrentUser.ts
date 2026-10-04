"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MOCK_STUDENT, MOCK_CLASSES, MOCK_FILIERES } from "@/lib/data/mock-data";
import { Profile } from "@/lib/types";

const LOCAL_STORAGE_KEY = "has_current_student_profile_v2";

export function useCurrentUser() {
  const [user, setUser] = useState<Profile>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) return JSON.parse(cached);
      } catch {
        // ignore
      }
    }
    return MOCK_STUDENT;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const supabase = createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (authUser && mounted) {
          const meta = authUser.user_metadata || {};
          const fullName = meta.full_name || meta.name || authUser.email?.split("@")[0] || "Étudiant HAS";
          const username = meta.username || authUser.email?.split("@")[0] || "etudiant";
          const matricule = meta.matricule || "ETU001";
          const filiereCode = meta.filiere || "MPI";
          const niveau = meta.niveau || "L1";
          const classeCode = `${niveau}-${filiereCode}`;

          const foundClasse = MOCK_CLASSES.find((c) => c.code === classeCode) || MOCK_CLASSES[0];
          const foundFiliere = MOCK_FILIERES.find((f) => f.code === filiereCode) || MOCK_FILIERES[0];

          const updated: Profile = {
            id: authUser.id,
            email: authUser.email || MOCK_STUDENT.email,
            username,
            full_name: fullName,
            role: "etudiant",
            phone: meta.phone || MOCK_STUDENT.phone,
            matricule,
            filiere_id: foundFiliere.id,
            classe_id: foundClasse.id,
            bio: meta.bio || `Étudiant à Halil Académie Scientifique — Filière ${filiereCode}.`,
            specialite: foundFiliere.name,
            avatar_url: meta.avatar_url || null,
            is_active: true,
            created_at: authUser.created_at,
            updated_at: new Date().toISOString(),
            classe: foundClasse,
            filiere: foundFiliere,
          };

          setUser(updated);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        }
      } catch (err) {
        console.warn("Erreur chargement useCurrentUser:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const updateProfile = async (updates: {
    filiere?: "MPI" | "SML" | "MIASS";
    niveau?: "L1" | "L2";
    phone?: string;
  }) => {
    try {
      const supabase = createClient();
      const currentMeta = (await supabase.auth.getUser()).data.user?.user_metadata || {};

      const nextFiliere = updates.filiere || currentMeta.filiere || "MPI";
      const nextNiveau = updates.niveau || currentMeta.niveau || "L1";
      const nextPhone = updates.phone !== undefined ? updates.phone : (user.phone || "");
      const nextClasseCode = `${nextNiveau}-${nextFiliere}`;

      const foundClasse = MOCK_CLASSES.find((c) => c.code === nextClasseCode) || MOCK_CLASSES[0];
      const foundFiliere = MOCK_FILIERES.find((f) => f.code === nextFiliere) || MOCK_FILIERES[0];

      // Mettre à jour Supabase Auth metadata
      await supabase.auth.updateUser({
        data: {
          ...currentMeta,
          filiere: nextFiliere,
          niveau: nextNiveau,
          phone: nextPhone,
          classe: nextClasseCode,
        },
      });

      const updatedUser: Profile = {
        ...user,
        phone: nextPhone,
        filiere_id: foundFiliere.id,
        classe_id: foundClasse.id,
        filiere: foundFiliere,
        classe: foundClasse,
        specialite: foundFiliere.name,
      };

      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
      return { success: true };
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      return { success: false, error: err };
    }
  };

  return { user, loading, updateProfile };
}
