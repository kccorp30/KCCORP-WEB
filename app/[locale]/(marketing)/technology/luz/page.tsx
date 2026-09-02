import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { getLocale } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { LUZ_CURRENT_CAPABILITIES, LUZ_PLANNED_CAPABILITIES } from '@/lib/data/luz';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { TECHNOLOGY_CONTENT_QUERY } from '@/lib/sanity/queries';

export default async function LuzPage() {
  const locale = await getLocale();
  const cms = await fetchWithFallback<any>(TECHNOLOGY_CONTENT_QUERY, { page: 'luz' }, null);

  const headline = cms ? pickLocale(cms.headline, locale) : '';
  const body = cms ? pickLocale(cms.body, locale) : '';
  const current = cms?.currentCapabilities?.length
    ? cms.currentCapabilities.map((c: any) => pickLocale(c, locale))
    : LUZ_CURRENT_CAPABILITIES;
  const planned = cms?.plannedCapabilities?.length
    ? cms.plannedCapabilities.map((c: any) => pickLocale(c, locale))
    : LUZ_PLANNED_CAPABILITIES;

  return (
    <>
      <Nav />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[62vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(600px 500px at 75% 20%, rgba(76,124,158,0.20), transparent 60%), radial-gradient(500px 400px at 15% 80%, rgba(201,162,75,0.14), transparent 60%), linear-gradient(160deg, #0A0E1C 0%, #0D1830 45%, #0A0F1E 100%)',
          }}
        />
        <div className="relative z-[2] max-w-wide mx-auto px-5 md:px-10 pt-24">
          <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">
            Luz Marine Intelligence
          </span>
          <h1 className="font-display font-bold uppercase text-[32px] md:text-[56px] tracking-tight leading-[1.05] max-w-2xl">
            {headline || (
              <>
                Marine Intelligence.
                <br />
                Built Around the Vessel.
              </>
            )}
          </h1>
          <p className="mt-5 text-sm md:text-base text-cool-gray max-w-lg leading-relaxed">
            {body ||
              "Luz isn't a generic chatbot bolted onto a website — it's the intelligence layer of KCC Marine Cloud, built to understand your vessel's service history and explain what's actually happening."}
          </p>
        </div>
      </section>

      {/* Example conversation */}
      <section className="py-14 md:py-20 px-5 md:px-10 max-w-wide mx-auto">
        <div className="max-w-md border border-white/10 bg-white/[0.03] backdrop-blur-[8px] p-7">
          <p className="text-sm text-cool-gray italic">&ldquo;What&apos;s happening with my boat?&rdquo;</p>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-sm text-marine-white">Your technician completed the electrical diagnosis.</p>
            <p className="mt-3 font-mono text-xs uppercase tracking-[0.1em] text-gold">Repair In Progress</p>
            <p className="mt-2 text-xs text-cool-gray">3 new photos available.</p>
          </div>
        </div>
      </section>

      {/* Capabilities — honest split */}
      <section className="py-11 md:py-20 px-5 md:px-10 max-w-wide mx-auto grid md:grid-cols-2 gap-10 border-t border-white/[0.08]">
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">
            Current Capabilities
          </span>
          <ul className="space-y-3">
            {current.map((c: string) => (
              <li key={c} className="flex gap-3 text-sm text-marine-white leading-relaxed">
                <span className="font-mono text-gold shrink-0">✓</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-cool-gray mb-4">
            Planned / Evolving Capabilities
          </span>
          <ul className="space-y-3">
            {planned.map((c: string) => (
              <li key={c} className="flex gap-3 text-sm text-cool-gray leading-relaxed">
                <span className="font-mono text-cool-gray shrink-0">○</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="text-center py-16 px-5 border-t border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">
          Part of the KCC Ecosystem
        </span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Meet Luz Inside KCC Marine Cloud.
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/technology/marine-cloud">Discover Marine Cloud</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
