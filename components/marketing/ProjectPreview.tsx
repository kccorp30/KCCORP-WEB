import { GhostButton } from '../ui/GhostButton';
import { MediaSurface } from './MediaSurface';

interface ProjectPreviewProps {
  index: string;
  title: string;
  vessel: string;
  location: string;
  tags: string[];
  href: string;
  imageUrl?: string; // undefined → placeholder claro, listo para reemplazo real
  videoUrl?: string;
  videoPlaybackId?: string;
}

export function ProjectPreview({ index, title, vessel, location, tags, href, imageUrl, videoUrl, videoPlaybackId }: ProjectPreviewProps) {
  return (
    <section className="relative min-h-[78vh] flex items-end overflow-hidden">
      <MediaSurface
        imageUrl={imageUrl}
        videoUrl={videoUrl}
        videoPlaybackId={videoPlaybackId}
        alt={title}
        className="absolute inset-0"
        fallback={<div className="absolute inset-0 bg-gradient-to-br from-[#1C2C40] to-navy" />}
      />

      <div className="relative z-[2] w-full px-5 md:px-10 pb-10 md:pb-14 bg-gradient-to-t from-navy/95 from-20% to-transparent pt-20">
        <div className="max-w-wide mx-auto">
          <span className="font-mono text-[11px] text-gold tracking-[0.14em]">FEATURED PROJECT / {index}</span>
          <h3 className="font-display font-bold uppercase text-3xl md:text-5xl mt-2.5 leading-tight tracking-tight">
            {title}
          </h3>
          <p className="mt-2 text-[13px] text-cool-gray">
            {vessel} &middot; {location}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
            {tags.map((tag) => (
              <span key={tag} className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-cool-gray">
                {tag}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <GhostButton href={href} tone="white">
              View Case Study →
            </GhostButton>
          </div>
        </div>
      </div>
    </section>
  );
}
