// Reusable surface for actual KCC Marine Cloud product UI.
// Pass `imageUrl` once a real screenshot exists — the frame/perspective
// treatment stays the same, only the content changes. Until then,
// `fallback` renders a CLEARLY CONCEPTUAL mockup (not a fake screenshot
// pretending to be real) — reuses the same visual language as the
// Marine Cloud app itself (glass, gold/blue gradient, gauge rings).

interface ProductScreenshotProps {
  imageUrl?: string;
  videoUrl?: string;
  device?: 'desktop' | 'mobile' | 'none'; // 'none' = free-floating, no device chrome
  perspective?: boolean;
  caption?: string;
  annotation?: string; // small technical label pointing at a feature
  alt: string;
  fallback: React.ReactNode;
}

export function ProductScreenshot({
  imageUrl,
  videoUrl,
  device = 'none',
  perspective = false,
  caption,
  annotation,
  alt,
  fallback,
}: ProductScreenshotProps) {
  const frameClass =
    device === 'desktop'
      ? 'rounded-lg border border-white/10 bg-white/[0.03] backdrop-blur-[8px] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.5)]'
      : device === 'mobile'
        ? 'rounded-[24px] border border-white/[0.12] bg-white/[0.04] backdrop-blur-[8px] p-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] max-w-[280px] mx-auto'
        : '';

  return (
    <div className="relative">
      <div
        className={frameClass}
        style={perspective ? { transform: 'rotateY(-4deg) rotateX(1deg)', transformStyle: 'preserve-3d' } : undefined}
      >
        <div className="relative overflow-hidden rounded-[4px]" style={{ aspectRatio: device === 'mobile' ? '9/18.5' : '16/10' }}>
          {videoUrl ? (
            <video src={videoUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" aria-label={alt} />
          ) : imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={alt} className="w-full h-full object-cover" />
          ) : (
            fallback
          )}
        </div>
      </div>

      {annotation && (
        <div className="absolute -bottom-3 left-4 md:left-8 bg-navy border border-gold/40 px-3 py-1.5">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.08em] text-gold">{annotation}</span>
        </div>
      )}

      {caption && <p className="mt-6 text-xs text-cool-gray text-center">{caption}</p>}

      {!imageUrl && !videoUrl && (
        <span className="absolute top-2 right-2 font-mono text-[8px] uppercase tracking-[0.08em] text-marine-white/30 bg-navy/60 px-2 py-0.5">
          Conceptual UI
        </span>
      )}
    </div>
  );
}
