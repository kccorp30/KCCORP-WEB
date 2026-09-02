import { defineType, defineField } from 'sanity';

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'media', title: 'Media' },
    { name: 'relations', title: 'Related' },
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
    defineField({ name: 'shortDescription', title: 'Short Description (for lists/cards)', type: 'localeString', group: 'content' }),
    defineField({ name: 'fullContent', title: 'Full Content', type: 'localeBlockContent', group: 'content' }),
    defineField({
      name: 'capabilities',
      title: 'Capabilities',
      description: 'Short bullet list shown on the service detail page.',
      type: 'array',
      of: [{ type: 'localeString' }],
      group: 'content',
    }),
    defineField({ name: 'ctaContent', title: 'CTA Text', type: 'localeString', group: 'content' }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'string',
      options: { list: ['bolt', 'radar', 'pulse', 'compass', 'speaker', 'bulb', 'battery', 'pump', 'wrench'] },
      group: 'content',
    }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number', group: 'content' }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Inactive services are hidden from all public listings.',
      group: 'content',
    }),
    defineField({ name: 'heroMedia', title: 'Hero Image/Video', type: 'mediaAsset', group: 'media' }),
    defineField({
      name: 'relatedServices',
      title: 'Related Services',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
      group: 'relations',
    }),
    defineField({
      name: 'relatedProjects',
      title: 'Related Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      group: 'relations',
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title.en', subtitle: 'shortDescription.en', active: 'active' },
    prepare({ title, subtitle, active }) {
      return { title: active ? title : `${title} (inactive)`, subtitle };
    },
  },
});
