// Switch to https://qasimrazamalik.site (env NEXT_PUBLIC_SITE_URL on Vercel) once the domain's DNS points here.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qasimrazamalik-portfolio.vercel.app').replace(/\/$/, '');

export const profile = {
  name: 'Qasim Raza Malik',
  shortName: 'Qasim',
  role: 'AI & Backend Engineer',
  headline: 'Software Engineer · Full-Stack, AI, Backend & Data · MS AI @ COMSATS',
  tagline: 'I build software that proves itself — race-tested APIs, benchmarked AI, and interfaces people remember.',
  location: 'Abbottabad, Pakistan',
  timezone: 'UTC+5 · Remote worldwide',
  email: 'iamqasimrazamalik@gmail.com',
  phone: '+92 313 6769286',
  photo: '/img/qasim.jpg',
  github: 'https://github.com/qasimrazamalik-coder',
  githubUser: 'qasimrazamalik-coder',
  linkedin: 'https://www.linkedin.com/in/qasim-raza-malik/',
  company: { name: 'Primeura Digital Solutions', url: 'https://primeura.com' },
  agency: { name: 'Digital Experts', url: 'https://digitalexperts.dev' },
  availability: 'Open to remote roles and selected freelance builds',
} as const;

/** Social profiles — fill in a URL to show it on the site; empty ones stay hidden. */
export const socials: { label: string; url: string }[] = [
  { label: 'GitHub', url: 'https://github.com/qasimrazamalik-coder' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/qasim-raza-malik/' },
  { label: 'Instagram', url: '' },
  { label: 'Facebook', url: '' },
  { label: 'Snapchat', url: '' },
];

export const roles = ['AI & Backend Engineer', 'Full-Stack Developer', 'HTML & WordPress Developer', 'Data Analyst', 'Game & Lens Creator'] as const;

export const about = [
  'I’m a software engineer spanning API-backed web products, AI-enabled applications and data analysis. I build React and TypeScript interfaces on Node.js and Python services, and I’ve delivered 30+ live business and e-commerce websites — custom code, HTML and WordPress.',
  'My public work has one habit: every claim comes with evidence. APIs ship with concurrency race tests, ML projects ship with leak-free splits and honest baselines, and games ship playable.',
  'I hold a BS in Computer Science from Abbottabad University of Science and Technology, I’m pursuing an MS in Artificial Intelligence at COMSATS, and I co-founded Primeura Digital Solutions.',
] as const;

export type Experience = {
  org: string;
  role: string;
  type: string;
  period: string;
  place: string;
  logo?: string;
  points: readonly string[];
};

export const experience: readonly Experience[] = [
  {
    org: 'Digital Experts Dev',
    role: 'AI & Backend Developer',
    type: 'Full-time',
    period: 'May 2026 — Present',
    place: 'Remote',
    points: [
      'Implement Node.js/Express and Python service components for AI-enabled web applications — REST endpoints, validation, MongoDB persistence and external integrations.',
      'Debug asynchronous request and error paths; Docker and Linux workflows keep backend changes reproducible.',
    ],
  },
  {
    org: 'Bamudda',
    role: 'Data Analyst / Data Scientist',
    type: 'Remote',
    period: 'May 2025 — Apr 2026',
    place: 'Remote',
    points: [
      'Prepared and analysed structured business data with Python and SQL; organised forecasting outputs for reporting.',
      'Built visualisations and business-facing dashboards to communicate trends and model results.',
    ],
  },
  {
    org: 'Scopic',
    role: 'Full-Stack & AI Developer',
    type: 'Remote',
    period: 'Apr 2024 — Mar 2025',
    place: 'Remote',
    points: [
      'React/TypeScript interfaces and API-connected features across Node.js/Express, Python and MongoDB.',
      'Resolved frontend/backend integration issues; supported AI-enabled features and deployment-ready changes.',
    ],
  },
  {
    org: 'Lytn (Lytnetwork)',
    role: 'Frontend Developer',
    type: 'Freelance',
    period: 'Feb 2023 — Jan 2024',
    place: 'Remote',
    logo: '/img/logos/lytnetwork.png',
    points: [
      'Delivered 30+ live business and e-commerce websites — responsive build, deployment, client revisions and production updates.',
      'Mobile-first interfaces with JavaScript, Tailwind CSS, Bootstrap, HTML and WordPress.',
    ],
  },
  {
    org: 'Axelliant',
    role: 'Full Stack Developer Intern',
    type: 'Internship',
    period: 'Internship',
    place: 'On-site',
    logo: '/img/logos/axeliant.png',
    points: [
      'Reusable React/TypeScript components; REST APIs with explicit loading and error states.',
      'API testing with Postman, Git/GitHub review and Agile delivery.',
    ],
  },
  {
    org: 'Arfa Kareem Technologies · PITB',
    role: 'Web Development Intern',
    type: 'Internship',
    period: 'Internship',
    place: 'On-site',
    logo: '/img/logos/arfa.png',
    points: ['Responsive web pages deployed within a structured, team-based development programme.'],
  },
] as const;

export const education = [
  { school: 'COMSATS Institute of Information Technology', degree: 'MS Artificial Intelligence', status: 'Mar 2026 — Mar 2028 (expected)' },
  { school: 'Abbottabad University of Science and Technology', degree: 'BS Computer Science', status: 'Aug 2021 — Aug 2025' },
] as const;

export const stack = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML', 'CSS', 'PHP', 'C#', 'Kotlin', 'Go', 'Rust', 'C++'] },
  { group: 'Frontend', items: ['React 19', 'Next.js', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'GSAP', 'Motion', 'Redux'] },
  { group: 'Backend', items: ['Node.js', 'Express 5', 'FastAPI', 'Django REST', 'PostgreSQL', 'MongoDB', 'Prisma', 'Drizzle', 'Redis', 'Supabase'] },
  { group: 'CMS & Web', items: ['WordPress', 'Elementor', 'WooCommerce', 'Shopify', 'HTML/CSS sites', 'cPanel', 'Figma'] },
  { group: 'AI / ML', items: ['PyTorch', 'Transformers', 'QLoRA', 'RAG', 'YOLO', 'CLIP + FAISS', 'XLM-R', 'MediaPipe', 'MCP'] },
  { group: 'Data & Ship', items: ['dbt', 'DuckDB', 'pandas', 'Forecasting', 'Docker', 'Linux', 'GitHub Actions', 'Vercel', 'Postman'] },
] as const;

export const techIcons = [
  { name: 'HTML', src: '/img/tech/html.png' },
  { name: 'CSS', src: '/img/tech/css.png' },
  { name: 'Tailwind', src: '/img/tech/tailwind.png' },
  { name: 'Node.js', src: '/img/tech/nodejs.png' },
  { name: 'MongoDB', src: '/img/tech/mongodb.png' },
  { name: 'Redux', src: '/img/tech/redux.png' },
  { name: 'Figma', src: '/img/tech/figma.png' },
] as const;

export const aiTools = ['Claude', 'Claude Code', 'Codex', 'ChatGPT', 'Gemini', 'Grok', 'DeepSeek', 'Meta AI', 'n8n', 'MCP servers'] as const;

export const capabilities = [
  {
    id: 'mcp',
    title: 'MCP servers',
    body: 'I build Model Context Protocol servers that give AI assistants safe, typed access to real systems — files, databases, browsers and business tools. DriveMind ships its own MCP server so Claude can organise a Windows drive with Yes/Ask/No control.',
  },
  {
    id: 'agents',
    title: 'AI agents',
    body: 'Multi-agent systems with an orchestrator, specialist workers, durable state and human-approval gates — plus n8n automations that score jobs, draft emails and move data between apps without manual work.',
  },
  {
    id: 'llms',
    title: 'LLM applications',
    body: 'LLM-backed products measured, not guessed: QLoRA fine-tuning for text-to-SQL, governed semantic layers that cut confident wrong answers, and cost tables for every model choice.',
  },
  {
    id: 'cv',
    title: 'Computer vision',
    body: 'YOLO detectors with mAP evaluation, Grad-CAM explanations for medical imaging, CLIP + FAISS image search, MediaPipe hand tracking and privacy-preserving face anonymisation.',
  },
  {
    id: 'rag',
    title: 'RAG chatbots',
    body: 'Retrieval-augmented chatbots that answer from your documents with citations — ingestion, chunking, embeddings, vector search and guardrails so the bot only talks about what it knows. The assistant on this site is one, running locally in your browser.',
  },
  {
    id: 'web',
    title: 'Websites that sell',
    body: 'Custom React and Next.js builds, fast HTML sites and WordPress / WooCommerce / Shopify stores — with SEO, AEO and performance treated as features, not afterthoughts.',
  },
] as const;

export type Venture = {
  name: string;
  role: string;
  summary: string;
  points: string[];
  stack: string[];
  url?: string;
  image?: string;
  accent: string;
};

export const ventures: Venture[] = [
  {
    name: 'Primeura Digital Solutions',
    role: 'Co-founder · Operations & Delivery',
    summary: 'A Dubai-facing, remote-first digital agency I co-founded. Primeura builds websites, e-commerce stores, SEO and AI automation for UAE businesses, delivered by a lean project-based team.',
    points: ['WordPress, custom sites, WooCommerce & Shopify', 'SEO, lead generation and AI/business automation', 'I run operations, hiring, delivery, QA and client success'],
    stack: ['React', 'Next.js', 'WordPress', 'AI automation'],
    url: 'https://primeura.com',
    image: '/img/shots/primeura.jpg',
    accent: '#7cf3d6',
  },
  {
    name: 'Badee Meals',
    role: 'Client rebuild · Full-stack',
    summary: 'Rebuilding badeemeals.com — a Karachi tiffin and meal service — from WordPress into a fast React/Next.js app with a WordPress-level CMS admin, so the owner can change menus, prices and pages himself.',
    points: ['Next.js, TypeScript and Tailwind front end', 'Full CMS/CRM admin and installable web app', 'Light GSAP and Three.js motion on top of a 1:1 clone'],
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'CMS'],
    accent: '#ffb454',
  },
  {
    name: 'FileKit',
    role: 'Founder · Product',
    summary: 'My own premium file-tools platform: convert, compress and preview files in the browser. It also powers my website delivery workflow, where I preview client HTML builds before deployment.',
    points: ['Browser-first file tools', 'Live HTML preview for client sites', 'Built as a premium, brandable platform'],
    stack: ['TypeScript', 'Next.js', 'Web APIs'],
    accent: '#9d8cff',
  },
  {
    name: 'Resin Artistry',
    role: 'E-commerce & custom orders',
    summary: 'A resin-art e-commerce store with a custom-order management system — product catalogue, cart and checkout, plus a workflow for made-to-order pieces, with AI features layered on top.',
    points: ['Next.js + Supabase', 'Custom order pipeline and admin', 'AI/ML-assisted recommendations'],
    stack: ['Next.js', 'Supabase', 'AI/ML'],
    accent: '#ff7ab6',
  },
];

export type Client = { name: string; what: string; tags: string[]; url?: string; image: string; live?: string };

export const clients: Client[] = [
  { name: 'Glamur Paints', what: 'Paint storefront with product explorer and ordering', tags: ['React', 'MongoDB', 'Stripe'], url: 'https://www.glamurpaints.com/', image: '/img/shots/glamur-mock.jpg', live: '/img/shots/glamur.jpg' },
  { name: 'Kennett Kreamery', what: 'Playful ice-cream brand site with bulk ordering', tags: ['Custom WordPress', 'PHP'], image: '/img/shots/kennett-mock.jpg' },
  { name: 'Literary Publishers', what: 'Publishing platform that turns manuscripts into books', tags: ['React', 'EmailJS'], url: 'https://literarypublisher.com/', image: '/img/shots/literary-mock.jpg' },
  { name: 'Pet Paw', what: 'Pet shop and adoption website', tags: ['Custom WordPress', 'PHP'], image: '/img/shots/petpaw-mock.jpg' },
  { name: 'United Ummah', what: 'Community hub for programmes, events and donations', tags: ['React', 'TypeScript', 'Tailwind'], image: '/img/shots/ummah-mock.jpg' },
  { name: 'Replica Copy Industries', what: 'Printing, signage and branding company', tags: ['WordPress', 'PHP'], url: 'https://replicacopyindustries.com/', image: '/img/shots/replica-mock.jpg', live: '/img/shots/replica.jpg' },
  { name: 'Digital Experts', what: 'Agency website — multi-page Next.js', tags: ['Next.js', 'Tailwind'], url: 'https://digitalexperts.dev', image: '/img/shots/digitalexperts.jpg' },
];

export const services = [
  { title: 'Web Development', body: 'React, Next.js, HTML and WordPress sites that load fast and convert.', icon: '/img/services/web.png' },
  { title: 'Mobile Apps', body: 'Expo / React Native and Kotlin apps for Android and iOS.', icon: '/img/services/mobile.png' },
  { title: 'Backend & AI', body: 'APIs, RAG chatbots, AI agents and MCP servers that stay correct under load.', icon: '/img/services/backend.png' },
  { title: 'Content & Lenses', body: 'Snapchat Lenses, motion graphics and browser games people share.', icon: '/img/services/creator.png' },
];

export const lenses = {
  intro: 'I build Snapchat Lenses and Web Lens games in Lens Studio — lightweight, viral, made for every country and age.',
  groups: [
    { title: 'Web Lens games', items: ['Neon Strike', 'Shatter Shot', 'Pulp Rush'] },
    { title: 'Arcade Lens games', items: ['Sky Stack', 'Dagger Rush', 'Prism Hop', 'Quick Draw', 'Cloud Hopper'] },
    { title: 'Bitmoji Lens+ games', items: ['Header Hero', 'Fling Me', "Don't Bonk Me", 'Sumo Smash', 'Copy Me'] },
    { title: 'Camera lenses', items: ['Premium colour grading', 'Beauty & glow effects', 'Date / time stamp lenses'] },
  ],
};

export const faqs = [
  {
    q: 'Who is Qasim Raza Malik?',
    a: 'Qasim Raza Malik is a software engineer from Abbottabad, Pakistan working across full-stack, AI, backend and data. He is an AI & backend developer at Digital Experts, co-founder of Primeura Digital Solutions, and an MS Artificial Intelligence student at COMSATS.',
  },
  {
    q: 'What does Qasim Raza Malik specialise in?',
    a: 'Backend systems that stay correct under concurrent load (Node.js, Express, PostgreSQL), applied AI — RAG chatbots, AI agents, MCP servers, LLM fine-tuning and computer vision — and websites in React, Next.js, HTML and WordPress.',
  },
  {
    q: 'Can Qasim build a RAG chatbot or AI agent for my business?',
    a: 'Yes. He builds retrieval-augmented chatbots that answer from your own documents with citations and guardrails, AI agents and n8n automations, and MCP servers that connect AI assistants to your tools.',
  },
  {
    q: 'Does he build WordPress and HTML websites?',
    a: 'Yes. He has delivered 30+ live business and e-commerce websites, including WordPress, WooCommerce, Shopify and hand-coded HTML/CSS sites.',
  },
  {
    q: 'Is Qasim available for remote work or freelance projects?',
    a: 'Yes. He works remotely from Pakistan (UTC+5) and is open to remote roles and selected freelance builds. Email: iamqasimrazamalik@gmail.com.',
  },
] as const;
