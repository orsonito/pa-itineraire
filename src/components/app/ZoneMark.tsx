import type { StepKind } from "@/data/itineraries";
import {
  splitZones,
  zoneAction,
  zonePalette,
  zoneVerb,
  type ZoneAction,
} from "@/lib/zones";
import { cn } from "@/lib/utils";
import { Footprints, MapPin } from "lucide-react";

export function ZoneTag({
  zone,
  action,
  strong,
  className,
}: {
  zone?: string;
  action?: ZoneAction;
  strong?: boolean;
  className?: string;
}) {
  if (!zone) return null;
  const pal = zonePalette(zone);
  if (strong) {
    return (
      <span
        className={cn(
          "inline-flex h-6 items-center rounded-md px-2 text-[11px] font-bold tracking-wide",
          pal.chip,
          className
        )}
      >
        {action ? `${zoneVerb(action)} ${zone}` : zone}
      </span>
    );
  }
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-1", className)}>
      {splitZones(zone).map((part) => (
        <span
          key={part}
          className={cn(
            "inline-flex h-5 items-center rounded-md px-1.5 text-[10px] font-bold tracking-wide",
            zonePalette(part).chip
          )}
        >
          {part}
        </span>
      ))}
    </span>
  );
}

export function ZoneBanner({
  zone,
  kind,
  title,
}: {
  zone?: string;
  kind: StepKind;
  title: string;
}) {
  if (!zone) return null;
  const action = zoneAction(kind, title);
  const pal = zonePalette(zone);
  const Icon = action === "go" ? Footprints : MapPin;
  return (
    <div
      className={cn(
        "mt-3 rounded-xl px-3 py-2.5",
        pal.banner,
        pal.bannerText
      )}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase opacity-90">
        <Icon className="size-3.5" aria-hidden />
        {zoneVerb(action)}
      </div>
      <div className="text-2xl font-bold leading-tight">{zone}</div>
    </div>
  );
}

export function ZoneBar({ zone, className }: { zone?: string; className?: string }) {
  const pal = zonePalette(zone);
  return (
    <span
      className={cn("w-1.5 shrink-0 self-stretch rounded-full", pal.bar, className)}
      aria-hidden
    />
  );
}
