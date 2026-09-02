import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { PortableText } from '@portabletext/react';
import { Link } from '@/i18n/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { INSIGHTS, getInsightBySlug } from '@/lib/data/insights';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { INSIGHT_BY_SLUG_QUERY } from '@/lib/sanity/queries';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { articleJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return INSIGHTS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const raw = await fetchWithFallback<any>(INSIGHT_BY_SLUG_QUERY, { slug }, null);
  const fallback = getInsightBySlug(slug);
  if (!raw && !fallback) return {};

  const title = raw ? pickLocale(raw.title, locale) : fallback!.title;
  const description = raw ? pickLocale(raw.excerpt, locale) : fallback!.excerpt;

  return buildMetadata({
    title: raw?.seo?.metaTitle || title,
    description: raw?.seo?.metaDescription || description,
    path: `/insights/${slug}`,
    locale: locale as 'en' | 'es',
    noindex: raw?.seo?.noIndex,
  });
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();

  const raw = await fetchWithFallback<any>(INSIGHT_BY_SLUG_QUERY, { slug }, null);
  const fallback = getInsightBySlug(slug);
  if (!raw && !fallback) notFound();

  const title = raw ? pickLocale(raw.title, locale) : fallback!.title;
  const category = raw ? raw.category : fallback!.category;
  const readingTime = raw?.readingTime ? `${raw.readingTime} min read` : fallback?.readingTime;
  const body = raw ? (locale === 'es' ? raw.body?.es : raw.body?.en) : null;

  return (
    <>
      <Nav />
      <PageViewTracker event={ANALYTICS_EVENTS.INSIGHT_VIEWED} payload={{ slug }} />
      <JsonLd
        data={articleJsonLd({
          headline: title,
          description: raw ? pickLocale(raw.excerpt, locale) : fallback?.excerpt || '',
          url: `${SITE_URL}/insights/${slug}`,
          datePublished: raw?.publishDate,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: SITE_URL },
          { name: 'Insights', url: `${SITE_URL}/insights` },
          { name: title, url: `${SITE_URL}/insights/${slug}` },
        ])}
      />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 px-5 md:px-10 max-w-2xl mx-auto">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">{category}</span>
        {readingTime && <span className="font-mono text-[10px] text-cool-gray ml-3">&middot; {readingTime}</span>}
        <h1 className="font-display font-bold uppercase text-3xl md:text-5xl tracking-tight mt-3 leading-tight">{title}</h1>
      </section>

      <section className="px-5 md:px-10 max-w-2xl mx-auto pb-16 prose prose-invert prose-p:text-marine-white prose-headings:font-display prose-headings:uppercase">
        {body ? (
          <PortableText value={body} />
        ) : (
          <p className="text-sm text-cool-gray leading-relaxed">{fallback?.body}</p>
        )}
      </section>

      <section className="text-center py-16 px-5 border-t border-white/[0.08]" style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Need Help With This?</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Request Service.
        </h2>
        <div className="flex justify-center gap-3 mt-7 flex-wrap">
          <Button href="/request-service">Request Service</Button>
          <Link href="/insights" className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-cool-gray self-center">
            ← All Insights
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
