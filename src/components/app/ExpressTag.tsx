import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function ExpressTag({
  n,
  className,
}: {
  n?: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center gap-0.5 rounded-md bg-amber-400 px-1.5 text-[10px] font-bold tracking-wide text-teal-950 uppercase",
        className
      )}
    >
      <Zap className="size-3 fill-current" aria-hidden />
      {n ? `Express ${n}/9` : "Express"}
    </span>
  );
}

export function NoExpressTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 shrink-0 items-center rounded-md bg-zinc-200 px-1.5 text-[10px] font-bold tracking-wide text-zinc-600 uppercase",
        className
      )}
    >
      Sin Express
    </span>
  );
}
