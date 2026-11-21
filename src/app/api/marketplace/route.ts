import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { MOCK_MARKETPLACE_ITEMS } from "@/lib/data/marketplace-data";
import { MarketplaceItem } from "@/lib/types";

export const dynamic = "force-dynamic";

const MANIFEST_FILE = path.join(process.cwd(), "public", "marketplace-manifest.json");

async function readLocalManifest(): Promise<MarketplaceItem[]> {
  try {
    const raw = await fs.readFile(MANIFEST_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {}
  return MOCK_MARKETPLACE_ITEMS;
}

async function writeLocalManifest(items: MarketplaceItem[]): Promise<void> {
  try {
    await fs.writeFile(MANIFEST_FILE, JSON.stringify(items, null, 2), "utf-8");
  } catch (err) {
    console.warn("Écriture marketplace-manifest local échouée :", err);
  }
}

export async function GET(request: NextRequest) {
  try {
    // 1. Tenter via Supabase table marketplace_items
    try {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("marketplace_items")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch {}

    // 2. Fallback sur le manifest JSON
    const localItems = await readLocalManifest();
    return NextResponse.json(localItems);
  } catch (err: unknown) {
    console.error("GET /api/marketplace error:", err);
    return NextResponse.json(MOCK_MARKETPLACE_ITEMS);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MarketplaceItem;
    if (!body || !body.title || !body.price) {
      return NextResponse.json({ error: "Titre et prix obligatoires" }, { status: 400 });
    }

    const phone = body.whatsapp_number || body.professeur_phone || "+221 77 551 81 96";
    const item: MarketplaceItem = {
      ...body,
      id: body.id || `mkt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      whatsapp_number: phone,
      professeur_phone: phone,
      professeur_name: body.professeur_name || "HAS Académie",
      cover_image_url: body.cover_image_url || "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80",
      file_size: body.file_size || "1.99 MB",
      updated_at: new Date().toISOString(),
      created_at: body.created_at || new Date().toISOString(),
    };

    // 1. Sauvegarde Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from("marketplace_items").upsert(item);
    } catch (dbErr) {
      console.info("Info Supabase marketplace upsert:", dbErr);
    }

    // 2. Sauvegarde manifest local
    const current = await readLocalManifest();
    const idx = current.findIndex((i) => i.id === item.id);
    if (idx !== -1) {
      current[idx] = item;
    } else {
      current.unshift(item);
    }
    await writeLocalManifest(current);

    return NextResponse.json({ success: true, item });
  } catch (err: unknown) {
    console.error("POST /api/marketplace error:", err);
    return NextResponse.json({ error: "Erreur lors de la sauvegarde" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // 1. Suppression Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from("marketplace_items").delete().eq("id", id);
    } catch {}

    // 2. Suppression locale
    const current = await readLocalManifest();
    const filtered = current.filter((i) => i.id !== id);
    await writeLocalManifest(filtered);

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("DELETE /api/marketplace error:", err);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
