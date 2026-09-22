/**
 * Catalogue des offres.
 *
 * Ce fichier est importe par l'API de checkout : les montants ci-dessous font
 * foi cote serveur. Le navigateur n'envoie JAMAIS de prix, seulement un `id`
 * de formule, qui est valide ici. Ne deplace pas les montants cote client.
 */

export type Plan = {
  id: string;
  name: string;
  /** Montant en centimes. 29700 = 297,00 EUR */
  amount: number;
  currency: "eur";
  tagline: string;
  /** Prix barre affiche, en centimes. `null` pour ne rien barrer. */
  compareAt: number | null;
  features: string[];
  highlight: boolean;
  badge?: string;
  cta: string;
  /** Autorise le paiement en 3x sans frais (Stripe, selon eligibilite). */
  installments: boolean;
};

export const plans: Plan[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    amount: 29700,
    currency: "eur",
    compareAt: null,
    tagline: "La formation complète, en autonomie.",
    features: [
      "Les 6 modules — 42 leçons, ~11 h de vidéo",
      "Les 14 templates et tableurs",
      "Accès à vie + mises à jour",
      "Garantie 14 jours",
    ],
    highlight: false,
    cta: "Commencer",
    installments: false,
  },
  {
    id: "accelerateur",
    name: "Accélérateur",
    amount: 69700,
    currency: "eur",
    compareAt: 89700,
    tagline: "La formation, plus l'accompagnement de groupe.",
    features: [
      "Tout ce qu'inclut Essentiel",
      "Coaching de groupe hebdomadaire (12 semaines)",
      "Communauté privée entre élèves",
      "Revue écrite de ta boutique par l'équipe",
      "Les scripts publicitaires prêts à l'emploi",
      "Paiement en 3× sans frais",
    ],
    highlight: true,
    badge: "Le plus choisi",
    cta: "Rejoindre",
    installments: true,
  },
  {
    id: "elite",
    name: "Élite",
    amount: 199700,
    currency: "eur",
    compareAt: null,
    tagline: "Un accompagnement individuel, sur ton projet.",
    features: [
      "Tout ce qu'inclut Accélérateur",
      "3 sessions individuelles de 60 min",
      "Audit complet de ta boutique, par écrit",
      "Accès direct par messagerie, 90 jours",
      "Paiement en 3× sans frais",
    ],
    highlight: false,
    cta: "Candidater",
    installments: true,
  },
];

export function getPlan(id: string): Plan | undefined {
  return plans.find((p) => p.id === id);
}

/** 29700 -> "297 €" ; 69700 -> "697 €" ; 24900 -> "249,00 €" */
export function formatPrice(amountInCents: number, currency = "EUR"): string {
  const hasCents = amountInCents % 100 !== 0;
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: hasCents ? 2 : 0,
    maximumFractionDigits: hasCents ? 2 : 0,
  }).format(amountInCents / 100);
}
