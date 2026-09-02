import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { getLocale } from 'next-intl/server';
import { Button } from '@/components/ui/Button';
import { GhostButton } from '@/components/ui/GhostButton';
import { ProductScreenshot } from '@/components/marketing/ProductScreenshot';
import { MARINE_CLOUD_STORY } from '@/lib/data/marineCloud';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { TECHNOLOGY_CONTENT_QUERY } from '@/lib/sanity/queries';
import { resolveMedia } from '@/lib/sanity/adapters';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

// Fallback conceptual UI — same visual language as the real app
// (gold/blue gradient glow, status rows), clearly labeled "Conceptual UI"
// by ProductScreenshot itself. Swap `imageUrl` per story beat in
// lib/data/marineCloud.ts once real screenshots exist — this fallback
// stops being used automatically, no page redesign needed.
function ConceptualFallback({ device }: { device: 'desktop' | 'mobile' }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center p-6"
      style={{
        background:
          'radial-gradient(240px 240px at 60% 40%, rgba(201,162,75,0.16), transparent 65%), radial-gradient(200px 200px at 30% 70%, rgba(76,124,158,0.18), transparent 65%), #0B1826',
      }}
    >
      <div className="w-full">
        <div className="font-display text-[10px] font-bold text-gold">KCC</div>
        <div className="font-mono text-[8px] text-cool-gray mt-1.5">SEA RAY 340</div>
        <div className={`font-display font-bold mt-1 ${device === 'desktop' ? 'text-sm' : 'text-xs'}`}>
          Service Status
        </div>
        <div className="mt-3 flex flex-col gap-1.5">
          {[
            { label: 'Technician Assigned', status: 'done' },
            { label: 'Diagnosis Complete', status: 'done' },
            { label: 'Repair In Progress', status: 'active' },
            { label: 'Quality Control', status: 'pending' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 text-[8px]">
              <span className={`font-mono ${s.status === 'done' ? 'text-gold' : s.status === 'active' ? 'text-marine-white' : 'text-marine-white/30'}`}>
                {s.status === 'done' ? '✓' : s.status === 'active' ? '●' : '○'}
              </span>
              <span className={s.status === 'pending' ? 'text-marine-white/30' : 'text-marine-white/80'}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function MarineCloudPage() {
  const locale = await getLocale();
  const cms = await fetchWithFallback<any>(TECHNOLOGY_CONTENT_QUERY, { page: 'marine-cloud' }, null);

  const headline = cms ? pickLocale(cms.headline, locale) : '';
  const body = cms ? pickLocale(cms.body, locale) : '';
  const storyBeats = cms?.storyBeats?.length
    ? cms.storyBeats.map((b: any) => ({
        num: b.num,
        title: pickLocale(b.title, locale),
        description: pickLocale(b.description, locale),
        device: b.device,
        annotation: b.annotation,
        ...resolveMedia(b.media),
      }))
    : MARINE_CLOUD_STORY;

  return (
    <>
      <Nav />
      <PageViewTracker event={ANALYTICS_EVENTS.MARINE_CLOUD_VIEWED} />

      {/* Hero */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[70vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(700px 500px at 20% 0%, rgba(201,162,75,0.16), transparent 60%), radial-gradient(650px 550px at 85% 10%, rgba(76,124,158,0.18), transparent 60%), linear-gradient(160deg, #0A0E1C 0%, #0D1830 45%, #0A0F1E 100%)',
          }}
        />
        <div className="relative z-[2] max-w-wide mx-auto px-5 md:px-10 pt-24">
          <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">
            KCC Marine Cloud
          </span>
          <h1 className="font-display font-bold uppercase text-[36px] md:text-[64px] tracking-tight leading-[1.02] max-w-3xl">
            {headline || (
              <>
                Marine Service.
                <br />
                Reimagined.
              </>
            )}
          </h1>
          <p className="mt-5 text-sm md:text-base text-cool-gray max-w-lg leading-relaxed">
            {body ||
              'A smarter way to manage your vessel service — a permanent digital record of every job, every system, every technician who has worked on your boat.'}
          </p>
          <div className="flex gap-3 flex-wrap mt-8">
            <Button href="/request-service">Request Service</Button>
            <GhostButton href="/client-login" tone="white" trackEvent={ANALYTICS_EVENTS.CLIENT_LOGIN_CLICKED}>
              Client Login
            </GhostButton>
          </div>
        </div>
      </section>

      {/* Story — 5 acts */}
      {storyBeats.map((beat: any, i: number) => (
        <section key={beat.num} className="py-14 md:py-24 px-5 md:px-10 max-w-wide mx-auto">
          <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''}`}>
            <div>
              <span className="font-mono text-xl text-gold/40 font-bold">{beat.num}</span>
              <h2 className="font-display font-bold uppercase text-2xl md:text-4xl tracking-tight mt-2 leading-tight">
                {beat.title}
              </h2>
              <p className="mt-4 text-sm text-cool-gray leading-relaxed max-w-md">{beat.description}</p>
            </div>
            <ProductScreenshot
              imageUrl={beat.imageUrl}
              device={beat.device}
              perspective
              annotation={beat.annotation}
              alt={beat.title}
              fallback={<ConceptualFallback device={beat.device} />}
            />
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section
        className="text-center py-16 px-5 border-t border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">
          Experience It Yourself
        </span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Your Vessel Deserves a Record Like This.
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/request-service">Request Service</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
