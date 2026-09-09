"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DAYS, type DayId } from "@/data/wait-model";
import { href, type TabId } from "@/lib/nav";

export type { TabId };

type Ctx = {
  tab: TabId;
  day: DayId;
  done: number[];
  allDone: Record<DayId, number[]>;
  dayMeta: (typeof DAYS)[DayId];
  clock: string;
  open: number | null;
  link: (
    tab?: TabId,
    day?: DayId,
    done?: Record<DayId, number[]>,
    open?: number | null
  ) => string;
};

const VisitContext = createContext<Ctx | null>(null);

export function VisitProvider({
  tab,
  day,
  allDone,
  clock,
  open,
  children,
}: {
  tab: TabId;
  day: DayId;
  allDone: Record<DayId, number[]>;
  clock: string;
  open: number | null;
  children: ReactNode;
}) {
  const value: Ctx = {
    tab,
    day,
    done: allDone[day] ?? [],
    allDone,
    dayMeta: DAYS[day],
    clock,
    open,
    link: (t = tab, d = day, done = allDone, step = null) =>
      href(t, d, done, step),
  };
  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit");
  return ctx;
}
