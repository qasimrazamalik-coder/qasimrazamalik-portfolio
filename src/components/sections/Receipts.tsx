'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import type { Project } from '@/content/projects';
import { Carousel } from '@/components/ui/Carousel';

/**
 * "Proof, not promises" as paper: each featured build gets a till receipt listing the
 * proof that ships in its repo, with a SHIPPED stamp that slams on when the slip arrives.
 */
export function Receipts({ items, trackLabel }: { items: Project[]; trackLabel: Record<string, string> }) {
  return (
    <Carousel label="Proof receipts" itemClass="w-[80%] sm:w-[46%] lg:w-[31%]" depth={false}>
      {items.map((p, i) => (
        <article key={p.slug} className="receipt relative flex h-full flex-col px-6 pb-10 pt-6 font-mono text-[12px] leading-relaxed shadow-[0_30px_60px_rgba(0,0,0,0.45)]">
          <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-black/55">
            <span>Receipt no. {String(i + 1).padStart(2, '0')}</span>
            <span>{trackLabel[p.track]}</span>
          </div>
          <div className="my-4 border-t border-dashed border-black/40" />
          <h3 className="pr-24 font-sans text-[1.7rem] font-semibold uppercase leading-[0.95] tracking-tight">{p.name}</h3>
          <p className="mt-2 text-black/70">{p.summary}</p>
          <div className="my-4 border-t border-dashed border-black/40" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-black/50">Proof in the repo</p>
          <p className="mt-1 text-[13px] text-black">{p.proof}</p>
          <dl className="mt-4 space-y-1">
            {p.stack.slice(0, 4).map((s) => (
              <div key={s} className="flex justify-between gap-4">
                <dt className="text-black/60">{s}</dt>
                <dd className="text-black/40">✓</dd>
              </div>
            ))}
          </dl>
          <div className="my-4 border-t border-dashed border-black/40" />
          <div className="mt-auto flex items-end justify-between gap-4">
            <div>
              <div className="barcode h-10 w-36" aria-hidden />
              <p className="mt-1 text-[9px] uppercase tracking-[0.3em] text-black/50">{p.slug.slice(0, 22)}</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-[11px] uppercase tracking-widest">
              <Link href={`/work/${p.slug}`} className="underline decoration-black/30 underline-offset-4 hover:decoration-black">Case study</Link>
              {p.repo && <a href={p.repo} target="_blank" rel="noopener noreferrer" className="underline decoration-black/30 underline-offset-4 hover:decoration-black">Source ↗</a>}
            </div>
          </div>
          <motion.span
            aria-hidden
            initial={{ opacity: 0, scale: 2.2, rotate: -24 }}
            whileInView={{ opacity: 1, scale: 1, rotate: -12 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ type: 'spring', stiffness: 520, damping: 18, delay: 0.15 }}
            className="absolute right-3 top-[3.1rem] rounded-md border-[3px] px-2.5 py-0.5 font-sans text-lg font-bold uppercase tracking-wider"
            style={{ color: 'color-mix(in oklab, var(--color-glacier) 55%, #0b3d33)', borderColor: 'currentColor', mixBlendMode: 'multiply' }}
          >
            Shipped
          </motion.span>
        </article>
      ))}
    </Carousel>
  );
}
