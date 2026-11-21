'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { places } from '@/content/places';

/**
 * A pinned reel of real photographs of Abbottabad and the Galyat ranges.
 * Vertical scroll drives the reel sideways (GSAP ScrollTrigger scrub); each photo
 * pans inside its frame for depth, and a kinetic line of place names slides past.
 * Touch screens get the same scrubbed motion; reduced-motion gets a plain swipe row.
 */
export function FieldNotes() {
  const wrap = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const names = useRef<HTMLParagraphElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const el = wrap.current, tr = track.current;
    if (!el || !tr) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const dist = () => Math.max(0, tr.scrollWidth - innerWidth);
      const tween = gsap.to(tr, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (s) => {
            if (bar.current) bar.current.style.transform = `scaleX(${s.progress})`;
            setIdx(Math.min(places.length - 1, Math.round(s.progress * (places.length - 1))));
          },
        },
      });
      // photo pans inside its frame against the travel direction
      gsap.utils.toArray<HTMLElement>('[data-pan]', tr).forEach((img) => {
        gsap.fromTo(img, { xPercent: -9 }, {
          xPercent: 9, ease: 'none',
          scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true },
        });
      });
      if (names.current) gsap.fromTo(names.current, { xPercent: 0 }, { xPercent: -35, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, scrub: 1 } });
    }, el);
    const imgs = Array.from(tr.querySelectorAll('img'));
    let left = imgs.length;
    const done = () => { if (--left <= 0) ScrollTrigger.refresh(); };
    imgs.forEach((i) => (i.complete ? done() : i.addEventListener('load', done, { once: true })));
    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrap} id="abbottabad" aria-label="Abbottabad, frame by frame" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-16 md:py-20">
      <p ref={names} aria-hidden className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 whitespace-nowrap font-medium uppercase leading-none tracking-[-0.04em] text-transparent [-webkit-text-stroke:1px_rgba(124,243,214,0.14)] text-[22vw] md:text-[16vw]">
        Abbottabad · Thandiani · Miranjani · Shimla Hill · Mukshpuri · Galyat
      </p>

      <div className="relative mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 md:mb-12 md:px-10">
        <div>
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
            <span className="text-glacier">02</span><span className="h-px w-10 bg-line" />Home range
          </p>
          <h2 className="mt-5 max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl">
            Abbottabad, <em className="font-serif font-normal text-glacier">frame by frame.</em>
          </h2>
        </div>
        <p className="hidden max-w-xs text-sm text-mist md:block">Real photographs of the hills around home. Two of them form the horizon of the 3D valley behind this page. Keep scrolling.</p>
      </div>

      <div ref={track} className="no-scrollbar relative flex gap-5 overflow-x-auto px-5 will-change-transform motion-safe:overflow-visible md:gap-8 md:px-10">
        {places.map((p, i) => (
          <figure key={p.slug} className="group relative w-[82vw] shrink-0 sm:w-[60vw] lg:w-[44vw]">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-line bg-ink md:aspect-[16/10]">
              <Image
                src={p.src}
                alt={`${p.place} — ${p.caption}`}
                fill
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 70vw, 92vw"
                className="scale-[1.22] object-cover"
                data-pan
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full border border-snow/20 bg-night/50 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-snow backdrop-blur">
                {String(i + 1).padStart(2, '0')} / {String(places.length).padStart(2, '0')}
              </span>
            </div>
            <motion.figcaption
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ amount: 0.4 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-x-5 bottom-5 md:inset-x-7 md:bottom-7"
            >
              <p className="text-3xl font-medium tracking-tight text-snow md:text-5xl">{p.place}</p>
              <p className="mt-2 max-w-md text-sm text-snow/80 md:text-base">{p.caption}</p>
              <p className="mt-3 font-mono text-[9px] uppercase tracking-widest text-snow/50">Photo · {p.author} · {p.license}</p>
            </motion.figcaption>
          </figure>
        ))}
      </div>

      <div className="relative mx-auto mt-8 flex w-full max-w-7xl items-center gap-4 px-5 md:px-10" aria-hidden>
        <span className="font-mono text-[11px] text-glacier">{places[idx].place}</span>
        <div className="relative h-px flex-1 overflow-hidden bg-line">
          <div ref={bar} className="absolute inset-0 origin-left bg-glacier" style={{ transform: 'scaleX(0)' }} />
        </div>
        <span className="font-mono text-[11px] text-mist">34.17° N · 73.22° E</span>
      </div>
    </section>
  );
}
