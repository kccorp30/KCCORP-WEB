import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';
import { routing } from '@/i18n/routing';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { ALL_SERVICES_QUERY, ALL_PROJECTS_QUERY, ALL_INSIGHTS_QUERY, ALL_LOCATIONS_QUERY } from '@/lib/sanity/queries';
import { SERVICES } from '@/lib/data/services';
import { PROJECTS } from '@/lib/data/projects';
import { INSIGHTS } from '@/lib/data/insights';
import { LOCATIONS } from '@/lib/data/locations';

const STATIC_PATHS = [
  '',
  '/services',
  '/projects',
  '/technology',
  '/technology/marine-cloud',
  '/technology/luz',
  '/about',
  '/locations',
  '/insights',
  '/contact',
  '/request-service',
];

function entry(path: string, priority = 0.7): MetadataRoute.Sitemap[number][] {
  return routing.locales.map((locale) => ({
    url: locale === 'en' ? `${SITE_URL}${path}` : `${SITE_URL}/${locale}${path}`,
    priority,
    alternates: {
      languages: Object.fromEntries(routing.locales.map((l) => [l, l === 'en' ? `${SITE_URL}${path}` : `${SITE_URL}/${l}${path}`])),
    },
  }));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Same fallback pattern as every page — if Sanity is unreachable or
  // empty, the sitemap still reflects the temporary catalog slugs
  // rather than omitting those URLs entirely.
  const [services, projects, insights, locations] = await Promise.all([
    fetchWithFallback<any>(ALL_SERVICES_QUERY, {}, null),
    fetchWithFallback<any>(ALL_PROJECTS_QUERY, {}, null),
    fetchWithFallback<any>(ALL_INSIGHTS_QUERY, {}, null),
    fetchWithFallback<any>(ALL_LOCATIONS_QUERY, {}, null),
  ]);

  const serviceSlugs = (services ?? SERVICES).map((s: any) => s.slug);
  const projectSlugs = (projects ?? PROJECTS).map((p: any) => p.slug);
  const insightSlugs = (insights ?? INSIGHTS).map((i: any) => i.slug);
  const locationSlugs = (locations ?? LOCATIONS).map((l: any) => l.slug);

  return [
    ...STATIC_PATHS.flatMap((p) => entry(p, p === '' ? 1.0 : 0.8)),
    ...serviceSlugs.flatMap((slug: string) => entry(`/services/${slug}`)),
    ...projectSlugs.flatMap((slug: string) => entry(`/projects/${slug}`)),
    ...insightSlugs.flatMap((slug: string) => entry(`/insights/${slug}`, 0.6)),
    ...locationSlugs.flatMap((slug: string) => entry(`/locations/${slug}`)),
  ];
}
