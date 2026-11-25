import Link from 'next/link';
import { projects } from '@/content/projects';

/**
 * The stack as layers of a product. Each layer pins under the previous one as you scroll,
 * collapsing into a tab, so the whole stack ends up stacked at the top of the screen.
 * Pure CSS sticky — no JS, no scroll listeners. "Used in" is computed from real project data.
 */
const ROLE: Record<string, string> = {
  Languages: 'What I write in',
  Frontend: 'What people touch',
  Backend: 'What answers',
  'CMS & Web': 'What clients edit',
  'AI / ML': 'What thinks',
  'Data & Ship': 'What remembers, and ships it',
};

const norm = (s: string) => s.toLowerCase().replace(/\s*\d+(\.\d+)?$/, '').replace(/[^a-z0-9+#]/g, '');

function usedIn(items: readonly string[]) {
  const keys = items.map(norm).filter((k) => k.length > 1);
  return projects.filter((p) => p.stack.some((s) => { const n = norm(s); return keys.some((k) => n === k || (k.length > 3 && (n.includes(k) || k.includes(n)))); }));
}

export function StackLayers({ groups }: { groups: readonly { group: string; items: readonly string[] }[] }) {
  const HEAD = 52; // px per collapsed tab
  return (
    <div className="relative mt-12 border-t border-line">
      {groups.map((g, i) => {
        const used = usedIn(g.items);
        return (
          <article
            key={g.group}
            className="sticky border-b border-line bg-night"
            style={{ top: `calc(4.5rem + ${i * HEAD}px)`, zIndex: i + 1 }}
            aria-labelledby={`layer-${i}`}
          >
            <header className="flex items-center justify-between px-1" style={{ height: HEAD }}>
              <h3 id={`layer-${i}`} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-snow">
                <span className="rounded-sm bg-glacier px-1.5 py-0.5 text-night">{String(i).padStart(2, '0')}</span>
                {g.group}
              </h3>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.25em] text-mist sm:block">{ROLE[g.group] ?? ''}</span>
            </header>
            <div className="grid min-h-[56vh] gap-8 pb-14 pt-4 md:grid-cols-[1.1fr_1fr] md:items-center">
              <div>
                <p className="text-[clamp(3.2rem,11vw,9rem)] font-semibold uppercase leading-[0.85] tracking-[-0.05em] text-snow">{g.group.replace(' / ', '/')}</p>
                <p className="mt-3 font-serif text-2xl italic text-mist">{ROLE[g.group]}</p>
              </div>
              <div>
                <ul className="flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <li key={t} className="rounded-md border border-line bg-ink px-3 py-1.5 font-mono text-sm text-snow/90">{t}</li>
                  ))}
                </ul>
                {used.length > 0 && (
                  <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 font-mono text-[11px] uppercase tracking-widest text-mist">
                    <span className="mr-1 rounded-sm border border-glacier px-1.5 py-0.5 text-glacier">Used in</span>
                    {used.slice(0, 6).map((p, k) => (
                      <span key={p.slug}>
                        <Link href={`/work/${p.slug}`} className="sweep hover:text-snow">{p.name}</Link>
                        {k < Math.min(used.length, 6) - 1 && <span className="ml-2 text-line">·</span>}
                      </span>
                    ))}
                    {used.length > 6 && <span className="text-mist/60">+{used.length - 6} more</span>}
                  </p>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
