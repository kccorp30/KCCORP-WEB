'use client';

import type { AnalyticsEvent } from './events';

// Central dispatcher. Components call `track(event, payload)` — never
// `window.fbq`/`window.gtag` directly. Adding/removing/replacing a
// provider means editing ONLY this file. Each provider is a no-op if
// its script never loaded (missing env var — see AnalyticsProviders.tsx),
// so the site works normally with zero, one, or all providers enabled.
//
// Payload discipline: only pass what's needed to understand the event
// (a service slug, a step number, a country). Never pass name, email,
// phone, or free-text description — those are exactly the kind of
// "unnecessary sensitive information" the brief warns against.
export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;

  // Meta Pixel
  if (typeof (window as any).fbq === 'function') {
    (window as any).fbq('trackCustom', event, payload);
  }

  // Google Analytics (GA4)
  if (typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', event, payload);
  }

  if (process.env.NODE_ENV === 'development') {
    // eslint-disable-next-line no-console
    console.log('[analytics]', event, payload);
  }
}

// Fires a GA4/Google Ads-style "conversion" specifically for the one
// event that matters for ad spend measurement — kept separate from
// `track()` because conversion events need the Ads conversion ID/label,
// not just the GA4 measurement ID (see docs/analytics-setup.md).
export function trackConversion(conversionLabel?: string) {
  if (typeof window === 'undefined') return;
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (adsId && typeof (window as any).gtag === 'function') {
    (window as any).gtag('event', 'conversion', {
      send_to: conversionLabel ? `${adsId}/${conversionLabel}` : adsId,
    });
  }
}
