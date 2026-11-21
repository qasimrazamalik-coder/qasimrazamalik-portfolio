'use client';

import { useEffect, useRef, useState } from 'react';

type GameId = 'avalanche' | 'stack' | 'bugs';
const GAMES: { id: GameId; name: string; how: string }[] = [
  { id: 'avalanche', name: 'Avalanche', how: 'Dodge the falling rocks. ← → or drag.' },
  { id: 'stack', name: 'Server Stack', how: 'Tap / Space to drop each block. Stack it high.' },
  { id: 'bugs', name: 'Bug Hunt', how: 'Squash as many bugs as you can in 20 seconds.' },
];
const W = 360, H = 480;
const C = { bg: '#0c0e15', line: '#1f2431', snow: '#eef1f7', mist: '#8b93a7', glacier: '#7cf3d6', ember: '#ffb454' };

type Api = { stop: () => void };
type Done = (score: number) => void;

function avalanche(ctx: CanvasRenderingContext2D, cv: HTMLCanvasElement, done: Done): Api {
  let x = W / 2, t = 0, score = 0, raf = 0, alive = true, dir = 0;
  const rocks: { x: number; y: number; r: number; v: number }[] = [];
  const key = (e: KeyboardEvent) => { if (e.key === 'ArrowLeft') dir = e.type === 'keydown' ? -1 : 0; if (e.key === 'ArrowRight') dir = e.type === 'keydown' ? 1 : 0; };
  const move = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); x = ((e.clientX - r.left) / r.width) * W; };
  addEventListener('keydown', key); addEventListener('keyup', key); cv.addEventListener('pointermove', move); cv.addEventListener('pointerdown', move);
  const loop = () => {
    t++; x = Math.max(14, Math.min(W - 14, x + dir * 5));
    if (t % Math.max(10, 32 - Math.floor(score / 8)) === 0) rocks.push({ x: Math.random() * W, y: -20, r: 8 + Math.random() * 12, v: 2.4 + Math.random() * 2 + score / 40 });
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = C.line; ctx.beginPath(); ctx.moveTo(0, H); ctx.lineTo(70, H - 60); ctx.lineTo(150, H - 20); ctx.lineTo(240, H - 80); ctx.lineTo(W, H - 30); ctx.lineTo(W, H); ctx.fill();
    for (let i = rocks.length - 1; i >= 0; i--) {
      const r = rocks[i]; r.y += r.v;
      ctx.fillStyle = C.mist; ctx.beginPath(); ctx.arc(r.x, r.y, r.r, 0, 7); ctx.fill();
      if (Math.hypot(r.x - x, r.y - (H - 46)) < r.r + 11) alive = false;
      if (r.y > H + 20) { rocks.splice(i, 1); score++; }
    }
    ctx.fillStyle = C.glacier; ctx.beginPath(); ctx.moveTo(x, H - 60); ctx.lineTo(x - 12, H - 34); ctx.lineTo(x + 12, H - 34); ctx.fill();
    ctx.fillStyle = C.snow; ctx.font = '600 18px "JetBrains Mono Variable", monospace'; ctx.fillText(`${score}`, 14, 28);
    if (alive) raf = requestAnimationFrame(loop); else done(score);
  };
  raf = requestAnimationFrame(loop);
  return { stop: () => { cancelAnimationFrame(raf); removeEventListener('keydown', key); removeEventListener('keyup', key); cv.removeEventListener('pointermove', move); cv.removeEventListener('pointerdown', move); } };
}

function stackGame(ctx: CanvasRenderingContext2D, cv: HTMLCanvasElement, done: Done): Api {
  const BH = 22;
  const blocks = [{ x: 90, w: 180 }];
  let cur = { x: 0, w: 180 }, v = 3, raf = 0, over = false, cam = 0;
  const drop = () => {
    if (over) return;
    const prev = blocks[blocks.length - 1];
    const l = Math.max(cur.x, prev.x), r = Math.min(cur.x + cur.w, prev.x + prev.w);
    if (r - l <= 0) { over = true; done(blocks.length - 1); return; }
    blocks.push({ x: l, w: r - l });
    cur = { x: v > 0 ? 0 : W - (r - l), w: r - l }; v = -Math.sign(v) * Math.min(7, Math.abs(v) + 0.25);
  };
  const key = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); drop(); } };
  addEventListener('keydown', key); cv.addEventListener('pointerdown', drop);
  const loop = () => {
    cur.x += v; if (cur.x < 0 || cur.x + cur.w > W) v = -v;
    const top = H - 40 - blocks.length * BH; cam += (Math.min(0, top - 160) - cam) * 0.1;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    blocks.forEach((b, i) => { ctx.fillStyle = i % 2 ? '#1a2f2b' : '#14403a'; ctx.fillRect(b.x, H - 40 - (i + 1) * BH - cam, b.w, BH - 2); });
    if (!over) { ctx.fillStyle = C.glacier; ctx.fillRect(cur.x, top - BH - cam, cur.w, BH - 2); }
    ctx.fillStyle = C.snow; ctx.font = '600 18px "JetBrains Mono Variable", monospace'; ctx.fillText(`${blocks.length - 1}`, 14, 28);
    if (!over) raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);
  return { stop: () => { cancelAnimationFrame(raf); removeEventListener('keydown', key); cv.removeEventListener('pointerdown', drop); } };
}

function bugs(ctx: CanvasRenderingContext2D, cv: HTMLCanvasElement, done: Done): Api {
  let score = 0, raf = 0;
  const end = performance.now() + 20000;
  const list: { x: number; y: number; vx: number; vy: number; hit: number }[] = [];
  const spawn = () => list.push({ x: 30 + Math.random() * (W - 60), y: 60 + Math.random() * (H - 120), vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3, hit: 0 });
  for (let i = 0; i < 4; i++) spawn();
  const tap = (e: PointerEvent) => {
    const r = cv.getBoundingClientRect(); const px = ((e.clientX - r.left) / r.width) * W, py = ((e.clientY - r.top) / r.height) * H;
    for (const b of list) if (!b.hit && Math.hypot(b.x - px, b.y - py) < 22) { b.hit = 12; score++; spawn(); break; }
  };
  cv.addEventListener('pointerdown', tap);
  const loop = (now: number) => {
    const left = Math.max(0, end - now);
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
    for (let i = list.length - 1; i >= 0; i--) {
      const b = list[i];
      if (b.hit) { b.hit--; ctx.fillStyle = C.ember; ctx.font = '700 16px "JetBrains Mono Variable", monospace'; ctx.fillText('+1', b.x - 8, b.y); if (!b.hit) list.splice(i, 1); continue; }
      b.x += b.vx; b.y += b.vy; if (b.x < 16 || b.x > W - 16) b.vx *= -1; if (b.y < 50 || b.y > H - 16) b.vy *= -1;
      ctx.fillStyle = C.glacier; ctx.beginPath(); ctx.ellipse(b.x, b.y, 10, 13, 0, 0, 7); ctx.fill();
      ctx.strokeStyle = C.glacier; ctx.lineWidth = 2; ctx.beginPath();
      for (const s of [-1, 1]) { ctx.moveTo(b.x + s * 8, b.y - 4); ctx.lineTo(b.x + s * 16, b.y - 10); ctx.moveTo(b.x + s * 8, b.y + 4); ctx.lineTo(b.x + s * 16, b.y + 10); }
      ctx.stroke();
    }
    ctx.fillStyle = C.snow; ctx.font = '600 18px "JetBrains Mono Variable", monospace'; ctx.fillText(`${score}`, 14, 28);
    ctx.fillStyle = C.mist; ctx.fillText(`${Math.ceil(left / 1000)}s`, W - 50, 28);
    if (left > 0) raf = requestAnimationFrame(loop); else done(score);
  };
  raf = requestAnimationFrame(loop);
  return { stop: () => { cancelAnimationFrame(raf); cv.removeEventListener('pointerdown', tap); } };
}

const RUN = { avalanche, stack: stackGame, bugs };

export function Arcade() {
  const [game, setGame] = useState<GameId>('avalanche');
  const [state, setState] = useState<'ready' | 'play' | 'over'>('ready');
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<Record<string, number>>({});
  const cv = useRef<HTMLCanvasElement>(null);
  const api = useRef<Api | null>(null);

  useEffect(() => {
    try { setBest(JSON.parse(localStorage.getItem('arcade-best') ?? '{}')); } catch {}
    return () => api.current?.stop();
  }, []);

  useEffect(() => {
    const ctx = cv.current?.getContext('2d');
    if (!ctx || state === 'play') return;
    ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
  }, [game, state]);

  const start = () => {
    const c = cv.current, ctx = c?.getContext('2d');
    if (!c || !ctx) return;
    api.current?.stop();
    setState('play');
    api.current = RUN[game](ctx, c, (s) => {
      setScore(s);
      setState('over');
      setBest((b) => {
        const nb = { ...b, [game]: Math.max(b[game] ?? 0, s) };
        try { localStorage.setItem('arcade-best', JSON.stringify(nb)); } catch {}
        return nb;
      });
    });
  };

  const meta = GAMES.find((g) => g.id === game)!;
  return (
    <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Choose a game">
          {GAMES.map((g) => (
            <button key={g.id} role="tab" aria-selected={g.id === game} onClick={() => { api.current?.stop(); setGame(g.id); setState('ready'); }} className={`rounded-full px-4 py-2 text-sm transition-colors ${g.id === game ? 'bg-glacier text-night' : 'border border-line text-mist hover:text-snow'}`}>
              {g.name}
            </button>
          ))}
        </div>
        <p className="mt-5 text-lg text-snow">{meta.name}</p>
        <p className="mt-1 text-mist">{meta.how}</p>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-widest text-mist">Best: <span className="text-glacier">{best[game] ?? 0}</span></p>
        <p className="mt-6 max-w-sm text-sm text-mist">Each game is under 80 lines of canvas code — no engine, no assets, 60 fps. The same discipline goes into my Snapchat Lens games.</p>
      </div>
      <div className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-line">
        <canvas ref={cv} width={W} height={H} className="block aspect-[3/4] w-full touch-none bg-ink" aria-label={`${meta.name} game canvas`} />
        {state !== 'play' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-night/90">
            {state === 'over' && <p className="text-3xl font-medium text-snow">Score {score}</p>}
            <button onClick={start} className="rounded-full bg-glacier px-6 py-3 font-medium text-night">{state === 'over' ? 'Play again' : `Play ${meta.name}`}</button>
          </div>
        )}
      </div>
    </div>
  );
}
