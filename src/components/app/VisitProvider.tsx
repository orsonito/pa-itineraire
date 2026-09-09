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
import type { TabId } from "@/lib/nav";

export type { TabId };

const EMPTY_DONE: Record<DayId, number[]> = { sun: [], mon: [], tue: [] };

let doneRaw = "__init__";
let doneSnap: Record<DayId, number[]> = EMPTY_DONE;

function readDone(): Record<DayId, number[]> {
  let raw = "";
  try {
    raw = localStorage.getItem("pa-done") ?? "";
  } catch {
    return EMPTY_DONE;
  }
  if (raw === doneRaw) return doneSnap;
  doneRaw = raw;
  try {
    doneSnap = raw ? { ...EMPTY_DONE, ...JSON.parse(raw) } : EMPTY_DONE;
  } catch {
    doneSnap = EMPTY_DONE;
  }
  return doneSnap;
}

function subscribeDone(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener("pa-done", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("pa-done", cb);
  };
}

function writeDone(next: Record<DayId, number[]>) {
  doneRaw = JSON.stringify(next);
  doneSnap = next;
  try {
    localStorage.setItem("pa-done", doneRaw);
  } catch {
    /* private mode */
  }
  window.dispatchEvent(new Event("pa-done"));
}

type Ctx = {
  tab: TabId;
  day: DayId;
  done: number[];
  markDone: (index: number) => void;
  undo: () => void;
  resetDay: () => void;
  dayMeta: (typeof DAYS)[DayId];
};

const VisitContext = createContext<Ctx | null>(null);

export function VisitProvider({
  tab,
  day,
  children,
}: {
  tab: TabId;
  day: DayId;
  children: ReactNode;
}) {
  const allDone = useSyncExternalStore(subscribeDone, readDone, () => EMPTY_DONE);

  const markDone = useCallback(
    (index: number) => {
      const prev = readDone();
      writeDone({
        ...prev,
        [day]: [...new Set([...(prev[day] ?? []), index])].sort((a, b) => a - b),
      });
    },
    [day]
  );

  const undo = useCallback(() => {
    const prev = readDone();
    const list = [...(prev[day] ?? [])];
    list.pop();
    writeDone({ ...prev, [day]: list });
  }, [day]);

  const resetDay = useCallback(() => {
    writeDone({ ...readDone(), [day]: [] });
  }, [day]);

  const value = useMemo<Ctx>(
    () => ({
      tab,
      day,
      done: allDone[day] ?? [],
      markDone,
      undo,
      resetDay,
      dayMeta: DAYS[day],
    }),
    [tab, day, allDone, markDone, undo, resetDay]
  );

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit");
  return ctx;
}
