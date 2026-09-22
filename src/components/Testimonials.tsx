import { testimonials } from "@/content/site";
import { Section, SectionHeading } from "./ui";

export function Testimonials() {
  // Pas de temoignages renseignes : la section ne s'affiche pas.
  // Ne remplis JAMAIS ce tableau avec des avis inventes.
  if (testimonials.length === 0) return null;

  return (
    <Section id="temoignages">
      <SectionHeading eyebrow="Retours d'élèves" title="Ce qu'en disent ceux qui l'ont suivie" />

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <figure
            key={testimonial.name}
            className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-7"
          >
            <blockquote className="flex-1 leading-relaxed text-ink-200">
              « {testimonial.quote} »
            </blockquote>
            <figcaption className="mt-6 border-t border-white/10 pt-4">
              <span className="block font-semibold text-white">{testimonial.name}</span>
              <span className="mt-0.5 block text-sm text-ink-400">{testimonial.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
