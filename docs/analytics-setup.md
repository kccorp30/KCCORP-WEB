# Analytics Setup Requirements

## How it works

`lib/analytics/track.ts` is the only place UI components call into. It dispatches to whichever providers are active (Meta Pixel via `fbq`, GA4 via `gtag`) based on which env vars are set — see `components/analytics/AnalyticsProviders.tsx`. No provider active = the site works identically, `track()` just no-ops (logs to console in dev).

## Event catalog (see `lib/analytics/events.ts`)

| Event | Fires when |
|---|---|
| `request_service_started` | Wizard mounts (Step 1 shown) |
| `request_service_step_completed` | Each "Continue" click, with `{ step }` |
| `request_service_completed` | Successful submission, with `{ serviceType, country }` |
| `whatsapp_clicked` / `phone_clicked` / `email_clicked` | Contact page links |
| `service_viewed` / `project_viewed` / `insight_viewed` | Detail page mount |
| `technology_viewed` / `marine_cloud_viewed` | Technology pages |
| `client_login_clicked` | "Client Login" button (homepage, Marine Cloud page) |
| `campaign_landing_viewed` | Any `/service/location` campaign page |
| `video_started` / `video_completed` | Prepared in the catalog; not yet wired to a specific video player — add when Mux player is in place |

## What to configure in each platform

**Meta Ads Manager (once `NEXT_PUBLIC_META_PIXEL_ID` is set):**
- Create a Custom Conversion on `request_service_completed` — this is the event that represents a real lead
- Optionally track `whatsapp_clicked` as a secondary micro-conversion

**Google Analytics 4 (once `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set):**
- All events above arrive automatically as GA4 custom events — no extra config needed to see them in reports
- Mark `request_service_completed` as a "Key Event" (GA4's term for conversion) in the GA4 admin UI

**Google Ads (once `NEXT_PUBLIC_GOOGLE_ADS_ID` is set):**
- `trackConversion()` in `lib/analytics/track.ts` is separate from `track()` — it needs a conversion label from Google Ads (Tools → Conversions → your action → "Tag setup" → the string after the `/` in `send_to`)
- Call `trackConversion('YOUR_LABEL')` at the same point `request_service_completed` fires (currently not wired — add this call in `RequestServiceWizard.tsx`'s `handleSubmit` once you have the real label from Google Ads, since it doesn't exist until the Ads account/campaign is set up)

## Payload discipline

Every event payload is scoped intentionally — service slugs, step numbers, country — never name, email, phone, or the free-text problem description. Don't add PII to a `track()` call without reconsidering; see the comment in `track.ts`.
