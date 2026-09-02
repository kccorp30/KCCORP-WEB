import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { RequestServiceWizard } from '@/components/forms/RequestServiceWizard';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: 'Request Service',
    description: 'Tell us about your vessel and what you need — get started with KCC in a few quick steps.',
    path: '/request-service',
    locale: locale as 'en' | 'es',
  });
}

export default function RequestServicePage() {
  return (
    <>
      <Nav />
      <div id="main-content" tabIndex={-1} className="pt-14">
        <RequestServiceWizard />
      </div>
      <Footer />
    </>
  );
}
