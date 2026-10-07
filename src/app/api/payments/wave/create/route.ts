import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import {
  createWaveCheckoutSession,
  getInscriptionFeeAmount,
  getWaveCurrency,
} from "@/lib/wave/client";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      orderId,
      userId,
      email,
      fullName,
      matricule,
      filiere,
      niveau,
      clientReference: requestedRef,
    } = body;

    // 1. Validation minimale : un email ou userId est requis
    if (!email && !userId) {
      return NextResponse.json(
        { error: "Email ou identifiant utilisateur manquant pour le paiement." },
        { status: 400 }
      );
    }

    const cleanEmail = (email || "").toLowerCase().trim();
    const supabaseAdmin = createAdminClient();

    // 2. Montant fixé STRICTEMENT côté serveur (Ne jamais accepter le montant du frontend)
    const officialAmount = getInscriptionFeeAmount();
    const officialCurrency = getWaveCurrency();

    let existingOrder: {
      id: string;
      client_reference: string;
      payment_status: string;
      amount: number;
      wave_launch_url?: string | null;
    } | null = null;

    // 3. Recherche d'une commande existante si orderId ou clientReference fourni
    if (orderId) {
      const { data } = await supabaseAdmin
        .from("orders")
        .select("id, client_reference, payment_status, amount, wave_launch_url")
        .eq("id", orderId)
        .maybeSingle();
      if (data) existingOrder = data;
    } else if (requestedRef) {
      const { data } = await supabaseAdmin
        .from("orders")
        .select("id, client_reference, payment_status, amount, wave_launch_url")
        .eq("client_reference", requestedRef)
        .maybeSingle();
      if (data) existingOrder = data;
    } else if (cleanEmail) {
      // Vérifier si une commande en cours existe pour cet email
      const { data } = await supabaseAdmin
        .from("orders")
        .select("id, client_reference, payment_status, amount, wave_launch_url")
        .eq("email", cleanEmail)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (data && data.payment_status === "paid") {
        existingOrder = data;
      }
    }

    // 4. Vérifier si la commande est déjà payée
    if (existingOrder && existingOrder.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        alreadyPaid: true,
        message: "Cette inscription a déjà été confirmée et payée.",
        order_id: existingOrder.id,
        client_reference: existingOrder.client_reference,
      });
    }

    // 5. Générer une référence unique de commande
    const clientReference =
      existingOrder?.client_reference ||
      `HAS-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}-${Math.floor(
        1000 + Math.random() * 9000
      )}`;

    // 6. Créer la session Checkout Wave via l'API officielle
    const waveSession = await createWaveCheckoutSession({
      amount: officialAmount,
      clientReference,
    });

    // 7. Enregistrer ou mettre à jour la commande en base de données Supabase
    const orderPayload = {
      email: cleanEmail,
      user_id: userId || null,
      full_name: fullName || null,
      matricule: matricule || null,
      filiere: filiere || "MPI",
      niveau: niveau || "L1",
      description: "Frais d'inscription académique HAS (Année 2026-2027)",
      amount: officialAmount,
      currency: officialCurrency,
      payment_method: "wave",
      payment_status: "pending",
      client_reference: clientReference,
      wave_checkout_id: waveSession.id,
      wave_launch_url: waveSession.wave_launch_url,
      updated_at: new Date().toISOString(),
    };

    let savedOrderId = existingOrder?.id;

    if (savedOrderId) {
      await supabaseAdmin.from("orders").update(orderPayload).eq("id", savedOrderId);
    } else {
      const { data: newOrder, error: insertError } = await supabaseAdmin
        .from("orders")
        .insert(orderPayload)
        .select("id")
        .maybeSingle();

      if (insertError) {
        console.warn("[ORDERS-INSERT-FALLBACK]", insertError.message);
      }
      if (newOrder?.id) savedOrderId = newOrder.id;
    }

    // Si userId est fourni, lier la commande au profil
    if (userId && savedOrderId) {
      await supabaseAdmin
        .from("profiles")
        .update({
          order_id: savedOrderId,
          payment_status: "pending",
        })
        .eq("id", userId);
    }

    // 8. Retourner l'URL de paiement au frontend (ne jamais exposer les clés secrètes)
    return NextResponse.json({
      success: true,
      wave_launch_url: waveSession.wave_launch_url,
      wave_checkout_id: waveSession.id,
      order_id: savedOrderId || clientReference,
      client_reference: clientReference,
      amount: officialAmount,
      currency: officialCurrency,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur de création de paiement";
    console.error("[WAVE-CREATE-ERROR]", msg);
    return NextResponse.json(
      { error: `Impossible d'initialiser le paiement Wave: ${msg}` },
      { status: 500 }
    );
  }
}
