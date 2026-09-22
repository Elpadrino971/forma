import { curriculum } from "@/content/site";
import { Check, Section, SectionHeading } from "./ui";

export function Curriculum() {
  return (
    <Section id="programme" className="border-y border-white/5 bg-white/[0.02]">
      <SectionHeading
        eyebrow="Le contenu"
        title={curriculum.title}
        subtitle={curriculum.subtitle}
      />

      <div className="mt-14 space-y-4">
        {curriculum.modules.map((module, index) => (
          <details
            key={module.number}
            open={index === 0}
            className="group rounded-2xl border border-white/10 bg-ink-900/60 open:border-brand-500/30"
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 p-6 [&::-webkit-details-marker]:hidden">
              <span className="font-mono text-sm font-bold text-brand-500">
                {module.number}
              </span>
              <span className="flex-1">
                <span className="block font-semibold text-white">{module.title}</span>
                <span className="mt-1 block text-sm text-ink-400">{module.duration}</span>
              </span>
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

            <ul className="space-y-3 border-t border-white/10 px-6 py-5">
              {module.lessons.map((lesson) => (
                <li key={lesson} className="flex items-start gap-3 text-ink-300">
                  <Check className="mt-0.5 text-brand-500/70" />
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
    </Section>
  );
}
