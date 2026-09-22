import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-white/5 px-4 py-12 sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-bold text-white">{site.name}</p>
          <p className="mt-1 text-sm text-ink-400">{site.tagline}</p>
        </div>

        <nav aria-label="Liens légaux" className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <a href="/cgv" className="text-ink-400 transition-colors hover:text-white">
            CGV
          </a>
          <a href="/mentions-legales" className="text-ink-400 transition-colors hover:text-white">
            Mentions légales
          </a>
          <a
            href={`mailto:${site.supportEmail}`}
            className="text-ink-400 transition-colors hover:text-white"
          >
            Contact
          </a>
        </nav>
      </div>

      <p className="mx-auto mt-8 w-full max-w-6xl text-xs leading-relaxed text-ink-500">
        © {new Date().getFullYear()} {site.name}. Cette formation transmet une méthode et des
        outils ; elle ne garantit aucun résultat commercial. Les revenus d&apos;une activité
        e-commerce dépendent du marché, du budget engagé et du travail fourni.
      </p>
    </footer>
  );
}
