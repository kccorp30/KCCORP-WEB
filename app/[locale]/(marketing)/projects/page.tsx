import { Link } from '@/i18n/navigation';
import { getLocale } from 'next-intl/server';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { MediaSurface } from '@/components/marketing/MediaSurface';
import { PROJECTS as PROJECTS_FALLBACK } from '@/lib/data/projects';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { ALL_PROJECTS_QUERY } from '@/lib/sanity/queries';
import { adaptSanityProject } from '@/lib/sanity/adapters';

export default async function ProjectsPage() {
  const locale = await getLocale();
  const raw = await fetchWithFallback<any>(ALL_PROJECTS_QUERY, {}, null);
  const projects = raw ? raw.map((p: any, i: number) => ({ ...adaptSanityProject(p, locale), index: String(i + 1).padStart(3, '0') })) : PROJECTS_FALLBACK;

  return (
    <>
      <Nav />

      <section id="main-content" tabIndex={-1} className="pt-28 md:pt-36 pb-10 md:pb-16 px-5 md:px-10 max-w-wide mx-auto">
        <span className="block font-mono text-[10.5px] uppercase tracking-[0.18em] text-gold mb-3.5">Portfolio</span>
        <h1 className="font-display font-bold uppercase text-[34px] md:text-[56px] tracking-tight leading-[1.02] max-w-2xl">
          Selected Work.
        </h1>
        <p className="mt-4 text-sm text-cool-gray max-w-xl leading-relaxed">
          Every project documented from diagnosis to completion — proof, not promises.
        </p>
      </section>

      <section className="pb-24">
        {projects.map((p: any) => (
          <Link key={p.slug} href={`/projects/${p.slug}`} className="block relative group">
            <div className="aspect-[16/9] md:aspect-[21/9] relative overflow-hidden">
              <MediaSurface
                imageUrl={p.imageUrl}
                videoUrl={p.videoUrl}
                videoPlaybackId={p.videoPlaybackId}
                alt={p.title}
                fallback={
                  <svg width="100%" height="100%" viewBox="0 0 900 380" preserveAspectRatio="xMidYMid slice">
                    <rect width="900" height="380" fill={p.color} />
                    <path d="M220 320 L680 320 L610 260 L290 260 Z" fill="#050A11" />
                  </svg>
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-5 md:px-10 pb-6 md:pb-10 max-w-wide mx-auto">
              <span className="font-mono text-[10px] text-gold tracking-[0.12em]">PROJECT / {p.index}</span>
              <div className="font-display font-bold uppercase text-2xl md:text-4xl mt-1.5 tracking-tight group-hover:text-gold transition-colors">
                {p.title}
              </div>
              <div className="text-[12.5px] text-cool-gray mt-1">
                {p.vessel} &middot; {p.location}
              </div>
            </div>
          </Link>
        ))}
      </section>

      <Footer />
    </>
  );
}
