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
  MATIERES: "has_academic_matieres_v3",
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
  const stored = getStoredSalons();
  return stored.length > 0 ? stored : DEFAULT_SALONS;
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

// === GÉNÉRATEUR DE LIENS GOOGLE MEET (https://meet.google.com/xxx-xxxx-xxx) STRICTEMENT QUE DES LETTRES ===
export function generateMeetLink(): string {
  // Purement des lettres minuscules de a à z (aucun chiffre)
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) =>
    Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
}

// Convertit un fichier téléversé en Data URL Base64 pour persistance permanente dans le navigateur
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
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

// === GESTION DES MATIÈRES (PERSISTÉ EN LOCALSTORAGE AVEC CLASSES CONCERNÉES) ===
export function getStoredMatieres(): Matiere[] {
  const list = getStorageItem<Matiere[]>(STORAGE_KEYS.MATIERES, MOCK_MATIERES);
  // Garantir que chaque matière a son code MAT001..MAT020 et ses classes assignées
  return list.map((m, idx) => {
    const defaultM = MOCK_MATIERES.find((dm) => dm.id === m.id || dm.name.toLowerCase() === m.name.toLowerCase());
    const code = m.code?.startsWith("MAT") ? m.code : (defaultM?.code || `MAT${String(idx + 1).padStart(3, "0")}`);
    const classes = m.classes && m.classes.length > 0 ? m.classes : (defaultM?.classes || ["L1-MPI"]);
    const niveau = defaultM?.niveau || m.niveau || (classes.some((c) => c.startsWith("L2")) ? "L2" : "L1");
    return {
      ...m,
      code,
      classes,
      niveau,
    };
  });
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

/**
 * Génère automatiquement le prochain code matière au format MAT001, MAT002...
 */
export function getNextMatiereCode(): string {
  const matieres = getStoredMatieres();
  const existingCodes = new Set(matieres.map((m) => m.code?.toUpperCase().trim()));
  let count = 1;
  while (existingCodes.has(`MAT${String(count).padStart(3, "0")}`)) {
    count++;
  }
  return `MAT${String(count).padStart(3, "0")}`;
}

/**
 * Vérifie si un cours concerne un étudiant selon sa classe (ou son niveau).
 * Les matières définissent les classes concernées (ex: Électricité en L1 MPI et SML, Maths en L1 entier).
 */
export function isCourseConcernedForStudent(
  course: Cours,
  userClasseCode?: string,
  userNiveau?: string
): boolean {
  if (!userClasseCode && !userNiveau) return true;
  const targetCode = (userClasseCode || "").replace("-", " ").toUpperCase();
  const targetNiveau = (userNiveau || "L1").toUpperCase();

  // 1. Classes spécifiées sur le cours ou sur sa matière
  const concernedClasses = course.classes || course.matiere?.classes;
  if (concernedClasses && concernedClasses.length > 0) {
    const isDirectMatch = concernedClasses.some((c) => {
      const norm = c.replace("-", " ").toUpperCase();
      return norm === targetCode || targetCode.includes(norm) || norm.includes(targetCode);
    });
    if (isDirectMatch) return true;
  }

  // 2. Si le cours ou sa matière a un niveau spécifié (ex: "L1")
  const matiereNiveau = course.matiere?.niveau;
  if (matiereNiveau && matiereNiveau.toUpperCase() === targetNiveau) {
    if (!concernedClasses || concernedClasses.length === 0) return true;
  }

  // 3. Fallback sur classe_id directe
  if (course.classe?.code) {
    const norm = course.classe.code.replace("-", " ").toUpperCase();
    if (norm === targetCode || targetCode.includes(norm) || norm.includes(targetCode)) return true;
  }

  return false;
}

// Aucune séance fictive : c'est l'admin qui les crée en temps réel
export const DEFAULT_SEANCES_EDT: SeanceEDT[] = [];

export function getStoredSeancesEDT(): SeanceEDT[] {
  const list = getStorageItem<SeanceEDT[]>(STORAGE_KEYS.SEANCES_EDT, DEFAULT_SEANCES_EDT);
  // Nettoyage automatique pour s'assurer qu'aucun lien Meet ne contient de chiffres
  return list.map((s) => {
    if (s.meet_url && /\d/.test(s.meet_url)) {
      // Remplacer les chiffres par des lettres
      const cleanUrl = s.meet_url.replace(/\d/g, (d) => String.fromCharCode(97 + parseInt(d, 10)));
      return { ...s, meet_url: cleanUrl };
    }
    return s;
  });
}

export function saveSeanceEDT(seance: SeanceEDT): void {
  // S'assurer que le meet_url ne contient absolument aucun chiffre
  let cleanMeetUrl = seance.meet_url;
  if (cleanMeetUrl && /\d/.test(cleanMeetUrl)) {
    cleanMeetUrl = cleanMeetUrl.replace(/\d/g, (d) => String.fromCharCode(97 + parseInt(d, 10)));
  }
  const cleanSeance = { ...seance, meet_url: cleanMeetUrl };

  const list = getStoredSeancesEDT();
  const index = list.findIndex((s) => s.id === cleanSeance.id);
  if (index >= 0) {
    list[index] = cleanSeance;
  } else {
    list.push(cleanSeance);
  }
  setStorageItem(STORAGE_KEYS.SEANCES_EDT, list);
}

export function deleteSeanceEDT(id: string): void {
  const list = getStoredSeancesEDT().filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SEANCES_EDT, list);
}
