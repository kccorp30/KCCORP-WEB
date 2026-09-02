import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServiceClient } from '@/lib/supabase/server';

// GET/POST /api/cron/cleanup-lead-media?dryRun=true
//
// Deletes orphaned draft folders in the `lead-media` bucket — files
// uploaded during Step 5 of the wizard whose visitor never completed
// the form (see docs/sprint4-followups.md, item 2, and Sprint 6 item 9).
//
// Deployment: NOT scheduled automatically by this code. Wire it up
// via Vercel Cron (see vercel.json in this repo) or any external
// scheduler that can hit this URL with the correct bearer token.
// Safe by design: never touches a draftId that has a matching
// `leads.media` entry (i.e. belongs to a completed submission), and
// supports `dryRun=true` to log what WOULD be deleted without
// deleting anything — use that first after deploying.

const GRACE_PERIOD_HOURS = 48;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed — no secret configured means no access, ever
  const header = request.headers.get('authorization');
  return header === `Bearer ${secret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = request.nextUrl.searchParams.get('dryRun') === 'true';
  const supabase = getSupabaseServiceClient();

  // 1. List every draftId folder in the bucket.
  const { data: folders, error: listError } = await supabase.storage.from('lead-media').list('', { limit: 1000 });
  if (listError) {
    console.error('[cleanup-lead-media] list failed', listError.message);
    return NextResponse.json({ error: 'Could not list storage.' }, { status: 500 });
  }

  // 2. Get every storagePath referenced by an actual lead — anything
  //    NOT in this set is a candidate for deletion.
  const { data: leads, error: leadsError } = await supabase.from('leads').select('media');
  if (leadsError) {
    console.error('[cleanup-lead-media] leads query failed', leadsError.message);
    return NextResponse.json({ error: 'Could not read leads.' }, { status: 500 });
  }

  const referencedDraftIds = new Set<string>();
  for (const lead of leads ?? []) {
    for (const m of lead.media ?? []) {
      const draftId = m.storagePath?.split('/')[0];
      if (draftId) referencedDraftIds.add(draftId);
    }
  }

  const cutoff = Date.now() - GRACE_PERIOD_HOURS * 60 * 60 * 1000;
  const toDelete: string[] = [];
  const skipped: { folder: string; reason: string }[] = [];

  for (const folder of folders ?? []) {
    if (!folder.name || referencedDraftIds.has(folder.name)) {
      skipped.push({ folder: folder.name, reason: 'belongs to a submitted lead' });
      continue;
    }
    const createdAt = folder.created_at ? new Date(folder.created_at).getTime() : 0;
    if (createdAt > cutoff) {
      skipped.push({ folder: folder.name, reason: 'within grace period' });
      continue;
    }
    toDelete.push(folder.name);
  }

  if (dryRun) {
    return NextResponse.json({ dryRun: true, wouldDelete: toDelete, skipped });
  }

  let deletedCount = 0;
  for (const draftId of toDelete) {
    const { data: files } = await supabase.storage.from('lead-media').list(draftId);
    const paths = (files ?? []).map((f) => `${draftId}/${f.name}`);
    if (paths.length > 0) {
      await supabase.storage.from('lead-media').remove(paths);
      deletedCount += paths.length;
    }
  }

  console.log(`[cleanup-lead-media] deleted ${deletedCount} files across ${toDelete.length} orphaned drafts`);
  return NextResponse.json({ dryRun: false, deletedDrafts: toDelete.length, deletedFiles: deletedCount, skipped });
}
