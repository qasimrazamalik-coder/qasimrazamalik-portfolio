export default function NotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-glacier">404 · off the trail</p>
      <h1 className="text-5xl font-medium tracking-tight">This path isn’t on the map.</h1>
      <a href="/" className="rounded-full bg-glacier px-6 py-3 font-medium text-night">Back to base camp</a>
    </main>
  );
}
