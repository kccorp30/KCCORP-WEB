import { NextRequest, NextResponse } from 'next/server';
import { ServiceRequestInputSchema } from '@/lib/shared/schemas';
import { getSupabaseServiceClient } from '@/lib/supabase/server';
import { generateReferenceCode } from '@/lib/reference-code';
import { requestServiceLimiter, flagSuspicious } from '@/lib/upstash/ratelimit';
import { notify } from '@/lib/notifications';

// POST /api/leads
// The ONLY write path from the public website into `leads`. The
// service role key lives only here (server-side) — see
// lib/supabase/server.ts. No public read endpoint exists for this
// table: visitors cannot list, enumerate, or read other leads.
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';

  // Rate limit — silent, no visible friction for real users.
  const { success: withinLimit } = await requestServiceLimiter.limit(ip);
  if (!withinLimit) {
    await flagSuspicious(ip);
    return NextResponse.json({ error: 'Too many requests. Please try again shortly.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const parsed = ServiceRequestInputSchema.safeParse(body);
  if (!parsed.success) {
    // No stack traces / internal detail leaked — just field-level messages.
    return NextResponse.json({ error: 'Invalid submission.', issues: parsed.error.flatten() }, { status: 400 });
  }

  const input = parsed.data;

  // Honeypot: `website` field is invisible to real users (see
  // RequestServiceWizard.tsx). A non-empty value means a bot filled
  // every field, including one humans never see. Silently reject —
  // no error detail that helps a bot understand why it failed.
  if (input.website && input.website.length > 0) {
    await flagSuspicious(ip);
    return NextResponse.json({ success: true, referenceCode: generateReferenceCode() }); // fake success, no DB write
  }

  const referenceCode = generateReferenceCode();
  const supabase = getSupabaseServiceClient();

  const { data, error } = await supabase
    .from('leads')
    .insert({
      reference_code: referenceCode,
      country: input.location.country,
      region: input.location.region ?? null,
      city: input.location.city,
      service_type: input.serviceType,
      vessel_make: input.vessel.make,
      vessel_model: input.vessel.model,
      vessel_year: input.vessel.year ?? null,
      vessel_name: input.vessel.name ?? null,
      hin: input.vessel.hin ?? null,
      description: input.description,
      customer_name: input.customer.name,
      phone: input.customer.phone,
      email: input.customer.email || null,
      preferred_contact_method: input.customer.preferredContactMethod,
      source: input.attribution?.source ?? null,
      medium: input.attribution?.medium ?? null,
      campaign: input.attribution?.campaign ?? null,
      utm_source: input.attribution?.utmSource ?? null,
      utm_medium: input.attribution?.utmMedium ?? null,
      utm_campaign: input.attribution?.utmCampaign ?? null,
      utm_content: input.attribution?.utmContent ?? null,
      referrer: input.attribution?.referrer ?? null,
      landing_page: input.attribution?.landingPage ?? null,
      // First-touch (Sprint 6) — only written if the wizard actually
      // found a first-touch cookie; if the cookie doesn't exist
      // (direct visit, cookies blocked), these stay null rather than
      // silently duplicating the submission-time attribution above.
      first_utm_source: input.attribution?.firstUtmSource ?? null,
      first_utm_medium: input.attribution?.firstUtmMedium ?? null,
      first_utm_campaign: input.attribution?.firstUtmCampaign ?? null,
      first_utm_content: input.attribution?.firstUtmContent ?? null,
      first_referrer: input.attribution?.firstReferrer ?? null,
      first_landing_page: input.attribution?.firstLandingPage ?? null,
      first_touch_at: input.attribution?.firstTouchAt ?? null,
      media: input.media.map((m) => ({
        storagePath: m.storagePath,
        fileName: m.fileName,
        mimeType: m.mimeType,
        sizeBytes: m.sizeBytes,
        kind: m.kind,
      })),
    })
    .select('id, reference_code')
    .single();

  if (error) {
    console.error('[api/leads] insert failed', error.message); // server-side only
    return NextResponse.json({ error: 'Could not submit request. Please try again.' }, { status: 500 });
  }

  // Fire-and-forget notifications — provider-independent, see lib/notifications.
  // Not awaited-and-blocking on failure: a notification issue should
  // never fail the customer's submission.
  notify({ type: 'lead_internal_alert', leadId: data.id, referenceCode: data.reference_code }).catch(() => {});
  if (input.customer.email) {
    notify({
      type: 'lead_customer_confirmation',
      leadId: data.id,
      referenceCode: data.reference_code,
      to: input.customer.email,
    }).catch(() => {});
  }

  return NextResponse.json({ success: true, referenceCode: data.reference_code });
}
