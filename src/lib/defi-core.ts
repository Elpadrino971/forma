/**
 * Coeur du defi 90 jours, partage entre le site (/defi) et l'app mobile
 * (mobile/). Uniquement du TypeScript pur : pas de React, pas d'API navigateur.
 */

import type { CheckinKey, Pillar } from "../content/defi";
import { TOTAL_DAYS } from "../content/defi";

export type AlarmKey = Pillar;

export type Idea = {
  id: string;
  text: string;
  bucket: "inbox" | "agir" | "planifier" | "reflechir" | "lacher";
  createdAt: string;
};

export type DefiState = {
  version: 1;
  startDate: string | null;
  why: string;
  hardcore: boolean;
  done: Record<number, Partial<Record<Pillar, boolean>>>;
  rules: Record<number, number[]>;
  journal: Record<number, { priorities?: string; evening?: string }>;
  checkins: Record<number, Partial<Record<CheckinKey, string>> & { note?: string }>;
  alarms: { enabled: boolean; times: Record<AlarmKey, string>; lastFired: Record<string, string> };
  ideas: Idea[];
};

export const defaultState: DefiState = {
  version: 1,
  startDate: null,
  why: "",
  hardcore: false,
  done: {},
  rules: {},
  journal: {},
  checkins: {},
  alarms: {
    enabled: false,
    times: { corps: "07:00", eloquence: "12:45", esprit: "21:30" },
    lastFired: {},
  },
  ideas: [],
};

/* -------------------------------------------------------------------------- */
/*  Dates (toujours en date locale, jamais en UTC)                            */
/* -------------------------------------------------------------------------- */

export function toISODate(d: Date) {
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
}

function toUTCDays(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

/** Numero du jour du defi pour une date donnee (1 = jour de depart). */
export function dayNumber(startDate: string, today = toISODate(new Date())) {
  return toUTCDays(today) - toUTCDays(startDate) + 1;
}

export function dateOfDay(startDate: string, n: number) {
  const [y, m, d] = startDate.split("-").map(Number);
  return new Date(y, m - 1, d + n - 1);
}

export function isDayComplete(state: DefiState, n: number) {
  const d = state.done[n];
  return Boolean(d?.corps && d?.eloquence && d?.esprit);
}

/** Serie de jours valides consecutifs, en partant d'aujourd'hui (ou d'hier si aujourd'hui n'est pas fini). */
export function currentStreak(state: DefiState, today: number) {
  let n = isDayComplete(state, today) ? today : today - 1;
  let streak = 0;
  while (n >= 1 && isDayComplete(state, n)) {
    streak++;
    n--;
  }
  return streak;
}

export function completedCount(state: DefiState) {
  let count = 0;
  for (let n = 1; n <= TOTAL_DAYS; n++) if (isDayComplete(state, n)) count++;
  return count;
}

/** Jours passes non valides. */
export function missedDays(state: DefiState, today: number) {
  const missed: number[] = [];
  for (let n = 1; n < Math.min(today, TOTAL_DAYS + 1); n++) {
    if (!isDayComplete(state, n)) missed.push(n);
  }
  return missed;
}

/** Fusionne une sauvegarde (eventuellement ancienne) avec l'etat par defaut. */
export function hydrate(parsed: Partial<DefiState>): DefiState {
  return { ...defaultState, ...parsed, alarms: { ...defaultState.alarms, ...parsed.alarms } };
}
