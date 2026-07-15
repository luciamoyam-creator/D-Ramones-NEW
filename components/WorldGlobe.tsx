'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cities, worldStops, type CountryStop } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

const RADIUS = 2.4;

function latLngToVector3(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

export default function WorldGlobe() {
  const mountRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredStop, setHoveredStop] = useState<CountryStop | null>(null);
  const [activeStop, setActiveStop] = useState<CountryStop | null>(null);
  const activeStopRef = useRef<CountryStop | null>(null);

  useEffect(() => {
    activeStopRef.current = activeStop;
  }, [activeStop]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6.4);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Globo — wireframe de puntos (dot-matrix), estética de mapa de expedición
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const dotGeometry = new THREE.SphereGeometry(0.012, 6, 6);
    const dotMaterial = new THREE.MeshBasicMaterial({ color: 0x57544c });
    const dotMesh = new THREE.InstancedMesh(dotGeometry, dotMaterial, 2600);
    const dummy = new THREE.Object3D();
    let idx = 0;
    const rows = 60;
    for (let i = 0; i < rows; i++) {
      const lat = -90 + (180 / rows) * i;
      const circumference = Math.cos((lat * Math.PI) / 180);
      const count = Math.max(4, Math.floor(rows * 2 * circumference));
      for (let j = 0; j < count; j++) {
        const lng = (360 / count) * j - 180;
        const pos = latLngToVector3(lat, lng, RADIUS);
        dummy.position.copy(pos);
        dummy.lookAt(pos.clone().multiplyScalar(2));
        dummy.updateMatrix();
        if (idx < 2600) {
          dotMesh.setMatrixAt(idx, dummy.matrix);
          idx++;
        }
      }
    }
    dotMesh.count = idx;
    globeGroup.add(dotMesh);

    // Núcleo interior sutil
    const coreGeometry = new THREE.SphereGeometry(RADIUS - 0.05, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x0a0a09,
      transparent: true,
      opacity: 0.9,
    });
    globeGroup.add(new THREE.Mesh(coreGeometry, coreMaterial));

    // Hub — Ibiza, origen de todos los arcos
    const hub = cities[0];
    const hubPos = latLngToVector3(hub.lat, hub.lng, RADIUS);

    const hubGeo = new THREE.SphereGeometry(0.05, 14, 14);
    const hubMat = new THREE.MeshBasicMaterial({ color: 0xf4f2ed });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubMesh.position.copy(hubPos);
    globeGroup.add(hubMesh);

    // Marcadores de país + arcos hacia Ibiza (hub)
    const stopMeshes: { mesh: THREE.Mesh; stop: CountryStop }[] = [];

    worldStops.forEach((stop) => {
      const pos = latLngToVector3(stop.lat, stop.lng, RADIUS);

      const markerGeo = new THREE.SphereGeometry(0.05, 14, 14);
      const markerMat = new THREE.MeshBasicMaterial({
        color: stop.highlight ? 0xd4af37 : 0xc99a5f,
      });
      const marker = new THREE.Mesh(markerGeo, markerMat);
      marker.position.copy(pos);
      globeGroup.add(marker);
      stopMeshes.push({ mesh: marker, stop });

      // Halo pulsante — más ancho para dejar claro que es interactivo/clicable
      const haloGeo = new THREE.RingGeometry(0.065, 0.1, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: stop.highlight ? 0xd4af37 : 0xc99a5f,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.position.copy(pos);
      halo.lookAt(pos.clone().multiplyScalar(2));
      globeGroup.add(halo);
      gsap.to(halo.scale, {
        x: 2.4,
        y: 2.4,
        z: 2.4,
        duration: 1.8 + Math.random(),
        repeat: -1,
        ease: 'power1.out',
        delay: Math.random() * 1.5,
      });
      gsap.to(haloMat, {
        opacity: 0,
        duration: 1.8 + Math.random(),
        repeat: -1,
        ease: 'power1.out',
        delay: Math.random() * 1.5,
      });

      // Arco curvo entre el país y el hub (Ibiza)
      const mid = pos.clone().add(hubPos).multiplyScalar(0.5).normalize().multiplyScalar(RADIUS + 0.9);
      const curve = new THREE.QuadraticBezierCurve3(pos, mid, hubPos);
      const points = curve.getPoints(50);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({
        color: stop.highlight ? 0xd4af37 : 0xc99a5f,
        transparent: true,
        opacity: 0.35,
      });
      globeGroup.add(new THREE.Line(lineGeo, lineMat));
    });

    // Iluminación ambiental mínima
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // Interacción: raycasting para detectar hover + click sobre marcadores
    const raycaster = new THREE.Raycaster();
    raycaster.params.Mesh.threshold = 0.02;
    const pointer = new THREE.Vector2();
    let hoveredId: string | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    mount.addEventListener('pointermove', onPointerMove);

    let autoRotate = true;
    let downX = 0;
    let downY = 0;
    let moved = false;

    const onPointerDown = (e: PointerEvent) => {
      autoRotate = false;
      downX = e.clientX;
      downY = e.clientY;
      moved = false;
    };
    const onPointerUp = (e: PointerEvent) => {
      autoRotate = true;
      const dist = Math.hypot(e.clientX - downX, e.clientY - downY);
      if (dist < 6 && !moved) {
        // Fue un click, no un arrastre — comprobamos si acertó un marcador
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(stopMeshes.map((c) => c.mesh));
        if (intersects.length > 0) {
          const hit = stopMeshes.find((c) => c.mesh === intersects[0].object);
          if (hit) setActiveStop(hit.stop);
        }
      }
    };
    mount.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    let dragX = 0;
    const onDrag = (e: PointerEvent) => {
      if (e.buttons !== 1) return;
      if (Math.abs(e.movementX) > 1 || Math.abs(e.movementY) > 1) moved = true;
      dragX += e.movementX * 0.005;
    };
    mount.addEventListener('pointermove', onDrag);

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (autoRotate && !activeStopRef.current) {
        globeGroup.rotation.y += delta * 0.08;
      } else if (!activeStopRef.current) {
        globeGroup.rotation.y += dragX;
        dragX *= 0.9;
      }

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(stopMeshes.map((c) => c.mesh));
      if (intersects.length > 0) {
        const hit = stopMeshes.find((c) => c.mesh === intersects[0].object);
        if (hit && hoveredId !== hit.stop.id) {
          hoveredId = hit.stop.id;
          setHoveredStop(hit.stop);
          mount.style.cursor = 'pointer';
        }
      } else if (hoveredId !== null) {
        hoveredId = null;
        setHoveredStop(null);
        mount.style.cursor = 'grab';
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Entrada suave del globo al hacer scroll hasta la sección
    gsap.fromTo(
      globeGroup.scale,
      { x: 0.7, y: 0.7, z: 0.7 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 1.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 70%' },
      }
    );

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointerup', onPointerUp);
      mount.removeEventListener('pointermove', onPointerMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      mount.removeEventListener('pointermove', onDrag);
      renderer.dispose();
      dotGeometry.dispose();
      dotMaterial.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Animación de entrada/salida del panel de experiencia de país
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (activeStop && panelRef.current) {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      gsap.fromTo(
        '[data-country-image]',
        { scale: 1.15 },
        { scale: 1, duration: 1.2, ease: 'power3.out' }
      );
      gsap.fromTo(
        '[data-country-text]',
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
      );
    }
  }, [activeStop]);

  return (
    <section ref={sectionRef} className="relative w-full overflow-hidden bg-ink py-20 md:py-28">
      <div className="px-6 md:px-16">
        <span className="eyebrow">03 — The World</span>
        <h2 className="mt-4 font-display text-giant font-light">Across every dancefloor.</h2>
        <p className="mt-4 max-w-md text-sm font-light text-stone">
          Click any point on the globe to open José&rsquo;s journey through that country.
        </p>
      </div>

      <div className="relative mt-8 grid grid-cols-1 items-center gap-8 px-4 md:mt-4 md:grid-cols-2 md:px-16">
        <div
          ref={mountRef}
          data-cursor-hover
          className="relative h-[55vh] w-full cursor-grab active:cursor-grabbing md:h-[75vh]"
        >
          {hoveredStop && !activeStop && (
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-line bg-ink/80 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-widest2 text-paper backdrop-blur-sm">
              {hoveredStop.country} · {hoveredStop.year}
            </div>
          )}
        </div>

        <div className="relative min-h-[220px] px-2 md:px-0">
          <p className="max-w-xs text-sm font-light leading-relaxed text-stone">
            Six countries. One family sound. Ibiza is the hub every line on this globe leads
            back to — move your cursor across it, then click a point to step inside that
            night.
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
            {worldStops.map((stop) => (
              <button
                key={stop.id}
                data-cursor-hover
                onClick={() => setActiveStop(stop)}
                className="font-mono text-[0.65rem] uppercase tracking-widest2 text-stone transition-colors hover:text-sand"
              >
                {stop.country}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Panel / experiencia expandida del país seleccionado */}
      {activeStop && (
        <div
          ref={panelRef}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/95 p-4 backdrop-blur-md md:p-10"
        >
          <button
            data-cursor-hover
            onClick={() => setActiveStop(null)}
            aria-label="Cerrar"
            className="absolute right-6 top-6 z-10 font-mono text-xs uppercase tracking-widest2 text-stone transition-colors hover:text-paper md:right-12 md:top-10"
          >
            Close ✕
          </button>

          <div className="grid w-full max-w-5xl grid-cols-1 gap-0 overflow-hidden border border-line md:grid-cols-2">
            <div data-country-image className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-[70vh]">
              <Image
                src={activeStop.image}
                alt={`${activeStop.country} — ${activeStop.headline}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover grayscale"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
            </div>

            <div className="flex flex-col justify-center bg-ink p-8 md:p-14">
              <span data-country-text className="eyebrow">
                {activeStop.city}, {activeStop.country} — {activeStop.year}
              </span>

              {activeStop.highlight && (
                <span
                  data-country-text
                  className="mt-4 inline-block w-fit border border-sand/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-widest2 text-sand"
                >
                  {activeStop.highlight}
                </span>
              )}

              <h3 data-country-text className="mt-5 font-display text-4xl font-light leading-[0.95] md:text-5xl">
                {activeStop.headline}
              </h3>
              <p data-country-text className="mt-5 max-w-sm text-sm font-light leading-relaxed text-paper/80 md:text-base">
                {activeStop.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
