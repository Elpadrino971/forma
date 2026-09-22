import { pains } from "@/content/site";
import { Check, Cross, Section, SectionHeading } from "./ui";

export function Pains() {
  return (
    <Section id="probleme">
      <SectionHeading eyebrow="Le constat" title={pains.title} subtitle={pains.subtitle} />

      <div className="mt-14 grid gap-6 sm:grid-cols-2">
        {pains.items.map((item) => (
          <div
            key={item.problem}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
          >
            <p className="flex items-start gap-3 font-semibold text-white">
              <Cross className="mt-0.5 text-red-400" />
              <span>{item.problem}</span>
            </p>
            <p className="mt-4 flex items-start gap-3 leading-relaxed text-ink-300">
              <Check className="mt-0.5 text-brand-500" />
              <span>{item.solution}</span>
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
