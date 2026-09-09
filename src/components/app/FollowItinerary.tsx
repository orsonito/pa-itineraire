"use client";

import { Badge } from "@/components/ui/badge";
import { ITINERARIES, type ItineraryStep } from "@/data/itineraries";
import { serializeDone, withDone } from "@/lib/nav";
import { advise, catchUpDone } from "@/lib/live-plan";
import { cn } from "@/lib/utils";
import {
  Check,
  Clock,
  FerrisWheel,
  Footprints,
  Info,
  RotateCcw,
  Ticket,
  Undo2,
  Utensils,
} from "lucide-react";
import { DayChips } from "./DayChips";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";

const ICONS = {
  walk: Footprints,
  break: Utensils,
  note: Info,
  park: Ticket,
  ride: FerrisWheel,
} as const;

const SUBTITLES: Record<string, string> = {
  sun: "Express 10 · Uncharted primero · Hurakan y Street al final",
  mon: "Sin Express · a las 15:50 te vas a Ferrari Land",
  tue: "El más flojo · Uncharted 10:30 · cierra 18:00",
};

const PRESETS = ["10:30", "12:00", "14:25", "16:30", "18:00"];

export function FollowItinerary() {
  const { tab, day, dayMeta, done, allDone, at, clock, link } = useVisit();
  const steps = ITINERARIES[day];
  const advice = advise(day, done, clock);
  const doneSet = new Set(done);
  const atEnd = advice.status === "done";
  const step = advice.step;
  const next = advice.next;
  const packed = serializeDone(allDone);
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
  const undoHref = link(
    tab,
    day,
    withDone(allDone, day, done.slice(0, -1))
  );
  const resetHref = link(tab, day, withDone(allDone, day, []));

  return (
    <div className="space-y-3">
      <DayChips />
      <p className="text-center text-[12px] text-zinc-500">{SUBTITLES[day]}</p>
      <p className="text-center text-[12px] text-zinc-500">
        {dayMeta.parkHours} · {dayMeta.crowdQueueTimesEs}% afluencia
      </p>

      <form
        method="get"
        action="/"
        className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200"
      >
        <input type="hidden" name="tab" value={tab} />
        <input type="hidden" name="day" value={day} />
        {packed ? <input type="hidden" name="done" value={packed} /> : null}
        <div className="flex items-center gap-2">
          <Clock className="size-4 shrink-0 text-teal-800" />
          <label className="text-[13px] font-semibold" htmlFor="at">
            ¿Qué hago a las…?
          </label>
          <input
            id="at"
            type="time"
            name="at"
            defaultValue={clock}
            className="min-h-10 flex-1 rounded-lg bg-zinc-50 px-2 text-[15px] tabular-nums ring-1 ring-zinc-200"
          />
          <button
            type="submit"
            className="min-h-10 rounded-lg bg-teal-800 px-3 text-[13px] font-bold text-white"
          >
            Ver
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {PRESETS.map((t) => (
            <NavLink
              key={t}
              href={link(tab, day, allDone, t)}
              ariaCurrent={clock === t ? "page" : undefined}
              className={cn(
                "rounded-full px-2.5 py-1 text-[12px] font-semibold tabular-nums",
                clock === t
                  ? "bg-teal-800 text-white"
                  : "bg-zinc-100 text-zinc-700"
              )}
            >
              {t}
            </NavLink>
          ))}
          <NavLink
            href={link(tab, day, allDone, null)}
            className="rounded-full px-2.5 py-1 text-[12px] font-semibold text-teal-800 ring-1 ring-teal-800/30"
          >
            Hora real
          </NavLink>
        </div>
        <p className="mt-2 text-[11px] text-zinc-500">
          Hora de Madrid. {at ? "Estás simulando." : "Según el reloj de ahora."}{" "}
          Estimaciones, no colas en vivo.
        </p>
      </form>

      <div className="rounded-2xl bg-teal-900 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-amber-300 uppercase">
          <span>{advice.label}</span>
          <span className="tabular-nums">
            {clock} · {done.length}/{steps.length}
          </span>
        </div>
        <div className="mt-2 text-4xl font-bold tabular-nums leading-none">
          {step.time}
        </div>
        <div className="mt-2 text-xl font-bold leading-tight">
          {advice.headline}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-teal-100">
          {step.zone && <span>{step.zone}</span>}
          {step.express && (
            <Badge className="h-5 bg-amber-400 px-1.5 text-[10px] text-teal-950">
              Express
            </Badge>
          )}
        </div>
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

      <ol className="space-y-2">
        {steps.map((s, i) => (
          <StepRow
            key={`${s.time}-${i}`}
            step={s}
            href={
              doneSet.has(i)
                ? link(
                    tab,
                    day,
                    withDone(
                      allDone,
                      day,
                      done.filter((x) => x !== i)
                    )
                  )
                : link(tab, day, withDone(allDone, day, [...done, i]))
            }
            active={i === advice.index}
            done={doneSet.has(i)}
          />
        ))}
      </ol>
    </div>
  );
}

function StepRow({
  step,
  active,
  done,
  href: rowHref,
}: {
  step: ItineraryStep;
  active: boolean;
  done: boolean;
  href: string;
}) {
  const Icon = ICONS[step.kind];
  return (
    <li>
      <NavLink
        href={rowHref}
        className={cn(
          "flex w-full cursor-pointer touch-manipulation gap-3 rounded-2xl p-3 text-left ring-1",
          active && "bg-teal-50 ring-2 ring-teal-700",
          done && "bg-zinc-100 ring-zinc-200 opacity-70",
          !active && !done && "bg-white ring-zinc-200"
        )}
      >
        <div className="w-12 shrink-0 pt-0.5 text-right">
          <div className="text-[15px] font-bold tabular-nums">{step.time}</div>
        </div>
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-full",
            step.express
              ? "bg-amber-400 text-teal-950"
              : step.priority
                ? "bg-teal-800 text-white"
                : "bg-zinc-200 text-zinc-700"
          )}
        >
          {done ? <Check className="size-4" /> : <Icon className="size-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1">
            <span
              className={cn(
                "text-[15px] leading-tight",
                (step.priority || step.express) && "font-bold"
              )}
            >
              {step.title}
            </span>
            {step.express && (
              <span className="text-[10px] font-bold text-amber-700">EX</span>
            )}
            {active && (
              <span className="text-[10px] font-bold text-teal-800">AHORA</span>
            )}
          </div>
          {step.zone && (
            <div className="text-[12px] text-zinc-500">{step.zone}</div>
          )}
          {step.wait && (
            <div className="text-[13px] font-semibold text-zinc-800">
              {step.wait}
            </div>
          )}
          {step.walk && (
            <div className="text-[12px] text-zinc-500">
              {step.walk}
              {step.next ? ` → ${step.next}` : ""}
            </div>
          )}
        </div>
      </NavLink>
    </li>
  );
}
