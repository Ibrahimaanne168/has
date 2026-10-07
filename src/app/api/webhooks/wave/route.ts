import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { verifyWaveWebhookSignature } from "@/lib/wave/client";
import { WaveWebhookEvent } from "@/lib/wave/types";

export async function POST(request: NextRequest) {
  try {
    // 1. Récupération du raw body sous forme de chaîne de caractères (obligatoire pour le HMAC)
    const rawBody = await request.text();
    const signatureHeader = request.headers.get("wave-signature");
    const webhookSecret = process.env.WAVE_WEBHOOK_SECRET;

    // 2. Vérification cryptographique de la signature Wave (si le secret est configuré en prod)
    if (webhookSecret && webhookSecret.trim() !== "") {
      const verification = verifyWaveWebhookSignature({
        rawBody,
        signatureHeader,
        webhookSecret,
      });

      if (!verification.valid) {
        console.warn("[WAVE-WEBHOOK-REJECTED]", verification.reason);
        return NextResponse.json(
          { error: `Signature invalide: ${verification.reason}` },
          { status: 401 }
        );
      }
    } else {
      console.warn(
        "[WAVE-WEBHOOK-WARN] WAVE_WEBHOOK_SECRET non configuré. Validation cryptographique ignorée."
      );
    }

    // 3. Parsing du payload JSON
    let event: WaveWebhookEvent;
    try {
      event = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ error: "Corps de requête JSON malformé" }, { status: 400 });
    }

    const { type, data } = event;
    console.log(`[WAVE-WEBHOOK-EVENT] Type: ${type}, Session ID: ${data?.id}`);

    // Nous traitons les paiements confirmés : type checkout.session.completed
    if (type !== "checkout.session.completed") {
      // Pour les autres types (ex: expired, failed), accuser réception
      return NextResponse.json({ received: true, ignored: true });
    }

    if (!data) {
      return NextResponse.json({ error: "Données d'événement manquantes" }, { status: 400 });
    }

    const clientReference = data.client_reference;
    const waveCheckoutId = data.id;
    const transactionId = data.transaction_id || null;
    const receivedAmount = parseFloat(data.amount);
    const receivedCurrency = (data.currency || "").toUpperCase();

    if (!clientReference && !waveCheckoutId) {
      return NextResponse.json(
        { error: "Référence ou checkout_id manquant dans les données de l'événement" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    // 4. Recherche de la commande dans la base de données
    let query = supabaseAdmin.from("orders").select("*");
    if (clientReference) {
      query = query.eq("client_reference", clientReference);
    } else {
      query = query.eq("wave_checkout_id", waveCheckoutId);
    }

    const { data: order, error: orderError } = await query.maybeSingle();

    if (orderError) {
      console.error("[WAVE-WEBHOOK-DB-ERROR]", orderError);
      return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
    }

    if (!order) {
      console.warn(`[WAVE-WEBHOOK] Commande introuvable pour ref=${clientReference}`);
      return NextResponse.json(
        { error: "Commande introuvable correspondant à la transaction Wave" },
        { status: 404 }
      );
    }

    // 5. Idempotence : Si la commande est déjà marquée comme payée, ne rien refaire
    if (order.payment_status === "paid") {
      console.log(`[WAVE-WEBHOOK-IDEMPOTENT] Commande ${order.id} déjà marquée comme payée.`);
      return NextResponse.json({ received: true, alreadyProcessed: true });
    }

    // 6. Vérification du montant et de la devise
    if (order.amount && Math.abs(order.amount - receivedAmount) > 1) {
      console.error(
        `[WAVE-WEBHOOK-AMOUNT-MISMATCH] Attendu: ${order.amount}, Reçu: ${receivedAmount}`
      );
      return NextResponse.json({ error: "Montant discordant" }, { status: 400 });
    }

    if (order.currency && order.currency !== receivedCurrency) {
      console.error(
        `[WAVE-WEBHOOK-CURRENCY-MISMATCH] Attendu: ${order.currency}, Reçu: ${receivedCurrency}`
      );
      return NextResponse.json({ error: "Devise discordante" }, { status: 400 });
    }

    // 7. Mise à jour de la commande vers "paid"
    const nowIso = new Date().toISOString();
    const { error: updateOrderError } = await supabaseAdmin
      .from("orders")
      .update({
        payment_status: "paid",
        wave_transaction_id: transactionId,
        paid_at: nowIso,
        raw_webhook_data: event,
        updated_at: nowIso,
      })
      .eq("id", order.id);

    if (updateOrderError) {
      console.error("[WAVE-WEBHOOK-UPDATE-ERROR]", updateOrderError);
      return NextResponse.json({ error: "Échec de mise à jour de la commande" }, { status: 500 });
    }

    // 8. Activation automatique de l'accès de l'étudiant
    // « une fois validé l'étudiant peut accéder à son espace à n'importe quel moment »
    if (order.user_id || order.email) {
      const profileUpdates = {
        has_paid: true,
        is_active: true,
        payment_status: "paid",
        order_id: order.id,
        updated_at: nowIso,
      };

      if (order.user_id) {
        await supabaseAdmin
          .from("profiles")
          .update(profileUpdates)
          .eq("id", order.user_id);
      } else if (order.email) {
        await supabaseAdmin
          .from("profiles")
          .update(profileUpdates)
          .eq("email", order.email.toLowerCase().trim());
      }

      // Log d'audit
      try {
        await supabaseAdmin.from("audit_logs").insert({
          user_id: order.user_id || null,
          action: "PAIEMENT_WAVE_VALIDE",
          details: {
            order_id: order.id,
            amount: receivedAmount,
            currency: receivedCurrency,
            transaction_id: transactionId,
            client_reference: clientReference,
          },
          ip_address: request.headers.get("x-forwarded-for") || "wave_webhook",
        });
      } catch {}
    }

    console.log(
      `[WAVE-WEBHOOK-SUCCESS] Commande ${order.id} (${clientReference}) validée avec succès pour ${receivedAmount} ${receivedCurrency}`
    );

    return NextResponse.json({
      received: true,
      success: true,
      order_id: order.id,
      client_reference: clientReference,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur interne webhook";
    console.error("[WAVE-WEBHOOK-FATAL]", msg);
    return NextResponse.json({ error: "Erreur traitement webhook" }, { status: 500 });
  }
}
