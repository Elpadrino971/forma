import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Merci pour ta commande",
  robots: { index: false, follow: false },
};

/**
 * Page de confirmation.
 *
 * Elle est purement informative : l'acces a la formation est ouvert par le
 * webhook Stripe, jamais ici. Cette URL peut etre ouverte par n'importe qui.
 */
export default function ThankYouPage() {
  return (
    <main className="hero-glow grid min-h-dvh place-items-center px-4 py-20">
      <div className="mx-auto w-full max-w-lg text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
          className="mx-auto size-16 text-brand-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Paiement confirmé
        </h1>
        <p className="mt-4 leading-relaxed text-ink-300">
          Merci. Tu vas recevoir un email avec tes accès d&apos;ici quelques minutes. Pense à
          vérifier tes spams — c&apos;est là qu&apos;il atterrit une fois sur dix.
        </p>

        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-6 text-left">
          <p className="font-semibold text-white">Rien reçu après 15 minutes&nbsp;?</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-300">
            Écris à{" "}
            <a
              href={`mailto:${site.supportEmail}`}
              className="text-brand-400 underline underline-offset-4"
            >
              {site.supportEmail}
            </a>{" "}
            avec l&apos;adresse utilisée au paiement, on débloque ça tout de suite.
          </p>
        </div>

        <a
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-ink-400 transition-colors hover:text-white"
        >
          ← Retour à l&apos;accueil
        </a>
      </div>
    </main>
  );
}
