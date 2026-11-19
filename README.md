# Qasim Raza Malik — Portfolio

**Proof, not promises.** Personal portfolio of Qasim Raza Malik, an AI & backend engineer. A procedural 3D mountain "lab" that the camera flies through as you scroll, with every project shown alongside its proof: the test, benchmark or measurement behind it.

## Stack

- **Next.js 16** (App Router, static pre-rendering with 6-hour ISR) + **React 19** + **TypeScript**
- **Tailwind CSS 4**
- **Three.js / React Three Fiber**: procedural ridged-noise terrain, custom GLSL contour shader, twinkling stars, snow, a pulsing beacon
- **GSAP** (ScrollTrigger, SplitText) + **Lenis** smooth scroll + **Motion** for layout animation
- Interactions: custom cursor, magnetic buttons, text-roll hovers, spotlight/tilt cards, a ⌘K command palette and a filterable project explorer

## SEO / AEO

- Full Metadata API: canonical URL, Open Graph, Twitter cards, robots
- JSON-LD graph: `Person`, `WebSite`, `ProfilePage`, `ItemList` of `SoftwareSourceCode`, `FAQPage`
- `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, a dynamic Open Graph image
- `/llms.txt`: a plain-text profile for AI answer engines

## Content

- `src/content/profile.ts`: identity, experience, education, stack, clients, FAQ
- `src/content/projects.ts`: curated projects in six tracks, each with a proof line
- The **Live from GitHub** section pulls public repositories from the GitHub API, so new work appears automatically

## Run locally

```bash
cp .env.example .env.local
npm install
npm run dev
```

## Environment variables

| Name | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical domain, e.g. `https://qasimrazamalik.site` |
| `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM` | Contact-form delivery via Resend. Without them, the form opens the visitor's email app. |
| `GITHUB_TOKEN` | Optional; raises the GitHub API rate limit |

## Deploy

Push to GitHub and import the repository in Vercel. No build settings are needed.

MIT © Qasim Raza Malik
