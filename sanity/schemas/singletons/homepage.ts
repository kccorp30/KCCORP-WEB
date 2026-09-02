import { defineType, defineField } from 'sanity';

// Singleton — exactly one document, pinned in the Studio structure
// (see sanity/structure.ts). Curated fields, not a free-form page
// builder — per Sprint 5's explicit "brand consistency" requirement.
export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero', default: true },
    { name: 'sections', title: 'Sections' },
  ],
  fields: [
    defineField({ name: 'heroMedia', title: 'Hero Media', type: 'mediaAsset', group: 'hero' }),
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'localeString', group: 'hero' }),
    defineField({ name: 'heroHeadline', title: 'Hero Headline', type: 'localeString', group: 'hero' }),
    defineField({ name: 'heroSubcopy', title: 'Hero Subcopy', type: 'localeString', group: 'hero' }),

    defineField({
      name: 'featuredProject',
      title: 'Featured Project',
      type: 'reference',
      to: [{ type: 'project' }],
      group: 'sections',
    }),
    defineField({
      name: 'highlightedServices',
      title: 'Highlighted Services',
      description: 'Shown in the Core Expertise section. Leave empty to show all active services.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'sections',
    }),
    defineField({ name: 'beforeAfterMedia', title: 'Before / After', type: 'object', group: 'sections', fields: [
      { name: 'before', title: 'Before', type: 'mediaAsset' },
      { name: 'after', title: 'After', type: 'mediaAsset' },
    ]}),
    defineField({ name: 'marineCloudCopy', title: 'Marine Cloud Section Copy', type: 'localeText', group: 'sections' }),
    defineField({
      name: 'coreExpertiseEyebrow',
      title: 'Core Expertise — Eyebrow',
      type: 'localeString',
      group: 'sections',
      description: 'Previously hardcoded as "Capabilities" — now editable.',
    }),
    defineField({
      name: 'coreExpertiseHeading',
      title: 'Core Expertise — Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Previously hardcoded as "Core Expertise" — now editable.',
    }),
    defineField({
      name: 'coreExpertiseDescription',
      title: 'Core Expertise — Description',
      type: 'localeText',
      group: 'sections',
    }),
    defineField({
      name: 'marineCloudEyebrow',
      title: 'Marine Cloud — Eyebrow',
      type: 'localeString',
      group: 'sections',
      description: 'Previously hardcoded as "KCC Marine Cloud" — now editable.',
    }),
    defineField({
      name: 'marineCloudHeading',
      title: 'Marine Cloud — Heading',
      type: 'localeString',
      group: 'sections',
      description: 'Previously hardcoded as "Marine Service. Reimagined." — now editable.',
    }),
    defineField({
      name: 'selectedProjects',
      title: 'Selected Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      group: 'sections',
    }),
    defineField({
      name: 'featuredLocations',
      title: 'Featured Locations',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'location' }] }],
      group: 'sections',
    }),
    defineField({
      name: 'featuredInsights',
      title: 'Featured Insights',
      description: 'Leave empty to show the 3 most recent automatically.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'insight' }] }],
      group: 'sections',
    }),
    defineField({ name: 'finalCtaHeadline', title: 'Final CTA Headline', type: 'localeString', group: 'sections' }),

    defineField({
      name: 'partnersSection',
      title: 'Partners & Collaborators Section',
      type: 'object',
      group: 'sections',
      fields: [
        defineField({
          name: 'enabled',
          title: 'Show this section on the Homepage',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({
          name: 'eyebrow',
          title: 'Eyebrow',
          type: 'localeString',
          description: 'Small label above the title, e.g. "Trusted Collaborations".',
        }),
        defineField({
          name: 'title',
          title: 'Title',
          type: 'localeString',
          description: 'Defaults to "Partners & Collaborators" if left empty — keep the wording neutral (no implied formal partnership) unless intentional.',
        }),
        defineField({ name: 'subcopy', title: 'Subcopy (optional)', type: 'localeText' }),
        defineField({
          name: 'partners',
          title: 'Partners to Display',
          description: 'Select and reorder which active partners appear here. Only "Active" partners can be selected.',
          type: 'array',
          of: [{ type: 'reference', to: [{ type: 'partner' }], options: { filter: 'active == true' } }],
        }),
      ],
    }),
  ],
});
