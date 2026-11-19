'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export type Command = { id: string; label: string; hint: string; href: string; group: string };

export function CommandPalette({ commands }: { commands: Command[] }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-palette', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-palette', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setI(0);
      setTimeout(() => input.current?.focus(), 30);
    }
  }, [open]);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    const r = s ? commands.filter((c) => `${c.label} ${c.hint} ${c.group}`.toLowerCase().includes(s)) : commands;
    return r.slice(0, 9);
  }, [q, commands]);

  const go = (c?: Command) => {
    if (!c) return;
    setOpen(false);
    if (c.href.startsWith('http') || c.href.startsWith('mailto')) window.open(c.href, c.href.startsWith('mailto') ? '_self' : '_blank', 'noopener');
    else document.querySelector(c.href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center bg-night/70 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel/95 shadow-2xl"
            initial={{ y: 16, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <input
              ref={input}
              value={q}
              onChange={(e) => { setQ(e.target.value); setI(0); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setI((x) => Math.min(x + 1, results.length - 1)); }
                if (e.key === 'ArrowUp') { e.preventDefault(); setI((x) => Math.max(x - 1, 0)); }
                if (e.key === 'Enter') go(results[i]);
              }}
              placeholder="Search projects, sections, links…"
              aria-label="Search"
              className="w-full border-b border-line bg-transparent px-5 py-4 text-base text-snow outline-none placeholder:text-mist"
            />
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {results.length === 0 && <li className="px-3 py-6 text-center text-sm text-mist">Nothing found.</li>}
              {results.map((c, idx) => (
                <li key={c.id} role="option" aria-selected={idx === i}>
                  <button
                    onMouseEnter={() => setI(idx)}
                    onClick={() => go(c)}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${idx === i ? 'bg-glacier/10 text-snow' : 'text-mist'}`}
                  >
                    <span>
                      <span className="text-snow">{c.label}</span>
                      <span className="ml-2 text-xs text-mist">{c.hint}</span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-mist">{c.group}</span>
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between border-t border-line px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-mist">
              <span>↑↓ navigate · ↵ open</span>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function PaletteButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event('open-palette'))}
      className="hidden items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1.5 font-mono text-[11px] text-mist backdrop-blur transition-colors hover:border-glacier hover:text-snow md:flex"
      aria-label="Open command palette"
    >
      Search <kbd className="rounded border border-line px-1.5">⌘K</kbd>
    </button>
  );
}
