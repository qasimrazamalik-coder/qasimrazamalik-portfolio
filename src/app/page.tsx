import Image from 'next/image';
import { SITE_URL, about, aiTools, capabilities, clients, education, experience, faqs, lenses, profile, roles, services, socials, stack, techIcons, ventures } from '@/content/profile';
import { featured, projects, tracks } from '@/content/projects';
import { getRepos } from '@/lib/github';
import { Experience } from '@/components/ui/Experience';
import { CommandPalette, PaletteButton, type Command } from '@/components/ui/CommandPalette';
import { WorkExplorer } from '@/components/sections/WorkExplorer';
import { ContactForm } from '@/components/sections/ContactForm';
import { Arcade } from '@/components/sections/Arcade';
import { ChatLauncher } from '@/components/ui/ChatBot';
import { Carousel } from '@/components/ui/Carousel';
import { FieldNotes } from '@/components/sections/FieldNotes';
import { Tapes } from '@/components/sections/Tapes';
import { StackLayers } from '@/components/sections/StackLayers';
import { Receipts } from '@/components/sections/Receipts';
import { ChapterRail } from '@/components/ui/ChapterRail';
import { ThemeControls } from '@/components/ui/ThemeControls';
import { licenseUrl, places, sourceUrl } from '@/content/places';
import { MobileMenu, Preloader, ScrollTop } from '@/components/ui/Chrome';

export const revalidate = 21600;

const nav = [
  { href: '#ventures', label: 'Ventures' },
  { href: '#work', label: 'Work' },
  { href: '#ai', label: 'AI' },
  { href: '#arcade', label: 'Play' },
  { href: '#contact', label: 'Contact' },
];
const liveSocials = socials.filter((s) => s.url);

function Roll({ children }: { children: string }) {
  return (
    <span className="roll">
      <span>{children}</span>
      <span aria-hidden>{children}</span>
    </span>
  );
}

const toUrdu = (n: string) => n.replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[Number(d)]);

function Eyebrow({ n, children }: { n: string; children: string }) {
  return (
    <>
      <span aria-hidden className="chapter-mark">{n}</span>
      <p data-chapter={n} data-label={children} className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.25em] text-mist">
        <span lang="ur" dir="rtl" className="font-sans text-sm normal-case tracking-normal text-glacier/80">باب {toUrdu(n)}</span>
        <span className="text-glacier">{n}</span>
        <span className="h-px w-8 bg-line" />
        {children}
      </p>
    </>
  );
}

const timeAgo = (iso: string) => {
  const d = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000));
  return d < 30 ? `${d}d ago` : d < 365 ? `${Math.round(d / 30)}mo ago` : `${Math.round(d / 365)}y ago`;
};

export default async function Home() {
  const { repos, total } = await getRepos();
  const curated = new Set(projects.map((p) => (p.repo ?? '').split('/').pop()?.toLowerCase()));
  const latest = repos.filter((r) => !curated.has(r.name.toLowerCase())).slice(0, 6);
  const recent = repos.slice(0, 6);
  const publicCount = total || projects.length;
  const languages = new Set(repos.map((r) => r.language).filter(Boolean)).size || 10;

  const commands: Command[] = [
    ...nav.map((n) => ({ id: n.href, label: n.label, hint: 'Jump to section', href: n.href, group: 'Section' })),
    ...projects.map((p) => ({ id: p.slug, label: p.name, hint: p.summary, href: p.repo ?? profile.github, group: tracks.find((t) => t.id === p.track)!.label })),
    { id: 'mail', label: 'Email Qasim', hint: profile.email, href: `mailto:${profile.email}`, group: 'Link' },
    { id: 'gh', label: 'GitHub', hint: profile.githubUser, href: profile.github, group: 'Link' },
    { id: 'li', label: 'LinkedIn', hint: 'Profile', href: profile.linkedin, group: 'Link' },
  ];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: profile.name,
        url: SITE_URL,
        email: `mailto:${profile.email}`,
        jobTitle: profile.role,
        description: profile.tagline,
        homeLocation: { '@type': 'Place', name: profile.location },
        image: `${SITE_URL}${profile.photo}`,
        telephone: profile.phone,
        worksFor: { '@type': 'Organization', name: 'Digital Experts Dev', url: profile.agency.url },
        alumniOf: [
          { '@type': 'CollegeOrUniversity', name: 'Abbottabad University of Science and Technology' },
          { '@type': 'CollegeOrUniversity', name: 'COMSATS Institute of Information Technology' },
        ],
        knowsAbout: [...stack.flatMap((s) => s.items), ...capabilities.map((c) => c.title), ...aiTools],
        sameAs: liveSocials.map((s) => s.url),
      },
      { '@type': 'Organization', '@id': `${SITE_URL}/#primeura`, name: 'Primeura Digital Solutions', url: 'https://primeura.com', areaServed: 'United Arab Emirates', founder: { '@id': `${SITE_URL}/#person` } },
      { '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: SITE_URL, name: profile.name, publisher: { '@id': `${SITE_URL}/#person` }, inLanguage: 'en' },
      { '@type': 'ProfilePage', '@id': `${SITE_URL}/#profile`, url: SITE_URL, mainEntity: { '@id': `${SITE_URL}/#person` }, isPartOf: { '@id': `${SITE_URL}/#website` } },
      {
        '@type': 'ItemList',
        name: 'Selected projects',
        itemListElement: featured.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: { '@type': 'SoftwareSourceCode', name: p.name, description: `${p.summary} ${p.proof}`, codeRepository: p.repo, author: { '@id': `${SITE_URL}/#person` } },
        })),
      },
      { '@type': 'FAQPage', mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <Experience />
      <CommandPalette commands={commands} />
      <ChatLauncher />
      <ScrollTop />
      <ChapterRail />
      <Preloader />

      {/* header */}
      <header className="fixed inset-x-0 top-0 z-40 before:pointer-events-none before:absolute before:inset-0 before:-bottom-6 before:bg-gradient-to-b before:from-night/95 before:via-night/70 before:to-transparent before:backdrop-blur-md before:[mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
          <a href="#top" className="group flex items-center gap-2.5" aria-label={`${profile.name} — home`}>
            <span className="relative flex h-8 w-8 items-center justify-center rounded-full border border-line bg-panel/85">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-glacier" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden><path d="M2 19 9 7l4 6 3-4 6 10H2Z" /></svg>
            </span>
            <span className="text-sm font-medium tracking-tight"><Roll>Qasim Raza Malik</Roll></span>
          </a>
          <nav aria-label="Primary" className="hidden items-center gap-1 rounded-full border border-line bg-panel/85 p-1 md:flex">
            {nav.map((n) => (
              <a key={n.href} href={n.href} className="group rounded-full px-4 py-1.5 text-sm text-mist transition-colors hover:text-snow">
                <Roll>{n.label}</Roll>
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <div className="hidden xl:block"><ThemeControls /></div>
            <PaletteButton />
            <a href={`mailto:${profile.email}`} data-magnetic className="group hidden rounded-full bg-snow px-4 py-2 text-sm font-medium text-night sm:block">
              <span className="roll"><span>Hire me</span><span aria-hidden className="!text-night">Say hi →</span></span>
            </a>
            <MobileMenu links={[...nav, { href: '#clients', label: 'Clients' }]} />
          </div>
        </div>
      </header>

      <main id="main">
        {/* HERO */}
        <section id="top" className="relative flex min-h-[100svh] flex-col justify-end px-5 pb-14 pt-32 md:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-panel/85 px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-mist">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-glacier opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-glacier" /></span>
              {profile.availability}
            </p>
            <h1 className="max-w-6xl text-[clamp(2.8rem,8.4vw,8.5rem)] font-medium leading-[0.92] tracking-[-0.045em]">
              <span className="block" data-split>Qasim Raza Malik</span>{' '}
              <span className="sr-only">— AI & Backend Engineer —</span>{' '}
              <span className="block font-serif font-normal italic tracking-[-0.02em] text-glacier" data-split>builds proof,</span>{' '}
              <span className="block text-snow/80" data-split>not promises.</span>
            </h1>
            <div className="mt-10 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
              <div data-reveal>
                <p className="max-w-xl text-lg leading-relaxed text-mist">
                  {profile.role} from {profile.location}. {profile.tagline}
                </p>
                <dl className="mt-6 grid max-w-xl grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1.5 font-mono text-[12px]">
                  <dt className="uppercase tracking-widest text-mist/70">Now</dt>
                  <dd className="text-snow/90">{experience[0].role} · {experience[0].org}</dd>
                  <dt className="uppercase tracking-widest text-mist/70">Stack</dt>
                  <dd className="text-snow/90">Next.js · Node.js · Python · FastAPI · PostgreSQL</dd>
                  <dt className="uppercase tracking-widest text-mist/70">Status</dt>
                  <dd className="flex items-center gap-2 text-snow/90"><span className="h-1.5 w-1.5 rounded-full bg-glacier" />{profile.availability}</dd>
                </dl>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end" data-reveal>
                <a href="#work" data-magnetic className="group rounded-full bg-glacier px-6 py-3.5 font-medium text-night">
                  <span className="roll"><span>See the work</span><span aria-hidden className="!text-night">Scroll the lab ↓</span></span>
                </a>
                <a href={profile.github} target="_blank" rel="noopener noreferrer" data-magnetic className="group rounded-full border border-line bg-panel/85 px-6 py-3.5">
                  <Roll>GitHub ↗</Roll>
                </a>
              </div>
            </div>
            <div className="mt-14 flex items-center justify-between border-t border-line pt-5 font-mono text-[11px] uppercase tracking-widest text-mist">
              <span>{profile.timezone}</span>
              <span className="hidden sm:inline">Scroll to fly through the valley</span>
              <span>34.17° N · 73.22° E</span>
            </div>
          </div>
        </section>

        {/* PROOF STRIP */}
        <section aria-label="At a glance" className="px-5 md:px-10">
          <div className="relative isolate mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-3xl border border-line bg-line md:grid-cols-4">
            {[
              { n: publicCount, l: 'public repositories', s: '+' },
              { n: 30, l: 'client websites delivered', s: '+' },
              { n: languages, l: 'languages shipped', s: '' },
              { n: 6, l: 'engineering tracks', s: '' },
            ].map((x) => (
              <div key={x.l} className="bg-ink/90 p-6 md:p-8">
                <p className="text-4xl font-medium tracking-tight md:text-5xl"><span data-count={x.n}>{x.n}</span><span className="text-glacier">{x.s}</span></p>
                <p className="mt-2 text-sm text-mist">{x.l}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="px-5 py-28 md:px-10 md:py-40">
          <div className="relative isolate mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow n="01">Base camp</Eyebrow>
              <h2 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
                Engineer from the mountains of <em className="font-serif font-normal text-glacier">Abbottabad.</em>
              </h2>
              <div className="group relative mt-10 w-56 md:w-64" data-reveal>
                <div className="absolute -inset-3 rounded-[2rem] bg-[conic-gradient(from_180deg,#7cf3d6,#ffb454,#9d8cff,#7cf3d6)] opacity-40 blur-2xl transition-opacity duration-700 group-hover:opacity-80" aria-hidden />
                <Image src={profile.photo} alt={`${profile.name}, AI & backend engineer`} width={460} height={460} priority={false} className="relative aspect-square w-full rounded-[1.75rem] border border-line object-cover grayscale-[35%] transition-[filter,transform] duration-700 group-hover:scale-[1.02] group-hover:grayscale-0" />
              </div>
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Roles">
                {roles.map((r) => (
                  <li key={r} className="rounded-full border border-line bg-panel/85 px-3 py-1 text-xs text-snow/90">{r}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-6 text-lg leading-relaxed text-mist">
              {about.map((p) => (
                <p key={p.slice(0, 20)} data-reveal>{p}</p>
              ))}
              <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-sm" data-reveal>
                <a className="sweep text-snow" href={profile.company.url} target="_blank" rel="noopener noreferrer">{profile.company.name} ↗</a>
                <a className="sweep text-snow" href={profile.agency.url} target="_blank" rel="noopener noreferrer">{profile.agency.name} ↗</a>
                <a className="sweep text-snow" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
              </div>
            </div>
          </div>
        </section>

        <FieldNotes />

        {/* VENTURES */}
        <section id="ventures" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="03">Ventures & flagship builds</Eyebrow>
            <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
              Companies I run, products I <em className="font-serif font-normal text-glacier">own.</em>
            </h2>
            <div className="mt-14 grid gap-5 md:grid-cols-2" data-stagger>
              {ventures.map((v, i) => (
                <article key={v.name} data-tilt className={`spot group relative overflow-hidden rounded-3xl border border-line bg-ink/90 [transform-style:preserve-3d] ${i === 0 ? 'md:col-span-2 md:grid md:grid-cols-[1.1fr_1fr]' : ''}`}>
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line md:border-b-0" style={{ background: `radial-gradient(circle at 30% 20%, ${v.accent}33, transparent 60%), #0c0e15` }}>
                    {v.image ? (
                      <Image src={v.image} alt={`${v.name} website screenshot`} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover object-top" data-parallax />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-serif text-6xl italic md:text-7xl" style={{ color: v.accent }}>{v.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col p-6 md:p-8">
                    <p className="font-mono text-[11px] uppercase tracking-widest" style={{ color: v.accent }}>{v.role}</p>
                    <h3 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{v.name}</h3>
                    <p className="mt-3 text-mist">{v.summary}</p>
                    <ul className="mt-4 space-y-1.5 text-sm text-snow/90">
                      {v.points.map((pt) => (<li key={pt} className="flex gap-3"><span className="mt-2 h-px w-3 shrink-0" style={{ background: v.accent }} />{pt}</li>))}
                    </ul>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6">
                      <ul className="flex flex-wrap gap-1.5">{v.stack.map((s) => (<li key={s} className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[10px] text-mist">{s}</li>))}</ul>
                      {v.url && <a href={v.url} target="_blank" rel="noopener noreferrer" data-magnetic className="group/l rounded-full border border-line px-4 py-2 text-sm text-snow hover:border-glacier"><Roll>Visit site ↗</Roll></a>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED WORK */}
        <section id="work" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="04">Selected work</Eyebrow>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
                Every project ships with <em className="font-serif font-normal text-glacier">receipts.</em>
              </h2>
              <p className="max-w-sm text-mist" data-reveal>Hover a row. The green line is the proof — the test, benchmark or measurement behind the claim.</p>
            </div>
            <ol className="mt-14 border-t border-line">
              {featured.map((p, i) => (
                <li key={p.slug}>
                  <a
                    href={`/work/${p.slug}`}
                    data-cursor="view"
                    data-cursor-label="Read"
                    className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 gap-y-2 border-b border-line py-7 transition-colors hover:bg-panel/85 md:grid-cols-[3rem_1.1fr_1.4fr_auto] md:px-4"
                  >
                    <span className="font-mono text-xs text-mist">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="text-2xl font-medium tracking-tight transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                      <Roll>{p.name}</Roll>
                    </h3>
                    <div className="col-start-2 md:col-start-auto">
                      <p className="text-mist">{p.summary}</p>
                      <p className="mt-1 max-h-0 overflow-hidden text-sm text-glacier opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100 group-focus-visible:max-h-20 group-focus-visible:opacity-100">
                        {p.proof}
                      </p>
                    </div>
                    <span className="col-start-2 font-mono text-[10px] uppercase tracking-widest text-mist md:col-start-auto">
                      {tracks.find((t) => t.id === p.track)!.label}
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* EXPLORER */}
        <section id="explore" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl rounded-[2rem] border border-line bg-night/85 p-6 md:p-12">
            <Eyebrow n="05">The full lab</Eyebrow>
            <h2 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight md:text-5xl" data-split>
              {projects.length} builds. Six disciplines. Zero lorem ipsum.
            </h2>
            <div className="mt-10">
              <WorkExplorer projects={projects} tracks={tracks} />
            </div>
          </div>
        </section>

        {/* PROOF RECEIPTS */}
        <section id="receipts" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="06">Proof receipts</Eyebrow>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
                Every claim comes with a <em className="font-serif font-normal text-glacier">receipt.</em>
              </h2>
              <p className="max-w-sm text-mist" data-reveal>Printed straight from the repos: what was tested, what was measured. Drag through the slips.</p>
            </div>
            <div className="mt-12">
              <Receipts items={featured} trackLabel={Object.fromEntries(tracks.map((t) => [t.id, t.label]))} />
            </div>
          </div>
        </section>

        {/* LIVE FROM GITHUB */}
        {(latest.length > 0 || recent.length > 0) && (
          <section id="latest" className="px-5 pb-28 md:px-10 md:pb-40">
            <div className="relative isolate mx-auto max-w-7xl">
              <Eyebrow n="07">Live from GitHub</Eyebrow>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <h2 className="text-4xl font-medium tracking-tight md:text-5xl" data-split>Pushed to GitHub, straight from the terminal.</h2>
                <p className="max-w-sm text-sm text-mist" data-reveal>Pulled from the GitHub API and refreshed every few hours — new public work appears here automatically.</p>
              </div>
              <ul className="mt-10 grid gap-3 md:grid-cols-2" data-stagger>
                {(latest.length ? latest : recent).map((r) => (
                  <li key={r.name}>
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="group flex items-start justify-between gap-6 rounded-2xl border border-line bg-ink/90 p-5 transition-colors hover:border-glacier/40">
                      <span>
                        <span className="font-mono text-sm text-snow"><Roll>{r.name}</Roll></span>
                        {r.description && <span className="mt-1.5 block text-sm text-mist">{r.description}</span>}
                      </span>
                      <span className="shrink-0 text-right font-mono text-[10px] uppercase tracking-widest text-mist">
                        {r.language ?? '—'}
                        <span className="mt-1 block">{timeAgo(r.pushedAt)}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* AI CAPABILITIES */}
        <section id="ai" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="08">AI engineering</Eyebrow>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
              <h2 className="max-w-3xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
                Agents, MCP, vision — AI that does <em className="font-serif font-normal text-glacier">real work.</em>
              </h2>
              <p className="max-w-sm text-mist" data-reveal>Try the assistant in the corner — it is a retrieval-augmented chatbot over this site, running entirely in your browser.</p>
            </div>
            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
              {capabilities.map((c, i) => (
                <article key={c.id} data-tilt className="spot rounded-2xl border border-line bg-ink/90 p-6 [transform-style:preserve-3d]">
                  <p className="font-mono text-[11px] text-glacier">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-4 text-xl font-medium tracking-tight">{c.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-mist">{c.body}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 rounded-2xl border border-line bg-night/85 p-6">
              <p className="font-mono text-[11px] uppercase tracking-widest text-mist">AI tools I ship with every day</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {aiTools.map((t) => (
                  <li key={t} className="group rounded-full border border-line bg-panel/85 px-4 py-2 text-sm text-snow transition-colors hover:border-glacier hover:text-glacier">{t}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* SNAPCHAT LENSES */}
        <section id="lenses" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl rounded-[2rem] border border-line bg-[radial-gradient(circle_at_85%_10%,rgba(255,252,0,0.12),transparent_45%)] bg-night/85 p-6 md:p-12">
            <Eyebrow n="09">Snapchat Lenses</Eyebrow>
            <div className="mt-6 grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-4xl font-medium leading-[1.02] tracking-tight md:text-5xl" data-split>Snapchat Lenses built in Lens Studio.</h2>
                <p className="mt-5 text-mist" data-reveal>{lenses.intro}</p>
                {socials.find((s) => s.label === 'Snapchat')?.url && (
                  <a href={socials.find((s) => s.label === 'Snapchat')!.url} target="_blank" rel="noopener noreferrer" data-magnetic className="mt-6 inline-flex rounded-full bg-[#fffc00] px-5 py-3 text-sm font-medium text-night">Open on Snapchat ↗</a>
                )}
              </div>
              <div className="grid gap-4 sm:grid-cols-2" data-stagger>
                {lenses.groups.map((g) => (
                  <div key={g.title} className="rounded-2xl border border-line bg-ink/90 p-5">
                    <h3 className="font-mono text-[11px] uppercase tracking-widest text-[#fffc00]">{g.title}</h3>
                    <ul className="mt-3 space-y-1.5">
                      {g.items.map((n) => (<li key={n} className="flex items-center gap-2 text-snow/90"><span className="h-1.5 w-1.5 rounded-full bg-[#fffc00]" aria-hidden />{n}</li>))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ARCADE */}
        <section id="arcade" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="10">Arcade</Eyebrow>
            <h2 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
              Three games. One <em className="font-serif font-normal text-glacier">break.</em>
            </h2>
            <div className="mt-12 rounded-[2rem] border border-line bg-night/85 p-6 md:p-12">
              <Arcade />
            </div>
          </div>
        </section>

        {/* CROSSED TAPES */}
        <Tapes
          proof={['Race-tested', 'Benchmarked', 'Shipped to production', 'Open to remote', 'Abbottabad → worldwide', 'Receipts in every repo']}
          stack={stack.flatMap((g) => g.items).slice(0, 18)}
        />

        {/* JOURNEY */}
        <section id="journey" className="px-5 py-28 md:px-10 md:py-40">
          <div className="relative isolate mx-auto grid max-w-7xl gap-14 md:grid-cols-[0.8fr_1.2fr]">
            <div className="md:sticky md:top-28 md:self-start">
              <Eyebrow n="11">The climb</Eyebrow>
              <h2 className="mt-6 text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>From freelance builds to AI engineering.</h2>
              <ul className="mt-10 space-y-4">
                {education.map((e) => (
                  <li key={e.school} className="rounded-2xl border border-line bg-ink/90 p-5" data-reveal>
                    <p className="font-mono text-[10px] uppercase tracking-widest text-glacier">{e.status}</p>
                    <p className="mt-2 text-lg text-snow">{e.degree}</p>
                    <p className="text-sm text-mist">{e.school}</p>
                  </li>
                ))}
              </ul>
            </div>
            <ol className="relative border-l border-line pl-8">
              {experience.map((x) => (
                <li key={x.org + x.role} className="relative pb-12 last:pb-0" data-reveal>
                  <span className="absolute -left-[37px] top-1.5 h-3 w-3 rounded-full border-2 border-glacier bg-night" aria-hidden />
                  <p className="font-mono text-[11px] uppercase tracking-widest text-mist">{[x.period, x.type, x.place].filter((v, i, a) => a.indexOf(v) === i).join(' · ')}</p>
                  <h3 className="mt-2 flex flex-wrap items-center gap-3 text-2xl font-medium tracking-tight">
                    <span aria-hidden className="text-4xl font-semibold leading-none text-transparent [-webkit-text-stroke:1px_var(--color-mist)]">{String(experience.indexOf(x) + 1).padStart(2, '0')}</span>
                    {x.role}
                    {/present/i.test(x.period) && <span className="rounded-sm bg-glacier px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-night">Now</span>}
                  </h3>
                  <p className="flex items-center gap-2 text-glacier">
                    {x.logo && <Image src={x.logo} alt="" width={24} height={24} className="h-6 w-6 rounded-md bg-snow object-contain p-0.5" />}
                    {x.org}
                  </p>
                  <ul className="mt-4 space-y-1.5 text-mist">
                    {x.points.map((pt) => (
                      <li key={pt} className="flex gap-3"><span className="mt-2.5 h-px w-3 shrink-0 bg-line" />{pt}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* STACK GRID */}
        <section id="stack" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="12">Toolbox</Eyebrow>
            <h2 className="mt-6 max-w-4xl text-4xl font-medium leading-[1.02] tracking-tight md:text-6xl" data-split>
              Built bottom to top, <em className="font-serif font-normal text-glacier">layer by layer.</em>
            </h2>
            <p className="mt-5 max-w-xl text-mist" data-reveal>Keep scrolling: each layer pins under the last until the whole stack sits at the top. Click a project to open its chapter.</p>
            <ul className="mt-8 flex flex-wrap items-center gap-3" aria-label="Core technologies">
              {techIcons.map((t) => (
                <li key={t.name} title={t.name} className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-panel/85 transition-transform duration-300 hover:-translate-y-1 hover:border-glacier">
                  <Image src={t.src} alt={t.name} width={32} height={32} className="h-8 w-8 object-contain transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-110" />
                </li>
              ))}
            </ul>
            <StackLayers groups={stack} />
          </div>
        </section>

        {/* CLIENTS */}
        <section id="clients" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto max-w-7xl">
            <Eyebrow n="13">Client builds</Eyebrow>
            <h2 className="mt-6 max-w-3xl text-4xl font-medium tracking-tight md:text-5xl" data-split>Live sites, real businesses.</h2>
            <div className="mt-10">
              <Carousel label="Client websites" autoplay={4500}>
                {clients.map((c) => (
                  <a key={c.name} href={c.url ?? '#contact'} target={c.url ? '_blank' : undefined} rel="noopener noreferrer" data-cursor="view" data-cursor-label={c.url ? 'Visit' : 'Ask'} draggable={false} className="group block overflow-hidden rounded-3xl border border-line bg-ink/90 transition-colors hover:border-glacier/40">
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#0c0e15]">
                      <Image src={c.image} alt={`${c.name} website mockup`} fill draggable={false} sizes="(min-width: 1024px) 42vw, (min-width: 640px) 60vw, 82vw" className="object-cover object-top transition-transform duration-[1.2s] ease-out group-hover:scale-105" />
                    </div>
                    <div className="flex items-end justify-between gap-4 p-5 md:p-6">
                      <div>
                        <p className="text-xl tracking-tight text-snow"><Roll>{c.name}</Roll></p>
                        <p className="mt-1 text-sm text-mist">{c.what}</p>
                        <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-mist">{c.tags.join(' · ')}</p>
                      </div>
                      <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-glacier">{c.url ? 'Live ↗' : 'Archive'}</span>
                    </div>
                  </a>
                ))}
              </Carousel>
            </div>

            <div className="mt-24">
              <p className="font-mono text-[11px] uppercase tracking-widest text-mist">What clients hire me for</p>
              <div className="mt-6">
                <Carousel label="Services" itemClass="w-[72%] sm:w-[44%] lg:w-[24%]" depth={false}>
                  {services.map((sv, i) => (
                    <article key={sv.title} className="group flex h-full flex-col rounded-3xl border border-line bg-ink/90 p-6 transition-colors hover:border-glacier/40">
                      <div className="flex items-center justify-between">
                        <Image src={sv.icon} alt="" width={56} height={56} draggable={false} className="h-14 w-14 object-contain transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110" />
                        <span className="font-mono text-[11px] text-glacier">{String(i + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="mt-6 text-xl font-medium tracking-tight">{sv.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-mist">{sv.body}</p>
                    </article>
                  ))}
                </Carousel>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ (AEO) */}
        <section id="faq" className="px-5 pb-28 md:px-10 md:pb-40">
          <div className="relative isolate mx-auto grid max-w-7xl gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Eyebrow n="14">Quick answers</Eyebrow>
              <h2 className="mt-6 text-4xl font-medium tracking-tight md:text-5xl" data-split>Questions recruiters ask me.</h2>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((f) => (
                <details key={f.q} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg text-snow">
                    <h3>{f.q}</h3>
                    <span className="font-mono text-glacier transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 max-w-2xl text-mist">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-5 pb-20 md:px-10">
          <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-line bg-night/90 p-6 md:p-14">
            <Image src="/img/abbottabad/miranjani-sunset.jpg" alt="" fill sizes="100vw" className="kenburns -z-10 object-cover opacity-35" />
            <div className="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/40" />
            <Eyebrow n="15">Summit</Eyebrow>
            <div className="mt-8 grid gap-12 md:grid-cols-2">
              <div>
                <h2 className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] md:text-7xl" data-split>
                  Let’s build something <em className="font-serif font-normal text-glacier">provable.</em>
                </h2>
                <a href={`mailto:${profile.email}`} className="sweep mt-8 inline-block break-all text-lg text-snow md:text-xl">{profile.email}</a>
                <p className="mt-3 text-mist">{profile.phone}</p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-mist">
                  {liveSocials.map((s) => (
                    <a key={s.label} className="sweep hover:text-snow" href={s.url} target="_blank" rel="noopener noreferrer me">{s.label}</a>
                  ))}
                  <a className="sweep hover:text-snow" href={profile.company.url} target="_blank" rel="noopener noreferrer">Primeura</a>
                </div>
              </div>
              <ContactForm email={profile.email} />
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 pb-10 md:px-10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-widest text-mist">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span>Built with Next.js · Three.js · GSAP</span>
          <a href="#top" className="sweep hover:text-snow">Back to top ↑</a>
        </div>
        <details className="mx-auto mt-6 max-w-7xl font-mono text-[10px] uppercase tracking-widest text-mist/70">
          <summary className="cursor-pointer list-none hover:text-snow">Photo credits — Abbottabad &amp; Galyat ↓</summary>
          <ul className="mt-4 grid gap-2 normal-case tracking-normal sm:grid-cols-2">
            {places.map((p) => (
              <li key={p.slug}>
                <a className="sweep hover:text-snow" href={sourceUrl(p)} target="_blank" rel="noopener noreferrer">{p.place} — {p.file.replace(/_/g, ' ')}</a> by {p.author}, <a className="sweep hover:text-snow" href={licenseUrl(p.license)} target="_blank" rel="noopener noreferrer license">{p.license}</a>
              </li>
            ))}
            <li>Via Wikimedia Commons. Resized; the two horizon photos are colour-graded inside the 3D scene.</li>
          </ul>
        </details>
      </footer>
    </>
  );
}
