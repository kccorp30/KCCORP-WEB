import { defineType, defineField } from 'sanity';

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({ name: 'tagline', title: 'Tagline', type: 'localeString' }),
    defineField({
      name: 'columns',
      title: 'Link Columns',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'localeString' },
            {
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    { name: 'label', title: 'Label', type: 'localeString' },
                    { name: 'href', title: 'Link', type: 'string' },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
});
