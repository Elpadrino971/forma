import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";
import { formatPrice, plans } from "@/lib/plans";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
};

/**
 * MODELE A FAIRE RELIRE.
 * Ce texte couvre les mentions usuelles d'une vente de formation en ligne a
 * des particuliers en France. Fais-le valider par un juriste avant la mise en
 * ligne : une CGV erronee t'expose en cas de litige ou d'impaye.
 */
export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Conditions générales de vente
        </h1>
        <p className="mt-3 text-sm text-ink-400">
          Dernière mise à jour : [A REMPLACER] jj/mm/aaaa
        </p>

        <div className="mt-10 space-y-8 leading-relaxed text-ink-300">
          <section>
            <h2 className="text-xl font-semibold text-white">1. Vendeur</h2>
            <p className="mt-3">
              {site.legal.company}, {site.legal.status}, immatriculée sous le numéro SIRET{" "}
              {site.legal.siret}, dont le siège est situé {site.legal.address}. Contact :{" "}
              {site.supportEmail}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Objet</h2>
            <p className="mt-3">
              Les présentes conditions régissent la vente de la formation en ligne «{" "}
              {site.name} », composée de contenus vidéo, de documents téléchargeables et, selon
              la formule, de séances d&apos;accompagnement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Formules et prix</h2>
            <ul className="mt-3 space-y-2">
              {plans.map((plan) => (
                <li key={plan.id}>
                  <span className="font-medium text-white">{plan.name}</span> —{" "}
                  {formatPrice(plan.amount)} TTC : {plan.tagline}
                </li>
              ))}
            </ul>
            <p className="mt-3">
              Les prix sont indiqués en euros toutes taxes comprises. Le vendeur peut les
              modifier à tout moment ; le prix applicable est celui affiché au moment de la
              commande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. Commande et paiement</h2>
            <p className="mt-3">
              Le paiement s&apos;effectue en ligne via Stripe Payments Europe Ltd. Aucune donnée
              de carte bancaire n&apos;est collectée ni conservée par le vendeur. La commande est
              ferme une fois le paiement autorisé.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Livraison</h2>
            <p className="mt-3">
              Les accès sont transmis par email à l&apos;adresse indiquée lors du paiement, sous
              24 heures ouvrées. L&apos;accès aux contenus est accordé sans limitation de durée,
              sous réserve du maintien du service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Droit de rétractation</h2>
            <p className="mt-3">
              Conformément aux articles L221-18 et suivants du Code de la consommation, le client
              dispose de 14 jours à compter de la commande pour se rétracter, sans avoir à se
              justifier ni à supporter de pénalité. La demande s&apos;effectue par email à{" "}
              {site.supportEmail} et le remboursement intervient sous 14 jours à compter de sa
              réception, par le même moyen de paiement.
            </p>
            <p className="mt-3">
              Le client peut renoncer expressément à ce droit pour bénéficier d&apos;un accès
              immédiat au contenu numérique ; à défaut d&apos;un tel accord exprès, le droit de
              rétractation s&apos;applique pleinement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Propriété intellectuelle</h2>
            <p className="mt-3">
              L&apos;ensemble des contenus reste la propriété exclusive du vendeur. L&apos;accès
              accordé est personnel et non cessible. Toute reproduction, revente ou diffusion,
              même partielle, est interdite et peut entraîner la suspension immédiate de
              l&apos;accès, sans remboursement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Absence de garantie de résultat</h2>
            <p className="mt-3">
              La formation constitue une obligation de moyens et non de résultat. Le vendeur ne
              garantit aucun chiffre d&apos;affaires ni aucun revenu : les résultats d&apos;une
              activité commerciale dépendent du marché, des moyens engagés et du travail fourni
              par le client.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">9. Données personnelles</h2>
            <p className="mt-3">
              Les données collectées servent exclusivement au traitement de la commande et à la
              fourniture du service. Conformément au RGPD, le client dispose d&apos;un droit
              d&apos;accès, de rectification, d&apos;effacement et de portabilité, exerçable à{" "}
              {site.supportEmail}.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">10. Litiges</h2>
            <p className="mt-3">
              Les présentes conditions sont soumises au droit français. En cas de litige, le
              client peut recourir gratuitement à un médiateur de la consommation
              ([A REMPLACER] nom et coordonnées du médiateur) avant toute action judiciaire.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
