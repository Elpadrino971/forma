import { site } from "@/content/site";

const links = [
  { href: "#programme", label: "Programme" },
  { href: "#pour-qui", label: "Pour qui" },
  { href: "#offres", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-bold tracking-tight text-white">
          <span className="grid size-8 place-items-center rounded-lg bg-brand-500 text-ink-950">
            {site.name.charAt(0)}
          </span>
          <span className="text-lg">{site.name}</span>
        </a>

        <nav aria-label="Navigation principale" className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a
          href="#offres"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
        >
          Rejoindre
        </a>
      </div>
    </header>
  );
}
