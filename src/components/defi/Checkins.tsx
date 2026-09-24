"use client";

import { checkinDays, checkinFields, type CheckinKey } from "@/content/defi";
import type { DefiState } from "@/lib/defi-core";

export function Checkins({
  state,
  update,
  today,
}: {
  state: DefiState;
  update: (fn: (s: DefiState) => DefiState) => void;
  today: number;
}) {
  function write(day: number, key: CheckinKey | "note", value: string) {
    update((s) => ({ ...s, checkins: { ...s.checkins, [day]: { ...s.checkins[day], [key]: value } } }));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Bilans</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-400">
          J1, J30, J60, J90. Mêmes mesures, mêmes tests, même heure de la journée. Prends aussi une
          photo de face et de profil à chaque bilan (garde-la dans ton téléphone, pas ici). Les
          chiffres ne mentent pas, le miroir si.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03]">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-ink-400">
              <th className="p-3 font-medium">Mesure</th>
              {checkinDays.map((d) => (
                <th key={d} className="p-3 font-semibold text-white">
                  J{d}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {checkinFields.map((f) => (
              <tr key={f.key} className="border-b border-white/5">
                <td className="p-3 text-ink-300">
                  {f.label}
                  {f.unit ? <span className="text-ink-500"> ({f.unit})</span> : null}
                </td>
                {checkinDays.map((d) => (
                  <td key={d} className="p-2">
                    <input
                      inputMode="decimal"
                      value={state.checkins[d]?.[f.key] ?? ""}
                      onChange={(e) => write(d, f.key, e.target.value)}
                      disabled={d > today}
                      aria-label={`${f.label} J${d}`}
                      className="w-full min-w-16 rounded-lg border border-white/10 bg-black/30 px-2 py-1.5 text-white focus:border-brand-500 focus:outline-none disabled:opacity-30"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {checkinDays
        .filter((d) => d <= today)
        .map((d) => (
          <label key={d} className="block text-sm text-ink-300">
            <span className="font-semibold text-white">Note du J{d}</span> — comment tu te sens,
            ce qui a changé
            <textarea
              value={state.checkins[d]?.note ?? ""}
              onChange={(e) => write(d, "note", e.target.value)}
              rows={3}
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white focus:border-brand-500 focus:outline-none"
            />
          </label>
        ))}
    </div>
  );
}
