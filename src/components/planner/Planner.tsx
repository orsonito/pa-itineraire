"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { FERRARI_LAND, FERRARI_MATRIX } from "@/data/ferrari";
import { SOURCES } from "@/data/sources";
import {
  DAYS,
  expressSavings,
  peakIfNoExpress,
  RIDES,
  TONE_CLASS,
  TONE_LABEL,
  ZONES,
  type DayId,
  type WaitTone,
} from "@/data/wait-model";
import { cn } from "@/lib/utils";
import { GlobalMatrix } from "./GlobalMatrix";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { WaitTable } from "./WaitTable";

const NAV: { id: string; label: string }[] = [
  { id: "resumen", label: "Resumen" },
  { id: "domingo", label: "Dom 20" },
  { id: "lunes", label: "Lun 21" },
  { id: "martes", label: "Mar 22" },
  { id: "comparativa", label: "Comparar" },
  { id: "itinerarios", label: "Ruta" },
  { id: "ferrari", label: "Ferrari" },
  { id: "fuentes", label: "Fuentes" },
];

export function Planner() {
  const savings = expressSavings();
  const peak = peakIfNoExpress();

  return (
    <div className="min-h-screen bg-[#f4efe6] text-zinc-900">
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-[#f4efe6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-3 py-3 sm:px-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.14em] text-teal-800 uppercase">
                PortAventura World · plan de visita
              </p>
              <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                20, 21 y 22 de septiembre de 2026
              </h1>
            </div>
            <Badge className="shrink-0 bg-teal-800 text-white">
              Express 10 · solo domingo
            </Badge>
          </div>
          <nav className="-mx-1 flex gap-1 overflow-x-auto pb-1">
            {NAV.map((n) => (
              <a
                key={n.id}
                href={`#${n.id}`}
                className="shrink-0 rounded-full bg-white px-3 py-1 text-[12px] font-medium text-zinc-700 ring-1 ring-zinc-200 hover:bg-teal-800 hover:text-white"
              >
                {n.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-10 px-3 py-6 sm:px-4">
        <section id="resumen" className="scroll-mt-28 space-y-4">
          <Disclaimer />
          <div className="grid gap-3 sm:grid-cols-3">
            {(Object.keys(DAYS) as DayId[]).map((id) => (
              <CrowdCard key={id} id={id} />
            ))}
          </div>
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Qué cambió respecto a tus % (38 / 28 / 22)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[13px] leading-relaxed text-zinc-700">
              <p>
                El calendario de Parque Temático es visual (colores), no publica
                un porcentaje en el HTML. Queue-Times sí publica una previsión
                numérica para esas fechas exactas:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>20/09:</strong> tú 38 % → Queue-Times{" "}
                  <strong>42 %</strong> (EN 45 %). Es +4 puntos. Sigue siendo un
                  domingo moderado, no un día negro.
                </li>
                <li>
                  <strong>21/09:</strong> tú 28 % → <strong>30 %</strong> (EN 34 %).
                </li>
                <li>
                  <strong>22/09:</strong> tú 22 % → <strong>24 %</strong> (EN 26 %).
                </li>
              </ul>
              <p>
                El ranking no cambia: domingo más lleno, martes el más flojo.
                Las tablas usan <strong>42 / 30 / 24 %</strong> (versión ES de
                Queue-Times). No he multiplicado las colas por esos porcentajes:
                el pico de cada atracción se calibra con medias 2026 + Thrill
                Data de finales de septiembre, y luego se aplica una curva
                horaria y un factor de afluencia con suelo (las colas no caen a
                cero).
              </p>
              <p>
                <strong>Halloween</strong> empieza el 19/09/2026 (oficial). Los
                tres días son Halloween: más ambiente, posibles pasajes, y el
                agua puede recortar horario.
              </p>
              <p>
                <strong>Angkor:</strong> Parque Temático (sept. 2026) la da por
                cerrada hasta 2027. <strong>Templo del Fuego:</strong> desde el
                7/09, previsto solo sábados y domingos → útil el domingo, no el
                lunes/martes. Confirmar ambos en la app.
              </p>
            </CardContent>
          </Card>
          <Legend />
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Mapa mental del parque (desplazamientos estimados)
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {ZONES.map((z) => (
                <div
                  key={z.name}
                  className="rounded-lg bg-white p-3 ring-1 ring-zinc-200"
                >
                  <div className="text-sm font-bold">{z.name}</div>
                  <div className="text-[12px] text-zinc-600">{z.walk}</div>
                  <div className="mt-1 text-[11px] text-zinc-500">{z.to}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section id="domingo" className="scroll-mt-28 space-y-3">
          <DayHeading id="sun" />
          <p className="text-[13px] text-zinc-600">
            Celdas: <strong>cola normal / Express</strong> (minutos). Color
            comparado <em>dentro de cada fila</em>, no contra un umbral global.
            Express 10 no cubre Uncharted, Hurakan ni Street Mission.
          </p>
          <WaitTable day="sun" />
          <ExpressPanel savings={savings} peak={peak} />
          <ItineraryTimeline day="sun" title="Itinerario óptimo · domingo 20" />
        </section>

        <section id="lunes" className="scroll-mt-28 space-y-3">
          <DayHeading id="mon" />
          <p className="text-[13px] text-zinc-600">
            Sin Express. Celdas en minutos de cola normal. Mañana en
            PortAventura; a las 15:50 sales a Ferrari Land (abre 16:30). El
            itinerario de abajo incluye las dos partes.
          </p>
          <WaitTable day="mon" />
          <ItineraryTimeline day="mon" title="Itinerario óptimo · lunes 21" />
        </section>

        <section id="martes" className="scroll-mt-28 space-y-3">
          <DayHeading id="tue" />
          <p className="text-[13px] text-zinc-600">
            Día más flojo y sin Express. Día entero en PortAventura. Mejor
            Uncharted de los tres a primera hora (junto con las 17:00).
          </p>
          <WaitTable day="tue" />
          <ItineraryTimeline day="tue" title="Itinerario óptimo · martes 22" />
        </section>

        <section id="comparativa" className="scroll-mt-28 space-y-3">
          <h2 className="text-xl font-bold">Matriz global</h2>
          <GlobalMatrix />
        </section>

        <section id="itinerarios" className="scroll-mt-28 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Itinerarios óptimos · los tres días</h2>
            <p className="text-[13px] text-zinc-600">
              Mismo formato los tres días: hora → atracción → zona → cola →
              desplazamiento → siguiente. Domingo con Express 10. Lunes sin
              Express y Ferrari Land por la tarde. Martes, el más flojo, día
              entero en PortAventura.
            </p>
          </div>
          <ItineraryTimeline day="sun" title="Domingo 20 · Express 10" />
          <ItineraryTimeline day="mon" title="Lunes 21 · PA + Ferrari Land" />
          <ItineraryTimeline day="tue" title="Martes 22 · PortAventura entero" />
        </section>

        <section id="ferrari" className="scroll-mt-28 space-y-3">
          <h2 className="text-xl font-bold">
            Ferrari Land · {FERRARI_LAND.recommendedDay}
          </h2>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="space-y-2 pt-5 text-[13px] leading-relaxed">
              <p>
                Horario previsto: <strong>{FERRARI_LAND.hours}</strong> ·
                afluencia Queue-Times ≈ {FERRARI_LAND.crowdQueueTimes} %. Tu
                Express 10 de PortAventura <strong>no sirve aquí</strong>.
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {FERRARI_LAND.why.map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-zinc-900 text-white">
                  <th className="px-3 py-2 text-left text-[11px]">Atracción</th>
                  {FERRARI_MATRIX[0].waits.map((w) => (
                    <th key={w.hour} className="px-2 py-2 text-center text-[11px]">
                      {w.hour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FERRARI_MATRIX.map((row) => {
                  const vals = row.waits.map((w) => w.wait);
                  const min = Math.min(...vals);
                  const max = Math.max(...vals);
                  return (
                    <tr key={row.name} className="border-t">
                      <td className="px-3 py-2">
                        <span className={cn(row.priority && "font-bold")}>
                          {row.name}
                        </span>
                      </td>
                      {row.waits.map((w) => {
                        const t =
                          max === min
                            ? "green"
                            : (w.wait - min) / (max - min) <= 0.12
                              ? "green"
                              : (w.wait - min) / (max - min) <= 0.38
                                ? "greenLight"
                                : (w.wait - min) / (max - min) <= 0.62
                                  ? "yellow"
                                  : (w.wait - min) / (max - min) <= 0.85
                                    ? "orange"
                                    : "red";
                        return (
                          <td
                            key={w.hour}
                            className={cn(
                              "px-2 py-2 text-center tabular-nums",
                              TONE_CLASS[t as WaitTone]
                            )}
                          >
                            {w.wait} min
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Itinerario Ferrari Land (lunes)
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50">
                    <th className="px-3 py-2 text-left">Atracción</th>
                    <th className="px-2 py-2 text-left">Hora</th>
                    <th className="px-2 py-2 text-left">Cola estimada</th>
                  </tr>
                </thead>
                <tbody>
                  {FERRARI_LAND.itinerary.map((r) => (
                    <tr key={r.name + r.hour} className="border-t">
                      <td className={cn("px-3 py-2", r.priority && "font-bold")}>
                        {r.name}
                      </td>
                      <td className="px-2 py-2 font-bold">{r.hour}</td>
                      <td className="px-2 py-2">{r.wait} min</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </section>

        <section id="fuentes" className="scroll-mt-28 space-y-3">
          <h2 className="text-xl font-bold">Fuentes y tipo de dato</h2>
          <div className="space-y-2">
            {SOURCES.map((s) => (
              <Card key={s.url} className="border-zinc-200 shadow-sm">
                <CardContent className="space-y-1 pt-4 text-[13px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {s.kind}
                    </Badge>
                    <span className="font-semibold">{s.title}</span>
                  </div>
                  <a
                    href={s.url}
                    className="break-all text-[12px] text-teal-800 underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {s.url}
                  </a>
                  <p className="text-zinc-600">{s.usedFor}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Separator />
          <p className="text-[12px] text-zinc-500">
            {RIDES.length} atracciones modeladas. Las cifras de cada celda son
            estimaciones calculadas (redondeo a 5 min). Contrasta siempre con
            la app oficial de PortAventura World el mismo día: una avería de
            Uncharted o un pasaje de Halloween cambia el mapa en diez minutos.
          </p>
        </section>
      </main>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-950">
      <strong>No son datos oficiales.</strong> Horarios: previsión Queue-Times /
      Pafans contrastada con el calendario oficial (sujeto a cambio). Colas:
      estimación a partir de históricas 2026 + patrón horario + afluencia
      prevista. Confirma horarios en{" "}
      <a
        className="underline"
        href="https://www.portaventuraworld.com/horarios-calendario"
      >
        portaventuraworld.com/horarios-calendario
      </a>{" "}
      y colas en la app del parque.
    </div>
  );
}

function CrowdCard({ id }: { id: DayId }) {
  const d = DAYS[id];
  return (
    <Card className="border-zinc-200 shadow-sm">
      <CardContent className="pt-5">
        <div className="text-[11px] font-semibold tracking-wide text-teal-800 uppercase">
          {d.weekday} {d.date}
        </div>
        <div className="mt-1 text-3xl font-bold">{d.crowdQueueTimesEs}%</div>
        <div className="text-[12px] text-zinc-500">
          afluencia prevista · Queue-Times
        </div>
        <div className="mt-2 space-y-1 text-[12px] text-zinc-600">
          <div>
            Horario PA: <strong>{d.parkHours}</strong>
          </div>
          <div>
            Halloween: sí · Express: {d.express ? "sí (10)" : "no"}
          </div>
          <div>Tú partías de {d.crowdUser} %</div>
        </div>
      </CardContent>
    </Card>
  );
}

function DayHeading({ id }: { id: DayId }) {
  const d = DAYS[id];
  return (
    <div>
      <h2 className="text-xl font-bold">
        {d.label} · {d.date}
      </h2>
      <p className="text-[13px] text-zinc-500">
        {d.parkHours} · afluencia {d.crowdQueueTimesEs}% ·{" "}
        {d.express ? "Express 10 activo" : "sin Express"}
      </p>
    </div>
  );
}

function Legend() {
  const tones: WaitTone[] = [
    "green",
    "greenLight",
    "yellow",
    "orange",
    "red",
  ];
  return (
    <div className="flex flex-wrap items-center gap-2 text-[12px]">
      {tones.map((t) => (
        <span
          key={t}
          className={cn("rounded-full px-2.5 py-0.5 font-medium", TONE_CLASS[t])}
        >
          {TONE_LABEL[t]}
        </span>
      ))}
      <span className="text-zinc-500">
        El color se calcula por atracción (mínimo de la fila = verde, máximo =
        rojo).
      </span>
    </div>
  );
}

function ExpressPanel({
  savings,
  peak,
}: {
  savings: ReturnType<typeof expressSavings>;
  peak: ReturnType<typeof peakIfNoExpress>;
}) {
  return (
    <Card className="border-amber-200 bg-amber-50/60 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ahorro Express 10 · domingo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-[13px]">
        <p>
          Express ≠ 0 min. Estimación efectiva 3–8 min (escaneo + merge; Templo
          espera al siguiente pase). Angkor prevista cerrada: el parque puede
          sustituirla; de momento el itinerario usa <strong>9 de 10</strong>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[12px]">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-1">Atracción</th>
                <th>Hora plan</th>
                <th>Normal</th>
                <th>Express</th>
                <th>Ahorro</th>
              </tr>
            </thead>
            <tbody>
              {savings.rows.map((r) => (
                <tr key={r.ride.id} className="border-t border-amber-200/80">
                  <td className="py-1.5 font-medium">{r.ride.name}</td>
                  <td>{r.hour}</td>
                  <td>{r.available ? `${r.normal} min` : "cerrada"}</td>
                  <td>{r.express == null ? "—" : `${r.express} min`}</td>
                  <td className="font-bold text-emerald-800">
                    {r.saved ? `${r.saved} min` : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          <Stat
            label="Cola normal (itinerario, 9 atracciones)"
            value={`${savings.totalNormal} min`}
          />
          <Stat
            label="Con Express"
            value={`${savings.totalExpress} min`}
          />
          <Stat
            label="Ahorrado"
            value={`${savings.totalSaved} min (~${Math.round(savings.totalSaved / 60)} h ${savings.totalSaved % 60} min)`}
          />
        </div>
        <p className="text-zinc-600">
          Si hicieras esas mismas atracciones en su peor hora del domingo, sin
          Express: <strong>{peak.totalNormal} min</strong> vs{" "}
          <strong>{peak.totalExpress} min</strong> con Express (ahorro{" "}
          <strong>{peak.totalSaved} min</strong>). El itinerario no persigue ese
          máximo teórico: combina Uncharted/Hurakan/Street sin Express a
          primera/última hora.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-white p-3 ring-1 ring-amber-200">
      <div className="text-[11px] text-zinc-500">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
