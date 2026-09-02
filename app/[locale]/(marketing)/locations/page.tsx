import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { LOCATIONS as LOCATIONS_FALLBACK } from '@/lib/data/locations';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { ALL_LOCATIONS_QUERY } from '@/lib/sanity/queries';
import { adaptSanityLocation } from '@/lib/sanity/adapters';

export default async function LocationsPage() {
  const locale = await getLocale();
  const raw = await fetchWithFallback<any>(ALL_LOCATIONS_QUERY, {}, null);
  const LOCATIONS = raw ? raw.map((l: any) => adaptSanityLocation(l, locale)) : LOCATIONS_FALLBACK;
  return (
    <>
      <Nav />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 md:pb-16 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">Coverage</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Where We Serve.
        </h1>
        <p className="mt-4 text-sm text-cool-gray max-w-xl leading-relaxed">
          KCC serves boat owners and marine partners across four regions — service coverage, not necessarily a
          physical office in every location.
        </p>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-10">
        <div className="relative aspect-[21/9] bg-panel border border-white/10 overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid meet">
            <rect width="900" height="380" fill="#0B1826" />
            <g opacity={0.25} stroke="#9FB0C4" strokeWidth={0.5}>
              <line x1="0" y1="95" x2="900" y2="95" />
              <line x1="0" y1="190" x2="900" y2="190" />
              <line x1="0" y1="285" x2="900" y2="285" />
              <line x1="225" y1="0" x2="225" y2="380" />
              <line x1="450" y1="0" x2="450" y2="380" />
              <line x1="675" y1="0" x2="675" y2="380" />
            </g>
            <g fill="#C9A24B">
              <circle cx="180" cy="150" r="4" />
              <circle cx="270" cy="230" r="4" />
              <circle cx="330" cy="255" r="4" />
              <circle cx="300" cy="290" r="4" />
            </g>
            <path d="M180 150 L270 230 L330 255 L300 290" stroke="#C9A24B" strokeWidth={0.75} opacity={0.4} fill="none" />
          </svg>
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.08]">
          {LOCATIONS.map((loc: any) => (
            <Link
              key={loc.slug}
              href={`/locations/${loc.slug}`}
              className="bg-navy p-7 md:p-9 hover:bg-panel transition-colors duration-200 ease-precise group"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-xl font-semibold uppercase tracking-tight">{loc.country}</span>
                <span className="text-cool-gray group-hover:text-gold transition-colors">→</span>
              </div>
              <div className="text-[12.5px] text-cool-gray mt-1.5">{loc.primaryCity}</div>
              <div className="font-mono text-[9.5px] text-gold mt-3">{loc.coordinates}</div>
              <span className="inline-block mt-4 font-mono text-[9px] uppercase tracking-[0.08em] text-cool-gray border border-white/10 px-2.5 py-1">
                {loc.isServiceRegionOnly ? 'Service Region' : 'Physical Office'}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
