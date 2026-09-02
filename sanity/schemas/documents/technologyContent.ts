import { defineType, defineField } from 'sanity';

export const technologyContent = defineType({
  name: 'technologyContent',
  title: 'Technology Page',
  type: 'document',
  fields: [
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
      options: { list: ['marine-cloud', 'luz'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'localeString' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'localeString' }),
    defineField({ name: 'body', title: 'Body Copy', type: 'localeText' }),

    // Marine Cloud specific — the 5-act story
    defineField({
      name: 'storyBeats',
      title: 'Story Beats (Marine Cloud only)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'num', title: 'Number', type: 'string' },
            { name: 'title', title: 'Title', type: 'localeString' },
            { name: 'description', title: 'Description', type: 'localeText' },
            { name: 'media', title: 'Screenshot', type: 'mediaAsset' },
            { name: 'device', title: 'Device Frame', type: 'string', options: { list: ['desktop', 'mobile'] } },
            { name: 'annotation', title: 'Annotation Label', type: 'string' },
          ],
        },
      ],
    }),

    // Luz specific — honest capability split
    defineField({
      name: 'currentCapabilities',
      title: 'Current Capabilities (Luz only)',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),
    defineField({
      name: 'plannedCapabilities',
      title: 'Planned / Evolving Capabilities (Luz only)',
      type: 'array',
      of: [{ type: 'localeString' }],
    }),

    defineField({ name: 'mockupImages', title: 'Additional Screenshots', type: 'array', of: [{ type: 'mediaAsset' }] }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo' }),
  ],
  preview: { select: { title: 'page' } },
});
