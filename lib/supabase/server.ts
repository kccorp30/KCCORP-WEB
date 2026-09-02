import 'server-only';
import { createClient } from '@supabase/supabase-js';

// SERVER-ONLY. La importación de 'server-only' hace que Next.js
// falle el build si algún componente cliente intenta importar este
// archivo — es la garantía en tiempo de compilación de que la
// service role key nunca llega al navegador.

export function getSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Supabase server client: missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
