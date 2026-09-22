import { pricing } from "@/content/site";
import { formatPrice, plans } from "@/lib/plans";
import { CheckoutButton } from "./CheckoutButton";
import { Check, Section, SectionHeading } from "./ui";

export function Pricing() {
  return (
    <Section id="offres">
      <SectionHeading eyebrow="Tarifs" title={pricing.title} subtitle={pricing.subtitle} />

      <div className="mt-14 grid items-start gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={
              plan.highlight
                ? "relative rounded-2xl border-2 border-brand-500 bg-brand-500/[0.06] p-8 lg:-mt-4 lg:pb-10"
                : "relative rounded-2xl border border-white/10 bg-white/[0.03] p-8"
            }
          >
            {plan.badge ? (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-500 px-4 py-1 text-xs font-bold uppercase tracking-wide text-ink-950">
                {plan.badge}
              </span>
            ) : null}

            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
            <p className="mt-2 min-h-[2.5rem] text-sm leading-relaxed text-ink-400">
              {plan.tagline}
            </p>

            <p className="mt-6 flex items-baseline gap-3">
              <span className="text-4xl font-bold tracking-tight text-white">
                {formatPrice(plan.amount)}
              </span>
              {plan.compareAt ? (
                <span className="text-lg text-ink-500 line-through">
                  {formatPrice(plan.compareAt)}
                </span>
              ) : null}
            </p>
            <p className="mt-1 text-sm text-ink-400">
              {plan.installments
                ? `paiement unique ou 3 × ${formatPrice(Math.round(plan.amount / 3))}`
                : "paiement unique"}
            </p>

            <div className="mt-7">
              <CheckoutButton planId={plan.id} label={plan.cta} highlight={plan.highlight} />
            </div>

            <ul className="mt-8 space-y-3 border-t border-white/10 pt-7">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm text-ink-200">
                  <Check className="mt-0.5 text-brand-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-ink-400">{pricing.note}</p>
    </Section>
  );
}
