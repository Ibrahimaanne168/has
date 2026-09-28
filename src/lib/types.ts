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
  created_at?: string;
  updated_at?: string;
  filiere?: Filiere;
}

export interface Cours {
  id: string;
  title: string;
  description: string | null;
  matiere_id: string;
  classe_id: string;
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

export interface Communique {
  id: string;
  title: string;
  content: string;
  is_important: boolean;
  target_role: UserRole | null;
  published_by: string | null;
  created_at: string;
  updated_at: string;
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

export interface ChatMessage {
  id: string;
  user_id: string;
  content: string;
  is_deleted: boolean;
  created_at: string;
  user?: Profile;
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
