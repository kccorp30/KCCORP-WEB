import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  // Validación manual en vez de `hasLocale` (no disponible en next-intl 3.x,
  // solo en 4.x) — funciona igual, sin atarnos a una versión específica.
  const locale = routing.locales.includes(requested as (typeof routing.locales)[number])
    ? requested!
    : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
