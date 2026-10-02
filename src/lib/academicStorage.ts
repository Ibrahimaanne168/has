import { Cours, EmploiDuTemps, Communique, ChatSalon, Professeur, Message, UserRole } from "./types";
import { MOCK_PROFESSEURS } from "./data/mock-data";

const STORAGE_KEYS = {
  COURS: "has_academic_courses_v1",
  EDT: "has_academic_edts_v1",
  COMMUNIQUES: "has_academic_communiques_v1",
  PROFESSEURS: "has_academic_professeurs_v2",
  SALONS: "has_academic_salons_v1",
  MESSAGES: "has_academic_direct_messages_v1",
};

export const DEFAULT_SALONS: ChatSalon[] = [
  {
    id: "general",
    titre: "Salon Général de l'Académie",
    description: "Canal temps réel ouvert à l'ensemble des membres (étudiants, professeurs, direction).",
    type: "general",
    niveau: null,
    classe: null,
    cree_par: "Administration HAS",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "niveau-l1",
    titre: "Salon Licence 1 (L1)",
    description: "Échanges réservés aux étudiants et enseignants des promotions de Licence 1.",
    type: "niveau",
    niveau: "L1",
    classe: null,
    cree_par: "Direction Pédagogique",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "niveau-l2",
    titre: "Salon Licence 2 (L2)",
    description: "Échanges réservés aux étudiants et enseignants des promotions de Licence 2.",
    type: "niveau",
    niveau: "L2",
    classe: null,
    cree_par: "Direction Pédagogique",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "classe-l1-mpi",
    titre: "Salon Classe L1 MPI",
    description: "Salon de travail pour les étudiants de Licence 1 — Maths, Physique, Info.",
    type: "classe",
    niveau: "L1",
    classe: "L1 MPI",
    cree_par: "Administration",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "classe-l2-mpi",
    titre: "Salon Classe L2 MPI",
    description: "Salon de travail pour les étudiants de Licence 2 — Maths, Physique, Info.",
    type: "classe",
    niveau: "L2",
    classe: "L2 MPI",
    cree_par: "Administration",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "classe-l1-sml",
    titre: "Salon Classe L1 SML",
    description: "Salon de travail pour les étudiants de Licence 1 — Sciences de la Mer et du Littoral.",
    type: "classe",
    niveau: "L1",
    classe: "L1 SML",
    cree_par: "Administration",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "classe-l2-sml",
    titre: "Salon Classe L2 SML",
    description: "Salon de travail pour les étudiants de Licence 2 — Sciences de la Mer et du Littoral.",
    type: "classe",
    niveau: "L2",
    classe: "L2 SML",
    cree_par: "Administration",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "classe-l1-miass",
    titre: "Salon Classe L1 MIASS",
    description: "Salon de travail pour les étudiants de Licence 1 — Maths et Info Appliquées.",
    type: "classe",
    niveau: "L1",
    classe: "L1 MIASS",
    cree_par: "Administration",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "classe-l2-miass",
    titre: "Salon Classe L2 MIASS",
    description: "Salon de travail pour les étudiants de Licence 2 — Maths et Info Appliquées.",
    type: "classe",
    niveau: "L2",
    classe: "L2 MIASS",
    cree_par: "Administration",
    created_at: "2026-09-01T08:00:00Z",
  },
];

function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("has_academic_storage_updated"));
  } catch (err) {
    console.error("Erreur setStorageItem:", err);
  }
}

// === GESTION DES COURS & CHAPITRES (SEUL L'ADMIN PEUT PUBLIER/SUPPRIMER) ===
export function getStoredCourses(): Cours[] {
  return getStorageItem<Cours[]>(STORAGE_KEYS.COURS, []);
}

export function saveCourse(course: Cours): void {
  const courses = getStoredCourses();
  const index = courses.findIndex((c) => c.id === course.id);
  if (index >= 0) {
    courses[index] = course;
  } else {
    courses.unshift(course);
  }
  setStorageItem(STORAGE_KEYS.COURS, courses);
}

export function deleteCourse(id: string): void {
  const courses = getStoredCourses().filter((c) => c.id !== id);
  setStorageItem(STORAGE_KEYS.COURS, courses);
}

// === GESTION DES EMPLOIS DU TEMPS (SEUL L'ADMIN PEUT PUBLIER/SUPPRIMER) ===
export function getStoredEDTs(): EmploiDuTemps[] {
  return getStorageItem<EmploiDuTemps[]>(STORAGE_KEYS.EDT, []);
}

export function saveEDT(edt: EmploiDuTemps): void {
  const edts = getStoredEDTs();
  const index = edts.findIndex((e) => e.id === edt.id);
  if (index >= 0) {
    edts[index] = edt;
  } else {
    edts.unshift(edt);
  }
  setStorageItem(STORAGE_KEYS.EDT, edts);
}

export function deleteEDT(id: string): void {
  const edts = getStoredEDTs().filter((e) => e.id !== id);
  setStorageItem(STORAGE_KEYS.EDT, edts);
}

// === GESTION DES COMMUNIQUÉS (SEUL L'ADMIN PEUT PUBLIER/SUPPRIMER) ===
export function getStoredCommuniques(): Communique[] {
  return getStorageItem<Communique[]>(STORAGE_KEYS.COMMUNIQUES, []);
}

export function saveCommunique(communique: Communique): void {
  const communiques = getStoredCommuniques();
  const index = communiques.findIndex((c) => c.id === communique.id);
  if (index >= 0) {
    communiques[index] = communique;
  } else {
    communiques.unshift(communique);
  }
  setStorageItem(STORAGE_KEYS.COMMUNIQUES, communiques);
}

export function deleteCommunique(id: string): void {
  const communiques = getStoredCommuniques().filter((c) => c.id !== id);
  setStorageItem(STORAGE_KEYS.COMMUNIQUES, communiques);
}

// === GESTION DES PROFESSEURS (L'ADMIN PEUT TOUT AJOUTER / MODIFIER) ===
export function getStoredProfesseurs(): Professeur[] {
  return getStorageItem<Professeur[]>(STORAGE_KEYS.PROFESSEURS, MOCK_PROFESSEURS);
}

export function saveProfesseur(prof: Professeur): void {
  const profs = getStoredProfesseurs();
  const index = profs.findIndex((p) => p.id === prof.id);
  if (index >= 0) {
    profs[index] = prof;
  } else {
    profs.push(prof);
  }
  setStorageItem(STORAGE_KEYS.PROFESSEURS, profs);
}

export function deleteProfesseur(id: string): void {
  const profs = getStoredProfesseurs().filter((p) => p.id !== id);
  setStorageItem(STORAGE_KEYS.PROFESSEURS, profs);
}

// === GESTION DES SALONS DE DISCUSSION (L'ADMIN PEUT EN CRÉER / SUPPRIMER) ===
export function getStoredSalons(): ChatSalon[] {
  return getStorageItem<ChatSalon[]>(STORAGE_KEYS.SALONS, DEFAULT_SALONS);
}

export function saveSalon(salon: ChatSalon): void {
  const salons = getStoredSalons();
  const index = salons.findIndex((s) => s.id === salon.id);
  if (index >= 0) {
    salons[index] = salon;
  } else {
    salons.push(salon);
  }
  setStorageItem(STORAGE_KEYS.SALONS, salons);
}

export function deleteSalon(id: string): void {
  const salons = getStoredSalons().filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SALONS, salons);
}

/**
 * Filtre les salons accessibles à un utilisateur selon son rôle, son niveau et sa classe.
 * L'administrateur a accès à TOUS les salons.
 * L'enseignant a accès au salon général et aux salons des niveaux/classes qu'il enseigne.
 * L'étudiant ne peut accéder QU'AU salon général, au salon de son niveau (ex: L1) et au salon de sa classe (ex: L1 MPI).
 */
export function getAccessibleSalons(
  role: UserRole,
  userNiveau?: string,
  userClasse?: string,
  profClasses?: string[]
): ChatSalon[] {
  const allSalons = getStoredSalons();
  if (role === "admin") return allSalons;

  if (role === "professeur") {
    return allSalons.filter((s) => {
      if (s.type === "general") return true;
      if (!profClasses || profClasses.length === 0) return true;
      if (s.type === "niveau" && s.niveau) {
        return profClasses.some((c) => c.toLowerCase().includes(s.niveau!.toLowerCase()));
      }
      if (s.type === "classe" && s.classe) {
        return profClasses.some((c) => c.toLowerCase().trim() === s.classe!.toLowerCase().trim());
      }
      return true;
    });
  }

  // Rôle étudiant: STRICTEMENT CE QU'IL PEUT ACCÉDER
  const cleanNiveau = (userNiveau || "L1").toUpperCase();
  const cleanClasse = (userClasse || "L1 MPI").toUpperCase().replace("-", " ");

  return allSalons.filter((s) => {
    if (s.type === "general") return true;
    if (s.type === "niveau") {
      return (s.niveau || "").toUpperCase() === cleanNiveau;
    }
    if (s.type === "classe") {
      const salonClasse = (s.classe || "").toUpperCase().replace("-", " ");
      return salonClasse === cleanClasse || salonClasse.includes(cleanClasse) || cleanClasse.includes(salonClasse);
    }
    return false;
  });
}

/**
 * Filtre les professeurs pour un étudiant selon sa classe et son niveau.
 * Un étudiant de L1 MPI ne verra que les professeurs qui enseignent en L1 MPI !
 */
export function getAccessibleProfesseurs(
  userNiveau?: string,
  userClasse?: string
): Professeur[] {
  const allProfs = getStoredProfesseurs();
  if (!userClasse && !userNiveau) return allProfs;

  const targetNiveau = (userNiveau || "L1").toUpperCase();
  const targetClasse = (userClasse || "L1 MPI").toUpperCase().replace("-", " ");

  return allProfs.filter((prof) => {
    // Vérifier si le prof a au moins une matière enseignée dans la classe ou le niveau de l'étudiant
    const teachesClasse = prof.classes.some((c) => {
      const normalized = c.toUpperCase().replace("-", " ");
      return normalized === targetClasse || targetClasse.includes(normalized) || normalized.includes(targetClasse);
    });

    const teachesNiveau = prof.niveaux.some((n) => n.toUpperCase() === targetNiveau);

    const teachesMatiereInClasse = prof.matieres?.some((m) => {
      const matchNiv = m.niveau.toUpperCase() === targetNiveau;
      const matchCls = m.classes?.some((mc) => {
        const norm = mc.toUpperCase().replace("-", " ");
        return norm === targetClasse || targetClasse.includes(norm) || norm.includes(targetClasse);
      });
      return matchCls || matchNiv;
    });

    return teachesClasse || teachesMatiereInClasse || (teachesNiveau && !prof.classes.length);
  });
}

// === GESTION DE LA MESSAGERIE DIRECTE RÉELLE (PAS DE FAUSSES DONNÉES) ===
export function getStoredDirectMessages(): Message[] {
  return getStorageItem<Message[]>(STORAGE_KEYS.MESSAGES, []);
}

export function saveDirectMessage(msg: Message): void {
  const list = getStoredDirectMessages();
  list.unshift(msg);
  setStorageItem(STORAGE_KEYS.MESSAGES, list);
}

export function markDirectMessageRead(id: string): void {
  const list = getStoredDirectMessages();
  const updated = list.map((m) => (m.id === id ? { ...m, is_read: true } : m));
  setStorageItem(STORAGE_KEYS.MESSAGES, updated);
}
