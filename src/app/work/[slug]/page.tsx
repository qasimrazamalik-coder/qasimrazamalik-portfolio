import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { projects, tracks } from '@/content/projects';
import { SITE_URL, profile } from '@/content/profile';
import { Experience } from '@/components/ui/Experience';
import { ThemeControls } from '@/components/ui/ThemeControls';

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  const title = `${p.name} — ${tracks.find((t) => t.id === p.track)!.label} case study`;
  const description = `${p.summary} ${p.proof}`.slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/work/${p.slug}` },
    openGraph: { title, description, url: `${SITE_URL}/work/${p.slug}`, type: 'article' },
  };
}

function toUrdu(n: string) {
  return n.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);
}

export default async function WorkPage({ params }: Params) {
  const { slug } = await params;
  const i = projects.findIndex((x) => x.slug === slug);
  if (i < 0) notFound();
  const p = projects[i];
  const track = tracks.find((t) => t.id === p.track)!;
  const inTrack = projects.filter((x) => x.track === p.track);
  const nInTrack = inTrack.findIndex((x) => x.slug === p.slug) + 1;
  const prev = projects[(i - 1 + projects.length) % projects.length];
  const next = projects[(i + 1) % projects.length];
  const related = inTrack.filter((x) => x.slug !== p.slug).slice(0, 3);
  const chapter = String(tracks.findIndex((t) => t.id === p.track) + 1).padStart(2, '0');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: p.name,
    description: `${p.summary} ${p.proof}`,
    codeRepository: p.repo,
    keywords: p.stack.join(', '),
    author: { '@type': 'Person', name: profile.name, url: SITE_URL },
    url: `${SITE_URL}/work/${p.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Experience />
      <header className="fixed inset-x-0 top-0 z-40 border-b border-line/60 bg-night/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 md:px-10">
          <Link href="/#explore" className="group flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mist hover:text-snow">
            <span className="transition-transform group-hover:-translate-x-1">←</span> All work
          </Link>
          <Link href="/" className="hidden text-sm font-medium text-snow md:block">{profile.name}</Link>
          <ThemeControls compact />
        </div>
      </header>

      <main className="px-5 pb-24 pt-32 md:px-10 md:pt-40">
        <article className="relative isolate mx-auto max-w-7xl">
          <span aria-hidden className="chapter-mark">{String(nInTrack).padStart(2, '0')}</span>
          <p className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
            <span lang="ur" dir="rtl" className="font-sans text-sm normal-case tracking-normal text-glacier">باب {toUrdu(chapter)}</span>
            <span className="h-px w-8 bg-line" />
            Chapter {chapter}.{String(nInTrack).padStart(2, '0')} — {track.label}
          </p>
          <h1 className="mt-6 max-w-5xl text-[clamp(3rem,10vw,8.5rem)] font-semibold uppercase leading-[0.88] tracking-[-0.045em]">{p.name}</h1>
          <p className="mt-8 max-w-2xl font-serif text-3xl leading-tight text-snow/90 md:text-4xl">{p.summary}</p>

          <dl className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Track', track.label],
              ['Built with', p.stack.join(' · ')],
              ['Status', p.repo ? 'Public repository' : 'Private build'],
              ['Author', profile.name],
            ].map(([k, v]) => (
              <div key={k} className="bg-ink p-5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">{k}</dt>
                <dd className="mt-2 text-snow">{v}</dd>
              </div>
            ))}
          </dl>

          <section className="mt-16 grid gap-10 md:grid-cols-[1.2fr_1fr]" aria-labelledby="proof-h">
            <div>
              <h2 id="proof-h" className="font-mono text-[11px] uppercase tracking-[0.25em] text-glacier">The receipt</h2>
              <p className="mt-4 text-2xl leading-snug text-snow md:text-3xl">{p.proof}</p>
              <p className="mt-6 max-w-xl text-mist">{track.blurb}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {p.repo && (
                  <a href={p.repo} target="_blank" rel="noopener noreferrer" className="rounded-full bg-glacier px-6 py-3 font-medium text-night transition-transform hover:-translate-y-0.5">
                    Read the code ↗
                  </a>
                )}
                <Link href="/#contact" className="rounded-full border border-line px-6 py-3 text-snow transition-colors hover:border-glacier">
                  Build something like this
                </Link>
              </div>
            </div>
            <div className="receipt self-start px-6 pb-10 pt-6 font-mono text-[12px] leading-relaxed">
              <div className="flex justify-between gap-4 text-[10px] uppercase tracking-[0.2em] text-black/55">
                <span>Receipt · {p.slug.slice(0, 18)}</span>
                <span>{track.label}</span>
              </div>
              <div className="my-4 border-t border-dashed border-black/40" />
              {p.stack.map((s) => (
                <div key={s} className="flex justify-between"><span className="text-black/70">{s}</span><span className="text-black/40">✓</span></div>
              ))}
              <div className="my-4 border-t border-dashed border-black/40" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/50">Proof</p>
              <p className="mt-1 text-black">{p.proof}</p>
              <div className="barcode mt-6 h-10 w-40" aria-hidden />
            </div>
          </section>

          {related.length > 0 && (
            <section className="mt-24" aria-labelledby="rel-h">
              <h2 id="rel-h" className="font-mono text-[11px] uppercase tracking-[0.25em] text-mist">More from {track.label}</h2>
              <ul className="mt-6 grid gap-3 md:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/work/${r.slug}`} className="group block h-full rounded-2xl border border-line bg-ink p-5 transition-colors hover:border-glacier/50">
                      <p className="text-lg text-snow">{r.name}</p>
                      <p className="mt-1 text-sm text-mist">{r.summary}</p>
                      <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-glacier transition-transform group-hover:translate-x-1">Open chapter →</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <nav className="mt-20 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2" aria-label="More projects">
            <Link href={`/work/${prev.slug}`} className="bg-ink p-6 transition-colors hover:bg-panel">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">← Previous</span>
              <span className="mt-2 block text-xl text-snow">{prev.name}</span>
            </Link>
            <Link href={`/work/${next.slug}`} className="bg-ink p-6 text-right transition-colors hover:bg-panel">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mist">Next →</span>
              <span className="mt-2 block text-xl text-snow">{next.name}</span>
            </Link>
          </nav>
        </article>
      </main>
    </>
  );
}
