"use client";

import { useEffect, useRef, useState } from "react";
import { pillars, TOTAL_DAYS, type Pillar } from "@/content/defi";
import { chime, notify, registerServiceWorker, requestNotifications, unlockAudio } from "@/lib/alarm";
import { dateOfDay, defaultState, hydrate, type DefiState } from "@/lib/defi-core";
import { buildIcs, downloadFile } from "@/lib/ics";

const alarmLabels: Record<Pillar, { title: string; description: string; minutes: number }> = {
  corps: {
    title: "🔥 Défi 90 — Séance de sport",
    description: "Ton corps n'attend pas la motivation. Enfile tes affaires, maintenant.",
    minutes: 45,
  },
  eloquence: {
    title: "🎙️ Défi 90 — Éloquence",
    description: "10 minutes de parole. Debout, à voix haute, filmé.",
    minutes: 15,
  },
  esprit: {
    title: "🧠 Défi 90 — Journal & clarté",
    description: "Respiration, question du soir, vide ta tête. Puis dors.",
    minutes: 20,
  },
};

export { alarmLabels };

type Props = {
  state: DefiState;
  update: (fn: (s: DefiState) => DefiState) => void;
  replace: (s: DefiState) => void;
  today: number;
};

export function Settings({ state, update, replace, today }: Props) {
  const [permission, setPermission] = useState<string>("default");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPermission("Notification" in window ? Notification.permission : "unsupported");
  }, []);

  async function enableAlarms() {
    unlockAudio();
    await registerServiceWorker();
    const result = await requestNotifications();
    setPermission(result);
    update((s) => ({ ...s, alarms: { ...s.alarms, enabled: true } }));
    chime();
  }

  function setTime(p: Pillar, value: string) {
    update((s) => ({ ...s, alarms: { ...s.alarms, times: { ...s.alarms.times, [p]: value } } }));
  }

  function exportCalendar() {
    if (!state.startDate) return;
    const first = Math.max(1, today);
    const count = TOTAL_DAYS - first + 1;
    if (count <= 0) return;
    const ics = buildIcs(
      (Object.keys(pillars) as Pillar[]).map((p) => ({
        uid: `defi90-${p}`,
        time: state.alarms.times[p],
        ...alarmLabels[p],
      })),
      dateOfDay(state.startDate, first),
      count,
      `${window.location.origin}/defi`,
    );
    downloadFile("defi-90-jours-alarmes.ics", ics, "text/calendar;charset=utf-8");
  }

  function exportData() {
    downloadFile("defi-90-jours-sauvegarde.json", JSON.stringify(state, null, 2), "application/json");
  }

  async function importData(file: File) {
    try {
      const parsed = JSON.parse(await file.text()) as DefiState;
      if (parsed.version !== 1) throw new Error("version");
      replace(hydrate(parsed));
      alert("Sauvegarde restaurée.");
    } catch {
      alert("Ce fichier n'est pas une sauvegarde valide du défi.");
    }
  }

  function reset() {
    if (!confirm("Tout effacer et recommencer à J1 ? Ton journal sera supprimé. Exporte-le avant si tu veux le garder.")) return;
    replace({ ...defaultState, alarms: state.alarms, why: state.why, hardcore: state.hardcore });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-extrabold tracking-tight text-white">Alarmes & réglages</h1>

      <section className="rounded-2xl border border-brand-500/30 bg-brand-500/5 p-5">
        <h2 className="text-lg font-bold text-white">1. Tes heures</h2>
        <div className="mt-4 space-y-3">
          {(Object.keys(pillars) as Pillar[]).map((p) => (
            <label key={p} className="flex items-center justify-between gap-4">
              <span className={`font-semibold ${pillars[p].color}`}>{pillars[p].label}</span>
              <input
                type="time"
                value={state.alarms.times[p]}
                onChange={(e) => setTime(p, e.target.value)}
                className="rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white [color-scheme:dark] focus:border-brand-500 focus:outline-none"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-white">2. Alarmes sur ton téléphone (recommandé)</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Télécharge le fichier et ouvre-le : ton calendrier ajoute 3 rappels par jour jusqu&apos;à
          J{TOTAL_DAYS}, avec alerte. Ils sonnent même écran verrouillé et navigateur fermé. Si tu
          changes tes heures, supprime l&apos;ancien calendrier et réimporte.
        </p>
        <button
          type="button"
          onClick={exportCalendar}
          disabled={!state.startDate || today > TOTAL_DAYS}
          className="mt-4 w-full rounded-xl bg-brand-500 px-6 py-3 font-semibold text-ink-950 hover:bg-brand-400 disabled:opacity-50"
        >
          Ajouter les alarmes à mon calendrier (.ics)
        </button>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-white">3. Alarme dans l&apos;app</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-300">
          Sonnerie + notification quand l&apos;app est ouverte (onglet ou écran d&apos;accueil). Un
          navigateur ne peut pas te réveiller s&apos;il est fermé : c&apos;est pour ça que
          l&apos;étape 2 existe.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={enableAlarms}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            {state.alarms.enabled ? "Alarmes actives ✓ (retester le son)" : "Activer les alarmes"}
          </button>
          {state.alarms.enabled ? (
            <>
              <button
                type="button"
                onClick={() => notify("Défi 90 — test", "Les notifications fonctionnent.")}
                className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
              >
                Tester la notification
              </button>
              <button
                type="button"
                onClick={() => update((s) => ({ ...s, alarms: { ...s.alarms, enabled: false } }))}
                className="rounded-xl px-4 py-2.5 text-sm text-ink-400 hover:text-white"
              >
                Désactiver
              </button>
            </>
          ) : null}
        </div>
        {permission === "denied" ? (
          <p className="mt-3 text-sm text-red-300">
            Notifications bloquées : autorise-les dans les réglages du navigateur pour ce site.
          </p>
        ) : null}
        {permission === "unsupported" ? (
          <p className="mt-3 text-sm text-ink-400">
            Sur iPhone, les notifications ne marchent qu&apos;après « Partager → Sur l&apos;écran
            d&apos;accueil ». Le calendrier (étape 2), lui, marche partout.
          </p>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-white">Mode hardcore</h2>
        <label className="mt-3 flex items-start gap-3 text-sm text-ink-300">
          <input
            type="checkbox"
            checked={state.hardcore}
            onChange={(e) => update((s) => ({ ...s, hardcore: e.target.checked }))}
            className="mt-1 size-4 accent-orange-500"
          />
          <span>
            Un jour raté = retour à J1. Sans exception. Pour ceux qui veulent un vrai défi contre
            eux-mêmes.
          </span>
        </label>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-white">Mon pourquoi</h2>
        <textarea
          value={state.why}
          onChange={(e) => update((s) => ({ ...s, why: e.target.value }))}
          rows={3}
          className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3 text-white focus:border-brand-500 focus:outline-none"
        />
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="text-lg font-bold text-white">Mes données</h2>
        <p className="mt-2 text-sm text-ink-400">
          Tout reste sur cet appareil, rien n&apos;est envoyé sur Internet. Exporte une sauvegarde de
          temps en temps : si tu vides ton navigateur, tout est perdu.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={exportData}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            Exporter
          </button>
          <button
            type="button"
            onClick={() => fileInput.current?.click()}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            Importer
          </button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importData(file);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            onClick={reset}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-red-300 hover:bg-red-500/10"
          >
            Recommencer à zéro
          </button>
        </div>
      </section>
    </div>
  );
}
