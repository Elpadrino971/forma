"use client";

import { phases, pillars, TOTAL_DAYS, checkinDays, type Pillar } from "@/content/defi";
import { completedCount, currentStreak, isDayComplete, type DefiState } from "@/lib/defi-core";

export function Journey({
  state,
  today,
  onOpenDay,
}: {
  state: DefiState;
  today: number;
  onOpenDay: (n: number) => void;
}) {
  const completed = completedCount(state);
  const streak = currentStreak(state, Math.min(today, TOTAL_DAYS));

  const pillarTotals = (Object.keys(pillars) as Pillar[]).map((p) => ({
    p,
    count: Object.values(state.done).filter((d) => d[p]).length,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">Le parcours</h1>

      <div className="grid grid-cols-3 gap-3">
        <Stat label="Jours validés" value={`${completed}`} sub={`/ ${TOTAL_DAYS}`} />
        <Stat label="Série en cours" value={`${streak}`} sub={streak > 1 ? "jours" : "jour"} />
        <Stat label="Restants" value={`${Math.max(0, TOTAL_DAYS - Math.max(today, 0))}`} sub="jours" />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="grid grid-cols-3 gap-4 text-center">
          {pillarTotals.map(({ p, count }) => (
            <div key={p}>
              <p className={`text-2xl font-bold ${pillars[p].color}`}>{count}</p>
              <p className="text-xs text-ink-400">séances {pillars[p].label.toLowerCase()}</p>
            </div>
          ))}
        </div>
      </div>

      {phases.map((phase) => (
        <section key={phase.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-500">
            Phase {phase.index + 1} · J{phase.start}–J{phase.end}
          </p>
          <h2 className="mt-1 text-xl font-bold text-white">{phase.name}</h2>
          <p className="mt-1 text-sm text-ink-400">{phase.goal}</p>
          <div className="mt-4 grid grid-cols-10 gap-1.5">
            {Array.from({ length: phase.end - phase.start + 1 }, (_, i) => phase.start + i).map((n) => {
              const complete = isDayComplete(state, n);
              const partial = !complete && Object.values(state.done[n] ?? {}).some(Boolean);
              const missed = !complete && n < today;
              const isToday = n === today;
              return (
                <button
                  key={n}
                  type="button"
                  onClick={() => onOpenDay(n)}
                  title={`Jour ${n}`}
                  className={`relative aspect-square rounded-md text-[11px] font-semibold transition-colors ${
                    complete
                      ? "bg-emerald-500 text-ink-950"
                      : partial
                        ? "bg-emerald-500/30 text-white"
                        : missed
                          ? "bg-red-500/20 text-red-300"
                          : "bg-white/5 text-ink-500 hover:bg-white/10"
                  } ${isToday ? "ring-2 ring-brand-500 ring-offset-2 ring-offset-ink-950" : ""}`}
                >
                  {n}
                  {checkinDays.includes(n) ? (
                    <span className="absolute right-0.5 top-0.5 size-1.5 rounded-full bg-brand-400" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </section>
      ))}

      <p className="text-xs text-ink-500">
        Vert : validé · Vert pâle : commencé · Rouge : raté · Point orange : jour de bilan
      </p>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="mt-1 text-2xl font-extrabold text-white">
        {value} <span className="text-sm font-medium text-ink-500">{sub}</span>
      </p>
    </div>
  );
}
