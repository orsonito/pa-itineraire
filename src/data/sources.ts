export type Source = {
  title: string;
  url: string;
  usedFor: string;
  kind: "officiel" | "historique" | "prévision" | "guide" | "carte";
};

export const SOURCES: Source[] = [
  {
    title: "Parque Temático — Quand aller à PortAventura 2026",
    url: "https://www.parquetematico.net/portaventura/cuando-ir",
    usedFor:
      "Source principale : calendrier d’affluence, horaires de saison, Halloween 19/09–15/11, combien de jours y aller et quel parc chaque jour (en 3 jours : PA + PA matin/Ferrari après-midi + PA).",
    kind: "guide",
  },
  {
    title: "Parque Temático — Itinéraires et ordre des attractions",
    url: "https://www.parquetematico.net/portaventura/orden-atracciones/",
    usedFor:
      "Ouverture échelonnée (Uncharted/Furius/Street/Shambhala/Hurakan/Rapids à 10:30 ; Khan/Stampida/Diablo/Tutuki/Silver ~11:00 ; Tomahawk ~12:00). Angkor fermée jusqu’en 2027. Templo del Fuego uniquement le week-end depuis le 7/09. Stratégie Uncharted vs Furius selon l’accès.",
    kind: "guide",
  },
  {
    title: "Parque Temático — Guide Express 2026",
    url: "https://www.parquetematico.net/portaventura/express/",
    usedFor:
      "Express 10 : 1 accès par attraction, n’inclut pas Uncharted / Hurakan / Street Mission / Ferrari Land, pas première rangée, QR, valable le jour choisi. Les jours calmes, Express économise moins que les jours noirs.",
    kind: "guide",
  },
  {
    title: "PortAventura World — Horaires et calendrier (officiel)",
    url: "https://www.portaventuraworld.com/horarios-calendario",
    usedFor:
      "Page officielle des horaires. Le PDF du calendrier confirme les parcs ouverts en septembre ; les heures précises du 20–22 ne se lisent pas clairement dans le PDF et se recoupent avec Queue-Times et Pafans.",
    kind: "officiel",
  },
  {
    title: "PortAventura World — Calendrier PDF des parcs",
    url: "https://www.portaventuraworld.com/pdf/calendario_parques_es.pdf",
    usedFor:
      "Calendrier officiel 2026 (sous réserve de changements). Ne remplace pas de consulter l’app le jour de la visite.",
    kind: "officiel",
  },
  {
    title: "Parque Temático — Spectacles et Halloween",
    url: "https://www.parquetematico.net/portaventura/espectaculos/",
    usedFor:
      "Shows Halloween (Factory au Gran Teatro Imperial, West Blood Frenzy, Parade, Día de los Muertos, Magic Bubble). Les séances quotidiennes ne sont pas publiées à l’avance : on estime des fenêtres (milieu d’après-midi Factory, défilé à la fermeture) et il faut confirmer dans l’app.",
    kind: "guide",
  },
  {
    title: "PortAventura World — Halloween 2026",
    url: "https://www.portaventuraworld.com/halloween",
    usedFor:
      "Dates officielles Halloween : 19 septembre – 15 novembre 2026. Les trois jours de visite tombent pendant Halloween.",
    kind: "officiel",
  },
  {
    title: "PortAventura World — Express 10 (fiche produit)",
    url: "https://www.portaventuraworld.com/portaventura",
    usedFor:
      "Confirmation du produit Express 10 : 10 accès rapides, 1 par attraction. Ferrari Land a son propre Express.",
    kind: "officiel",
  },
  {
    title: "Queue-Times — Calendrier d’affluence PortAventura Park septembre 2026",
    url: "https://queue-times.com/es/parks/19/calendar/2026/09",
    usedFor:
      "Prévision utilisée dans les tableaux : 20/09 42 % 10:30–19:00 · 21/09 30 % 10:30–18:00 · 22/09 24 % 10:30–18:00. Version EN : 45 / 34 / 26 %.",
    kind: "prévision",
  },
  {
    title: "Queue-Times — Statistiques 2026 PortAventura Park",
    url: "https://queue-times.com/parks/19/stats/2026?hide_archived=true",
    usedFor:
      "Moyenne 2026 par attraction (Uncharted 68, Furius 49, Hurakan 39, Shambhala 37, Silver 37, Khan 34, Stampida 31, Tutuki 30, Templo 28, Street 27, Diablo 26, Rapids 24, Tomahawk 24, Angkor 15). Affluence moyenne septembre 59 %.",
    kind: "historique",
  },
  {
    title: "Queue-Times — Ferrari Land septembre 2026",
    url: "https://queue-times.com/parks/277/calendar/2026/09",
    usedFor:
      "Horaire Ferrari Land 16:30–22:00 les trois jours. Affluence prévue 55 % (20), 55 % (21), 53 % (22).",
    kind: "prévision",
  },
  {
    title: "Queue-Times — Statistiques 2026 Ferrari Land",
    url: "https://queue-times.com/parks/277/stats/2026?hide_archived=true",
    usedFor:
      "Moyennes 2026 : Red Force 66, Gallery 47, Flying Dreams 39, Maranello 39, Thrill Towers 31, Racing Legends 24.",
    kind: "historique",
  },
  {
    title: "Thrill Data — 20 septembre (date de calendrier, pas le dimanche 2026)",
    url: "https://www.thrill-data.com/research/portaventura/09/20",
    usedFor:
      "Moyenne historique 30,2 min (petit échantillon ; 2025 était un samedi). Prédiction modèles 2026 ~25 min. NE PAS utiliser comme analogie directe du dimanche 2026.",
    kind: "historique",
  },
  {
    title: "Thrill Data — 21 septembre",
    url: "https://www.thrill-data.com/research/portaventura/09/21",
    usedFor:
      "Meilleure analogie de dimanche post-rentrée : Shambhala 41, Hurakan 41, Stampida 39, Furius 38, Street 30,5, Silver 30, Templo 29, Khan 24, Diablo 21, Tutuki 20,5. Moyenne parc 18,9 min (2025 était un dimanche, 16,1 min).",
    kind: "historique",
  },
  {
    title: "Thrill Data — 22 septembre",
    url: "https://www.thrill-data.com/research/portaventura/09/22",
    usedFor:
      "Lundi/mardi post-rentrée : moyenne 17,8 min (2025 lundi 14,5). Shambhala 40, Hurakan 39, Furius 31, Street 27, Khan 22.",
    kind: "historique",
  },
  {
    title: "Pafans — Calendrier et horaires 2026",
    url: "https://www.pafans.com/info/calendario-de-port-aventura",
    usedFor:
      "Contraste des horaires septembre (PA 10:30–18:00 / 19:00 ; Ferrari Land 16:30–22:00). Parking ~10:00. Halloween 19/09–15/11. Caribe Aquatic Park jusqu’au ~20/09.",
    kind: "prévision",
  },
  {
    title: "Pafans — Horaires des attractions",
    url: "https://www.pafans.com/info/horarios-atracciones",
    usedFor:
      "Les attractions n’ouvrent pas toutes en même temps ; l’eau peut fermer à la tombée de la nuit. Confirmation visuelle au panneau de chaque file.",
    kind: "guide",
  },
  {
    title: "Wartezeiten — Red Force septembre 2025 (profil horaire)",
    url: "https://www.wartezeiten.app/es/ferrariland/atraccion/red-force/archivo/9-2025.html",
    usedFor:
      "Profil horaire Red Force en septembre : 16h ~85, 17h ~80, 18h ~77, 19h ~81, 20h ~71, 21h ~47, 22h ~47 (moyenne de TOUT le mois, y compris les jours chargés de début de mois). On l’échelle à un jour ~55 %.",
    kind: "historique",
  },
  {
    title: "Parque Temático — Hotel El Paso 2026",
    url: "https://www.parquetematico.net/portaventura/hoteles/elpaso/",
    usedFor:
      "Hébergement de cette visite. Parking à l’hôtel. Pas d’accès direct à Far West : 8–10 min jusqu’à l’entrée principale (fontaine de Woody). Accès hôtes ~30 min avant. Check-in : carte = clé + entrée. Chambre jusqu’à 15:00 (arrivée) / 11:00 (départ). Consigne payante.",
    kind: "guide",
  },
  {
    title: "Blog officiel PortAventura — Parcours selon le profil",
    url: "https://www.portaventuraworld.com/blog/las-mejores-rutas-por-portaventura-segun-tu-perfil-de-visitante",
    usedFor:
      "Répartition officielle des 6 mondes et conseil de ne pas zigzaguer. Ferrari Land est un parc à part, à côté de l’entrée.",
    kind: "officiel",
  },
];
