'use client';
import { createClient } from '@supabase/supabase-js';

// Browser-safe client — anon key only, never the service role key.
// Used exclusively to complete an upload against a signed URL that
// the server already authorized via /api/media-upload/initiate.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
