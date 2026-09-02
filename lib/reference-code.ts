// Genera un código público legible tipo KCC-REQ-XXXXXX.
// NUNCA se expone el `id` (uuid) real de la fila al público —
// este código es lo único que el cliente ve y usa para referenciar
// su solicitud (en la pantalla de éxito, por WhatsApp, etc.).

const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // sin 0/O/1/I para evitar confusión al leerlo en voz alta

export function generateReferenceCode(): string {
  let suffix = '';
  for (let i = 0; i < 6; i++) {
    suffix += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `KCC-REQ-${suffix}`;
}
