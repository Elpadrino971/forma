import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Webhook Stripe.
 *
 * C'est ICI, et nulle part ailleurs, qu'on donne acces a la formation : la
 * page /merci peut etre ouverte sans avoir paye, le webhook non — sa signature
 * est verifiee avec STRIPE_WEBHOOK_SECRET.
 *
 * En local :
 *   stripe listen --forward-to localhost:3000/api/webhook
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET manquante");
    return NextResponse.json({ error: "Webhook non configuré." }, { status: 500 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Signature absente." }, { status: 400 });
  }

  // La signature se verifie sur le corps BRUT : ne pas utiliser request.json().
  const payload = await request.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, signature, secret);
  } catch (error) {
    console.error("[webhook] signature invalide:", error);
    return NextResponse.json({ error: "Signature invalide." }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const email = session.customer_details?.email ?? "inconnu";
      const planName = session.metadata?.plan_name ?? "inconnue";

      console.log(`[webhook] paiement confirmé — ${email} — formule ${planName}`);

      // TODO livraison du produit. Branche ici ce que tu utilises :
      //   - creer le compte eleve et envoyer les identifiants
      //   - inscrire l'adresse dans ton outil d'emailing
      //   - ouvrir l'acces sur ta plateforme de cours
      // Garde ce traitement idempotent : Stripe peut rejouer un evenement.
      break;
    }

    case "charge.refunded":
      console.log("[webhook] remboursement — révoquer l'accès correspondant");
      // TODO : couper l'acces de l'eleve.
      break;

    default:
      // Les autres evenements sont acquittes sans traitement.
      break;
  }

  // Toujours repondre 200 rapidement, sinon Stripe rejoue l'evenement.
  return NextResponse.json({ received: true });
}
