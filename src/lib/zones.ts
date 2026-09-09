import type { StepKind } from "@/data/itineraries";

export type ZoneAction = "go" | "stay";

export type ZonePalette = {
  chip: string;
  bar: string;
  banner: string;
  bannerText: string;
  header: string;
  ring: string;
};

const FALLBACK: ZonePalette = {
  chip: "bg-zinc-200 text-zinc-800",
  bar: "bg-zinc-400",
  banner: "bg-white/15",
  bannerText: "text-white",
  header: "bg-white/15 text-white",
  ring: "ring-zinc-400",
};

const PALETTE: Record<string, ZonePalette> = {
  "Far West": {
    chip: "bg-amber-400 text-amber-950",
    bar: "bg-amber-500",
    banner: "bg-amber-400",
    bannerText: "text-amber-950",
    header: "bg-amber-400 text-amber-950",
    ring: "ring-amber-500",
  },
  "Hotel El Paso": {
    chip: "bg-orange-800 text-orange-50",
    bar: "bg-orange-800",
    banner: "bg-orange-800",
    bannerText: "text-orange-50",
    header: "bg-orange-800 text-orange-50",
    ring: "ring-orange-800",
  },
  México: {
    chip: "bg-orange-500 text-white",
    bar: "bg-orange-500",
    banner: "bg-orange-500",
    bannerText: "text-white",
    header: "bg-orange-500 text-white",
    ring: "ring-orange-500",
  },
  China: {
    chip: "bg-rose-600 text-white",
    bar: "bg-rose-600",
    banner: "bg-rose-500",
    bannerText: "text-white",
    header: "bg-rose-600 text-white",
    ring: "ring-rose-500",
  },
  Polynesia: {
    chip: "bg-cyan-400 text-cyan-950",
    bar: "bg-cyan-500",
    banner: "bg-cyan-300",
    bannerText: "text-cyan-950",
    header: "bg-cyan-400 text-cyan-950",
    ring: "ring-cyan-500",
  },
  "Mediterrània": {
    chip: "bg-teal-400 text-teal-950",
    bar: "bg-teal-400",
    banner: "bg-teal-300",
    bannerText: "text-teal-950",
    header: "bg-teal-400 text-teal-950",
    ring: "ring-teal-400",
  },
  "SésamoAventura": {
    chip: "bg-lime-400 text-lime-950",
    bar: "bg-lime-500",
    banner: "bg-lime-400",
    bannerText: "text-lime-950",
    header: "bg-lime-400 text-lime-950",
    ring: "ring-lime-500",
  },
  "Ferrari Land": {
    chip: "bg-red-600 text-white",
    bar: "bg-red-600",
    banner: "bg-red-500",
    bannerText: "text-white",
    header: "bg-red-600 text-white",
    ring: "ring-red-500",
  },
  "Anillo del lago": {
    chip: "bg-sky-400 text-sky-950",
    bar: "bg-sky-500",
    banner: "bg-sky-300",
    bannerText: "text-sky-950",
    header: "bg-sky-400 text-sky-950",
    ring: "ring-sky-500",
  },
};

export function splitZones(zone?: string): string[] {
  if (!zone) return [];
  return zone.split(/\s+o\s+/).map((z) => z.trim()).filter(Boolean);
}

export function zonePalette(zone?: string): ZonePalette {
  const primary = splitZones(zone)[0];
  return (primary && PALETTE[primary]) || FALLBACK;
}

export function zoneAction(kind: StepKind, title: string): ZoneAction {
  if (kind === "walk" && !/misma zona/i.test(title)) return "go";
  if (kind === "note") return "go";
  return "stay";
}

export function zoneVerb(action: ZoneAction): string {
  return action === "go" ? "Ve a" : "Estás en";
}

export function zonesMatch(here: string | undefined, other: string | undefined) {
  if (!here || !other) return false;
  const a = new Set(splitZones(here));
  return splitZones(other).some((z) => a.has(z));
}
