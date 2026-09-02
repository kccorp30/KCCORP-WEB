import { defineType, defineField } from 'sanity';

export const insight = defineType({
  name: 'insight',
  title: 'Insight',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
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
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: ['Marine Electrical', 'Electronics', 'Maintenance', 'Diagnostics', 'Navigation', 'Technology'],
      },
      group: 'content',
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'localeString', group: 'content' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'mediaAsset', group: 'content' }),
    defineField({ name: 'author', title: 'Author', type: 'reference', to: [{ type: 'author' }], group: 'content' }),
    defineField({ name: 'publishDate', title: 'Publish Date', type: 'datetime', group: 'content' }),
    defineField({
      name: 'readingTime',
      title: 'Reading Time (minutes)',
      type: 'number',
      description: 'Leave empty to estimate automatically from body length.',
      group: 'content',
    }),
    defineField({ name: 'body', title: 'Article Body', type: 'localeBlockContent', group: 'content' }),
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
    select: { title: 'title.en', subtitle: 'category', media: 'heroImage.image' },
  },
});
