import { NextResponse } from "next/server";
import { getPlan } from "@/lib/plans";
import { getStripe, siteUrl } from "@/lib/stripe";

export const runtime = "nodejs";

/**
 * Cree une session Stripe Checkout.
 *
 * Le client n'envoie qu'un identifiant de formule ; le montant est relu dans
 * le catalogue serveur (src/lib/plans.ts). Un prix envoye par le navigateur
 * serait manipulable.
 */
export async function POST(request: Request) {
  let planId: unknown;

  try {
    const body = await request.json();
    planId = body?.planId;
  } catch {
    return NextResponse.json({ error: "Corps de requête invalide." }, { status: 400 });
  }

  if (typeof planId !== "string") {
    return NextResponse.json({ error: "Formule manquante." }, { status: 400 });
  }

  const plan = getPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: "Formule inconnue." }, { status: 404 });
  }

  try {
    const stripe = getStripe();
    const base = siteUrl();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: plan.currency,
            unit_amount: plan.amount,
            product_data: {
              name: `Forma — formule ${plan.name}`,
              description: plan.tagline,
            },
          },
        },
      ],
      // Stripe propose automatiquement les moyens de paiement actives sur le
      // compte (carte, Link, Apple/Google Pay...). Le 3x sans frais passe par
      // les "payment method options" une fois Klarna active sur le dashboard.
      automatic_tax: { enabled: false },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      customer_creation: "always",
      metadata: {
        plan_id: plan.id,
        plan_name: plan.name,
      },
      success_url: `${base}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/#offres`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Stripe n'a pas renvoyé d'URL de paiement." },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    // On journalise le detail cote serveur, on ne le renvoie pas au client :
    // les messages d'erreur Stripe peuvent contenir des informations de compte.
    console.error("[checkout] échec de création de session:", error);
    return NextResponse.json(
      { error: "Le paiement est momentanément indisponible. Réessaie dans un instant." },
      { status: 500 },
    );
  }
}
