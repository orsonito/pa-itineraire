"use client";

import { FERRARI_LAND, FERRARI_MATRIX } from "@/data/ferrari";
import { TONE_CLASS, type WaitTone } from "@/data/wait-model";
import { href } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";

export function TabFerrari() {
  const { allDone, at } = useVisit();
  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-red-800 p-4 text-white">
        <div className="text-[11px] font-semibold tracking-wide text-red-200 uppercase">
          Solo el lunes 21
        </div>
        <h2 className="mt-1 text-2xl font-bold">Ferrari Land</h2>
        <p className="mt-1 text-[14px] text-red-100">
          {FERRARI_LAND.hours} · afluencia ~{FERRARI_LAND.crowdQueueTimes}% · tu
          Express 10 de PortAventura <strong>no vale</strong>
        </p>
        <NavLink
          href={href("ruta", "mon", allDone, at)}
          className="mt-3 flex min-h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-white text-sm font-bold text-red-800"
        >
          Ver en la ruta del lunes
        </NavLink>
      </div>

      <ol className="space-y-2">
        {FERRARI_LAND.itinerary.map((r) => (
          <li
            key={r.name + r.hour}
            className="flex gap-3 rounded-2xl bg-white p-3 ring-1 ring-zinc-200"
          >
            <div className="w-14 shrink-0 text-[16px] font-bold tabular-nums">
              {r.hour}
            </div>
            <div>
              <div className={cn("text-[15px]", r.priority && "font-bold")}>
                {r.name}
              </div>
              <div className="text-[13px] font-semibold text-zinc-800">
                {r.wait} min
              </div>
              {r.note && (
                <p className="mt-0.5 text-[12px] text-zinc-500">{r.note}</p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <div>
        <h3 className="mb-2 text-sm font-bold">Colas por hora (lunes)</h3>
        <div className="space-y-2">
          {FERRARI_MATRIX.map((row) => {
            const vals = row.waits.map((w) => w.wait);
            const min = Math.min(...vals);
            const max = Math.max(...vals);
            return (
              <article
                key={row.name}
                className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200"
              >
                <div className={cn("text-[14px]", row.priority && "font-bold")}>
                  {row.name}
                </div>
                <div className="-mx-1 mt-2 flex gap-1 overflow-x-auto">
                  {row.waits.map((w) => {
                    const t: WaitTone =
                      max === min
                        ? "green"
                        : (w.wait - min) / (max - min) <= 0.12
                          ? "green"
                          : (w.wait - min) / (max - min) <= 0.38
                            ? "greenLight"
                            : (w.wait - min) / (max - min) <= 0.62
                              ? "yellow"
                              : (w.wait - min) / (max - min) <= 0.85
                                ? "orange"
                                : "red";
                    return (
                      <div
                        key={w.hour}
                        className={cn(
                          "w-14 shrink-0 rounded-lg py-1.5 text-center",
                          TONE_CLASS[t]
                        )}
                      >
                        <div className="text-[10px]">{w.hour}</div>
                        <div className="text-[12px] font-bold">{w.wait}</div>
                      </div>
                    );
                  })}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
