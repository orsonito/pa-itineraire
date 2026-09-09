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
import { SingleRiderTag } from "@/components/app/ExpressTag";
import { GlobalMatrix } from "./GlobalMatrix";
import { ItineraryTimeline } from "./ItineraryTimeline";
import { WaitTable } from "./WaitTable";

const NAV: { id: string; label: string }[] = [
  { id: "resumen", label: "Résumé" },
  { id: "domingo", label: "Dim 20" },
  { id: "lunes", label: "Lun 21" },
  { id: "martes", label: "Mar 22" },
  { id: "comparativa", label: "Comparer" },
  { id: "itinerarios", label: "Parcours" },
  { id: "ferrari", label: "Ferrari" },
  { id: "fuentes", label: "Sources" },
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
                PortAventura World · plan de visite
              </p>
              <h1 className="font-heading text-xl font-bold tracking-tight sm:text-2xl">
                20, 21 et 22 septembre 2026
              </h1>
            </div>
            <Badge className="shrink-0 bg-teal-800 text-white">
              Express 10 · dimanche seulement
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
                Ce qui a changé par rapport à tes % (38 / 28 / 22)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[13px] leading-relaxed text-zinc-700">
              <p>
                Le calendrier de Parque Temático est visuel (couleurs) et ne
                publie pas de pourcentage dans le HTML. Queue-Times publie bien
                une prévision numérique pour ces dates exactes :
              </p>
              <ul className="list-disc space-y-1 pl-5">
                <li>
                  <strong>20/09 :</strong> toi 38 % → Queue-Times{" "}
                  <strong>42 %</strong> (EN 45 %). C’est +4 points. Ça reste un
                  dimanche modéré, pas un jour noir.
                </li>
                <li>
                  <strong>21/09 :</strong> toi 28 % → <strong>30 %</strong> (EN 34 %).
                </li>
                <li>
                  <strong>22/09 :</strong> toi 22 % → <strong>24 %</strong> (EN 26 %).
                </li>
              </ul>
              <p>
                Le classement ne change pas : dimanche le plus chargé, mardi le
                plus calme. Les tableaux utilisent <strong>42 / 30 / 24 %</strong>{" "}
                (version ES de Queue-Times). Je n’ai pas multiplié les files par
                ces pourcentages : le pic de chaque attraction est calibré avec
                les moyennes 2026 + Thrill Data de fin septembre, puis on applique
                une courbe horaire et un facteur d’affluence avec un plancher
                (les files ne tombent pas à zéro).
              </p>
              <p>
                <strong>Halloween</strong> commence le 19/09/2026 (officiel). Les
                trois jours sont Halloween : plus d’ambiance, passages possibles,
                et l’eau peut raccourcir ses horaires.
              </p>
              <p>
                <strong>Angkor :</strong> Parque Temático (sept. 2026) la donne
                fermée jusqu’en 2027. <strong>Templo del Fuego :</strong> depuis le
                7/09, prévu seulement samedis et dimanches → utile le dimanche, pas
                le lundi/mardi. Confirmer les deux dans l’app.
              </p>
            </CardContent>
          </Card>
          <Legend />
          <Card className="border-zinc-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Carte mentale du parc (déplacements estimés)
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
            Cases : <strong>file normale / Express</strong> (minutes). Couleur
            comparée <em>dans chaque ligne</em>, pas contre un seuil global.
            Express 10 ne couvre pas Uncharted, Hurakan ni Street Mission.
          </p>
          <WaitTable day="sun" />
          <ExpressPanel savings={savings} peak={peak} />
          <ItineraryTimeline day="sun" title="Itinéraire optimal · dimanche 20" />
        </section>

        <section id="lunes" className="scroll-mt-28 space-y-3">
          <DayHeading id="mon" />
          <p className="text-[13px] text-zinc-600">
            Sans Express. Cases en minutes de file normale. PortAventura
            entier jusqu’à 18:00 ; Ferrari Land à la fermeture (Red Force à
            21:10, pas à l’ouverture).
          </p>
          <WaitTable day="mon" />
          <ItineraryTimeline day="mon" title="Itinéraire optimal · lundi 21" />
        </section>

        <section id="martes" className="scroll-mt-28 space-y-3">
          <DayHeading id="tue" />
          <p className="text-[13px] text-zinc-600">
            Jour le plus calme et sans Express. Journée entière à PortAventura.
            Début en China (Shambhala), pas Furius à l’entrée. Uncharted en
            fin d’après-midi (~17:00, même file qu’à 10:30).
          </p>
          <WaitTable day="tue" />
          <ItineraryTimeline day="tue" title="Itinéraire optimal · mardi 22" />
        </section>

        <section id="comparativa" className="scroll-mt-28 space-y-3">
          <h2 className="text-xl font-bold">Matrice globale</h2>
          <GlobalMatrix />
        </section>

        <section id="itinerarios" className="scroll-mt-28 space-y-6">
          <div>
            <h2 className="text-xl font-bold">Itinéraires optimaux · les trois jours</h2>
            <p className="text-[13px] text-zinc-600">
              Même format les trois jours : heure → attraction → zone → file →
              déplacement → suivante. Dimanche avec Express 10. Lundi sans
              Express. Lundi : PortAventura jusqu’à la fermeture et Ferrari Land
              le soir. Mardi, le plus calme, journée entière à PortAventura.
            </p>
          </div>
          <ItineraryTimeline day="sun" title="Dimanche 20 · Express 10" />
          <ItineraryTimeline day="mon" title="Lundi 21 · PA + Ferrari Land" />
          <ItineraryTimeline day="tue" title="Mardi 22 · PortAventura entier" />
        </section>

        <section id="ferrari" className="scroll-mt-28 space-y-3">
          <h2 className="text-xl font-bold">
            Ferrari Land · {FERRARI_LAND.recommendedDay}
          </h2>
          <Card className="border-zinc-200 shadow-sm">
            <CardContent className="space-y-2 pt-5 text-[13px] leading-relaxed">
              <p>
                Horaire prévu : <strong>{FERRARI_LAND.hours}</strong> ·
                affluence Queue-Times ≈ {FERRARI_LAND.crowdQueueTimes} %. Ton
                Express 10 de PortAventura <strong>ne marche pas ici</strong>.
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
                  <th className="px-3 py-2 text-left text-[11px]">Attraction</th>
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
                Itinéraire Ferrari Land (lundi)
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto p-0">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-zinc-50">
                    <th className="px-3 py-2 text-left">Attraction</th>
                    <th className="px-2 py-2 text-left">Heure</th>
                    <th className="px-2 py-2 text-left">File estimée</th>
                  </tr>
                </thead>
                <tbody>
                  {FERRARI_LAND.itinerary.map((r) => (
                    <tr key={r.name + r.hour} className="border-t">
                      <td className={cn("px-3 py-2", r.priority && "font-bold")}>
                        <span className="inline-flex flex-wrap items-center gap-1">
                          {r.name}
                          {r.singleRider && <SingleRiderTag />}
                        </span>
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
          <h2 className="text-xl font-bold">Sources et type de donnée</h2>
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
            {RIDES.length} attractions modélisées. Les chiffres de chaque case
            sont des estimations calculées (arrondi à 5 min). Recoupe toujours
            avec l’app officielle de PortAventura World le jour même : une panne
            d’Uncharted ou un passage Halloween change la carte en dix minutes.
          </p>
        </section>
      </main>
    </div>
  );
}

function Disclaimer() {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-[13px] text-amber-950">
      <strong>Ce ne sont pas des données officielles.</strong> Horaires : prévision
      Queue-Times / Pafans recoupée avec le calendrier officiel (sous réserve de
      changement). Files : estimation à partir des historiques 2026 + profil
      horaire + affluence prévue. Confirme les horaires sur{" "}
      <a
        className="underline"
        href="https://www.portaventuraworld.com/horarios-calendario"
      >
        portaventuraworld.com/horarios-calendario
      </a>{" "}
      et les files dans l’app du parc.
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
          affluence prévue · Queue-Times
        </div>
        <div className="mt-2 space-y-1 text-[12px] text-zinc-600">
          <div>
            Horaires PA : <strong>{d.parkHours}</strong>
          </div>
          <div>
            Halloween : oui · Express : {d.express ? "oui (10)" : "non"}
          </div>
          <div>Tu partais de {d.crowdUser} %</div>
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
        {d.parkHours} · affluence {d.crowdQueueTimesEs}% ·{" "}
        {d.express ? "Express 10 actif" : "sans Express"}
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
        La couleur se calcule par attraction (minimum de la ligne = vert, maximum =
        rouge).
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
        <CardTitle className="text-base">Gain Express 10 · dimanche</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-[13px]">
        <p>
          Express ≠ 0 min. Estimation effective 3–8 min (scan + merge ; Templo
          attend la séance suivante). Angkor prévue fermée : le parc peut la
          remplacer ; pour l’instant l’itinéraire utilise <strong>9 sur 10</strong>.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-[12px]">
            <thead>
              <tr className="text-left text-zinc-500">
                <th className="py-1">Attraction</th>
                <th>Heure plan</th>
                <th>Normal</th>
                <th>Express</th>
                <th>Gain</th>
              </tr>
            </thead>
            <tbody>
              {savings.rows.map((r) => (
                <tr key={r.ride.id} className="border-t border-amber-200/80">
                  <td className="py-1.5 font-medium">{r.ride.name}</td>
                  <td>{r.hour}</td>
                  <td>{r.available ? `${r.normal} min` : "fermée"}</td>
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
            label="File normale (itinéraire, 9 attractions)"
            value={`${savings.totalNormal} min`}
          />
          <Stat
            label="Avec Express"
            value={`${savings.totalExpress} min`}
          />
          <Stat
            label="Économisé"
            value={`${savings.totalSaved} min (~${Math.round(savings.totalSaved / 60)} h ${savings.totalSaved % 60} min)`}
          />
        </div>
        <p className="text-zinc-600">
          Si tu faisais ces mêmes attractions à leur pire heure du dimanche, sans
          Express : <strong>{peak.totalNormal} min</strong> vs{" "}
          <strong>{peak.totalExpress} min</strong> avec Express (gain{" "}
          <strong>{peak.totalSaved} min</strong>). L’itinéraire ne vise pas ce
          maximum théorique : il combine Uncharted/Hurakan/Street sans Express en
          première/dernière heure.
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
