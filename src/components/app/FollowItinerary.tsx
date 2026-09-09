"use client";

import { Badge } from "@/components/ui/badge";
import { ITINERARIES, type ItineraryStep } from "@/data/itineraries";
import { cn } from "@/lib/utils";
import {
  Check,
  ChevronDown,
  FerrisWheel,
  Footprints,
  Info,
  RotateCcw,
  Ticket,
  Undo2,
  Utensils,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DayChips } from "./DayChips";
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

export function FollowItinerary() {
  const { day, dayMeta, done, markDone, undo, resetDay } = useVisit();
  const steps = ITINERARIES[day];
  const doneSet = useMemo(() => new Set(done), [done]);
  const current = steps.findIndex((_, i) => !doneSet.has(i));
  const atEnd = current === -1;
  const step = atEnd ? steps[steps.length - 1] : steps[current];
  const next = !atEnd ? steps[current + 1] : undefined;
  const [showDone, setShowDone] = useState(false);

  return (
    <div className="space-y-3">
      <DayChips />
      <p className="text-center text-[12px] text-zinc-500">{SUBTITLES[day]}</p>
      <p className="text-center text-[12px] text-zinc-500">
        {dayMeta.parkHours} · {dayMeta.crowdQueueTimesEs}% afluencia
      </p>

      <div className="rounded-2xl bg-teal-900 p-4 text-white shadow-lg">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wide text-amber-300 uppercase">
          <span>{atEnd ? "Día completado" : "Ahora"}</span>
          <span>
            {done.length}/{steps.length}
          </span>
        </div>
        {!atEnd && (
          <>
            <div className="mt-2 text-4xl font-bold tabular-nums leading-none">
              {step.time}
            </div>
            <div className="mt-2 text-xl font-bold leading-tight">
              {step.title}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[13px] text-teal-100">
              {step.zone && <span>{step.zone}</span>}
              {step.express && (
                <Badge className="h-5 bg-amber-400 px-1.5 text-[10px] text-teal-950">
                  Express
                </Badge>
              )}
            </div>
            {step.wait && (
              <div className="mt-3 rounded-xl bg-white/10 px-3 py-2 text-[15px]">
                Cola est.{" "}
                <span className="font-bold">{step.wait}</span>
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
            {step.note && (
              <p className="mt-2 text-[13px] leading-snug text-teal-100">
                {step.note}
              </p>
            )}
            {next && (
              <div className="mt-3 border-t border-white/15 pt-3 text-[13px] text-teal-100">
                Después:{" "}
                <span className="font-semibold text-white">
                  {next.time} {next.title}
                </span>
              </div>
            )}
            <button
              type="button"
              onClick={() => markDone(current)}
              className="mt-4 flex min-h-12 w-full cursor-pointer touch-manipulation items-center justify-center gap-2 rounded-xl bg-amber-400 text-base font-bold text-teal-950 active:scale-[0.99]"
            >
              <Check className="size-5" />
              Hecho · siguiente
            </button>
          </>
        )}
        {atEnd && (
          <p className="mt-3 text-[15px] text-teal-50">
            Has marcado todos los pasos de {dayMeta.label}. Puedes reiniciar
            el día o revisar las colas.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={undo}
          disabled={done.length === 0}
          className="flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-1 rounded-xl bg-white text-[13px] font-semibold ring-1 ring-zinc-200 disabled:opacity-40"
        >
          <Undo2 className="size-4" />
          Deshacer
        </button>
        <button
          type="button"
          onClick={resetDay}
          className="flex min-h-11 flex-1 touch-manipulation items-center justify-center gap-1 rounded-xl bg-white text-[13px] font-semibold ring-1 ring-zinc-200"
        >
          <RotateCcw className="size-4" />
          Reiniciar día
        </button>
      </div>

      <ol className="space-y-2">
        {steps.map((s, i) => {
          if (doneSet.has(i) && !showDone) return null;
          return (
            <StepRow
              key={`${s.time}-${i}`}
              step={s}
              active={i === current}
              done={doneSet.has(i)}
              onToggle={() => markDone(i)}
            />
          );
        })}
      </ol>

      {done.length > 0 && (
        <button
          type="button"
          onClick={() => setShowDone((v) => !v)}
          className="flex min-h-11 w-full items-center justify-center gap-1 text-[13px] font-semibold text-zinc-500"
        >
          <ChevronDown
            className={cn("size-4 transition", showDone && "rotate-180")}
          />
          {showDone ? "Ocultar hechos" : `Ver hechos (${done.length})`}
        </button>
      )}
    </div>
  );
}

function StepRow({
  step,
  active,
  done,
  onToggle,
}: {
  step: ItineraryStep;
  active: boolean;
  done: boolean;
  onToggle: () => void;
}) {
  const Icon = ICONS[step.kind];
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "flex w-full touch-manipulation gap-3 rounded-2xl p-3 text-left ring-1",
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
      </button>
    </li>
  );
}
