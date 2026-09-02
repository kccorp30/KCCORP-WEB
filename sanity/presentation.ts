import { defineLocations, type PresentationPluginOptions } from 'sanity/presentation';

// Mapea cada tipo de documento a las URLs reales donde se puede ver
// (EN sin prefijo, ES con /es — mismo esquema de next-intl que usa el
// resto del sitio). Esto es lo que le permite al editor, parado en un
// documento, abrir "Preview" y terminar en la página correcta — y
// también lo que arma el árbol de navegación del panel Presentation.

export const presentationLocations: PresentationPluginOptions['resolve'] = {
  locations: {
    homepage: defineLocations({
      locations: [{ title: 'Homepage', href: '/' }],
    }),
    service: defineLocations({
      select: { title: 'title.en', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled Service', href: `/services/${doc?.slug}` },
          { title: `${doc?.title || 'Untitled Service'} (ES)`, href: `/es/services/${doc?.slug}` },
          { title: 'Services (index)', href: '/services' },
        ],
      }),
    }),
    project: defineLocations({
      select: { title: 'title.en', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled Project', href: `/projects/${doc?.slug}` },
          { title: `${doc?.title || 'Untitled Project'} (ES)`, href: `/es/projects/${doc?.slug}` },
          { title: 'Projects (index)', href: '/projects' },
        ],
      }),
    }),
    insight: defineLocations({
      select: { title: 'title.en', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.title || 'Untitled Insight', href: `/insights/${doc?.slug}` },
          { title: `${doc?.title || 'Untitled Insight'} (ES)`, href: `/es/insights/${doc?.slug}` },
          { title: 'Insights (index)', href: '/insights' },
        ],
      }),
    }),
    location: defineLocations({
      select: { city: 'primaryCity', slug: 'slug.current' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.city || 'Untitled Location', href: `/locations/${doc?.slug}` },
          { title: `${doc?.city || 'Untitled Location'} (ES)`, href: `/es/locations/${doc?.slug}` },
          { title: 'Locations (index)', href: '/locations' },
        ],
      }),
    }),
    landingPage: defineLocations({
      select: { name: 'internalName', path: 'fullPath' },
      resolve: (doc) => ({
        locations: [
          { title: doc?.name || 'Untitled Landing Page', href: `/${doc?.path}` },
          { title: `${doc?.name || 'Untitled Landing Page'} (ES)`, href: `/es/${doc?.path}` },
        ],
      }),
    }),
    technologyContent: defineLocations({
      select: { page: 'page' },
      resolve: (doc) => {
        const path = doc?.page === 'luz' ? '/technology/luz' : '/technology/marine-cloud';
        return {
          locations: [
            { title: `Technology — ${doc?.page ?? ''}`, href: path },
            { title: `Technology — ${doc?.page ?? ''} (ES)`, href: `/es${path}` },
          ],
        };
      },
    }),
    // Singletons que afectan TODO el sitio, no una página propia —
    // se anclan al homepage como referencia razonable de dónde
    // previsualizar su efecto (ej. navigation/footer se ven en
    // cualquier página, pero hay que elegir alguna).
    navigation: defineLocations({ locations: [{ title: 'Homepage (nav appears everywhere)', href: '/' }] }),
    footer: defineLocations({ locations: [{ title: 'Homepage (footer appears everywhere)', href: '/' }] }),
    globalSettings: defineLocations({ locations: [{ title: 'Homepage', href: '/' }] }),
    // partner no tiene página propia — su único lugar visible hoy es
    // la sección de Partners & Collaborators del homepage.
    partner: defineLocations({
      select: { name: 'companyName' },
      resolve: (doc) => ({
        locations: [{ title: `${doc?.name || 'Partner'} — shown on Homepage`, href: '/' }],
      }),
    }),
  },
};
