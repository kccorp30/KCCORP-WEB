'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { useSiteContent } from '@/lib/sanity/site-content-context';

// Fallback columns — used when Sanity's `footer` singleton is empty.
const COLUMNS_FALLBACK = [
  {
    heading: 'Company',
    links: [
      { href: '/about', label: 'About' },
      { href: '/projects', label: 'Projects' },
      { href: '/insights', label: 'Insights' },
      { href: '/contact', label: 'Contact' },
    ],
  },
  {
    heading: 'Technology',
    links: [
      { href: '/technology/marine-cloud', label: 'KCC Marine Cloud' },
      { href: '/technology/luz', label: 'Luz Marine Intelligence' },
    ],
  },
];

export function Footer() {
  const { footerTagline, footerColumns } = useSiteContent();
  const columns = footerColumns ?? COLUMNS_FALLBACK;

  return (
    <footer className="bg-[#050A11] text-marine-white border-t border-white/[0.08]">
      <div className="max-w-wide mx-auto px-6 md:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <Image
            src="/logos/kcc-marine-solutions-full.png"
            alt="KCC Marine Solutions"
            width={640}
            height={389}
            className="w-full max-w-[220px] h-auto mb-4"
          />
          <p className="text-cool-gray text-sm leading-relaxed">
            {footerTagline || 'Marine Electrical · Electronics · Diagnostics · Installations'}
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <div className="text-[10px] uppercase tracking-[0.14em] text-gold mb-4">{col.heading}</div>
            <ul className="space-y-2 text-sm text-cool-gray">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <div className="text-[10px] uppercase tracking-[0.14em] text-gold mb-4">Regions</div>
          <ul className="space-y-2 text-sm text-cool-gray">
            <li>United States</li>
            <li>Dominican Republic</li>
            <li>Panama</li>
            <li>Colombia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/[0.08] py-6">
        <div className="max-w-wide mx-auto px-6 md:px-10 flex flex-col md:flex-row justify-between gap-2 text-[11px] text-cool-gray/60">
          <span>&copy; {new Date().getFullYear()} KCCORP. All rights reserved.</span>
          <span>KCC Marine Solutions</span>
        </div>
      </div>
    </footer>
  );
}
