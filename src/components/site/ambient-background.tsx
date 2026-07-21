// Rendered once (see admin/layout.tsx and (public)/layout.tsx), behind
// every page on the site. `fixed` (not `absolute`) so it stays put during
// scroll instead of moving with content.
//
// Two layers: a fine film-grain texture for overall texture, plus a few
// soft accent-color blobs for presence - kept deliberately low-opacity so
// the homepage's alternating section tints (see section-band.tsx) still
// read clearly as dividers on top of it, rather than blending in.
const NOISE_BACKGROUND =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-15%] left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-[0.09] blur-3xl dark:opacity-[0.14]" />
      <div className="absolute top-[30%] right-[-15%] size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-[0.08] blur-3xl dark:opacity-[0.12]" />
      <div className="absolute bottom-[-20%] left-[-12%] size-[32rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-[0.07] blur-3xl dark:opacity-[0.1]" />
      <div className="absolute bottom-[5%] right-1/3 size-[26rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-[0.06] blur-3xl dark:opacity-[0.09]" />
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
