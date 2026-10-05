// ==============================================================================
// TYPES STRICTS TYPESCRIPT — HALIL ACADÉMIE SCIENTIFIQUE (HAS)
// ==============================================================================

export type UserRole = "etudiant" | "professeur" | "admin";

export type ContactStatus = "nouveau" | "en_cours" | "traite" | "archive";

export interface Profile {
  id: string;
  email: string;
  username: string | null;
  full_name: string;
  role: UserRole;
  phone: string | null;
  matricule: string | null;
  filiere_id: string | null;
  classe_id: string | null;
  bio: string | null;
  specialite: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations jointes optionnelles
  classe?: Classe;
  filiere?: Filiere;
}

export interface Filiere {
  id: string;
  code: string;
  name: string;
  description: string | null;
  cycle: string;
  duration_years: number;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Classe {
  id: string;
  filiere_id: string;
  code: string;
  name: string;
  niveau: string; // 'L1', 'L2', 'L3', 'M1', 'M2'
  annee_scolaire: string;
  created_at?: string;
  updated_at?: string;
  filiere?: Filiere;
}

export interface Matiere {
  id: string;
  filiere_id: string;
  code: string;
  name: string;
  coefficient: number;
  credits_ects: number;
  description: string | null;
  classes?: string[]; // Classes concernées (ex: ["L1-MPI", "L1-SML"])
  niveau?: string;    // "L1" ou "L2"
  semestre?: "S1" | "S2" | "S3" | "S4" | string; // S1/S2 pour L1, S3/S4 pour L2
  created_at?: string;
  updated_at?: string;
  filiere?: Filiere;
}

export interface Cours {
  id: string;
  title: string;
  description: string | null;
  matiere_id: string;
  classe_id?: string;
  classes?: string[]; // Classes cibles (héritées automatiquement de la matière)
  professeur_id: string;
  file_url: string | null;
  file_name: string | null;
  file_type: string | null;
  file_size_bytes: number | null;
  external_url: string | null;
  created_at: string;
  updated_at: string;
  // Jointures
  matiere?: Matiere;
  classe?: Classe;
  professeur?: Profile;
  is_favorite?: boolean;
}

export interface FavoriCours {
  id: string;
  user_id: string;
  cours_id: string;
  created_at: string;
}

export interface EmploiDuTemps {
  id: string;
  classe_id: string;
  title: string;
  semestre: string;
  annee_universitaire: string;
  file_url: string;
  file_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  classe?: Classe;
}

export type JourSemaine = "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi";

export interface SeanceEDT {
  id: string;
  classe_id: string;
  jour: JourSemaine;
  heure_debut: string; // ex: "08:00"
  heure_fin: string;   // ex: "10:00"
  matiere_nom: string;
  matiere_code: string;
  professeur_nom: string;
  professeur_id?: string;
  meet_url?: string | null;
  semaine?: string;
  type_seance?: "CM" | "TD" | "TP";
  created_at: string;
  // Nouveau : niveau et filières concernées
  niveau?: "L1" | "L2";                         // L1 ou L2
  filieres?: ("MPI" | "SML" | "MIASS")[];       // [] ou undefined = toutes les filières du niveau
}

export interface Communique {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  target_role: UserRole | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
  file_url?: string | null;  // PDF base64 data url
  file_name?: string | null; // Nom du fichier PDF
  publisher?: Profile;
}

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  subject: string;
  content: string;
  is_read: boolean;
  parent_id: string | null;
  created_at: string;
  sender?: Profile;
  receiver?: Profile;
}

export interface MatiereAssignee {
  id: string | number;
  nom: string;
  code?: string;
  niveau: "L1" | "L2" | string;
  classes: string[]; // e.g. ["L1 MPI", "L1 SML"]
}

export interface Professeur {
  id: string;
  user_id?: number | string;
  full_name: string;
  prenom?: string;
  nom?: string;
  email: string;
  username?: string | null;
  phone: string | null;
  matricule: string;
  specialite: string;
  bio: string;
  filiere_id?: string | null;
  photo?: string | null;
  avatar_url?: string | null;
  is_active: boolean;
  matieres: MatiereAssignee[];
  niveaux: string[]; // e.g. ["L1", "L2"]
  classes: string[]; // e.g. ["L1 MPI", "L2 MPI"]
  created_at?: string;
  updated_at?: string;
}

export interface ChatSalon {
  id: string;
  titre: string;
  description: string;
  type: "general" | "niveau" | "classe";
  niveau?: string | null; // "L1", "L2" or null
  classe?: string | null; // "L1 MPI", etc.
  cree_par?: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  salon_id?: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  user?: Profile | {
    id: string;
    full_name: string;
    role?: UserRole;
    email?: string;
    avatar_url?: string | null;
  };
}

export interface ContactMessage {
  id: string;
  full_name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  status: ContactStatus;
  ip_address?: string | null;
  created_at: string;
}

export interface VerificationCode {
  id: string;
  email: string;
  code: string;
  type: "signup_2fa" | "password_reset";
  expires_at: string;
  verified: boolean;
  attempts: number;
  created_at: string;
}

export interface AuditLog {
  id: string;
  user_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
  user?: Profile;
}
