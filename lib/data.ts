// ============================================================================
// D-RAMØNES — Contenido editable
// Cambia aquí los textos, eventos y ciudades sin tocar los componentes.
// Las imágenes se referencian desde /public/images/ — sustitúyelas
// manteniendo el mismo nombre de archivo, o cambia la ruta aquí.
// ============================================================================

export const artist = {
  name: 'D-RAMØNES',
  tagline: ['Two Generations.', 'One Island.', 'One Sound.'],
};

export type FamilyMember = {
  id: 'jose' | 'ilhuan';
  name: string;
  role: string;
  bio: string;
  years: string;
  born: string;
  portrait: string;
  detailImage: string;
};

export const family: FamilyMember[] = [
  {
    id: 'jose',
    name: 'José',
    role: 'The Founder',
    bio: 'Three decades behind the decks of Ibiza. José built his sound in the era before algorithms — vinyl crates, sunrise sets, and a room that always kept dancing.',
    years: 'Since 1994',
    born: 'Born 1975',
    portrait: '/images/jose-portrait-beach.jpeg',
    detailImage: '/images/jose-carnales-portrait.jpeg',
  },
  {
    id: 'ilhuan',
    name: 'Ilhuan',
    role: 'The Next Chapter',
    bio: 'Raised inside the booth, Ilhuan grew up reading a crowd before he could drive. His sets carry the island\u2019s history forward into new rooms, new cities, new generations.',
    years: 'Since 2016',
    born: 'Born 2005',
    portrait: '/images/ilhuan-unexpected-sunset.png',
    detailImage: '/images/ilhuan-night-set.png',
  },
];

export type City = {
  id: string;
  name: string;
  country: string;
  event: string;
  year: string;
  image: string;
  lat: number;
  lng: number;
};

// El hub siempre debe ser el primer elemento — es el punto de origen (Ibiza)
// del que parten todos los arcos del globo interactivo.
export const cities: City[] = [
  { id: 'ibiza', name: 'Ibiza', country: 'Spain', event: 'Home. Where it all began.', year: 'Est. 1994', image: '/images/ilhuan-unexpected-sunset.png', lat: 38.9067, lng: 1.4206 },
];

export type CountryStop = {
  id: string;
  country: string;
  city: string;
  lat: number;
  lng: number;
  year: string;
  headline: string;
  description: string;
  image: string;
  highlight?: string;
};

// Países donde José ha pinchado — cada uno abre su propia experiencia
// al hacer click sobre el globo interactivo.
export const worldStops: CountryStop[] = [
  {
    id: 'romania',
    country: 'Romania',
    city: 'Bucharest',
    lat: 44.4268,
    lng: 26.1025,
    year: '2019',
    headline: 'Eastern nights, island sound.',
    description:
      'A crowd that had never heard the Ibiza sound live, dancing until sunrise to a set built on thirty years of vinyl instinct.',
    image: '/images/jose-festival-waterfall.jpeg',
  },
  {
    id: 'germany',
    country: 'Germany',
    city: 'Berlin',
    lat: 52.5200,
    lng: 13.4050,
    year: '2021',
    headline: 'Warehouse nights.',
    description:
      'Concrete, fog, and a crowd that dances for the music alone. Berlin gave José one of his most stripped-back, purest sets.',
    image: '/images/duo-stage-silhouette.jpeg',
  },
  {
    id: 'belgium',
    country: 'Belgium',
    city: 'Brussels',
    lat: 50.8503,
    lng: 4.3517,
    year: '2022',
    headline: 'A room built on bass.',
    description:
      'Belgium\u2019s electronic scene meets Ibiza heritage — a night that blurred the line between techno crowd and house family.',
    image: '/images/duo-carnales-mountains.jpeg',
  },
  {
    id: 'azerbaijan',
    country: 'Azerbaijan',
    city: 'Baku',
    lat: 40.4093,
    lng: 49.8671,
    year: '2022',
    headline: 'Where East meets the island.',
    description:
      'A skyline of fire and glass, and a dancefloor discovering the sound of Ibiza for the very first time.',
    image: '/images/jose-carnales-portrait.jpeg',
  },
  {
    id: 'qatar',
    country: 'Qatar',
    city: 'Doha',
    lat: 25.2854,
    lng: 51.5310,
    year: '2022',
    headline: 'The world was watching.',
    description:
      'José played Doha during the biggest stage in world sport — a set that carried the island\u2019s sound to a global audience.',
    image: '/images/jose-portrait-beach.jpeg',
    highlight: 'FIFA World Cup 2022',
  },
  {
    id: 'dubai',
    country: 'UAE',
    city: 'Dubai',
    lat: 25.2048,
    lng: 55.2708,
    year: '2023',
    headline: 'Desert nights, island roots.',
    description:
      'From rooftop skylines to beach clubs on the Gulf — Dubai\u2019s nightlife met three decades of Ibiza-built experience.',
    image: '/images/duo-silhouette-beachclub.jpeg',
  },
];

export type EventItem = {
  id: string;
  title: string;
  venue: string;
  location: string;
  date: string;
  image: string;
};

export const events: EventItem[] = [
  {
    id: 'ev1',
    title: 'The Unexpected',
    venue: 'The Unexpected Hotel',
    location: 'Ibiza, Spain',
    date: 'Summer 2026',
    image: '/images/ilhuan-unexpected-sunset.png',
  },
  {
    id: 'ev2',
    title: 'Carnales',
    venue: 'Open Air Festival',
    location: 'Sierra de Madrid',
    date: 'September 2025',
    image: '/images/duo-carnales-mountains.jpeg',
  },
  {
    id: 'ev3',
    title: 'Sunset Session',
    venue: 'Beach Club',
    location: 'San Antonio, Ibiza',
    date: 'August 2025',
    image: '/images/jose-portrait-beach.jpeg',
  },
  {
    id: 'ev4',
    title: 'Waterfall',
    venue: 'Main Stage',
    location: 'Iguazú, Argentina',
    date: 'March 2025',
    image: '/images/jose-festival-waterfall.jpeg',
  },
  {
    id: 'ev5',
    title: 'Closing Set',
    venue: 'Rooftop',
    location: 'Barcelona, Spain',
    date: 'October 2024',
    image: '/images/duo-silhouette-beachclub.jpeg',
  },
];

export const contact = {
  email: 'dramonesdj@gmail.com',
  instagram: '@dramonesdjs',
  instagramUrl: 'https://www.instagram.com/dramonesdjs?igsh=cHgwM21rM3RjdHVm',
};

export const bornInIbizaPhrases = [
  'Born in Ibiza.',
  'Two generations.',
  'One legacy.',
  'House.',
  'Experience.',
];

export const bornInIbizaFull =
  'What started as one man\u2019s obsession with a sound became a language passed between father and son. D-RAMØNES is not a project — it is an inheritance, carried from vinyl to digital, from one dancefloor to the next, without ever losing the island in its blood.';

// Etapas de la línea de tiempo de Ilhuan — bebé, niño, actualidad.
export const ilhuanTimeline = [
  {
    id: 'baby',
    label: 'The Beginning',
    year: 'Born 2005',
    image: '/images/jose-legacy-baby.jpeg',
    caption: 'Raised in Ibiza, inside a family already living for the music.',
  },
  {
    id: 'child',
    label: 'Growing Up',
    year: 'Childhood',
    image: '/images/ilhuan-legacy-child.jpeg',
    caption: 'Long before the booth, the island itself was the classroom.',
  },
  {
    id: 'now',
    label: 'Today',
    year: 'Since 2016',
    image: '/images/ilhuan-night-set.png',
    caption: 'Now carrying the family sound to rooms his father never played.',
  },
];
