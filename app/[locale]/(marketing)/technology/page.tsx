import { Link } from '@/i18n/navigation';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export default function TechnologyPage() {
  return (
    <>
      <Nav />
      <PageViewTracker event={ANALYTICS_EVENTS.TECHNOLOGY_VIEWED} />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 md:pb-16 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">Technology</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Marine Service, Built on Software.
        </h1>
        <p className="mt-4 text-sm text-cool-gray max-w-xl leading-relaxed">
          KCC isn&apos;t just a repair contractor — it&apos;s marine service infrastructure. Two systems work together
          to make that real.
        </p>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-24 grid md:grid-cols-2 gap-px bg-white/[0.08]">
        <Link
          href="/technology/marine-cloud"
          className="bg-navy p-8 md:p-12 flex flex-col justify-between min-h-[320px] group hover:bg-panel transition-colors duration-200 ease-precise"
        >
          <div>
            <span className="font-mono text-[10px] text-gold tracking-[0.1em]">PLATFORM</span>
            <h2 className="font-display font-bold uppercase text-2xl md:text-4xl mt-3 tracking-tight leading-tight">
              KCC Marine Cloud
            </h2>
            <p className="mt-4 text-sm text-cool-gray leading-relaxed max-w-sm">
              Marine service, reimagined — from request to completion, fully documented.
            </p>
          </div>
          <span className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold group-hover:underline">
            Discover Marine Cloud →
          </span>
        </Link>

        <Link
          href="/technology/luz"
          className="bg-navy p-8 md:p-12 flex flex-col justify-between min-h-[320px] group hover:bg-panel transition-colors duration-200 ease-precise"
        >
          <div>
            <span className="font-mono text-[10px] text-gold tracking-[0.1em]">INTELLIGENCE LAYER</span>
            <h2 className="font-display font-bold uppercase text-2xl md:text-4xl mt-3 tracking-tight leading-tight">
              Luz Marine Intelligence
            </h2>
            <p className="mt-4 text-sm text-cool-gray leading-relaxed max-w-sm">
              Marine intelligence, built around the vessel — not another generic chatbot.
            </p>
          </div>
          <span className="mt-8 font-mono text-[10.5px] uppercase tracking-[0.1em] text-gold group-hover:underline">
            Meet Luz →
          </span>
        </Link>
      </section>

      <Footer />
    </>
  );
}
