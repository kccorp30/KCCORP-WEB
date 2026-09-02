import { NextRequest, NextResponse } from 'next/server';
import { getMarineCloudClient } from '@/lib/integrations/marine-cloud/client';
import { MarineCloudNotReadyError } from '@/lib/integrations/marine-cloud/contracts';

// POST /api/integrations/marine-cloud/leads/[id]/convert
//
// Prepared route — conceptually matches what the brief asked for.
// Currently always returns 503 because MarineCloudNotReadyError is
// thrown by the disabled client. This is intentional: the route
// EXISTS and is wired correctly, but does nothing real until
// MARINE_CLOUD_INTEGRATION_ENABLED is flipped AND a live client
// implementation replaces the disabled one.
//
// Future auth requirement (not implemented yet): this route must be
// restricted to authenticated kcc_admin sessions once Marine Cloud
// auth exists — it is NOT public today, but there is no session
// system to check against yet either. Do not expose this route
// publicly without that check in place.
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;

  try {
    const client = getMarineCloudClient();
    const idempotencyKey = request.headers.get('idempotency-key') ?? crypto.randomUUID();
    const result = await client.convertLead(id, idempotencyKey);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof MarineCloudNotReadyError) {
      return NextResponse.json({ error: error.message }, { status: 503 });
    }
    // No stack traces exposed publicly — log server-side, return generic message.
    console.error('[marine-cloud/convert]', error);
    return NextResponse.json({ error: 'Conversion failed.' }, { status: 500 });
  }
}
