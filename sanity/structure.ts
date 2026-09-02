import type { StructureResolver } from 'sanity/structure';

// Custom structure — matches the brief's requested organization
// exactly (CONTENT / WEBSITE / MEDIA & SETTINGS), not Sanity's
// default alphabetical document list. Singletons are pinned to
// their single document ID so KCC never accidentally creates a
// second "Homepage" by mistake.

export const structure: StructureResolver = (S) =>
  S.list()
    .title('KCCORP Content')
    .items([
      S.listItem()
        .title('Content')
        .child(
          S.list()
            .title('Content')
            .items([
              S.listItem().title('Projects').child(S.documentTypeList('project').title('Projects')),
              S.listItem().title('Services').child(S.documentTypeList('service').title('Services')),
              S.listItem().title('Insights').child(S.documentTypeList('insight').title('Insights')),
              S.listItem().title('Testimonials').child(S.documentTypeList('testimonial').title('Testimonials')),
              S.listItem().title('Partners & Collaborators').child(S.documentTypeList('partner').title('Partners & Collaborators')),
              S.listItem().title('Authors').child(S.documentTypeList('author').title('Authors')),
              S.listItem().title('Campaign Landing Pages').child(S.documentTypeList('landingPage').title('Campaign Landing Pages')),
            ]),
        ),
      S.listItem()
        .title('Website')
        .child(
          S.list()
            .title('Website')
            .items([
              S.listItem()
                .title('Homepage')
                .child(S.document().schemaType('homepage').documentId('homepage-singleton')),
              S.listItem()
                .title('Technology — Marine Cloud')
                .child(S.document().schemaType('technologyContent').documentId('technology-marine-cloud')),
              S.listItem()
                .title('Technology — Luz')
                .child(S.document().schemaType('technologyContent').documentId('technology-luz')),
              S.listItem().title('Locations').child(S.documentTypeList('location').title('Locations')),
              S.listItem()
                .title('Navigation')
                .child(S.document().schemaType('navigation').documentId('navigation-singleton')),
              S.listItem().title('Footer').child(S.document().schemaType('footer').documentId('footer-singleton')),
            ]),
        ),
      S.listItem()
        .title('Settings')
        .child(
          S.list()
            .title('Settings')
            .items([
              S.listItem()
                .title('Global Settings')
                .child(S.document().schemaType('globalSettings').documentId('global-settings-singleton')),
            ]),
        ),
    ]);
