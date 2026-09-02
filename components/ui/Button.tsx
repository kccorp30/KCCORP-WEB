import { Link } from '@/i18n/navigation';
import clsx from 'clsx';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function Button({ href, children, className }: ButtonProps) {
  return (
    <Link
      href={href}
      className={clsx(
        'inline-flex items-center gap-2 px-[22px] py-[13px] text-[11px] font-bold tracking-[0.1em] uppercase',
        'text-navy shadow-[0_8px_24px_rgba(201,162,75,0.22)] transition-shadow duration-200 ease-precise',
        'bg-gradient-to-r from-gold to-[#B8924A] hover:shadow-[0_10px_30px_rgba(201,162,75,0.32)]',
        className,
      )}
    >
      {children}
    </Link>
  );
}
