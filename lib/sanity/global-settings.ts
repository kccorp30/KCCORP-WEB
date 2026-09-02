import 'server-only';
import { fetchWithFallback } from '@/lib/sanity/fetch-with-fallback';
import { GLOBAL_SETTINGS_QUERY } from '@/lib/sanity/queries';
import { contactConfig } from '@/lib/config/contact';
export { getWhatsAppLinkFor } from '@/lib/whatsapp';

// Server-only. Sanity's `globalSettings` singleton is the primary
// source for contact info; env vars in lib/config/contact.ts are the
// fallback. Fix 2 (Sprint 6): the resolved `whatsapp` number from
// here now flows into SiteContentProvider (app/[locale]/layout.tsx)
// so client components — including the wizard's success screen —
// read the SAME resolved value instead of independently reading env
// vars. Link-building itself lives in lib/whatsapp.ts (client-safe,
// shared by both this file and the wizard).
export async function getGlobalSettings() {
  const cms = await fetchWithFallback<any>(GLOBAL_SETTINGS_QUERY, {}, null);

  return {
    siteName: cms?.siteName ?? 'KCCORP',
    whatsapp: cms?.whatsappNumber || contactConfig.whatsapp,
    phone: cms?.phone || contactConfig.phone,
    email: cms?.email || contactConfig.email,
    socialLinks: cms?.socialLinks ?? [],
    serviceRegions: contactConfig.serviceRegions,
  };
}
