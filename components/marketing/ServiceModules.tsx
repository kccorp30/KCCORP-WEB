'use client';

import { useState } from 'react';
import { SERVICES } from '@/lib/data/services';
import { ServiceIcon } from './ServiceIcon';

// Fuente única: importa de lib/data/services.ts en vez de mantener
// su propio array duplicado (corrección de la revisión técnica de
// Sprint 2 — dos fuentes de verdad para lo mismo era un riesgo real
// cuando Sanity reemplace esto en Sprint 5).
export function ServiceModules() {
  const [active, setActive] = useState(0);
  const activeService = SERVICES[active];

  return (
    <div className="mt-9 grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-0">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2.5">
        {SERVICES.map((s, i) => (
          <div
            key={s.slug}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
            className={`bg-white/[0.03] backdrop-blur-[6px] border p-[22px] flex gap-[18px] items-start cursor-pointer transition-all duration-200 ease-precise ${
              active === i ? 'bg-white/[0.05] border-gold/35 -translate-y-0.5' : 'border-white/[0.08]'
            }`}
          >
            <ServiceIcon type={s.icon} bg={s.color} />
            <div>
              <div className="font-mono text-[10px] text-gold tracking-[0.1em]">{s.num}</div>
              <div className="font-display text-[17px] font-semibold uppercase mt-1 tracking-tight">{s.title}</div>
              <div className="text-xs text-cool-gray mt-[5px]">{s.spec}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Shared visual panel — hover on desktop, tap on mobile via the same state.
          When activeService.imageUrl exists (Sprint 5), it renders instead
          of the gradient — no layout change needed. */}
      <div className="hidden lg:block relative aspect-[4/3] overflow-hidden">
        {activeService.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeService.imageUrl}
            alt={activeService.title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
          />
        ) : (
          <div
            className="absolute inset-0 transition-[background] duration-300 ease-precise"
            style={{ background: `linear-gradient(135deg, ${activeService.color}, #070E18)` }}
          />
        )}
        <div className="absolute bottom-5 left-5 font-mono text-[10px] uppercase tracking-[0.1em] text-marine-white bg-navy/50 px-3 py-1.5">
          {activeService.title}
        </div>
      </div>
    </div>
  );
}
