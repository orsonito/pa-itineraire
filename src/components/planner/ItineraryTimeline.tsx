"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ITINERARIES, type ItineraryStep } from "@/data/itineraries";
import type { DayId } from "@/data/wait-model";
import { cn } from "@/lib/utils";
import {
  Footprints,
  Info,
  Ticket,
  Utensils,
  FerrisWheel,
} from "lucide-react";

const ICONS = {
  walk: Footprints,
  break: Utensils,
  note: Info,
  park: Ticket,
  ride: FerrisWheel,
} as const;

export function ItineraryTimeline({ day }: { day: DayId }) {
  const steps = ITINERARIES[day];
  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">
          Itinerario hora a hora
          {day === "sun" && (
            <span className="ml-2 text-sm font-normal text-zinc-500">
              · Uncharted / Hurakan / Street primero o al final · Express en el pico
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0">
        {steps.map((step, i) => (
          <Step key={`${step.time}-${i}`} step={step} last={i === steps.length - 1} />
        ))}
      </CardContent>
    </Card>
  );
}

function Step({ step, last }: { step: ItineraryStep; last: boolean }) {
  const Icon = ICONS[step.kind];
  return (
    <div className="flex gap-3">
      <div className="flex w-16 shrink-0 flex-col items-end pt-0.5">
        <span className="text-[13px] font-bold tabular-nums">{step.time}</span>
      </div>
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex size-7 items-center justify-center rounded-full",
            step.express
              ? "bg-amber-500 text-white"
              : step.priority
                ? "bg-teal-700 text-white"
                : "bg-zinc-200 text-zinc-700"
          )}
        >
          <Icon className="size-3.5" />
        </div>
        {!last && <div className="w-px flex-1 bg-zinc-200" />}
      </div>
      <div className={cn("flex-1 pb-5", last && "pb-0")}>
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={cn(
              "text-sm",
              (step.priority || step.express) && "font-bold"
            )}
          >
            {step.title}
          </span>
          {step.express && (
            <Badge className="h-5 bg-amber-500 px-1.5 text-[10px] text-white">
              Express
            </Badge>
          )}
          {step.zone && (
            <span className="text-[11px] text-zinc-500">{step.zone}</span>
          )}
        </div>
        <div className="mt-0.5 space-y-0.5 text-[12px] text-zinc-600">
          {step.wait && (
            <div>
              Cola: <span className="font-semibold text-zinc-800">{step.wait}</span>
            </div>
          )}
          {step.walk && (
            <div>
              Desplazamiento: {step.walk}
              {step.next ? ` → ${step.next}` : ""}
            </div>
          )}
          {step.note && <p className="text-zinc-500">{step.note}</p>}
        </div>
      </div>
    </div>
  );
}
