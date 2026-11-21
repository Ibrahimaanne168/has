import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { createAdminClient } from "@/lib/supabase/service-role";
import { MarketplaceOrder, MarketplaceItem } from "@/lib/types";
import { generateOfficialPdfBuffer } from "@/lib/pdfTranslator";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const rawOrderId = request.nextUrl.searchParams.get("orderId") || request.nextUrl.searchParams.get("code");
    const orderId = rawOrderId ? rawOrderId.replace(/^#/, "").trim() : null;
    const itemId = request.nextUrl.searchParams.get("itemId");
    const phone = request.nextUrl.searchParams.get("phone")?.replace(/[^0-9]/g, "");
    const email = request.nextUrl.searchParams.get("email");
    const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "fr";

    if (!orderId && !phone && !email) {
      return NextResponse.json({ error: "Code de commande ou numéro de téléphone manquant" }, { status: 400 });
    }

    let order: MarketplaceOrder | null = null;

    // 1. Chercher dans Supabase
    try {
      const supabase = createAdminClient();
      let q = supabase.from("marketplace_orders").select("*");
      if (orderId) {
        q = q.eq("id", orderId);
      } else if (itemId && phone) {
        q = q.eq("item_id", itemId).ilike("buyer_phone", `%${phone.slice(-9)}%`);
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
          order = orders.find((o) => o.id === orderId || o.id.toLowerCase() === orderId.toLowerCase()) || null;
        } else if (itemId && phone) {
          order =
            orders.find(
              (o) =>
                o.item_id === itemId &&
                o.buyer_phone &&
                o.buyer_phone.replace(/[^0-9]/g, "").includes(phone.slice(-9))
            ) || null;
        } else if (itemId && email) {
          order =
            orders.find(
              (o) =>
                o.item_id === itemId &&
                o.buyer_email &&
                o.buyer_email.toLowerCase() === email.trim().toLowerCase()
            ) || null;
        }
      } catch {}
    }

    if (!order) {
      return NextResponse.json(
        { error: "Aucune commande trouvée avec ce code ou numéro de téléphone." },
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

    // Récupérer les informations complètes du document (item)
    let foundItem: MarketplaceItem | null = null;
    try {
      const itemsFile = path.join(process.cwd(), "public", "marketplace-manifest.json");
      const raw = await fs.readFile(itemsFile, "utf-8");
      const items: MarketplaceItem[] = JSON.parse(raw);
      foundItem = items.find((i) => i.id === order?.item_id) || null;
    } catch {}

    const resolvedItem: MarketplaceItem = foundItem || {
      id: order.item_id,
      title: order.item_title,
      description: "Fascicule officiel d'exercices et corriges detailles.",
      price: order.item_price || 0,
      currency: "FCFA",
      cover_image_url: "",
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    let pdfBuffer: Buffer | null = null;
    let finalFileName = "";

    // SI L'UTILISATEUR DEMANDE LA VERSION ANGLAISE TRADUITE
    if (lang === "en") {
      const generated = await generateOfficialPdfBuffer({ order, item: resolvedItem, lang: "en" });
      pdfBuffer = generated.buffer;
      finalFileName = generated.fileName;
    } else {
      // VERSION ORIGINALE (FRANÇAIS)
      let pdfUrl = order.item_pdf_url || resolvedItem.pdf_url;

      // 1. Si le PDF est une URL distante (Supabase Storage / CDN)
      if (pdfUrl && (pdfUrl.startsWith("http://") || pdfUrl.startsWith("https://"))) {
        try {
          const remoteRes = await fetch(pdfUrl);
          if (remoteRes.ok) {
            const ab = await remoteRes.arrayBuffer();
            pdfBuffer = Buffer.from(ab);
          }
        } catch (e) {
          console.warn("Téléchargement du fichier distant échoué, essai en local");
        }
      }

      // 2. Si le PDF est un chemin local (ex: /uploads/...)
      if (!pdfBuffer && pdfUrl && !pdfUrl.startsWith("http")) {
        try {
          const relative = pdfUrl.replace(/^\/+/, "");
          const filePath = path.join(process.cwd(), "public", relative);
          pdfBuffer = await fs.readFile(filePath);
        } catch {}
      }

      // 3. Fallback sur un document PDF réel existant sur le serveur
      if (!pdfBuffer) {
        const candidates = [
          path.join(process.cwd(), "public", "documents", "cours.pdf"),
          path.join(process.cwd(), "public", "uploads", "courses", "default-cours.pdf"),
        ];
        for (const p of candidates) {
          try {
            pdfBuffer = await fs.readFile(p);
            if (pdfBuffer) break;
          } catch {}
        }
      }

      // 4. Génération certifiée HAS si aucun fichier brut
      if (!pdfBuffer) {
        const generated = await generateOfficialPdfBuffer({ order, item: resolvedItem, lang: "fr" });
        pdfBuffer = generated.buffer;
        finalFileName = generated.fileName;
      }
    }

    if (!finalFileName) {
      const safeTitle = (order.item_title || "Fascicule-HAS")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "_")
        .substring(0, 70);
      finalFileName = `${safeTitle}.pdf`;
    }

    // Incrémenter le compteur de téléchargements
    try {
      const supabase = createAdminClient();
      await supabase
        .from("marketplace_orders")
        .update({ download_count: (order.download_count || 0) + 1 })
        .eq("id", order.id);
    } catch {}

    // RETOUR D'UN VRAI TÉLÉCHARGEMENT DIRECT ATTACHMENT
    return new NextResponse(new Uint8Array(pdfBuffer!), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${finalFileName}"; filename*=UTF-8''${encodeURIComponent(finalFileName)}`,
        "Content-Length": pdfBuffer!.length.toString(),
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Erreur lors du traitement du téléchargement" }, { status: 500 });
  }
}
