'use client';

import { useState } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'motion/react';
import type { Project, Track } from '@/content/projects';

type Props = { projects: Project[]; tracks: { id: Track; label: string; blurb: string }[] };

export function WorkExplorer({ projects, tracks }: Props) {
  const [active, setActive] = useState<Track | 'all'>('all');
  const [expanded, setExpanded] = useState(false);
  const full = active === 'all' ? projects : projects.filter((p) => p.track === active);
  const list = expanded ? full : full.slice(0, 9);
  const blurb = active === 'all' ? 'Everything public, grouped by what it proves.' : tracks.find((t) => t.id === active)?.blurb;

  return (
    <div>
      <LayoutGroup>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by track">
          {[{ id: 'all' as const, label: 'All' }, ...tracks].map((t) => {
            const on = active === t.id;
            const count = t.id === 'all' ? projects.length : projects.filter((p) => p.track === t.id).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={on}
                onClick={() => { setActive(t.id); setExpanded(false); }}
                className={`relative rounded-full px-4 py-2 text-sm transition-colors ${on ? 'text-night' : 'text-mist hover:text-snow'}`}
              >
                {on && <motion.span layoutId="track-pill" className="absolute inset-0 -z-10 rounded-full bg-glacier" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                {t.label} <span className="font-mono text-[10px] opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </LayoutGroup>
      <p className="mt-4 text-sm text-mist">{blurb}</p>

      <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.li
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <a
                href={p.repo}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="view"
                data-cursor-label="Code"
                className="spot group flex h-full flex-col rounded-2xl border border-line bg-ink/90 p-5 transition-colors hover:border-glacier/40"
                onPointerMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
                }}
              >
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-mist">
                  <span>{tracks.find((t) => t.id === p.track)?.label}</span>
                  <span className="transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-glacier">↗</span>
                </div>
                <h3 className="mt-4 text-lg font-medium leading-snug text-snow">
                  <span className="roll"><span>{p.name}</span><span aria-hidden>{p.name}</span></span>
                </h3>
                <p className="mt-2 text-sm text-mist">{p.summary}</p>
                <p className="mt-3 border-l-2 border-glacier/60 pl-3 text-sm text-snow/90">
                  <span className="sr-only">Proof: </span>
                  {p.proof}
                </p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {p.stack.map((s) => (
                    <li key={s} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-mist">{s}</li>
                  ))}
                </ul>
              </a>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {full.length > 9 && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setExpanded((e) => !e)}
            data-magnetic
            className="group rounded-full border border-line bg-panel/85 px-6 py-3 text-sm text-snow transition-colors hover:border-glacier"
          >
            <span className="roll">
              <span>{expanded ? 'Show fewer' : `Show all ${full.length}`}</span>
              <span aria-hidden>{expanded ? 'Show fewer' : `Show all ${full.length}`}</span>
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
