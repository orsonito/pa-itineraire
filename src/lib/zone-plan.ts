export const PARK_LOOP = [
  "Mediterrània",
  "Far West",
  "México",
  "SésamoAventura",
  "China",
  "Polynesia",
] as const;

export type ParkZone = (typeof PARK_LOOP)[number];

export const START_ZONES = [
  "Hotel El Paso",
  ...PARK_LOOP,
  "Ferrari Land",
] as const;
export type StartZone = (typeof START_ZONES)[number];

const WALK: Record<string, number> = {
  "Hotel El Paso|Mediterrània": 9,
  "Hotel El Paso|Ferrari Land": 12,
  "Mediterrània|Far West": 10,
  "Far West|México": 6,
  "México|SésamoAventura": 8,
  "SésamoAventura|China": 5,
  "China|Polynesia": 8,
  "Polynesia|Mediterrània": 4,
  "Mediterrània|China": 10,
  "Mediterrània|Ferrari Land": 6,
};

function walkMinutes(a: string, b: string): number {
  if (a === b) return 0;
  const direct = WALK[`${a}|${b}`] ?? WALK[`${b}|${a}`];
  if (direct != null) return direct;
  if (a === "Ferrari Land") return walkMinutes("Mediterrània", b) + 6;
  if (b === "Ferrari Land") return walkMinutes(a, "Mediterrània") + 6;
  return 8;
}

export function walkMinutesBetween(a: string, b: string): number {
  return walkMinutes(a, b);
}

function rotateLoop(start: ParkZone): ParkZone[] {
  const i = PARK_LOOP.indexOf(start);
  if (i < 0) return [...PARK_LOOP];
  return [...PARK_LOOP.slice(i), ...PARK_LOOP.slice(0, i)];
}

/** Mondes dans l’ordre du lac, en partant d’ici. Ferrari Land est à l’entrée. */
export function zonesFromHere(start: StartZone): string[] {
  if (start === "Ferrari Land") return ["Ferrari Land", ...PARK_LOOP];
  const loopStart: ParkZone =
    start === "Hotel El Paso" ? "Mediterrània" : (start as ParkZone);
  return [...rotateLoop(loopStart), "Ferrari Land"];
}

export function parkZoneFrom(zone?: string): StartZone {
  if (!zone) return "Mediterrània";
  const part = zone.split(/\s+(?:o|ou)\s+/)[0]?.trim();
  if (part && (START_ZONES as readonly string[]).includes(part)) {
    return part as StartZone;
  }
  return "Mediterrània";
}
