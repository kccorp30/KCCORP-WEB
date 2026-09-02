import { defineType, defineField } from 'sanity';

export const localeText = defineType({
  name: 'localeText',
  title: 'Localized Text (long)',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { columns: 2 } }],
  fields: [
    defineField({ name: 'en', title: 'English', type: 'text', rows: 4, fieldset: 'translations' }),
    defineField({ name: 'es', title: 'Español', type: 'text', rows: 4, fieldset: 'translations' }),
  ],
});
