/**
 * Modelo de estimación de colas — PortAventura World
 * 20–22 septiembre 2026
 *
 * NO son datos oficiales. Combina:
 * - previsiones de afluencia (Queue-Times)
 * - medias históricas 2026 (Queue-Times)
 * - medias por fecha de calendario (Thrill Data)
 * - patrones horarios y horarios de apertura (Parque Temático)
 *
 * Los minutos se redondean a 5. Ver metodología en la UI.
 */

export type WaitTone = "green" | "greenLight" | "yellow" | "orange" | "red";

export type RideStatus = "open" | "closed" | "likely-closed" | "weekend-only";

export type Hour =
  | "10:30"
  | "11:00"
  | "12:00"
  | "13:00"
  | "14:00"
  | "15:00"
  | "16:00"
  | "17:00"
  | "18:00";

export const HOURS_SUNDAY: Hour[] = [
  "10:30",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

export const HOURS_WEEKDAY: Hour[] = [
  "10:30",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

export type DayId = "sun" | "mon" | "tue";

export const DAYS: Record<
  DayId,
  {
    id: DayId;
    label: string;
    date: string;
    weekday: string;
    crowdQueueTimesEs: number;
    crowdQueueTimesEn: number;
    crowdUser: number;
    parkHours: string;
    parkOpen: string;
    parkClose: string;
    hours: Hour[];
    halloween: boolean;
    express: boolean;
  }
> = {
  sun: {
    id: "sun",
    label: "Domingo 20",
    date: "20/09/2026",
    weekday: "Domingo",
    crowdQueueTimesEs: 42,
    crowdQueueTimesEn: 45,
    crowdUser: 38,
    parkHours: "10:30–19:00",
    parkOpen: "10:30",
    parkClose: "19:00",
    hours: HOURS_SUNDAY,
    halloween: true,
    express: true,
  },
  mon: {
    id: "mon",
    label: "Lunes 21",
    date: "21/09/2026",
    weekday: "Lunes",
    crowdQueueTimesEs: 30,
    crowdQueueTimesEn: 34,
    crowdUser: 28,
    parkHours: "10:30–18:00",
    parkOpen: "10:30",
    parkClose: "18:00",
    hours: HOURS_WEEKDAY,
    halloween: true,
    express: false,
  },
  tue: {
    id: "tue",
    label: "Martes 22",
    date: "22/09/2026",
    weekday: "Martes",
    crowdQueueTimesEs: 24,
    crowdQueueTimesEn: 26,
    crowdUser: 22,
    parkHours: "10:30–18:00",
    parkOpen: "10:30",
    parkClose: "18:00",
    hours: HOURS_WEEKDAY,
    halloween: true,
    express: false,
  },
};

export type RideId =
  | "uncharted"
  | "furius"
  | "shambhala"
  | "khan"
  | "hurakan"
  | "stampida"
  | "silver"
  | "tutuki"
  | "templo"
  | "diablo"
  | "rapids"
  | "angkor"
  | "street"
  | "tomahawk";

export type Ride = {
  id: RideId;
  name: string;
  short: string;
  zone: string;
  express10: boolean;
  priority: boolean;
  /** Pico estimado domingo ~13:00 en un día ~42% (minutos cola normal). */
  sundayPeak: number;
  curve: Partial<Record<Hour, number>>;
  /** Elasticidad de afluencia: Uncharted baja menos en días flojos. */
  crowdElasticity: number;
  expressWait: number | null;
  statusNote?: string;
  statusByDay: Record<DayId, RideStatus>;
  opens: string;
  qtAvg2026: number | null;
  thrillSept21?: number;
};

/** Curvas relativas al pico diario. Ausencia de hora = cerrada. */
const STANDARD: Partial<Record<Hour, number>> = {
  "10:30": 0.42,
  "11:00": 0.65,
  "12:00": 0.9,
  "13:00": 1,
  "14:00": 0.95,
  "15:00": 0.85,
  "16:00": 0.7,
  "17:00": 0.45,
  "18:00": 0.35,
};

const UNCHARTED: Partial<Record<Hour, number>> = {
  "10:30": 0.54,
  "11:00": 0.85,
  "12:00": 1,
  "13:00": 0.95,
  "14:00": 1,
  "15:00": 0.9,
  "16:00": 0.75,
  "17:00": 0.5,
  "18:00": 0.38,
};

const FURIUS: Partial<Record<Hour, number>> = {
  "10:30": 0.5,
  "11:00": 0.8,
  "12:00": 0.96,
  "13:00": 1,
  "14:00": 0.96,
  "15:00": 0.84,
  "16:00": 0.7,
  "17:00": 0.5,
  "18:00": 0.38,
};

const WATER: Partial<Record<Hour, number>> = {
  "11:00": 0.45,
  "12:00": 0.8,
  "13:00": 0.95,
  "14:00": 1,
  "15:00": 0.95,
  "16:00": 0.75,
  "17:00": 0.45,
  "18:00": 0.32,
};

const LATE_11: Partial<Record<Hour, number>> = {
  "11:00": 0.5,
  "12:00": 0.85,
  "13:00": 1,
  "14:00": 0.95,
  "15:00": 0.85,
  "16:00": 0.7,
  "17:00": 0.45,
  "18:00": 0.35,
};

const TEMPLO: Partial<Record<Hour, number>> = {
  "11:00": 0.7,
  "12:00": 1,
  "13:00": 0.95,
  "14:00": 0.8,
  "15:00": 0.7,
  "16:00": 0.55,
  "17:00": 0.42,
  "18:00": 0.32,
};

const TOMAHAWK: Partial<Record<Hour, number>> = {
  "12:00": 0.85,
  "13:00": 1,
  "14:00": 0.95,
  "15:00": 0.85,
  "16:00": 0.7,
  "17:00": 0.45,
  "18:00": 0.35,
};

const OPEN_ALL: Record<DayId, RideStatus> = {
  sun: "open",
  mon: "open",
  tue: "open",
};

export const RIDES: Ride[] = [
  {
    id: "uncharted",
    name: "Uncharted",
    short: "Uncharted",
    zone: "Far West",
    express10: false,
    priority: true,
    sundayPeak: 65,
    curve: UNCHARTED,
    crowdElasticity: 0.72,
    expressWait: null,
    opens: "10:30",
    qtAvg2026: 68,
    statusByDay: OPEN_ALL,
  },
  {
    id: "furius",
    name: "Furius Baco",
    short: "Furius Baco",
    zone: "Mediterrània",
    express10: true,
    priority: true,
    sundayPeak: 50,
    curve: FURIUS,
    crowdElasticity: 0.9,
    expressWait: 3,
    opens: "10:30",
    qtAvg2026: 49,
    thrillSept21: 38,
    statusByDay: OPEN_ALL,
  },
  {
    id: "shambhala",
    name: "Shambhala",
    short: "Shambhala",
    zone: "China",
    express10: true,
    priority: true,
    sundayPeak: 45,
    curve: STANDARD,
    crowdElasticity: 0.88,
    expressWait: 3,
    opens: "10:30",
    qtAvg2026: 37,
    thrillSept21: 41,
    statusByDay: OPEN_ALL,
  },
  {
    id: "khan",
    name: "Dragon Khan",
    short: "Dragon Khan",
    zone: "China",
    express10: true,
    priority: true,
    sundayPeak: 38,
    curve: LATE_11,
    crowdElasticity: 0.9,
    expressWait: 3,
    opens: "11:00",
    qtAvg2026: 34,
    thrillSept21: 24,
    statusByDay: OPEN_ALL,
  },
  {
    id: "hurakan",
    name: "Hurakan Condor",
    short: "Hurakan Condor",
    zone: "México",
    express10: false,
    priority: true,
    sundayPeak: 45,
    curve: STANDARD,
    crowdElasticity: 0.88,
    expressWait: null,
    opens: "10:30",
    qtAvg2026: 39,
    thrillSept21: 41,
    statusByDay: OPEN_ALL,
  },
  {
    id: "stampida",
    name: "Stampida",
    short: "Stampida",
    zone: "Far West",
    express10: true,
    priority: false,
    sundayPeak: 40,
    curve: LATE_11,
    crowdElasticity: 0.92,
    expressWait: 3,
    opens: "11:00",
    qtAvg2026: 31,
    thrillSept21: 39,
    statusByDay: OPEN_ALL,
  },
  {
    id: "silver",
    name: "Silver River Flume",
    short: "Silver River",
    zone: "Far West",
    express10: true,
    priority: false,
    sundayPeak: 38,
    curve: WATER,
    crowdElasticity: 0.95,
    expressWait: 4,
    opens: "11:00",
    qtAvg2026: 37,
    thrillSept21: 30,
    statusNote:
      "Puede cerrar antes que el parque. En Halloween a veces se apaga antes.",
    statusByDay: OPEN_ALL,
  },
  {
    id: "tutuki",
    name: "Tutuki Splash",
    short: "Tutuki Splash",
    zone: "Polynesia",
    express10: true,
    priority: false,
    sundayPeak: 32,
    curve: WATER,
    crowdElasticity: 0.95,
    expressWait: 4,
    opens: "11:00",
    qtAvg2026: 30,
    thrillSept21: 21,
    statusNote:
      "Puede cerrar antes que el parque. Confirmar en la app el mismo día.",
    statusByDay: OPEN_ALL,
  },
  {
    id: "templo",
    name: "Templo del Fuego",
    short: "Templo del Fuego",
    zone: "México",
    express10: true,
    priority: false,
    sundayPeak: 32,
    curve: TEMPLO,
    crowdElasticity: 0.85,
    expressWait: 5,
    opens: "según pases (típico ~11:00)",
    qtAvg2026: 28,
    thrillSept21: 29,
    statusNote:
      "Desde el 7/09/2026 Parque Temático indica que solo opera sábados y domingos. El Express salta al siguiente pase (~0–10 min).",
    statusByDay: {
      sun: "weekend-only",
      mon: "closed",
      tue: "closed",
    },
  },
  {
    id: "diablo",
    name: "El Diablo – Tren de la Mina",
    short: "El Diablo",
    zone: "México",
    express10: true,
    priority: false,
    sundayPeak: 28,
    curve: LATE_11,
    crowdElasticity: 0.9,
    expressWait: 3,
    opens: "11:00",
    qtAvg2026: 26,
    thrillSept21: 21,
    statusByDay: OPEN_ALL,
  },
  {
    id: "rapids",
    name: "Grand Canyon Rapids",
    short: "Grand Canyon",
    zone: "Far West",
    express10: true,
    priority: false,
    sundayPeak: 22,
    curve: STANDARD,
    crowdElasticity: 0.95,
    expressWait: 4,
    opens: "10:30",
    qtAvg2026: 24,
    thrillSept21: 14,
    statusByDay: OPEN_ALL,
  },
  {
    id: "angkor",
    name: "Angkor",
    short: "Angkor",
    zone: "China",
    express10: true,
    priority: false,
    sundayPeak: 18,
    curve: WATER,
    crowdElasticity: 1,
    expressWait: 4,
    opens: "11:30 (si abre)",
    qtAvg2026: 15,
    thrillSept21: 15,
    statusNote:
      "Parque Temático (sept. 2026): cerrada el resto de 2026; no vuelve hasta 2027. El Express 10 puede sustituirla por otra.",
    statusByDay: {
      sun: "likely-closed",
      mon: "likely-closed",
      tue: "likely-closed",
    },
  },
  {
    id: "street",
    name: "Street Mission",
    short: "Street Mission",
    zone: "SésamoAventura",
    express10: false,
    priority: true,
    sundayPeak: 38,
    curve: STANDARD,
    crowdElasticity: 0.85,
    expressWait: null,
    opens: "10:30",
    qtAvg2026: 27,
    thrillSept21: 31,
    statusByDay: OPEN_ALL,
  },
  {
    id: "tomahawk",
    name: "Tomahawk",
    short: "Tomahawk",
    zone: "Far West",
    express10: false,
    priority: false,
    sundayPeak: 24,
    curve: TOMAHAWK,
    crowdElasticity: 0.9,
    expressWait: null,
    opens: "12:00",
    qtAvg2026: 24,
    thrillSept21: 28,
    statusByDay: OPEN_ALL,
  },
];

/** Factor de afluencia respecto al domingo (42 %). */
const DAY_CROWD_FACTOR: Record<DayId, number> = {
  sun: 1,
  mon: 30 / 42,
  tue: 24 / 42,
};

function roundWait(n: number): number {
  return Math.max(5, Math.round(n / 5) * 5);
}

function isOpen(ride: Ride, day: DayId): boolean {
  const s = ride.statusByDay[day];
  return s === "open" || s === "weekend-only";
}

export function estimateNormalWait(
  ride: Ride,
  day: DayId,
  hour: Hour
): number | null {
  if (!isOpen(ride, day)) return null;
  const factor = ride.curve[hour];
  if (factor == null) return null;
  const crowd =
    0.55 + 0.45 * Math.pow(DAY_CROWD_FACTOR[day], ride.crowdElasticity);
  return roundWait(ride.sundayPeak * factor * crowd);
}

export function estimateExpressWait(
  ride: Ride,
  day: DayId,
  hour: Hour
): number | null {
  if (day !== "sun") return null;
  if (!ride.express10 || ride.expressWait == null) return null;
  if (estimateNormalWait(ride, day, hour) == null) return null;
  const normal = estimateNormalWait(ride, day, hour);
  if (normal == null) return null;
  // En ~42 % la cola Express suele ser corta, no cero (escaneo + merge).
  // Sube un poco en horas pico.
  if (ride.id === "templo") return normal >= 30 ? 8 : 5;
  if (normal >= 45) return 5;
  if (normal >= 30) return 4;
  return ride.expressWait;
}

export type Cell = {
  hour: Hour;
  normal: number | null;
  express: number | null;
  tone: WaitTone | "closed";
  status: RideStatus;
};

export function toneForWaits(value: number, all: number[]): WaitTone {
  const min = Math.min(...all);
  const max = Math.max(...all);
  if (min === max) return "green";
  const t = (value - min) / (max - min);
  if (t <= 0.12) return "green";
  if (t <= 0.38) return "greenLight";
  if (t <= 0.62) return "yellow";
  if (t <= 0.85) return "orange";
  return "red";
}

export function rideRow(ride: Ride, day: DayId): Cell[] {
  const hours = DAYS[day].hours;
  const normals = hours
    .map((h) => estimateNormalWait(ride, day, h))
    .filter((n): n is number => n != null);
  return hours.map((hour) => {
    const status = ride.statusByDay[day];
    const normal = estimateNormalWait(ride, day, hour);
    const express =
      day === "sun" ? estimateExpressWait(ride, day, hour) : null;
    if (normal == null) {
      return { hour, normal: null, express: null, tone: "closed", status };
    }
    return {
      hour,
      normal,
      express,
      tone: toneForWaits(normal, normals),
      status,
    };
  });
}

export function bestHours(
  ride: Ride,
  day: DayId
): { hours: Hour[]; wait: number } | null {
  const cells = rideRow(ride, day).filter((c) => c.normal != null);
  if (cells.length === 0) return null;
  const min = Math.min(...cells.map((c) => c.normal as number));
  return {
    hours: cells.filter((c) => c.normal === min).map((c) => c.hour),
    wait: min,
  };
}

export function formatBest(ride: Ride, day: DayId): string {
  const b = bestHours(ride, day);
  if (!b) return "No opera";
  if (b.hours.length === 1) return `${b.hours[0]} (${b.wait} min)`;
  return `${b.hours.join(" / ")} (${b.wait} min)`;
}

export const TONE_CLASS: Record<WaitTone | "closed", string> = {
  green: "bg-emerald-500 text-white",
  greenLight: "bg-emerald-200 text-emerald-950",
  yellow: "bg-amber-300 text-amber-950",
  orange: "bg-orange-400 text-orange-950",
  red: "bg-red-500 text-white",
  closed: "bg-zinc-200 text-zinc-500",
};

export const TONE_LABEL: Record<WaitTone | "closed", string> = {
  green: "Mejor ventana",
  greenLight: "Muy buena",
  yellow: "Moderada",
  orange: "Alta",
  red: "Peor momento",
  closed: "Cerrada / no opera",
};

/** Totales Express 10 del domingo según itinerario óptimo (no hora punta). */
export const EXPRESS_ITINERARY_USES: {
  rideId: RideId;
  hour: Hour;
}[] = [
  { rideId: "rapids", hour: "11:00" },
  { rideId: "stampida", hour: "11:00" },
  { rideId: "silver", hour: "12:00" },
  { rideId: "diablo", hour: "12:00" },
  { rideId: "templo", hour: "12:00" },
  { rideId: "shambhala", hour: "13:00" },
  { rideId: "khan", hour: "13:00" },
  { rideId: "tutuki", hour: "13:00" },
  { rideId: "furius", hour: "14:00" },
];

export function expressSavings() {
  const rows = EXPRESS_ITINERARY_USES.map(({ rideId, hour }) => {
    const ride = RIDES.find((r) => r.id === rideId)!;
    const normal = estimateNormalWait(ride, "sun", hour) ?? 0;
    const express = estimateExpressWait(ride, "sun", hour);
    const exp = express ?? 0;
    return {
      ride,
      hour,
      normal,
      express: express,
      saved: express == null ? 0 : normal - exp,
      available: isOpen(ride, "sun"),
    };
  });
  const usable = rows.filter((r) => r.available && r.express != null);
  const totalNormal = usable.reduce((s, r) => s + r.normal, 0);
  const totalExpress = usable.reduce((s, r) => s + (r.express ?? 0), 0);
  const totalSaved = totalNormal - totalExpress;
  return { rows, totalNormal, totalExpress, totalSaved, used: usable.length };
}

export function peakIfNoExpress() {
  const expressRides = RIDES.filter(
    (r) => r.express10 && isOpen(r, "sun") && r.statusByDay.sun !== "likely-closed"
  );
  const rows = expressRides.map((ride) => {
    const cells = rideRow(ride, "sun").filter((c) => c.normal != null);
    const worst = cells.reduce((a, b) =>
      (a.normal ?? 0) >= (b.normal ?? 0) ? a : b
    );
    const express = estimateExpressWait(ride, "sun", worst.hour) ?? 0;
    return {
      ride,
      hour: worst.hour,
      normal: worst.normal ?? 0,
      express,
      saved: (worst.normal ?? 0) - express,
    };
  });
  const totalNormal = rows.reduce((s, r) => s + r.normal, 0);
  const totalExpress = rows.reduce((s, r) => s + r.express, 0);
  return { rows, totalNormal, totalExpress, totalSaved: totalNormal - totalExpress };
}

export const ZONES = [
  {
    name: "Mediterrània",
    walk: "Entrada · Furius Baco",
    to: "4 min → Polynesia · 8–12 min → Far West · 10 min → China",
  },
  {
    name: "Polynesia",
    walk: "Tutuki Splash",
    to: "4 min → Sésamo · 4 min → Mediterrània",
  },
  {
    name: "SésamoAventura",
    walk: "Street Mission",
    to: "5 min → China · 4 min → Polynesia",
  },
  {
    name: "China",
    walk: "Shambhala · Dragon Khan · Angkor",
    to: "5 min → México · 5 min → Sésamo",
  },
  {
    name: "México",
    walk: "Hurakan Condor · El Diablo · Templo del Fuego",
    to: "6 min → Far West · 5 min → China",
  },
  {
    name: "Far West",
    walk: "Uncharted · Stampida · Silver River · Grand Canyon · Tomahawk",
    to: "8–12 min → Mediterrània (entrada) · 6 min → México",
  },
];
