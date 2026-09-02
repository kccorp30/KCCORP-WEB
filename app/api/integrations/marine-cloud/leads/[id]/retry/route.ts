import { NextRequest, NextResponse } from 'next/server';
import { getMarineCloudClient } from '@/lib/integrations/marine-cloud/client';
import { MarineCloudNotReadyError } from '@/lib/integrations/marine-cloud/contracts';

// POST /api/integrations/marine-cloud/leads/[id]/retry
// Re-attempts a FAILED conversion using the lead's existing
// idempotency_key (never generates a new one) — prevents duplicate
// customers/vessels/work orders on retry. See brief section 16.
export async function POST(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const client = getMarineCloudClient();
    const result = await client.retryConversion(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MarineCloudNotReadyError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error('[marine-cloud/retry]', error);
    return NextResponse.json({ error: 'Retry failed.' }, { status: 500 });
  }
}
