export function AmbientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute top-[-15%] left-1/2 size-[42rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-[0.16] blur-3xl dark:opacity-[0.24]" />
      <div className="absolute top-[30%] right-[-15%] size-[34rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-[0.14] blur-3xl dark:opacity-[0.2]" />
      <div className="absolute bottom-[-20%] left-[-12%] size-[32rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-a),transparent)] opacity-[0.12] blur-3xl dark:opacity-[0.18]" />
      <div className="absolute bottom-[5%] right-1/3 size-[26rem] rounded-full bg-[radial-gradient(closest-side,var(--accent-b),transparent)] opacity-[0.1] blur-3xl dark:opacity-[0.15]" />
    </div>
  );
}
