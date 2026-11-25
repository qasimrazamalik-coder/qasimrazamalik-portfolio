'use client';

import { useEffect, useState } from 'react';

/** Accent palettes named after the hills around Abbottabad. The value replaces --color-glacier site-wide. */
export const ACCENTS = [
  { id: 'glacier', label: 'Glacier', color: '#7cf3d6' },
  { id: 'ember', label: 'Ember', color: '#ffb454' },
  { id: 'pine', label: 'Pine', color: '#8fe388' },
  { id: 'dusk', label: 'Dusk', color: '#b9a2ff' },
] as const;
export type AccentId = (typeof ACCENTS)[number]['id'];

/** Runs in <head> before paint so a saved accent / motion choice never flashes. */
export const themeBootScript = `try{var a=localStorage.getItem('accent');if(a)document.documentElement.dataset.accent=a;if(localStorage.getItem('motion')==='off')document.documentElement.classList.add('motion-off')}catch(e){}`;

export function ThemeControls({ compact = false }: { compact?: boolean }) {
  const [accent, setAccent] = useState<AccentId>('glacier');
  const [motion, setMotion] = useState(true);

  useEffect(() => {
    setAccent((document.documentElement.dataset.accent as AccentId) || 'glacier');
    setMotion(!document.documentElement.classList.contains('motion-off'));
  }, []);

  const pick = (id: AccentId) => {
    setAccent(id);
    if (id === 'glacier') delete document.documentElement.dataset.accent;
    else document.documentElement.dataset.accent = id;
    try { localStorage.setItem('accent', id); } catch {}
    window.dispatchEvent(new CustomEvent('accent-change', { detail: ACCENTS.find((a) => a.id === id)!.color }));
  };
  const toggleMotion = () => {
    const on = !motion;
    setMotion(on);
    document.documentElement.classList.toggle('motion-off', !on);
    try { localStorage.setItem('motion', on ? 'on' : 'off'); } catch {}
    window.dispatchEvent(new CustomEvent('motion-change', { detail: on }));
  };

  return (
    <div className={`flex items-center ${compact ? 'gap-3' : 'gap-2'}`}>
      <div role="radiogroup" aria-label="Accent colour" className="flex items-center gap-1.5">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            role="radio"
            aria-checked={accent === a.id}
            aria-label={`${a.label} accent`}
            title={a.label}
            onClick={() => pick(a.id)}
            className="relative flex h-6 w-6 items-center justify-center rounded-full transition-transform hover:scale-110 active:scale-90"
          >
            <span className="h-3 w-3 rounded-full" style={{ background: a.color }} />
            {accent === a.id && <span className="absolute inset-0 rounded-full border" style={{ borderColor: a.color }} />}
          </button>
        ))}
      </div>
      <button
        onClick={toggleMotion}
        aria-pressed={!motion}
        className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-mist transition-colors hover:text-snow"
      >
        <span className={`h-1.5 w-1.5 rounded-full ${motion ? 'bg-glacier' : 'bg-mist/50'}`} />
        Motion {motion ? 'on' : 'off'}
      </button>
    </div>
  );
}
