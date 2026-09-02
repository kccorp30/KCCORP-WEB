import { defineEnableDraftMode } from 'next-sanity/draft-mode';
import { sanityPreviewClient } from '@/lib/sanity/client';

// Llamada por el Presentation tool de Sanity Studio (nunca por un
// visitante normal). El secret vive únicamente server-side — nunca
// se manda al bundle del cliente. next-sanity valida el token contra
// el documento real vía el preview client (con SANITY_API_READ_TOKEN,
// también server-only) antes de activar draftMode(), así que ni
// siquiera conocer el secret alcanza sin credenciales válidas de
// lectura de borradores.
export const { GET } = defineEnableDraftMode({
  client: sanityPreviewClient.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
