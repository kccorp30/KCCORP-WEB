import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MediaSurface } from '@/components/marketing/MediaSurface';
import { LOCATIONS, getLocationBySlug } from '@/lib/data/locations';
import { SERVICES } from '@/lib/data/services';
import { PROJECTS } from '@/lib/data/projects';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { LOCATION_BY_SLUG_QUERY } from '@/lib/sanity/queries';
import { adaptSanityLocation } from '@/lib/sanity/adapters';

export function generateStaticParams() {
  return LOCATIONS.map((l) => ({ slug: l.slug }));
}

export default async function LocationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();

  const rawLocation = await fetchWithFallback<any>(LOCATION_BY_SLUG_QUERY, { slug }, null);
  const location = rawLocation ? adaptSanityLocation(rawLocation, locale) : getLocationBySlug(slug);
  if (!location) notFound();

  const relatedServices = SERVICES.filter((s) => location.servicesAvailable.includes(s.slug));
  const relatedProjects = PROJECTS.filter((p) => p.location.includes(location.country));

  return (
    <>
      <Nav />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[46vh] flex items-end overflow-hidden">
        <MediaSurface
          alt={location.country}
          className="absolute inset-0"
          fallback={
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(600px 500px at 70% 20%, rgba(76,124,158,0.18), transparent 60%), linear-gradient(160deg, #0A0E1C 0%, #0D1830 45%, #0A0F1E 100%)',
              }}
            />
          }
        />
        <div className="relative z-[2] w-full px-5 md:px-10 pb-10 pt-28 max-w-wide mx-auto">
          <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold">
            {location.isServiceRegionOnly ? 'Service Region' : 'Physical Office'}
          </span>
          <h1 className="font-display font-bold uppercase text-4xl md:text-6xl mt-2.5 leading-tight tracking-tight">
            {location.country}
          </h1>
          <p className="mt-2 text-[13px] text-cool-gray font-mono">
            {location.primaryCity} &middot; {location.coordinates}
          </p>
        </div>
      </section>

      {/* Description */}
      <section className="py-11 md:py-16 px-5 md:px-10 max-w-wide mx-auto">
        <p className="text-base text-marine-white max-w-2xl leading-relaxed">{location.description}</p>
      </section>

      {/* Services available */}
      {relatedServices.length > 0 && (
        <section className="py-11 md:py-16 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">
            Services Available
          </span>
          <div className="flex flex-wrap gap-3">
            {relatedServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="border border-white/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-marine-white hover:border-gold hover:text-gold transition-colors"
              >
                {s.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related projects */}
      {relatedProjects.length > 0 && (
        <section className="py-11 md:py-16 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">
            Projects in {location.country}
          </span>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {relatedProjects.map((p) => (
              <Link key={p.slug} href={`/projects/${p.slug}`} className="group">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                    <rect width="400" height="300" fill={p.color} />
                    <path d="M100 220 L300 220 L260 180 L140 180 Z" fill="#050A11" />
                  </svg>
                </div>
                <div className="pt-3">
                  <div className="font-mono text-[9.5px] text-gold">{p.index}</div>
                  <div className="font-display text-base font-semibold uppercase mt-1 group-hover:text-gold transition-colors">
                    {p.title}
                  </div>
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
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">
          Serving {location.country}
        </span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Request Service in {location.primaryCity}.
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/request-service">Request Service</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
