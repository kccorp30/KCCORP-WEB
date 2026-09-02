import { defineType, defineField, defineArrayMember } from 'sanity';

const richTextBlock = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'Quote', value: 'blockquote' },
  ],
  marks: {
    decorators: [
      { title: 'Bold', value: 'strong' },
      { title: 'Italic', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [{ name: 'href', type: 'url', title: 'URL' }],
      },
    ],
  },
});

const richTextImage = defineArrayMember({
  type: 'image',
  options: { hotspot: true },
  fields: [
    { name: 'alt', type: 'string', title: 'Alt text' },
    { name: 'caption', type: 'string', title: 'Caption' },
  ],
});

export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized Article Body',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations' }],
  fields: [
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [richTextBlock, richTextImage],
      fieldset: 'translations',
    }),
    defineField({
      name: 'es',
      title: 'Español',
      type: 'array',
      of: [richTextBlock, richTextImage],
      fieldset: 'translations',
    }),
  ],
});
