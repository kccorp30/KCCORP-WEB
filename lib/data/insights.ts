// TEMPORARY DATA SOURCE — same pattern as services.ts/projects.ts.
// These are the same 3 examples already referenced on the Homepage
// since Sprint 1 — now they have real pages behind them.

export interface Insight {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  readingTime: string;
  body: string; // plain paragraph fallback — real content uses Sanity Portable Text
  imageColor: string;
}

export const INSIGHTS: Insight[] = [
  {
    slug: 'marine-breaker-tripping',
    category: 'Electrical',
    title: 'Why does your marine breaker keep tripping?',
    excerpt: 'Understanding the most common causes of repeated breaker trips — and when it signals a deeper electrical issue.',
    readingTime: '4 min read',
    body: '[Full article content pending — see content-placeholder-map.md. This article will explain common causes of marine breaker trips and when they signal a deeper issue.]',
    imageColor: '#12233A',
  },
  {
    slug: 'battery-failure-signs',
    category: 'Maintenance',
    title: '5 warning signs of battery failure',
    excerpt: 'Catch degrading marine batteries before they leave you stranded — the early indicators most owners miss.',
    readingTime: '3 min read',
    body: '[Full article content pending — see content-placeholder-map.md.]',
    imageColor: '#0F1E30',
  },
  {
    slug: 'nmea2000-explained',
    category: 'Navigation',
    title: 'NMEA2000 explained',
    excerpt: 'A practical breakdown of the marine networking standard behind modern navigation and instrument systems.',
    readingTime: '6 min read',
    body: '[Full article content pending — see content-placeholder-map.md.]',
    imageColor: '#1C2C40',
  },
];

export function getInsightBySlug(slug: string) {
  return INSIGHTS.find((i) => i.slug === slug);
}
