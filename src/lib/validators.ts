import { z } from "zod";

// Robustesse du mot de passe requise : 8+ chars, 1 majuscule, 1 minuscule, 1 chiffre, 1 caractère spécial
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_\-#])[A-Za-z\d@$!%*?&_\-#]{8,}$/;

export const passwordRequirementsMessage =
  "Le mot de passe doit comporter au moins 8 caractères, une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial (@$!%*?&_-#).";

// 1. Inscription — Étape 1
export const signupStep1Schema = z.object({
  fullName: z
    .string()
    .min(3, "Le nom complet doit comporter au moins 3 caractères")
    .max(100, "Le nom est trop long"),
  email: z
    .string()
    .email("Adresse email invalide")
    .toLowerCase()
    .trim(),
});

export type SignupStep1Input = z.infer<typeof signupStep1Schema>;

// 2. Inscription — Vérification 2FA
export const verify2FASchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  code: z
    .string()
    .regex(/^\d{6}$/, "Le code de vérification doit être composé exactement de 6 chiffres"),
});

export type Verify2FAInput = z.infer<typeof verify2FASchema>;

// 3. Inscription — Étape 2 (Finalisation)
export const signupStep2Schema = z
  .object({
    email: z.string().email().toLowerCase().trim(),
    code: z.string().regex(/^\d{6}$/),
    fullName: z.string().min(3),
    username: z
      .string()
      .min(3, "L'identifiant doit comporter au moins 3 caractères")
      .max(30, "L'identifiant ne peut dépasser 30 caractères")
      .regex(/^[a-zA-Z0-9._-]+$/, "L'identifiant ne peut contenir que des lettres, chiffres, points, tirets"),
    password: z.string().regex(passwordRegex, passwordRequirementsMessage),
    confirmPassword: z.string(),
    filiere: z.enum(["MPI", "SML", "MIASS"]).optional(),
    niveau: z.enum(["L1", "L2"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

export type SignupStep2Input = z.infer<typeof signupStep2Schema>;

// 4. Connexion
export const loginSchema = z.object({
  emailOrUsername: z.string().min(2, "Veuillez renseigner votre email ou identifiant"),
  password: z.string().min(1, "Veuillez saisir votre mot de passe"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// 5. Formulaire de contact public
export const contactFormSchema = z.object({
  fullName: z.string().min(2, "Veuillez renseigner votre nom"),
  email: z.string().email("Adresse email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Veuillez préciser le sujet de votre message"),
  message: z.string().min(10, "Votre message doit comporter au moins 10 caractères"),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

// 6. Publication de cours (Professeurs & Admin)
export const courseSchema = z.object({
  title: z.string().min(3, "Le titre du cours est requis"),
  description: z.string().optional(),
  matiereId: z.string().uuid("Veuillez sélectionner une matière valide"),
  classeId: z.string().uuid("Veuillez sélectionner une classe valide"),
  externalUrl: z.string().url("URL de ressource invalide").optional().or(z.literal("")),
});

export type CourseInput = z.infer<typeof courseSchema>;

// 7. Message interne
export const internalMessageSchema = z.object({
  receiverId: z.string().uuid("Destinataire invalide"),
  subject: z.string().min(3, "Le sujet est obligatoire"),
  content: z.string().min(5, "Le contenu du message doit comporter au moins 5 caractères"),
  parentId: z.string().uuid().optional(),
});

export type InternalMessageInput = z.infer<typeof internalMessageSchema>;

// 8. Message Chat général
export const chatMessageSchema = z.object({
  content: z
    .string()
    .min(1, "Le message ne peut être vide")
    .max(1000, "Le message ne peut excéder 1000 caractères"),
});

export type ChatMessageInput = z.infer<typeof chatMessageSchema>;

// 9. Communiqué officiel
export const communiqueSchema = z.object({
  title: z.string().min(4, "Le titre du communiqué est requis"),
  content: z.string().min(10, "Le contenu du communiqué est requis"),
  isImportant: z.boolean().default(false),
  targetRole: z.enum(["etudiant", "professeur", "admin"]).nullable().optional(),
});

export type CommuniqueInput = z.infer<typeof communiqueSchema>;
