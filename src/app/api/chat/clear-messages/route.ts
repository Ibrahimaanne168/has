import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = createAdminClient();
    const body = await request.json().catch(() => ({}));
    const salonId = body?.salonId;

    if (salonId && salonId !== "all" && salonId !== "general") {
      // Supprimer les messages spécifiques à un salon
      const { error } = await supabaseAdmin
        .from("chat_messages")
        .delete()
        .like("message", `%[[salon:${salonId}]]%`);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      // Supprimer tous les messages enregistrés
      const { error } = await supabaseAdmin
        .from("chat_messages")
        .delete()
        .gte("id", 0);
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Tous les messages des salons ont été supprimés avec succès.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
