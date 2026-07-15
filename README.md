# D-RAMØNES — Web Experience

Experiencia cinematográfica para el dúo D-RAMØNES. Next.js 14 (App Router) + TypeScript + Tailwind + GSAP/ScrollTrigger + Lenis + Three.js.

## Puesta en marcha

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

Para producción:

```bash
npm run build
npm run start
```

## Estructura

```
app/
  layout.tsx          → fuentes (Fraunces, Inter, Space Grotesk, Archivo Black, Anton), SEO
  page.tsx             → ensambla las 6 secciones de la home
  jose/page.tsx        → página individual de José (bio + mapa interactivo + eventos)
  iluhan/page.tsx       → página individual de Ilhuan (bio + línea de tiempo + eventos)
  globals.css          → estilos base y utilidades
components/
  Hero.tsx             → Sección 1 (con barras de cine + efecto Ken Burns continuo)
  BornInIbiza.tsx       → Sección 2 (scroll pinned, frases secuenciales, fondo cinematográfico)
  Legacy.tsx            → Sección 3 (retratos con parallax + enlace a página individual)
  WorldGlobe.tsx        → Sección 4 (globo 3D interactivo — países clicables)
  Events.tsx            → Sección 5 (carrusel horizontal por scroll)
  Contact.tsx            → Sección 6
  PersonHero.tsx         → Cabecera cinematográfica para /jose y /iluhan
  Timeline.tsx            → Línea de tiempo de Ilhuan (bebé / niño / actualidad)
  Nav.tsx                 → navegación fija + indicador de progreso
  SmoothScroll.tsx         → Lenis + sincronización con ScrollTrigger
  CustomCursor.tsx          → cursor personalizado — disco minimalista giratorio
  GrainOverlay.tsx           → grano cinematográfico persistente
  Vignette.tsx                → viñeta cinematográfica sutil en los bordes
  RevealText.tsx               → helper reutilizable de texto animado
lib/
  data.ts                     → TODO el contenido editable (ver abajo)
public/images/                 → fotografías del proyecto
```

## Cómo editar contenido

**Todo el texto y los datos viven en `lib/data.ts`**: nombres, biografías, años de
nacimiento, países donde José ha pinchado (con su descripción, foto y año), eventos,
email de contacto, Instagram, frases de la Sección 2 y las etapas de la línea de
tiempo de Ilhuan. No hace falta tocar los componentes para cambiar contenido.

### El globo interactivo (`worldStops`)

Cada país (Rumanía, Alemania, Bélgica, Azerbaiyán, Qatar, Dubái) es un objeto en
`worldStops` con `country`, `city`, `year`, `headline`, `description`, `image` y,
opcionalmente, `highlight` (usado en Qatar para destacar el Mundial de Fútbol 2022).
Al hacer click sobre un marcador del globo (o sobre el nombre del país en la lista),
se abre un panel a pantalla completa con esa información.

### Marca — D-RAMØNES con Ø

El nombre de la marca se escribe siempre `D-RAMØNES`, con el carácter especial
**Ø** en lugar de la letra O. Está definido una sola vez en `artist.name` dentro de
`lib/data.ts` — si necesitas usarlo en un texto nuevo, copia el carácter Ø desde ahí
para mantener la consistencia. El logotipo (en el Hero, el menú y la sección de
contacto) usa la tipografía exclusiva `font-logo` (Archivo Black); el resto de la
web sigue usando Fraunces/Inter/Space Grotesk como antes. El menú de navegación usa
`font-nav` (Anton) para un look más contundente.

## Cómo sustituir imágenes

Todas las imágenes se cargan desde `/public/images/`. Para cambiar una foto, sustituye el archivo manteniendo el mismo nombre, o edita la ruta correspondiente en `lib/data.ts` / `components/Hero.tsx`.

Imágenes actuales incluidas (puedes reemplazarlas por las tuyas en alta resolución):

| Archivo | Uso |
|---|---|
| `hero-duo-silhouette.png` | Fondo de la Sección 1 (Hero) |
| `jose-portrait-beach.jpeg` | Retrato principal de José (Sección 3, PersonHero, Qatar) |
| `jose-carnales-portrait.jpeg` | Detalle de José / Azerbaiyán en el globo |
| `jose-festival-waterfall.jpeg` | Evento — Waterfall / Rumanía en el globo |
| `ilhuan-unexpected-sunset.png` | Retrato principal de Ilhuan (Sección 3) + Evento The Unexpected + hub Ibiza |
| `ilhuan-night-set.png` | Detalle de Ilhuan / etapa "Hoy" en su línea de tiempo |
| `duo-carnales-mountains.jpeg` | Evento — Carnales / Bélgica en el globo |
| `duo-silhouette-beachclub.jpeg` | Evento — Closing Set / Dubái en el globo |
| `duo-stage-silhouette.jpeg` | Alemania en el globo + fondo cinematográfico de "Born in Ibiza" |
| `jose-legacy-baby.jpeg` | Etapa "bebé" en la línea de tiempo de Ilhuan |
| `ilhuan-legacy-child.jpeg` | Etapa "niño" en la línea de tiempo de Ilhuan |

**Importante:** las fotos de Rumanía, Alemania, Bélgica, Azerbaiyán, Qatar y Dubái
en el globo interactivo son, por ahora, fotos ya existentes del proyecto reutilizadas
como marcador visual — sustitúyelas en `lib/data.ts` (campo `image` de cada
`worldStop`) por fotos reales de esos eventos en cuanto las tengas, para máximo impacto.

Recomendación: exporta las fotos en `.webp` o `.jpg` a máx. 2500px de lado largo para mantener el rendimiento — Next/Image ya optimiza automáticamente el resto.

## Notas técnicas

- **Lenis + GSAP ScrollTrigger** están sincronizados en `SmoothScroll.tsx` — no añadas otro smooth-scroll library.
- El globo 3D usa **Three.js puro** (sin React Three Fiber) por control fino sobre el raycasting de países; el hub de las líneas es Ibiza (`lib/data.ts → cities[0]`). El click sobre un marcador (distinto de un arrastre) abre el panel de experiencia de ese país.
- Todas las animaciones respetan `prefers-reduced-motion`.
- El cursor personalizado (disco minimalista giratorio) se desactiva automáticamente en dispositivos táctiles.
- `Vignette.tsx` añade una viñeta sutil permanente; `GrainOverlay.tsx` el grano de película.
- SEO/OpenGraph configurado en `app/layout.tsx`; cada página individual (`/jose`, `/iluhan`) tiene su propio `metadata`.

## Stack

Next.js 14 · React 18 · TypeScript · Tailwind CSS · GSAP + ScrollTrigger · Lenis · Three.js
