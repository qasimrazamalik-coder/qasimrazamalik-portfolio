'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { buildChunks, createRetriever, tokenize, type Chunk } from '@/lib/knowledge';
import { aiTools, capabilities, education, experience, lenses, profile, stack, ventures } from '@/content/profile';
import { projects, tracks } from '@/content/projects';

type Action = { label: string; href?: string; copy?: string };
type Msg = { id: number; from: 'bot' | 'me'; text: string; sources?: Chunk[]; follow?: string[]; actions?: Action[] };
type Ctx = { lastQuery: string; offset: number };

const STARTERS = ['What does Qasim build?', 'Tell me about Primeura', 'Show his AI projects', 'Can he build my website?', 'How do I hire him?'];
const WA = `https://wa.me/${profile.phone.replace(/\D/g, '')}`;
const CONTACT: Action[] = [
  { label: 'Copy email', copy: profile.email },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'WhatsApp', href: WA },
  { label: 'LinkedIn', href: profile.linkedin },
];

const has = (q: string, ...w: string[]) => w.some((x) => q.includes(x));
const list = (a: readonly string[], n = 6) => a.slice(0, n).join(', ') + (a.length > n ? ` and ${a.length - n} more` : '');

/** Pick the 2 sentences of a passage that best match the question — extractive, never invented. */
function bestSentences(text: string, q: string, n = 2) {
  const qt = new Set(tokenize(q));
  const sents = text.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  if (sents.length <= n) return text;
  return sents
    .map((s, i) => ({ s, i, score: tokenize(s).filter((t) => qt.has(t)).length + (i === 0 ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .sort((a, b) => a.i - b.i)
    .map((x) => x.s)
    .join(' ');
}

/** Intent layer: composed answers for the questions visitors ask most. Falls back to retrieval. */
function intent(raw: string): Omit<Msg, 'id' | 'from'> | null {
  const q = raw.toLowerCase();
  if (/^\s*(hi|hello|hey|salam|assalam|aoa|yo)\b/.test(q) || has(q, 'kya haal', 'kaise ho'))
    return { text: `Hi! I’m ${profile.shortName}’s assistant. I can tell you about his projects, AI work, Primeura, experience or how to work with him.`, follow: STARTERS.slice(0, 3) };
  if (has(q, 'hire', 'contact', 'email', 'reach', 'whatsapp', 'phone', 'number', 'rabta'))
    return { text: `${profile.availability}. Fastest is email — ${profile.email} — or WhatsApp ${profile.phone}. He’s in ${profile.location} (${profile.timezone}) and usually replies within a day.`, actions: CONTACT, follow: ['What does he charge?', 'What does Qasim build?'] };
  if (has(q, 'price', 'cost', 'charge', 'rate', 'budget', 'kitne'))
    return { text: 'Pricing depends on scope, so he quotes per project after a short call — websites, AI chatbots, agents and backends all start with a free scoping chat.', actions: CONTACT, follow: ['How do I hire him?', 'Can he build a RAG chatbot?'] };
  if (has(q, 'primeura'))
    return { text: `${ventures[0].summary} ${ventures[0].points.join('. ')}.`, actions: [{ label: 'Visit primeura.com', href: ventures[0].url }], follow: ['What other ventures?', 'Can he build my website?'] };
  if (has(q, 'venture', 'founder', 'own', 'startup', 'business'))
    return { text: `He co-founded Primeura Digital Solutions and runs ${ventures.length - 1} more flagship builds: ${ventures.slice(1).map((v) => `${v.name} (${v.role.toLowerCase()})`).join(', ')}.`, follow: ['Tell me about Primeura', 'Tell me about FileKit'] };
  if (has(q, 'experience', 'worked', 'job', 'career', 'company', 'companies'))
    return { text: `He’s currently ${experience[0].role} at ${experience[0].org}. Before that: ${experience.slice(1).map((e) => `${e.role} at ${e.org}`).join('; ')}.`, follow: ['What is his education?', 'What is his tech stack?'] };
  if (has(q, 'education', 'degree', 'university', 'study', 'masters', 'comsats'))
    return { text: education.map((e) => `${e.degree} — ${e.school} (${e.status})`).join('. ') + '.', follow: ['What AI work has he done?'] };
  if (has(q, 'stack', 'tech', 'language', 'skill', 'tools'))
    return { text: stack.map((s) => `${s.group}: ${list(s.items, 5)}`).join('. ') + `. AI tools: ${list(aiTools, 10)}.`, follow: ['Show his AI projects', 'Does he do WordPress?'] };
  if (has(q, 'game', 'arcade', 'play'))
    return { text: `There are three playable games on this page — Avalanche, Server Stack and Bug Hunt. He also builds 3D browser games like ${projects.filter((p) => p.track === 'games').slice(0, 3).map((p) => p.name).join(', ')}.`, actions: [{ label: 'Play now', href: '#arcade' }], follow: ['Which Snapchat lenses?'] };
  if (has(q, 'snap', 'lens'))
    return { text: `${lenses.intro} ${lenses.groups.map((g) => `${g.title}: ${g.items.join(', ')}`).join('. ')}.`, actions: [{ label: 'See lenses', href: '#lenses' }] };
  for (const t of tracks) {
    if (has(q, t.label.toLowerCase(), t.id === 'ai' ? 'ai project' : '§', t.id === 'backend' ? 'api' : '§', t.id === 'data' ? 'analytics' : '§')) {
      const ps = projects.filter((p) => p.track === t.id);
      return { text: `${t.blurb} Highlights: ${ps.slice(0, 4).map((p) => `${p.name} — ${p.proof}`).join(' ')}`, actions: [{ label: `All ${ps.length} projects`, href: '#explore' }], follow: ['How do I hire him?'] };
    }
  }
  const cap = capabilities.find((c) => has(q, c.id === 'cv' ? 'vision' : c.id, c.title.toLowerCase()));
  if (cap) return { text: cap.body, follow: ['How do I hire him?', 'What is his tech stack?'] };
  return null;
}

export default function ChatBot({ onClose }: { onClose: () => void }) {
  const search = useMemo(() => createRetriever(buildChunks()), []);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [q, setQ] = useState('');
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const ctx = useRef<Ctx>({ lastQuery: '', offset: 0 });
  const listEl = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const idc = useRef(1);

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem('chat') ?? '[]') as Msg[];
      setMsgs(saved.length ? saved : [{ id: 0, from: 'bot', text: `Ask me anything about ${profile.shortName} — projects, AI work, Primeura, experience. I answer only from this site, with sources, and I run locally in your browser.`, follow: STARTERS }]);
      idc.current = saved.length + 1;
    } catch {}
    input.current?.focus();
  }, []);
  useEffect(() => {
    try { sessionStorage.setItem('chat', JSON.stringify(msgs.slice(-30))); } catch {}
    const el = listEl.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs]);

  const reply = (text: string): Omit<Msg, 'id' | 'from'> => {
    const more = /^(more|tell me more|go on|and\?|aur|details?)\b/i.test(text.trim());
    if (!more) {
      const hit = intent(text);
      if (hit) { ctx.current = { lastQuery: text, offset: 0 }; return hit; }
    }
    const query = more && ctx.current.lastQuery ? ctx.current.lastQuery : text;
    const offset = more ? ctx.current.offset + 2 : 0;
    const hits = search(query, offset + 2).slice(offset);
    ctx.current = { lastQuery: query, offset };
    if (!hits.length)
      return more
        ? { text: 'That’s everything I have on that. Try another topic, or ask him directly.', actions: CONTACT }
        : { text: 'I only answer from what’s on this site and couldn’t find that. Try projects, skills, AI work, Primeura or experience — or ask him directly.', follow: STARTERS.slice(0, 3), actions: CONTACT.slice(0, 2) };
    const body = hits.map((h) => bestSentences(h.chunk.text, query)).join('\n\n');
    return { text: body, sources: hits.map((h) => h.chunk), follow: ['Tell me more', 'How do I hire him?'] };
  };

  const send = (text: string) => {
    const t = text.trim().slice(0, 300);
    if (!t || busy) return;
    setMsgs((m) => [...m, { id: idc.current++, from: 'me', text: t }]);
    setQ('');
    setBusy(true);
    const r = reply(t);
    const id = idc.current++;
    setTimeout(() => {
      setMsgs((m) => [...m, { id, from: 'bot', ...r, text: '' }]);
      let i = 0;
      const step = Math.max(2, Math.ceil(r.text.length / 60));
      const timer = setInterval(() => {
        i = Math.min(r.text.length, i + step);
        setMsgs((m) => m.map((x) => (x.id === id ? { ...x, text: r.text.slice(0, i) } : x)));
        if (i >= r.text.length) { clearInterval(timer); setBusy(false); }
      }, 16);
    }, 260);
  };

  const act = async (a: Action) => {
    if (a.copy) {
      try { await navigator.clipboard.writeText(a.copy); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
      return;
    }
    if (a.href?.startsWith('#')) { onClose(); document.querySelector(a.href)?.scrollIntoView({ behavior: 'smooth' }); }
    else if (a.href) window.open(a.href, a.href.startsWith('mailto') ? '_self' : '_blank', 'noopener');
  };

  const last = msgs[msgs.length - 1];
  return (
    <motion.div
      role="dialog"
      aria-label="Ask Qasim's AI assistant"
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      className="fixed inset-x-3 bottom-20 z-[75] flex h-[min(600px,78svh)] flex-col overflow-hidden rounded-3xl border border-line bg-panel/95 shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:inset-x-auto sm:right-4 sm:w-[400px]"
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-glacier/15 text-glacier">
          <span className="absolute inset-0 animate-ping rounded-full bg-glacier/20 [animation-duration:2.5s]" />✦
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium text-snow">Ask Qasim’s AI</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-glacier">Local RAG · private · grounded</p>
        </div>
        <button onClick={() => { setMsgs([]); try { sessionStorage.removeItem('chat'); } catch {} ; ctx.current = { lastQuery: '', offset: 0 }; setTimeout(() => setMsgs([{ id: 0, from: 'bot', text: 'Fresh start — what would you like to know?', follow: STARTERS }]), 50); }} className="rounded-full px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-mist hover:text-snow" aria-label="Clear conversation">Clear</button>
        <button onClick={onClose} aria-label="Close assistant" className="flex h-8 w-8 items-center justify-center rounded-full text-mist hover:bg-ink hover:text-snow">✕</button>
      </div>

      <div ref={listEl} className="flex-1 space-y-3 overflow-y-auto overscroll-contain px-4 py-4" aria-live="polite">
        <AnimatePresence initial={false}>
          {msgs.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={m.from === 'me' ? 'flex justify-end' : ''}>
              <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === 'me' ? 'rounded-br-md bg-glacier text-night' : 'rounded-bl-md bg-ink text-snow/90'}`}>
                {m.text || <span className="inline-flex gap-1 py-1"><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist [animation-delay:.15s]" /><i className="h-1.5 w-1.5 animate-bounce rounded-full bg-mist [animation-delay:.3s]" /></span>}
                {m.sources && m.text && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {m.sources.map((s) => (
                      <a key={s.id} href={s.href} target={s.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-glacier hover:border-glacier">↳ {s.source}</a>
                    ))}
                  </div>
                )}
                {m.actions && m.text && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {m.actions.map((a) => (
                      <button key={a.label} onClick={() => act(a)} className="rounded-full bg-glacier/10 px-3 py-1 text-xs text-glacier transition-colors hover:bg-glacier hover:text-night">
                        {a.copy && copied ? 'Copied ✓' : a.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {last?.from === 'bot' && last.follow && !busy && (
        <div className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-2">
          {last.follow.map((s) => (
            <button key={s} onClick={() => send(s)} className="shrink-0 rounded-full border border-line px-3 py-1.5 text-xs text-mist transition-colors hover:border-glacier hover:text-snow">{s}</button>
          ))}
        </div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="flex gap-2 border-t border-line p-3">
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} maxLength={300} enterKeyHint="send" placeholder="Ask about projects, skills, Primeura…" aria-label="Your question" className="min-w-0 flex-1 rounded-xl border border-line bg-night/60 px-3 py-2.5 text-[16px] text-snow outline-none placeholder:text-mist focus:border-glacier sm:text-sm" />
        <button type="submit" disabled={busy || !q.trim()} className="rounded-xl bg-glacier px-4 text-sm font-medium text-night transition-opacity disabled:opacity-40" aria-label="Send">↑</button>
      </form>
    </motion.div>
  );
}

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  const [nudge, setNudge] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 9000);
    const k = (e: KeyboardEvent) => { if (e.key === '/' && !(e.target as HTMLElement).closest('input,textarea')) { e.preventDefault(); setOpen(true); } };
    addEventListener('keydown', k);
    return () => { clearTimeout(t); removeEventListener('keydown', k); };
  }, []);
  return (
    <>
      <AnimatePresence>{open && <ChatBot onClose={() => setOpen(false)} />}</AnimatePresence>
      <AnimatePresence>
        {nudge && !open && (
          <motion.button initial={{ opacity: 0, y: 8, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} onClick={() => { setOpen(true); setNudge(false); }} className="fixed bottom-[4.6rem] right-4 z-[75] max-w-[220px] rounded-2xl rounded-br-md border border-line bg-panel/95 px-3 py-2 text-left text-xs text-snow shadow-xl backdrop-blur">
            👋 Questions about Qasim’s work? Ask his AI — it answers in seconds.
          </motion.button>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.92 }}
        onClick={() => { setOpen((o) => !o); setNudge(false); }}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-5 right-4 z-[75] flex items-center gap-2 rounded-full bg-glacier px-4 py-3 text-sm font-medium text-night shadow-[0_0_40px_rgba(124,243,214,0.35)] md:bottom-6"
      >
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-night/50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-night" /></span>
        {open ? 'Close' : 'Ask my AI'}
      </motion.button>
    </>
  );
}
