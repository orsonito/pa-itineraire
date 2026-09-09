"use client";

import {
  DAYS,
  RIDES,
  TONE_CLASS,
  formatBest,
  rideRow,
  type Cell,
} from "@/data/wait-model";
import { cn } from "@/lib/utils";
import { DayChips } from "./DayChips";
import { useVisit } from "./VisitProvider";

export function WaitCards() {
  const { day } = useVisit();
  const meta = DAYS[day];
  const showExpress = day === "sun";

  return (
    <div className="space-y-3">
      <DayChips />
      <p className="text-[12px] text-zinc-500">
        {showExpress
          ? "Cada recuadro: cola normal / Express (min). Color = mejor/peor hora de ESA atracción."
          : "Sin Express. Color = mejor/peor hora de esa atracción."}{" "}
        {meta.parkHours}.
      </p>
      <div className="space-y-2">
        {RIDES.map((ride) => {
          const cells = rideRow(ride, day);
          const closed = cells.every((c) => c.normal == null);
          return (
            <article
              key={ride.id}
              className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-1">
                    <h3
                      className={cn(
                        "text-[15px] leading-tight",
                        ride.priority && "font-bold"
                      )}
                    >
                      {ride.name}
                    </h3>
                    {ride.express10 && (
                      <span className="rounded bg-amber-100 px-1 text-[10px] font-bold text-amber-800">
                        EX10
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-zinc-500">{ride.zone}</div>
                </div>
                <div className="text-right text-[11px] font-bold text-emerald-800">
                  {closed ? "No opera" : formatBest(ride, day)}
                </div>
              </div>
              {closed ? (
                <p className="mt-2 text-[12px] text-zinc-500">
                  {ride.statusByDay[day] === "likely-closed"
                    ? "Prevista cerrada (Halloween / hasta 2027)."
                    : "No opera este día (previsto)."}
                </p>
              ) : (
                <div className="-mx-1 mt-2 flex gap-1 overflow-x-auto pb-1">
                  {cells.map((cell) => (
                    <HourChip
                      key={cell.hour}
                      cell={cell}
                      showExpress={showExpress}
                    />
                  ))}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}

function HourChip({
  cell,
  showExpress,
}: {
  cell: Cell;
  showExpress: boolean;
}) {
  if (cell.tone === "closed" || cell.normal == null) {
    return (
      <div className="w-14 shrink-0 rounded-lg bg-zinc-100 py-1.5 text-center text-[10px] text-zinc-400">
        <div>{cell.hour}</div>
        <div>—</div>
      </div>
    );
  }
  return (
    <div
      className={cn(
        "w-14 shrink-0 rounded-lg py-1.5 text-center",
        TONE_CLASS[cell.tone]
      )}
    >
      <div className="text-[10px] font-medium opacity-90">{cell.hour}</div>
      <div className="text-[12px] font-bold tabular-nums leading-tight">
        {showExpress
          ? `${cell.normal}/${cell.express ?? "—"}`
          : cell.normal}
      </div>
    </div>
  );
}
