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
  at: string | null;
  clock: string;
  link: (
    tab?: TabId,
    day?: DayId,
    done?: Record<DayId, number[]>,
    clock?: string | null
  ) => string;
};

const VisitContext = createContext<Ctx | null>(null);

export function VisitProvider({
  tab,
  day,
  allDone,
  at,
  clock,
  children,
}: {
  tab: TabId;
  day: DayId;
  allDone: Record<DayId, number[]>;
  at: string | null;
  clock: string;
  children: ReactNode;
}) {
  const value: Ctx = {
    tab,
    day,
    done: allDone[day] ?? [],
    allDone,
    dayMeta: DAYS[day],
    at,
    clock,
    link: (t = tab, d = day, done = allDone, clockAt = at) =>
      href(t, d, done, clockAt),
  };
  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit");
  return ctx;
}
