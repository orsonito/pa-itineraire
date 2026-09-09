"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  bestHours,
  DAYS,
  RIDES,
  type DayId,
  type Ride,
} from "@/data/wait-model";
import { cn } from "@/lib/utils";

function bestDayFor(ride: Ride): { day: DayId; wait: number; hours: string } {
  const options = (["sun", "mon", "tue"] as DayId[])
    .map((day) => {
      const b = bestHours(ride, day);
      return b ? { day, wait: b.wait, hours: b.hours.join(" / ") } : null;
    })
    .filter((x): x is { day: DayId; wait: number; hours: string } => x != null);
  if (options.length === 0) {
    return { day: "tue", wait: 999, hours: "No opera" };
  }
  options.sort((a, b) => a.wait - b.wait || (a.day === "tue" ? -1 : 1));
  return options[0];
}

export function GlobalMatrix() {
  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          Comparativa de los tres días
        </CardTitle>
        <p className="text-[12px] font-normal text-zinc-500">
          Mejor ventana de cada día (estimación). El color de «Mejor día» mira
          la cola más baja de esa atracción entre el 20, 21 y 22.
        </p>
      </CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="bg-zinc-900 text-white">
              <th className="px-3 py-2 text-left text-[11px]">Atracción</th>
              <th className="px-2 py-2 text-left text-[11px]">Mejor 20/09</th>
              <th className="px-2 py-2 text-center text-[11px]">Cola</th>
              <th className="px-2 py-2 text-left text-[11px]">Mejor 21/09</th>
              <th className="px-2 py-2 text-center text-[11px]">Cola</th>
              <th className="px-2 py-2 text-left text-[11px]">Mejor 22/09</th>
              <th className="px-2 py-2 text-center text-[11px]">Cola</th>
              <th className="px-3 py-2 text-left text-[11px]">Mejor día</th>
            </tr>
          </thead>
          <tbody>
            {RIDES.map((ride) => {
              const sun = bestHours(ride, "sun");
              const mon = bestHours(ride, "mon");
              const tue = bestHours(ride, "tue");
              const winner = bestDayFor(ride);
              const waits = [sun, mon, tue]
                .map((x) => x?.wait)
                .filter((n): n is number => n != null);
              const min = waits.length ? Math.min(...waits) : null;
              return (
                <tr key={ride.id} className="border-t border-zinc-100">
                  <td className="px-3 py-2">
                    <span className={cn(ride.priority && "font-bold")}>
                      {ride.name}
                    </span>
                    {ride.express10 && (
                      <span className="ml-1 text-[10px] text-amber-700">
                        EX10
                      </span>
                    )}
                  </td>
                  <DayCols b={sun} isMin={sun?.wait === min} />
                  <DayCols b={mon} isMin={mon?.wait === min} />
                  <DayCols b={tue} isMin={tue?.wait === min} />
                  <td className="px-3 py-2 font-bold text-emerald-800">
                    {winner.hours === "No opera"
                      ? "No opera"
                      : `${DAYS[winner.day].label} · ${winner.hours} (${winner.wait} min)`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function DayCols({
  b,
  isMin,
}: {
  b: ReturnType<typeof bestHours>;
  isMin: boolean;
}) {
  if (!b) {
    return (
      <>
        <td className="px-2 py-2 text-[12px] text-zinc-400">No opera</td>
        <td className="px-2 py-2 text-center text-zinc-400">—</td>
      </>
    );
  }
  return (
    <>
      <td className="px-2 py-2 text-[12px]">{b.hours.join(" / ")}</td>
      <td
        className={cn(
          "px-2 py-2 text-center tabular-nums",
          isMin && "font-bold text-emerald-700"
        )}
      >
        {b.wait} min
      </td>
    </>
  );
}
