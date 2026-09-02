// Centralized GROQ queries — one place to see exactly what each page fetches.

// ---------------------------------------------------------
// BUG REAL ENCONTRADO (ver reporte de esta implementación): todo
// campo `mediaAsset` con type:'video' se proyectaba SIN dereferenciar
// el asset de Mux (`video.asset->`). Sin el `->`, Sanity devuelve solo
// `{_ref: "...", _type: "reference"}` — nunca el playbackId real. Eso
// hacía que resolveMedia() en lib/sanity/adapters.ts siempre
// devolviera {} para cualquier video, sin importar qué tan bien
// configurado estuviera el campo en el Studio. Este fragmento
// reusable es el fix — se aplica a TODO campo mediaAsset del sitio,
// no solo al hero, porque el bug era el mismo en cada uno.
// ---------------------------------------------------------
const MEDIA_ASSET_PROJECTION = `{
  type,
  image,
  "video": video{
    asset->{
      "playbackId": playbackId,
      assetId,
      status,
      data
    }
  },
  alt,
  caption
}`;

export const ALL_SERVICES_QUERY = `*[_type == "service" && active == true] | order(displayOrder asc) {
  _id, title, "slug": slug.current, shortDescription, icon, capabilities, ctaContent,
  "heroMedia": heroMedia${MEDIA_ASSET_PROJECTION}, fullContent, seo
}`;

export const SERVICE_BY_SLUG_QUERY = `*[_type == "service" && slug.current == $slug][0] {
  _id, title, "slug": slug.current, shortDescription, icon, capabilities, ctaContent,
  "heroMedia": heroMedia${MEDIA_ASSET_PROJECTION}, fullContent, seo,
  "relatedProjects": relatedProjects[]->{ _id, title, "slug": slug.current, "coverImage": coverImage${MEDIA_ASSET_PROJECTION}, region, country }
}`;

export const ALL_PROJECTS_QUERY = `*[_type == "project"] | order(publishDate desc) {
  _id, title, "slug": slug.current, country, region, "coverImage": coverImage${MEDIA_ASSET_PROJECTION}, vesselMake, vesselModel, featured
}`;

export const PROJECT_BY_SLUG_QUERY = `*[_type == "project" && slug.current == $slug][0] {
  ...,
  "coverImage": coverImage${MEDIA_ASSET_PROJECTION},
  "heroVideo": heroVideo${MEDIA_ASSET_PROJECTION},
  "services": services[]->{ _id, title, "slug": slug.current },
  "testimonial": testimonial->{ customerName, quote, rating }
}`;

export const FEATURED_PROJECT_QUERY = `*[_type == "project" && featured == true] | order(publishDate desc)[0] {
  _id, title, "slug": slug.current, country, region,
  "coverImage": coverImage${MEDIA_ASSET_PROJECTION},
  "heroVideo": heroVideo${MEDIA_ASSET_PROJECTION},
  "services": services[]->{ title }
}`;

export const ALL_INSIGHTS_QUERY = `*[_type == "insight"] | order(publishDate desc) {
  _id, title, "slug": slug.current, category, excerpt, "heroImage": heroImage${MEDIA_ASSET_PROJECTION}, publishDate, readingTime
}`;

export const INSIGHT_BY_SLUG_QUERY = `*[_type == "insight" && slug.current == $slug][0] {
  ...,
  "heroImage": heroImage${MEDIA_ASSET_PROJECTION},
  "author": author->{ name, photo },
  "relatedServices": relatedServices[]->{ title, "slug": slug.current },
  "relatedProjects": relatedProjects[]->{ title, "slug": slug.current }
}`;

export const APPROVED_TESTIMONIALS_QUERY = `*[_type == "testimonial" && approvedForPublication == true] | order(displayOrder asc) {
  _id, customerName, quote, rating, location, vessel, source, customerPhoto,
  "relatedProject": relatedProject->{ title, "slug": slug.current }
}`;

export const ALL_LOCATIONS_QUERY = `*[_type == "location"] {
  _id, country, "slug": slug.current, primaryCity, coordinates, isServiceRegionOnly, description,
  "servicesAvailable": servicesAvailable[]->{ title, "slug": slug.current }
}`;

export const LOCATION_BY_SLUG_QUERY = `*[_type == "location" && slug.current == $slug][0] {
  ...,
  "servicesAvailable": servicesAvailable[]->{ title, "slug": slug.current },
  "featuredProjects": featuredProjects[]->{ title, "slug": slug.current, "coverImage": coverImage${MEDIA_ASSET_PROJECTION}, region }
}`;

export const HOMEPAGE_QUERY = `*[_type == "homepage"][0] {
  _id, _type, _rev,
  "heroMedia": heroMedia${MEDIA_ASSET_PROJECTION},
  heroEyebrow, heroHeadline, heroSubcopy,
  "featuredProject": featuredProject->{ _id, title, "slug": slug.current, country, region, "coverImage": coverImage${MEDIA_ASSET_PROJECTION}, "heroVideo": heroVideo${MEDIA_ASSET_PROJECTION}, "services": services[]->{ title } },
  "highlightedServices": highlightedServices[]->{ _id, title, "slug": slug.current, shortDescription, icon, "heroMedia": heroMedia${MEDIA_ASSET_PROJECTION} },
  "beforeAfterMedia": {
    "before": beforeAfterMedia.before${MEDIA_ASSET_PROJECTION},
    "after": beforeAfterMedia.after${MEDIA_ASSET_PROJECTION}
  },
  marineCloudCopy, marineCloudEyebrow, marineCloudHeading,
  coreExpertiseEyebrow, coreExpertiseHeading, coreExpertiseDescription,
  "selectedProjects": selectedProjects[]->{ _id, title, "slug": slug.current, "coverImage": coverImage${MEDIA_ASSET_PROJECTION}, region },
  "featuredLocations": featuredLocations[]->{ country, "slug": slug.current, primaryCity, coordinates },
  "featuredInsights": featuredInsights[]->{ title, "slug": slug.current, category, "heroImage": heroImage${MEDIA_ASSET_PROJECTION} },
  finalCtaHeadline,
  partnersSection{
    enabled, eyebrow, title, subcopy,
    "partners": partners[]->{
      _id, companyName, logo, websiteUrl, relationshipLabel, location
    }
  }
}`;

export const TECHNOLOGY_CONTENT_QUERY = `*[_type == "technologyContent" && page == $page][0] {
  ...,
  "storyBeats": storyBeats[]{ ..., "media": media${MEDIA_ASSET_PROJECTION} }
}`;

export const NAVIGATION_QUERY = `*[_type == "navigation"][0] { links }`;
export const FOOTER_QUERY = `*[_type == "footer"][0] { tagline, columns }`;
export const GLOBAL_SETTINGS_QUERY = `*[_type == "globalSettings"][0]`;

export const LANDING_PAGE_BY_PATH_QUERY = `*[_type == "landingPage" && fullPath == $path && active == true][0] {
  ...,
  "heroMedia": heroMedia${MEDIA_ASSET_PROJECTION},
  "service": service->{ title, "slug": slug.current, icon },
  "location": location->{ country, "slug": slug.current, primaryCity, coordinates },
  "proofProject": proofProject->{ title, "slug": slug.current, "coverImage": coverImage${MEDIA_ASSET_PROJECTION}, region, problem, diagnosis, solution },
  "testimonial": testimonial->{ customerName, quote, rating, location }
}`;
