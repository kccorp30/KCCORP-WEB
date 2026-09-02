import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MediaSurface } from '@/components/marketing/MediaSurface';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { LANDING_PAGE_BY_PATH_QUERY } from '@/lib/sanity/queries';
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd } from '@/lib/seo/json-ld';
import type { Metadata } from 'next';

// Catch-all — matches ONLY paths that don't hit a more specific route
// (Next.js always prefers a static/named segment like /services or
// /about over a catch-all sibling). No local fallback catalog here:
// unlike services/projects/insights, campaign landing pages have no
// pre-Sanity content — if Sanity has nothing at this path, a 404 is
// the CORRECT behavior, not a gap to paper over.

async function getLandingPage(path: string) {
  return fetchWithFallback<any>(LANDING_PAGE_BY_PATH_QUERY, { path }, null);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ campaignPath: string[]; locale: string }>;
}): Promise<Metadata> {
  const { campaignPath, locale } = await params;
  const path = campaignPath.join('/');
  const page = await getLandingPage(path);
  if (!page) return {};

  return buildMetadata({
    title: page.seo?.metaTitle || pickLocale(page.headline, locale),
    description: page.seo?.metaDescription || pickLocale(page.subheadline, locale),
    path: `/${path}`,
    locale: locale as 'en' | 'es',
    noindex: page.noIndex ?? true,
  });
}

export default async function CampaignLandingPage({
  params,
}: {
  params: Promise<{ campaignPath: string[]; locale: string }>;
}) {
  const { campaignPath, locale } = await params;
  const path = campaignPath.join('/');
  const page = await getLandingPage(path);
  if (!page) notFound();

  const headline = pickLocale(page.headline, locale);
  const subheadline = pickLocale(page.subheadline, locale);
  const ctaText = pickLocale(page.ctaText, locale) || 'Request Service';

  return (
    <>
      <Nav />
      <PageViewTracker event={ANALYTICS_EVENTS.CAMPAIGN_LANDING_VIEWED} payload={{ path, campaign: page.campaignTracking?.campaign }} />
      <JsonLd data={breadcrumbJsonLd([{ name: 'Home', url: SITE_URL }, { name: headline, url: `${SITE_URL}/${path}` }])} />

      {/* Hero — mismo lenguaje visual que el resto del sitio, no un
          template de anuncio genérico */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[70vh] flex items-end overflow-hidden">
        <MediaSurface
          imageUrl={undefined}
          alt={headline}
          className="absolute inset-0"
          fallback={
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(700px 500px at 20% 0%, rgba(201,162,75,0.16), transparent 60%), linear-gradient(160deg, #0A0E1C 0%, #0D1830 45%, #0A0F1E 100%)',
              }}
            />
          }
        />
        <div className="relative z-[2] w-full px-5 md:px-10 pb-10 md:pb-14 pt-28 max-w-wide mx-auto">
          {page.location && (
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
              {page.location.primaryCity || page.location.country}
            </span>
          )}
          <h1 className="font-display font-bold uppercase text-4xl md:text-6xl mt-2.5 leading-tight tracking-tight max-w-2xl">
            {headline}
          </h1>
          {subheadline && <p className="mt-4 text-sm md:text-base text-cool-gray max-w-lg leading-relaxed">{subheadline}</p>}
          <div className="mt-8">
            <Button href="/request-service">{ctaText}</Button>
          </div>
        </div>
      </section>

      {/* Proof project */}
      {page.proofProject && (
        <section className="py-14 md:py-20 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">Proof of Work</span>
          <h2 className="font-display font-bold uppercase text-2xl md:text-4xl tracking-tight">
            {pickLocale(page.proofProject.title, locale) || page.proofProject.title}
          </h2>
          {page.proofProject.solution && (
            <p className="mt-4 text-sm text-cool-gray max-w-2xl leading-relaxed">{pickLocale(page.proofProject.solution, locale)}</p>
          )}
        </section>
      )}

      {/* Testimonial */}
      {page.testimonial && (
        <section className="py-11 md:py-16 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
          <div className="max-w-md border-l-2 border-gold pl-5">
            <p className="font-display text-lg font-medium leading-snug">&ldquo;{page.testimonial.quote}&rdquo;</p>
            <span className="block mt-3 font-mono text-[10.5px] uppercase tracking-[0.06em] text-cool-gray">
              {page.testimonial.customerName} {page.testimonial.location && `— ${page.testimonial.location}`}
            </span>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section
        className="text-center py-16 px-5 border-t border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}
      >
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          {headline}
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/request-service">{ctaText}</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
