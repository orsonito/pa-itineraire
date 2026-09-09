"use client";

import { cn } from "@/lib/utils";
import {
  CalendarDays,
  Flag,
  ListOrdered,
  MoreHorizontal,
  Timer,
} from "lucide-react";
import { useVisit, type TabId } from "./VisitProvider";

const TABS: { id: TabId; label: string; icon: typeof Timer }[] = [
  { id: "ruta", label: "Ruta", icon: ListOrdered },
  { id: "colas", label: "Colas", icon: Timer },
  { id: "dias", label: "Días", icon: CalendarDays },
  { id: "ferrari", label: "Ferrari", icon: Flag },
  { id: "mas", label: "Más", icon: MoreHorizontal },
];

export function BottomNav() {
  const { tab, setTab } = useVisit();
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-teal-900/20 bg-teal-900 pb-[env(safe-area-inset-bottom)] text-teal-100"
      aria-label="Secciones"
    >
      <div className="mx-auto grid max-w-lg grid-cols-5">
        {TABS.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "flex min-h-[56px] touch-manipulation flex-col items-center justify-center gap-0.5 pt-1",
                active ? "text-amber-300" : "text-teal-200"
              )}
            >
              <Icon className={cn("size-5", active && "stroke-[2.5]")} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
