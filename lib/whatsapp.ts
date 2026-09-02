// Pure, client-safe helper — no data fetching, no 'server-only'
// import, so both server code (lib/sanity/global-settings.ts) and
// client components (RequestServiceWizard) can share the exact same
// link-building logic instead of each reimplementing it.
export function getWhatsAppLinkFor(whatsapp: string | null, message?: string): string | null {
  if (!whatsapp) return null;
  const base = `https://wa.me/${whatsapp}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
