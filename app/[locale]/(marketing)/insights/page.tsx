import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { InsightCard } from '@/components/marketing/InsightCard';
import { INSIGHTS as INSIGHTS_FALLBACK } from '@/lib/data/insights';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { ALL_INSIGHTS_QUERY } from '@/lib/sanity/queries';
import { resolveMedia } from '@/lib/sanity/adapters';

export default async function InsightsPage() {
  const locale = await getLocale();
  const raw = await fetchWithFallback<any>(ALL_INSIGHTS_QUERY, {}, null);

  const insights = raw
    ? raw.map((i: any) => ({
        slug: i.slug,
        category: i.category,
        title: pickLocale(i.title, locale),
        excerpt: pickLocale(i.excerpt, locale),
        readingTime: i.readingTime ? `${i.readingTime} min read` : '',
        imageColor: '#12233A',
        ...resolveMedia(i.heroImage),
      }))
    : INSIGHTS_FALLBACK;

  return (
    <>
      <Nav />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 md:pb-16 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">Marine Insights</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Field Notes &amp; Technical Guides.
        </h1>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-px md:bg-white/[0.08]">
          {insights.map((i: any) => (
            <InsightCard
              key={i.slug}
              category={i.category}
              readTime={i.readingTime}
              title={i.title}
              excerpt={i.excerpt}
              href={`/insights/${i.slug}`}
              imageColor={i.imageColor}
            />
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
