import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/site';
import { GROUPS, PAGES, groupEncodedPath, pageEncodedPath } from '../lib/compose';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/area/`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    ...[...GROUPS.keys()].map((g) => ({ url: `${SITE_URL}${groupEncodedPath(g)}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 })),
    ...PAGES.map((p) => ({ url: `${SITE_URL}${pageEncodedPath(p)}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ];
}
