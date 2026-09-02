'use client';

import { Link } from '@/i18n/navigation';
import { GhostButton } from '../ui/GhostButton';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from './LanguageSwitcher';

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export function MobileNav({ open, onClose, links }: MobileNavProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-navy flex flex-col p-5">
      <div className="flex items-center justify-between h-14">
        <span className="font-display font-bold text-lg bg-gradient-to-r from-gold to-[#E4C878] bg-clip-text text-transparent">
          KCC
        </span>
        <button
          aria-label="Close menu"
          onClick={onClose}
          className="border border-white/10 w-8 h-8 flex items-center justify-center text-marine-white"
        >
          ✕
        </button>
      </div>

      <ul className="mt-10 flex flex-col">
        {links.map((link) => (
          <li key={link.href} className="border-b border-white/10">
            <Link href={link.href} onClick={onClose} className="block py-[18px] font-display text-2xl uppercase">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto flex flex-col gap-3.5">
        <LanguageSwitcher className="self-start font-mono text-[10px] uppercase tracking-[0.1em] text-cool-gray border border-white/10 px-3 py-2" />
        <Button href="/request-service" className="justify-center">
          Request Service
        </Button>
        <GhostButton href="/contact" className="justify-center">
          Contact
        </GhostButton>
      </div>
    </div>
  );
}
