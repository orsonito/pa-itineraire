"use client";

import { FollowItinerary } from "./FollowItinerary";
import { WaitCards } from "./WaitCards";
import { TabAhora } from "./TabAhora";
import { TabDias } from "./TabDias";
import { TabFerrari } from "./TabFerrari";
import { TabMas } from "./TabMas";
import { BottomNav } from "./BottomNav";
import { VisitProvider, useVisit } from "./VisitProvider";
import type { TabId } from "@/lib/nav";
import type { DayId } from "@/data/wait-model";
import { advise } from "@/lib/live-plan";
import { zoneAction, zonePalette, zoneVerb } from "@/lib/zones";
import { cn } from "@/lib/utils";
import { Footprints, MapPin } from "lucide-react";

function Screen() {
  const { tab, day, dayMeta, clock, done } = useVisit();
  const step = advise(day, done, clock).step;
  const zone = step.zone;
  const pal = zonePalette(zone);
  const action = zoneAction(step.kind, step.title);
  const ZoneIcon = action === "go" ? Footprints : MapPin;
  return (
    <div className="min-h-dvh bg-[#f4efe6] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-teal-900/10 bg-teal-900 pt-[env(safe-area-inset-top)] text-white">
        <div className="flex items-center justify-between px-4 py-2.5">
          <div>
            <div className="text-[10px] font-semibold tracking-[0.16em] text-amber-300 uppercase">
              PortAventura
            </div>
            <h1 className="font-heading text-lg font-bold leading-tight">
              {tabTitle(tab)}
            </h1>
          </div>
          <div className="text-right">
            <div className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
              {dayMeta.label}
            </div>
            {tab === "ahora" && (
              <div className="mt-1 text-[11px] tabular-nums text-teal-100">
                {clock}
              </div>
            )}
          </div>
        </div>
        {zone && (tab === "ahora" || tab === "colas") && (
          <div className="flex items-center gap-2 px-4 pb-2.5">
            <span
              className={cn(
                "inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold",
                pal.header
              )}
            >
              <ZoneIcon className="size-3.5" aria-hidden />
              {zoneVerb(action)} {zone}
            </span>
          </div>
        )}
      </header>

      <main className="mx-auto max-w-lg px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3">
        {tab === "ahora" && <TabAhora />}
        {tab === "ruta" && <FollowItinerary />}
        {tab === "colas" && <WaitCards />}
        {tab === "dias" && <TabDias />}
        {tab === "ferrari" && <TabFerrari />}
        {tab === "mas" && <TabMas />}
      </main>

      <BottomNav />
    </div>
  );
}

function tabTitle(tab: string) {
  if (tab === "ahora") return "Recomendación";
  if (tab === "ruta") return "Tu ruta";
  if (tab === "colas") return "Colas";
  if (tab === "dias") return "Los 3 días";
  if (tab === "ferrari") return "Ferrari Land";
  return "Más";
}

export function AppShell({
  tab,
  day,
  allDone,
  clock,
  open,
}: {
  tab: TabId;
  day: DayId;
  allDone: Record<DayId, number[]>;
  clock: string;
  open: number | null;
}) {
  return (
    <VisitProvider
      tab={tab}
      day={day}
      allDone={allDone}
      clock={clock}
      open={open}
    >
      <Screen />
    </VisitProvider>
  );
}
