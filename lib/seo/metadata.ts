import type { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://kccorp.com';
const SITE_NAME = 'KCCORP';
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`; // placeholder — see content-placeholder-map.md

interface BuildMetadataInput {
  title: string;
  description: string;
  path: string; // e.g. '/services/marine-electrical' — WITHOUT locale prefix
  locale: 'en' | 'es';
  image?: string;
  noindex?: boolean;
}

// Single source of truth for metadata shape across every page — per
// Sprint 6 item 5 ("Avoid duplicated titles/descriptions across
// dynamic content"). CMS `seo` fields (see sanity/schemas/objects/seo.ts)
// override title/description/image when present; callers pass the
// content-derived fallback (page title, excerpt, cover image) as the
// `title`/`description`/`image` args here — this function doesn't
// know about Sanity, it just assembles what it's given consistently.
export function buildMetadata({ title, description, path, locale, image, noindex }: BuildMetadataInput): Metadata {
  const canonicalPath = locale === 'es' ? `/es${path}` : path;
  const canonical = `${SITE_URL}${canonicalPath}`;
  const ogImage = image || DEFAULT_OG_IMAGE;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical,
      languages: {
        en: `${SITE_URL}${path}`,
        es: `${SITE_URL}/es${path}`,
        'x-default': `${SITE_URL}${path}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      images: [{ url: ogImage }],
      locale: locale === 'es' ? 'es_ES' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
    robots: noindex ? { index: false, follow: false } : { index: true, follow: true },
  };
}

export { SITE_URL, SITE_NAME };
