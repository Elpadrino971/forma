import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
};

export default function LegalPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Mentions légales
        </h1>

        <div className="mt-10 space-y-8 leading-relaxed text-ink-300">
          <section>
            <h2 className="text-xl font-semibold text-white">Éditeur du site</h2>
            <p className="mt-3">
              {site.legal.company}
              <br />
              {site.legal.status}
              <br />
              SIRET : {site.legal.siret}
              <br />
              {site.legal.address}
              <br />
              Contact : {site.supportEmail}
              <br />
              Directeur de la publication : [A REMPLACER] Prénom Nom
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Hébergement</h2>
            <p className="mt-3">{site.legal.host}</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Paiement</h2>
            <p className="mt-3">
              Les paiements sont traités par Stripe Payments Europe Ltd, 1 Grand Canal Street
              Lower, Dublin 2, Irlande.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">Propriété intellectuelle</h2>
            <p className="mt-3">
              L&apos;ensemble du contenu de ce site est protégé par le droit d&apos;auteur. Toute
              reproduction sans autorisation écrite est interdite.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
