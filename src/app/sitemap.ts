import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/content/profile';
import { projects } from '@/content/projects';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: p.featured ? 0.8 : 0.6 })),
  ];
}
