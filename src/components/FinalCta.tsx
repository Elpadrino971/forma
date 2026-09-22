import { finalCta } from "@/content/site";
import { Section } from "./ui";

export function FinalCta() {
  return (
    <Section className="hero-glow">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {finalCta.title}
        </h2>
        <p className="mt-5 text-pretty text-lg leading-relaxed text-ink-300">{finalCta.body}</p>
        <a
          href="#offres"
          className="mt-9 inline-block rounded-xl bg-brand-500 px-8 py-4 text-base font-semibold text-ink-950 shadow-lg shadow-brand-500/20 transition-colors hover:bg-brand-400"
        >
          {finalCta.cta}
        </a>
      </div>
    </Section>
  );
}
