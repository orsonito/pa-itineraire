export type Source = {
  title: string;
  url: string;
  usedFor: string;
  kind: "oficial" | "histórico" | "previsión" | "guía" | "mapa";
};

export const SOURCES: Source[] = [
  {
    title: "Parque Temático — Cuándo ir a PortAventura 2026",
    url: "https://www.parquetematico.net/portaventura/cuando-ir",
    usedFor:
      "Fuente principal: calendario de afluencia, horarios de temporada, Halloween 19/09–15/11, cuántos días ir y qué parque cada día (en 3 días: PA + PA mañana/Ferrari tarde + PA).",
    kind: "guía",
  },
  {
    title: "Parque Temático — Itinerarios y orden de atracciones",
    url: "https://www.parquetematico.net/portaventura/orden-atracciones/",
    usedFor:
      "Apertura escalonada (Uncharted/Furius/Street/Shambhala/Hurakan/Rapids a las 10:30; Khan/Stampida/Diablo/Tutuki/Silver ~11:00; Tomahawk ~12:00). Angkor cerrada hasta 2027. Templo del Fuego solo fines de semana desde el 7/09. Estrategia Uncharted vs Furius según acceso.",
    kind: "guía",
  },
  {
    title: "Parque Temático — Guía Express 2026",
    url: "https://www.parquetematico.net/portaventura/express/",
    usedFor:
      "Express 10: 1 acceso por atracción, no incluye Uncharted / Hurakan / Street Mission / Ferrari Land, no primera fila, QR, válido el día elegido. En días flojos el Express ahorra menos que en días negros.",
    kind: "guía",
  },
  {
    title: "PortAventura World — Horarios y calendario (oficial)",
    url: "https://www.portaventuraworld.com/horarios-calendario",
    usedFor:
      "Página oficial de horarios. El PDF del calendario confirma parques abiertos en septiembre; las horas concretas del 20–22 no se leen con precisión en el PDF y se contrastan con Queue-Times y Pafans.",
    kind: "oficial",
  },
  {
    title: "PortAventura World — Calendario PDF parques",
    url: "https://www.portaventuraworld.com/pdf/calendario_parques_es.pdf",
    usedFor: "Calendario oficial 2026 (sujeto a cambios). No sustituye consultar la app el día de la visita.",
    kind: "oficial",
  },
  {
    title: "Parque Temático — Espectáculos y Halloween",
    url: "https://www.parquetematico.net/portaventura/espectaculos/",
    usedFor:
      "Shows de Halloween (Factory en Gran Teatro Imperial, West Blood Frenzy, Parade, Día de los Muertos, Magic Bubble). Los pases diarios no se publican fijos: se estiman ventanas (media tarde Factory, desfile al cierre) y hay que confirmar en la app.",
    kind: "guía",
  },
  {
    title: "PortAventura World — Halloween 2026",
    url: "https://www.portaventuraworld.com/halloween",
    usedFor: "Fechas oficiales Halloween: 19 septiembre – 15 noviembre 2026. Los tres días de visita caen en Halloween.",
    kind: "oficial",
  },
  {
    title: "PortAventura World — Express 10 (ficha de producto)",
    url: "https://www.portaventuraworld.com/portaventura",
    usedFor:
      "Confirmación de producto Express 10: 10 accesos rápidos, 1 por atracción. Ferrari Land tiene Express propio.",
    kind: "oficial",
  },
  {
    title: "Queue-Times — Calendario de afluencia PortAventura Park septiembre 2026",
    url: "https://queue-times.com/es/parks/19/calendar/2026/09",
    usedFor:
      "Previsión usada en las tablas: 20/09 42 % 10:30–19:00 · 21/09 30 % 10:30–18:00 · 22/09 24 % 10:30–18:00. Versión EN: 45 / 34 / 26 %.",
    kind: "previsión",
  },
  {
    title: "Queue-Times — Estadísticas 2026 PortAventura Park",
    url: "https://queue-times.com/parks/19/stats/2026?hide_archived=true",
    usedFor:
      "Media 2026 por atracción (Uncharted 68, Furius 49, Hurakan 39, Shambhala 37, Silver 37, Khan 34, Stampida 31, Tutuki 30, Templo 28, Street 27, Diablo 26, Rapids 24, Tomahawk 24, Angkor 15). Afluencia media septiembre 59 %.",
    kind: "histórico",
  },
  {
    title: "Queue-Times — Ferrari Land septiembre 2026",
    url: "https://queue-times.com/parks/277/calendar/2026/09",
    usedFor:
      "Horario Ferrari Land 16:30–22:00 los tres días. Afluencia prevista 55 % (20), 55 % (21), 53 % (22).",
    kind: "previsión",
  },
  {
    title: "Queue-Times — Estadísticas 2026 Ferrari Land",
    url: "https://queue-times.com/parks/277/stats/2026?hide_archived=true",
    usedFor:
      "Medias 2026: Red Force 66, Gallery 47, Flying Dreams 39, Maranello 39, Thrill Towers 31, Racing Legends 24.",
    kind: "histórico",
  },
  {
    title: "Thrill Data — 20 septiembre (fecha de calendario, no el domingo 2026)",
    url: "https://www.thrill-data.com/research/portaventura/09/20",
    usedFor:
      "Media histórica 30,2 min (muestra pequeña; 2025 fue sábado). Predicción modelos 2026 ~25 min. NO se usa como analogía directa del domingo 2026.",
    kind: "histórico",
  },
  {
    title: "Thrill Data — 21 septiembre",
    url: "https://www.thrill-data.com/research/portaventura/09/21",
    usedFor:
      "Mejor analogía de domingo post-colegio: Shambhala 41, Hurakan 41, Stampida 39, Furius 38, Street 30,5, Silver 30, Templo 29, Khan 24, Diablo 21, Tutuki 20,5. Media parque 18,9 min (2025 fue domingo, 16,1 min).",
    kind: "histórico",
  },
  {
    title: "Thrill Data — 22 septiembre",
    url: "https://www.thrill-data.com/research/portaventura/09/22",
    usedFor:
      "Lunes/martes post-colegio: media 17,8 min (2025 lunes 14,5). Shambhala 40, Hurakan 39, Furius 31, Street 27, Khan 22.",
    kind: "histórico",
  },
  {
    title: "Pafans — Calendario y horarios 2026",
    url: "https://www.pafans.com/info/calendario-de-port-aventura",
    usedFor:
      "Contraste de horarios septiembre (PA 10:30–18:00 / 19:00; Ferrari Land 16:30–22:00). Parking ~10:00. Halloween 19/09–15/11. Caribe Aquatic Park hasta ~20/09.",
    kind: "previsión",
  },
  {
    title: "Pafans — Horarios de atracciones",
    url: "https://www.pafans.com/info/horarios-atracciones",
    usedFor:
      "Las atracciones no abren todas a la vez; el agua puede cerrar al anochecer. Confirmación visual en el panel de cada cola.",
    kind: "guía",
  },
  {
    title: "Wartezeiten — Red Force septiembre 2025 (patrón horario)",
    url: "https://www.wartezeiten.app/es/ferrariland/atraccion/red-force/archivo/9-2025.html",
    usedFor:
      "Patrón horario Red Force en septiembre: 16h ~85, 17h ~80, 18h ~77, 19h ~81, 20h ~71, 21h ~47, 22h ~47 (media de TODO el mes, incluidos días llenos de principios de mes). Se escala a un día ~55 %.",
    kind: "histórico",
  },
  {
    title: "Parque Temático — Hotel El Paso 2026",
    url: "https://www.parquetematico.net/portaventura/hoteles/elpaso/",
    usedFor:
      "Alojamiento de esta visita. Parking en el hotel. Sin acceso directo a Far West: 8–10 min a la entrada principal (fuente de Woody). Acceso de huéspedes ~30 min antes. Check-in: tarjeta = llave + entrada. Habitación hasta las 15:00 (llegada) / 11:00 (salida). Consigna de pago.",
    kind: "guía",
  },
  {
    title: "Blog oficial PortAventura — Rutas por perfil",
    url: "https://www.portaventuraworld.com/blog/las-mejores-rutas-por-portaventura-segun-tu-perfil-de-visitante",
    usedFor:
      "Distribución oficial de 6 mundos y consejo de no zigzag. Ferrari Land es parque aparte junto a la entrada.",
    kind: "oficial",
  },
];
