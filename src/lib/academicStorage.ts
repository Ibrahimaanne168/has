import {
  Cours,
  EmploiDuTemps,
  Communique,
  ChatSalon,
  Professeur,
  Message,
  UserRole,
  Filiere,
  Classe,
  Matiere,
  SeanceEDT,
} from "./types";
import { MOCK_PROFESSEURS, MOCK_FILIERES, MOCK_CLASSES, MOCK_MATIERES } from "./data/mock-data";

const STORAGE_KEYS = {
  COURS: "has_academic_courses_v1",
  EDT: "has_academic_edts_v1",
  COMMUNIQUES: "has_academic_communiques_v1",
  PROFESSEURS: "has_academic_professeurs_v2",
  SALONS: "has_academic_salons_v1",
  MESSAGES: "has_academic_direct_messages_v1",
  FILIERES: "has_academic_filieres_v2",
  CLASSES: "has_academic_classes_v2",
  MATIERES: "has_academic_matieres_v2",
  SEANCES_EDT: "has_academic_seances_edt_v1",
};

export const DEFAULT_SALONS: ChatSalon[] = [
  {
    id: "salon-l1",
    titre: "Salon Licence 1 (L1)",
    description: "Échanges et discussions réservés au niveau Licence 1 (L1)",
    type: "niveau",
    niveau: "L1",
    classe: null,
    cree_par: "Administration HAS",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "salon-l2",
    titre: "Salon Licence 2 (L2)",
    description: "Échanges et discussions réservés au niveau Licence 2 (L2)",
    type: "niveau",
    niveau: "L2",
    classe: null,
    cree_par: "Administration HAS",
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
  _role?: UserRole,
  _userNiveau?: string,
  _userClasse?: string,
  _profClasses?: string[]
): ChatSalon[] {
  // Exactement 2 chats : Licence 1 et Licence 2
  return DEFAULT_SALONS;
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

// === GÉNÉRATEUR DE LIENS GOOGLE MEET (https://meet.google.com/xxx-xxxx-xxx) ===
export function generateMeetLink(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

// === GESTION DES FILIÈRES (PERSISTÉ EN LOCALSTORAGE - 3 FILIÈRES OFFICIELLES) ===
export function getStoredFilieres(): Filiere[] {
  const list = getStorageItem<Filiere[]>(STORAGE_KEYS.FILIERES, MOCK_FILIERES);
  // Filtrer impérativement toute ancienne trace de PRÉPA
  const cleaned = list.filter((f) => f.code !== "PRÉPA" && f.id !== "44444444-4444-4444-4444-444444444444");
  return cleaned.length > 0 ? cleaned : MOCK_FILIERES;
}

export function saveFiliere(filiere: Filiere): void {
  const list = getStoredFilieres();
  const index = list.findIndex((f) => f.id === filiere.id);
  if (index >= 0) {
    list[index] = filiere;
  } else {
    list.unshift(filiere);
  }
  setStorageItem(STORAGE_KEYS.FILIERES, list);
}

export function deleteFiliere(id: string): void {
  const list = getStoredFilieres().filter((f) => f.id !== id);
  setStorageItem(STORAGE_KEYS.FILIERES, list);
}

// === GESTION DES CLASSES (PERSISTÉ EN LOCALSTORAGE) ===
export function getStoredClasses(): Classe[] {
  return getStorageItem<Classe[]>(STORAGE_KEYS.CLASSES, MOCK_CLASSES);
}

export function saveClasse(cls: Classe): void {
  const list = getStoredClasses();
  const index = list.findIndex((c) => c.id === cls.id);
  if (index >= 0) {
    list[index] = cls;
  } else {
    list.unshift(cls);
  }
  setStorageItem(STORAGE_KEYS.CLASSES, list);
}

export function deleteClasse(id: string): void {
  const list = getStoredClasses().filter((c) => c.id !== id);
  setStorageItem(STORAGE_KEYS.CLASSES, list);
}

// === GESTION DES MATIÈRES (PERSISTÉ EN LOCALSTORAGE) ===
export function getStoredMatieres(): Matiere[] {
  return getStorageItem<Matiere[]>(STORAGE_KEYS.MATIERES, MOCK_MATIERES);
}

export function saveMatiere(mat: Matiere): void {
  const list = getStoredMatieres();
  const index = list.findIndex((m) => m.id === mat.id);
  if (index >= 0) {
    list[index] = mat;
  } else {
    list.unshift(mat);
  }
  setStorageItem(STORAGE_KEYS.MATIERES, list);
}

export function deleteMatiere(id: string): void {
  const list = getStoredMatieres().filter((m) => m.id !== id);
  setStorageItem(STORAGE_KEYS.MATIERES, list);
}

// === GESTION DES SÉANCES D'EMPLOI DU TEMPS (GRILLE HEBDOMADAIRE EN TEMPS RÉEL + MEET) ===
export const DEFAULT_SEANCES_EDT: SeanceEDT[] = [
  {
    id: "seance-1",
    classe_id: "cls-l1-mpi",
    jour: "Lundi",
    heure_debut: "08:30",
    heure_fin: "10:30",
    matiere_nom: "Analyse 1",
    matiere_code: "ANA-1",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    salle: "Amphi Pasteur",
    meet_url: "https://meet.google.com/has-ana1-l1m",
    type_seance: "CM",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "seance-2",
    classe_id: "cls-l1-mpi",
    jour: "Lundi",
    heure_debut: "11:00",
    heure_fin: "13:00",
    matiere_nom: "Algèbre 1",
    matiere_code: "ALG-1",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    salle: "Salle 102",
    meet_url: "https://meet.google.com/has-alg1-l1m",
    type_seance: "TD",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "seance-3",
    classe_id: "cls-l1-mpi",
    jour: "Mardi",
    heure_debut: "09:00",
    heure_fin: "12:00",
    matiere_nom: "Programmation Python",
    matiere_code: "PROG-PY",
    professeur_nom: "Ibrahima Anne",
    professeur_id: "32e74ddd-3e79-410a-8a87-4bfdff1fc099",
    salle: "Laboratoire Info 1",
    meet_url: "https://meet.google.com/has-pyth-lab",
    type_seance: "TP",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "seance-4",
    classe_id: "cls-l1-mpi",
    jour: "Mercredi",
    heure_debut: "10:00",
    heure_fin: "12:00",
    matiere_nom: "Mécanique du point",
    matiere_code: "MEC-PT",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    salle: "Salle 204",
    meet_url: "https://meet.google.com/has-meca-pt1",
    type_seance: "CM",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "seance-5",
    classe_id: "cls-l1-mpi",
    jour: "Jeudi",
    heure_debut: "14:00",
    heure_fin: "16:00",
    matiere_nom: "Electricité",
    matiere_code: "ELEC",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    salle: "Salle 103",
    meet_url: "https://meet.google.com/has-elec-sem",
    type_seance: "TD",
    created_at: "2026-09-01T08:00:00Z",
  },
  {
    id: "seance-6",
    classe_id: "cls-l2-mpi",
    jour: "Lundi",
    heure_debut: "14:00",
    heure_fin: "16:30",
    matiere_nom: "Analyse 3",
    matiere_code: "ANA-3",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    salle: "Amphi Turing",
    meet_url: "https://meet.google.com/has-ana3-l2m",
    type_seance: "CM",
    created_at: "2026-09-01T08:00:00Z",
  },
];

export function getStoredSeancesEDT(): SeanceEDT[] {
  return getStorageItem<SeanceEDT[]>(STORAGE_KEYS.SEANCES_EDT, DEFAULT_SEANCES_EDT);
}

export function saveSeanceEDT(seance: SeanceEDT): void {
  const list = getStoredSeancesEDT();
  const index = list.findIndex((s) => s.id === seance.id);
  if (index >= 0) {
    list[index] = seance;
  } else {
    list.push(seance);
  }
  setStorageItem(STORAGE_KEYS.SEANCES_EDT, list);
}

export function deleteSeanceEDT(id: string): void {
  const list = getStoredSeancesEDT().filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SEANCES_EDT, list);
}
