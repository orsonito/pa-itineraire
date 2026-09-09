"use client";

import { createContext, useContext, type ReactNode } from "react";
import { DAYS, type DayId } from "@/data/wait-model";
import type { TabId } from "@/lib/nav";

export type { TabId };

type Ctx = {
  tab: TabId;
  day: DayId;
  done: number[];
  allDone: Record<DayId, number[]>;
  dayMeta: (typeof DAYS)[DayId];
};

const VisitContext = createContext<Ctx | null>(null);

export function VisitProvider({
  tab,
  day,
  allDone,
  children,
}: {
  tab: TabId;
  day: DayId;
  allDone: Record<DayId, number[]>;
  children: ReactNode;
}) {
  const value: Ctx = {
    tab,
    day,
    done: allDone[day] ?? [],
    allDone,
    dayMeta: DAYS[day],
  };
  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit");
  return ctx;
}
