import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { nom, prenom, telephone, sujet, destinataire_type, message } = data;

    if (!nom || !prenom || !sujet || !message) {
      return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
    }

    await query(
      `INSERT INTO messages_contact (nom, prenom, telephone, sujet, destinataire_type, message, lu) 
       VALUES ($1, $2, $3, $4, $5, $6, FALSE)`,
      [nom, prenom, telephone || null, sujet, destinataire_type || "administration", message]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
