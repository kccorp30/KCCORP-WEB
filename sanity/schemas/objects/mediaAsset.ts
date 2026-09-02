import { defineType, defineField } from 'sanity';

// Single reusable "media" field: editor picks image OR Mux video,
// alt/caption travel with it. Used anywhere Sprint 3/4's
// MediaSurface / ProductScreenshot components need real content.
export const mediaAsset = defineType({
  name: 'mediaAsset',
  title: 'Media',
  type: 'object',
  fields: [
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: { list: ['image', 'video'], layout: 'radio' },
      initialValue: 'image',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.type !== 'image',
    }),
    defineField({
      name: 'video',
      title: 'Video (Mux)',
      type: 'mux.video', // provided by sanity-plugin-mux-input
      hidden: ({ parent }) => parent?.type !== 'video',
    }),
    defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
});
