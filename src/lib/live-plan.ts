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

export function ridesForStep(step: ItineraryStep) {
  if (step.propose?.length) {
    return RIDES.filter((r) => step.propose!.includes(r.id));
  }
  return RIDES.filter((r) => step.title.includes(r.name));
}

export function rideForStep(step: ItineraryStep) {
  return ridesForStep(step)[0];
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
    return `~${normal} min maintenant (${hour}) · ${express} min Express`;
  }
  return `~${normal} min maintenant (${hour})`;
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
  if (step.optional && lateBy > 8) {
    return Number.NEGATIVE_INFINITY;
  }
  if (planned > nowMin + 50) return Number.NEGATIVE_INFINITY;
  if (step.kind === "ride" && lateBy > 70 && nowMin < closeMin - 20) {
    return KIND_SCORE.ride - lateBy / 4;
  }
  const optionalPenalty = step.optional ? 16 : 0;
  return KIND_SCORE[step.kind] + 28 - optionalPenalty - Math.abs(lateBy) / 2;
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
      "Journée terminée",
      "Tu as coché toutes les étapes",
      `Rien de restant pour ${meta.label}. Tu peux relancer la journée ou regarder les files.`,
      steps.length - 1,
      0
    );
  }

  if (nowMin >= dayEnd) {
    return wrap(
      "closed",
      "C’est déjà fermé",
      `Fin de ${meta.label}`,
      `Fermeture prévue ${meta.parkHours}. Si tu es encore dedans, dernières répétitions ou sortie.`,
      steps.length - 1,
      0
    );
  }

  if (nowMin < openMin - 45) {
    return wrap(
      "before",
      "Pas encore ouvert",
      `Arrive vers ${steps[0].time}`,
      `${meta.label} ouvre à ${meta.parkOpen}. ${steps[0].note ?? "Sors de l’Hotel El Paso vers l’entrée."}`,
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
      ? "Tu es en retard · rattrape ici"
      : status === "ahead"
        ? "Tu es en avance"
        : status === "before"
          ? "Pas encore ouvert"
          : "Maintenant";

  const skipTxt =
    skipped > 0
      ? ` Ne reviens pas aux ${skipped} étape${skipped === 1 ? "" : "s"} d’avant : à cette heure, ça ne vaut plus le coup.`
      : "";

  let reason: string;
  if (status === "ahead") {
    reason = `Il est ${nowLabel}. Le plan indique ça à ${step.time}. Tu peux y aller déjà ou garder la marge.`;
  } else if (status === "late") {
    reason = `Il est ${nowLabel}. L’horaire était à ${step.time}, mais c’est ça qui rapporte le plus maintenant.${skipTxt}`;
  } else if (status === "before") {
    reason = `Il est ${nowLabel}. Parc ${meta.parkHours}. ${step.note ?? "Sors de l’Hotel El Paso vers l’entrée."}`;
  } else {
    reason = `Il est ${nowLabel}. Ça colle avec le plan de ${step.time}.${skipTxt}`;
  }
  if (step.note && status !== "before") {
    reason = `${reason} ${step.note}`;
  }

  return wrap(status, label, step.title, reason, bestIdx, skipped);
}

