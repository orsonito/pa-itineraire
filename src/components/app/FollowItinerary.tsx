"use client";

import { useEffect, useRef, useState } from "react";
import { ITINERARIES, type ItineraryStep, type StepKind } from "@/data/itineraries";
import { type DayId, RIDES, titleHasSingleRider, type Ride } from "@/data/wait-model";
import { DAY_IDS } from "@/lib/nav";
import { cn } from "@/lib/utils";
import {
  Drama,
  FerrisWheel,
  Footprints,
  Info,
  Ticket,
  Utensils,
} from "lucide-react";
import { ExpressTag, NoExpressTag, SingleRiderTag } from "./ExpressTag";
import { DaySwipeArrows } from "./DaySwipeBar";
import { LiveWaitTag } from "./LiveWaitTag";
import { useLiveWaits } from "./useLiveWaits";
import { useVisit } from "./VisitProvider";
import { ZoneBar, ZoneTag } from "./ZoneMark";
import { zoneAction } from "@/lib/zones";
import { ridesForStep } from "@/lib/live-plan";
import { liveWaitForTitle, type LiveRideWait, type LiveWaits } from "@/lib/queue-times";

const ICONS = {
  walk: Footprints,
  break: Utensils,
  note: Info,
  park: Ticket,
  ride: FerrisWheel,
  show: Drama,
} as const;

const KIND_LABEL: Record<StepKind, string> = {
  ride: "Attraction",
  walk: "Déplacement",
  break: "Repas / pause",
  note: "Info",
  park: "Parc",
  show: "Spectacle",
};

function proposalForStep(
  step: ItineraryStep,
  liveWaits: LiveWaits | null
): Ride | undefined {
  if (!step.propose?.length) return undefined;
  const open = RIDES.filter((r) => step.propose!.includes(r.id))
    .map((ride) => ({ ride, live: liveWaits?.rides[ride.id] as LiveRideWait | undefined }))
    .filter((x) => x.live?.isOpen);
  if (open.length === 0) return undefined;
  return [...open].sort((a, b) => a.live!.wait - b.live!.wait)[0].ride;
}

export function FollowItinerary() {
  const { day, tab, allDone, link, go, open: openFromUrl } = useVisit();
  const scrollerRef = useRef<HTMLDivElement>(null);
  const ignoreSnap = useRef(false);
  const [openByDay, setOpenByDay] = useState<Record<DayId, number | null>>({
    sun: day === "sun" ? openFromUrl : null,
    mon: day === "mon" ? openFromUrl : null,
    tue: day === "tue" ? openFromUrl : null,
  });

  const index = Math.max(0, DAY_IDS.indexOf(day));
  const prevDay = DAY_IDS[index - 1];
  const nextDay = DAY_IDS[index + 1];
  const live = useLiveWaits();

  function snapTo(id: DayId, behavior: ScrollBehavior) {
    const el = scrollerRef.current;
    if (!el) return;
    const i = DAY_IDS.indexOf(id);
    if (i < 0) return;
    el.scrollTo({ left: i * el.clientWidth, behavior });
  }

  function goDay(id: DayId | undefined) {
    if (!id) return;
    snapTo(id, "smooth");
  }

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const target = index * el.clientWidth;
    if (Math.abs(el.scrollLeft - target) <= 4) return;
    ignoreSnap.current = true;
    el.scrollTo({ left: target, behavior: "instant" });
  }, [index]);

  useEffect(() => {
    setOpenByDay((prev) =>
      prev[day] === openFromUrl ? prev : { ...prev, [day]: openFromUrl }
    );
  }, [day, openFromUrl]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const applySnap = () => {
      const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
      const id = DAY_IDS[Math.max(0, Math.min(DAY_IDS.length - 1, i))];
      if (ignoreSnap.current) {
        ignoreSnap.current = false;
        return;
      }
      if (!id || id === day) return;
      go(link(tab, id, allDone), { history: "replace", scroll: true });
    };

    let timer = 0;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(applySnap, 70);
    };
    const onResize = () => snapTo(day, "instant");

    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, [allDone, day, go, link, tab]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goDay(nextDay);
      if (e.key === "ArrowLeft") goDay(prevDay);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextDay, prevDay]);

  return (
    <div>
      <DaySwipeArrows onPrev={() => goDay(prevDay)} onNext={() => goDay(nextDay)} />
      <div
        ref={scrollerRef}
        className="-mx-5 flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {DAY_IDS.map((id) => (
          <section
            key={id}
            className="w-full min-w-full shrink-0 snap-start px-10"
            aria-hidden={id !== day}
          >
            <ol className="space-y-3">
              {ITINERARIES[id].map((s, i) => (
                <StepRow
                  key={`${s.time}-${i}`}
                  step={s}
                  htmlId={id === day ? `paso-${i}` : undefined}
                  open={openByDay[id] === i}
                  onToggle={() =>
                    setOpenByDay((prev) => ({
                      ...prev,
                      [id]: prev[id] === i ? null : i,
                    }))
                  }
                  sunday={id === "sun"}
                  liveWaits={live.data}
                />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function StepRow({
  step,
  htmlId,
  open,
  onToggle,
  sunday,
  liveWaits,
}: {
  step: ItineraryStep;
  htmlId?: string;
  open: boolean;
  onToggle: () => void;
  sunday: boolean;
  liveWaits: LiveWaits | null;
}) {
  const Icon = ICONS[step.kind];
  const proposal = proposalForStep(step, liveWaits);
  const liveRides = proposal ? [proposal] : ridesForStep(step);
  const ferrariLive = liveWaitForTitle(step.title, liveWaits);
  const title = step.propose
    ? proposal
      ? `Proposition : ${proposal.name}`
      : `Proposition : ${ridesForStep(step)
          .map((r) => r.short)
          .join(" ou ")}`
    : step.title;
  const zone = proposal?.zone ?? step.zone;
  return (
    <li id={htmlId} className="scroll-mt-28">
      <div className={cn(step.express && "express-frame")}>
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className={cn(
            "flex w-full cursor-pointer touch-manipulation flex-col rounded-2xl text-left",
            open
              ? step.express
                ? "bg-amber-50 p-3"
                : step.optional
                  ? "bg-violet-50 p-3 ring-2 ring-violet-700"
                  : "bg-teal-50 p-3 ring-2 ring-teal-700"
              : step.express
                ? "bg-white p-3"
                : step.optional
                  ? "bg-white p-3 ring-1 ring-dashed ring-violet-300"
                  : "bg-white p-3 ring-1 ring-zinc-200"
          )}
        >
        <div className="flex gap-2">
          <ZoneBar zone={zone} />
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
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1">
              <span
                className={cn(
                  "text-[15px] leading-tight",
                  (step.priority || step.express) && "font-bold"
                )}
              >
                {title}
              </span>
              {step.propose && (
                <span className="text-[10px] font-bold text-teal-800">
                  PROPOSITION
                </span>
              )}
              {step.optional && (
                <span className="text-[10px] font-bold text-violet-800">
                  OPTIONNEL
                </span>
              )}
              {step.express ? (
                <ExpressTag n={step.expressUse} />
              ) : sunday && step.kind === "ride" && !step.optional ? (
                <NoExpressTag />
              ) : null}
              {(liveRides.some((ride) => ride.singleRider) ||
                titleHasSingleRider(step.title)) && <SingleRiderTag />}
              {step.kind === "show" && (
                <span className="text-[10px] font-bold text-fuchsia-800">
                  SHOW
                </span>
              )}
              {liveRides.map((ride) => (
                <LiveWaitTag key={ride.id} live={liveWaits?.rides[ride.id]} />
              ))}
              {liveRides.length === 0 && <LiveWaitTag live={ferrariLive} />}
            </div>
            {zone && (
              <div className="mt-1">
                <ZoneTag
                  zone={zone}
                  action={zoneAction(step.kind, proposal?.name ?? step.title)}
                  strong={open}
                />
              </div>
            )}
          </div>
        </div>
        {open && (
          <div className="mt-3 space-y-2 border-t border-teal-800/15 pt-3 pl-[3.25rem]">
            <div className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
              {step.propose ? "Proposition" : step.optional ? "Optionnel" : KIND_LABEL[step.kind]}
            </div>
            {(liveRides.some((ride) => liveWaits?.rides[ride.id]) ||
              ferrariLive) && (
              <div className="text-[14px] font-semibold text-zinc-800">
                File en direct :{" "}
                {liveRides.length > 0
                  ? liveRides
                      .map((ride) => {
                        const live = liveWaits?.rides[ride.id];
                        if (!live) return null;
                        if (!live.isOpen) {
                          return liveRides.length > 1
                            ? `${ride.short} fermée`
                            : "fermée";
                        }
                        return liveRides.length > 1
                          ? `${ride.short} ${live.wait} min`
                          : `${live.wait} min`;
                      })
                      .filter(Boolean)
                      .join(" · ")
                  : ferrariLive?.isOpen
                    ? `${ferrariLive.wait} min`
                    : "fermée"}
              </div>
            )}
            {step.wait && (
              <div className="text-[14px] font-semibold text-zinc-800">
                File est. {step.wait}
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
              <p className="text-[13px] leading-snug text-zinc-700">
                {step.note}
              </p>
            )}
            {step.express && (
              <p className="text-[12px] font-semibold text-amber-800">
                Utilise Express 10
                {step.expressUse ? ` · usage ${step.expressUse}/9` : ""}.
              </p>
            )}
            {!step.note && !step.wait && !step.walk && (
              <p className="text-[13px] text-zinc-500">
                Suis l’ordre du parcours. Pas de note supplémentaire à cette étape.
              </p>
            )}
          </div>
        )}
      </button>
      </div>
    </li>
  );
}
