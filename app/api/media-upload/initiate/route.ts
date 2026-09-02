import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { mediaUploadLimiter, flagSuspicious } from '@/lib/upstash/ratelimit';

// POST /api/media-upload/initiate
//
// Flow: browser asks for a signed upload URL for ONE file → this
// route validates type/size/count and returns a short-lived signed
// URL → browser uploads DIRECTLY to Supabase Storage with that URL
// (the service role key never touches the browser) → browser keeps
// the returned `path` and includes it in the final /api/leads submission.
//
// `draftId` groups files under one Request Service session before a
// lead row exists yet — see components/forms/RequestServiceWizard.tsx.

const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'video/mp4', 'video/quicktime'];
const MAX_SIZE_BYTES = 25 * 1024 * 1024; // 25MB, matches the bucket's file_size_limit
const MAX_FILES_PER_DRAFT = 10;

const InitiateSchema = z.object({
  draftId: z.string().uuid(),
  fileName: z.string().min(1).max(200),
  mimeType: z.enum(ALLOWED_MIME as [string, ...string[]]),
  sizeBytes: z.number().int().positive().max(MAX_SIZE_BYTES),
});

function safeExtension(fileName: string, mimeType: string): string {
  const fromName = fileName.split('.').pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  const fallback: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'image/heic': 'heic',
    'video/mp4': 'mp4',
    'video/quicktime': 'mov',
  };
  return fallback[mimeType] ?? 'bin';
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  const { success: withinLimit } = await mediaUploadLimiter.limit(ip);
  if (!withinLimit) {
    await flagSuspicious(ip);
    return NextResponse.json({ error: 'Too many upload requests. Please try again shortly.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = InitiateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid file.', issues: parsed.error.flatten() }, { status: 400 });
  }

  const { draftId, fileName, mimeType, sizeBytes } = parsed.data;
  const supabase = getSupabaseServiceClient();

  // Enforce per-draft file count limit server-side (never trust the client's own counter).
  const { data: existing } = await supabase.storage.from('lead-media').list(draftId, { limit: MAX_FILES_PER_DRAFT + 1 });
  if (existing && existing.length >= MAX_FILES_PER_DRAFT) {
    return NextResponse.json({ error: `Maximum ${MAX_FILES_PER_DRAFT} files per request.` }, { status: 400 });
  }

  // Safe generated filename — never trust the original name for the
  // actual storage path (avoids path traversal, collisions, PII in names).
  const generatedName = `${crypto.randomUUID()}.${safeExtension(fileName, mimeType)}`;
  const path = `${draftId}/${generatedName}`;

  const { data: signed, error } = await supabase.storage.from('lead-media').createSignedUploadUrl(path);

  if (error || !signed) {
    console.error('[api/media-upload/initiate]', error?.message);
    return NextResponse.json({ error: 'Could not prepare upload.' }, { status: 500 });
  }

  return NextResponse.json({
    signedUrl: signed.signedUrl,
    token: signed.token,
    path,
    kind: mimeType.startsWith('video/') ? 'video' : 'image',
    fileName,
    sizeBytes,
    mimeType,
  });
}
