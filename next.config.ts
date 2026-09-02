import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' }, // Sprint 5 — media real vía Sanity
    ],
  },
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default withNextIntl(nextConfig);
