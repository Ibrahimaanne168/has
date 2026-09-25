"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function sendStudentMessageAction(formData: FormData): Promise<void> {
  const user = await getCurrentUser();
  if (!user || user.role_id !== 3) {
    return;
  }

  const sujet = formData.get("sujet")?.toString().trim();
  const destinataireType = formData.get("destinataire_type")?.toString().trim();
  const destinataireIdRaw = formData.get("destinataire_id")?.toString();
  const message = formData.get("message")?.toString().trim();

  if (!sujet || !message || !destinataireType) {
    return;
  }

  const destinataireId = destinataireType === "enseignant" && destinataireIdRaw ? parseInt(destinataireIdRaw, 10) : null;

  try {
    await query(
      `INSERT INTO messages_contact (nom, prenom, telephone, sujet, destinataire_type, destinataire_id, message)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [user.nom, user.prenom, user.telephone || null, sujet, destinataireType, destinataireId, message]
    );

    try {
      await query(
        `INSERT INTO logs (user_id, action, description) VALUES ($1, $2, $3)`,
        [user.id, "message_contact", `Message envoyé : ${sujet}`]
      );
    } catch {
      // Ignorer si la table de logs n'est pas configurée
    }

    revalidatePath("/etudiant/messages");
  } catch (err: any) {
    console.error("Erreur envoi message étudiant:", err);
  }
}
