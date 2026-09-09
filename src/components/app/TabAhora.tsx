"use client";

import { Badge } from "@/components/ui/badge";
import { ITINERARIES } from "@/data/itineraries";
import { withDone } from "@/lib/nav";
import { advise, catchUpDone } from "@/lib/live-plan";
import { Check, Compass, Footprints, RotateCcw, Undo2 } from "lucide-react";
import { ExpressTag, NoExpressTag } from "./ExpressTag";
import { DayChips } from "./DayChips";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";
import { ZoneBanner, ZoneTag } from "./ZoneMark";

export function TabAhora() {
  const { tab, day, dayMeta, done, allDone, clock, link } = useVisit();
  const steps = ITINERARIES[day];
  const advice = advise(day, done, clock);
  const atEnd = advice.status === "done";
  const step = advice.step;
  const next = advice.next;
  const markHref = link(
    tab,
    day,
    withDone(allDone, day, [...done, advice.index])
  );
  const skipHref = link(
    tab,
    day,
    withDone(allDone, day, catchUpDone(done, advice.index))
  );
  const undoHref = link(tab, day, withDone(allDone, day, done.slice(0, -1)));
  const resetHref = link(tab, day, withDone(allDone, day, []));
  const upcoming = steps
    .map((s, i) => ({ s, i }))
    .filter(({ i }) => i > advice.index && !done.includes(i))
    .slice(0, 3);

  return (
    <div className="space-y-3">
      <DayChips />
      <p className="text-center text-[12px] text-zinc-500">
        {dayMeta.parkHours} · {dayMeta.crowdQueueTimesEs}% afluencia · hora de
        Madrid
      </p>

      <div className="rounded-2xl bg-teal-900 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-amber-300 uppercase">
          <span className="inline-flex items-center gap-1.5">
            <Compass className="size-3.5" aria-hidden />
            {advice.label}
          </span>
          <span className="tabular-nums">
            {clock} · {done.length}/{steps.length}
          </span>
        </div>
        <ZoneBanner zone={step.zone} kind={step.kind} title={step.title} />
        <div className="mt-2 text-4xl font-bold tabular-nums leading-none">
          {step.time}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xl font-bold leading-tight">
          <span>{advice.headline}</span>
          {step.express ? (
            <ExpressTag n={step.expressUse} />
          ) : day === "sun" && step.kind === "ride" ? (
            <NoExpressTag className="bg-white/20 text-teal-50" />
          ) : null}
        </div>
        {step.kind === "show" && (
          <div className="mt-1">
            <Badge className="h-5 bg-fuchsia-200 px-1.5 text-[10px] text-fuchsia-950">
              Espectáculo
            </Badge>
          </div>
        )}
        {advice.waitNow && (
          <div className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-[15px]">
            Cola est. <span className="font-bold">{advice.waitNow}</span>
          </div>
        )}
        {step.walk && (
          <div className="mt-2 flex items-start gap-2 text-[14px] text-teal-50">
            <Footprints className="mt-0.5 size-4 shrink-0" />
            <span>
              {step.walk}
              {step.next ? ` → ${step.next}` : ""}
            </span>
          </div>
        )}
        <p className="mt-2 text-[13px] leading-snug text-teal-100">
          {advice.reason}
        </p>
        {next && !atEnd && (
          <div className="mt-3 border-t border-white/15 pt-3 text-[13px] text-teal-100">
            Después:{" "}
            <span className="font-semibold text-white">
              {next.time} {next.title}
            </span>
            {next.express && (
              <>
                {" "}
                <ExpressTag n={next.expressUse} />
              </>
            )}
            {next.zone && (
              <>
                {" "}
                <ZoneTag zone={next.zone} />
              </>
            )}
          </div>
        )}
        {!atEnd && advice.status !== "closed" && (
          <NavLink
            href={markHref}
            className="mt-4 flex min-h-12 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-xl bg-amber-400 text-base font-bold text-teal-950 active:scale-[0.99]"
          >
            <Check className="size-5" />
            Hecho · siguiente
          </NavLink>
        )}
        {advice.skipped > 0 && !atEnd && (
          <NavLink
            href={skipHref}
            className="mt-2 flex min-h-11 w-full items-center justify-center text-[13px] font-semibold text-amber-200"
          >
            Saltar los {advice.skipped} anteriores y seguir desde aquí
          </NavLink>
        )}
      </div>

      <div className="flex gap-2">
        {done.length === 0 ? (
          <span className="flex min-h-11 flex-1 items-center justify-center gap-1 rounded-xl bg-white text-[13px] font-semibold ring-1 ring-zinc-200 opacity-40">
            <Undo2 className="size-4" />
            Deshacer
          </span>
        ) : (
          <NavLink
            href={undoHref}
            className="flex min-h-11 flex-1 cursor-pointer touch-manipulation items-center justify-center gap-1 rounded-xl bg-white text-[13px] font-semibold ring-1 ring-zinc-200"
          >
            <Undo2 className="size-4" />
            Deshacer
          </NavLink>
        )}
        <NavLink
          href={resetHref}
          className="flex min-h-11 flex-1 cursor-pointer touch-manipulation items-center justify-center gap-1 rounded-xl bg-white text-[13px] font-semibold ring-1 ring-zinc-200"
        >
          <RotateCcw className="size-4" />
          Reiniciar día
        </NavLink>
      </div>

      {upcoming.length > 0 && !atEnd && (
        <div className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200">
          <div className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            Luego en el plan
          </div>
          <ul className="mt-2 space-y-2">
            {upcoming.map(({ s, i }) => (
              <li key={`${s.time}-${i}`} className="flex items-baseline gap-2">
                <span className="w-12 shrink-0 text-[13px] font-bold tabular-nums">
                  {s.time}
                </span>
                <span className="min-w-0 flex-1 text-[14px]">{s.title}</span>
                {s.zone && <ZoneTag zone={s.zone} />}
              </li>
            ))}
          </ul>
        </div>
      )}

      <NavLink
        href={link("ruta", day, allDone)}
        className="flex min-h-12 w-full items-center justify-center rounded-2xl bg-white text-[15px] font-bold text-teal-900 ring-1 ring-zinc-200"
      >
        Ver itinerario del día
      </NavLink>
      <p className="text-center text-[11px] text-zinc-500">
        Estimaciones, no colas en vivo. Sigue el orden, no el reloj al minuto.
      </p>
    </div>
  );
}
