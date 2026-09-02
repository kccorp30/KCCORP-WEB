'use client';

import { useEffect } from 'react';
import { track } from '@/lib/analytics/track';
import type { AnalyticsEvent } from '@/lib/analytics/events';

// Drop this into any server-rendered page to fire a view event once,
// without converting the whole page to a client component.
export function PageViewTracker({ event, payload }: { event: AnalyticsEvent; payload?: Record<string, unknown> }) {
  useEffect(() => {
    track(event, payload);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
