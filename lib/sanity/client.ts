import { createClient } from 'next-sanity';

// Fallback to a placeholder project ID so createClient() never throws
// at construction time — that error happens BEFORE any .fetch() call,
// so fetchWithFallback's try/catch can't catch it. With a placeholder,
// the client constructs fine and the actual network request fails
// gracefully instead, which fetchWithFallback DOES catch.
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Published content — what every visitor sees. Uses the CDN for speed.
// stega explícitamente deshabilitado — un visitante normal jamás debe
// recibir los caracteres invisibles de codificación, ni por accidente
// si alguna vez cambia un default de la librería.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
  stega: { enabled: false },
});

// Draft content — solo se usa detrás de Next.js draft mode (ver
// app/api/draft-mode/*). Requiere un token con acceso de lectura a
// borradores; nunca se empaqueta en código cliente (este archivo es
// seguro de importar desde Server Components únicamente para el
// cliente de preview).
//
// stega: codifica de forma invisible, en cada string que devuelve una
// query, qué documento/campo lo originó — es lo que le permite a
// @sanity/visual-editing resaltar y linkear el contenido correcto al
// pasar el mouse en modo Presentation. SOLO se activa en preview —
// un visitante normal nunca recibe estos caracteres invisibles.
export const sanityPreviewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'drafts',
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    enabled: true,
    studioUrl: '/studio',
  },
});

export function getSanityClient(preview: boolean) {
  return preview ? sanityPreviewClient : sanityClient;
}
