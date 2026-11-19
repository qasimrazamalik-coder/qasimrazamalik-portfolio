'use client';

import { useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

export function ContactForm({ email }: { email: string }) {
  const [state, setState] = useState<State>('idle');
  const [msg, setMsg] = useState('');

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    setState('sending');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const body = (await res.json().catch(() => ({}))) as { error?: string; fallback?: string };
      if (res.ok) {
        setState('sent');
        form.reset();
        return;
      }
      if (body.fallback === 'mailto') {
        const subject = encodeURIComponent(`Portfolio enquiry from ${data.name ?? ''}`);
        const text = encodeURIComponent(`${data.message ?? ''}\n\n— ${data.name ?? ''} (${data.email ?? ''})`);
        window.location.href = `mailto:${email}?subject=${subject}&body=${text}`;
        setState('idle');
        return;
      }
      setMsg(body.error ?? 'Something went wrong. Please email me directly.');
      setState('error');
    } catch {
      setMsg('Network error. Please email me directly.');
      setState('error');
    }
  }

  const field = 'w-full rounded-xl border border-line bg-night/60 px-4 py-3 text-snow outline-none transition-colors placeholder:text-mist/70 focus:border-glacier';

  return (
    <form onSubmit={onSubmit} className="grid gap-4" noValidate={false}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm text-mist">
          Name
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="grid gap-1.5 text-sm text-mist">
          Email
          <input name="email" type="email" required maxLength={120} autoComplete="email" className={field} placeholder="you@company.com" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm text-mist">
        What are you building?
        <textarea name="message" required minLength={10} maxLength={4000} rows={5} className={field} placeholder="A role, a project, a timeline…" />
      </label>
      {/* honeypot */}
      <input name="company_site" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={state === 'sending'}
          data-magnetic
          className="group rounded-full bg-glacier px-7 py-3.5 font-medium text-night transition-[filter] hover:brightness-110 disabled:opacity-60"
        >
          <span className="roll"><span>{state === 'sending' ? 'Sending…' : 'Send message'}</span><span aria-hidden className="!text-night">{state === 'sending' ? 'Sending…' : 'Send message'}</span></span>
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {state === 'sent' && <span className="text-glacier">Thanks — I’ll reply within a day.</span>}
          {state === 'error' && <span className="text-ember">{msg}</span>}
        </p>
      </div>
    </form>
  );
}
