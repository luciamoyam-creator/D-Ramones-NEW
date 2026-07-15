'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { bornInIbizaPhrases, bornInIbizaFull } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

export default function BornInIbiza() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const phraseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const finalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const phrases = phraseRefs.current.filter(Boolean) as HTMLDivElement[];
      const totalSteps = phrases.length + 1; // +1 for the final paragraph

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: `+=${totalSteps * 100}%`,
          scrub: 1,
          pin: true,
        },
      });

      phrases.forEach((phrase, i) => {
        tl.fromTo(
          phrase,
          { opacity: 0, filter: 'blur(14px)', yPercent: 8 },
          { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration: 0.6, ease: 'power2.out' }
        ).to(phrase, {
          opacity: 0,
          filter: 'blur(14px)',
          yPercent: -8,
          duration: 0.6,
          ease: 'power2.in',
          delay: 0.3,
        });
      });

      if (finalRef.current) {
        tl.fromTo(
          finalRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
        );
      }

      if (bgRef.current) {
        gsap.to(bgRef.current, {
          scale: 1.12,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: `+=${totalSteps * 100}%`,
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-ink">
      <div ref={bgRef} className="absolute inset-0 scale-100">
        <Image
          src="/images/duo-stage-silhouette.jpeg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.18] grayscale"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink" />
      </div>

      <div className="absolute left-6 top-8 md:left-16 md:top-12">
        <span className="eyebrow">01 — Origin</span>
      </div>

      <div className="flex h-full w-full items-center justify-center px-6">
        {bornInIbizaPhrases.map((phrase, i) => (
          <div
            key={phrase}
            ref={(el) => {
              phraseRefs.current[i] = el;
            }}
            className="absolute font-display text-giant font-light text-paper opacity-0"
          >
            {phrase}
          </div>
        ))}

        <div
          ref={finalRef}
          className="absolute max-w-2xl px-4 text-center font-display text-xl font-light leading-relaxed text-stone opacity-0 md:text-2xl"
        >
          {bornInIbizaFull}
        </div>
      </div>
    </section>
  );
}
