"use client";

import { useEffect, useRef, useState } from "react";
import { pillars, TOTAL_DAYS, type Pillar } from "@/content/defi";
import { notify, registerServiceWorker, startRinging, stopRinging } from "@/lib/alarm";
import {
  completedCount,
  dayNumber,
  isDayComplete,
  missedDays,
  toISODate,
  useDefiState,
  type DefiState,
} from "@/lib/defi-store";
import { Checkins } from "./Checkins";
import { Ideas } from "./Ideas";
import { Journey } from "./Journey";
import { Onboarding } from "./Onboarding";
import { alarmLabels, Settings } from "./Settings";
import { Today } from "./Today";

type Tab = "today" | "journey" | "ideas" | "checkins" | "settings";

const tabs: { id: Tab; label: string }[] = [
  { id: "today", label: "Jour" },
  { id: "journey", label: "Parcours" },
  { id: "ideas", label: "Idées" },
  { id: "checkins", label: "Bilans" },
  { id: "settings", label: "Alarmes" },
];

function useTodayISO() {
  const [iso, setIso] = useState(() => toISODate(new Date()));
  useEffect(() => {
    const id = setInterval(() => setIso(toISODate(new Date())), 30_000);
    return () => clearInterval(id);
  }, []);
  return iso;
}

export function ChallengeApp() {
  const { state, update, replace } = useDefiState();
  const todayISO = useTodayISO();
  const [tab, setTab] = useState<Tab>("today");
  const [viewDay, setViewDay] = useState<number | null>(null);
  const [ringing, setRinging] = useState<Pillar | null>(null);

  const today = state?.startDate ? dayNumber(state.startDate, todayISO) : 0;

  useAlarmRunner(state, update, today, setRinging);

  useEffect(() => {
    if (state?.alarms.enabled) void registerServiceWorker();
  }, [state?.alarms.enabled]);

  if (!state) {
    return <div className="min-h-dvh" aria-busy="true" />;
  }

  if (!state.startDate) {
    return (
      <Shell>
        <Onboarding
          onStart={({ startDate, why, hardcore }) => {
            update((s) => ({ ...s, startDate, why, hardcore }));
            setTab("settings");
          }}
        />
      </Shell>
    );
  }

  const shownDay = Math.min(Math.max(viewDay ?? today, 1), TOTAL_DAYS);
  const missed = missedDays(state, today);
  const hardcoreFail = state.hardcore && missed.length > 0 && today <= TOTAL_DAYS;

  function restart() {
    update((s) => ({ ...s, startDate: todayISO, done: {}, rules: {}, journal: {}, checkins: {} }));
    setViewDay(null);
    setTab("today");
  }

  return (
    <Shell>
      {ringing ? (
        <RingingOverlay
          pillar={ringing}
          onStop={() => {
            stopRinging();
            setRinging(null);
            setViewDay(null);
            setTab("today");
          }}
        />
      ) : null}

      {hardcoreFail ? (
        <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
          <p className="font-bold text-red-300">Mode hardcore : tu as raté le jour {missed[0]}.</p>
          <p className="mt-1 text-sm text-ink-300">
            La règle était claire. Tu repars à J1 aujourd&apos;hui, plus fort que la première fois.
            (Ton journal sera effacé : exporte-le dans « Alarmes » avant si tu veux le garder.)
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-400"
          >
            Recommencer à J1
          </button>
        </div>
      ) : (
        <Banners state={state} today={today} />
      )}

      {tab === "today" ? (
        today < 1 ? (
          <div className="mb-6 rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-ink-300">
            Le défi commence demain. Règle tes alarmes, prépare tes affaires de sport, dors tôt.
            Voici ce qui t&apos;attend :
          </div>
        ) : null
      ) : null}

      {tab === "today" && today > TOTAL_DAYS && viewDay === null ? (
        <Finished state={state} onRestart={restart} />
      ) : tab === "today" ? (
        <Today
          state={state}
          update={update}
          n={shownDay}
          today={today}
          onNavigate={(n) => setViewDay(n)}
          onOpenCheckin={() => setTab("checkins")}
        />
      ) : null}
      {tab === "journey" ? (
        <Journey
          state={state}
          today={today}
          onOpenDay={(n) => {
            setViewDay(n);
            setTab("today");
          }}
        />
      ) : null}
      {tab === "ideas" ? <Ideas state={state} update={update} /> : null}
      {tab === "checkins" ? <Checkins state={state} update={update} today={today} /> : null}
      {tab === "settings" ? <Settings state={state} update={update} replace={replace} today={today} /> : null}

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-ink-950/90 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto grid max-w-2xl grid-cols-5">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                if (t.id === "today") setViewDay(null);
              }}
              aria-current={tab === t.id ? "page" : undefined}
              className={`py-3.5 text-xs font-semibold transition-colors ${
                tab === t.id ? "text-brand-400" : "text-ink-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="hero-glow min-h-dvh px-4 pb-28 pt-8 sm:px-6">
      <div className="mx-auto w-full max-w-2xl">{children}</div>
    </main>
  );
}

function Banners({ state, today }: { state: DefiState; today: number }) {
  if (today < 2 || today > TOTAL_DAYS) {
    return state.why && today === 1 ? <Why text={state.why} /> : null;
  }
  const missedYesterday = !isDayComplete(state, today - 1);
  const missedTwo = today > 2 && missedYesterday && !isDayComplete(state, today - 2);

  if (missedTwo) {
    return (
      <div className="mb-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-5">
        <p className="font-bold text-red-300">Deux jours ratés d&apos;affilée.</p>
        <p className="mt-1 text-sm text-ink-300">
          C&apos;est exactement là que les gens abandonnent. Pas toi. Fais la version minimum
          aujourd&apos;hui s&apos;il le faut, mais fais-la.
        </p>
        {state.why ? <Why text={state.why} /> : null}
      </div>
    );
  }
  if (missedYesterday) {
    return (
      <div className="mb-6 rounded-2xl border border-brand-500/40 bg-brand-500/10 p-5">
        <p className="font-bold text-brand-300">Hier n&apos;est pas validé.</p>
        <p className="mt-1 text-sm text-ink-300">
          Règle des deux jours : tu peux rater une fois, jamais deux. Aujourd&apos;hui, zéro excuse.
        </p>
      </div>
    );
  }
  return null;
}

function Why({ text }: { text: string }) {
  return (
    <blockquote className="mb-6 mt-3 border-l-2 border-brand-500 pl-4 text-sm italic text-ink-300">
      Ton pourquoi : « {text} »
    </blockquote>
  );
}

function Finished({ state, onRestart }: { state: DefiState; onRestart: () => void }) {
  const completed = completedCount(state);
  return (
    <div className="space-y-6 py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">Défi terminé</p>
      <h1 className="text-4xl font-extrabold tracking-tight text-white">
        {completed} / {TOTAL_DAYS} jours validés.
      </h1>
      <p className="mx-auto max-w-md text-ink-300">
        Tu peux réapparaître. Compare tes bilans J1 et J90, regarde ta vidéo du premier jour, puis
        celle du discours final. Et décide de la suite.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="rounded-xl bg-brand-500 px-6 py-3 font-semibold text-ink-950 hover:bg-brand-400"
      >
        Lancer 90 nouveaux jours
      </button>
    </div>
  );
}

function RingingOverlay({ pillar, onStop }: { pillar: Pillar; onStop: () => void }) {
  const label = alarmLabels[pillar];
  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="ring-title"
      className="fixed inset-0 z-50 grid place-items-center bg-ink-950/95 px-6 text-center"
    >
      <div>
        <p className={`text-sm font-semibold uppercase tracking-[0.18em] ${pillars[pillar].color}`}>
          {pillars[pillar].label}
        </p>
        <h2 id="ring-title" className="mt-3 text-3xl font-extrabold text-white">
          C&apos;est l&apos;heure.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-ink-300">{label.description}</p>
        <button
          type="button"
          onClick={onStop}
          className="mt-8 w-full max-w-xs rounded-xl bg-brand-500 px-6 py-4 text-lg font-bold text-ink-950 hover:bg-brand-400"
        >
          J&apos;y vais
        </button>
      </div>
    </div>
  );
}

/**
 * Verifie toutes les 15 s si une alarme doit sonner. Ne fonctionne que tant
 * que la page est ouverte : le calendrier (.ics) prend le relais sinon.
 */
function useAlarmRunner(
  state: DefiState | null,
  update: (fn: (s: DefiState) => DefiState) => void,
  today: number,
  onRing: (p: Pillar) => void,
) {
  const latest = useRef({ state, today });
  latest.current = { state, today };

  useEffect(() => {
    const id = setInterval(() => {
      const { state: s, today: t } = latest.current;
      if (!s?.alarms.enabled || t < 1 || t > TOTAL_DAYS) return;
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const iso = toISODate(now);

      for (const p of Object.keys(pillars) as Pillar[]) {
        if (s.alarms.times[p] !== hhmm || s.alarms.lastFired[p] === iso) continue;
        if (s.done[t]?.[p]) continue; // deja fait : pas besoin de sonner
        update((prev) => ({
          ...prev,
          alarms: { ...prev.alarms, lastFired: { ...prev.alarms.lastFired, [p]: iso } },
        }));
        onRing(p);
        startRinging();
        void notify(alarmLabels[p].title, alarmLabels[p].description);
        break;
      }
    }, 15_000);
    return () => clearInterval(id);
  }, [update, onRing]);
}
