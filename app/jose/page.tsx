import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import PersonHero from '@/components/PersonHero';
import WorldGlobe from '@/components/WorldGlobe';
import Events from '@/components/Events';
import Contact from '@/components/Contact';
import { family } from '@/lib/data';

export const metadata: Metadata = {
  title: 'José — D-RAMØNES',
  description: 'Three decades behind the decks of Ibiza. The founder of D-RAMØNES.',
};

export default function JosePage() {
  const jose = family.find((m) => m.id === 'jose')!;

  return (
    <main className="relative w-full bg-ink">
      <Nav />
      <PersonHero member={jose} />

      <section className="px-6 py-20 md:px-16 md:py-28">
        <span className="eyebrow">The Founder</span>
        <h2 className="mt-4 max-w-2xl font-display text-giant font-light leading-[0.95]">
          Thirty years of vinyl instinct, one island, and a sound that never stopped moving.
        </h2>
      </section>

      <div id="world">
        <WorldGlobe />
      </div>
      <div id="events">
        <Events />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </main>
  );
}
