import type { Metadata } from 'next';
import Nav from '@/components/Nav';
import PersonHero from '@/components/PersonHero';
import Timeline from '@/components/Timeline';
import Events from '@/components/Events';
import Contact from '@/components/Contact';
import { family } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Ilhuan — D-RAMØNES',
  description: 'Raised inside the booth. The next chapter of D-RAMØNES.',
};

export default function IlhuanPage() {
  const ilhuan = family.find((m) => m.id === 'ilhuan')!;

  return (
    <main className="relative w-full bg-ink">
      <Nav />
      <PersonHero member={ilhuan} />

      <section className="px-6 py-20 md:px-16 md:py-28">
        <span className="eyebrow">The Next Chapter</span>
        <h2 className="mt-4 max-w-2xl font-display text-giant font-light leading-[0.95]">
          Born into a legacy, now writing its next city, its next room, its next night.
        </h2>
      </section>

      <Timeline />

      <div id="events">
        <Events />
      </div>
      <div id="contact">
        <Contact />
      </div>
    </main>
  );
}
