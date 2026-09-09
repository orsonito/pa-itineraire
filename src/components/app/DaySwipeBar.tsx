"use client";

import { type ReactNode } from "react";
import { DAYS } from "@/data/wait-model";
import { DAY_IDS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVisit } from "./VisitProvider";

export function DaySwipeArrows({
  onPrev,
  onNext,
}: {
  onPrev: () => void;
  onNext: () => void;
}) {
  const { day } = useVisit();
  const index = DAY_IDS.indexOf(day);
  const prev = index > 0 ? DAYS[DAY_IDS[index - 1]] : null;
  const next = index < DAY_IDS.length - 1 ? DAYS[DAY_IDS[index + 1]] : null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-1/2 z-30 flex -translate-y-1/2 justify-center px-2">
      <div className="flex w-full max-w-lg items-center justify-between">
        <ArrowButton
          disabled={!prev}
          label={prev ? `Voir ${prev.label}` : "Pas de jour précédent"}
          onClick={onPrev}
        >
          <ChevronLeft className="size-4" strokeWidth={2.5} />
        </ArrowButton>
        <ArrowButton
          disabled={!next}
          label={next ? `Voir ${next.label}` : "Pas de jour suivant"}
          onClick={onNext}
        >
          <ChevronRight className="size-4" strokeWidth={2.5} />
        </ArrowButton>
      </div>
    </div>
  );
}

function ArrowButton({
  disabled,
  label,
  onClick,
  children,
}: {
  disabled: boolean;
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "pointer-events-auto flex size-8 items-center justify-center rounded-full bg-teal-800/90 text-white shadow-md backdrop-blur-sm touch-manipulation",
        disabled && "invisible"
      )}
    >
      {children}
    </button>
  );
}
