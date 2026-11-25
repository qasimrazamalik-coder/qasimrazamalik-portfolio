'use client';

import { useEffect, useRef } from 'react';
import { scrollState } from '@/lib/scrollState';

/**
 * Two tilted tapes crossing like an X. They drift on their own and speed up / reverse
 * with your scroll velocity. Motion-off (or reduced motion) leaves them still.
 */
function Tape({ items, dir, tilt, tone }: { items: readonly string[]; dir: 1 | -1; tilt: number; tone: 'accent' | 'dark' }) {
  const track = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = track.current;
    if (!el || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let x = 0, raf = 0, last = performance.now(), visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(el);
    const step = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (visible && !document.documentElement.classList.contains('motion-off')) {
        // px/s from ScrollTrigger: scrolling speeds the tape up, scrolling back up reverses it
        const boost = Math.max(-6, Math.min(6, scrollState.velocity / 600));
        const sign = boost < -0.5 ? -1 : 1;
        x -= dir * sign * (40 + Math.abs(boost) * 90) * dt;
        const half = el.scrollWidth / 2;
        if (half > 0) { if (x <= -half) x += half; else if (x > 0) x -= half; }
        el.style.transform = `translate3d(${x}px,0,0)`;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [dir]);
  const cls = tone === 'accent' ? 'bg-glacier text-night' : 'border-y border-line bg-ink text-snow';
  return (
    <div className={`absolute inset-x-[-10%] overflow-hidden py-3 md:py-4 ${cls}`} style={{ transform: `rotate(${tilt}deg)` }}>
      <div ref={track} className="tape flex w-max">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center" aria-hidden={k === 1}>
            {items.map((t) => (
              <span key={`${k}-${t}`} className="flex items-center gap-6 whitespace-nowrap px-6 text-2xl font-semibold uppercase tracking-tight md:text-4xl">
                {t}<span className="text-base opacity-60">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Tapes({ proof, stack }: { proof: readonly string[]; stack: readonly string[] }) {
  return (
    <section aria-label="What I ship and what I ship it with" className="relative my-4 h-32 overflow-hidden md:my-8 md:h-44">
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2"><Tape items={stack} dir={-1} tilt={3} tone="dark" /></div>
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2"><Tape items={proof} dir={1} tilt={-2.5} tone="accent" /></div>
    </section>
  );
}
