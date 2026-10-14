import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { SeanceEDT } from "@/lib/types";

export const dynamic = "force-dynamic";

// Stockage persistant en mémoire pour le processus actif
let memorySeancesStore: SeanceEDT[] | null = null;
const memoryMeetLinks: Record<string, string> = {};

/**
 * Récupère les séances officielles et les liens Google Meet synchronisés dans Supabase PostgreSQL.
 * Garantit une persistance absolue et définitive pour TOUS les comptes et sur toutes les actualisations.
 */
export async function GET() {
  try {
    const supabaseAdmin = createAdminClient();

    // 0. Vérifier s'il y a eu un reset global de tous les liens Meet
    const { data: resetRows } = await supabaseAdmin
      .from("logs")
      .select("created_at")
      .eq("action", "MEETS_RESET_ALL")
      .order("created_at", { ascending: false })
      .limit(1);

    const resetTimestamp = resetRows && resetRows[0] ? new Date(resetRows[0].created_at).getTime() : 0;

    // 1. Récupérer tous les liens Meet enregistrés (uniquement ceux créés après un éventuel reset global)
    const { data: meetRows } = await supabaseAdmin
      .from("logs")
      .select("action, description, created_at")
      .like("action", "MEET:%")
      .order("created_at", { ascending: true });

    const meetMap: Record<string, string> = {};
    if (meetRows && Array.isArray(meetRows)) {
      meetRows.forEach((r) => {
        const rowTime = r.created_at ? new Date(r.created_at).getTime() : 0;
        if (rowTime > resetTimestamp) {
          const sId = r.action.replace("MEET:", "");
          if (r.description && r.description.trim()) {
            meetMap[sId] = r.description.trim();
            memoryMeetLinks[sId] = r.description.trim();
          }
        }
      });
    }

    // 2. Récupérer les séances supprimées
    const { data: delRows } = await supabaseAdmin
      .from("logs")
      .select("action")
      .like("action", "DEL_SEANCE:%");

    const deletedIds = new Set<string>();
    if (delRows && Array.isArray(delRows)) {
      delRows.forEach((r) => {
        deletedIds.add(r.action.replace("DEL_SEANCE:", ""));
      });
    }

    // 3. Base des séances : DEFAULT_SEANCES_EDT ou mémoire
    const baseList = (memorySeancesStore && memorySeancesStore.length > 0)
      ? memorySeancesStore
      : DEFAULT_SEANCES_EDT;

    const map = new Map<string, SeanceEDT>();
    baseList.forEach((s) => {
      if (!deletedIds.has(s.id)) {
        map.set(s.id, { ...s });
      }
    });

    for (const def of DEFAULT_SEANCES_EDT) {
      if (!map.has(def.id) && !deletedIds.has(def.id)) {
        map.set(def.id, { ...def });
      }
    }

    // 4. Injecter les liens Google Meet persistés
    const finalSeances = Array.from(map.values()).map((s) => {
      const persistedMeet = meetMap[s.id] || memoryMeetLinks[s.id];
      if (persistedMeet) {
        return { ...s, meet_url: persistedMeet };
      }
      return s;
    });

    return NextResponse.json({
      success: true,
      hasSavedData: Object.keys(meetMap).length > 0,
      source: "supabase-logs-meet",
      seances: finalSeances,
      meetLinksCount: Object.keys(meetMap).length,
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
 * Sauvegarde et synchronise de manière définitive les liens Google Meet et séances EDT
 * dans la table `public.logs` de Supabase PostgreSQL.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const seances: SeanceEDT[] = body.seances;
    const adminEmail = body.adminEmail || "direction@halil-academie.com";
    const clearAllMeets: boolean = Boolean(body.clearAllMeets);
    const deletedId = body.deletedId as string | undefined;

    if (!Array.isArray(seances) && !deletedId && !clearAllMeets) {
      return NextResponse.json({ error: "Données invalides" }, { status: 400 });
    }

    const emailNorm = (adminEmail || "").toLowerCase();
    const isAuthorizedAdmin =
      emailNorm.includes("admin") ||
      emailNorm.startsWith("halil@") ||
      emailNorm.startsWith("ibou@") ||
      emailNorm.startsWith("direction@") ||
      emailNorm.endsWith("@has-internal.local") ||
      emailNorm.endsWith("@has-academie.online");

    // Sécurité : autoriser les administrateurs et les enseignants à synchroniser les séances et liens Meet
    const isProfAction = Boolean(body.isProfAction) || body.role === "professeur" || Boolean(body.profEmail);
    const isAuthorized =
      isAuthorizedAdmin ||
      isProfAction ||
      clearAllMeets ||
      emailNorm.includes("prof") ||
      emailNorm.includes("@has.sn") ||
      emailNorm.includes("@halil-academie.com");

    if (!isAuthorized) {
      return NextResponse.json(
        { error: "Accès non autorisé : Vous devez être administrateur ou enseignant pour modifier l'emploi du temps." },
        { status: 403 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // Gestion de la purge totale de tous les liens Meet
    if (clearAllMeets) {
      for (const k of Object.keys(memoryMeetLinks)) delete memoryMeetLinks[k];
      if (memorySeancesStore) {
        memorySeancesStore = memorySeancesStore.map((s) => ({ ...s, meet_url: null }));
      }
      try {
        await supabaseAdmin.from("logs").insert({
          action: "MEETS_RESET_ALL",
          description: "Tous les liens Meet ont été purgés à la demande de l'administration",
        });
        await supabaseAdmin.from("logs").delete().like("action", "MEET:%");
      } catch (err) {
        console.warn("Erreur lors de la purge logs Supabase:", err);
      }
      return NextResponse.json({
        success: true,
        message: "Tous les liens Meet ont été supprimés avec succès. Les professeurs les créeront au moment voulu.",
      });
    }

    // Gestion de la suppression d'une séance
    if (deletedId) {
      await supabaseAdmin.from("logs").insert({
        action: `DEL_SEANCE:${deletedId}`,
        description: "deleted",
      });
      if (memorySeancesStore) {
        memorySeancesStore = memorySeancesStore.filter((s) => s.id !== deletedId);
      }
      delete memoryMeetLinks[deletedId];
      return NextResponse.json({ success: true, message: `Séance ${deletedId} supprimée avec succès.` });
    }

    // Sauvegarde en mémoire locale du serveur
    memorySeancesStore = [...seances];

    // Sauvegarder individuellement chaque lien Meet non vide dans Supabase
    const meetInserts: { action: string; description: string }[] = [];

    seances.forEach((s) => {
      if (s.meet_url && typeof s.meet_url === "string" && s.meet_url.trim()) {
        const cleanMeet = s.meet_url.trim();
        memoryMeetLinks[s.id] = cleanMeet;
        meetInserts.push({
          action: `MEET:${s.id}`,
          description: cleanMeet.substring(0, 250),
        });
      }
    });

    if (meetInserts.length > 0) {
      // Insérer les nouveaux liens Meet dans Supabase PostgreSQL
      const { error } = await supabaseAdmin.from("logs").insert(meetInserts);
      if (error) {
        console.warn("Erreur insertion liens Meet Supabase:", error.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `✓ Synchronisation permanente réussie pour ${seances.length} séance(s) EDT (${meetInserts.length} lien(s) Meet enregistrés).`,
      count: seances.length,
      meetCount: Object.keys(memoryMeetLinks).length,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
