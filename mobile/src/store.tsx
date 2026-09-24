import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { AppState } from "react-native";
import { dayNumber, hydrate, toISODate, type DefiState } from "./shared";

/**
 * Etat du defi, stocke uniquement sur le telephone (AsyncStorage).
 * Rien ne part sur un serveur : le journal reste prive.
 */

const KEY = "defi90:v1";

type Ctx = {
  state: DefiState;
  update: (fn: (s: DefiState) => DefiState) => void;
  replace: (s: DefiState) => void;
  /** Numero du jour du defi aujourd'hui (0 ou moins : pas encore commence). */
  today: number;
  todayISO: string;
};

const DefiContext = createContext<Ctx | null>(null);

function useTodayISO() {
  const [iso, setIso] = useState(() => toISODate(new Date()));
  useEffect(() => {
    const refresh = () => setIso(toISODate(new Date()));
    const id = setInterval(refresh, 30_000);
    // Au retour dans l'app apres minuit, on passe au jour suivant tout de suite.
    const sub = AppState.addEventListener("change", (s) => s === "active" && refresh());
    return () => {
      clearInterval(id);
      sub.remove();
    };
  }, []);
  return iso;
}

export function DefiProvider({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const [state, setState] = useState<DefiState | null>(null);
  const todayISO = useTodayISO();

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => setState(raw ? hydrate(JSON.parse(raw) as Partial<DefiState>) : hydrate({})))
      .catch(() => setState(hydrate({})));
  }, []);

  useEffect(() => {
    if (state) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state]);

  const update = useCallback((fn: (s: DefiState) => DefiState) => {
    setState((s) => (s ? fn(s) : s));
  }, []);

  if (!state) return <>{fallback ?? null}</>;

  const today = state.startDate ? dayNumber(state.startDate, todayISO) : 0;

  return (
    <DefiContext.Provider value={{ state, update, replace: setState, today, todayISO }}>
      {children}
    </DefiContext.Provider>
  );
}

export function useDefi() {
  const ctx = useContext(DefiContext);
  if (!ctx) throw new Error("useDefi doit etre utilise dans <DefiProvider>");
  return ctx;
}
