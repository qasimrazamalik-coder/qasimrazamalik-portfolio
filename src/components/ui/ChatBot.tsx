'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { buildChunks, createRetriever, type Chunk } from '@/lib/knowledge';

type Msg = { from: 'bot' | 'me'; text: string; sources?: Chunk[] };

const SUGGESTIONS = ['What does Qasim build?', 'Tell me about Primeura', 'Can he build a RAG chatbot?', 'How do I hire him?'];

/** Grounded answer: the best-matching passages from this site, quoted with their sources. Never invents. */
function answer(q: string, search: ReturnType<typeof createRetriever>): Msg {
  if (/^\s*(hi|hello|hey|salam|assalam)/i.test(q)) return { from: 'bot', text: 'Hi! I’m Qasim’s portfolio assistant. Ask me about his projects, experience, AI work, Primeura or how to hire him.' };
  const hits = search(q, 3);
  if (!hits.length)
    return { from: 'bot', text: 'I only answer from what’s on this site, and I couldn’t find that. Try asking about his projects, skills, experience or Primeura — or email iamqasimrazamalik@gmail.com.' };
  const [top, ...rest] = hits;
  const extra = rest.filter((r) => r.score > top.score * 0.6).map((r) => r.chunk);
  const text = [top.chunk.text, ...extra.slice(0, 1).map((c) => c.text)].join('\n\n');
  return { from: 'bot', text, sources: [top.chunk, ...extra] };
}

export default function ChatBot({ onClose }: { onClose: () => void }) {
  const search = useMemo(() => createRetriever(buildChunks()), []);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: 'bot', text: 'Ask me anything about Qasim — I answer only from this site, with sources. Runs locally in your browser.' }]);
  const [q, setQ] = useState('');
  const [typing, setTyping] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    input.current?.focus();
  }, []);
  useEffect(() => {
    const el = list.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [msgs, typing]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || typing) return;
    setMsgs((m) => [...m, { from: 'me', text: t }]);
    setQ('');
    setTyping(true);
    setTimeout(() => {
      setMsgs((m) => [...m, answer(t, search)]);
      setTyping(false);
    }, 380);
  };

  return (
    <motion.div
      role="dialog"
      aria-label="Ask Qasim's AI assistant"
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 360, damping: 30 }}
      className="fixed bottom-24 right-4 z-[75] flex h-[min(560px,75svh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-panel/95 shadow-2xl backdrop-blur-xl"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div>
          <p className="text-sm font-medium text-snow">Ask Qasim’s AI</p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-glacier">Local RAG · no data leaves your browser</p>
        </div>
        <button onClick={onClose} aria-label="Close assistant" className="rounded-full px-2 py-1 text-mist hover:text-snow">✕</button>
      </div>
      <div ref={list} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === 'me' ? 'flex justify-end' : ''}>
            <div className={`max-w-[88%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${m.from === 'me' ? 'bg-glacier text-night' : 'bg-ink text-snow/90'}`}>
              {m.text}
              {m.sources && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.sources.map((s) => (
                    <a key={s.id} href={s.href} target={s.href?.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-glacier hover:border-glacier">
                      ↳ {s.source}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && <div className="w-14 rounded-2xl bg-ink px-3 py-2.5 text-sm text-mist"><span className="animate-pulse">•••</span></div>}
        {msgs.length === 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="rounded-full border border-line px-3 py-1.5 text-xs text-mist hover:border-glacier hover:text-snow">{s}</button>
            ))}
          </div>
        )}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(q); }} className="flex gap-2 border-t border-line p-3">
        <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} maxLength={300} placeholder="Ask about projects, skills, Primeura…" aria-label="Your question" className="flex-1 rounded-xl border border-line bg-night/60 px-3 py-2 text-sm text-snow outline-none placeholder:text-mist focus:border-glacier" />
        <button type="submit" className="rounded-xl bg-glacier px-3 text-sm font-medium text-night">Ask</button>
      </form>
    </motion.div>
  );
}

export function ChatLauncher() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <AnimatePresence>{open && <ChatBot onClose={() => setOpen(false)} />}</AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
        className="fixed bottom-5 right-4 z-[75] flex items-center gap-2 rounded-full bg-glacier px-4 py-3 text-sm font-medium text-night shadow-[0_0_40px_rgba(124,243,214,0.35)] transition-transform hover:scale-105"
      >
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-night/50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-night" /></span>
        {open ? 'Close' : 'Ask my AI'}
      </button>
    </>
  );
}
