"use client";

import { useState } from "react";
import { dailyRules, getDay, pillars, TOTAL_DAYS, type Mission } from "@/content/defi";
import { dateOfDay, isDayComplete, type DefiState } from "@/lib/defi-store";
import { Check } from "@/components/ui";
import { Timer } from "./Timer";

type Props = {
  state: DefiState;
  update: (fn: (s: DefiState) => DefiState) => void;
  n: number;
  today: number;
  onNavigate: (n: number) => void;
  onOpenCheckin: () => void;
};

const dateFormat = new Intl.DateTimeFormat("fr-FR", { weekday: "long", day: "numeric", month: "long" });

export function Today({ state, update, n, today, onNavigate, onOpenCheckin }: Props) {
  const day = getDay(n);
  const done = state.done[n] ?? {};
  const rules = state.rules[n] ?? [];
  const journal = state.journal[n] ?? {};
  const locked = n > today;
  const complete = isDayComplete(state, n);

  function toggleMission(m: Mission) {
    update((s) => ({
      ...s,
      done: { ...s.done, [n]: { ...s.done[n], [m.pillar]: !s.done[n]?.[m.pillar] } },
    }));
  }

  function toggleRule(i: number) {
    update((s) => {
      const current = s.rules[n] ?? [];
      const next = current.includes(i) ? current.filter((r) => r !== i) : [...current, i];
      return { ...s, rules: { ...s.rules, [n]: next } };
    });
  }

  function writeJournal(field: "priorities" | "evening", value: string) {
    update((s) => ({ ...s, journal: { ...s.journal, [n]: { ...s.journal[n], [field]: value } } }));
  }

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">
            Phase {day.phase.index + 1} · {day.phase.name}
          </p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white">
            Jour {n}
            <span className="text-ink-500"> / {TOTAL_DAYS}</span>
          </h1>
          {state.startDate ? (
            <p className="mt-1 text-sm text-ink-400 first-letter:uppercase">
              {dateFormat.format(dateOfDay(state.startDate, n))}
              {n === today ? " · aujourd'hui" : ""}
            </p>
          ) : null}
        </div>
        <div className="flex gap-1">
          <NavButton label="Jour précédent" disabled={n <= 1} onClick={() => onNavigate(n - 1)} dir="prev" />
          <NavButton
            label="Jour suivant"
            disabled={n >= TOTAL_DAYS}
            onClick={() => onNavigate(n + 1)}
            dir="next"
          />
        </div>
      </header>

      {n !== today && today >= 1 && today <= TOTAL_DAYS ? (
        <button
          type="button"
          onClick={() => onNavigate(today)}
          className="text-sm font-semibold text-brand-400 hover:text-brand-300"
        >
          ← Revenir à aujourd&apos;hui (J{today})
        </button>
      ) : null}

      {locked ? (
        <p className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-sm text-ink-300">
          Aperçu. Ce jour se débloque le moment venu : on ne prend pas d&apos;avance, on est régulier.
        </p>
      ) : null}

      {complete ? (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-300">
          Jour {n} validé. Une brique de plus. Personne ne l&apos;a vue, et c&apos;est très bien.
        </div>
      ) : null}

      {day.checkin ? (
        <button
          type="button"
          onClick={onOpenCheckin}
          className="w-full rounded-xl border border-brand-500/40 bg-brand-500/10 p-4 text-left"
        >
          <p className="font-semibold text-brand-300">Jour de bilan</p>
          <p className="mt-1 text-sm text-ink-300">
            Mesures, tests, notes : prends 10 minutes pour remplir ton bilan J{n}. →
          </p>
        </button>
      ) : null}

      <div className="space-y-4">
        {day.missions.map((m) => (
          <MissionCard
            key={`${n}-${m.pillar}`}
            mission={m}
            done={Boolean(done[m.pillar])}
            disabled={locked}
            onToggle={() => toggleMission(m)}
          />
        ))}
      </div>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-semibold text-white">Journal</h2>
        <label className="mt-4 block text-sm text-ink-300">
          Mes 3 priorités du jour
          <textarea
            value={journal.priorities ?? ""}
            onChange={(e) => writeJournal("priorities", e.target.value)}
            disabled={locked}
            rows={3}
            placeholder={"1.\n2.\n3."}
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-ink-600 focus:border-brand-500 focus:outline-none"
          />
        </label>
        <label className="mt-4 block text-sm text-ink-300">
          <span className="font-semibold text-emerald-300">Question du soir :</span>{" "}
          {day.missions[2].focus}
          <textarea
            value={journal.evening ?? ""}
            onChange={(e) => writeJournal("evening", e.target.value)}
            disabled={locked}
            rows={6}
            placeholder="Écris sans te relire. Personne ne lira ça à part toi."
            className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-ink-600 focus:border-brand-500 focus:outline-none"
          />
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="font-semibold text-white">Règles non négociables</h2>
        <ul className="mt-3 space-y-2">
          {dailyRules.map((rule, i) => {
            const checked = rules.includes(i);
            return (
              <li key={rule}>
                <button
                  type="button"
                  disabled={locked}
                  onClick={() => toggleRule(i)}
                  aria-pressed={checked}
                  className="flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm hover:bg-white/5 disabled:opacity-50"
                >
                  <Box checked={checked} />
                  <span className={checked ? "text-ink-400 line-through" : "text-ink-200"}>{rule}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-400">
          Modèle mental de la semaine
        </p>
        <h2 className="mt-2 text-lg font-bold text-white">{day.model.name}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">{day.model.idea}</p>
      </section>
    </div>
  );
}

function MissionCard({
  mission,
  done,
  disabled,
  onToggle,
}: {
  mission: Mission;
  done: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const [open, setOpen] = useState(!done);
  const [focus, setFocus] = useState<string | undefined>(undefined);
  const pillar = pillars[mission.pillar];
  const shownFocus = focus ?? mission.focus;

  function shuffle() {
    const pool = mission.pool;
    if (!pool) return;
    let next = shownFocus;
    while (pool.length > 1 && next === shownFocus) next = pool[Math.floor(Math.random() * pool.length)];
    setFocus(next);
  }

  return (
    <article
      className={`rounded-2xl border p-5 transition-colors ${
        done ? "border-emerald-500/30 bg-emerald-500/[0.04]" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={onToggle}
          disabled={disabled}
          aria-pressed={done}
          aria-label={done ? `Annuler : ${mission.title}` : `Valider : ${mission.title}`}
          className={`mt-1 grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors disabled:opacity-40 ${
            done ? "border-emerald-400 bg-emerald-400 text-ink-950" : "border-white/25 hover:border-white/50"
          }`}
        >
          {done ? <Check /> : null}
        </button>
        <button type="button" onClick={() => setOpen((o) => !o)} className="min-w-0 flex-1 text-left">
          <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${pillar.color}`}>
            {pillar.label} · {mission.minutes} min
          </p>
          <h3 className={`mt-1 text-lg font-bold ${done ? "text-ink-400" : "text-white"}`}>{mission.title}</h3>
        </button>
      </div>

      {open ? (
        <div className="mt-4 space-y-4 sm:pl-12">
          {shownFocus ? (
            <div className="rounded-xl bg-black/30 p-4">
              <p className="text-lg font-semibold leading-snug text-white">« {shownFocus} »</p>
              {mission.pool ? (
                <button
                  type="button"
                  onClick={shuffle}
                  className="mt-2 text-sm font-semibold text-ink-400 hover:text-white"
                >
                  ↻ Autre sujet
                </button>
              ) : null}
            </div>
          ) : null}
          <ol className="space-y-2 text-sm leading-relaxed text-ink-200">
            {mission.steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="w-5 shrink-0 text-right font-mono text-ink-500">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {mission.timer ? <Timer seconds={mission.timer} /> : null}
          {mission.tip ? <p className="text-sm italic text-ink-400">{mission.tip}</p> : null}
        </div>
      ) : null}
    </article>
  );
}

export function Box({ checked }: { checked: boolean }) {
  return (
    <span
      className={`grid size-5 shrink-0 place-items-center rounded border ${
        checked ? "border-emerald-400 bg-emerald-400 text-ink-950" : "border-white/25"
      }`}
    >
      {checked ? <Check className="size-4" /> : null}
    </span>
  );
}

function NavButton({
  label,
  disabled,
  onClick,
  dir,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  dir: "prev" | "next";
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="grid size-10 place-items-center rounded-full border border-white/10 text-ink-300 hover:bg-white/5 disabled:opacity-30"
    >
      {dir === "prev" ? "‹" : "›"}
    </button>
  );
}
