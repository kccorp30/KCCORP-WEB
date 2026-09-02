import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { ServiceIcon } from '@/components/marketing/ServiceIcon';
import { SERVICES as SERVICES_FALLBACK } from '@/lib/data/services';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { ALL_SERVICES_QUERY } from '@/lib/sanity/queries';
import { adaptSanityService } from '@/lib/sanity/adapters';

export default async function ServicesPage() {
  const locale = await getLocale();
  const raw = await fetchWithFallback<any>(ALL_SERVICES_QUERY, {}, null);
  const services = raw ? raw.map((s: any) => adaptSanityService(s, locale)) : SERVICES_FALLBACK;

  return (
    <>
      <Nav />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 md:pb-16 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">Capabilities</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Marine Engineering, End to End.
        </h1>
        <p className="mt-4 text-sm text-cool-gray max-w-xl leading-relaxed">
          Nine core disciplines, one integrated approach — every system on your vessel engineered to work together, documented, and built to last.
        </p>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.08]">
          {services.map((service: any, i: number) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="bg-navy p-6 md:p-8 flex gap-5 items-start hover:bg-panel transition-colors duration-200 ease-precise group"
            >
              <ServiceIcon type={service.icon} bg={service.color} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-gold tracking-[0.1em]">{service.num || String(i + 1).padStart(2, '0')}</span>
                  <span className="text-cool-gray group-hover:text-gold transition-colors text-sm">→</span>
                </div>
                <div className="font-display text-xl font-semibold uppercase mt-2 tracking-tight">{service.title}</div>
                <div className="text-xs text-cool-gray mt-1.5">{service.spec}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
