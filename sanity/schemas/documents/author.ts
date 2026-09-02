import { defineType, defineField } from 'sanity';

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'photo', title: 'Photo', type: 'image' }),
  ],
  preview: { select: { title: 'name', media: 'photo' } },
});
