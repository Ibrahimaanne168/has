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
  Profile,
  MatiereAssignee,
} from "./types";
import { MOCK_PROFESSEURS, MOCK_FILIERES, MOCK_CLASSES, MOCK_MATIERES, MOCK_STUDENT } from "./data/mock-data";
import { sendLocalNotification } from "./useNotifications";

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
  STUDENTS: "has_academic_students_v1",
  DELETED_ACCOUNTS: "has_academic_deleted_accounts_v1",
  DELETED_SEANCES: "has_academic_deleted_seances_v1",
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
  const isNew = !courses.some((c) => c.id === course.id);
  const index = courses.findIndex((c) => c.id === course.id);
  if (index >= 0) {
    courses[index] = course;
  } else {
    courses.unshift(course);
  }
  setStorageItem(STORAGE_KEYS.COURS, courses);
  if (isNew) {
    sendLocalNotification({
      type: "cours",
      title: "Nouveau cours disponible 📚",
      body: `${course.title}${course.matiere?.name ? " — " + course.matiere.name : ""}`.trim(),
      url: "/etudiant/cours",
      tag: `cours-${course.id}`,
    });
  }
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
  const isNew = !edts.some((e) => e.id === edt.id);
  const index = edts.findIndex((e) => e.id === edt.id);
  if (index >= 0) {
    edts[index] = edt;
  } else {
    edts.unshift(edt);
  }
  setStorageItem(STORAGE_KEYS.EDT, edts);
  if (isNew) {
    sendLocalNotification({
      type: "edt",
      title: "Emploi du temps mis à jour 📅",
      body: `${edt.title || "Nouvel emploi du temps"} disponible.`,
      url: "/etudiant/edt",
      tag: `edt-${edt.id}`,
    });
  }
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
  const isNew = !communiques.some((c) => c.id === communique.id);
  const index = communiques.findIndex((c) => c.id === communique.id);
  if (index >= 0) {
    communiques[index] = communique;
  } else {
    communiques.unshift(communique);
  }
  setStorageItem(STORAGE_KEYS.COMMUNIQUES, communiques);
  if (isNew) {
    sendLocalNotification({
      type: "communique",
      title: "Nouveau communiqué 📢",
      body: communique.title || "Un nouveau communiqué a été publié.",
      url: "/etudiant/communiques",
      tag: `communique-${communique.id}`,
    });
  }
}

export function deleteCommunique(id: string): void {
  const communiques = getStoredCommuniques().filter((c) => c.id !== id);
  setStorageItem(STORAGE_KEYS.COMMUNIQUES, communiques);
}

// === SPÉCIALITÉS OFFICIELLES (INFORMATIQUE, MATH, PHYSIQUE, ECONOMIE) ===
export type AcademicSpecialite = "Informatique" | "Math" | "Physique" | "Economie";

export function deduceSpecialiteFromMatieres(
  matieres?: { nom?: string; name?: string }[],
  existingSpecialite?: string | null
): AcademicSpecialite {
  const s = (existingSpecialite || "").trim().toLowerCase();
  if (s === "informatique" || s === "math" || s === "physique" || s === "economie" || s === "économie") {
    return s.startsWith("écon") || s.startsWith("econ") ? "Economie" : (s === "math" ? "Math" : s === "physique" ? "Physique" : "Informatique");
  }
  const text = `${existingSpecialite || ""} ${(matieres || []).map((m) => m.nom || m.name || "").join(" ")}`.toLowerCase();
  if (text.includes("écono") || text.includes("econo")) return "Economie";
  if (text.includes("math") || text.includes("analyse") || text.includes("algèbre") || text.includes("stochastique") || text.includes("numérique matricielle")) return "Math";
  if (text.includes("info") || text.includes("python") || text.includes("logiciel") || text.includes("base de données") || text.includes("programmation") || text.includes("langage c") || text.includes("système")) return "Informatique";
  if (text.includes("physique") || text.includes("mécanique") || text.includes("thermo") || text.includes("optique") || text.includes("électr") || text.includes("ondes")) return "Physique";
  return "Informatique";
}

// === SUIVI DES COMPTES SUPPRIMÉS (POUR ÉVITER LEUR RÉAPPARITION VIA LES DONNÉES PAR DÉFAUT/MOCK) ===
export function getDeletedAccounts(): string[] {
  return getStorageItem<string[]>(STORAGE_KEYS.DELETED_ACCOUNTS, []);
}

export function markAccountAsDeleted(id?: string | null, email?: string | null): void {
  if (typeof window === "undefined") return;
  const current = getDeletedAccounts();
  const toAdd: string[] = [];
  if (id && id.trim()) toAdd.push(id.toLowerCase().trim());
  if (email && email.trim()) toAdd.push(email.toLowerCase().trim());
  if (toAdd.length === 0) return;
  const merged = Array.from(new Set([...current, ...toAdd]));
  try {
    localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(merged));
  } catch (err) {
    console.error("Erreur markAccountAsDeleted:", err);
  }
}

export function unmarkAccountAsDeleted(id?: string | null, email?: string | null): void {
  if (typeof window === "undefined") return;
  const current = getDeletedAccounts();
  const toRemove = new Set<string>();
  if (id && id.trim()) toRemove.add(id.toLowerCase().trim());
  if (email && email.trim()) toRemove.add(email.toLowerCase().trim());
  const updated = current.filter((x) => !toRemove.has(x.toLowerCase().trim()));
  try {
    localStorage.setItem(STORAGE_KEYS.DELETED_ACCOUNTS, JSON.stringify(updated));
  } catch (err) {
    console.error("Erreur unmarkAccountAsDeleted:", err);
  }
}

export function isAccountDeleted(id?: string | null, email?: string | null): boolean {
  if (!id && !email) return false;
  const current = getDeletedAccounts();
  if (!current || current.length === 0) return false;
  const set = new Set(current.map((x) => x.toLowerCase().trim()));
  if (id && set.has(id.toLowerCase().trim())) return true;
  if (email && set.has(email.toLowerCase().trim())) return true;
  return false;
}

// === GESTION DES PROFESSEURS (L'ADMIN PEUT TOUT AJOUTER / MODIFIER) ===
export function getStoredProfesseurs(): Professeur[] {
  const list = getStorageItem<Professeur[]>(STORAGE_KEYS.PROFESSEURS, MOCK_PROFESSEURS);
  
  // S'assurer que tous les professeurs officiels de référence (ex: M. Diop, El Hadji Ibrahima Diop Sow) sont présents
  let merged = [...list];
  let updated = false;
  for (const mockProf of MOCK_PROFESSEURS) {
    if (!merged.some((p) => p.id === mockProf.id || p.full_name?.toLowerCase() === mockProf.full_name?.toLowerCase())) {
      if (!isAccountDeleted(mockProf.id, mockProf.email)) {
        merged.push(mockProf);
        updated = true;
      }
    }
  }
  if (updated && typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFESSEURS, JSON.stringify(merged));
    } catch {}
  }

  return merged
    .filter((p) => !isAccountDeleted(p.id, p.email))
    .map((p) => ({
      ...p,
      specialite: deduceSpecialiteFromMatieres(p.matieres, p.specialite),
    }));
}

export function saveProfesseur(prof: Professeur): void {
  unmarkAccountAsDeleted(prof.id, prof.email);
  const profs = getStoredProfesseurs();
  const normalizedProf = {
    ...prof,
    specialite: deduceSpecialiteFromMatieres(prof.matieres, prof.specialite),
  };
  const index = profs.findIndex((p) => p.id === prof.id);
  if (index >= 0) {
    profs[index] = normalizedProf;
  } else {
    profs.push(normalizedProf);
  }
  setStorageItem(STORAGE_KEYS.PROFESSEURS, profs);
}

export function deleteProfesseur(id: string, email?: string | null): void {
  const currentProfs = getStoredProfesseurs();
  const target = currentProfs.find((p) => p.id === id || (email && p.email?.toLowerCase() === email.toLowerCase()));
  markAccountAsDeleted(id, email || target?.email);
  const profs = currentProfs.filter(
    (p) => p.id !== id && (!email || p.email?.toLowerCase() !== email.toLowerCase())
  );
  setStorageItem(STORAGE_KEYS.PROFESSEURS, profs);
}

// === GESTION DES ÉTUDIANTS (EFFECTIFS RÉELS - AUCUNE FAUSSE DONNÉE) ===
export const DEFAULT_STUDENTS: Profile[] = [MOCK_STUDENT];

export function getStoredStudents(): Profile[] {
  const list = getStorageItem<Profile[]>(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  return list.filter((s) => !isAccountDeleted(s.id, s.email));
}

export function saveStudent(student: Profile): void {
  unmarkAccountAsDeleted(student.id, student.email);
  const list = getStoredStudents();
  const index = list.findIndex((s) => s.id === student.id || s.email === student.email);
  if (index >= 0) {
    list[index] = student;
  } else {
    list.unshift(student);
  }
  setStorageItem(STORAGE_KEYS.STUDENTS, list);
}

export function deleteStudent(id: string, email?: string | null): void {
  const currentList = getStoredStudents();
  const target = currentList.find((s) => s.id === id || (email && s.email?.toLowerCase() === email.toLowerCase()));
  markAccountAsDeleted(id, email || target?.email);
  const list = currentList.filter(
    (s) => s.id !== id && (!email || s.email?.toLowerCase() !== email.toLowerCase())
  );
  setStorageItem(STORAGE_KEYS.STUDENTS, list);
}

/**
 * Retourne les étudiants réels inscrits dans les classes ou niveaux enseignés par un professeur.
 */
export function getStudentsForProfesseur(prof: Partial<Professeur>): Profile[] {
  const allStudents = getStoredStudents();
  if (!prof) return [];

  const profClasses = (prof.classes || []).map((c) => c.toUpperCase().replace("-", " "));
  const profNiveaux = (prof.niveaux || []).map((n) => n.toUpperCase());

  return allStudents.filter((stu) => {
    const stuClasseCode = (stu.classe?.code || stu.classe_id || "").toUpperCase().replace("-", " ");
    const stuNiveau = (stu.classe?.niveau || (stuClasseCode.startsWith("L2") ? "L2" : "L1")).toUpperCase();

    const matchClasse = profClasses.some(
      (pc) => pc && (stuClasseCode.includes(pc) || pc.includes(stuClasseCode))
    );
    const matchNiveau = profNiveaux.includes(stuNiveau);

    return matchClasse || (matchNiveau && profClasses.length === 0);
  });
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
  role?: UserRole,
  userNiveau?: string,
  _userClasse?: string,
  _profClasses?: string[]
): ChatSalon[] {
  const stored = getStoredSalons();
  const all = stored.length > 0 ? stored : DEFAULT_SALONS;

  // Admins and professors see all salons
  if (role === "admin" || role === "professeur") return all;

  // Students only see the salon matching their niveau
  if (role === "etudiant" && userNiveau) {
    const niveau = userNiveau.toUpperCase();
    const filtered = all.filter((s) => {
      if (s.niveau) return s.niveau.toUpperCase() === niveau;
      // Fallback: match by salon ID (e.g. salon-l1 for L1)
      return s.id.toLowerCase().includes(niveau.toLowerCase());
    });
    return filtered.length > 0 ? filtered : all;
  }

  return all;
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

// === GESTION DES MATIÈRES (PERSISTÉ EN LOCALSTORAGE AVEC CLASSES CONCERNÉES ET PROFESSEUR) ===
export function getStoredMatieres(): Matiere[] {
  const list = getStorageItem<Matiere[]>(STORAGE_KEYS.MATIERES, MOCK_MATIERES);
  // Synchroniser automatiquement avec les matières officielles de référence si manquantes
  const missingDefaults = MOCK_MATIERES.filter(
    (dm) => !list.some((m) => m.id === dm.id || m.name.toLowerCase() === dm.name.toLowerCase())
  );
  const fullList = missingDefaults.length > 0 ? [...list, ...missingDefaults] : list;
  const profs = getStoredProfesseurs();

  return fullList.map((m, idx) => {
    const defaultM = MOCK_MATIERES.find((dm) => dm.id === m.id || dm.name.toLowerCase() === m.name.toLowerCase());
    const code = m.code?.startsWith("MAT") ? m.code : (defaultM?.code || `MAT${String(idx + 1).padStart(3, "0")}`);
    const classes = m.classes && m.classes.length > 0 ? m.classes : (defaultM?.classes || ["L1-MPI"]);
    const niveau = defaultM?.niveau || m.niveau || (classes.some((c) => c.startsWith("L2")) ? "L2" : "L1");

    // Trouver le professeur assigné
    let assignedProf = profs.find((p) => p.id === m.professeur_id);
    if (!assignedProf) {
      assignedProf = profs.find((p) =>
        p.matieres?.some(
          (pm) => pm.code === code || pm.nom.toLowerCase() === m.name.toLowerCase()
        )
      );
    }

    return {
      ...m,
      code,
      classes,
      niveau,
      professeur_id: assignedProf?.id || m.professeur_id || null,
      professeur: assignedProf || null,
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

  // Synchroniser automatiquement l'enseignant assigné
  if (mat.professeur_id) {
    const profs = getStoredProfesseurs();
    const updatedProfs = profs.map((p) => {
      const isTarget = p.id === mat.professeur_id;
      const currentMatieres = p.matieres || [];
      const alreadyHas = currentMatieres.some(
        (pm) => pm.code === mat.code || pm.nom.toLowerCase() === mat.name.toLowerCase()
      );

      if (isTarget) {
        const newMatiereItem: MatiereAssignee = {
          id: mat.id,
          nom: mat.name,
          code: mat.code,
          niveau: mat.niveau || "L1",
          classes: mat.classes || [],
        };
        const nextMatieres = alreadyHas
          ? currentMatieres.map((pm) => (pm.code === mat.code ? newMatiereItem : pm))
          : [...currentMatieres, newMatiereItem];

        const combinedClasses = Array.from(new Set([...p.classes, ...(mat.classes || [])]));
        const combinedNiveaux = Array.from(new Set([...p.niveaux, mat.niveau || "L1"]));

        return {
          ...p,
          matieres: nextMatieres,
          classes: combinedClasses,
          niveaux: combinedNiveaux,
          specialite: deduceSpecialiteFromMatieres(nextMatieres, p.specialite),
        };
      } else {
        const filtered = currentMatieres.filter(
          (pm) => pm.code !== mat.code && pm.nom.toLowerCase() !== mat.name.toLowerCase()
        );
        return {
          ...p,
          matieres: filtered,
          specialite: deduceSpecialiteFromMatieres(filtered, p.specialite),
        };
      }
    });
    setStorageItem(STORAGE_KEYS.PROFESSEURS, updatedProfs);
  }
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

// Emploi du temps de référence HAS (Un seul EDT par promotion L1 et L2, filières différenciées)
// Tous les cours officiels de HAS sont dispensés en soirée sur le créneau 21h00 - 23h00
export const DEFAULT_SEANCES_EDT: SeanceEDT[] = [
  // --- PROMOTION LICENCE 2 (Semestre 4 - Cours Officiels en Ligne) ---
  {
    id: "seance-has-l2-analyse4",
    classe_id: "promo-l2",
    classe_nom: "Licence 2",
    semestre: "Semestre 4",
    jour: "Mardi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Analyse 4",
    matiere_code: "MAT021",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L2",
    filieres: ["MIASS", "MPI"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l2-proba",
    classe_id: "promo-l2",
    classe_nom: "Licence 2",
    semestre: "Semestre 4",
    jour: "Jeudi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Probabilité",
    matiere_code: "MAT020",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L2",
    filieres: ["MIASS", "MPI"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l2-chimie-org",
    classe_id: "promo-l2",
    classe_nom: "Licence 2",
    semestre: "Semestre 4",
    jour: "Jeudi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Chimie Organique",
    matiere_code: "MAT023",
    professeur_nom: "Ndiogou Ndiaye",
    professeur_id: "25013b47-9a78-4f97-8552-977450abdad2",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L2",
    filieres: ["SML"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l2-chimie-inorg",
    classe_id: "promo-l2",
    classe_nom: "Licence 2",
    semestre: "Semestre 4",
    jour: "Samedi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Chimie Inorganique",
    matiere_code: "MAT024",
    professeur_nom: "Ndiogou Ndiaye",
    professeur_id: "25013b47-9a78-4f97-8552-977450abdad2",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L2",
    filieres: ["SML"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l2-electromag",
    classe_id: "promo-l2",
    classe_nom: "Licence 2",
    semestre: "Semestre 4",
    jour: "Dimanche",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Électromagnétismes",
    matiere_code: "MAT022",
    professeur_nom: "Ndiogou Ndiaye",
    professeur_id: "25013b47-9a78-4f97-8552-977450abdad2",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L2",
    filieres: ["MPI"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l2-partage-info",
    classe_id: "promo-l2",
    classe_nom: "Licence 2",
    semestre: "Semestre 4",
    jour: "Lundi",
    heure_debut: "22:00",
    heure_fin: "23:00",
    matiere_nom: "Séance de partage d'informations",
    matiere_code: "HAS002",
    professeur_nom: "Administration HAS",
    professeur_id: "admin-has",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L2",
    filieres: ["MPI", "SML", "MIASS"],
    created_at: new Date().toISOString(),
  },

  // --- PROMOTION LICENCE 1 (Semestre 2 - Cours Officiels en Ligne) ---
  {
    id: "seance-has-l1-partage-info",
    classe_id: "promo-l1",
    classe_nom: "Licence 1",
    semestre: "Semestre 2",
    jour: "Lundi",
    heure_debut: "21:00",
    heure_fin: "22:00",
    matiere_nom: "Séance de partage d'informations",
    matiere_code: "HAS001",
    professeur_nom: "Administration HAS",
    professeur_id: "admin-has",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L1",
    filieres: ["MPI", "SML", "MIASS"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l1-magneto",
    classe_id: "promo-l1",
    classe_nom: "Licence 1",
    semestre: "Semestre 2",
    jour: "Mardi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Magnétostatique",
    matiere_code: "MAT025",
    professeur_nom: "Ndiogou Ndiaye",
    professeur_id: "25013b47-9a78-4f97-8552-977450abdad2",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L1",
    filieres: ["MPI", "SML"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l1-langage-c",
    classe_id: "promo-l1",
    classe_nom: "Licence 1",
    semestre: "Semestre 2",
    jour: "Mercredi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Langage C",
    matiere_code: "MAT019",
    professeur_nom: "Pape Thiam",
    professeur_id: "5bfff82c-62a6-48d4-801f-9e9ac5421df5",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L1",
    filieres: ["MPI"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l1-finance",
    classe_id: "promo-l1",
    classe_nom: "Licence 1",
    semestre: "Semestre 2",
    jour: "Mercredi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Finance des entreprises",
    matiere_code: "MAT026",
    professeur_nom: "M. Diop",
    professeur_id: "prof-m-diop",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L1",
    filieres: ["MIASS"],
    created_at: new Date().toISOString(),
  },
  {
    id: "seance-has-l1-analyse2",
    classe_id: "promo-l1",
    classe_nom: "Licence 1",
    semestre: "Semestre 2",
    jour: "Vendredi",
    heure_debut: "21:00",
    heure_fin: "23:00",
    matiere_nom: "Analyse 2",
    matiere_code: "MAT015",
    professeur_nom: "Pape Ibrahima Samb",
    professeur_id: "4ca84133-856c-4e87-8ca5-31eabe0fcc23",
    type_seance: "COURS",
    meet_url: null,
    niveau: "L1",
    filieres: ["MPI", "SML", "MIASS"],
    created_at: new Date().toISOString(),
  },
];

export function getDeletedSeanceIds(): string[] {
  return getStorageItem<string[]>(STORAGE_KEYS.DELETED_SEANCES, []);
}

export function markSeanceAsDeleted(id: string): void {
  if (typeof window === "undefined") return;
  const current = getDeletedSeanceIds();
  if (!current.includes(id)) {
    const next = [...current, id];
    try {
      localStorage.setItem(STORAGE_KEYS.DELETED_SEANCES, JSON.stringify(next));
    } catch {}
  }
}

export function unmarkSeanceAsDeleted(id: string): void {
  if (typeof window === "undefined") return;
  const current = getDeletedSeanceIds();
  const next = current.filter((x) => x !== id);
  try {
    localStorage.setItem(STORAGE_KEYS.DELETED_SEANCES, JSON.stringify(next));
  } catch {}
}

export function getStoredSeancesEDT(): SeanceEDT[] {
  const deletedSet = new Set(getDeletedSeanceIds());
  const list = getStorageItem<SeanceEDT[]>(STORAGE_KEYS.SEANCES_EDT, DEFAULT_SEANCES_EDT);
  
  if (!list || !Array.isArray(list) || list.length === 0) {
    return DEFAULT_SEANCES_EDT.filter((s) => !deletedSet.has(s.id));
  }

  // Nettoyer les anciens mocks obsolètes et les séances explicitement supprimées
  const obsoleteIds = new Set([
    "seance-has-l2-magneto",
    "seance-has-l2-analyse3",
    "seance-has-l1-electricite",
    "seance-has-l1-economie",
  ]);

  const filtered = list.filter((s) => !obsoleteIds.has(s.id) && !deletedSet.has(s.id));

  // S'assurer que les séances officielles par défaut (notamment séances de partage d'informations L1 & L2)
  // sont automatiquement présentes si elles ne figurent pas encore dans le cache et n'ont pas été supprimées
  for (const def of DEFAULT_SEANCES_EDT) {
    if (!filtered.some((s) => s.id === def.id) && !deletedSet.has(def.id)) {
      filtered.push(def);
    }
  }

  return filtered;
}

export function resetDefaultSeancesEDT(): SeanceEDT[] {
  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem(STORAGE_KEYS.DELETED_SEANCES);
    } catch {}
  }
  setStorageItem(STORAGE_KEYS.SEANCES_EDT, DEFAULT_SEANCES_EDT);
  return DEFAULT_SEANCES_EDT;
}

export function saveSeanceEDT(seance: SeanceEDT): void {
  unmarkSeanceAsDeleted(seance.id);

  let cleanMeet = seance.meet_url ? seance.meet_url.trim() : null;
  if (cleanMeet && !cleanMeet.startsWith("http://") && !cleanMeet.startsWith("https://")) {
    cleanMeet = `https://${cleanMeet}`;
  }
  const cleanSeance: SeanceEDT = { ...seance, meet_url: cleanMeet };

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
  markSeanceAsDeleted(id);
  const list = getStoredSeancesEDT().filter((s) => s.id !== id);
  setStorageItem(STORAGE_KEYS.SEANCES_EDT, list);
}

