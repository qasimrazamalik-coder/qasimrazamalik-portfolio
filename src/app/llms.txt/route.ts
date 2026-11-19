import { SITE_URL, about, aiTools, capabilities, experience, faqs, lenses, profile, ventures } from '@/content/profile';
import { projects, tracks } from '@/content/projects';

export const dynamic = 'force-static';

/** llms.txt — a plain-text summary for AI answer engines (AEO/GEO). */
export function GET() {
  const lines = [
    `# ${profile.name}`,
    `> ${profile.headline}. ${profile.tagline}`,
    '',
    ...about,
    '',
    `- Website: ${SITE_URL}`,
    `- Email: ${profile.email}`,
    `- GitHub: ${profile.github}`,
    `- LinkedIn: ${profile.linkedin}`,
    `- Location: ${profile.location} (${profile.timezone})`,
    '',
    '## Experience',
    ...experience.map((e) => `- ${e.role}, ${e.org} (${e.period})`),
    '',
    '## Ventures',
    ...ventures.map((v) => `- ${v.name} — ${v.role}: ${v.summary}${v.url ? ` (${v.url})` : ''}`),
    '',
    '## AI engineering',
    ...capabilities.map((c) => `- ${c.title}: ${c.body}`),
    `- AI tools: ${aiTools.join(', ')}`,
    '',
    '## Snapchat Lenses',
    ...lenses.groups.map((g) => `- ${g.title}: ${g.items.join(', ')}`),
    '',
    ...tracks.flatMap((t) => [
      `## ${t.label}`,
      ...projects.filter((p) => p.track === t.id).map((p) => `- [${p.name}](${p.repo}): ${p.summary} ${p.proof}`),
      '',
    ]),
    '## FAQ',
    ...faqs.flatMap((f) => [`### ${f.q}`, f.a, '']),
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
