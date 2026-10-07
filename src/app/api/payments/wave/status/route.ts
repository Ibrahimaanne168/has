import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/service-role";
import { getWaveCheckoutSession } from "@/lib/wave/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get("order_id");
    const ref = searchParams.get("ref");
    const checkoutId = searchParams.get("checkout_id");

    if (!orderId && !ref && !checkoutId) {
      return NextResponse.json(
        { error: "Paramètre requis : order_id, ref ou checkout_id" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createAdminClient();

    let query = supabaseAdmin.from("orders").select("*");
    if (orderId) {
      query = query.eq("id", orderId);
    } else if (ref) {
      query = query.eq("client_reference", ref);
    } else if (checkoutId) {
      query = query.eq("wave_checkout_id", checkoutId);
    }

    const { data: order, error } = await query.maybeSingle();

    if (error) {
      console.error("[WAVE-STATUS-DB-ERROR]", error);
      return NextResponse.json({ error: "Erreur base de données" }, { status: 500 });
    }

    if (!order) {
      return NextResponse.json(
        { error: "Commande introuvable", status: "not_found" },
        { status: 404 }
      );
    }

    // Si la commande est déjà payée, renvoyer directement le statut
    if (order.payment_status === "paid") {
      return NextResponse.json({
        success: true,
        status: "paid",
        paid_at: order.paid_at,
        order: {
          id: order.id,
          client_reference: order.client_reference,
          amount: order.amount,
          currency: order.currency,
          matricule: order.matricule,
          full_name: order.full_name,
          filiere: order.filiere,
        },
      });
    }

    // Réconciliation de secours : si la commande est encore "pending", interroger l'API Wave
    if (order.wave_checkout_id && order.payment_status === "pending") {
      const waveSession = await getWaveCheckoutSession(order.wave_checkout_id);
      if (waveSession && waveSession.checkout_status === "complete") {
        const nowIso = new Date().toISOString();
        // Mettre à jour la commande
        await supabaseAdmin
          .from("orders")
          .update({
            payment_status: "paid",
            wave_transaction_id: waveSession.transaction_id || null,
            paid_at: nowIso,
            updated_at: nowIso,
          })
          .eq("id", order.id);

        // Activer l'étudiant
        const profileUpdates = {
          has_paid: true,
          is_active: true,
          payment_status: "paid",
          order_id: order.id,
          updated_at: nowIso,
        };

        if (order.user_id) {
          await supabaseAdmin.from("profiles").update(profileUpdates).eq("id", order.user_id);
        } else if (order.email) {
          await supabaseAdmin
            .from("profiles")
            .update(profileUpdates)
            .eq("email", order.email.toLowerCase().trim());
        }

        return NextResponse.json({
          success: true,
          status: "paid",
          paid_at: nowIso,
          order: {
            id: order.id,
            client_reference: order.client_reference,
            amount: order.amount,
            currency: order.currency,
            matricule: order.matricule,
            full_name: order.full_name,
            filiere: order.filiere,
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      status: order.payment_status,
      order: {
        id: order.id,
        client_reference: order.client_reference,
        amount: order.amount,
        currency: order.currency,
        matricule: order.matricule,
        full_name: order.full_name,
        filiere: order.filiere,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Erreur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
