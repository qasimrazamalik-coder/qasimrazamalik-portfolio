'use client';

import { useEffect, useRef, useState } from 'react';

type Chapter = { n: string; label: string; el: HTMLElement };

/**
 * Fixed side rail: "03 / 15 — VENTURES", plus a tick per chapter you can click to jump.
 * Section positions are cached (and re-cached when the page height changes), so scrolling
 * only reads scrollY — no layout work per frame — and it is correct after any jump.
 */
export function ChapterRail() {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const list: Chapter[] = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]')).map((el) => ({
      n: el.dataset.chapter!, label: el.dataset.label!, el: (el.closest('section') as HTMLElement) ?? el,
    }));
    setChapters(list);
    let tops: number[] = [];
    const measure = () => { tops = list.map((c) => c.el.getBoundingClientRect().top + scrollY); };
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = scrollY + innerHeight * 0.45;
      let i = 0;
      for (let k = 0; k < tops.length; k++) if (tops[k] <= line) i = k;
      if (i !== activeRef.current) { activeRef.current = i; setActive(i); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    measure(); update();
    const ro = new ResizeObserver(() => { measure(); onScroll(); });
    ro.observe(document.body);
    addEventListener('scroll', onScroll, { passive: true });
    return () => { ro.disconnect(); removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);

  if (!chapters.length) return null;
  const cur = chapters[active];
  return (
    <nav aria-label="Chapters" className="pointer-events-none fixed bottom-8 left-5 z-30 hidden flex-col items-center gap-4 xl:flex">
      <ol className="pointer-events-auto flex flex-col gap-1.5">
        {chapters.map((c, i) => (
          <li key={c.n}>
            <button
              onClick={() => c.el.scrollIntoView({ behavior: 'smooth' })}
              aria-label={`Chapter ${c.n}: ${c.label}`}
              aria-current={i === active ? 'step' : undefined}
              className="group flex h-3 w-6 items-center"
            >
              <span className={`block h-px transition-all duration-500 ${i === active ? 'w-6 bg-glacier' : 'w-2.5 bg-mist/40 group-hover:w-4 group-hover:bg-snow'}`} />
            </button>
          </li>
        ))}
      </ol>
      <p className="rotate-180 font-mono text-[10px] uppercase tracking-[0.3em] text-mist [writing-mode:vertical-rl]" aria-live="polite">
        <span className="text-glacier">{cur.n}</span> / {String(chapters.length).padStart(2, '0')} — {cur.label}
      </p>
    </nav>
  );
}
