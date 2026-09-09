import type { DayId } from "@/data/wait-model";

export type TabId = "ruta" | "colas" | "mas";

const TABS: TabId[] = ["ruta", "colas", "mas"];
export const DAY_IDS: DayId[] = ["sun", "mon", "tue"];

export const EMPTY_DONE: Record<DayId, number[]> = { sun: [], mon: [], tue: [] };

function first(v: string | string[] | undefined): string | undefined {
  if (Array.isArray(v)) return v[0];
  return v;
}

export function parseTab(v: string | string[] | undefined): TabId {
  const raw = first(v);
  if (raw === "ahora" || raw === "ici" || raw === "ferrari") return "colas";
  if (raw === "dias") return "ruta";
  if (raw && TABS.includes(raw as TabId)) return raw as TabId;
  return "ruta";
}

export function parseDay(v: string | string[] | undefined): DayId {
  const raw = first(v);
  if (raw && DAY_IDS.includes(raw as DayId)) return raw as DayId;
  return "sun";
}

export function parseOpen(v: string | string[] | undefined): number | null {
  const raw = first(v);
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 0) return null;
  return n;
}

export function parseDone(
  v: string | string[] | undefined
): Record<DayId, number[]> {
  const raw = first(v);
  const out: Record<DayId, number[]> = { sun: [], mon: [], tue: [] };
  if (!raw) return out;
  for (const part of raw.split("|")) {
    const [id, nums] = part.split(":");
    if (id !== "sun" && id !== "mon" && id !== "tue") continue;
    out[id] = (nums ?? "")
      .split(",")
      .map((n) => Number(n))
      .filter((n) => Number.isInteger(n) && n >= 0);
  }
  return out;
}

export function serializeDone(all: Record<DayId, number[]>): string {
  return DAY_IDS.filter((d) => (all[d] ?? []).length > 0)
    .map((d) => `${d}:${all[d].join(",")}`)
    .join("|");
}

export function withDone(
  all: Record<DayId, number[]>,
  day: DayId,
  indices: number[]
): Record<DayId, number[]> {
  return { ...all, [day]: [...new Set(indices)].sort((a, b) => a - b) };
}

export function href(
  tab: TabId,
  day: DayId,
  done: Record<DayId, number[]> = EMPTY_DONE,
  open?: number | null
): string {
  const q = new URLSearchParams({ tab, day });
  const packed = serializeDone(done);
  if (packed) q.set("done", packed);
  if (open != null && open >= 0) q.set("open", String(open));
  const path = `/?${q.toString()}`;
  if (open != null && open >= 0) return `${path}#paso-${open}`;
  return path;
}

export function parseHref(path: string): {
  tab: TabId;
  day: DayId;
  allDone: Record<DayId, number[]>;
  open: number | null;
  hash: string;
} {
  const url = new URL(path, "http://local");
  return {
    tab: parseTab(url.searchParams.get("tab") ?? undefined),
    day: parseDay(url.searchParams.get("day") ?? undefined),
    allDone: parseDone(url.searchParams.get("done") ?? undefined),
    open: parseOpen(url.searchParams.get("open") ?? undefined),
    hash: url.hash,
  };
}
