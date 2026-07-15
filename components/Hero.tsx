'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { artist } from '@/lib/data';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      tl.fromTo(
        imgWrapRef.current,
        { scale: 1.25, opacity: 0 },
        { scale: 1.08, opacity: 1, duration: 2.4, ease: 'power2.out' }
      )
        .fromTo(
          '[data-letterbox]',
          { scaleY: 0 },
          { scaleY: 1, duration: 1.4, ease: 'power4.out', stagger: 0.05 },
          '-=2.2'
        )
        .fromTo(
          '[data-hero-logo]',
          { opacity: 0, yPercent: 40 },
          { opacity: 1, yPercent: 0, duration: 1.4 },
          '-=1.6'
        )
        .fromTo(
          lineRefs.current,
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.3, stagger: 0.12 },
          '-=0.9'
        )
        .fromTo(
          '[data-hero-scroll]',
          { opacity: 0 },
          { opacity: 1, duration: 1.2 },
          '-=0.4'
        );

      // Respiración continua tipo "Ken Burns" sobre el fondo — sutil, nunca se detiene
      gsap.to(imgWrapRef.current, {
        scale: 1.16,
        duration: 16,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        delay: 2.2,
      });

      // Sutil parallax con el ratón
      const section = sectionRef.current;
      const imgWrap = imgWrapRef.current;
      if (!section || !imgWrap) return;

      const onMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        gsap.to(imgWrap, {
          x: x * 18,
          y: y * 18,
          duration: 1.6,
          ease: 'power3.out',
        });
      };
      window.addEventListener('mousemove', onMouseMove);
      return () => window.removeEventListener('mousemove', onMouseMove);
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-end overflow-hidden bg-ink"
    >
      <div ref={imgWrapRef} className="absolute inset-0 -z-10 scale-110">
        <Image
          src="/images/hero-duo-silhouette.png"
          alt="D-RAMØNES, José e Ilhuan, silueta artística"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/60" />
        <div className="absolute inset-0 bg-ink/20" />
      </div>

      <div
        data-hero-logo
        className="absolute left-1/2 top-[12vh] -translate-x-1/2 text-center"
      >
        <span className="eyebrow">Ibiza — Est. 1994</span>
        <h1 className="mt-4 font-logo text-xl tracking-[0.12em] md:text-2xl">
          {artist.name}
        </h1>
      </div>

      <div className="relative z-10 w-full px-6 pb-16 md:px-16 md:pb-24">
        <div className="font-display text-huge font-light leading-[0.92] text-paper">
          {artist.tagline.map((line, i) => (
            <span key={i} className="reveal-mask">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block"
              >
                {line}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div
        data-hero-scroll
        className="absolute bottom-8 right-6 flex items-center gap-3 md:right-16"
      >
        <span className="eyebrow">Scroll to enter</span>
        <span className="h-8 w-px animate-pulse bg-paper/50" />
      </div>

      {/* Barras de cine — dan profundidad y sensación de encuadre de película */}
      <div
        data-letterbox
        className="pointer-events-none absolute left-0 top-0 z-20 h-[5vh] w-full origin-top bg-ink md:h-[7vh]"
      />
      <div
        data-letterbox
        className="pointer-events-none absolute bottom-0 left-0 z-20 h-[5vh] w-full origin-bottom bg-ink md:h-[7vh]"
      />
    </section>
  );
}
