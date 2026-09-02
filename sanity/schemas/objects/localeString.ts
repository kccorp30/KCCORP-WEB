import { defineType, defineField } from 'sanity';

// Reusable localized short-text field. Renders as tabbed fields in
// Sanity Studio (via fieldsets) so it's always obvious which
// language is being edited — per Sprint 5 requirement.
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized Text',
  type: 'object',
  fieldsets: [{ name: 'translations', title: 'Translations', options: { columns: 2 } }],
  fields: [
    defineField({ name: 'en', title: 'English', type: 'string', fieldset: 'translations' }),
    defineField({ name: 'es', title: 'Español', type: 'string', fieldset: 'translations' }),
  ],
});
