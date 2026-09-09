# Plan PortAventura World · 20–22 septiembre 2026

App **PWA para el teléfono**: itinerario desde el **Hotel El Paso** (llegada el domingo 20), colas y Ferrari Land. Instálala en la pantalla de inicio y úsala en el parque.

Las cifras de cola son **estimaciones**, no datos oficiales.

## Cómo verlo

```bash
npm install
npm run dev
```

Abre [http://localhost:43123](http://localhost:43123).

## Plantilla

Basada en [my-next-template](https://github.com/orsonito/my-next-template): generadores de componentes/páginas, iconos PWA y cliente HTTP.

```bash
npm run g:c Nombre      # componente cliente en src/components
npm run g:p Nombre      # página en src/app
npm run pwa:icons       # iconos PWA
```

### Instalar en el móvil

1. Abre la URL en Safari (iPhone) o Chrome (Android).
2. **iPhone:** Compartir → **Añadir a pantalla de inicio**.
3. **Android:** menú → **Instalar app**, o el botón en la pestaña **Más**.

Pestañas inferiores:

- **Ahora** — recomendación de **qué hacer ahora** (hora de Madrid)
- **Ruta** — itinerario del día, Express, zonas
- **Colas** — espera por hora (normal / Express el domingo)
- **Días** — afluencia y comparativa
- **Ferrari** — lunes por la tarde
- **Más** — Express, zonas, fuentes, instalar

## Producción

```bash
npm run build
npm start
```

## Fuentes

- https://www.parquetematico.net/portaventura/cuando-ir
- https://www.portaventuraworld.com/horarios-calendario
- https://queue-times.com/es/parks/19/calendar/2026/09
