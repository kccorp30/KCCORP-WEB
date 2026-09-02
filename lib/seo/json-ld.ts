import { SITE_URL, SITE_NAME } from './metadata';

// IMPORTANT: no invented physical offices, ratings, reviews, prices,
// certifications, or opening hours (Sprint 6, item 6). Every field
// below is either static brand fact (name, url) or passed in from
// actual content — nothing is fabricated to "fill out" the schema.

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    // logo/sameAs (social profiles) intentionally omitted until real
    // URLs exist — see content-placeholder-map.md
  };
}

export function professionalServiceJsonLd(serviceRegions: string[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    url: SITE_URL,
    areaServed: serviceRegions,
    // No address — KCC's locations are SERVICE REGIONS, not physical
    // offices (see lib/data/locations.ts, isServiceRegionOnly). Do
    // not add a `address` field here without confirming a real one.
  };
}

export function serviceJsonLd({ name, description, url }: { name: string; description: string; url: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: name,
    description,
    url,
    provider: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export function articleJsonLd({
  headline,
  description,
  url,
  datePublished,
  image,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    url,
    ...(datePublished && { datePublished }),
    ...(image && { image }),
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
