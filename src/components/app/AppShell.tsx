"use client";

import { FollowItinerary } from "./FollowItinerary";
import { WaitCards } from "./WaitCards";
import { TabDias } from "./TabDias";
import { TabFerrari } from "./TabFerrari";
import { TabMas } from "./TabMas";
import { BottomNav } from "./BottomNav";
import { VisitProvider, useVisit } from "./VisitProvider";

function Screen() {
  const { tab, dayMeta } = useVisit();
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
          <div className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold">
            {dayMeta.label}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-3 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3">
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
  if (tab === "ruta") return "Tu ruta";
  if (tab === "colas") return "Colas";
  if (tab === "dias") return "Los 3 días";
  if (tab === "ferrari") return "Ferrari Land";
  return "Más";
}

export function AppShell() {
  return (
    <VisitProvider>
      <Screen />
    </VisitProvider>
  );
}
