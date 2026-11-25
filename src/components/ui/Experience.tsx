'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { scrollState } from '@/lib/scrollState';

const MountainScene = dynamic(() => import('@/components/three/MountainScene'), { ssr: false });

gsap.registerPlugin(ScrollTrigger, SplitText);
// phones fire resize when the address bar shows/hides; refreshing every trigger then causes jumps and jank
ScrollTrigger.config({ ignoreMobileResize: true, limitCallbacks: true });

function canRender3D() {
  if (typeof window === 'undefined') return false;
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/** Global client layer: smooth scroll, 3D background, cursor, reveals, magnetic + tilt interactions. */
export function Experience() {
  const [show3D, setShow3D] = useState(false);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const dim = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches || document.documentElement.classList.contains('motion-off');
    const hasLoader = !!document.querySelector('.site-loader');
    const lowPower = (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined && (navigator as Navigator & { deviceMemory?: number }).deviceMemory! < 4;
    const no3d = new URLSearchParams(location.search).has('no3d');
    if (canRender3D() && !lowPower && !no3d) setShow3D(true);

    /* smooth scroll */
    let lenis: Lenis | null = null;
    const onTick = (t: number) => lenis?.raf(t * 1000);
    // touch screens keep native scrolling: it runs on the compositor and is already the smoothest option on iOS/Android
    if (!reduced && window.matchMedia('(pointer: fine)').matches) {
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1 });
      lenis.on('scroll', ScrollTrigger.update);
      if (hasLoader && !(window as Window & { __loaderExit?: boolean }).__loaderExit) {
        lenis.stop();
        addEventListener('loader-exit', () => lenis?.start(), { once: true });
      }
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) =>
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href');
          if (!id || id === '#') return;
          const el = document.querySelector(id);
          if (el) {
            e.preventDefault();
            lenis?.scrollTo(el as HTMLElement, { offset: -40 });
            history.replaceState(null, '', id);
          }
        })
      );
    }

    const onMotion = (e: Event) => {
      const on = (e as CustomEvent<boolean>).detail;
      if (!on) { lenis?.destroy(); lenis = null; gsap.ticker.remove(onTick); return; }
      if (lenis || !matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.remove(onTick);
      gsap.ticker.add(onTick);
    };
    addEventListener('motion-change', onMotion);

    const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) }) : scrollTo({ top: 0, behavior: 'smooth' }));
    addEventListener('scroll-top', toTop);

    /* page progress -> camera + progress bar (no layout reads here: self.scroll() is cached by ScrollTrigger) */
    let vh = window.innerHeight;
    const onResize = () => (vh = window.innerHeight);
    addEventListener('resize', onResize, { passive: true });
    let lastDim = -1;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        scrollState.progress = self.progress;
        scrollState.velocity = self.getVelocity();
        if (bar.current) bar.current.style.transform = `scaleX(${self.progress})`;
        const d = Math.round(Math.min(0.42, (self.scroll() / vh) * 0.6) * 100) / 100;
        if (dim.current && d !== lastDim) { dim.current.style.opacity = String(d); lastDim = d; }
      },
    });

    const ctx = gsap.context(() => {});
    // reveals start as the loading curtain lifts, so the hero choreographs with it instead of finishing behind it
    const w = window as Window & { __loaderExit?: boolean };
    const loaderGone = w.__loaderExit || !hasLoader ? Promise.resolve() : new Promise<void>((r) => addEventListener('loader-exit', () => r(), { once: true }));
    loaderGone.then(() => ctx.add(() => {
      if (reduced) return;
      /* split-line headline reveals */
      // split only after web fonts load, and re-split on resize, so line breaks match the final layout
      document.fonts.ready.then(() =>
        ctx.add(() => {
          document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
            SplitText.create(el, {
              type: 'lines,words',
              linesClass: 'split-line',
              mask: 'lines',
              autoSplit: !matchMedia('(pointer: coarse)').matches,
              onSplit: (self) =>
                gsap.from(self.words, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: 'expo.out',
                  stagger: 0.03,
                  scrollTrigger: { trigger: el, start: 'top 88%' },
                }),
            });
          });
          ScrollTrigger.refresh();
        })
      );
      /* fade-up blocks */
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
        gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
      });
      /* cards rise in with a stagger — works the same on touch screens */
      gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
        gsap.from(group.children, { y: 60, opacity: 0, scale: 0.96, duration: 0.9, ease: 'expo.out', stagger: 0.08, scrollTrigger: { trigger: group, start: 'top 88%' } });
      });
      /* scroll-scrubbed parallax for images (mobile included) */
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach((el) => {
        gsap.fromTo(el, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      /* headings drift sideways as they pass — subtle depth on every screen */
      gsap.utils.toArray<HTMLElement>('[data-drift]').forEach((el) => {
        gsap.fromTo(el, { xPercent: -3 }, { xPercent: 3, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
      /* counters */
      gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
        const to = Number(el.dataset.count);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: to,
          duration: 1.6,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
          onUpdate: () => (el.textContent = Math.round(obj.v).toString()),
        });
      });
      ScrollTrigger.refresh();
    }));

    /* custom cursor */
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    let cleanupCursor = () => {};
    if (fine && dot.current && ring.current) {
      const dx = gsap.quickTo(dot.current, 'x', { duration: 0.12, ease: 'power3' });
      const dy = gsap.quickTo(dot.current, 'y', { duration: 0.12, ease: 'power3' });
      const rx = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'power3' });
      const ry = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'power3' });
      const move = (e: PointerEvent) => {
        dot.current!.style.opacity = '1';
        ring.current!.style.opacity = '1';
        dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
        const t = e.target as HTMLElement;
        const hot = t.closest('a,button,[data-cursor]');
        ring.current!.dataset.state = hot ? (hot.getAttribute('data-cursor') ?? 'link') : '';
        const label = hot?.getAttribute('data-cursor-label') ?? '';
        ring.current!.querySelector('span')!.textContent = label;
      };
      window.addEventListener('pointermove', move, { passive: true });
      document.documentElement.style.cursor = 'none';
      cleanupCursor = () => {
        window.removeEventListener('pointermove', move);
        document.documentElement.style.cursor = '';
      };
    }

    /* magnetic elements */
    const mags = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
    const magHandlers = mags.map((el) => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1,0.4)' });
      const mv = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
        yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
      };
      const out = () => { xTo(0); yTo(0); };
      if (fine && !reduced) { el.addEventListener('pointermove', mv); el.addEventListener('pointerleave', out); }
      return () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', out); };
    });

    /* spotlight + tilt cards */
    const cards = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
    const cardHandlers = cards.map((el) => {
      const mv = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--mx', `${px * 100}%`);
        el.style.setProperty('--my', `${py * 100}%`);
        if (!reduced && fine) gsap.to(el, { rotateY: (px - 0.5) * 8, rotateX: (0.5 - py) * 8, transformPerspective: 900, duration: 0.5, ease: 'power2.out' });
      };
      const out = () => gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'expo.out' });
      el.addEventListener('pointermove', mv);
      el.addEventListener('pointerleave', out);
      return () => { el.removeEventListener('pointermove', mv); el.removeEventListener('pointerleave', out); };
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      removeEventListener('scroll-top', toTop);
      removeEventListener('motion-change', onMotion);
      removeEventListener('resize', onResize);
      st.kill();
      ctx.revert();
      cleanupCursor();
      magHandlers.forEach((f) => f());
      cardHandlers.forEach((f) => f());
      gsap.ticker.remove(onTick);
      lenis?.destroy();
    };
  }, []);

  return (
    <>
      <div className="fixed inset-0 -z-10" aria-hidden>
        {show3D ? (
          <div className="scene-fade h-full w-full">
            <MountainScene />
          </div>
        ) : (
          <div className="h-full w-full bg-[radial-gradient(ellipse_at_30%_10%,#1a2340_0%,#06070b_60%)]" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,7,11,0.15)_55%,rgba(6,7,11,0.8)_100%)]" />
        <div ref={dim} className="pointer-events-none absolute inset-0 bg-night opacity-0" />
      </div>
      <div className="fixed left-0 top-0 z-50 h-[2px] w-full origin-left bg-glacier" style={{ transform: 'scaleX(0)' }} ref={bar} aria-hidden />
      <div ref={dot} style={{ opacity: 0 }} className="cursor-ui pointer-events-none fixed left-0 top-0 z-[70] -ml-1 -mt-1 h-2 w-2 rounded-full bg-glacier mix-blend-difference" aria-hidden />
      <div
        ref={ring}
        style={{ opacity: 0 }}
        className="cursor-ui pointer-events-none fixed left-0 top-0 z-[70] -ml-5 -mt-5 flex h-10 w-10 items-center justify-center rounded-full border border-snow/40 transition-[width,height,margin,background-color,border-color] duration-300 data-[state=link]:-ml-8 data-[state=link]:-mt-8 data-[state=link]:h-16 data-[state=link]:w-16 data-[state=link]:border-glacier data-[state=view]:-ml-11 data-[state=view]:-mt-11 data-[state=view]:h-22 data-[state=view]:w-22 data-[state=view]:border-transparent data-[state=view]:bg-glacier"
        aria-hidden
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-night" />
      </div>
    </>
  );
}
