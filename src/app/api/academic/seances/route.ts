import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { SeanceEDT } from "@/lib/types";

export const dynamic = "force-dynamic";

/**
 * Récupère les séances officielles synchronisées dans Supabase.
 * Permet à TOUS les comptes (étudiants, professeurs, administrateurs)
 * de voir instantanément les liens Google Meet et modifications de l'EDT.
 */
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();
    const { data, error } = await supabaseAdmin
      .from("audit_logs")
      .select("details, created_at")
      .eq("action", "EDT_SEANCES_SYNC")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return NextResponse.json({
        success: true,
        source: "default",
        seances: DEFAULT_SEANCES_EDT,
      });
    }

    const savedSeances: SeanceEDT[] = data[0].details?.seances || [];
    if (!Array.isArray(savedSeances) || savedSeances.length === 0) {
      return NextResponse.json({
        success: true,
        source: "default",
        seances: DEFAULT_SEANCES_EDT,
      });
    }

    // Fusionner les séances enregistrées avec les séances par défaut pour ne rien perdre
    const merged = [...savedSeances];
    for (const def of DEFAULT_SEANCES_EDT) {
      if (!merged.some((s) => s.id === def.id)) {
        merged.push(def);
      }
    }

    return NextResponse.json({
      success: true,
      source: "supabase",
      seances: merged,
      last_updated: data[0].created_at,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({
      success: true,
      source: "fallback",
      seances: DEFAULT_SEANCES_EDT,
      warning: msg,
    });
  }
}

/**
 * Sauvegarde et synchronise l'ensemble des séances EDT (notamment les liens Meet)
 * dans Supabase de façon centralisée pour toute la plateforme HAS.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const seances: SeanceEDT[] = body.seances;
    const adminEmail = body.adminEmail || "direction@halil-academie.com";

    if (!Array.isArray(seances)) {
      return NextResponse.json({ error: "Format invalide : seances doit être un tableau" }, { status: 400 });
    }

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("audit_logs").insert({
      action: "EDT_SEANCES_SYNC",
      user_email: adminEmail,
      details: {
        seances,
        count: seances.length,
        updated_at: new Date().toISOString(),
      },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `✓ Synchronisation réussie pour ${seances.length} séance(s) EDT.`,
      count: seances.length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
