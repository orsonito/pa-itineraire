import { TONE_CLASS } from "@/data/wait-model";
import { liveTone, type LiveRideWait } from "@/lib/queue-times";
import { cn } from "@/lib/utils";

export function LiveWaitTag({ live }: { live?: LiveRideWait }) {
  if (!live) return null;
  if (!live.isOpen) {
    return (
      <span
        className={cn(
          "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[10px] font-bold tracking-wide uppercase",
          TONE_CLASS.closed
        )}
      >
        Fermée
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md px-1.5 text-[10px] font-bold tabular-nums tracking-wide",
        TONE_CLASS[liveTone(live.wait)]
      )}
    >
      {live.wait} min
    </span>
  );
}
