import { defineType, defineField } from 'sanity';

// Regla de marca importante (pedido explícito): el copy de la sección
// nunca debe implicar sociedad legal formal, certificación, endoso, o
// propiedad a menos que el editor lo escriba explícitamente. El campo
// `relationshipLabel` es deliberadamente un texto libre corto, no una
// lista fija de términos legales — el editor controla exactamente qué
// dice, y el label por defecto de la sección (ver homepage.ts) es
// neutral ("Partners & Collaborators").
export const partner = defineType({
  name: 'partner',
  title: 'Partner / Collaborator',
  type: 'document',
  fields: [
    defineField({ name: 'companyName', title: 'Company Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true }, validation: (r) => r.required() }),
    defineField({ name: 'websiteUrl', title: 'Website URL', type: 'url' }),
    defineField({
      name: 'relationshipLabel',
      title: 'Relationship Label (optional)',
      type: 'localeString',
      description:
        'Short, factual label only — e.g. "Partner", "Technology Partner", "Collaborator", "Service Partner". Never implies formal legal partnership, certification, or endorsement beyond what is explicitly written here.',
    }),
    defineField({ name: 'location', title: 'Location (optional)', type: 'string' }),
    defineField({
      name: 'active',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
      description: 'Only active partners can be selected into the Homepage section.',
    }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'companyName', media: 'logo', active: 'active' },
    prepare({ title, media, active }) {
      return { title: active ? title : `${title} (inactive)`, media };
    },
  },
});
