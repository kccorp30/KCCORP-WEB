import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { GhostButton } from '@/components/ui/GhostButton';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';
import { StatusChip } from '@/components/marketing/StatusChip';
import { ServiceModules } from '@/components/marketing/ServiceModules';
import { ProjectPreview } from '@/components/marketing/ProjectPreview';
import { BeforeAfterSlider } from '@/components/marketing/BeforeAfterSlider';
import { TechnologyPreview } from '@/components/marketing/TechnologyPreview';
import { PresenceMap } from '@/components/marketing/PresenceMap';
import { InsightCard } from '@/components/marketing/InsightCard';
import { MediaSurface } from '@/components/marketing/MediaSurface';
import { HeroMedia } from '@/components/marketing/HeroMedia';
import { TestimonialSection } from '@/components/marketing/TestimonialSection';
import { PartnersSection } from '@/components/marketing/PartnersSection';
import { PROJECTS } from '@/lib/data/projects';
import { INSIGHTS } from '@/lib/data/insights';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { HOMEPAGE_QUERY } from '@/lib/sanity/queries';
import { buildMetadata } from '@/lib/seo/metadata';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationJsonLd, professionalServiceJsonLd } from '@/lib/seo/json-ld';
import { contactConfig } from '@/lib/config/contact';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'KCCORP — Marine Electrical, Electronics & Diagnostics',
    description:
      'Marine service, engineered. KCC Marine Solutions delivers marine electrical, electronics, and diagnostics work across the USA, Dominican Republic, Panama, and Colombia.',
    path: '/',
    locale: locale as 'en' | 'es',
  });
}
import { adaptSanityProject, resolveMedia } from '@/lib/sanity/adapters';

export default async function HomePage() {
  const locale = await getLocale();
  const home = await fetchWithFallback<any>(HOMEPAGE_QUERY, {}, null);

  // Featured project: CMS reference if configured, else PROJECTS[0] fallback.
  const featured = home?.featuredProject ? adaptSanityProject(home.featuredProject, locale) : PROJECTS[0];
  const heroMedia = resolveMedia(home?.heroMedia);
  const heroEyebrow = home ? pickLocale(home.heroEyebrow, locale) : '';
  const heroHeadline = home ? pickLocale(home.heroHeadline, locale) : '';
  const heroSubcopy = home ? pickLocale(home.heroSubcopy, locale) : '';
  const marineCloudCopy = home ? pickLocale(home.marineCloudCopy, locale) : '';
  const marineCloudEyebrow = home ? pickLocale(home.marineCloudEyebrow, locale) : '';
  const marineCloudHeading = home ? pickLocale(home.marineCloudHeading, locale) : '';
  const coreExpertiseEyebrow = home ? pickLocale(home.coreExpertiseEyebrow, locale) : '';
  const coreExpertiseHeading = home ? pickLocale(home.coreExpertiseHeading, locale) : '';
  const coreExpertiseDescription = home ? pickLocale(home.coreExpertiseDescription, locale) : '';
  const finalCtaHeadline = home ? pickLocale(home.finalCtaHeadline, locale) : '';

  return (
    <>
      <Nav />
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={professionalServiceJsonLd(contactConfig.serviceRegions)} />

      {/* HERO — CMS-managed via the `homepage` singleton (heroMedia).
          Composición cinematográfica de pantalla completa — restaurada
          a pedido explícito (la versión de dos zonas resultaba
          demasiado rígida / con aspecto de "tarjeta de video pegada").
          El tratamiento por aspecto real del video (portrait vs
          landscape, sin recorte agresivo, sin tapar subtítulos
          incrustados) se sigue resolviendo solo en HeroMedia. */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[88vh] flex items-center overflow-hidden">
        <HeroMedia videoPlaybackId={heroMedia.videoPlaybackId} videoAspect={heroMedia.videoAspect} imageUrl={heroMedia.imageUrl} />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/35 to-navy/15" />

        <span className="absolute z-[2] top-16 md:top-[88px] left-5 md:left-10 font-mono text-[9px] tracking-[0.08em] text-marine-white/35">
          25.7617° N — 80.1918° W
        </span>
        {!heroMedia.videoPlaybackId && !heroMedia.imageUrl && (
          <span className="absolute z-[2] bottom-5 md:bottom-8 right-5 md:right-10 font-mono text-[9px] tracking-[0.08em] text-marine-white/35">
            HERO_YACHT_VIDEO — placeholder
          </span>
        )}

        <StatusChip vesselName="SEA RAY 340" status="Repair In Progress" technician="TECH: J. RIVERA · ON SITE" healthPercent={82} />

        <div className="relative z-[3] max-w-wide mx-auto px-5 md:px-10 w-full pt-[94px] md:pt-[104px]">
          <span className="block font-mono text-[10.5px] uppercase tracking-[0.2em] text-gold mb-3.5">
            {heroEyebrow || 'Engineering Confidence'}
          </span>
          <h1 className="font-display font-bold uppercase leading-[0.98] tracking-tight text-marine-white text-[15vw] sm:text-[64px] md:text-[88px] xl:text-[118px]">
            {heroHeadline || (
              <>
                On The
                <br />
                Water.
              </>
            )}
          </h1>
          <p className="mt-4 text-[13.5px] font-medium text-marine-white max-w-[380px]">
            {heroSubcopy || 'Marine Electrical · Electronics · Diagnostics · Installations'}
          </p>
          <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.12em] text-cool-gray font-mono">
            USA &middot; Dominican Republic &middot; Panama &middot; Colombia
          </p>

          <div className="flex gap-2.5 flex-wrap mt-6">
            <Button href="/request-service">Request Service</Button>
            <GhostButton href="/projects" tone="white">Explore Our Work</GhostButton>
          </div>

          <div className="flex gap-4 flex-wrap mt-8">
            {['Marine Experts', 'Smart Solutions', 'Total Support'].map((t) => (
              <span
                key={t}
                className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-cool-gray flex items-center gap-1.5 before:content-[''] before:w-1 before:h-1 before:bg-gold before:rounded-full"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CORE EXPERTISE */}
      <section className="py-11 md:py-24 px-5 md:px-10 max-w-wide mx-auto">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">
              {coreExpertiseEyebrow || 'Capabilities'}
            </span>
            <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight">
              {coreExpertiseHeading || 'Core Expertise'}
            </h2>
          </div>
          <p className="text-sm text-cool-gray max-w-[520px] leading-relaxed">
            {coreExpertiseDescription ||
              'Precision marine engineering across electrical, electronics and diagnostic systems — built for reliability at sea.'}
          </p>
        </div>
        <ServiceModules />
        <div className="mt-6">
          <Link href="/services" className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold hover:underline">
            View All Services →
          </Link>
        </div>
      </section>

      {/* FEATURED PROJECT — usa el primer proyecto de la fuente única de datos */}
      <ProjectPreview
        index={featured.index}
        title={featured.title}
        vessel={featured.vessel}
        location={featured.location}
        tags={featured.tags}
        href={`/projects/${featured.slug}`}
        imageUrl={featured.imageUrl}
        videoUrl={featured.videoUrl}
        videoPlaybackId={featured.videoPlaybackId}
      />

      {/* BEFORE / AFTER */}
      <section className="py-11 md:py-24 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Craftsmanship</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-2xl">
          The Difference Is in the Details
        </h2>
        <p className="mt-3.5 text-sm text-cool-gray max-w-[520px] leading-relaxed">
          Professional marine work should perform correctly — and look like it belongs on the vessel.
        </p>
        <div className="mt-8">
          <BeforeAfterSlider />
        </div>
      </section>

      {/* KCC MARINE CLOUD */}
      <section className="bg-panel border-y border-white/[0.08] py-11 md:py-24 px-5 md:px-10">
        <div className="max-w-wide mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">
              {marineCloudEyebrow || 'KCC Marine Cloud'}
            </span>
            <h2 className="font-display font-bold uppercase text-[28px] tracking-tight leading-[1.05]">
              {marineCloudHeading || (
                <>
                  Marine Service.
                  <br />
                  Reimagined.
                </>
              )}
            </h2>
            <p className="mt-3.5 text-sm text-cool-gray max-w-[440px] leading-relaxed">
              {marineCloudCopy ||
                'A smarter way to manage your vessel service — from request to completion, fully documented, fully transparent.'}
            </p>
            <div className="flex gap-2.5 flex-wrap mt-8">
              <Button href="/technology/marine-cloud">Discover Marine Cloud</Button>
              <GhostButton href="/client-login" tone="white" trackEvent={ANALYTICS_EVENTS.CLIENT_LOGIN_CLICKED}>Client Login</GhostButton>
            </div>
          </div>
          <TechnologyPreview />
        </div>
      </section>

      {/* SELECTED PROJECTS — usa PROJECTS[1..] de la fuente única, no datos duplicados */}
      <section className="py-11 md:py-24 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Portfolio</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight">Selected Projects</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {PROJECTS.slice(1).map((p) => (
            <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <MediaSurface
                  imageUrl={p.imageUrl}
                  videoUrl={p.videoUrl}
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
                <div className="font-mono text-[9.5px] text-gold">{p.index}</div>
                <div className="font-display text-base font-semibold uppercase mt-1 group-hover:text-gold transition-colors">
                  {p.title}
                </div>
                <div className="text-[11.5px] text-cool-gray mt-0.5">{p.location}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* INTERNATIONAL PRESENCE */}
      <section className="py-11 md:py-24 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Coverage</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight">International Presence</h2>
        <PresenceMap />
      </section>

      {/* TESTIMONIALS — server component, returns null if no approved testimonials exist. */}
      <TestimonialSection />

      {/* INSIGHTS — usa la fuente única (Sanity con fallback a INSIGHTS), no datos duplicados */}
      <section className="py-11 md:py-24 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Marine Insights</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight">Latest Insights</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-px md:bg-white/[0.08]">
          {(home?.featuredInsights?.length ? home.featuredInsights : INSIGHTS.slice(0, 3)).map((i: any) => (
            <InsightCard
              key={i.slug ?? i.slug?.current}
              category={i.category}
              readTime={i.readingTime ? `${i.readingTime} min read` : ''}
              title={home?.featuredInsights?.length ? pickLocale(i.title, locale) : i.title}
              excerpt={home?.featuredInsights?.length ? '' : i.excerpt}
              href={`/insights/${i.slug}`}
              imageColor={i.imageColor ?? '#12233A'}
            />
          ))}
        </div>
      </section>

      <PartnersSection section={home?.partnersSection ?? null} locale={locale} />

      {/* FINAL CTA */}
      <section className="text-center py-16 px-5 border-t border-white/[0.08]" style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}>
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Ready When You Are</span>
        <h2 className="font-display font-bold uppercase text-[28px] md:text-[42px] tracking-tight max-w-xl mx-auto leading-tight">
          {finalCtaHeadline || (
            <>
              Engineer Confidence
              <br />
              on Your Vessel.
            </>
          )}
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/request-service">Request Service</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
