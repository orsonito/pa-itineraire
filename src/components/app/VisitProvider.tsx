"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DAYS, type DayId } from "@/data/wait-model";
import { href, parseHref, type TabId } from "@/lib/nav";

export type { TabId };

type Snapshot = {
  tab: TabId;
  day: DayId;
  allDone: Record<DayId, number[]>;
  open: number | null;
};

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
  go: (path: string, opts?: { scroll?: boolean; history?: "push" | "replace" }) => void;
};

const VisitContext = createContext<Ctx | null>(null);

function snapshotFromPath(path: string): Snapshot {
  const parsed = parseHref(path);
  return {
    tab: parsed.tab,
    day: parsed.day,
    allDone: parsed.allDone,
    open: parsed.open,
  };
}

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
  const [nav, setNav] = useState<Snapshot>({ tab, day, allDone, open });

  const go = useCallback((
    path: string,
    opts?: { scroll?: boolean; history?: "push" | "replace" }
  ) => {
    const url = new URL(path, window.location.origin);
    const nextPath = `${url.pathname}${url.search}${url.hash}`;
    const current = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (nextPath === current) return;
    const next = snapshotFromPath(nextPath);
    setNav(next);
    if (opts?.history === "replace") {
      window.history.replaceState(null, "", nextPath);
    } else {
      window.history.pushState(null, "", nextPath);
    }
    if (opts?.scroll === false) return;
    if (url.hash) {
      const id = decodeURIComponent(url.hash.slice(1));
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ block: "start" });
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const onPop = () => {
      setNav(snapshotFromPath(window.location.pathname + window.location.search));
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      tab: nav.tab,
      day: nav.day,
      done: nav.allDone[nav.day] ?? [],
      allDone: nav.allDone,
      dayMeta: DAYS[nav.day],
      clock,
      open: nav.open,
      link: (t = nav.tab, d = nav.day, done = nav.allDone, step = null) =>
        href(t, d, done, step),
      go,
    }),
    [nav, clock, go]
  );

  return <VisitContext.Provider value={value}>{children}</VisitContext.Provider>;
}

export function useVisit() {
  const ctx = useContext(VisitContext);
  if (!ctx) throw new Error("useVisit");
  return ctx;
}
