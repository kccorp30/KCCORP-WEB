import { defineType, defineField } from 'sanity';

export const location = defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  fields: [
    defineField({ name: 'country', title: 'Country', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'country', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'primaryCity', title: 'Primary City', type: 'string' }),
    defineField({ name: 'coordinates', title: 'Coordinates', type: 'string', description: 'e.g. "25.77° N, 80.19° W"' }),
    defineField({
      name: 'isServiceRegionOnly',
      title: 'Service Region Only (no physical office)',
      type: 'boolean',
      initialValue: true,
      description: 'When true, the site shows "Serving boat owners in..." language, never an invented address.',
    }),
    defineField({ name: 'description', title: 'Description', type: 'localeText' }),
    defineField({
      name: 'servicesAvailable',
      title: 'Services Available',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'service' }] }],
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Projects',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
    }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'country', subtitle: 'primaryCity' } },
});
