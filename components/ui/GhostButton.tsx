'use client';

import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { track } from '@/lib/analytics/track';
import type { AnalyticsEvent } from '@/lib/analytics/events';

interface GhostButtonProps {
  href: string;
  children: React.ReactNode;
  tone?: 'gold' | 'white'; // white = secondary hero CTA ("Explore Our Work")
  className?: string;
  // Serializable event name, not a function — a function prop can't
  // cross from a Server Component into this Client Component. The
  // component fires its own track() call internally.
  trackEvent?: AnalyticsEvent;
}

export function GhostButton({ href, children, tone = 'gold', className, trackEvent }: GhostButtonProps) {
  return (
    <Link
      href={href}
      onClick={trackEvent ? () => track(trackEvent) : undefined}
      className={clsx(
        'inline-flex items-center gap-1.5 px-4 py-[9px] text-[10.5px] font-semibold tracking-[0.1em] uppercase whitespace-nowrap',
        'transition-all duration-200 ease-precise',
        tone === 'gold' && 'border border-gold-dim text-gold hover:bg-gold hover:text-navy hover:border-gold',
        tone === 'white' && 'border border-marine-white/35 text-marine-white hover:border-gold hover:text-gold',
        className,
      )}
    >
      {children}
    </Link>
  );
}
