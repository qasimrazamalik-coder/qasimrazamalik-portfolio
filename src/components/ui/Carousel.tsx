'use client';

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Props = { children: ReactNode; label: string; autoplay?: number; itemClass?: string; depth?: boolean };

/**
 * Native scroll-snap carousel: buttery momentum on iOS/Android, mouse drag on desktop,
 * a depth effect (scale/fade by distance from centre), autoplay that pauses on interaction,
 * keyboard arrows and a live progress bar.
 */
export function Carousel({ children, label, autoplay = 0, itemClass = 'w-[82%] sm:w-[60%] lg:w-[42%]', depth = true }: Props) {
  const track = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);
  const paused = useRef(false);
  const items = Children.toArray(children);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (fill.current) fill.current.style.transform = `scaleX(${Math.max(0.08, max > 0 ? el.scrollLeft / max : 0)})`;
    const mid = el.scrollLeft + el.clientWidth / 2;
    let best = 0, bestD = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const n = c as HTMLElement;
      const center = n.offsetLeft + n.offsetWidth / 2;
      const d = Math.abs(center - mid);
      if (d < bestD) { bestD = d; best = i; }
      if (depth) {
        const t = Math.min(1, d / el.clientWidth);
        n.style.transform = `scale(${1 - t * 0.1})`;
        n.style.opacity = String(1 - t * 0.45);
      }
    });
    if (best !== activeRef.current) { activeRef.current = best; setActive(best); }
  }, [depth]);

  const go = useCallback((dir: number) => {
    const el = track.current;
    if (!el) return;
    const kids = Array.from(el.children) as HTMLElement[];
    const target = kids[(active + dir + kids.length) % kids.length];
    el.scrollTo({ left: target.offsetLeft - (el.clientWidth - target.offsetWidth) / 2, behavior: 'smooth' });
  }, [active]);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    update();
    let raf = 0;
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    el.addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    // mouse drag (touch uses native momentum scrolling)
    let down = false, startX = 0, startL = 0, moved = false;
    const pd = (e: PointerEvent) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; startX = e.clientX; startL = el.scrollLeft; el.style.scrollSnapType = 'none'; };
    const pm = (e: PointerEvent) => { if (!down) return; const dx = e.clientX - startX; if (Math.abs(dx) > 4) moved = true; el.scrollLeft = startL - dx; };
    const pu = () => { if (!down) return; down = false; el.style.scrollSnapType = ''; };
    const click = (e: MouseEvent) => { if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; } };
    el.addEventListener('pointerdown', pd);
    addEventListener('pointermove', pm);
    addEventListener('pointerup', pu);
    el.addEventListener('click', click, true);
    const pause = () => (paused.current = true), resume = () => (paused.current = false);
    el.addEventListener('pointerenter', pause); el.addEventListener('pointerleave', resume);
    el.addEventListener('touchstart', pause, { passive: true }); el.addEventListener('touchend', () => setTimeout(resume, 4000), { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll);
      el.removeEventListener('pointerdown', pd); removeEventListener('pointermove', pm); removeEventListener('pointerup', pu);
      el.removeEventListener('click', click, true);
    };
  }, [update]);

  useEffect(() => {
    if (!autoplay || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => { if (!paused.current && !document.hidden && !document.documentElement.classList.contains('motion-off')) go(1); }, autoplay);
    return () => clearInterval(id);
  }, [autoplay, go]);

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className="relative">
      <div
        ref={track}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); go(1); } if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); } }}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 md:-mx-10 md:px-10 [-webkit-overflow-scrolling:touch] cursor-grab active:cursor-grabbing"
      >
        {items.map((child, i) => (
          <div key={i} className={`${itemClass} shrink-0 snap-center transition-[transform,opacity] duration-300 ease-out will-change-transform`} aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}`}>
            {child}
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={() => go(-1)} aria-label="Previous slide" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/85 text-snow transition-[transform,border-color] hover:border-glacier active:scale-90">←</button>
        <button onClick={() => go(1)} aria-label="Next slide" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-panel/85 text-snow transition-[transform,border-color] hover:border-glacier active:scale-90">→</button>
        <div className="relative h-px flex-1 overflow-hidden bg-line" aria-hidden>
          <div ref={fill} className="absolute inset-0 origin-left bg-glacier" style={{ transform: 'scaleX(0.08)' }} />
        </div>
        <span className="font-mono text-[11px] text-mist" aria-live="polite">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
}
