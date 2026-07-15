'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import type { FamilyMember } from '@/lib/data';

/**
 * Cabecera cinematográfica para las páginas individuales de José e Ilhuan.
 * Reutiliza el lenguaje visual del Hero principal (parallax, reveal, grano)
 * pero centrado en un único retrato a pantalla completa.
 */
export default function PersonHero({ member }: { member: FamilyMember }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imgWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imgWrapRef.current,
        { scale: 1.3, opacity: 0 },
        { scale: 1, opacity: 1, duration: 2.2, ease: 'power2.out' }
      );
      gsap.fromTo(
        '[data-person-reveal]',
        { opacity: 0, yPercent: 40 },
        { opacity: 1, yPercent: 0, duration: 1.3, stagger: 0.12, ease: 'power4.out', delay: 0.6 }
      );

      const section = sectionRef.current;
      const imgWrap = imgWrapRef.current;
      if (!section || !imgWrap) return;

      const onMouseMove = (e: MouseEvent) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;
        gsap.to(imgWrap, { x: x * 16, y: y * 16, duration: 1.6, ease: 'power3.out' });
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
          src={member.portrait}
          alt={`${member.name} — ${member.role}`}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-ink/70" />
        <div className="absolute inset-0 bg-ink/10" />
      </div>

      <div className="relative z-10 w-full px-6 pb-16 md:px-16 md:pb-24">
        <span data-person-reveal className="eyebrow block">
          {member.role} · {member.born}
        </span>
        <h1 className="mt-4 font-display text-huge font-light leading-[0.88]">
          <span data-person-reveal className="reveal-mask block">
            <span className="block">{member.name}</span>
          </span>
        </h1>
        <p data-person-reveal className="mt-6 max-w-lg text-sm font-light leading-relaxed text-paper/80 md:text-base">
          {member.bio}
        </p>
      </div>

      <div className="absolute bottom-8 right-6 flex items-center gap-3 md:right-16">
        <span data-person-reveal className="eyebrow">Scroll</span>
        <span className="h-8 w-px animate-pulse bg-paper/50" />
      </div>
    </section>
  );
}
