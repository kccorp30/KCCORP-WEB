import { getWhatsAppLinkFor } from '@/lib/whatsapp';

// Fuente única de datos de contacto — ningún componente debe
// hardcodear un teléfono/email/WhatsApp por su cuenta.
//
// TODO NO INVENTADO: si una variable de entorno no está configurada,
// el campo queda `null` y los componentes deben ocultar ese canal
// en vez de mostrar un placeholder falso tipo "+1 (000) 000-0000".
//
// NOTA (Sprint 6, Fix 2): este archivo sigue siendo el FALLBACK de
// env vars, resuelto por lib/sanity/global-settings.ts (Sanity
// primario). Ningún componente debe importar `contactConfig`
// directamente para mostrar contacto al usuario — usa
// getGlobalSettings() en server, o el context (useSiteContent) en
// cliente, que ya traen el valor resuelto.

export const contactConfig = {
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP || null, // formato: número completo con código de país, sin '+' (ej. "13055551234")
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  serviceRegions: ['United States', 'Dominican Republic', 'Panama', 'Colombia'],
};

export function getWhatsAppLink(message?: string): string | null {
  return getWhatsAppLinkFor(contactConfig.whatsapp, message);
}
