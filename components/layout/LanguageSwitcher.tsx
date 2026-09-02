'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';

// Faltaba en todo el sitio — no era un bug escondido, directamente
// nunca se construyó. usePathname()/useRouter() de next-intl ya
// devuelven la ruta SIN el prefijo de idioma, así que cambiar de
// idioma preserva la página actual (incluso con slugs dinámicos,
// ej. /services/marine-electrical → /es/services/marine-electrical),
// no manda siempre al home.
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const otherLocale = locale === 'en' ? 'es' : 'en';

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: otherLocale })}
      aria-label={otherLocale === 'es' ? 'Cambiar a Español' : 'Switch to English'}
      className={
        className ??
        'font-mono text-[10.5px] uppercase tracking-[0.1em] text-cool-gray hover:text-gold transition-colors border border-white/10 px-2.5 py-1.5'
      }
    >
      {otherLocale.toUpperCase()}
    </button>
  );
}
