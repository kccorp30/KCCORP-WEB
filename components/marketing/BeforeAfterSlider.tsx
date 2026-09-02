'use client';

import { useRef, useState } from 'react';

interface BeforeAfterSliderProps {
  beforeImageUrl?: string; // real photography — Sprint 5. Empty = gradient fallback.
  afterImageUrl?: string;
}

export function BeforeAfterSlider({ beforeImageUrl, afterImageUrl }: BeforeAfterSliderProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const dragging = useRef(false);

  function moveTo(clientX: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return;
    let p = ((clientX - rect.left) / rect.width) * 100;
    p = Math.max(4, Math.min(96, p));
    setPct(p);
  }

  return (
    <div
      ref={wrapRef}
      className="relative aspect-video overflow-hidden border border-white/10 select-none"
      onClick={(e) => moveTo(e.clientX)}
      onPointerMove={(e) => dragging.current && moveTo(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
      onPointerLeave={() => (dragging.current = false)}
    >
      <div
        className="absolute inset-0"
        style={!beforeImageUrl ? { background: 'linear-gradient(135deg, #1C2C40, #070E18)' } : undefined}
      >
        {beforeImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={beforeImageUrl} alt="Before" className="w-full h-full object-cover" />
        )}
        <span className="absolute top-3.5 left-3.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-marine-white bg-navy/55 px-2.5 py-[5px]">
          Before
        </span>
      </div>
      <div
        className="absolute inset-y-0 left-0"
        style={{
          clipPath: `inset(0 0 0 ${pct}%)`,
          ...(!afterImageUrl && { background: 'linear-gradient(135deg, #4C7C9E, #0E1C2E)' }),
        }}
      >
        {afterImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={afterImageUrl} alt="After" className="w-full h-full object-cover" />
        )}
        <span className="absolute top-3.5 right-3.5 font-mono text-[9.5px] uppercase tracking-[0.12em] text-marine-white bg-navy/55 px-2.5 py-[5px]">
          After
        </span>
      </div>
      <div
        role="slider"
        tabIndex={0}
        aria-label="Before and after comparison"
        aria-valuenow={Math.round(pct)}
        aria-valuemin={4}
        aria-valuemax={96}
        aria-valuetext={`${Math.round(pct)}% after`}
        onPointerDown={() => (dragging.current = true)}
        onKeyDown={(e) => {
          // Sprint 6, accesibilidad: el slider debe operarse completo
          // sin mouse — flechas mueven de a 5%, Home/End van a los extremos.
          if (e.key === 'ArrowLeft') setPct((p) => Math.max(4, p - 5));
          if (e.key === 'ArrowRight') setPct((p) => Math.min(96, p + 5));
          if (e.key === 'Home') setPct(4);
          if (e.key === 'End') setPct(96);
        }}
        className="absolute inset-y-0 w-px bg-gold cursor-ew-resize z-10 focus-visible:outline-none"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] rounded-full border border-gold bg-navy flex items-center justify-center gap-[3px] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-navy">
          <span className="w-px h-[11px] bg-gold block" />
          <span className="w-px h-[11px] bg-gold block" />
        </div>
      </div>
    </div>
  );
}
