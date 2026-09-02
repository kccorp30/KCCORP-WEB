import { defineType, defineField } from 'sanity';

export const globalSettings = defineType({
  name: 'globalSettings',
  title: 'Global Settings',
  type: 'document',
  groups: [
    { name: 'contact', title: 'Contact', default: true },
    { name: 'social', title: 'Social' },
    { name: 'seo', title: 'Default SEO' },
  ],
  fields: [
    defineField({ name: 'siteName', title: 'Site Name', type: 'string', group: 'contact' }),
    defineField({
      name: 'whatsappNumber',
      title: 'WhatsApp Number',
      type: 'string',
      description: 'Full number with country code, no symbols (e.g. 13055551234). Leave empty to hide WhatsApp on the site.',
      group: 'contact',
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string', group: 'contact' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact' }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
      group: 'social',
    }),
    defineField({ name: 'defaultSeo', title: 'Default SEO', type: 'seo', group: 'seo' }),
  ],
  preview: { select: { title: 'siteName' } },
});
