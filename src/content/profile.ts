export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qasimrazamalik.site').replace(/\/$/, '');

export const profile = {
  name: 'Qasim Raza Malik',
  shortName: 'Qasim',
  role: 'AI & Backend Engineer',
  headline: 'AI & Backend Engineer · Full-Stack (React, TypeScript, Node.js) · MS AI @ COMSATS',
  tagline: 'I build software that proves itself — race-tested APIs, benchmarked AI, and interfaces people remember.',
  location: 'Abbottabad, Pakistan',
  timezone: 'UTC+5 · Remote worldwide',
  email: 'iamqasimrazamalik@gmail.com',
  github: 'https://github.com/qasimrazamalik-coder',
  githubUser: 'qasimrazamalik-coder',
  linkedin: 'https://www.linkedin.com/in/qasim-raza-malik/',
  company: { name: 'Primeura Digital Solutions', url: 'https://primeura.com' },
  agency: { name: 'Digital Experts', url: 'https://digitalexperts.dev' },
  availability: 'Open to remote roles and selected freelance builds',
} as const;

export const about = [
  'I’m an AI & backend engineer at Digital Experts, working across the MERN stack — React and TypeScript interfaces on Node.js, Express and database services — and the AI features that sit behind them.',
  'My public work has one habit: every claim comes with evidence. APIs ship with concurrency race tests, ML projects ship with leak-free splits and honest baselines, and games ship playable.',
  'I hold a BS in Computer Science from Abbottabad University of Science and Technology, I’m pursuing an MS in Artificial Intelligence at COMSATS, and I co-run Primeura Digital Solutions.',
] as const;

export type Experience = {
  org: string;
  role: string;
  type: string;
  period: string;
  place: string;
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
      'Backend and AI-focused functionality for client web applications.',
      'MERN stack: React + TypeScript interfaces connected to Node.js, Express and MongoDB services.',
      'REST API design and integration for application workflows.',
    ],
  },
  {
    org: 'Axelliant',
    role: 'Full Stack Developer',
    type: 'Internship',
    period: 'Oct 2025 — Jan 2026',
    place: 'On-site',
    points: [
      'Responsive interface components with React, JavaScript, Bootstrap, jQuery and Tailwind CSS.',
      'Integrated front-end components with application functionality in a team delivery setting.',
    ],
  },
  {
    org: 'Lytn',
    role: 'Frontend Developer',
    type: 'Freelance',
    period: 'Jan 2025 — Oct 2025',
    place: 'Remote',
    points: ['Delivered 30+ websites as a remote freelance frontend developer.', 'Reusable, responsive React interfaces built from client requirements.'],
  },
  {
    org: 'Arfa Kareem Technologies · PITB',
    role: 'Web Development Intern',
    type: 'Internship',
    period: 'Aug 2024 — Oct 2024',
    place: 'On-site',
    points: ['Web-development internship at the Punjab Information Technology Board.'],
  },
  {
    org: 'Google Developer Student Club AUST',
    role: 'Web Development Member',
    type: 'Community',
    period: 'Oct 2023 — Jun 2024',
    place: 'Havelian, Pakistan',
    points: ['Website building, WordPress and e-commerce initiatives with the student developer community.'],
  },
] as const;

export const education = [
  { school: 'COMSATS University Islamabad', degree: 'MS Artificial Intelligence', status: 'In progress' },
  { school: 'Abbottabad University of Science and Technology', degree: 'BS Computer Science', status: 'Completed' },
] as const;

export const stack = [
  { group: 'Languages', items: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'C#', 'Kotlin', 'Go', 'Rust', 'C++', 'PHP'] },
  { group: 'Frontend', items: ['React 19', 'Next.js', 'Tailwind CSS', 'Three.js', 'React Three Fiber', 'GSAP', 'Motion'] },
  { group: 'Backend', items: ['Node.js', 'Express 5', 'FastAPI', 'Django REST', 'PostgreSQL', 'MongoDB', 'Prisma', 'Drizzle', 'Redis'] },
  { group: 'AI / ML', items: ['PyTorch', 'Transformers', 'QLoRA', 'RAG', 'YOLO', 'CLIP + FAISS', 'XLM-R', 'MediaPipe'] },
  { group: 'Data', items: ['dbt', 'DuckDB', 'pandas', 'A/B testing', 'Forecasting', 'Semantic layers'] },
  { group: 'Ship', items: ['Docker', 'GitHub Actions', 'Vercel', 'Supabase', 'Expo', 'Capacitor'] },
] as const;

export const clients = [
  { name: 'Glamur Paints', what: 'Paint storefront and ordering', tags: ['React', 'MongoDB', 'Stripe'] },
  { name: 'Literary Publishers', what: 'Publishing platform for writers', tags: ['React', 'EmailJS'] },
  { name: 'United Ummah', what: 'Community knowledge and services hub', tags: ['React', 'TypeScript', 'Tailwind'] },
  { name: 'Kennett Kreamery', what: 'Ice-cream brand website', tags: ['Custom WordPress', 'PHP'] },
  { name: 'Pet Paw', what: 'Pet adoption website', tags: ['Custom WordPress', 'PHP'] },
  { name: 'Replica Copy Industries', what: 'Printing and signage company site', tags: ['WordPress', 'PHP'] },
] as const;

export const faqs = [
  {
    q: 'Who is Qasim Raza Malik?',
    a: 'Qasim Raza Malik is an AI & backend engineer from Abbottabad, Pakistan. He builds full-stack web applications with React, TypeScript and Node.js, applied AI and machine-learning systems in Python, and 3D browser games with Three.js. He works at Digital Experts and co-runs Primeura Digital Solutions.',
  },
  {
    q: 'What does Qasim Raza Malik specialise in?',
    a: 'Backend systems that stay correct under concurrent load (Node.js, Express, PostgreSQL), applied AI with honest evaluation (RAG, QLoRA fine-tuning, computer vision, Urdu NLP), and interactive front ends with React, Three.js and GSAP.',
  },
  {
    q: 'Is Qasim available for remote work or freelance projects?',
    a: 'Yes. He works remotely from Pakistan (UTC+5) and is open to remote roles and selected freelance builds. Contact: iamqasimrazamalik@gmail.com.',
  },
  {
    q: 'Where can I see his code?',
    a: 'All public projects are on GitHub at github.com/qasimrazamalik-coder, most under the MIT licence.',
  },
] as const;
