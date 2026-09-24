"use client";

import { useCallback, useEffect, useState } from "react";
import { defaultState, hydrate, type DefiState } from "./defi-core";

/**
 * Etat du defi, stocke uniquement dans le navigateur (localStorage).
 * Rien ne part sur un serveur : le journal reste prive.
 */

const KEY = "defi90:v1";

function load(): DefiState {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaultState;
    return hydrate(JSON.parse(raw) as Partial<DefiState>);
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

