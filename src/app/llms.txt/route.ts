import { SITE_URL, about, experience, faqs, profile } from '@/content/profile';
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
    ...experience.map((e) => `- ${e.role}, ${e.org} (${e.type}, ${e.period})`),
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
