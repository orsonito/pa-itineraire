"use client";

import { GlobalMatrix } from "@/components/planner/GlobalMatrix";
import { DAYS, TONE_CLASS, TONE_LABEL, type DayId, type WaitTone } from "@/data/wait-model";
import { href } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";

export function TabDias() {
  const { day, allDone } = useVisit();
  return (
    <div className="space-y-4">
      <p className="text-[13px] text-zinc-600">
        Domingo el más lleno, martes el más flojo. Toca un día para abrir su
        ruta.
      </p>
      <div className="space-y-2">
        {(Object.keys(DAYS) as DayId[]).map((id) => {
          const d = DAYS[id];
          const active = day === id;
          return (
            <NavLink
              key={id}
              href={href("ruta", id, allDone)}
              className={cn(
                "block w-full cursor-pointer touch-manipulation rounded-2xl p-4 text-left ring-1",
                active
                  ? "bg-teal-900 text-white ring-teal-900"
                  : "bg-white ring-zinc-200"
              )}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-lg font-bold">{d.label}</span>
                <span className="text-2xl font-bold">{d.crowdQueueTimesEs}%</span>
              </div>
              <div
                className={cn(
                  "mt-1 text-[13px]",
                  active ? "text-teal-100" : "text-zinc-500"
                )}
              >
                {d.parkHours} · {d.express ? "Express 10" : "sin Express"}
                {id === "mon" ? " · PA hasta 18:00 + Ferrari noche" : ""}
              </div>
            </NavLink>
          );
        })}
      </div>
      <Legend />
      <div className="-mx-3 overflow-x-auto">
        <GlobalMatrix />
      </div>
    </div>
  );
}

function Legend() {
  const tones: WaitTone[] = ["green", "greenLight", "yellow", "orange", "red"];
  return (
    <div className="flex flex-wrap gap-1.5 text-[11px]">
      {tones.map((t) => (
        <span
          key={t}
          className={cn("rounded-full px-2 py-0.5 font-medium", TONE_CLASS[t])}
        >
          {TONE_LABEL[t]}
        </span>
      ))}
    </div>
  );
}
