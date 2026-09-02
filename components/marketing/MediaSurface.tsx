// Reusable media surface for every project/service visual in the site.
// Pass `imageUrl` (or `videoUrl`) once real CMS media exists (Sprint 5) —
// the surrounding layout (aspect ratio, container) never changes, only
// what fills it. Until then, `fallback` (the SVG/gradient placeholder)
// renders instead. This is the mechanism requested in the Sprint 2
// technical correction pass: media placeholders must not require
// layout changes when real photography/video arrives.

import { VideoPlayer } from './VideoPlayer';

interface MediaSurfaceProps {
  imageUrl?: string;
  videoUrl?: string;
  videoPlaybackId?: string;
  alt: string;
  fallback: React.ReactNode;
  className?: string;
}

export function MediaSurface({ imageUrl, videoUrl, videoPlaybackId, alt, fallback, className }: MediaSurfaceProps) {
  // Video real de Mux — SIEMPRE via VideoPlayer (mux-player-react), la
  // única forma que reproduce correctamente en todos los navegadores,
  // no solo Safari (ver reporte de esta implementación).
  if (videoPlaybackId) {
    return <VideoPlayer playbackId={videoPlaybackId} className={className} ariaLabel={alt} />;
  }

  // Legado: algún consumidor pasa solo una URL de video (ej. el
  // catálogo temporal de ejemplo en lib/data/*.ts, que nunca tuvo un
  // playbackId real de Mux) — se mantiene para no romper esos casos,
  // aunque fuera de Safari tampoco reproducía antes.
  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        className={`w-full h-full object-cover ${className ?? ''}`}
        aria-label={alt}
      />
    );
  }

  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={alt} className={`w-full h-full object-cover ${className ?? ''}`} />;
  }

  return <>{fallback}</>;
}
