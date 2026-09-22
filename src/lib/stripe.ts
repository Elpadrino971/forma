import Stripe from "stripe";

/**
 * Client Stripe, instancie paresseusement.
 *
 * On ne l'instancie pas au chargement du module : sans cela, un `next build`
 * sans STRIPE_SECRET_KEY echouerait alors que la cle n'est necessaire qu'a
 * l'execution d'une requete de paiement.
 */
let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY manquante. Copie .env.example vers .env.local et renseigne ta cle.",
    );
  }

  cached = new Stripe(key);
  return cached;
}

/** URL publique du site, sans slash final. */
export function siteUrl(): string {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return url.replace(/\/+$/, "");
}
