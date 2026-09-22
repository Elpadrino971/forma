import { faq } from "@/content/site";
import { Section, SectionHeading } from "./ui";

export function Faq() {
  return (
    <Section id="faq" className="border-y border-white/5 bg-white/[0.02]">
      <SectionHeading eyebrow="FAQ" title={faq.title} />

      <div className="mx-auto mt-14 max-w-3xl space-y-3">
        {faq.items.map((item) => (
          <details
            key={item.q}
            className="group rounded-xl border border-white/10 bg-ink-900/60 px-6 open:border-white/20"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-medium text-white [&::-webkit-details-marker]:hidden">
              <span>{item.q}</span>
              <svg
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
                className="size-5 shrink-0 text-ink-400 transition-transform group-open:rotate-180"
              >
                <path
                  fillRule="evenodd"
                  d="M5.3 7.3a1 1 0 0 1 1.4 0L10 10.6l3.3-3.3a1 1 0 1 1 1.4 1.4l-4 4a1 1 0 0 1-1.4 0l-4-4a1 1 0 0 1 0-1.4Z"
                  clipRule="evenodd"
                />
              </svg>
            </summary>
            <p className="border-t border-white/10 py-5 leading-relaxed text-ink-300">{item.a}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}

/** Donnees structurees FAQ, pour l'affichage enrichi dans Google. */
export function FaqJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
