"use client";

import { useCallback, useEffect, useState } from "react";
import type { CheckinKey, Pillar } from "@/content/defi";
import { TOTAL_DAYS } from "@/content/defi";

/**
 * Etat du defi, stocke uniquement dans le navigateur (localStorage).
 * Rien ne part sur un serveur : le journal reste prive.
 */

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

const KEY = "defi90:v1";

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

function load(): DefiState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw) as Partial<DefiState>;
    return {
      ...defaultState,
      ...parsed,
      alarms: { ...defaultState.alarms, ...parsed.alarms },
    };
  } catch {
    return defaultState;
  }
}

export function useDefiState() {
  const [state, setState] = useState<DefiState | null>(null);

  useEffect(() => {
    setState(load());
  }, []);

  useEffect(() => {
    if (!state) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Stockage plein ou bloque (navigation privee) : l'app reste utilisable.
    }
  }, [state]);

  const update = useCallback((fn: (s: DefiState) => DefiState) => {
    setState((s) => (s ? fn(s) : s));
  }, []);

  return { state, update, replace: setState };
}

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
