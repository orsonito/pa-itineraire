"use client";

import { Badge } from "@/components/ui/badge";
import { SingleRiderTag } from "@/components/app/ExpressTag";
import {
  bestHours,
  DAYS,
  formatBest,
  RIDES,
  rideRow,
  TONE_CLASS,
  type Cell,
  type DayId,
  type Ride,
} from "@/data/wait-model";
import { cn } from "@/lib/utils";

function CellView({
  cell,
  showExpress,
}: {
  cell: Cell;
  showExpress: boolean;
}) {
  if (cell.tone === "closed" || cell.normal == null) {
    return (
      <td className="border-b border-zinc-200/80 px-1.5 py-2 text-center text-[11px] text-zinc-400">
        —
      </td>
    );
  }
  const bestTone = cell.tone === "green";
  return (
    <td
      className={cn(
        "border-b border-white/40 px-1 py-2 text-center tabular-nums",
        TONE_CLASS[cell.tone]
      )}
    >
      <span className={cn("text-[13px] leading-none", bestTone && "font-bold")}>
        {showExpress ? (
          <>
            {cell.normal}
            <span className="opacity-70"> / </span>
            {cell.express == null ? "—" : cell.express}
          </>
        ) : (
          <>{cell.normal} min</>
        )}
      </span>
    </td>
  );
}

function RideName({ ride }: { ride: Ride }) {
  return (
    <div className="min-w-[148px] max-w-[190px]">
      <div className="flex flex-wrap items-center gap-1">
        <span
          className={cn(
            "text-[13px] leading-tight",
            ride.priority && "font-bold"
          )}
        >
          {ride.name}
        </span>
        {ride.express10 && (
          <Badge
            variant="secondary"
            className="h-4 rounded-sm px-1 text-[9px] font-semibold tracking-wide"
          >
            EX10
          </Badge>
        )}
        {ride.singleRider && <SingleRiderTag />}
        {ride.optional && (
          <Badge
            variant="secondary"
            className="h-4 rounded-sm bg-violet-100 px-1 text-[9px] font-semibold tracking-wide text-violet-800"
          >
            OPT.
          </Badge>
        )}
      </div>
      <div className="text-[10px] text-zinc-500">{ride.zone}</div>
    </div>
  );
}

export function WaitTable({ day }: { day: DayId }) {
  const meta = DAYS[day];
  const showExpress = day === "sun";
  const hours = meta.hours;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="bg-zinc-900 text-white">
            <th className="sticky left-0 z-10 bg-zinc-900 px-3 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wide">
              Attraction
            </th>
            {hours.map((h) => (
              <th
                key={h}
                className="px-1.5 py-2.5 text-center text-[11px] font-semibold"
              >
                {h}
              </th>
            ))}
            <th className="px-3 py-2.5 text-left text-[11px] font-semibold">
              Meilleure heure
            </th>
          </tr>
        </thead>
        <tbody>
          {RIDES.map((ride) => {
            const cells = rideRow(ride, day);
            const best = bestHours(ride, day);
            const closedRow = cells.every((c) => c.normal == null);
            return (
              <tr key={ride.id} className="odd:bg-zinc-50/60">
                <td className="sticky left-0 z-10 border-b border-zinc-200 bg-white px-3 py-2 odd:bg-zinc-50">
                  <RideName ride={ride} />
                </td>
                {closedRow ? (
                  <td
                    colSpan={hours.length}
                    className="border-b border-zinc-200 px-3 py-2 text-center text-[12px] text-zinc-500"
                  >
                    {ride.statusByDay[day] === "likely-closed"
                      ? "Prévue FERMÉE (jusqu’en 2027) · confirmer l’app"
                      : "N’opère pas ce jour (prévu)"}
                    {ride.statusNote ? ` · ${ride.statusNote}` : null}
                  </td>
                ) : (
                  cells.map((cell) => (
                    <CellView
                      key={cell.hour}
                      cell={cell}
                      showExpress={showExpress}
                    />
                  ))
                )}
                <td className="border-b border-zinc-200 px-3 py-2 text-[12px] font-bold text-emerald-800">
                  {closedRow ? "—" : formatBest(ride, day)}
                  {best && best.hours.length > 1 ? (
                    <span className="block text-[10px] font-normal text-zinc-500">
                      égalité
                    </span>
                  ) : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
