'use client';

import { track } from '@/lib/analytics/track';
import type { AnalyticsEvent } from '@/lib/analytics/events';

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  event: AnalyticsEvent;
  payload?: Record<string, unknown>;
  children: React.ReactNode;
}

// Small client wrapper so Server Components (like the Contact page)
// can still fire analytics events on click without becoming client
// components themselves.
export function TrackedLink({ event, payload, children, ...anchorProps }: TrackedLinkProps) {
  return (
    <a {...anchorProps} onClick={() => track(event, payload)}>
      {children}
    </a>
  );
}
