export type FerrariRide = {
  name: string;
  priority?: boolean;
  hour: string;
  wait: number;
  note?: string;
};

/** Ferrari Land — lunes 21, 16:30–22:00. Entras ~18:10 (tras cierre de PA). Express 10 de PA NO sirve. */
export const FERRARI_LAND = {
  recommendedDay: "Lunes 21/09/2026",
  hours: "16:30–22:00 (tú: ~18:10–22:00)",
  crowdQueueTimes: 55,
  crowdMon: 55,
  crowdSun: 55,
  crowdTue: 53,
  why: [
    "El domingo tienes Express 10 solo para PortAventura y el parque cierra a las 19:00: no lo recortes.",
    "El lunes PortAventura cierra a las 18:00: se aprovecha entero. Ferrari Land abre 16:30, pero entras al cierre de PA.",
    "Red Force a las 18:00 es el peor rato (~55 min, entra la gente de PA). A las 21:00 baja a ~20 min: esa es tu pasada.",
    "El martes es el día más flojo de PortAventura (~24 %): más rentable dejárselo entero al parque grande, sin Express.",
    "Afluencia Ferrari Land casi igual los tres días (55 / 55 / 53 %). La diferencia la marca el Express del domingo y el martes flojo de PA, no Ferrari Land.",
  ],
  itinerary: [
    {
      name: "Racing Legends",
      hour: "18:15",
      wait: 30,
      note: "Entras al cierre de PortAventura. No hagas Red Force ahora (~55 min).",
    },
    {
      name: "Thrill Towers",
      hour: "18:50",
      wait: 30,
    },
    {
      name: "Flying Dreams",
      hour: "19:25",
      wait: 35,
    },
    {
      name: "Maranello Grand Race",
      hour: "20:05",
      wait: 25,
    },
    {
      name: "Ferrari Experience / Gallery",
      hour: "20:40",
      wait: 20,
      note: "Cola tipo exposición. Si no te interesa, ve a Red Force.",
    },
    {
      name: "Red Force",
      priority: true,
      hour: "21:10",
      wait: 20,
      note: "Mejor ventana. A las 16:30 eran ~40 min y a las 18:00 ~55. Cierre de colas 22:00.",
    },
  ] satisfies FerrariRide[],
};

export const FERRARI_MATRIX: {
  name: string;
  priority?: boolean;
  waits: { hour: string; wait: number }[];
}[] = [
  {
    name: "Red Force",
    priority: true,
    waits: [
      { hour: "16:30", wait: 40 },
      { hour: "17:00", wait: 50 },
      { hour: "18:00", wait: 55 },
      { hour: "19:00", wait: 50 },
      { hour: "20:00", wait: 35 },
      { hour: "21:00", wait: 20 },
    ],
  },
  {
    name: "Flying Dreams",
    waits: [
      { hour: "16:30", wait: 25 },
      { hour: "17:00", wait: 35 },
      { hour: "18:00", wait: 40 },
      { hour: "19:00", wait: 35 },
      { hour: "20:00", wait: 25 },
      { hour: "21:00", wait: 15 },
    ],
  },
  {
    name: "Thrill Towers",
    waits: [
      { hour: "16:30", wait: 20 },
      { hour: "17:00", wait: 30 },
      { hour: "18:00", wait: 35 },
      { hour: "19:00", wait: 30 },
      { hour: "20:00", wait: 20 },
      { hour: "21:00", wait: 10 },
    ],
  },
  {
    name: "Maranello Grand Race",
    waits: [
      { hour: "16:30", wait: 25 },
      { hour: "17:00", wait: 35 },
      { hour: "18:00", wait: 40 },
      { hour: "19:00", wait: 35 },
      { hour: "20:00", wait: 25 },
      { hour: "21:00", wait: 15 },
    ],
  },
  {
    name: "Racing Legends",
    waits: [
      { hour: "16:30", wait: 15 },
      { hour: "17:00", wait: 25 },
      { hour: "18:00", wait: 30 },
      { hour: "19:00", wait: 25 },
      { hour: "20:00", wait: 15 },
      { hour: "21:00", wait: 10 },
    ],
  },
  {
    name: "Ferrari Experience / Gallery",
    waits: [
      { hour: "16:30", wait: 20 },
      { hour: "17:00", wait: 30 },
      { hour: "18:00", wait: 35 },
      { hour: "19:00", wait: 30 },
      { hour: "20:00", wait: 20 },
      { hour: "21:00", wait: 10 },
    ],
  },
  {
    name: "Junior Red Force",
    waits: [
      { hour: "16:30", wait: 10 },
      { hour: "17:00", wait: 15 },
      { hour: "18:00", wait: 20 },
      { hour: "19:00", wait: 15 },
      { hour: "20:00", wait: 10 },
      { hour: "21:00", wait: 5 },
    ],
  },
];
