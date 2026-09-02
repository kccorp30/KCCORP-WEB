'use client';

import { createContext, useContext } from 'react';

interface NavLink {
  href: string;
  label: string;
}

interface FooterColumn {
  heading: string;
  links: NavLink[];
}

interface SiteContentValue {
  navLinks: NavLink[] | null; // null = use hardcoded fallback
  footerTagline: string | null;
  footerColumns: FooterColumn[] | null;
  whatsapp: string | null; // already-resolved (Sanity primary, env fallback) — see Fix 2, Sprint 6. Build links with lib/whatsapp.ts
}

const SiteContentContext = createContext<SiteContentValue>({
  navLinks: null,
  footerTagline: null,
  footerColumns: null,
  whatsapp: null,
});

export function SiteContentProvider({ value, children }: { value: SiteContentValue; children: React.ReactNode }) {
  return <SiteContentContext.Provider value={value}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
