import { formatPrice, plans } from "@/lib/plans";

/**
 * Barre d'achat fixe en bas d'ecran, sur mobile uniquement.
 * `pb-safe` evite que la barre passe sous la zone gestuelle des iPhone.
 */
export function StickyCta() {
  const featured = plans.find((plan) => plan.highlight) ?? plans[0];

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink-950/95 px-4 py-3 backdrop-blur-md md:hidden">
      <div
        className="flex items-center gap-4"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-white">
            Formule {featured.name}
          </p>
          <p className="text-sm text-ink-400">{formatPrice(featured.amount)} · accès à vie</p>
        </div>
        <a
          href="#offres"
          className="shrink-0 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-ink-950"
        >
          Rejoindre
        </a>
      </div>
    </div>
  );
}
