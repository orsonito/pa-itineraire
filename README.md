# Plan PortAventura World · 20–22 septembre 2026

App **PWA pour le téléphone** : itinéraire depuis l’**Hotel El Paso** (arrivée le dimanche 20), files d’attente et Ferrari Land. Installe-la sur l’écran d’accueil et utilise-la dans le parc.

Les chiffres de file sont des **estimations**, pas des données officielles.

## Comment la lancer

```bash
npm install
npm run dev
```

Ouvre [http://localhost:43123](http://localhost:43123).

## Modèle

Basée sur [my-next-template](https://github.com/orsonito/my-next-template) : générateurs de composants/pages, icônes PWA et client HTTP.

```bash
npm run g:c Nom         # composant client dans src/components
npm run g:p Nom         # page dans src/app
npm run pwa:icons       # icônes PWA
```

### Installer sur le téléphone

1. Ouvre l’URL dans Safari (iPhone) ou Chrome (Android).
2. **iPhone :** Partager → **Ajouter à l’écran d’accueil**.
3. **Android :** menu → **Installer l’app**, ou le bouton dans l’onglet **Plus**.

Onglets inférieurs :

- **Actu** — conseil de **quoi faire maintenant** (heure de Madrid)
- **Parcours** — itinéraire du jour, Express, zones
- **Files** — attente par heure (normale / Express le dimanche)
- **Jours** — affluence et comparatif
- **Ferrari** — lundi soir
- **Plus** — Express, zones, sources, installer

## Production

```bash
npm run build
npm start
```

## Sources

- https://www.parquetematico.net/portaventura/cuando-ir
- https://www.portaventuraworld.com/horarios-calendario
- https://queue-times.com/es/parks/19/calendar/2026/09
