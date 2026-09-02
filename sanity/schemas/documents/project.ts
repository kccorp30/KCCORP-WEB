import { defineType, defineField } from 'sanity';

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'vessel', title: 'Vessel' },
    { name: 'caseStudy', title: 'Case Study' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.en', maxLength: 96 },
      group: 'content',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'country', title: 'Country', type: 'string', group: 'content' }),
    defineField({ name: 'region', title: 'Region / City', type: 'string', group: 'content' }),
    defineField({
      name: 'services',
      title: 'Service Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'content',
    }),
    defineField({ name: 'featured', title: 'Featured on Homepage', type: 'boolean', initialValue: false, group: 'content' }),
    defineField({ name: 'publishDate', title: 'Publish Date', type: 'date', group: 'content' }),

    defineField({ name: 'vesselMake', title: 'Make', type: 'string', group: 'vessel' }),
    defineField({ name: 'vesselModel', title: 'Model', type: 'string', group: 'vessel' }),
    defineField({ name: 'vesselYear', title: 'Year', type: 'number', group: 'vessel' }),
    defineField({ name: 'vesselName', title: 'Vessel Name (optional)', type: 'string', group: 'vessel' }),

    defineField({ name: 'problem', title: 'Problem', type: 'localeText', group: 'caseStudy' }),
    defineField({ name: 'diagnosis', title: 'Diagnosis', type: 'localeText', group: 'caseStudy' }),
    defineField({ name: 'solution', title: 'Solution', type: 'localeText', group: 'caseStudy' }),
    defineField({
      name: 'process',
      title: 'Process Steps',
      type: 'array',
      of: [{ type: 'localeString' }],
      group: 'caseStudy',
    }),
    defineField({
      name: 'installedEquipment',
      title: 'Installed Equipment',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'caseStudy',
    }),
    defineField({ name: 'result', title: 'Result', type: 'localeText', group: 'caseStudy' }),
    defineField({
      name: 'testimonial',
      title: 'Related Testimonial',
      type: 'reference',
      to: [{ type: 'testimonial' }],
      group: 'caseStudy',
    }),

    defineField({ name: 'coverImage', title: 'Cover Image', type: 'mediaAsset', group: 'media' }),
    defineField({ name: 'heroVideo', title: 'Hero Video (optional, overrides cover)', type: 'mediaAsset', group: 'media' }),
    defineField({ name: 'gallery', title: 'Gallery', type: 'array', of: [{ type: 'mediaAsset' }], group: 'media' }),
    defineField({ name: 'beforeMedia', title: 'Before', type: 'mediaAsset', group: 'media' }),
    defineField({ name: 'afterMedia', title: 'After', type: 'mediaAsset', group: 'media' }),

    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'region', media: 'coverImage.image' },
  },
});
