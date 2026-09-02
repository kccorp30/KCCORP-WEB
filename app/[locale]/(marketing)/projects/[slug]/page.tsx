import { Link } from '@/i18n/navigation';
import { notFound } from 'next/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { MediaSurface } from '@/components/marketing/MediaSurface';
import { BeforeAfterSlider } from '@/components/marketing/BeforeAfterSlider';
import { PROJECTS, getProjectBySlug } from '@/lib/data/projects';
import { SERVICES } from '@/lib/data/services';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { PROJECT_BY_SLUG_QUERY } from '@/lib/sanity/queries';
import { adaptSanityProject, resolveMedia } from '@/lib/sanity/adapters';
import { PageViewTracker } from '@/components/analytics/PageViewTracker';
import { ANALYTICS_EVENTS } from '@/lib/analytics/events';

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

function Block({ eyebrow, children }: { eyebrow: string; children: React.ReactNode }) {
  return (
    <div className="py-8 border-t border-white/[0.08] grid md:grid-cols-[200px_1fr] gap-4 md:gap-10">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">{eyebrow}</span>
      <div className="text-sm text-marine-white leading-relaxed max-w-2xl">{children}</div>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const locale = await getLocale();

  const rawProject = await fetchWithFallback<any>(PROJECT_BY_SLUG_QUERY, { slug }, null);
  const project = rawProject ? adaptSanityProject(rawProject, locale) : getProjectBySlug(slug);
  if (!project) notFound();

  const before = rawProject ? resolveMedia(rawProject.beforeMedia) : { imageUrl: (project as any).beforeImageUrl };
  const after = rawProject ? resolveMedia(rawProject.afterMedia) : { imageUrl: (project as any).afterImageUrl };

  const relatedServices = rawProject?.services?.length
    ? rawProject.services.map((s: any) => ({ slug: s.slug, title: locale === 'es' ? s.title?.es || s.title?.en : s.title?.en }))
    : SERVICES.filter((s) => project.services.includes(s.slug));

  return (
    <>
      <Nav />
      <PageViewTracker event={ANALYTICS_EVENTS.PROJECT_VIEWED} payload={{ slug: project.slug }} />

      {/* Hero visual */}
      <section id="main-content" tabIndex={-1} className="relative min-h-[70vh] flex items-end overflow-hidden">
        <MediaSurface
          imageUrl={project.imageUrl}
          videoUrl={project.videoUrl}
          videoPlaybackId={project.videoPlaybackId}
          alt={project.title}
          className="absolute inset-0"
          fallback={<div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${project.color}, #070E18)` }} />}
        />
        <div className="relative z-[2] w-full px-5 md:px-10 pb-10 md:pb-14 pt-28 bg-gradient-to-t from-navy/95 from-20% to-transparent">
          <div className="max-w-wide mx-auto">
            <span className="font-mono text-[11px] text-gold tracking-[0.14em]">PROJECT / {project.index || '—'}</span>
            <h1 className="font-display font-bold uppercase text-4xl md:text-6xl mt-2.5 leading-tight tracking-tight max-w-2xl">
              {project.title}
            </h1>
            <p className="mt-2 text-[13px] text-cool-gray">
              {project.vessel} &middot; {project.location} &middot; {project.year}
            </p>
          </div>
        </div>
      </section>

      {/* Project data */}
      <section className="px-5 md:px-10 max-w-wide mx-auto">
        <div className="flex flex-wrap gap-x-8 gap-y-3 py-8 border-t border-white/[0.08]">
          {relatedServices.map((s: any) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="font-mono text-[10px] uppercase tracking-[0.08em] text-cool-gray hover:text-gold transition-colors"
            >
              {s.title}
            </Link>
          ))}
        </div>

        <Block eyebrow="Problem">{project.problem}</Block>
        <Block eyebrow="Diagnosis">{project.diagnosis}</Block>
        <Block eyebrow="Solution">{project.solution}</Block>
        <Block eyebrow="Equipment Installed">
          <ul className="space-y-1.5">
            {project.equipmentInstalled.map((item: string) => (
              <li key={item}>&middot; {item}</li>
            ))}
          </ul>
        </Block>
        <Block eyebrow="Result">{project.result}</Block>
      </section>

      {/* Before / After */}
      <section className="py-11 md:py-20 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Before / After</span>
        <BeforeAfterSlider beforeImageUrl={before.imageUrl} afterImageUrl={after.imageUrl} />
      </section>

      {/* Related services */}
      {relatedServices.length > 0 && (
        <section className="py-11 md:py-20 px-5 md:px-10 max-w-wide mx-auto border-t border-white/[0.08]">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Related Services</span>
          <div className="flex flex-wrap gap-3 mt-4">
            {relatedServices.map((s: any) => (
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

      {/* Final CTA */}
      <section
        className="text-center py-16 px-5 border-t border-white/[0.08]"
        style={{ background: 'linear-gradient(135deg, #0E1C2E, #070E18)' }}
      >
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-gold mb-2.5">Need a Similar Solution?</span>
        <h2 className="font-display font-bold uppercase text-[26px] md:text-[38px] tracking-tight max-w-lg mx-auto leading-tight">
          Let&apos;s Engineer It Right.
        </h2>
        <div className="flex justify-center mt-7">
          <Button href="/request-service">Request Service</Button>
        </div>
      </section>

      <Footer />
    </>
  );
}
