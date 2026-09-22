import { instructor } from "@/content/site";
import { Section } from "./ui";

export function Instructor() {
  return (
    <Section id="formateur" className="border-y border-white/5 bg-white/[0.02]">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_1.3fr]">
        <div className="mx-auto w-full max-w-sm">
          {/* Remplace ce bloc par une vraie photo :
              <img src="/formateur.jpg" alt="" className="rounded-2xl" /> */}
          <div className="grid aspect-square place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-brand-500/20 to-ink-900 text-sm text-ink-400">
            Photo du formateur
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
            {instructor.title}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {instructor.name}
          </h2>
          <p className="mt-2 text-lg text-ink-400">{instructor.role}</p>

          <div className="mt-6 space-y-4 leading-relaxed text-ink-300">
            {instructor.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-white/10 pt-8">
            {instructor.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="block text-2xl font-bold text-white">{stat.value}</span>
                  <span className="mt-1 block text-sm text-ink-400">{stat.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </Section>
  );
}
