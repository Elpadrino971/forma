/**
 * Source unique de verite du site.
 * Tout le texte commercial se modifie ICI, sans toucher aux composants.
 *
 * ATTENTION - avant la mise en ligne, remplace tout ce qui est marque
 * [A REMPLACER] par tes vraies donnees. Publier de faux temoignages ou de
 * faux chiffres de resultats est interdit (art. L121-2 du Code de la
 * consommation, pratiques commerciales trompeuses) et te ferait bannir de
 * Stripe.
 */

export const site = {
  name: "Forma",
  tagline: "Lance ta boutique e-commerce rentable en 90 jours",
  // [A REMPLACER] : ton domaine reel
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  // [A REMPLACER] : ton email de support reel
  supportEmail: "contact@forma-ecommerce.fr",
  // [A REMPLACER] : identite du vendeur (obligatoire, mentions legales)
  legal: {
    company: "[A REMPLACER] Nom de la societe ou Prenom Nom",
    status: "[A REMPLACER] SASU / EI / auto-entrepreneur",
    siret: "[A REMPLACER] 000 000 000 00000",
    address: "[A REMPLACER] 1 rue de l'Exemple, 75001 Paris",
    host: "Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA",
  },
} as const;

/* -------------------------------------------------------------------------- */
/*  HERO                                                                      */
/* -------------------------------------------------------------------------- */

export const hero = {
  badge: "Formation 100% en ligne · Accès à vie",
  title: "Lance une boutique e-commerce rentable",
  titleAccent: "en 90 jours",
  subtitle:
    "La méthode complète pour trouver un produit qui se vend, monter ta boutique et acquérir tes premiers clients — sans stock, sans agence, sans budget publicitaire à cinq chiffres.",
  bullets: [
    "42 leçons vidéo, de l'étude de marché à la première vente",
    "Les templates, scripts pub et tableurs que j'utilise réellement",
    "Accès à vie, mises à jour comprises",
  ],
  primaryCta: "Voir les formules",
  secondaryCta: "Découvrir le programme",
};

/* -------------------------------------------------------------------------- */
/*  PROBLEME / PROMESSE                                                       */
/* -------------------------------------------------------------------------- */

export const pains = {
  title: "Si tu te reconnais là-dedans, tu es au bon endroit",
  subtitle:
    "La plupart des boutiques ne meurent pas d'un manque de motivation. Elles meurent de quatre erreurs qui se répètent.",
  items: [
    {
      problem: "Tu passes des semaines à chercher LE produit",
      solution:
        "Une grille de sélection en 12 critères et 3 sources de données gratuites pour trancher en 48 h au lieu de 6 semaines.",
    },
    {
      problem: "Ta boutique est jolie mais ne convertit pas",
      solution:
        "La structure de fiche produit et de page d'accueil qui tient la route, section par section, avec les mots exacts à écrire.",
    },
    {
      problem: "Tu brûles ton budget pub sans comprendre pourquoi",
      solution:
        "La méthode de test à petit budget : combien mettre, combien de temps, et le seuil chiffré à partir duquel on coupe.",
    },
    {
      problem: "Tu n'as aucune idée de ce que tu gagnes vraiment",
      solution:
        "Le tableur de marge complet — coût produit, frais, retours, pub — pour savoir à l'euro près si tu gagnes de l'argent.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  PROGRAMME                                                                 */
/* -------------------------------------------------------------------------- */

export const curriculum = {
  title: "Le programme complet",
  subtitle: "6 modules, 42 leçons, environ 11 h de vidéo. Chaque module se termine par un livrable concret.",
  modules: [
    {
      number: "01",
      title: "Trouver un produit qui se vend",
      duration: "1 h 40 · 8 leçons",
      lessons: [
        "Les 3 modèles rentables en 2026 : niche, marque, arbitrage",
        "La grille de sélection produit en 12 critères",
        "Valider la demande avec des données gratuites",
        "Analyser la concurrence sans y passer la semaine",
        "Calculer ta marge AVANT de commander",
        "Les 7 catégories de produits à éviter",
        "Sourcing : fournisseurs, MOQ, échantillons",
        "Livrable : ta short-list de 3 produits validés",
      ],
    },
    {
      number: "02",
      title: "Monter la boutique",
      duration: "2 h 05 · 7 leçons",
      lessons: [
        "Shopify ou WooCommerce : le choix selon ton cas",
        "Configuration complète, pas à pas",
        "L'anatomie d'une page d'accueil qui convertit",
        "La fiche produit, section par section",
        "Photos et visuels sans studio ni budget",
        "Paiement, livraison, taxes : la config qui évite les litiges",
        "Livrable : ta boutique en ligne, prête à encaisser",
      ],
    },
    {
      number: "03",
      title: "Les premiers clients",
      duration: "2 h 20 · 8 leçons",
      lessons: [
        "Le plan d'acquisition des 30 premiers jours",
        "Meta Ads : structure de campagne pour petit budget",
        "TikTok organique : le format qui marche encore",
        "Écrire une annonce qui fait cliquer",
        "Le budget de test et le seuil de coupure",
        "Lire ses chiffres sans se raconter d'histoires",
        "Influence micro-budget : trouver, briefer, négocier",
        "Livrable : ta première campagne en ligne",
      ],
    },
    {
      number: "04",
      title: "Convertir plus",
      duration: "1 h 45 · 7 leçons",
      lessons: [
        "Les 9 points de friction qui tuent un panier",
        "Relance de panier abandonné : 3 emails qui récupèrent",
        "Preuve sociale : avis, UGC, garanties",
        "Augmenter le panier moyen : bundles et upsells",
        "L'email marketing qui rapporte vraiment",
        "Tester une page sans se tromper de conclusion",
        "Livrable : ton plan d'optimisation chiffré",
      ],
    },
    {
      number: "05",
      title: "Logistique et service client",
      duration: "1 h 30 · 6 leçons",
      lessons: [
        "Expédier : prestataires, tarifs, délais",
        "Retours et remboursements : ta politique claire",
        "Les modèles de réponse aux 12 messages les plus fréquents",
        "Limiter les litiges et les impayés",
        "Automatiser sans perdre la relation client",
        "Livrable : tes process écrits, prêts à déléguer",
      ],
    },
    {
      number: "06",
      title: "Structurer et passer à l'échelle",
      duration: "1 h 40 · 6 leçons",
      lessons: [
        "Statut juridique, TVA, obligations françaises",
        "Ta comptabilité en 30 minutes par mois",
        "Le tableau de bord : les 6 chiffres à suivre",
        "Recruter ta première aide (freelance, VA)",
        "Quand et comment augmenter les budgets",
        "Livrable : ton plan des 6 prochains mois",
      ],
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  POUR QUI                                                                  */
/* -------------------------------------------------------------------------- */

export const audience = {
  title: "Pour qui — et pour qui pas",
  forYou: {
    title: "C'est pour toi si",
    items: [
      "Tu pars de zéro ou ta boutique ne décolle pas",
      "Tu peux y consacrer 5 à 8 h par semaine",
      "Tu as un budget de départ de 500 € minimum (stock + pub)",
      "Tu veux une méthode à appliquer, pas de la théorie",
      "Tu es prêt à te tromper vite pour corriger vite",
    ],
  },
  notForYou: {
    title: "Ce n'est pas pour toi si",
    items: [
      "Tu cherches un revenu passif sans travailler",
      "Tu veux des résultats garantis en 7 jours",
      "Tu n'as aucun budget à investir dans ton projet",
      "Tu fais déjà plus de 50 k€ de CA par mois",
      "Tu attends qu'on monte la boutique à ta place",
    ],
  },
};

/* -------------------------------------------------------------------------- */
/*  FORMATEUR  — [A REMPLACER] integralement par ta vraie bio                 */
/* -------------------------------------------------------------------------- */

export const instructor = {
  title: "Qui te forme",
  name: "[A REMPLACER] Prénom Nom",
  role: "[A REMPLACER] Fondateur de …",
  bio: [
    "[A REMPLACER] Deux ou trois phrases sur ton parcours réel : ce que tu as lancé, sur combien de temps, ce que tu as raté avant que ça marche.",
    "[A REMPLACER] Pourquoi tu enseignes ça, et ce qui rend ta méthode différente de ce qu'on trouve gratuitement.",
  ],
  // N'affiche que des chiffres verifiables. Supprime cette liste si tu n'en as pas.
  stats: [
    { value: "[A REMPLACER]", label: "années d'expérience" },
    { value: "[A REMPLACER]", label: "boutiques lancées" },
    { value: "[A REMPLACER]", label: "élèves formés" },
  ],
};

/* -------------------------------------------------------------------------- */
/*  TEMOIGNAGES                                                               */
/*  Laisse ce tableau VIDE tant que tu n'as pas de vrais temoignages ecrits.  */
/*  La section disparait automatiquement si le tableau est vide.              */
/* -------------------------------------------------------------------------- */

export const testimonials: {
  quote: string;
  name: string;
  role: string;
}[] = [
  // Exemple de format une fois que tu auras de vrais retours, avec accord ecrit :
  // { quote: "…", name: "Prénom N.", role: "Boutique déco, Lyon" },
];

/* -------------------------------------------------------------------------- */
/*  OFFRES                                                                    */
/*  Les montants font foi cote serveur (src/lib/plans.ts les relit).          */
/* -------------------------------------------------------------------------- */

export const pricing = {
  title: "Choisis ta formule",
  subtitle: "Paiement unique, accès à vie. Pas d'abonnement, pas de reconduction.",
  note: "Prix TTC. Paiement sécurisé par Stripe. Accès immédiat après paiement.",
};

/* -------------------------------------------------------------------------- */
/*  GARANTIE                                                                  */
/* -------------------------------------------------------------------------- */

export const guarantee = {
  title: "Garantie 14 jours, sans justification",
  body:
    "Tu as 14 jours après l'achat pour demander un remboursement intégral par simple email, sans avoir à te justifier. C'est ton droit de rétractation légal, et nous ne le contournons pas : l'accès reste ouvert pendant ce délai.",
  cta: "Écrire à " + site.supportEmail,
};

/* -------------------------------------------------------------------------- */
/*  FAQ                                                                       */
/* -------------------------------------------------------------------------- */

export const faq = {
  title: "Questions fréquentes",
  items: [
    {
      q: "Combien de temps faut-il y consacrer ?",
      a: "Compte 5 à 8 h par semaine pour suivre le rythme des 90 jours. Les leçons font 10 à 20 minutes et l'accès est à vie : tu peux aussi aller plus lentement.",
    },
    {
      q: "Quel budget prévoir en plus de la formation ?",
      a: "Prévois au minimum 500 € : environ 30 €/mois pour la boutique, 150 à 300 € de premier stock ou d'échantillons, et 200 € de budget de test publicitaire. Ce n'est pas un business à zéro euro et la formation ne le présente pas comme tel.",
    },
    {
      q: "Je pars vraiment de zéro, c'est jouable ?",
      a: "Oui. Le module 1 ne suppose aucune connaissance préalable. Chaque manipulation technique est filmée à l'écran, pas à pas.",
    },
    {
      q: "Vous garantissez des résultats ?",
      a: "Non, et méfie-toi de ceux qui le font. La formation te donne une méthode et des outils ; le résultat dépend de ton marché, de ton budget et de ton exécution. Ce que nous garantissons, c'est le remboursement sous 14 jours si le contenu ne te convient pas.",
    },
    {
      q: "L'accès expire-t-il ?",
      a: "Non. Achat unique, accès à vie, mises à jour du contenu incluses sans supplément.",
    },
    {
      q: "Le paiement est-il sécurisé ?",
      a: "Oui. Le paiement passe par Stripe : aucune donnée de carte ne transite par nos serveurs ni n'y est stockée.",
    },
    {
      q: "Puis-je payer en plusieurs fois ?",
      a: "Oui sur les formules Accélérateur et Élite, en 3 fois sans frais via Stripe, selon éligibilité.",
    },
    {
      q: "Est-ce finançable par le CPF ou un OPCO ?",
      a: "[A REMPLACER] Réponds honnêtement : le CPF suppose une certification Qualiopi. Si tu n'es pas certifié, écris-le clairement plutôt que de laisser planer un doute.",
    },
  ],
};

/* -------------------------------------------------------------------------- */
/*  CTA FINAL                                                                 */
/* -------------------------------------------------------------------------- */

export const finalCta = {
  title: "Ta boutique ne se lancera pas toute seule",
  body:
    "Tu peux continuer à collectionner les vidéos YouTube gratuites, ou suivre une méthode complète et t'y tenir 90 jours. Garantie 14 jours : le seul risque, c'est de ne pas essayer.",
  cta: "Rejoindre la formation",
};
