import { hero } from "@/content/site";
import { Check } from "./ui";

export function Hero() {
  return (
    <div id="top" className="hero-glow relative overflow-hidden border-b border-white/5">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-sm font-medium text-brand-300">
            {hero.badge}
          </p>

          <h1 className="mt-6 text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-6xl">
            {hero.title}{" "}
            <span className="text-brand-500">{hero.titleAccent}</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-ink-300 sm:text-xl">
            {hero.subtitle}
          </p>

          <ul className="mx-auto mt-8 flex max-w-xl flex-col gap-3 text-left">
            {hero.bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-3 text-ink-200">
                <Check className="mt-0.5 text-brand-500" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="#offres"
              className="w-full rounded-xl bg-brand-500 px-7 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-400 sm:w-auto"
            >
              {hero.primaryCta}
            </a>
            <a
              href="#programme"
              className="w-full rounded-xl border border-white/15 px-7 py-4 text-base font-semibold text-white transition-colors hover:bg-white/5 sm:w-auto"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <p className="mt-6 text-sm text-ink-400">
            Paiement unique · Accès à vie · Garantie 14 jours
          </p>
        </div>
      </div>
    </div>
  );
}
