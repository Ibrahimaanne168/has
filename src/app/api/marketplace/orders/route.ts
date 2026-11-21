import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { MarketplaceOrder } from "@/lib/types";

export const dynamic = "force-dynamic";

const ORDERS_MANIFEST_FILE = path.join(process.cwd(), "public", "marketplace-orders-manifest.json");

async function readLocalOrders(): Promise<MarketplaceOrder[]> {
  try {
    const raw = await fs.readFile(ORDERS_MANIFEST_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch {}
  return [];
}

async function writeLocalOrders(orders: MarketplaceOrder[]): Promise<void> {
  try {
    await fs.writeFile(ORDERS_MANIFEST_FILE, JSON.stringify(orders, null, 2), "utf-8");
  } catch (err) {
    console.warn("Écriture marketplace-orders-manifest local échouée :", err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email");

    // 1. Tenter via Supabase
    try {
      const supabase = createAdminClient();
      let query = supabase.from("marketplace_orders").select("*").order("created_at", { ascending: false });
      if (email) query = query.ilike("buyer_email", email.trim().toLowerCase());
      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        return NextResponse.json(data);
      }
    } catch {}

    // 2. Fallback local
    const local = await readLocalOrders();
    if (email) {
      const cleanEmail = email.trim().toLowerCase();
      return NextResponse.json(local.filter((o) => o.buyer_email.toLowerCase() === cleanEmail));
    }
    return NextResponse.json(local);
  } catch (err) {
    console.error("GET /api/marketplace/orders error:", err);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as MarketplaceOrder;
    if (!body || !body.item_id || !body.buyer_name) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }

    const order: MarketplaceOrder = {
      ...body,
      id: body.id || `ord-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: body.status || "en_attente",
      download_count: body.download_count || 0,
      created_at: body.created_at || new Date().toISOString(),
    };

    // 1. Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from("marketplace_orders").upsert(order);
    } catch {}

    // 2. Local
    const local = await readLocalOrders();
    const idx = local.findIndex((o) => o.id === order.id);
    if (idx !== -1) {
      local[idx] = order;
    } else {
      local.unshift(order);
    }
    await writeLocalOrders(local);

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("POST /api/marketplace/orders error:", err);
    return NextResponse.json({ error: "Erreur enregistrement commande" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, status, validated_by } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: "ID et statut requis" }, { status: 400 });
    }

    const updates: Partial<MarketplaceOrder> = {
      status,
      updated_at: new Date().toISOString(),
      ...(status === "valide"
        ? { validated_at: new Date().toISOString(), validated_by: validated_by || "Administration HAS" }
        : {}),
    };

    // 1. Supabase
    try {
      const supabase = createAdminClient();
      await supabase.from("marketplace_orders").update(updates).eq("id", id);
    } catch {}

    // 2. Local
    const local = await readLocalOrders();
    const idx = local.findIndex((o) => o.id === id);
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...updates };
      await writeLocalOrders(local);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/marketplace/orders error:", err);
    return NextResponse.json({ error: "Erreur mise à jour commande" }, { status: 500 });
  }
}
