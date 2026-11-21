import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { MarketplaceOrder, MarketplaceItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const orderId = request.nextUrl.searchParams.get("orderId");
    const itemId = request.nextUrl.searchParams.get("itemId");
    const email = request.nextUrl.searchParams.get("email");

    if (!orderId && (!itemId || !email)) {
      return NextResponse.json({ error: "Identifiant de commande ou email manquant" }, { status: 400 });
    }

    let order: MarketplaceOrder | null = null;

    // 1. Chercher dans Supabase
    try {
      const supabase = createAdminClient();
      let q = supabase.from("marketplace_orders").select("*");
      if (orderId) {
        q = q.eq("id", orderId);
      } else if (itemId && email) {
        q = q.eq("item_id", itemId).ilike("buyer_email", email.trim().toLowerCase());
      }
      const { data } = await q.maybeSingle();
      if (data) order = data as MarketplaceOrder;
    } catch {}

    // 2. Chercher dans le manifest local
    if (!order) {
      try {
        const manifestFile = path.join(process.cwd(), "public", "marketplace-orders-manifest.json");
        const raw = await fs.readFile(manifestFile, "utf-8");
        const orders: MarketplaceOrder[] = JSON.parse(raw);
        if (orderId) {
          order = orders.find((o) => o.id === orderId) || null;
        } else if (itemId && email) {
          order = orders.find((o) => o.item_id === itemId && o.buyer_email.toLowerCase() === email.trim().toLowerCase()) || null;
        }
      } catch {}
    }

    if (!order) {
      return NextResponse.json(
        { error: "Aucune commande trouvée pour ce document et cette adresse email." },
        { status: 404 }
      );
    }

    // VÉRIFICATION STRICTE DE LA VALIDATION ADMIN
    if (order.status !== "valide") {
      return NextResponse.json(
        {
          error: "Téléchargement bloqué : Votre commande est en cours d'examen et doit être validée par l'administration HAS après confirmation du règlement.",
          status: order.status,
        },
        { status: 403 }
      );
    }

    // Récupérer le lien PDF du document
    let pdfUrl = order.item_pdf_url;
    if (!pdfUrl) {
      // Trouver l'item
      try {
        const itemsFile = path.join(process.cwd(), "public", "marketplace-manifest.json");
        const raw = await fs.readFile(itemsFile, "utf-8");
        const items: MarketplaceItem[] = JSON.parse(raw);
        const item = items.find((i) => i.id === order?.item_id);
        if (item?.pdf_url) pdfUrl = item.pdf_url;
      } catch {}
    }

    if (!pdfUrl) {
      pdfUrl = "/uploads/courses/fascicule-officiel-has.pdf";
    }

    // Incrémenter le compteur de téléchargements
    try {
      const supabase = createAdminClient();
      await supabase
        .from("marketplace_orders")
        .update({ download_count: (order.download_count || 0) + 1 })
        .eq("id", order.id);
    } catch {}

    // Rediriger vers le fichier PDF autorisé
    return NextResponse.redirect(new URL(pdfUrl, request.url));
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Erreur lors du traitement du téléchargement" }, { status: 500 });
  }
}
