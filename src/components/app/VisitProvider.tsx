"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { DAYS, type DayId } from "@/data/wait-model";

export type TabId = "ruta" | "colas" | "dias" | "ferrari" | "mas";

const TABS: TabId[] = ["ruta", "colas", "dias", "ferrari", "mas"];
const EMPTY_DONE: Record<DayId, number[]> = { sun: [], mon: [], tue: [] };

function todayDay(): DayId {
  const now = new Date();
  if (now.getFullYear() === 2026 && now.getMonth() === 8) {
    if (now.getDate() === 20) return "sun";
    if (now.getDate() === 21) return "mon";
    if (now.getDate() === 22) return "tue";
  }
  return "sun";
}

function subscribe(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("pa-local", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("pa-local", cb);
  };
}

function emit() {
  window.dispatchEvent(new Event("pa-local"));
}

let doneCacheKey = "__init__";
let doneCache: Record<DayId, number[]> = EMPTY_DONE;

function readDay(): DayId {
  const raw = localStorage.getItem("pa-day") as DayId | null;
  if (raw && raw in DAYS) return raw;
  return todayDay();
}

function readTab(): TabId {
  const raw = localStorage.getItem("pa-tab") as TabId | null;
  if (raw && TABS.includes(raw)) return raw;
  return "ruta";
}

function readDone(): Record<DayId, number[]> {
  const raw = localStorage.getItem("pa-done");
  if (raw === doneCacheKey) return doneCache;
  doneCacheKey = raw ?? "";
  try {
    doneCache = raw ? { ...EMPTY_DONE, ...JSON.parse(raw) } : EMPTY_DONE;
  } catch {
    doneCache = EMPTY_DONE;
  }
  return doneCache;
}

type Ctx = {
  tab: TabId;
  setTab: (t: TabId) => void;
  day: DayId;
  setDay: (d: DayId) => void;
  done: number[];
  markDone: (index: number) => void;
  undo: () => void;
  resetDay: () => void;
  dayMeta: (typeof DAYS)[DayId];
};

const VisitContext = createContext<Ctx | null>(null);

export function VisitProvider({ children }: { children: ReactNode }) {
  const day = useSyncExternalStore(subscribe, readDay, () => "sun" as DayId);
  const tab = useSyncExternalStore(subscribe, readTab, () => "ruta" as TabId);
  const allDone = useSyncExternalStore(subscribe, readDone, () => EMPTY_DONE);

  const setTab = useCallback((t: TabId) => {
    localStorage.setItem("pa-tab", t);
    emit();
  }, []);

  const setDay = useCallback((d: DayId) => {
    localStorage.setItem("pa-day", d);
    emit();
  }, []);

  const markDone = useCallback(
    (index: number) => {
      const prev = readDone();
      const next = {
        ...prev,
        [day]: [...new Set([...(prev[day] ?? []), index])].sort((a, b) => a - b),
      };
      localStorage.setItem("pa-done", JSON.stringify(next));
      emit();
    },
    [day]
  );

  const undo = useCallback(() => {
    const prev = readDone();
    const list = [...(prev[day] ?? [])];
    list.pop();
    localStorage.setItem("pa-done", JSON.stringify({ ...prev, [day]: list }));
    emit();
  }, [day]);

  const resetDay = useCallback(() => {
    const prev = readDone();
    localStorage.setItem(
      "pa-done",
      JSON.stringify({ ...prev, [day]: [] })
    );
    emit();
  }, [day]);

  const value = useMemo<Ctx>(
    () => ({
      tab,
      setTab,
      day,
      setDay,
      done: allDone[day] ?? [],
      markDone,
      undo,
      resetDay,
      dayMeta: DAYS[day],
    }),
    [tab, setTab, day, setDay, allDone, markDone, undo, resetDay]
  );

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit");
  return ctx;
}
