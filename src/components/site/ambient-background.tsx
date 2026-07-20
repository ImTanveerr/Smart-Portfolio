export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-12%] left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-[0.1] blur-3xl dark:opacity-[0.16]" />
      <div className="absolute top-[35%] right-[-12%] size-[22rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-[0.08] blur-3xl dark:opacity-[0.13]" />
    </div>
  );
}
