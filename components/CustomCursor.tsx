'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

/**
 * Cursor personalizado — un pequeño "disco" minimalista que sigue al ratón.
 * Combina un punto central fijo con un anillo exterior que gira lentamente
 * como un vinilo, y una marca de "aguja" que solo aparece al pasar por
 * encima de elementos interactivos (data-cursor-hover).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const discRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(true);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches);

    const dot = dotRef.current;
    const disc = discRef.current;
    if (!dot || !disc) return;

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
    const xDiscTo = gsap.quickTo(disc, 'x', { duration: 0.45, ease: 'power3' });
    const yDiscTo = gsap.quickTo(disc, 'y', { duration: 0.45, ease: 'power3' });

    // Rotación continua del disco, como un vinilo girando en el plato.
    const spin = gsap.to(disc, {
      rotate: 360,
      duration: 6,
      repeat: -1,
      ease: 'none',
    });

    const move = (e: MouseEvent) => {
      setHidden(false);
      xTo(e.clientX);
      yTo(e.clientY);
      xDiscTo(e.clientX);
      yDiscTo(e.clientY);
    };

    const over = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setHovering(!!target.closest('a, button, [data-cursor-hover]'));
    };

    const leave = () => setHidden(true);

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    document.documentElement.addEventListener('mouseleave', leave);
    return () => {
      spin.kill();
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
      document.documentElement.removeEventListener('mouseleave', leave);
    };
  }, []);

  if (isTouch) return null;

  return (
    <>
      {/* Punto central — precisión */}
      <div
        ref={dotRef}
        className={`pointer-events-none fixed left-0 top-0 z-[110] h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-paper transition-opacity duration-300 ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
      />

      {/* Disco exterior — anillo giratorio con marcas, estilo vinilo minimalista */}
      <div
        ref={discRef}
        className={`pointer-events-none fixed left-0 top-0 z-[110] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 ${
          hidden ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <svg
          width={hovering ? 56 : 34}
          height={hovering ? 56 : 34}
          viewBox="0 0 56 56"
          className="transition-all duration-300 ease-cinematic"
          style={{ transform: 'translate(-50%, -50%)' }}
        >
          <circle
            cx="28"
            cy="28"
            r="26.5"
            fill="none"
            stroke="currentColor"
            className={hovering ? 'text-paper' : 'text-paper/50'}
            strokeWidth="1"
          />
          {/* Marcas de "surco" de vinilo */}
          {Array.from({ length: 10 }).map((_, i) => {
            const angle = (i / 10) * Math.PI * 2;
            const x1 = 28 + Math.cos(angle) * 22;
            const y1 = 28 + Math.sin(angle) * 22;
            const x2 = 28 + Math.cos(angle) * 25.5;
            const y2 = 28 + Math.sin(angle) * 25.5;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="currentColor"
                className={hovering ? 'text-paper' : 'text-paper/40'}
                strokeWidth="1"
              />
            );
          })}
          {/* "Etiqueta" central, como el label de un vinilo */}
          <circle
            cx="28"
            cy="28"
            r={hovering ? 9 : 6}
            fill="currentColor"
            className="text-sand transition-all duration-300 ease-cinematic"
            fillOpacity={hovering ? 0.9 : 0.55}
          />
        </svg>
      </div>
    </>
  );
}
