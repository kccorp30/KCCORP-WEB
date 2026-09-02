import { defineType, defineField } from 'sanity';

// Reusable landing-page system (Sprint 6, item 1). Each document
// renders at a full path like /marine-electrical/florida — the path
// itself is a field (`fullPath`), not derived from folder structure,
// so KCC can create /marine-services/panama, /boat-diagnostics/miami,
// etc. without a developer creating a new React page each time.
export const landingPage = defineType({
  name: 'landingPage',
  title: 'Campaign Landing Page',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'tracking', title: 'Tracking' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'internalName', title: 'Internal Campaign Name', type: 'string', group: 'content' }),
    defineField({
      name: 'fullPath',
      title: 'Full URL Path',
      type: 'string',
      description: 'Without locale prefix or leading slash, e.g. "marine-electrical/fort-lauderdale"',
      validation: (r) => r.required(),
      group: 'content',
    }),
    defineField({ name: 'active', title: 'Active', type: 'boolean', initialValue: true, group: 'content' }),
    defineField({
      name: 'service',
      title: 'Related Service',
      type: 'reference',
      to: [{ type: 'service' }],
      group: 'content',
    }),
    defineField({
      name: 'location',
      title: 'Related Location',
      type: 'reference',
      to: [{ type: 'location' }],
      group: 'content',
    }),
    defineField({ name: 'heroMedia', title: 'Hero Media', type: 'mediaAsset', group: 'content' }),
    defineField({ name: 'headline', title: 'Headline', type: 'localeString', group: 'content' }),
    defineField({ name: 'subheadline', title: 'Subheadline', type: 'localeString', group: 'content' }),
    defineField({
      name: 'proofProject',
      title: 'Proof Project',
      type: 'reference',
      to: [{ type: 'project' }],
      group: 'content',
    }),
    defineField({ name: 'showBeforeAfter', title: 'Show Before/After', type: 'boolean', initialValue: false, group: 'content' }),
    defineField({
      name: 'testimonial',
      title: 'Testimonial (optional)',
      type: 'reference',
      to: [{ type: 'testimonial' }],
      group: 'content',
    }),
    defineField({ name: 'ctaText', title: 'CTA Text', type: 'localeString', group: 'content' }),

    defineField({
      name: 'campaignTracking',
      title: 'Default Campaign Attribution',
      description: 'Pre-fills source/medium/campaign if the visitor arrives without their own UTM params.',
      type: 'object',
      group: 'tracking',
      fields: [
        { name: 'source', title: 'Source', type: 'string' },
        { name: 'medium', title: 'Medium', type: 'string' },
        { name: 'campaign', title: 'Campaign', type: 'string' },
      ],
    }),

    defineField({ name: 'noIndex', title: 'Hide from search engines', type: 'boolean', initialValue: true, group: 'seo' }),
    defineField({ name: 'seo', title: 'SEO', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'internalName', subtitle: 'fullPath', active: 'active' },
    prepare({ title, subtitle, active }) {
      return { title: active ? title : `${title} (inactive)`, subtitle: `/${subtitle}` };
    },
  },
});
