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
        if (cached) {
          const parsed = JSON.parse(cached);
          // Si le cache contient par erreur un compte administrateur ou le nom "Administration", purger immédiatement
          if (
            parsed &&
            parsed.full_name &&
            !parsed.full_name.toLowerCase().includes("administration") &&
            parsed.role !== "admin"
          ) {
            return parsed;
          } else {
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          }
        }
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
          // 1. Tenter d'abord de lire le profil réel depuis la table profiles
          let dbProfile: Partial<Profile> | null = null;
          try {
            const { data: p } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", authUser.id)
              .maybeSingle();
            if (p) dbProfile = p;
          } catch {}

          const meta = authUser.user_metadata || {};
          const detectedRole = dbProfile?.role || meta.role;

          const isAdminOrProf =
            detectedRole === "admin" ||
            detectedRole === "professeur" ||
            authUser.email?.includes("admin") ||
            authUser.email?.startsWith("halil@") ||
            authUser.email?.startsWith("direction@") ||
            authUser.email?.endsWith("@has-internal.local") ||
            (dbProfile?.full_name || meta.full_name || "").toLowerCase().includes("administration");

          // Si l'utilisateur connecté dans Supabase est un compte administrateur ou enseignant,
          // on ne doit ABSOLUMENT PAS écraser l'espace étudiant avec les données admin !
          if (isAdminOrProf) {
            setUser(MOCK_STUDENT);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
          }

          const fullName =
            dbProfile?.full_name ||
            meta.full_name ||
            meta.name ||
            authUser.email?.split("@")[0] ||
            "Ibrahima Anne";

          // Sécurité supplémentaire : si le nom contient "Administration", rétablir l'étudiant officiel
          if (fullName.toLowerCase().includes("administration")) {
            setUser(MOCK_STUDENT);
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
          }

          const username = dbProfile?.username || meta.username || authUser.email?.split("@")[0] || "ibou";
          const matricule = dbProfile?.matricule || meta.matricule || "ETU001";
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
            phone: dbProfile?.phone || meta.phone || MOCK_STUDENT.phone,
            matricule,
            filiere_id: foundFiliere.id,
            classe_id: foundClasse.id,
            bio: dbProfile?.bio || meta.bio || `Étudiant à Halil Académie Scientifique — Filière ${filiereCode}.`,
            specialite: foundFiliere.name,
            avatar_url: dbProfile?.avatar_url || meta.avatar_url || null,
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
    specialite?: string;
    bio?: string;
    avatar_url?: string | null;
  }) => {
    try {
      const supabase = createClient();
      const currentMeta = (await supabase.auth.getUser()).data.user?.user_metadata || {};

      const nextFiliere = updates.filiere || currentMeta.filiere || "MPI";
      const nextNiveau = updates.niveau || currentMeta.niveau || "L1";
      const nextPhone = updates.phone !== undefined ? updates.phone : (user.phone || "");
      const nextAvatar = updates.avatar_url !== undefined ? updates.avatar_url : (user.avatar_url || currentMeta.avatar_url || null);
      const nextClasseCode = `${nextNiveau}-${nextFiliere}`;

      const foundClasse = MOCK_CLASSES.find((c) => c.code === nextClasseCode) || MOCK_CLASSES[0];
      const foundFiliere = MOCK_FILIERES.find((f) => f.code === nextFiliere) || MOCK_FILIERES[0];

      // Mettre à jour Supabase Auth metadata (SANS avatar_url pour éviter l'erreur HTTP 431 / header data too large)
      // Supabase Auth encode user_metadata dans le token JWT et les cookies de session.
      // Y stocker des données d'image alourdit les en-têtes HTTP au-delà de la limite du serveur.
      const safeMeta = { ...currentMeta };
      delete (safeMeta as Record<string, unknown>).avatar_url;
      delete (safeMeta as Record<string, unknown>).photo;

      await supabase.auth.updateUser({
        data: {
          ...safeMeta,
          filiere: nextFiliere,
          niveau: nextNiveau,
          phone: nextPhone,
          classe: nextClasseCode,
          avatar_url: null, // Purge le token JWT et le cookie d'authentification
          ...(updates.specialite !== undefined ? { specialite: updates.specialite } : {}),
          ...(updates.bio !== undefined ? { bio: updates.bio } : {}),
        },
      });

      const updatedUser: Profile = {
        ...user,
        phone: nextPhone,
        filiere_id: foundFiliere.id,
        classe_id: foundClasse.id,
        filiere: foundFiliere,
        classe: foundClasse,
        avatar_url: nextAvatar,
        specialite: updates.specialite !== undefined ? updates.specialite : (user.specialite || foundFiliere.name),
        bio: updates.bio !== undefined ? updates.bio : user.bio,
      };

      setUser(updatedUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("has_academic_storage_updated"));
      }
      return { success: true };
    } catch (err) {
      console.error("Erreur mise à jour profil:", err);
      return { success: false, error: err };
    }
  };

  return { user, loading, updateProfile };
}
