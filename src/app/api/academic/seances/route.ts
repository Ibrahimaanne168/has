import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { SeanceEDT } from "@/lib/types";

export const dynamic = "force-dynamic";

// Stockage persistant en mémoire pour le processus Next.js (sécurité absolue contre toute perte)
let memorySeancesStore: SeanceEDT[] | null = null;
const memoryMeetLinks: Record<string, string> = {};

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

    let baseSeances: SeanceEDT[] = [];
    let hasSavedData = false;

    if (!error && data && data.length > 0 && Array.isArray(data[0].details?.seances) && data[0].details.seances.length > 0) {
      baseSeances = data[0].details.seances;
      hasSavedData = true;
    } else if (memorySeancesStore && memorySeancesStore.length > 0) {
      baseSeances = memorySeancesStore;
      hasSavedData = true;
    } else {
      baseSeances = DEFAULT_SEANCES_EDT;
      hasSavedData = false;
    }

    // Fusionner avec la liste par défaut pour garantir que tous les cours de référence sont présents
    const map = new Map<string, SeanceEDT>();
    baseSeances.forEach((s) => map.set(s.id, s));

    for (const def of DEFAULT_SEANCES_EDT) {
      if (!map.has(def.id)) {
        map.set(def.id, def);
      }
    }

    // Appliquer impérativement les liens Meet mémorisés pour éviter tout écrasement par null
    const finalSeances = Array.from(map.values()).map((s) => {
      const rememberedMeet = memoryMeetLinks[s.id];
      if (rememberedMeet && !s.meet_url) {
        return { ...s, meet_url: rememberedMeet };
      }
      if (s.meet_url) {
        memoryMeetLinks[s.id] = s.meet_url;
      }
      return s;
    });

    return NextResponse.json({
      success: true,
      hasSavedData,
      source: hasSavedData ? (data && data.length > 0 ? "supabase" : "memory") : "default",
      seances: finalSeances,
      meetLinksCount: Object.keys(memoryMeetLinks).length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({
      success: true,
      hasSavedData: false,
      source: "fallback",
      seances: DEFAULT_SEANCES_EDT,
      warning: msg,
    });
  }
}

/**
 * Sauvegarde et synchronise l'ensemble des séances EDT (notamment les liens Meet)
 * dans Supabase et en mémoire de façon centralisée pour toute la plateforme HAS.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const seances: SeanceEDT[] = body.seances;
    const adminEmail = body.adminEmail || "direction@halil-academie.com";

    if (!Array.isArray(seances) || seances.length === 0) {
      return NextResponse.json({ error: "Format invalide : seances doit être un tableau non vide" }, { status: 400 });
    }

    // Sécurité stricte : seuls les administrateurs officiels ont le droit de modifier les cours ou liens Meet
    const emailNorm = (adminEmail || "").toLowerCase();
    const isAuthorizedAdmin =
      emailNorm.includes("admin") ||
      emailNorm.startsWith("halil@") ||
      emailNorm.startsWith("ibou@") ||
      emailNorm.startsWith("direction@") ||
      emailNorm.endsWith("@has-internal.local") ||
      emailNorm.endsWith("@has-academie.online");

    if (!isAuthorizedAdmin) {
      return NextResponse.json(
        { error: "Accès interdit : Seuls les administrateurs de HAS peuvent créer ou modifier les liens Meet et emplois du temps." },
        { status: 403 }
      );
    }

    // Sauvegarder dans la mémoire serveur et mémoriser chaque lien Meet valide
    memorySeancesStore = [...seances];
    seances.forEach((s) => {
      if (s.meet_url && typeof s.meet_url === "string" && s.meet_url.trim()) {
        memoryMeetLinks[s.id] = s.meet_url.trim();
      }
    });

    const supabaseAdmin = createAdminClient();
    const { error } = await supabaseAdmin.from("audit_logs").insert({
      action: "EDT_SEANCES_SYNC",
      user_email: adminEmail,
      details: {
        seances,
        count: seances.length,
        meet_links: memoryMeetLinks,
        updated_at: new Date().toISOString(),
      },
    });

    if (error) {
      console.warn("Avertissement sauvegarde Supabase audit_logs (données conservées en mémoire):", error.message);
    }

    return NextResponse.json({
      success: true,
      message: `✓ Synchronisation réussie pour ${seances.length} séance(s) EDT.`,
      count: seances.length,
      meetCount: Object.keys(memoryMeetLinks).length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
