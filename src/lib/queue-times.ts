import {
  FERRARI_LAND,
  FERRARI_MATRIX,
  type FerrariRideId,
} from "@/data/ferrari";
import { madridNowLabel } from "@/lib/clock";
import type { RideId, WaitTone } from "@/data/wait-model";

export const QT_PARK_ID = 19;
export const QT_FERRARI_PARK_ID = 277;
export const QT_URL = `https://queue-times.com/parks/${QT_PARK_ID}/queue_times.json`;
export const QT_FERRARI_URL = `https://queue-times.com/parks/${QT_FERRARI_PARK_ID}/queue_times.json`;

/** IDs estables de Queue-Times (PortAventura Park). */
export const QT_RIDE_IDS: Record<RideId, number> = {
  uncharted: 12121,
  furius: 600,
  shambhala: 615,
  khan: 593,
  hurakan: 602,
  stampida: 617,
  silver: 616,
  tutuki: 621,
  templo: 13380,
  diablo: 595,
  rapids: 601,
  angkor: 12115,
  street: 13397,
  tomahawk: 620,
  kontiki: 12140,
  volpaiute: 622,
  yucatan: 626,
  serpiente: 613,
};

/** IDs estables de Queue-Times (Ferrari Land). */
export const QT_FERRARI_RIDE_IDS: Record<FerrariRideId, number> = {
  redforce: 6854,
  thrilltowers: 6856,
  flyingdreams: 13393,
  maranello: 6857,
  racinglegends: 6858,
  ferrarigallery: 12540,
  juniorredforce: 6865,
};

export type LiveRideId = RideId | FerrariRideId;

export type LiveRideWait = {
  wait: number;
  isOpen: boolean;
  lastUpdated: string | null;
};

export type LiveWaits = {
  rides: Partial<Record<LiveRideId, LiveRideWait>>;
  updatedAt: string | null;
  updatedLabel: string | null;
};

type QtRide = {
  id: number;
  name: string;
  is_open: boolean;
  wait_time: number;
  last_updated?: string;
};

type QtPayload = {
  lands?: { rides?: QtRide[] }[];
  rides?: QtRide[];
};

const ID_TO_LIVE = {
  ...Object.fromEntries(
    (Object.entries(QT_RIDE_IDS) as [RideId, number][]).map(([id, qt]) => [qt, id])
  ),
  ...Object.fromEntries(
    (Object.entries(QT_FERRARI_RIDE_IDS) as [FerrariRideId, number][]).map(
      ([id, qt]) => [qt, id]
    )
  ),
} as Record<number, LiveRideId>;

function flatten(data: QtPayload | null | undefined): QtRide[] {
  if (!data) return [];
  const out: QtRide[] = [...(data.rides ?? [])];
  for (const land of data.lands ?? []) {
    out.push(...(land.rides ?? []));
  }
  return out;
}

function ingest(
  data: QtPayload | null | undefined,
  rides: Partial<Record<LiveRideId, LiveRideWait>>,
  latest: string | null
): string | null {
  for (const ride of flatten(data)) {
    const id = ID_TO_LIVE[ride.id];
    if (!id) continue;
    const lastUpdated = ride.last_updated ?? null;
    rides[id] = {
      wait: ride.wait_time,
      isOpen: ride.is_open,
      lastUpdated,
    };
    if (lastUpdated && (!latest || lastUpdated > latest)) latest = lastUpdated;
  }
  return latest;
}

export function parseQueueTimes(
  pa: QtPayload | null | undefined,
  ferrari?: QtPayload | null
): LiveWaits {
  const rides: Partial<Record<LiveRideId, LiveRideWait>> = {};
  let latest: string | null = null;
  latest = ingest(pa, rides, latest);
  latest = ingest(ferrari, rides, latest);
  return {
    rides,
    updatedAt: latest,
    updatedLabel: latest ? madridNowLabel(new Date(latest)) : null,
  };
}

export function liveWaitForTitle(
  title: string,
  live: LiveWaits | null
): LiveRideWait | undefined {
  if (!live) return undefined;
  const fromItinerary = FERRARI_LAND.itinerary.find((r) =>
    title.includes(r.name)
  );
  if (fromItinerary) return live.rides[fromItinerary.liveId];
  const fromMatrix = FERRARI_MATRIX.find((r) => title.includes(r.name));
  if (fromMatrix) return live.rides[fromMatrix.liveId];
  return undefined;
}

export function liveTone(wait: number): WaitTone {
  if (wait <= 10) return "green";
  if (wait <= 20) return "greenLight";
  if (wait <= 35) return "yellow";
  if (wait <= 50) return "orange";
  return "red";
}
