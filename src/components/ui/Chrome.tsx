'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

/** Scroll-to-top: a ring that fills with page progress, magnetic on desktop, launches on click. */
export function ScrollTop() {
  const [p, setP] = useState(0);
  const [launch, setLaunch] = useState(false);
  const btn = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - innerHeight;
        setP(max > 0 ? scrollY / max : 0);
      });
    };
    on();
    addEventListener('scroll', on, { passive: true });
    return () => removeEventListener('scroll', on);
  }, []);

  const R = 22, C = 2 * Math.PI * R;
  const show = p > 0.08;
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
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.25}px`;
          }}
          onPointerLeave={(e) => (e.currentTarget.style.translate = '')}
          onClick={() => {
            setLaunch(true);
            window.dispatchEvent(new CustomEvent('scroll-top'));
            setTimeout(() => setLaunch(false), 900);
          }}
          aria-label={`Back to top (${Math.round(p * 100)}% scrolled)`}
          className="group fixed bottom-5 left-4 z-[74] flex h-14 w-14 items-center justify-center rounded-full border border-line bg-panel/80 backdrop-blur-md transition-[translate] duration-200 md:bottom-6 md:left-6"
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56" aria-hidden>
            <circle cx="28" cy="28" r={R} fill="none" stroke="#1f2431" strokeWidth="2.5" />
            <circle cx="28" cy="28" r={R} fill="none" stroke="#7cf3d6" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - p)} />
          </svg>
          <span className="relative flex flex-col items-center leading-none">
            <span className="text-base text-snow transition-transform duration-300 group-hover:-translate-y-1">↑</span>
            <span className="mt-0.5 font-mono text-[9px] text-glacier">{Math.round(p * 100)}%</span>
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
            className="fixed inset-0 z-[60] flex flex-col justify-between bg-night/95 px-6 pb-10 pt-28 backdrop-blur-xl md:hidden"
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

/** Intro: a quick count-up with the name, shown once per session. */
export function Preloader() {
  const [n, setN] = useState(0);
  const [done, setDone] = useState(true);
  useEffect(() => {
    try { if (sessionStorage.getItem('intro')) return; sessionStorage.setItem('intro', '1'); } catch {}
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setDone(false);
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1100);
      setN(Math.round((1 - Math.pow(1 - k, 3)) * 100));
      if (k < 1) raf = requestAnimationFrame(tick); else setTimeout(() => setDone(true), 180);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div exit={{ y: '-100%' }} transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} className="fixed inset-0 z-[100] flex flex-col justify-between bg-night p-6 md:p-10" aria-hidden>
          <span className="font-mono text-[11px] uppercase tracking-widest text-mist">Qasim Raza Malik — Portfolio</span>
          <div className="flex items-end justify-between">
            <span className="font-serif text-4xl italic text-glacier md:text-6xl">building proof…</span>
            <span className="text-7xl font-medium tabular-nums tracking-tighter text-snow md:text-[10rem]">{n}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
