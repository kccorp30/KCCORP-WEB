'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import clsx from 'clsx';
import { GhostButton } from '../ui/GhostButton';
import { MobileNav } from './MobileNav';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useSiteContent } from '@/lib/sanity/site-content-context';

const LINKS_FALLBACK = [
  { href: '/services', label: 'Services' },
  { href: '/projects', label: 'Projects' },
  { href: '/technology', label: 'Technology' },
  { href: '/about', label: 'About' },
  { href: '/locations', label: 'Locations' },
  { href: '/insights', label: 'Insights' },
];

export function Nav() {
  const { navLinks } = useSiteContent();
  const LINKS = navLinks ?? LINKS_FALLBACK;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-precise border-b',
          scrolled ? 'bg-navy/92 backdrop-blur-md border-white/10' : 'bg-transparent border-transparent',
        )}
      >
        {/* Franja corporativa — fondo propio y siempre estable, no
            participa de la animación de scroll del nav principal. A
            propósito: cuando existan más marcas/productos bajo
            KCCORP, esta franja puede quedar fija en todas, sin
            depender del nav específico de cada una. */}
        <div className="bg-[#050A11] border-b border-white/[0.06]">
          <div className="max-w-wide mx-auto px-5 md:px-10 flex items-center gap-2.5 py-[7px]">
            <span className="font-mono text-[8.5px] uppercase tracking-[0.1em] text-cool-gray">Part of</span>
            <Image src="/logos/kccorp-compact.png" alt="KCCORP" width={240} height={69} className="h-[15px] md:h-[17px] w-auto" />
          </div>
        </div>

        <nav
          className={clsx(
            'max-w-wide mx-auto px-5 md:px-10 flex items-center justify-between transition-[height] duration-250 ease-precise',
            scrolled ? 'h-[52px] md:h-16' : 'h-16 md:h-[76px]',
          )}
        >
          <Link href="/" className="flex items-center">
            <Image
              src="/logos/kcc-marine-solutions-compact.png"
              alt="KCC Marine Solutions"
              width={280}
              height={125}
              priority
              className={clsx('w-auto transition-[height] duration-250 ease-precise', scrolled ? 'h-8 md:h-9' : 'h-9 md:h-11')}
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-7">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-cool-gray text-[11px] uppercase tracking-[0.1em] hover:text-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/contact" className="text-cool-gray text-[11px] uppercase tracking-[0.1em]">
              Contact
            </Link>
            <LanguageSwitcher />
            <GhostButton href="/request-service">Request Service</GhostButton>
          </div>

          <div className="flex lg:hidden items-center gap-2.5">
            <LanguageSwitcher className="font-mono text-[9px] uppercase tracking-[0.08em] text-cool-gray border border-white/10 px-2 py-1.5" />
            <GhostButton
              href="/request-service"
              className={clsx('!whitespace-nowrap transition-all', scrolled ? '!px-2.5 !py-1.5 !text-[8.5px]' : '!px-3 !py-2 !text-[9px]')}
            >
              Request Service
            </GhostButton>
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="border border-white/10 p-2 flex flex-col gap-[3px]"
            >
              <span className="w-4 h-[1.5px] bg-marine-white block" />
              <span className="w-4 h-[1.5px] bg-marine-white block" />
              <span className="w-4 h-[1.5px] bg-marine-white block" />
            </button>
          </div>
        </nav>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} links={LINKS} />
    </>
  );
}
