'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { artist } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function Nav() {
  const progressRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // El logo del nav aparece tras pasar el hero
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top+=100 top',
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        if (progressRef.current) {
          gsap.set(progressRef.current, { scaleY: self.progress });
        }
      },
    });

    return () => st.kill();
  }, []);

  return (
    <nav
      className={`fixed left-0 top-0 z-50 flex w-full items-center justify-between px-6 py-6 transition-opacity duration-700 md:px-16 ${
        visible ? 'opacity-100' : 'pointer-events-none opacity-0'
      }`}
    >
      <a href="/" data-cursor-hover className="font-logo text-xs tracking-[0.1em] md:text-sm">
        {artist.name}
      </a>

      <div className="hidden items-center gap-7 font-nav text-sm uppercase tracking-wide text-stone md:flex">
        <a href="/#legacy" data-cursor-hover className="transition-colors hover:text-paper">Legacy</a>
        <a href="/#world" data-cursor-hover className="transition-colors hover:text-paper">World</a>
        <a href="/#events" data-cursor-hover className="transition-colors hover:text-paper">Events</a>
        <a href="/jose" data-cursor-hover className="transition-colors hover:text-paper">José</a>
        <a href="/iluhan" data-cursor-hover className="transition-colors hover:text-paper">Ilhuan</a>
        <a href="/#contact" data-cursor-hover className="transition-colors hover:text-paper">Contact</a>
      </div>

      <div className="relative h-8 w-px bg-line">
        <div
          ref={progressRef}
          className="absolute left-0 top-0 h-full w-full origin-top bg-paper"
          style={{ transform: 'scaleY(0)' }}
        />
      </div>
    </nav>
  );
}
