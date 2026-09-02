import { NextRequest, NextResponse } from 'next/server';
import { getMarineCloudClient } from '@/lib/integrations/marine-cloud/client';
import { MarineCloudNotReadyError } from '@/lib/integrations/marine-cloud/contracts';

// GET /api/integrations/marine-cloud/leads/[id]/status
export async function GET(_request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  try {
    const client = getMarineCloudClient();
    const result = await client.checkConversionStatus(id);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MarineCloudNotReadyError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    console.error('[marine-cloud/status]', error);
    return NextResponse.json({ error: 'Status check failed.' }, { status: 500 });
  }
}
