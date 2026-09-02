import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MediaSurface } from '@/components/marketing/MediaSurface';

export default function AboutPage() {
  return (
    <>
      <Nav />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 md:pb-16 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">About KCC</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Marine Services + Technology.
        </h1>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-14 md:pb-20">
        <div className="aspect-[21/9] relative overflow-hidden">
          <MediaSurface
            alt="KCC team and field work"
            fallback={
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1C2C40] to-navy">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-marine-white/30">
                  [ Team / founder photography — see content-placeholder-map.md ]
                </span>
              </div>
            }
          />
        </div>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-16 md:pb-24 grid md:grid-cols-[200px_1fr] gap-6 md:gap-14 border-t border-white/[0.08] pt-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Origin</span>
        <p className="text-base text-marine-white leading-relaxed max-w-2xl">
          KCC started from a specific, recurring problem in marine electrical and electronics work: systems get
          modified over a vessel&apos;s life without consistent documentation, and every new technician has to
          re-diagnose what the last one already figured out. That inefficiency — and the risk it creates — is what
          KCC was built to solve.
        </p>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-16 md:pb-24 grid md:grid-cols-[200px_1fr] gap-6 md:gap-14 border-t border-white/[0.08] pt-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Approach</span>
        <p className="text-base text-marine-white leading-relaxed max-w-2xl">
          Marine electrical and electronics work rewards precision and documentation more than almost any other
          trade — a bad diagnosis costs real money and real time on the water. KCC&apos;s technicians work from
          documented findings, not guesswork, and every job is recorded as it happens, not reconstructed afterward.
        </p>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-16 md:pb-24 grid md:grid-cols-[200px_1fr] gap-6 md:gap-14 border-t border-white/[0.08] pt-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Technology</span>
        <p className="text-base text-marine-white leading-relaxed max-w-2xl">
          That documentation discipline is why KCC built KCC Marine Cloud — not as a generic add-on, but because a
          proper vessel service record needs software designed specifically for it. The same thinking extends to
          Luz, the intelligence layer built to make that record actually useful to you, not just archived.
        </p>
      </section>

      <section className="px-5 md:px-10 max-w-wide mx-auto pb-16 md:pb-24 grid md:grid-cols-[200px_1fr] gap-6 md:gap-14 border-t border-white/[0.08] pt-12">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">Transparency</span>
        <p className="text-base text-marine-white leading-relaxed max-w-2xl">
          Every diagnosis, every part, every photo — visible to you, not just summarized on an invoice at the end.
          That&apos;s the standard KCC holds itself to, region by region, as the service network grows.
        </p>
      </section>

      <section
        className="text-center py-16 px-5 border-t border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Work With KCC</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Let&apos;s Talk About Your Vessel.
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/request-service">Request Service</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
