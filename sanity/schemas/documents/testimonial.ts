import { defineType, defineField } from 'sanity';

export const testimonial = defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'customerName', title: 'Customer Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'quote', title: 'Quote', type: 'text', rows: 4, validation: (r) => r.required() }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (r) => r.min(1).max(5) }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'vessel', title: 'Vessel (optional)', type: 'string' }),
    defineField({ name: 'relatedProject', title: 'Related Project (optional)', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'source', title: 'Source', type: 'string', options: { list: ['Google', 'Direct', 'Referral', 'Other'] } }),
    defineField({ name: 'customerPhoto', title: 'Customer Photo (optional)', type: 'image' }),
    defineField({
      name: 'verified',
      title: 'Verified',
      type: 'boolean',
      initialValue: false,
      description: 'Confirms this is a real, verified customer experience.',
    }),
    defineField({
      name: 'approvedForPublication',
      title: 'Approved for Publication',
      type: 'boolean',
      initialValue: false,
      description:
        'REQUIRED to show publicly. The testimonial section on the website only renders testimonials where this is true — nothing shows by default.',
    }),
    defineField({ name: 'displayOrder', title: 'Display Order', type: 'number' }),
  ],
  preview: {
    select: { title: 'customerName', subtitle: 'quote', approved: 'approvedForPublication' },
    prepare({ title, subtitle, approved }) {
      return { title: approved ? title : `${title} (NOT approved — hidden)`, subtitle };
    },
  },
});
