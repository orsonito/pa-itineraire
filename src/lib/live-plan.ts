import { ITINERARIES, type ItineraryStep } from "@/data/itineraries";
import {
  DAYS,
  RIDES,
  estimateExpressWait,
  estimateNormalWait,
  type DayId,
  type Hour,
} from "@/data/wait-model";
import { parseMinutes } from "./clock";

export type LiveStatus =
  | "before"
  | "on-time"
  | "late"
  | "ahead"
  | "closed"
  | "done";

export type LiveAdvice = {
  now: string;
  status: LiveStatus;
  label: string;
  headline: string;
  reason: string;
  index: number;
  step: ItineraryStep;
  next?: ItineraryStep;
  waitNow?: string;
  skipped: number;
};

const KIND_SCORE: Record<ItineraryStep["kind"], number> = {
  ride: 32,
  park: 22,
  show: 26,
  break: 16,
  walk: 8,
  note: 4,
};

function nearestHour(nowMin: number, hours: Hour[]): Hour {
  let best = hours[0];
  let bestDiff = Infinity;
  for (const h of hours) {
    const d = Math.abs(parseMinutes(h) - nowMin);
    if (d < bestDiff) {
      best = h;
      bestDiff = d;
    }
  }
  return best;
}

function rideForStep(step: ItineraryStep) {
  return RIDES.find((r) => step.title.includes(r.name));
}

function waitLine(
  day: DayId,
  step: ItineraryStep,
  nowMin: number
): string | undefined {
  const ride = rideForStep(step);
  if (!ride) return step.wait;
  const hour = nearestHour(nowMin, DAYS[day].hours);
  const normal = estimateNormalWait(ride, day, hour);
  if (normal == null) return step.wait;
  const express =
    day === "sun" ? estimateExpressWait(ride, day, hour) : null;
  if (express != null) {
    return `~${normal} min ahora (${hour}) · ${express} min Express`;
  }
  return `~${normal} min ahora (${hour})`;
}

function scoreStep(
  step: ItineraryStep,
  nowMin: number,
  closeMin: number
): number {
  const planned = parseMinutes(step.time);
  const lateBy = nowMin - planned;
  if ((step.kind === "walk" || step.kind === "note") && lateBy > 12) {
    return Number.NEGATIVE_INFINITY;
  }
  if (step.kind === "show" && lateBy > 18) {
    return Number.NEGATIVE_INFINITY;
  }
  if (planned > nowMin + 50) return Number.NEGATIVE_INFINITY;
  if (step.kind === "ride" && lateBy > 70 && nowMin < closeMin - 20) {
    return KIND_SCORE.ride - lateBy / 4;
  }
  return KIND_SCORE[step.kind] + 28 - Math.abs(lateBy) / 2;
}

export function advise(
  day: DayId,
  done: number[],
  nowLabel: string
): LiveAdvice {
  const steps = ITINERARIES[day];
  const meta = DAYS[day];
  const nowMin = parseMinutes(nowLabel);
  const openMin = parseMinutes(meta.parkOpen);
  const closeMin = parseMinutes(meta.parkClose);
  const lastMin = parseMinutes(steps[steps.length - 1].time);
  const dayEnd = Math.max(closeMin, lastMin + 25);
  const doneSet = new Set(done);
  const firstOpen = steps.findIndex((_, i) => !doneSet.has(i));

  const wrap = (
    status: LiveStatus,
    label: string,
    headline: string,
    reason: string,
    index: number,
    skipped: number
  ): LiveAdvice => {
    const step = steps[index];
    const next = steps.find(
      (s, i) => i > index && !doneSet.has(i) && i !== index
    );
    return {
      now: nowLabel,
      status,
      label,
      headline,
      reason,
      index,
      step,
      next,
      waitNow: waitLine(day, step, nowMin),
      skipped,
    };
  };

  if (firstOpen === -1) {
    return wrap(
      "done",
      "Día completado",
      "Has marcado todos los pasos",
      `Nada pendiente en ${meta.label}. Puedes reiniciar el día o mirar colas.`,
      steps.length - 1,
      0
    );
  }

  if (nowMin >= dayEnd) {
    return wrap(
      "closed",
      "Ya ha cerrado",
      `Fin de ${meta.label}`,
      `Cierre previsto ${meta.parkHours}. Si sigues dentro, últimas repeticiones o salida.`,
      steps.length - 1,
      0
    );
  }

  if (nowMin < openMin - 45) {
    return wrap(
      "before",
      "Todavía no abre",
      `Llega hacia las ${steps[0].time}`,
      `${meta.label} abre a las ${meta.parkOpen}. ${steps[0].note ?? "Sal del Hotel El Paso hacia la entrada."}`,
      firstOpen,
      0
    );
  }

  let bestIdx = firstOpen;
  let bestScore = Number.NEGATIVE_INFINITY;
  for (let i = 0; i < steps.length; i++) {
    if (doneSet.has(i)) continue;
    const s = scoreStep(steps[i], nowMin, closeMin);
    if (s > bestScore) {
      bestScore = s;
      bestIdx = i;
    }
  }

  const step = steps[bestIdx];
  const planned = parseMinutes(step.time);
  const skipped = [...Array(bestIdx).keys()].filter((i) => !doneSet.has(i))
    .length;
  const delta = nowMin - planned;

  let status: LiveStatus = "on-time";
  if (nowMin < openMin) status = "before";
  else if (delta > 18) status = "late";
  else if (delta < -15) status = "ahead";

  const label =
    status === "late"
      ? "Vas tarde · recupera aquí"
      : status === "ahead"
        ? "Vas adelantado"
        : status === "before"
          ? "Todavía no abre"
          : "Ahora mismo";

  const skipTxt =
    skipped > 0
      ? ` No vuelvas a los ${skipped} paso${skipped === 1 ? "" : "s"} de antes: a esta hora ya no compensan.`
      : "";

  let reason: string;
  if (status === "ahead") {
    reason = `Son las ${nowLabel}. El plan marca esto a las ${step.time}. Puedes ir ya o usar el margen.`;
  } else if (status === "late") {
    reason = `Son las ${nowLabel}. El horario iba por las ${step.time}, pero esto es lo que más rinde ahora.${skipTxt}`;
  } else if (status === "before") {
    reason = `Son las ${nowLabel}. Parque ${meta.parkHours}. ${step.note ?? "Sal del Hotel El Paso hacia la entrada."}`;
  } else {
    reason = `Son las ${nowLabel}. Encaja con el plan de las ${step.time}.${skipTxt}`;
  }
  if (step.note && status !== "before") {
    reason = `${reason} ${step.note}`;
  }

  return wrap(status, label, step.title, reason, bestIdx, skipped);
}

export function catchUpDone(done: number[], untilIndex: number): number[] {
  const extra = [...Array(untilIndex).keys()];
  return [...new Set([...done, ...extra])].sort((a, b) => a - b);
}
