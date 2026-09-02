import { defineRouting } from 'next-intl/routing';

// Única fuente de verdad para la estrategia de idiomas.
// Todo lo demás (middleware, navegación centralizada) lee de aquí —
// nunca se hardcodea 'en'/'es' en otro archivo.
//
// Nota: NO se usa el modo `pathnames` tipado de next-intl aquí a
// propósito. Varias rutas del sitio construyen el href de forma
// dinámica (ej. `/services/${slug}`, `/projects/${slug}`), y el
// modo pathnames exige que cada href coincida con una entrada
// estática predefinida — choca con ese patrón. Como los slugs son
// idénticos en ambos idiomas por ahora ("Spanish equivalents must
// use the same content structure"), no se pierde nada al omitirlo.
// Si en el futuro una sección necesita slugs traducidos
// (ej. /es/servicios), ahí sí se reintroduce `pathnames` para esa
// sección específica.
export const routing = defineRouting({
  locales: ['en', 'es'],
  defaultLocale: 'en',

  // 'as-needed': el locale por defecto (en) NO lleva prefijo en la
  // URL (/services), pero español sí (/es/services) — inglés es el
  // idioma principal confirmado, así que sus URLs quedan limpias.
  localePrefix: 'as-needed',
});

export type AppLocale = (typeof routing.locales)[number];
