export type FerrariRide = {
  name: string;
  priority?: boolean;
  hour: string;
  wait: number;
  note?: string;
};

/** Ferrari Land — lunes 21, 16:30–22:00. Express 10 de PA NO sirve. */
export const FERRARI_LAND = {
  recommendedDay: "Lunes 21/09/2026",
  hours: "16:30–22:00",
  crowdQueueTimes: 55,
  crowdMon: 55,
  crowdSun: 55,
  crowdTue: 53,
  why: [
    "El domingo tienes Express 10 solo para PortAventura y el parque cierra a las 19:00: no lo recortes.",
    "Ferrari Land abre a las 16:30 los tres días (previsión Queue-Times / Pafans), así que encaja al final de un día de PortAventura.",
    "El martes es el día más flojo de PortAventura (~24 %): más rentable dejárselo entero al parque grande, sin Express.",
    "Parque Temático, visita de 3 días: día 1 PA · día 2 PA mañana + Ferrari Land tarde · día 3 PA.",
    "Afluencia Ferrari Land casi igual los tres días (55 / 55 / 53 %). La diferencia la marca el Express del domingo y el martes flojo de PA, no Ferrari Land.",
  ],
  itinerary: [
    {
      name: "Red Force",
      priority: true,
      hour: "16:30",
      wait: 40,
      note: "Entra al abrir. No uses Express de PortAventura (no vale). Última hora ~20 min si quieres repetir.",
    },
    {
      name: "Flying Dreams",
      hour: "17:20",
      wait: 35,
    },
    {
      name: "Thrill Towers",
      hour: "18:05",
      wait: 35,
      note: "Pico cuando cierra PortAventura (~18:00) y entra gente al recinto.",
    },
    {
      name: "Maranello Grand Race",
      hour: "18:45",
      wait: 40,
    },
    {
      name: "Racing Legends",
      hour: "19:30",
      wait: 25,
    },
    {
      name: "Ferrari Experience / Gallery",
      hour: "20:05",
      wait: 30,
      note: "Cola tipo exposición; media 2026 Queue-Times 47 min (días más llenos). Aquí, estimación a la baja.",
    },
    {
      name: "Junior Red Force / Crazy Pistons",
      hour: "20:40",
      wait: 10,
      note: "Familiares. Opcional.",
    },
    {
      name: "Red Force (repetición)",
      priority: true,
      hour: "21:00",
      wait: 20,
      note: "Mejor ventana del día según patrón horario de septiembre (Wartezeiten 2025: 21:00–22:00 cae a ~47 min de media mensual; en un día ~55 % baja más).",
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
