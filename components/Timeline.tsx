'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ilhuanTimeline } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

/**
 * Línea de tiempo de Ilhuan — bebé, niño, actualidad.
 * Tres paneles a pantalla completa que revelan su evolución.
 */
export default function Timeline() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-timeline-panel]');
      panels.forEach((panel) => {
        gsap.fromTo(
          panel.querySelector('[data-timeline-img]'),
          { scale: 1.25 },
          {
            scale: 1,
            duration: 1.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 85%' },
          }
        );
        gsap.fromTo(
          panel.querySelectorAll('[data-timeline-text]'),
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: panel, start: 'top 75%' },
          }
        );
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full bg-ink">
      <div className="px-6 pb-10 pt-20 md:px-16 md:pb-16 md:pt-28">
        <span className="eyebrow">The Evolution</span>
        <h2 className="mt-4 font-display text-giant font-light">Growing into the sound.</h2>
      </div>

      <div className="flex w-full flex-col">
        {ilhuanTimeline.map((stage, i) => (
          <div
            key={stage.id}
            data-timeline-panel
            data-cursor-hover
            className="group relative flex h-[85vh] w-full items-end overflow-hidden md:h-screen"
          >
            <div data-timeline-img className="absolute inset-0">
              <Image
                src={stage.image}
                alt={stage.label}
                fill
                sizes="100vw"
                className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/10" />
            </div>

            <div className="relative z-10 w-full px-6 pb-14 md:px-16 md:pb-20">
              <span data-timeline-text className="eyebrow block">
                {String(i + 1).padStart(2, '0')} — {stage.year}
              </span>
              <h3 data-timeline-text className="mt-3 font-display text-6xl font-light leading-none md:text-8xl">
                {stage.label}
              </h3>
              <p data-timeline-text className="mt-5 max-w-sm text-sm font-light leading-relaxed text-paper/80 md:text-base">
                {stage.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
