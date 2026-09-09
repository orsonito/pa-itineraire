export type FerrariRideId =
  | "redforce"
  | "thrilltowers"
  | "flyingdreams"
  | "maranello"
  | "racinglegends"
  | "ferrarigallery"
  | "juniorredforce";

export type FerrariRide = {
  name: string;
  liveId: FerrariRideId;
  priority?: boolean;
  singleRider?: boolean;
  hour: string;
  wait: number;
  note?: string;
};

/** Ferrari Land — lundi 21, 16:30–22:00. Tu entres ~18:10 (après fermeture de PA). Express 10 de PA ne marche PAS. */
export const FERRARI_LAND = {
  recommendedDay: "Lundi 21/09/2026",
  hours: "16:30–22:00 (toi : ~18:10–22:00)",
  crowdQueueTimes: 55,
  crowdMon: 55,
  crowdSun: 55,
  crowdTue: 53,
  why: [
    "Le dimanche tu as Express 10 seulement pour PortAventura et le parc ferme à 19:00 : ne le coupe pas.",
    "Le lundi PortAventura ferme à 18:00 : on l’utilise entier. Ferrari Land ouvre à 16:30, mais tu entres à la fermeture de PA.",
    "Red Force à 18:00 est le pire moment (~55 min, les gens de PA arrivent). À 21:00 ça descend à ~20 min : c’est ta passe.",
    "Le mardi est le jour le plus calme de PortAventura (~24 %) : plus rentable de le laisser entier au grand parc, sans Express.",
    "L’affluence Ferrari Land est presque identique les trois jours (55 / 55 / 53 %). La différence, c’est l’Express du dimanche et le mardi calme de PA, pas Ferrari Land.",
  ],
  itinerary: [
    {
      name: "Racing Legends",
      liveId: "racinglegends",
      hour: "18:15",
      wait: 30,
      note: "Tu entres à la fermeture de PortAventura. Ne fais pas Red Force maintenant (~55 min).",
    },
    {
      name: "Thrill Towers",
      liveId: "thrilltowers",
      hour: "18:50",
      wait: 30,
      singleRider: true,
      note: "File Single Rider depuis 2026.",
    },
    {
      name: "Flying Dreams",
      liveId: "flyingdreams",
      hour: "19:25",
      wait: 35,
    },
    {
      name: "Maranello Grand Race",
      liveId: "maranello",
      hour: "20:05",
      wait: 25,
    },
    {
      name: "Ferrari Experience / Gallery",
      liveId: "ferrarigallery",
      hour: "20:40",
      wait: 20,
      note: "File type exposition. Si ça ne t’intéresse pas, va à Red Force.",
    },
    {
      name: "Red Force",
      liveId: "redforce",
      priority: true,
      hour: "21:10",
      wait: 20,
      note: "Meilleure fenêtre. À 16:30 c’était ~40 min et à 18:00 ~55. Fermeture des files 22:00.",
    },
  ] satisfies FerrariRide[],
};

export const FERRARI_MATRIX: {
  name: string;
  liveId: FerrariRideId;
  priority?: boolean;
  singleRider?: boolean;
  waits: { hour: string; wait: number }[];
}[] = [
  {
    name: "Red Force",
    liveId: "redforce",
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
    liveId: "flyingdreams",
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
    liveId: "thrilltowers",
    singleRider: true,
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
    liveId: "maranello",
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
    liveId: "racinglegends",
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
    liveId: "ferrarigallery",
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
    liveId: "juniorredforce",
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
