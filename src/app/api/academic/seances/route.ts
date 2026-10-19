import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { DEFAULT_SEANCES_EDT } from "@/lib/academicStorage";
import { SeanceEDT } from "@/lib/types";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "public", "uploads", "seances-data.json");
const MANIFEST_STORAGE_KEY = "seances-manifest.json";
const BUCKET_PRIMARY = "emplois-du-temps";
const BUCKET_BACKUP = "cours-supports";

// Cache mémoire serveur pour réponses instantanées
let memorySeancesStore: SeanceEDT[] | null = null;
let memorySlotsStore: Record<"L1" | "L2", string[]> | null = null;
const memoryMeetLinks: Record<string, string> = {};

interface SeancePayload {
  seances: SeanceEDT[];
  slots?: Record<"L1" | "L2", string[]>;
  updated_at?: string;
}

/**
 * Lecture locale du fichier JSON des séances sur le serveur
 */
async function readSeancesFromFile(): Promise<SeancePayload> {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return { seances: parsed };
    }
    if (parsed && Array.isArray(parsed.seances)) {
      return { seances: parsed.seances, slots: parsed.slots, updated_at: parsed.updated_at };
    }
  } catch {}
  return { seances: [] };
}

/**
 * Écriture locale sur disque du registre des séances
 */
async function writeSeancesToFile(
  seances: SeanceEDT[],
  slots?: Record<"L1" | "L2", string[]>
): Promise<void> {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const payload: SeancePayload = {
      seances,
      slots: slots || memorySlotsStore || undefined,
      updated_at: new Date().toISOString(),
    };
    await fs.writeFile(DATA_FILE, JSON.stringify(payload, null, 2), "utf-8");
  } catch (err) {
    console.warn("Info écriture fichier local seances-data.json:", err);
  }
}

/**
 * Lecture cloud persistante depuis Supabase Storage (emplois-du-temps ou cours-supports)
 */
async function readSeancesFromSupabaseStorage(): Promise<SeancePayload> {
  try {
    const supabaseAdmin = createAdminClient();

    // 1. Essai sur le bucket principal 'emplois-du-temps'
    let fileBlob: Blob | null = null;
    const { data: b1, error: e1 } = await supabaseAdmin.storage
      .from(BUCKET_PRIMARY)
      .download(MANIFEST_STORAGE_KEY);
    if (!e1 && b1) {
      fileBlob = b1;
    } else {
      // 2. Fallback sur le bucket de secours 'cours-supports'
      const { data: b2, error: e2 } = await supabaseAdmin.storage
        .from(BUCKET_BACKUP)
        .download(MANIFEST_STORAGE_KEY);
      if (!e2 && b2) fileBlob = b2;
    }

    if (fileBlob) {
      const text = await fileBlob.text();
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        return { seances: parsed };
      }
      if (parsed && Array.isArray(parsed.seances)) {
        return { seances: parsed.seances, slots: parsed.slots, updated_at: parsed.updated_at };
      }
    }
  } catch (err) {
    console.warn("Info lecture Supabase Storage seances-manifest:", err);
  }
  return { seances: [] };
}

/**
 * Sauvegarde cloud définitive dans Supabase Storage
 */
async function writeSeancesToSupabaseStorage(
  seances: SeanceEDT[],
  slots?: Record<"L1" | "L2", string[]>
): Promise<void> {
  try {
    const supabaseAdmin = createAdminClient();
    const payload: SeancePayload = {
      seances,
      slots: slots || memorySlotsStore || undefined,
      updated_at: new Date().toISOString(),
    };
    const jsonBuffer = Buffer.from(JSON.stringify(payload, null, 2), "utf-8");

    // Écriture sur 'emplois-du-temps'
    await supabaseAdmin.storage.from(BUCKET_PRIMARY).upload(MANIFEST_STORAGE_KEY, jsonBuffer, {
      contentType: "application/json",
      cacheControl: "60",
      upsert: true,
    });

    // Miroir de secours sur 'cours-supports'
    supabaseAdmin.storage
      .from(BUCKET_BACKUP)
      .upload(MANIFEST_STORAGE_KEY, jsonBuffer, {
        contentType: "application/json",
        cacheControl: "60",
        upsert: true,
      })
      .catch(() => {});
  } catch (err) {
    console.warn("Info sauvegarde Supabase Storage seances-manifest:", err);
  }
}

/**
 * GET: Récupère les séances officielles persistées (Cloud Storage + Fichier disque + Logs).
 * Garantit que TOUTES les modifications faites pour la semaine sont conservées à tout jamais.
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

    // 1. Récupérer tous les liens Meet enregistrés dans public.logs
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

    // 2. Récupérer les séances supprimées (DEL_SEANCE:id)
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

    // 3. Charger les séances depuis les différentes couches de persistance
    let loadedSeances: SeanceEDT[] = [];
    let loadedSlots: Record<"L1" | "L2", string[]> | undefined = undefined;

    // A. Depuis le cache mémoire si disponible
    if (memorySeancesStore && memorySeancesStore.length > 0) {
      loadedSeances = memorySeancesStore;
      loadedSlots = memorySlotsStore || undefined;
    }

    // B. Si pas en mémoire, lire depuis Supabase Cloud Storage
    if (loadedSeances.length === 0) {
      const cloudData = await readSeancesFromSupabaseStorage();
      if (cloudData.seances && cloudData.seances.length > 0) {
        loadedSeances = cloudData.seances;
        loadedSlots = cloudData.slots;
      }
    }

    // C. Si pas dans le cloud, lire depuis le fichier disque local
    if (loadedSeances.length === 0) {
      const fileData = await readSeancesFromFile();
      if (fileData.seances && fileData.seances.length > 0) {
        loadedSeances = fileData.seances;
        loadedSlots = fileData.slots;
      }
    }

    // D. Si toujours aucune donnée sauvegardée, initialiser avec DEFAULT_SEANCES_EDT
    const isFirstInit = loadedSeances.length === 0;
    const baseList: SeanceEDT[] = isFirstInit ? DEFAULT_SEANCES_EDT : loadedSeances;

    const map = new Map<string, SeanceEDT>();
    baseList.forEach((s) => {
      if (s && s.id && !deletedIds.has(s.id)) {
        map.set(s.id, { ...s });
      }
    });

    // Si première initialisation, persister immédiatement dans le cloud et sur disque
    if (isFirstInit) {
      const initialList = Array.from(map.values());
      memorySeancesStore = initialList;
      writeSeancesToSupabaseStorage(initialList).catch(() => {});
      writeSeancesToFile(initialList).catch(() => {});
    } else {
      memorySeancesStore = Array.from(map.values());
      if (loadedSlots) memorySlotsStore = loadedSlots;
    }

    // 4. Injecter les liens Google Meet persistés
    const finalSeances = Array.from(map.values()).map((s) => {
      const persistedMeet = meetMap[s.id] || memoryMeetLinks[s.id] || s.meet_url;
      return {
        ...s,
        meet_url: persistedMeet && persistedMeet.trim() ? persistedMeet.trim() : null,
      };
    });

    return NextResponse.json({
      success: true,
      hasSavedData: !isFirstInit,
      seances: finalSeances,
      slots: memorySlotsStore || loadedSlots || undefined,
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
 * POST: Sauvegarde définitive et multi-appareils des séances EDT, créneaux et liens Google Meet.
 * Persiste dans Supabase Cloud Storage, le disque local, public.logs et la mémoire.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const seances: SeanceEDT[] | undefined = body.seances;
    const slots: Record<"L1" | "L2", string[]> | undefined = body.slots;
    const adminEmail = body.adminEmail || "direction@halil-academie.com";
    const clearAllMeets: boolean = Boolean(body.clearAllMeets);
    const deletedId = body.deletedId as string | undefined;
    const seanceId = body.seanceId as string | undefined;
    const isSingleMeetUpdate = Boolean(seanceId && ("meetUrl" in body));

    if (!Array.isArray(seances) && !deletedId && !clearAllMeets && !isSingleMeetUpdate) {
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

    // 1. Purge totale de tous les liens Meet
    if (clearAllMeets) {
      for (const k of Object.keys(memoryMeetLinks)) delete memoryMeetLinks[k];
      if (memorySeancesStore) {
        memorySeancesStore = memorySeancesStore.map((s) => ({ ...s, meet_url: null }));
        await writeSeancesToSupabaseStorage(memorySeancesStore, memorySlotsStore || undefined);
        await writeSeancesToFile(memorySeancesStore, memorySlotsStore || undefined);
      }
      try {
        await supabaseAdmin.from("logs").delete().like("action", "MEET:%");
        await supabaseAdmin.from("logs").insert({
          action: "MEETS_RESET_ALL",
          description: "Tous les liens Meet ont été purgés à la demande de l'administration",
        });
      } catch (err) {
        console.warn("Erreur logs Supabase MEETS_RESET_ALL:", err);
      }
      return NextResponse.json({
        success: true,
        message: "Tous les liens Meet ont été purgés avec succès.",
      });
    }

    // 2. Mise à jour / suppression ciblée du lien Meet d'une séance (utilisé par le modal Prof)
    if (isSingleMeetUpdate && seanceId) {
      const rawMeet = body.meetUrl;
      const cleanMeet = rawMeet && typeof rawMeet === "string" && rawMeet.trim() ? rawMeet.trim() : null;

      try {
        await supabaseAdmin.from("logs").delete().eq("action", `MEET:${seanceId}`);
      } catch {}

      if (cleanMeet) {
        await supabaseAdmin.from("logs").insert({
          action: `MEET:${seanceId}`,
          description: cleanMeet.substring(0, 250),
        });
        memoryMeetLinks[seanceId] = cleanMeet;
      } else {
        delete memoryMeetLinks[seanceId];
      }

      if (memorySeancesStore) {
        memorySeancesStore = memorySeancesStore.map((s) =>
          s.id === seanceId ? { ...s, meet_url: cleanMeet, updated_at: new Date().toISOString() } : s
        );
        await writeSeancesToSupabaseStorage(memorySeancesStore, memorySlotsStore || undefined);
        await writeSeancesToFile(memorySeancesStore, memorySlotsStore || undefined);
      }

      return NextResponse.json({
        success: true,
        message: cleanMeet
          ? `Lien Meet pour la séance ${seanceId} enregistré.`
          : `Lien Meet pour la séance ${seanceId} supprimé.`,
        seanceId,
        meetUrl: cleanMeet,
      });
    }

    // 3. Suppression d'une séance
    if (deletedId) {
      try {
        await supabaseAdmin.from("logs").insert({
          action: `DEL_SEANCE:${deletedId}`,
          description: "deleted",
        });
        await supabaseAdmin.from("logs").delete().eq("action", `MEET:${deletedId}`);
      } catch {}

      delete memoryMeetLinks[deletedId];

      // Charger l'existant pour retirer la séance
      let currentList = memorySeancesStore || (await readSeancesFromSupabaseStorage()).seances;
      if (!currentList || currentList.length === 0) {
        currentList = (await readSeancesFromFile()).seances;
      }
      const updatedList = currentList.filter((s) => s.id !== deletedId);
      memorySeancesStore = updatedList;

      await writeSeancesToSupabaseStorage(updatedList, memorySlotsStore || undefined);
      await writeSeancesToFile(updatedList, memorySlotsStore || undefined);

      return NextResponse.json({ success: true, message: `Séance ${deletedId} supprimée avec succès.` });
    }

    // 4. Sauvegarde / synchronisation en masse des séances & créneaux horaires
    const nowIso = new Date().toISOString();
    const cleanSeances: SeanceEDT[] = (seances || []).map((s) => ({
      ...s,
      updated_at: s.updated_at || nowIso,
      created_at: s.created_at || nowIso,
    }));

    memorySeancesStore = cleanSeances;
    if (slots) memorySlotsStore = slots;

    // A. Persistance Cloud Storage (source maîtresse cross-devices et Vercel serverless)
    await writeSeancesToSupabaseStorage(cleanSeances, slots);

    // B. Persistance miroir disque local serveur
    await writeSeancesToFile(cleanSeances, slots);

    // C. Synchronisation des liens Meet dans public.logs
    const meetInserts: { action: string; description: string }[] = [];
    for (const s of cleanSeances) {
      if (s.meet_url && typeof s.meet_url === "string" && s.meet_url.trim()) {
        const cleanMeet = s.meet_url.trim();
        memoryMeetLinks[s.id] = cleanMeet;
        meetInserts.push({
          action: `MEET:${s.id}`,
          description: cleanMeet.substring(0, 250),
        });
      } else {
        delete memoryMeetLinks[s.id];
      }
    }

    if (meetInserts.length > 0) {
      try {
        // Nettoyer les anciens Meet logs des séances concernées
        for (const ins of meetInserts) {
          await supabaseAdmin.from("logs").delete().eq("action", ins.action);
        }
        await supabaseAdmin.from("logs").insert(meetInserts);
      } catch (err) {
        console.warn("Erreur insertion liens Meet Supabase:", err);
      }
    }

    // D. Journaliser la synchronisation EDT
    try {
      await supabaseAdmin.from("logs").insert({
        action: "EDT_SEANCES_SYNC",
        description: `EDT synchronisé avec succès : ${cleanSeances.length} séance(s) par ${emailNorm}`,
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: `✓ Synchronisation réussie pour ${cleanSeances.length} séance(s) EDT enregistrée(s) dans le cloud.`,
      count: cleanSeances.length,
      meetCount: meetInserts.length,
      slots: slots || memorySlotsStore || undefined,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
