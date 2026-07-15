/**
 * Viñeta cinematográfica sutil y persistente — oscurece ligeramente las
 * esquinas de la pantalla para dar profundidad, como una gradación de color
 * de cine. Se combina con GrainOverlay para reforzar la estética premium.
 */
export default function Vignette() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95]"
      style={{
        background:
          'radial-gradient(ellipse at center, transparent 45%, rgba(10,10,9,0.55) 100%)',
      }}
    />
  );
}
