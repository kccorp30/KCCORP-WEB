import { NextRequest, NextResponse } from 'next/server';
import { getMarineCloudClient } from '@/lib/integrations/marine-cloud/client';
import { MarineCloudNotReadyError } from '@/lib/integrations/marine-cloud/contracts';

// POST /api/integrations/marine-cloud/leads/[id]/sync
// Same status as .../convert/route.ts — prepared, not active.
// Pulls status updates FROM Marine Cloud back into the lead record
// (e.g. work order completed) once that system exists.
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const client = getMarineCloudClient();
    const result = await client.syncUpdates(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MarineCloudNotReadyError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error('[marine-cloud/sync]', error);
    return NextResponse.json({ error: 'Sync failed.' }, { status: 500 });
  }
}
