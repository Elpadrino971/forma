import { audience } from "@/content/site";
import { Check, Cross, Section, SectionHeading } from "./ui";

export function Audience() {
  return (
    <Section id="pour-qui">
      <SectionHeading eyebrow="Honnêteté" title={audience.title} />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-brand-500/25 bg-brand-500/[0.06] p-7">
          <h3 className="text-xl font-semibold text-white">{audience.forYou.title}</h3>
          <ul className="mt-5 space-y-3">
            {audience.forYou.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-200">
                <Check className="mt-0.5 text-brand-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <h3 className="text-xl font-semibold text-white">{audience.notForYou.title}</h3>
          <ul className="mt-5 space-y-3">
            {audience.notForYou.items.map((item) => (
              <li key={item} className="flex items-start gap-3 text-ink-400">
                <Cross className="mt-0.5 text-ink-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
