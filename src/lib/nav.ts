import type { DayId } from "@/data/wait-model";

export type TabId = "ruta" | "colas" | "dias" | "ferrari" | "mas";

const TABS: TabId[] = ["ruta", "colas", "dias", "ferrari", "mas"];
const DAYS: DayId[] = ["sun", "mon", "tue"];

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export function parseTab(v: string | string[] | undefined): TabId {
  const raw = first(v);
  if (raw && TABS.includes(raw as TabId)) return raw as TabId;
  return "ruta";
}

export function parseDay(v: string | string[] | undefined): DayId {
  const raw = first(v);
  if (raw && DAYS.includes(raw as DayId)) return raw as DayId;
  return "sun";
}

export function href(tab: TabId, day: DayId): string {
  const q = new URLSearchParams({ tab, day });
  return `/?${q.toString()}`;
}
