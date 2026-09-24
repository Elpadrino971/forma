# Forma — site de vente de formation e-commerce

Landing page orientée conversion + paiement Stripe pour vendre une formation en ligne.
Next.js 16 · React 19 · Tailwind 4 · Stripe Checkout.

## Démarrer en local

```bash
npm install
cp .env.example .env.local   # puis renseigne STRIPE_SECRET_KEY
npm run dev                  # http://localhost:3000
```

Pour recevoir les webhooks en local :

```bash
stripe listen --forward-to localhost:3000/api/webhook
# copie le whsec_... affiché dans STRIPE_WEBHOOK_SECRET
```

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Tout le texte (hero, programme, FAQ, garantie, formateur…) | `src/content/site.ts` |
| Les formules et les **prix** | `src/lib/plans.ts` (les montants font foi côté serveur) |
| Couleurs, police | `src/app/globals.css` (bloc `@theme`) |
| Ce qui se passe après un paiement (envoi des accès) | `src/app/api/webhook/route.ts` |

## Checklist avant mise en ligne

Le site est fonctionnel mais **volontairement incomplet** sur les points qui doivent être vrais :

- [ ] Remplacer tous les `[A REMPLACER]` dans `src/content/site.ts` (bio, stats, SIRET, adresse…)
- [ ] Remplacer l'email de support `contact@forma-ecommerce.fr`
- [ ] Ajouter une vraie photo dans `src/components/Instructor.tsx`
- [ ] Témoignages : ne remplir `testimonials` qu'avec de vrais retours, avec accord écrit. Tant que le tableau est vide, la section n'apparaît pas — c'est voulu.
- [ ] Répondre honnêtement à la question CPF dans la FAQ
- [ ] Faire relire les CGV (`src/app/cgv/page.tsx`) par un juriste ; ajouter le médiateur de la consommation
- [ ] Brancher la livraison des accès dans le webhook (`TODO` dans le fichier)
- [ ] Créer le webhook sur le dashboard Stripe → `https://ton-domaine/api/webhook`, événement `checkout.session.completed`
- [ ] Activer Klarna/paiement en 3× sur Stripe si tu affiches le 3× sans frais
- [ ] Passer `STRIPE_SECRET_KEY` en clé live et `NEXT_PUBLIC_SITE_URL` sur le vrai domaine

## Déployer (Vercel)

1. Importer le repo sur vercel.com
2. Ajouter les 3 variables de `.env.example` dans Settings → Environment Variables
3. Déployer. Le build tourne sans clé Stripe ; la clé n'est lue qu'au moment d'un paiement.

## Sécurité

- Le navigateur n'envoie jamais de prix, seulement un identifiant de formule validé côté serveur.
- L'accès à la formation ne doit être ouvert **que** par le webhook (signature vérifiée), jamais par la page `/merci`, qui est publique.
- Aucune donnée bancaire ne transite par ce serveur.

## Défi 90 jours (`/defi`)

App perso « disparais 90 jours, reviens méconnaissable » : chaque jour une séance de sport, un
exercice d'éloquence et un travail de clarté mentale (journal, respiration, modèle mental de la
semaine), qui montent en intensité sur 3 phases de 30 jours.

- **Programme** : tout le contenu est dans `src/content/defi.ts` (séances, sujets d'impro, questions
  du journal, règles quotidiennes).
- **Alarmes** : onglet « Alarmes ». Le fichier `.ics` ajoute 3 rappels/jour dans le calendrier du
  téléphone (fiable, même écran verrouillé). L'alarme dans l'app (son + notification) ne sonne que
  si l'app est ouverte.
- **Données** : stockées uniquement dans le navigateur (localStorage), export/import JSON possible.
- Installable sur l'écran d'accueil (`public/defi.webmanifest`), non indexée par les moteurs.
