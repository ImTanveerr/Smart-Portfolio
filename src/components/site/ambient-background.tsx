// Rendered once in the public layout, behind every page. `fixed` (not
// `absolute`) so it stays put during scroll instead of moving with content.
// Flat and minimal on purpose: no color fields, no blobs, no motion - just a
// very fine static film-grain texture (the classic SVG feTurbulence noise
// filter, tiled) for a subtle, premium finish instead of a flat solid color.
const NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.035] dark:opacity-[0.06]"
        style={{
          backgroundImage: NOISE_BACKGROUND,
          backgroundRepeat: "repeat",
          backgroundSize: "120px 120px",
        }}
      />
    </div>
  );
}
