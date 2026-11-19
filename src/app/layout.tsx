import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SITE_URL, profile } from '@/content/profile';

const description =
  'Qasim Raza Malik — AI & backend engineer and co-founder of Primeura. RAG chatbots, AI agents, MCP servers and computer vision; race-tested Node.js APIs; React, Next.js, HTML and WordPress websites.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${profile.name} — ${profile.role}`, template: `%s · ${profile.name}` },
  description,
  applicationName: `${profile.name} Portfolio`,
  authors: [{ name: profile.name, url: SITE_URL }],
  creator: profile.name,
  keywords: [
    'Qasim Raza Malik', 'AI engineer Pakistan', 'backend engineer', 'full-stack developer', 'React developer', 'TypeScript',
    'Node.js', 'PostgreSQL', 'Three.js portfolio', 'machine learning engineer', 'RAG chatbot developer', 'AI agents', 'MCP server',
    'computer vision', 'WordPress developer Pakistan', 'HTML developer', 'Primeura Digital Solutions', 'Snapchat Lens creator', 'Abbottabad', 'remote developer',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    url: SITE_URL,
    siteName: profile.name,
    title: `${profile.name} — ${profile.role}`,
    description,
    locale: 'en_US',
    firstName: 'Qasim',
    lastName: 'Raza Malik',
  },
  twitter: { card: 'summary_large_image', title: `${profile.name} — ${profile.role}`, description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#06070b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-glacier focus:px-4 focus:py-2 focus:text-night">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}
