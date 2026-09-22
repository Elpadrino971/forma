import { guarantee, site } from "@/content/site";
import { Section } from "./ui";

export function Guarantee() {
  return (
    <Section>
      <div className="mx-auto max-w-3xl rounded-2xl border border-brand-500/25 bg-brand-500/[0.06] p-8 text-center sm:p-12">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
          className="mx-auto size-12 text-brand-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12c0 4.97-3.58 9.15-8.29 9.93a1.5 1.5 0 0 1-.42 0C7.58 21.15 4 16.97 4 12V6.3c0-.6.36-1.15.92-1.38l6.5-2.7c.37-.15.79-.15 1.16 0l6.5 2.7c.56.23.92.78.92 1.38V12Z"
          />
        </svg>

        <h2 className="mt-5 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {guarantee.title}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-ink-300">
          {guarantee.body}
        </p>
        <a
          href={`mailto:${site.supportEmail}`}
          className="mt-6 inline-block text-sm font-semibold text-brand-400 underline underline-offset-4 hover:text-brand-300"
        >
          {guarantee.cta}
        </a>
      </div>
    </Section>
  );
}
