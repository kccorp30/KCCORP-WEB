import { draftMode } from 'next/headers';
import { sanityClient, sanityPreviewClient } from './client';

// CONTENT MIGRATION / FALLBACK BEHAVIOR (documented in the Sprint 5
// report too): every dynamic fetch on the site goes through this
// helper. If Sanity returns nothing (empty dataset — expected on a
// fresh project) OR the request fails outright (network error —
// expected in this sandbox, which has no route to api.sanity.io),
// the page falls back to the Sprint 2/3 temporary catalog in
// lib/data/*.ts instead of rendering blank. Once real content exists
// in Sanity, the fallback stops triggering automatically — no code
// change needed.
//
// VISUAL EDITING (este sprint): si Next.js draft mode está activo
// (solo lo activa Sanity Presentation, vía app/api/draft-mode/enable),
// esta misma función usa el cliente de PREVIEW (borradores + stega)
// en vez del público — automáticamente, en las ~12 páginas que ya
// llamaban a fetchWithFallback, sin tocar cada una. Un visitante
// normal (draft mode nunca activo para ellos) siempre usa el cliente
// publicado — el fallback y el resto del comportamiento no cambian.
export async function fetchWithFallback<T>(query: string, params: Record<string, unknown>, fallback: T): Promise<T> {
  try {
    const { isEnabled } = await draftMode();
    const client = isEnabled ? sanityPreviewClient : sanityClient;
    const result = await client.fetch<T>(query, params, isEnabled ? { cache: 'no-store' } : undefined);
    const isEmpty = result === null || result === undefined || (Array.isArray(result) && result.length === 0);
    return isEmpty ? fallback : result;
  } catch (err) {
    console.error('[sanity] fetch failed, using fallback catalog:', err instanceof Error ? err.message : err);
    return fallback;
  }
}

// Reads a localized field object ({ en, es }) for the active locale,
// falling back to English, then to an empty string. Centralizes the
// "which language is this" logic in one place.
export function pickLocale(field: { en?: string; es?: string } | undefined | null, locale: string): string {
  if (!field) return '';
  return (locale === 'es' ? field.es : field.en) || field.en || '';
}
