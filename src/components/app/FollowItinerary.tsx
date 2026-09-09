"use client";

import { ITINERARIES, type ItineraryStep, type StepKind } from "@/data/itineraries";
import { withDone } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  Drama,
  FerrisWheel,
  Footprints,
  Info,
  RotateCcw,
  Ticket,
  Undo2,
  Utensils,
} from "lucide-react";
import { ExpressTag, NoExpressTag } from "./ExpressTag";
import { DayChips } from "./DayChips";
import { NavLink } from "./NavLink";
import { useVisit } from "./VisitProvider";
import { ZoneBar, ZoneTag } from "./ZoneMark";
import { zoneAction } from "@/lib/zones";

const ICONS = {
  walk: Footprints,
  break: Utensils,
  note: Info,
  park: Ticket,
  ride: FerrisWheel,
  show: Drama,
} as const;

const KIND_LABEL: Record<StepKind, string> = {
  ride: "Atracción",
  walk: "Desplazamiento",
  break: "Comida / descanso",
  note: "Aviso",
  park: "Parque",
  show: "Espectáculo",
};

const SUBTITLES: Record<string, string> = {
  sun: "Express 10 · tag ámbar = úsalo · Uncharted / Hurakan / Street sin Express",
  mon: "Sin Express · a las 15:50 te vas a Ferrari Land",
  tue: "El más flojo · Uncharted 10:30 · cierra 18:00",
};

export function FollowItinerary() {
  const { tab, day, dayMeta, done, allDone, link } = useVisit();
  const steps = ITINERARIES[day];
  const doneSet = new Set(done);
  const nextIdx = steps.findIndex((_, i) => !doneSet.has(i));
  const undoHref = link(tab, day, withDone(allDone, day, done.slice(0, -1)));
  const resetHref = link(tab, day, withDone(allDone, day, []));
  const shows = steps.filter(
    (s) => s.kind === "show" || s.title.includes("Día de los Muertos")
  );

  return (
    <div className="space-y-3">
      <DayChips />
      <p className="text-center text-[12px] text-zinc-500">{SUBTITLES[day]}</p>
      <p className="text-center text-[12px] text-zinc-500">
        {dayMeta.parkHours} · {dayMeta.crowdQueueTimesEs}% afluencia
      </p>
      {shows.length > 0 && (
        <div className="rounded-2xl bg-fuchsia-50 p-3 ring-1 ring-fuchsia-200">
          <div className="text-[11px] font-semibold tracking-wide text-fuchsia-900 uppercase">
            Espectáculos (pases estimados)
          </div>
          <ul className="mt-1.5 space-y-1">
            {shows.map((s) => (
              <li key={s.time + s.title} className="text-[13px] text-fuchsia-950">
                <span className="font-bold tabular-nums">{s.time}</span>{" "}
                {s.title}
                {s.zone ? (
                  <span className="text-fuchsia-800"> · {s.zone}</span>
                ) : null}
              </li>
            ))}
          </ul>
          <p className="mt-1.5 text-[11px] text-fuchsia-800">
            Confirma el pase exacto en la app de PortAventura. Si no hay
            función, sigue la ruta de atracciones.
          </p>
        </div>
      )}

      <NavLink
        href={link("ahora", day, allDone)}
        className="flex min-h-11 w-full items-center justify-center rounded-2xl bg-teal-800 text-[14px] font-bold text-white"
      >
        ¿Qué hago ahora?
      </NavLink>

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

      <p className="text-center text-[11px] text-zinc-500">
        Toca un paso para ver la nota. Hecho está dentro.
      </p>

      <ol className="space-y-2">
        {steps.map((s, i) => (
          <StepRow
            key={`${s.time}-${i}`}
            step={s}
            doneHref={
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
            nextUp={i === nextIdx}
            done={doneSet.has(i)}
            sunday={day === "sun"}
          />
        ))}
      </ol>
    </div>
  );
}

function StepRow({
  step,
  nextUp,
  done,
  doneHref,
  sunday,
}: {
  step: ItineraryStep;
  nextUp: boolean;
  done: boolean;
  doneHref: string;
  sunday: boolean;
}) {
  const Icon = ICONS[step.kind];
  return (
    <li>
      <details
        className={cn(
          "group rounded-2xl ring-1 open:pb-0",
          nextUp && "bg-teal-50 ring-2 ring-teal-700",
          done && "bg-zinc-100 ring-zinc-200 opacity-80",
          !nextUp && !done && "bg-white ring-zinc-200"
        )}
      >
        <summary className="flex cursor-pointer touch-manipulation list-none gap-2 p-3 text-left [&::-webkit-details-marker]:hidden">
          <ZoneBar zone={step.zone} />
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
              {step.express ? (
                <ExpressTag n={step.expressUse} />
              ) : sunday && step.kind === "ride" ? (
                <NoExpressTag />
              ) : null}
              {step.kind === "show" && (
                <span className="text-[10px] font-bold text-fuchsia-800">
                  SHOW
                </span>
              )}
              {nextUp && (
                <span className="text-[10px] font-bold text-teal-800">
                  SIGUIENTE
                </span>
              )}
            </div>
            {step.zone && (
              <div className="mt-1">
                <ZoneTag
                  zone={step.zone}
                  action={zoneAction(step.kind, step.title)}
                  strong={nextUp}
                />
              </div>
            )}
          </div>
          <ChevronDown
            className="mt-2 size-5 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="space-y-2 border-t border-zinc-200/80 px-3 pb-3 pt-2">
          <div className="text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            {KIND_LABEL[step.kind]}
          </div>
          {step.wait && (
            <div className="text-[14px] font-semibold text-zinc-800">
              Cola est. {step.wait}
            </div>
          )}
          {step.walk && (
            <div className="flex items-start gap-2 text-[13px] text-zinc-600">
              <Footprints className="mt-0.5 size-4 shrink-0" />
              <span>
                {step.walk}
                {step.next ? ` → ${step.next}` : ""}
              </span>
            </div>
          )}
          {step.note && (
            <p className="text-[13px] leading-snug text-zinc-700">{step.note}</p>
          )}
          {step.express && (
            <p className="text-[12px] font-semibold text-amber-800">
              Usa Express 10
              {step.expressUse ? ` · uso ${step.expressUse}/9` : ""}.
            </p>
          )}
          {!step.note && !step.wait && !step.walk && (
            <p className="text-[13px] text-zinc-500">
              Sigue el orden de la ruta. Sin nota extra en este paso.
            </p>
          )}
          <NavLink
            href={doneHref}
            className={cn(
              "mt-1 flex min-h-11 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-xl text-[14px] font-bold",
              done
                ? "bg-white text-zinc-700 ring-1 ring-zinc-300"
                : "bg-amber-400 text-teal-950"
            )}
          >
            <Check className="size-4" />
            {done ? "Desmarcar" : "Hecho"}
          </NavLink>
        </div>
      </details>
    </li>
  );
}
