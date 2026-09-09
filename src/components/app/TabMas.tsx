"use client";

import { Badge } from "@/components/ui/badge";
import { SOURCES } from "@/data/sources";
import { ZONES, expressSavings, peakIfNoExpress } from "@/data/wait-model";
import { advise } from "@/lib/live-plan";
import { cn } from "@/lib/utils";
import { zonePalette, zonesMatch } from "@/lib/zones";
import { Download } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";
import { ZoneTag } from "./ZoneMark";
import { useVisit } from "./VisitProvider";

type BeforeInstall = Event & { prompt: () => Promise<void> };

function standaloneSubscribe(cb: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

export function TabMas() {
  const savings = expressSavings();
  const peak = peakIfNoExpress();
  const { day, done, clock } = useVisit();
  const hereZone = advise(day, done, clock).step.zone;
  const installed = useSyncExternalStore(
    standaloneSubscribe,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );
  const [install, setInstall] = useState<BeforeInstall | null>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstall(e as BeforeInstall);
    };
    const onInstalled = () => setInstall(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-[13px] text-amber-950">
        <strong>No son datos oficiales.</strong> Las colas son estimaciones
        (±10–15 min). Sigue el <em>orden</em> de la ruta, no el reloj al
        minuto. Confirma en la app de PortAventura.
      </div>

      {!installed && (
        <button
          type="button"
          onClick={() => install?.prompt()}
          className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-2xl bg-teal-800 text-sm font-bold text-white"
        >
          <Download className="size-4" />
          {install
            ? "Instalar en el teléfono"
            : "En iPhone: Compartir → Añadir a pantalla de inicio"}
        </button>
      )}

      <section className="rounded-2xl bg-white p-4 ring-1 ring-zinc-200">
        <h2 className="font-bold">Ahorro Express 10 · domingo</h2>
        <p className="mt-1 text-[12px] text-zinc-500">
          Express ≠ 0 min (3–8 min). Angkor prevista cerrada → 9 de 10.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[11px] text-zinc-500">Normal</div>
            <div className="font-bold">{savings.totalNormal} min</div>
          </div>
          <div>
            <div className="text-[11px] text-zinc-500">Express</div>
            <div className="font-bold">{savings.totalExpress} min</div>
          </div>
          <div>
            <div className="text-[11px] text-zinc-500">Ahorras</div>
            <div className="font-bold text-emerald-700">
              {savings.totalSaved} min
            </div>
          </div>
        </div>
        <p className="mt-2 text-[12px] text-zinc-500">
          En hora punta sin plan: {peak.totalSaved} min de ahorro teórico.
        </p>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Zonas</h2>
        <div className="space-y-2">
          {ZONES.map((z) => {
            const here = zonesMatch(hereZone, z.name);
            return (
              <div
                key={z.name}
                className={cn(
                  "rounded-2xl bg-white p-3 ring-1",
                  here ? ["ring-2", zonePalette(z.name).ring] : "ring-zinc-200"
                )}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <ZoneTag zone={z.name} strong={here} />
                  {here && (
                    <span className="text-[10px] font-bold text-teal-800">
                      AHORA
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[12px] text-zinc-600">{z.walk}</div>
                <div className="text-[11px] text-zinc-500">{z.to}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-bold">Fuentes</h2>
        <div className="space-y-2">
          {SOURCES.map((s) => (
            <article
              key={s.url}
              className="rounded-2xl bg-white p-3 ring-1 ring-zinc-200"
            >
              <Badge variant="outline" className="text-[10px] uppercase">
                {s.kind}
              </Badge>
              <div className="mt-1 text-[13px] font-semibold">{s.title}</div>
              <a
                href={s.url}
                className="break-all text-[11px] text-teal-800 underline"
                target="_blank"
                rel="noreferrer"
              >
                {s.url}
              </a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
