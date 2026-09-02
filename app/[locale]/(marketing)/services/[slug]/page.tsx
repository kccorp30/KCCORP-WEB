import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { GhostButton } from '@/components/ui/GhostButton';
import { MediaSurface } from '@/components/marketing/MediaSurface';
import { SERVICES, getServiceBySlug } from '@/lib/data/services';
import { PROJECTS } from '@/lib/data/projects';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { SERVICE_BY_SLUG_QUERY } from '@/lib/sanity/queries';
import { adaptSanityService, adaptSanityProject } from '@/lib/sanity/adapters';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { buildMetadata, SITE_URL } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { serviceJsonLd, breadcrumbJsonLd } from '@/lib/seo/json-ld';
import type { Metadata } from 'next';

export function generateStaticParams() {
  // Uses the fallback catalog for build-time static params — this is
  // safe even once Sanity has real content, as long as slugs match.
  // New slugs added only in Sanity render on-demand (dynamicParams
  // defaults to true), just not statically pre-built until next deploy.
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug, locale } = await params;
  const rawService = await fetchWithFallback<any>(SERVICE_BY_SLUG_QUERY, { slug }, null);
  const service = rawService ? adaptSanityService(rawService, locale) : getServiceBySlug(slug);
  if (!service) return {};

  return buildMetadata({
    title: rawService?.seo?.metaTitle || service.title,
    description: rawService?.seo?.metaDescription || service.description || service.spec,
    path: `/services/${slug}`,
    locale: locale as 'en' | 'es',
    image: service.imageUrl,
    noindex: rawService?.seo?.noIndex,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();

  const rawService = await fetchWithFallback<any>(SERVICE_BY_SLUG_QUERY, { slug }, null);
  const service = rawService ? adaptSanityService(rawService, locale) : getServiceBySlug(slug);
  if (!service) notFound();

  const relatedProjects = rawService?.relatedProjects?.length
    ? rawService.relatedProjects.map((p: any) => ({ ...adaptSanityProject(p, locale), index: '' }))
    : PROJECTS.filter((p) => p.services.includes(service.slug));

  return (
    <>
      <Nav />
      <PageViewTracker event={ANALYTICS_EVENTS.SERVICE_VIEWED} payload={{ slug: service.slug }} />
      <JsonLd data={serviceJsonLd({ name: service.title, description: service.description, url: `${SITE_URL}/services/${service.slug}` })} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', url: SITE_URL },
          { name: 'Services', url: `${SITE_URL}/services` },
          { name: service.title, url: `${SITE_URL}/services/${service.slug}` },
        ])}
      />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[52vh] flex items-end overflow-hidden">
        <MediaSurface
          imageUrl={service.imageUrl}
          videoUrl={service.videoUrl}
          videoPlaybackId={service.videoPlaybackId}
          alt={service.title}
          className="absolute inset-0"
          fallback={<div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${service.color}, #070E18)` }} />}
        />
        <div className="relative z-[2] w-full px-5 md:px-10 pb-10 md:pb-14 pt-28 max-w-wide mx-auto">
          <span className="font-mono text-[11px] text-gold tracking-[0.14em]">SERVICE / {service.num}</span>
          <h1 className="font-display font-bold uppercase text-4xl md:text-6xl mt-2.5 leading-tight tracking-tight max-w-2xl">
            {service.title}
          </h1>
          <p className="mt-2 text-[13px] text-cool-gray">{service.spec}</p>
        </div>
      </section>

      {/* Description */}
      <section className="py-14 md:py-20 px-5 md:px-10 max-w-wide mx-auto">
        <p className="text-base md:text-lg text-marine-white max-w-2xl leading-relaxed">{service.description}</p>
      </section>

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="py-11 md:py-20 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Proof of Work</span>
          <h2 className="font-display font-bold uppercase text-2xl md:text-4xl tracking-tight">Related Projects</h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedProjects.map((p: any) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <MediaSurface
                    imageUrl={p.imageUrl}
                    videoUrl={p.videoUrl}
                    videoPlaybackId={p.videoPlaybackId}
                    alt={p.title}
                    fallback={
                      <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                        <rect width="400" height="300" fill={p.color} />
                        <path d="M100 220 L300 220 L260 180 L140 180 Z" fill="#050A11" />
                      </svg>
                    }
                  />
                </div>
                <div className="pt-3">
                  {p.index && <div className="font-mono text-[9.5px] text-gold">{p.index}</div>}
                  <div className="font-display text-base font-semibold uppercase mt-1 group-hover:text-gold transition-colors">
                    {p.title}
                  </div>
                  <div className="text-[11.5px] text-cool-gray mt-0.5">{p.location}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section
        className="text-center py-16 px-5 border-t border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Ready When You Are</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Need {service.title.toLowerCase()} work done right?
        </h2>
        <div className="flex justify-center gap-3 mt-7 flex-wrap">
          <Button href="/request-service">Request Service</Button>
          <GhostButton href="/services" tone="white">
            View All Services
          </GhostButton>
        </div>
      </section>

      <Footer />
    </>
  );
}
