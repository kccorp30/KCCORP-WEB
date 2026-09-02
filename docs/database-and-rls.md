# Database & RLS — Sprint 4 (Website ↔ Shared Supabase)

Project: `kccorp-marine-cloud` (Supabase, `us-east-1`) — shared with Marine Cloud (see `lib/supabase/README.md`).

## Tables touched by the website

**`leads`** — the only table the website writes to.
- RLS: enabled. Only policy is `kcc_admin_full_access_leads` (`is_kcc_admin()` — full access). The public website has **no policy granting it access** — it writes exclusively through `/api/leads`, server-side, using the service role key, which bypasses RLS by design.
- Indexes: `status`, `assigned_organization_id` (partial, non-null), `created_at desc`, `conversion_status`, `integration_status` (partial, non-null), unique on `reference_code` and `idempotency_key`.
- Trigger: `trg_sync_lead_media_count` keeps `media_count` in sync with the `media` jsonb array on insert/update — the frontend never sends `media_count` directly.
- Trigger: `trg_leads_updated_at` maintains `updated_at`.

No other table in the shared project is touched by website code — `organizations`, `profiles`, `vessels` (not yet created), etc. remain exclusively Marine Cloud's domain.

## Storage

**Bucket `lead-media`** — private (`public: false`), 25MB file size limit, MIME allowlist: `image/jpeg`, `image/png`, `image/webp`, `image/heic`, `video/mp4`, `video/quicktime`.

- RLS on `storage.objects`: only `kcc_admin_read_lead_media` (select) and `kcc_admin_delete_lead_media` (delete), both gated by `is_kcc_admin()`.
- **No public insert policy** — uploads happen exclusively via `createSignedUploadUrl`, generated server-side in `/api/media-upload/initiate` after rate-limit and file validation. The signed URL itself carries its own single-use authorization; no additional public RLS policy is needed or wanted.
- Path convention: `{draftId}/{generatedUuid}.{ext}` — `draftId` is a client-generated UUID grouping files for one Request Service session, before any `leads` row exists. Original filenames are never used as storage paths (avoids collisions, path traversal, and leaking PII in paths).

## Server-side access model

- `lib/supabase/server.ts` — the only place the service role key is used. Guarded by the `server-only` package, which fails the build if a client component ever imports it.
- `lib/supabase/client.ts` — browser-safe, anon key only, used exclusively to complete an upload against an already-authorized signed URL. It has no ability to read/write `leads` or any other table (RLS blocks it — there's no public policy).

## What public users can and cannot do

Can:
- Submit one request via `/api/leads` (rate-limited, honeypot-checked, Zod-validated)
- Upload up to 10 files per draft session via signed URLs (rate-limited, type/size-validated server-side)

Cannot (enforced by RLS + absence of any public read endpoint):
- List leads
- Read another lead's data
- Modify any lead
- Enumerate requests by guessing IDs (the public reference code is random from a 33-character alphabet, 6 characters = ~33^6 ≈ 1.3 billion combinations, and even a correct guess returns nothing — there's no public read endpoint for leads at all)
- Read or list another user's uploaded media (no public read policy exists on `storage.objects`)

## Required migrations (already applied live to the shared project during this sprint)

- `007b_leads_media_column` — adds `media` column, `media_count` sync trigger, `conversion_status`/`integration_status` indexes
- `008_lead_media_storage_rls` — `kcc_admin_read_lead_media`, `kcc_admin_delete_lead_media` policies on `storage.objects`

Note: several fields expected by this sprint (`customer_name`, `internal_notes`, `region`, `media_count`, `conversion_status`, `integration_status`, `integration_error`, `last_sync_at`, `idempotency_key`) were **already present** in the live table when this sprint began — see the "decisions and limitations" note in the sprint summary for why that's flagged as worth your attention.
