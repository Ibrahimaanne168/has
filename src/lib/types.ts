export interface User {
  id: number;
  role_id: number;
  login: string;
  nom: string;
  prenom: string;
  telephone?: string;
  email?: string;
  photo?: string;
  role_name?: "admin" | "enseignant" | "etudiant";
  two_factor_enabled?: boolean;
}

export interface Filiere {
  id: number;
  nom: string;
  description?: string;
  nb_classes?: number;
  nb_cours?: number;
}

export interface Classe {
  id: number;
  filiere_id: number;
  nom: string;
  niveau?: string;
  filiere_nom?: string;
}

export interface Matiere {
  id: number;
  nom: string;
  classes_noms?: string;
}

export interface Enseignant {
  id: number;
  user_id: number;
  filiere_id?: number;
  biographie?: string;
  nom: string;
  prenom: string;
  login: string;
  telephone?: string;
  photo?: string;
  filieres_noms?: string;
  matieres_noms?: string;
}

export interface Etudiant {
  id: number;
  user_id: number;
  filiere_id: number;
  classe_id: number;
  matricule?: string;
  nom: string;
  prenom: string;
  login: string;
  telephone?: string;
  photo?: string;
  classe_nom?: string;
  filiere_nom?: string;
}

export interface Cours {
  id: number;
  titre: string;
  description?: string;
  matiere_id: number;
  enseignant_id: number;
  filiere_id: number;
  classe_id: number;
  niveau?: string;
  lien_externe?: string;
  matiere_nom?: string;
  ens_nom?: string;
  ens_prenom?: string;
  classes_noms?: string;
  fichiers?: FichierCours[];
  is_favori?: boolean;
}

export interface FichierCours {
  id: number;
  cours_id: number;
  type_fichier: "pdf" | "ppt" | "word" | "video" | "autre";
  nom_original: string;
  chemin_fichier: string;
}

export interface EmploiDuTemps {
  id: number;
  classe_id: number;
  titre: string;
  fichier_pdf?: string;
  fichier_image?: string;
  date_publication: string;
  actif: boolean;
  classes?: string;
  classe_nom?: string;
}

export interface Communique {
  id: number;
  titre: string;
  contenu: string;
  image?: string;
  fichier_pdf?: string;
  auteur_id: number;
  mis_en_avant: boolean;
  archive: boolean;
  date_publication?: string;
  auteur_nom?: string;
  auteur_prenom?: string;
}

export interface MessageContact {
  id: number;
  nom: string;
  prenom: string;
  telephone?: string;
  sujet: string;
  destinataire_type: string;
  destinataire_id?: number;
  message: string;
  reponse?: string;
  lu: boolean;
  destinataire_nom?: string;
}

export interface NotificationItem {
  id: number;
  user_id: number;
  type: string;
  contenu: string;
  lien?: string;
  lu: boolean;
}
