"use client";

import { useState } from "react";
import { manifesto, phases, pillars, TOTAL_DAYS, type Pillar } from "@/content/defi";
import { toISODate } from "@/lib/defi-store";

const pillarPitch: Record<Pillar, string> = {
  corps: "Une séance par jour, sans matériel, qui monte en intensité toutes les semaines.",
  eloquence: "Improvisation, storytelling, débat, chasse aux « euh ». 10 à 15 min par jour.",
  esprit: "Journal guidé, respiration, un modèle mental par semaine pour penser plus clair.",
};

export function Onboarding({
  onStart,
}: {
  onStart: (args: { startDate: string; why: string; hardcore: boolean }) => void;
}) {
  const [why, setWhy] = useState("");
  const [when, setWhen] = useState<"today" | "tomorrow">("today");
  const [hardcore, setHardcore] = useState(false);
  const [signed, setSigned] = useState(false);

  function start() {
    const d = new Date();
    if (when === "tomorrow") d.setDate(d.getDate() + 1);
    onStart({ startDate: toISODate(d), why: why.trim(), hardcore });
  }

  return (
    <div className="space-y-10">
      <header className="pt-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">Défi contre soi</p>
        <h1 className="mt-3 text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
          Disparais {TOTAL_DAYS} jours.
          <br />
          <span className="text-brand-500">Reviens méconnaissable.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-pretty text-ink-300">
          Corps, éloquence, esprit. Trois missions par jour, un programme qui monte en puissance, des
          alarmes pour ne pas négocier avec toi-même.
        </p>
      </header>

      <ol className="space-y-3">
        {manifesto.map((line, i) => (
          <li key={line} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <span className="font-mono text-brand-500">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-ink-200">{line}</span>
          </li>
        ))}
      </ol>

      <section className="grid gap-3 sm:grid-cols-3">
        {(Object.keys(pillars) as Pillar[]).map((p) => (
          <div key={p} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
            <p className={`font-bold ${pillars[p].color}`}>{pillars[p].label}</p>
            <p className="mt-1 text-sm text-ink-400">{pillarPitch[p]}</p>
          </div>
        ))}
      </section>

      <section className="space-y-2">
        {phases.map((ph) => (
          <div key={ph.name} className="flex gap-4 text-sm">
            <span className="w-20 shrink-0 font-mono text-ink-500">
              J{ph.start}–{ph.end}
            </span>
            <span>
              <span className="font-semibold text-white">{ph.name}.</span>{" "}
              <span className="text-ink-400">{ph.goal}</span>
            </span>
          </div>
        ))}
      </section>

      <section className="space-y-5 rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5">
        <label className="block text-sm text-ink-300">
          <span className="font-semibold text-white">Pourquoi tu fais ça ?</span> Ce texte
          s&apos;affichera les jours où tu voudras abandonner.
          <textarea
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            rows={3}
            placeholder="Parce que je suis fatigué d'être la version moyenne de moi-même…"
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-ink-600 focus:border-brand-500 focus:outline-none"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-semibold text-white">Jour 1</legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {(["today", "tomorrow"] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWhen(w)}
                aria-pressed={when === w}
                className={`rounded-xl border px-4 py-2.5 text-sm font-semibold ${
                  when === w ? "border-brand-500 bg-brand-500/15 text-white" : "border-white/10 text-ink-300"
                }`}
              >
                {w === "today" ? "Aujourd'hui" : "Demain"}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="flex items-start gap-3 text-sm text-ink-300">
          <input
            type="checkbox"
            checked={hardcore}
            onChange={(e) => setHardcore(e.target.checked)}
            className="mt-1 size-4 accent-orange-500"
          />
          <span>
            <span className="font-semibold text-white">Mode hardcore</span> — un jour raté et je
            recommence à J1.
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-ink-300">
          <input
            type="checkbox"
            checked={signed}
            onChange={(e) => setSigned(e.target.checked)}
            className="mt-1 size-4 accent-orange-500"
          />
          <span>
            Je m&apos;engage pour {TOTAL_DAYS} jours. Je ne cherche pas d&apos;excuse, je ne le
            crie pas sur les toits. Je fais.
          </span>
        </label>

        <button
          type="button"
          onClick={start}
          disabled={!signed}
          className="w-full rounded-xl bg-brand-500 px-6 py-3.5 text-base font-semibold text-ink-950 hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Je disparais
        </button>
      </section>

      <p className="text-center text-xs text-ink-500">
        Pas de médecin dans cette app : si tu as un problème de santé, fais valider le programme
        sportif avant de commencer.
      </p>
    </div>
  );
}
