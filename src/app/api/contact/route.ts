import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validators";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const parseResult = contactFormSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0]?.message || "Veuillez renseigner tous les champs obligatoires" },
        { status: 400 }
      );
    }

    const { fullName, email, phone, subject, message } = parseResult.data;
    const ip = request.headers.get("x-forwarded-for") || "local";
    const supabaseAdmin = createAdminClient();

    try {
      await supabaseAdmin.from("contact_messages").insert({
        full_name: fullName,
        email,
        phone: phone || null,
        subject,
        message,
        status: "nouveau",
        ip_address: ip,
      });
    } catch (dbErr) {
      console.warn("[CONTACT-DB-WARNING]", dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Votre message a été transmis avec succès à l'administration de Halil Académie Scientifique. Nous vous répondrons dans les plus brefs délais.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Erreur interne";
    console.error("[CONTACT-API-ERROR]", message);
    return NextResponse.json(
      { error: "Une erreur est survenue lors de l'envoi de votre message." },
      { status: 500 }
    );
  }
}
