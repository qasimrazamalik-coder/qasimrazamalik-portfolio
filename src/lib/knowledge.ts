import { about, aiTools, capabilities, clients, education, experience, faqs, lenses, profile, stack, ventures } from '@/content/profile';
import { projects, tracks } from '@/content/projects';

export type Chunk = { id: string; source: string; text: string; href?: string };

/** The knowledge base for the on-site RAG assistant — built only from this site's own content. */
export function buildChunks(): Chunk[] {
  const c: Chunk[] = [];
  c.push({ id: 'bio', source: 'About', text: `${profile.name} — ${profile.headline}. ${about.join(' ')}`, href: '#about' });
  c.push({ id: 'contact', source: 'Contact', text: `Contact ${profile.name} by email at ${profile.email} or phone ${profile.phone}. He is based in ${profile.location} (${profile.timezone}). ${profile.availability}. GitHub: ${profile.github}. LinkedIn: ${profile.linkedin}.`, href: '#contact' });
  experience.forEach((e, i) => c.push({ id: `exp${i}`, source: 'Experience', text: `${e.role} at ${e.org} (${e.period}, ${e.place}). ${e.points.join(' ')}`, href: '#journey' }));
  education.forEach((e, i) => c.push({ id: `edu${i}`, source: 'Education', text: `${e.degree} at ${e.school}, ${e.status}.`, href: '#journey' }));
  ventures.forEach((v, i) => c.push({ id: `ven${i}`, source: v.name, text: `${v.name} — ${v.role}. ${v.summary} ${v.points.join('. ')}. Stack: ${v.stack.join(', ')}.`, href: v.url ?? '#ventures' }));
  capabilities.forEach((k) => c.push({ id: `cap-${k.id}`, source: k.title, text: `${k.title}: ${k.body}`, href: '#ai' }));
  c.push({ id: 'tools', source: 'AI tools', text: `AI tools Qasim works with daily: ${aiTools.join(', ')}.`, href: '#ai' });
  stack.forEach((s, i) => c.push({ id: `stack${i}`, source: 'Toolbox', text: `${s.group} skills: ${s.items.join(', ')}.`, href: '#stack' }));
  clients.forEach((cl, i) => c.push({ id: `cl${i}`, source: 'Client work', text: `Client website: ${cl.name} — ${cl.what}. Built with ${cl.tags.join(', ')}.`, href: cl.url ?? '#clients' }));
  c.push({ id: 'lenses', source: 'Snapchat Lenses', text: `${lenses.intro} ${lenses.groups.map((g) => `${g.title}: ${g.items.join(', ')}`).join('. ')}.`, href: '#lenses' });
  projects.forEach((p) => c.push({ id: p.slug, source: p.name, text: `${p.name} (${tracks.find((t) => t.id === p.track)?.label}): ${p.summary} ${p.proof} Stack: ${p.stack.join(', ')}.`, href: p.repo }));
  faqs.forEach((f, i) => c.push({ id: `faq${i}`, source: 'FAQ', text: `${f.q} ${f.a}`, href: '#faq' }));
  return c;
}

const STOP = new Set('a an the and or of to in on for with is are was be by at as it this that what who how do does can you your me my i he his him from about tell any please'.split(' '));
const SYN: Record<string, string> = { hire: 'contact', email: 'contact', reach: 'contact', job: 'experience', work: 'experience', worked: 'experience', company: 'experience', study: 'education', degree: 'education', university: 'education', chatbot: 'rag', bot: 'rag', wp: 'wordpress', website: 'web', websites: 'web', snap: 'snapchat', lens: 'lenses', game: 'games', ml: 'ai', founder: 'co-founder', cofounder: 'co-founder' };

export function tokenize(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9+#\-\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map((t) => SYN[t] ?? t.replace(/s$/, ''));
}

/** Okapi BM25 retriever — the "R" in RAG, fully in the browser. */
export function createRetriever(chunks: Chunk[]) {
  const docs = chunks.map((ch) => tokenize(`${ch.source} ${ch.text}`));
  const avg = docs.reduce((a, d) => a + d.length, 0) / docs.length;
  const df = new Map<string, number>();
  docs.forEach((d) => new Set(d).forEach((t) => df.set(t, (df.get(t) ?? 0) + 1)));
  const N = docs.length, k1 = 1.4, b = 0.75;
  return (query: string, k = 3) => {
    const q = tokenize(query);
    return docs
      .map((d, i) => {
        let score = 0;
        for (const t of q) {
          const f = d.filter((x) => x === t).length;
          if (!f) continue;
          const idf = Math.log(1 + (N - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
          score += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * d.length) / avg)));
        }
        return { chunk: chunks[i], score };
      })
      .filter((r) => r.score > 0.8)
      .sort((a, b2) => b2.score - a.score)
      .slice(0, k);
  };
}
