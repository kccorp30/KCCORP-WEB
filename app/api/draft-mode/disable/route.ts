import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

// next-sanity solo exporta defineEnableDraftMode — no existe un
// defineDisableDraftMode equivalente (verificado contra el paquete
// instalado). Desactivar no necesita la misma validación de
// seguridad que activar (no hay nada sensible que proteger al
// APAGAR el modo preview), así que se implementa directo con la API
// nativa de Next.js.
export async function GET(request: Request) {
  const draft = await draftMode();
  draft.disable();

  const url = new URL(request.url);
  const redirectTo = url.searchParams.get('redirect') || '/';
  redirect(redirectTo);
}
