import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { draftMode } from 'next/headers';
import { routing } from '@/i18n/routing';
import { SiteContentProvider } from '@/lib/sanity/site-content-context';
import { fetchWithFallback, pickLocale } from '@/lib/sanity/fetch-with-fallback';
import { NAVIGATION_QUERY, FOOTER_QUERY } from '@/lib/sanity/queries';
import { getGlobalSettings } from '@/lib/sanity/global-settings';
import { AnalyticsProviders } from '@/components/analytics/AnalyticsProviders';
import { FirstTouchCapture } from '@/components/analytics/FirstTouchCapture';
import { VisualEditingWrapper } from '@/components/sanity/VisualEditingWrapper';
import '../globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  weight: ['500', '600', '700'],
  display: 'swap',
});
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  weight: ['400', '500'],
  display: 'swap',
});

// Fix 1 (Sprint 6), done properly: this is now one of TWO independent
// Next.js "root layouts" (see app/studio/layout.tsx for the other).
// There is deliberately NO shared app/layout.tsx anymore — Next.js
// supports multiple root layouts as siblings under app/, each
// rendering its own <html>/<body>, as long as neither has a shared
// parent layout that also does. This is what lets `lang` come from
// the STATIC `locale` param (known at build time via
// generateStaticParams below) instead of a dynamic `headers()` call
// — which would have forced every page to render on-demand instead
// of statically, hurting performance for no real benefit.

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);

  const { isEnabled: isPreview } = await draftMode();

  const [navDoc, footerDoc, settings] = await Promise.all([
    fetchWithFallback<any>(NAVIGATION_QUERY, {}, null),
    fetchWithFallback<any>(FOOTER_QUERY, {}, null),
    getGlobalSettings(),
  ]);

  const navLinks = navDoc?.links?.length
    ? navDoc.links.map((l: any) => ({ href: l.href, label: pickLocale(l.label, locale) }))
    : null;
  const footerColumns = footerDoc?.columns?.length
    ? footerDoc.columns.map((c: any) => ({
        heading: pickLocale(c.heading, locale),
        links: (c.links ?? []).map((l: any) => ({ href: l.href, label: pickLocale(l.label, locale) })),
      }))
    : null;
  const footerTagline = footerDoc?.tagline ? pickLocale(footerDoc.tagline, locale) : null;

  return (
    <html lang={locale} className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrains.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <AnalyticsProviders />
        <FirstTouchCapture />
        {/* Solo se monta detrás de draft mode — Sanity Presentation lo
            activa vía app/api/draft-mode/enable. Un visitante normal
            nunca recibe este bundle ni los overlays. */}
        {isPreview && <VisualEditingWrapper />}
        <NextIntlClientProvider>
          <SiteContentProvider
            value={{
              navLinks,
              footerTagline,
              footerColumns,
              // Fix 2 (Sprint 6): ONE resolved contact config, fetched
              // once here (Sanity primary, env vars fallback via
              // getGlobalSettings), passed to every client component
              // through context. The wizard's success screen used to
              // read env vars directly, bypassing Sanity — it now
              // reads from here instead, same as everything else.
              whatsapp: settings.whatsapp,
            }}
          >
            {children}
          </SiteContentProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
