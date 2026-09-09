"use client";

import { FERRARI_MATRIX } from "@/data/ferrari";
import { RIDES, TONE_CLASS, isOpen, type DayId } from "@/data/wait-model";
import { advise } from "@/lib/live-plan";
import { liveTone, type LiveRideWait, type LiveWaits } from "@/lib/queue-times";
import {
  START_ZONES,
  parkZoneFrom,
  walkMinutesBetween,
  zonesFromHere,
  type StartZone,
} from "@/lib/zone-plan";
import { zonePalette } from "@/lib/zones";
import { cn } from "@/lib/utils";
import { Footprints } from "lucide-react";
import { useMemo, useState } from "react";
import { useLiveWaits } from "./useLiveWaits";
import { useVisit } from "./VisitProvider";

type Tile = {
  key: string;
  name: string;
  zone: string;
  live?: LiveRideWait;
  priority: boolean;
};

export function WaitCards() {
  const { day, done, clock } = useVisit();
  const live = useLiveWaits();
  const loading = live.loading && !live.data;
  const advised = parkZoneFrom(advise(day, done, clock).step.zone);
  const [zone, setZone] = useState<StartZone>(advised);

  const groups = useMemo(() => {
    const order = zonesFromHere(zone);
    return order
      .map((z) => ({
        zone: z,
        tiles: tilesInZone(z, day, live.data).sort(sortTiles),
      }))
      .filter((g) => g.tiles.length > 0);
  }, [zone, day, live.data]);

  const walkMin = groups.reduce((n, group, i) => {
    if (i === 0) {
      return zone === "Hotel El Paso"
        ? n + walkMinutesBetween("Hotel El Paso", group.zone)
        : n;
    }
    return n + walkMinutesBetween(groups[i - 1].zone, group.zone);
  }, 0);
  const rideCount = groups.reduce((n, g) => n + g.tiles.length, 0);

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-2 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
          Tu es où ?
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {START_ZONES.map((z) => {
            const pal = zonePalette(z);
            const active = z === zone;
            return (
              <button
                key={z}
                type="button"
                onClick={() => setZone(z)}
                className={cn(
                  "flex min-h-[3.25rem] items-center justify-center rounded-xl px-1 text-center text-[11px] font-bold uppercase leading-tight tracking-wide touch-manipulation",
                  active
                    ? pal.chip
                    : "bg-white text-zinc-700 ring-1 ring-zinc-200"
                )}
              >
                {zoneShort(z)}
              </button>
            );
          })}
        </div>
      </div>

      <LiveBanner live={live.data} error={live.error} loading={live.loading} />

      <p className="text-[12px] text-zinc-500">
        {rideCount} attractions · ~{walkMin} min de marche · file la plus courte
        d’abord
      </p>

      {groups.map((group, i) => {
        const pal = zonePalette(group.zone);
        const from =
          i === 0
            ? zone === "Hotel El Paso"
              ? "Hotel El Paso"
              : null
            : groups[i - 1].zone;
        const walk =
          from && from !== group.zone
            ? walkMinutesBetween(from, group.zone)
            : 0;
        return (
          <section key={group.zone} className="space-y-2">
            {walk > 0 && from && (
              <div className="flex items-center gap-2 text-[12px] text-zinc-500">
                <Footprints className="size-3.5 shrink-0" />
                {walk} min →{" "}
                <span className="font-semibold text-zinc-700">{group.zone}</span>
              </div>
            )}
            <div
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                pal.chip
              )}
            >
              {group.zone}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {group.tiles.map((tile) => (
                <WaitTile
                  key={tile.key}
                  name={tile.name}
                  live={tile.live}
                  loading={loading}
                />
              ))}
            </div>
          </section>
        );
      })}

      <p className="text-center text-[11px] text-zinc-500">
        <a
          href="https://queue-times.com"
          className="font-semibold text-teal-800 underline"
          target="_blank"
          rel="noreferrer"
        >
          Powered by Queue-Times.com
        </a>
      </p>
    </div>
  );
}

function tilesInZone(zone: string, day: DayId, live: LiveWaits | null): Tile[] {
  if (zone === "Ferrari Land") {
    return FERRARI_MATRIX.map(
      (r): Tile => ({
        key: r.liveId,
        name: ferrariShort(r.name),
        zone: "Ferrari Land",
        live: live?.rides[r.liveId],
        priority: Boolean(r.priority),
      })
    );
  }
  return RIDES.filter((r) => r.zone === zone && isOpen(r, day)).map(
    (r): Tile => ({
      key: r.id,
      name: r.short,
      zone: r.zone,
      live: live?.rides[r.id],
      priority: r.priority,
    })
  );
}

function sortTiles(a: Tile, b: Tile): number {
  const closedA = a.live != null && !a.live.isOpen;
  const closedB = b.live != null && !b.live.isOpen;
  if (closedA !== closedB) return closedA ? 1 : -1;
  const wa = a.live?.isOpen ? a.live.wait : 99;
  const wb = b.live?.isOpen ? b.live.wait : 99;
  if (wa !== wb) return wa - wb;
  return Number(b.priority) - Number(a.priority);
}

function zoneShort(zone: StartZone): string {
  if (zone === "Hotel El Paso") return "El Paso";
  if (zone === "Mediterrània") return "Médit.";
  if (zone === "SésamoAventura") return "Sésamo";
  if (zone === "Ferrari Land") return "Ferrari";
  return zone;
}

function ferrariShort(name: string): string {
  if (name === "Ferrari Experience / Gallery") return "Gallery";
  if (name === "Maranello Grand Race") return "Maranello";
  if (name === "Junior Red Force") return "Junior RF";
  return name;
}

function WaitTile({
  name,
  live,
  loading,
}: {
  name: string;
  live?: LiveRideWait;
  loading: boolean;
}) {
  let tone = "bg-white text-zinc-800 ring-zinc-200";
  let wait: string = "—";
  if (loading) {
    wait = "…";
    tone = "bg-zinc-100 text-zinc-400 ring-zinc-200";
  } else if (live && !live.isOpen) {
    wait = "Off";
    tone = `${TONE_CLASS.closed} ring-transparent`;
  } else if (live) {
    wait = String(live.wait);
    tone = `${TONE_CLASS[liveTone(live.wait)]} ring-transparent`;
  }

  return (
    <article
      className={cn(
        "grid min-h-[4.75rem] grid-rows-[auto_1fr] rounded-xl px-1.5 py-1.5 ring-1",
        tone
      )}
    >
      <div className="text-center text-[13px] font-bold uppercase leading-tight tracking-wide line-clamp-2">
        {name}
      </div>
      <div className="flex items-center justify-center text-[22px] font-bold tabular-nums leading-none">
        {live?.isOpen ? (
          <>
            {live.wait}
            <span className="text-[10px] font-semibold"> min</span>
          </>
        ) : (
          wait
        )}
      </div>
    </article>
  );
}

function LiveBanner({
  live,
  error,
  loading,
}: {
  live: LiveWaits | null;
  error: boolean;
  loading: boolean;
}) {
  if (loading && !live) {
    return (
      <p className="rounded-2xl bg-teal-900 px-3 py-2 text-[13px] font-semibold text-white">
        Chargement des files en direct…
      </p>
    );
  }
  if (error && !live) {
    return (
      <p className="rounded-2xl bg-zinc-200 px-3 py-2 text-[13px] font-semibold text-zinc-700">
        Temps réels indisponibles.
      </p>
    );
  }
  if (!live) return null;
  return (
    <p className="rounded-2xl bg-teal-900 px-3 py-2 text-[13px] font-semibold text-white">
      En direct
      {live.updatedLabel ? ` · maj ${live.updatedLabel}` : ""}
    </p>
  );
}
