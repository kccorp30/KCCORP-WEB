import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { getGlobalSettings, getWhatsAppLinkFor } from '@/lib/sanity/global-settings';
import { TrackedLink } from '@/components/analytics/TrackedLink';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export default async function ContactPage() {
  const settings = await getGlobalSettings();
  const whatsappLink = getWhatsAppLinkFor(settings.whatsapp);

  return (
    <>
      <Nav />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-14 md:pb-20 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">Contact</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Let&apos;s Talk About Your Vessel.
        </h1>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-16 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.08]">
          <div className="bg-navy p-7 md:p-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Request Service</span>
            <p className="mt-3 text-sm text-cool-gray leading-relaxed">
              The fastest way to get a job started — tell us about your vessel and what you need.
            </p>
            <div className="mt-5">
              <Button href="/request-service">Request Service</Button>
            </div>
          </div>

          <div className="bg-navy p-7 md:p-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">WhatsApp</span>
            {whatsappLink ? (
              <>
                <p className="mt-3 text-sm text-cool-gray leading-relaxed">Message us directly for a quick answer.</p>
                <TrackedLink event={ANALYTICS_EVENTS.WHATSAPP_CLICKED} href={whatsappLink} target="_blank" rel="noreferrer" className="inline-block mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-gold">
                  Open WhatsApp →
                </TrackedLink>
              </>
            ) : (
              <p className="mt-3 text-sm text-cool-gray/50 leading-relaxed">[ WhatsApp number pending configuration ]</p>
            )}
          </div>

          <div className="bg-navy p-7 md:p-9">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Phone &amp; Email</span>
            {settings.phone ? (
              <TrackedLink event={ANALYTICS_EVENTS.PHONE_CLICKED} href={`tel:${settings.phone}`} className="block mt-3 text-sm text-marine-white">
                {settings.phone}
              </TrackedLink>
            ) : (
              <p className="mt-3 text-sm text-cool-gray/50">[ Phone pending configuration ]</p>
            )}
            {settings.email ? (
              <TrackedLink event={ANALYTICS_EVENTS.EMAIL_CLICKED} href={`mailto:${settings.email}`} className="block mt-2 text-sm text-marine-white">
                {settings.email}
              </TrackedLink>
            ) : (
              <p className="mt-2 text-sm text-cool-gray/50">[ Email pending configuration ]</p>
            )}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-24">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-4">Service Regions</span>
        <div className="flex flex-wrap gap-3">
          {settings.serviceRegions.map((r) => (
            <span key={r} className="border border-white/10 px-4 py-2.5 text-[11px] uppercase tracking-[0.08em] text-marine-white">
              {r}
            </span>
          ))}
        </div>
      </section>

      <Footer />
    </>
  );
}
