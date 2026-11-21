'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/**
 * Scroll-to-top: a ring that fills with page progress, magnetic on desktop, launches on click.
 * Progress is written straight to the DOM — no React render per scroll frame.
 */
export function ScrollTop() {
  const [show, setShow] = useState(false);
  const [launch, setLaunch] = useState(false);
  const ring = useRef<SVGCircleElement>(null);
  const label = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const R = 22, C = 2 * Math.PI * R;

  useEffect(() => {
    let raf = 0, max = 1, shown = false, lastPct = -1;
    const measure = () => (max = Math.max(1, document.documentElement.scrollHeight - innerHeight));
    const paint = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, scrollY / max));
      if (p > 0.08 !== shown) { shown = p > 0.08; setShow(shown); }
      const pct = Math.round(p * 100);
      if (pct === lastPct) return;
      lastPct = pct;
      if (ring.current) ring.current.style.strokeDashoffset = String(C * (1 - p));
      if (label.current) label.current.textContent = `${pct}%`;
      btn.current?.setAttribute('aria-label', `Back to top (${pct}% scrolled)`);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(paint); };
    measure(); paint();
    const ro = new ResizeObserver(() => { measure(); on(); });
    ro.observe(document.body);
    addEventListener('scroll', on, { passive: true });
    return () => { cancelAnimationFrame(raf); ro.disconnect(); removeEventListener('scroll', on); };
  }, [C]);

  // the ring and label refs mount with the button, so repaint once it appears
  useEffect(() => { if (show) dispatchEvent(new Event('scroll')); }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          ref={btn}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={launch ? { y: -innerHeight, opacity: 0, scale: 0.8 } : { opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={launch ? { duration: 0.7, ease: [0.7, 0, 0.84, 0] } : { type: 'spring', stiffness: 400, damping: 26 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.88 }}
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse') return;
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.25}px`;
          }}
          onPointerLeave={(e) => (e.currentTarget.style.translate = '')}
          onClick={() => {
            setLaunch(true);
            window.dispatchEvent(new CustomEvent('scroll-top'));
            setTimeout(() => setLaunch(false), 900);
          }}
          aria-label="Back to top"
          className="group fixed bottom-5 left-4 z-[74] flex h-14 w-14 items-center justify-center rounded-full border border-line bg-panel/90 transition-[translate] duration-200 md:bottom-6 md:left-6"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden>
            <circle cx="28" cy="28" r={R} fill="none" stroke="#1f2431" strokeWidth="2.5" />
            <circle ref={ring} cx="28" cy="28" r={R} fill="none" stroke="#7cf3d6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C} />
          </svg>
          <span className="relative flex flex-col items-center leading-none">
            <span className="text-base text-snow transition-transform duration-300 group-hover:-translate-y-1">↑</span>
            <span ref={label} className="mt-0.5 font-mono text-[9px] tabular-nums text-glacier">0%</span>
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Full-screen mobile menu with staggered links. */
export function MobileMenu({ links }: { links: { href: string; label: string }[] }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.documentElement.style.overflow = open ? 'hidden' : '';
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', k);
    return () => removeEventListener('keydown', k);
  }, [open]);
  return (
    <>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} className="relative z-[61] flex h-10 w-10 items-center justify-center rounded-full border border-line bg-panel/70 backdrop-blur md:hidden">
        <span className={`absolute h-px w-4 bg-snow transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-1'}`} />
        <span className={`absolute h-px w-4 bg-snow transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-1'}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            aria-label="Mobile"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-night/97 px-6 pb-10 pt-28 md:hidden"
          >
            <ul className="space-y-2">
              {links.map((l, i) => (
                <motion.li key={l.href} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
                  <a href={l.href} onClick={() => setOpen(false)} className="flex items-baseline gap-4 py-1 text-5xl font-medium tracking-tight text-snow active:text-glacier">
                    <span className="font-mono text-xs text-glacier">{String(i + 1).padStart(2, '0')}</span>{l.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="font-mono text-[11px] uppercase tracking-widest text-mist">
              iamqasimrazamalik@gmail.com
            </motion.p>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}

/* A ridgeline drawn from the skyline in the Thandiani photo — the loader traces it as it fills. */
const RIDGE = 'M0 92 L46 70 L78 78 L118 48 L150 60 L186 26 L214 44 L246 34 L282 58 L318 40 L352 64 L392 52 L430 74 L470 66 L520 88';

/**
 * Loading screen. Rendered in the server HTML, and its motion (the ridgeline trace and the
 * counter) runs in CSS from the very first paint — before any JavaScript, and unaffected by
 * hydration. JavaScript only decides when to lift the curtain: fonts ready and ~0.9 s since
 * navigation (0.55 s on a repeat visit), never later than 2 s.
 */
export function Preloader() {
  const [phase, setPhase] = useState<'load' | 'exit' | 'gone'>('load');

  useEffect(() => {
    const w = window as Window & { __loaderExit?: boolean };
    let repeat = false;
    try { repeat = !!sessionStorage.getItem('seen'); sessionStorage.setItem('seen', '1'); } catch {}
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const until = reduced ? 200 : repeat ? 550 : 900; // ms since navigation start
    let fired = false;
    const go = () => {
      if (fired) return;
      fired = true;
      w.__loaderExit = true;
      dispatchEvent(new Event('loader-exit'));
      setPhase('exit');
    };
    let timer = 0;
    const cap = window.setTimeout(go, Math.max(0, 2000 - performance.now()));
    document.fonts.ready.then(() => {
      // if hydration ran late, still let the counter land on 100 for a beat
      timer = window.setTimeout(go, Math.max(until - performance.now(), 140));
    });
    return () => { clearTimeout(timer); clearTimeout(cap); };
  }, []);

  if (phase === 'gone') return null;
  return (
    <motion.div
      data-phase={phase}
      className={`site-loader fixed inset-0 z-[100] flex flex-col justify-between bg-night p-6 md:p-10${phase === 'exit' ? ' is-done' : ''}`}
      initial={false}
      animate={phase === 'exit' ? { clipPath: 'inset(0% 0% 100% 0%)' } : { clipPath: 'inset(0% 0% 0% 0%)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      onAnimationComplete={() => phase === 'exit' && setPhase('gone')}
      aria-hidden
    >
      <noscript><style>{'.site-loader{display:none!important}'}</style></noscript>
      <div className="flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
        <span>Qasim Raza Malik</span>
        <span className="hidden sm:inline">Abbottabad · 34.17° N</span>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <svg viewBox="0 0 520 100" className="w-full overflow-visible" fill="none">
          <path d={RIDGE} stroke="#1f2431" strokeWidth="1.5" />
          <path className="loader-line" pathLength={1000} d={RIDGE} stroke="#7cf3d6" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="flex items-end justify-between">
        <span className="font-serif text-3xl italic text-glacier md:text-5xl">building proof…</span>
        <span className="loader-num text-7xl font-medium tabular-nums leading-none tracking-tighter text-snow md:text-[9rem]" />
      </div>
    </motion.div>
  );
}
