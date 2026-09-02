'use client';

import { useEffect } from 'react';

const COOKIE_NAME = 'kcc_first_touch';
const COOKIE_MAX_AGE_DAYS = 90;

interface FirstTouch {
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_referrer?: string;
  first_landing_page?: string;
  first_touch_at: string;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

export function getFirstTouch(): FirstTouch | null {
  if (typeof document === 'undefined') return null;
  const raw = getCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Mounted once in the root layout. Fires on every page load, but only
// WRITES the cookie if one doesn't already exist — so the ORIGINAL
// campaign that brought the visitor in is preserved across normal
// navigation (Projects → About → Request Service), never overwritten
// by a later internal page view. See Sprint 6, item 2.
export function FirstTouchCapture() {
  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return; // already captured — never overwrite

    const params = new URLSearchParams(window.location.search);
    const firstTouch: FirstTouch = {
      first_utm_source: params.get('utm_source') ?? undefined,
      first_utm_medium: params.get('utm_medium') ?? undefined,
      first_utm_campaign: params.get('utm_campaign') ?? undefined,
      first_utm_content: params.get('utm_content') ?? undefined,
      first_referrer: document.referrer || undefined,
      first_landing_page: window.location.href,
      first_touch_at: new Date().toISOString(),
    };

    setCookie(COOKIE_NAME, JSON.stringify(firstTouch), COOKIE_MAX_AGE_DAYS);
  }, []);

  return null;
}
