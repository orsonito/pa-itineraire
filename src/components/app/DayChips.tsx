"use client";

import { DAYS, type DayId } from "@/data/wait-model";
import { href } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";

export function DayChips() {
  const { tab, day, allDone } = useVisit();
  const ids: DayId[] = ["sun", "mon", "tue"];
  return (
    <div className="flex gap-2">
      {ids.map((id) => {
        const d = DAYS[id];
        const active = day === id;
        return (
          <NavLink
            key={id}
            href={href(tab, id, allDone)}
            ariaCurrent={active ? "page" : undefined}
            className={cn(
              "min-h-11 flex-1 cursor-pointer touch-manipulation rounded-xl px-2 py-2 text-center transition",
              active
                ? "bg-teal-800 text-white shadow-sm"
                : "bg-white text-zinc-700 ring-1 ring-zinc-200"
            )}
          >
            <div className="text-[13px] font-bold leading-none">{d.label}</div>
            <div
              className={cn(
                "mt-1 text-[10px]",
                active ? "text-teal-100" : "text-zinc-500"
              )}
            >
              {d.express ? "Express 10" : "Sans Express"}
            </div>
          </NavLink>
        );
      })}
    </div>
  );
}
