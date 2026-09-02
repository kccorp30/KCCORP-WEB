# Security Review — Sprint 6

Real audit of every public surface named in the brief. Findings marked **FIXED** were corrected in this sprint; **OK** means already correct from prior sprints; **ACCEPTED** means a documented trade-off, not a gap.

## Leads API (`/api/leads`)
- Rate limited (Upstash, silent) — **OK**
- Zod validation server-side, client input never trusted — **OK**
- Honeypot field, fails silently (fake success, no DB write) — **OK**
- No stack traces returned to the client — **OK**
- No public read endpoint exists for `leads` — **OK**

## Media upload (`/api/media-upload/initiate`)
- Rate limited — **OK**
- File type allowlist + size limit enforced server-side (not just client-side) — **OK**
- Per-draft file count enforced server-side — **OK**
- Generated filenames (UUID-based), original filename never used as storage path — **OK**

## Rate limiting
- **ACCEPTED gap, documented in Sprint 4:** requires real Upstash credentials in production; without them the limiter throws at request time. Confirm `UPSTASH_REDIS_REST_URL`/`TOKEN` are set before launch — see launch-checklist.md.

## Storage (`lead-media` bucket)
- Private bucket, no public read/insert policy — **OK**
- Only `kcc_admin` can read/delete via RLS — **OK**
- Uploads only via signed, single-use URLs generated server-side — **OK**
- **NEW this sprint:** orphaned draft cleanup implemented (`/api/cron/cleanup-lead-media`), protected by `CRON_SECRET`, fails closed if the secret isn't configured.

## Sanity preview/drafts
- `SANITY_API_READ_TOKEN` is server-only (`sanityPreviewClient` in `lib/sanity/client.ts` is never imported by a client component) — **OK**
- No `/api/preview` toggle route was built this sprint — draft mode activation is documented as a known limitation, not implemented. Public visitors cannot see draft content because nothing exposes the preview client to them.

## Integration routes (`/api/integrations/marine-cloud/...`)
- All four routes return `503` via `MarineCloudNotReadyError` until a real implementation exists — **OK**
- **FOUND, not yet fixed:** these routes have no auth check of their own — they're inert today (always 503), but the moment a real `MarineCloudIntegration` implementation replaces the disabled stub, these routes become live with **zero access control**. Documented explicitly in each route file's comments already; repeating here so it isn't missed: **add an auth check before ever enabling `MARINE_CLOUD_INTEGRATION_ENABLED`.**

## Environment variable exposure
- Audited every `NEXT_PUBLIC_*` var: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `CONTACT_*`, `SITE_URL`, `GA_MEASUREMENT_ID`, `META_PIXEL_ID`, `GOOGLE_ADS_ID` — all of these are meant to be public (anon keys and analytics IDs are not secrets). Confirmed `SUPABASE_SERVICE_ROLE_KEY`, `SANITY_API_READ_TOKEN`, `CRON_SECRET`, `UPSTASH_REDIS_REST_TOKEN`, `MUX_TOKEN_SECRET` are NOT prefixed `NEXT_PUBLIC_` — **OK**

## User-controlled content rendering
- Portable Text (article bodies) rendered via `@portabletext/react`, which does not execute arbitrary HTML by default — **OK**
- No `dangerouslySetInnerHTML` in the codebase except `JsonLd`, which only ever receives `JSON.stringify()` of data WE construct (never user input) — **OK**

## Redirects
- No user-controlled redirect exists anywhere in the codebase (no `?redirect=` param, no open redirect surface) — **OK**

## Request IDs
- Public `reference_code` (KCC-REQ-XXXXXX) is random, not sequential — internal UUID `id` is never exposed — **OK** (documented already in `docs/database-and-rls.md`)

## Not done — explicitly out of scope this pass
- No formal penetration test or dependency vulnerability scan was run (`npm audit` shows 25 known vulnerabilities in transitive dependencies as of this sprint — mostly in dev/build tooling, not runtime-exposed code, but worth a `npm audit fix` pass before launch).

---

## Dependency Security Review (post-freeze correction)

Ran `npm audit` for real (25 findings) and categorized every one — not just re-running `audit fix --force` blindly, per your instruction.

### Fixed safely (no breaking change)
**`postcss`** (high — arbitrary file read + XSS via sourceMappingURL/CSS stringify). Our own direct `postcss` was already safe (8.5.26); the vulnerable copy was one Next.js bundles internally (8.4.31) for its own build pipeline. Forced it to the safe version via `package.json` `overrides` (scoped to `next`'s dependency tree only) — confirmed with a real build afterward that nothing broke. **25 → 22 findings.**

### Dev/build-only — never reach a site visitor
All of these live inside Sanity Studio's own toolchain (`/studio`, an admin-only route) or Sanity's CLI (`@sanity/cli`, not even part of the deployed app):
`@architect/hydrate`, `@architect/inventory`, `@architect/utils`, `@sanity/cli`, `@sanity/runtime-cli`, `adm-zip`, `decompress` (critical, but it's Sanity CLI's archive-extraction tool, never invoked by our code), `glob` (command injection in glob's own CLI, not used by us directly), `prismjs`/`refractor`/`react-refractor` (Sanity Studio's code-block syntax highlighter, admin-only), `@sanity/insert-menu`, `@sanity/ui`, `@sanity/visual-editing`, `@sanity/preview-url-secret`, `@sanity/uuid`, `uuid` (via next-sanity's internal use, not ours). **None of these process any input a public website visitor controls.**

### Runtime-relevant, but confirmed not currently exploitable
**`next-intl`** (moderate — open redirect + prototype pollution). We checked our actual usage: we never call `redirect()` with user-controlled input anywhere in the codebase, and we don't use the `experimental.messages.precompile` feature the prototype-pollution advisory requires. **Verified not exploitable given how we actually use it.** The fix (4.14.1) is a major version bump from our installed 3.26.5 — we already know from Sprint 3 that this API changed (`hasLocale` didn't exist in 3.x). Not upgraded now, per "no blind forced upgrades" — flagged as a planned, tested upgrade for a future maintenance window, not a launch blocker.

### Not upgraded — genuinely breaking, needs a planned migration
**The Sanity ecosystem** (`sanity`, `@sanity/vision`, `sanity-plugin-mux-input`) — fixes require major version jumps (`sanity@6.11.0`, `sanity-plugin-mux-input@5.0.12`) that Sanity's own docs describe as a real migration (schema/plugin API changes), not a drop-in bump. Given every finding pulled in through these packages is admin-tool-only (see above), there's no urgency that justifies the risk of doing this blindly. Recommend planning this as its own scoped task when someone can verify the Studio still works correctly afterward — not appropriate to do inside a "don't redesign, just fix production issues" pass.

### Net result
**22 findings remain, all either dev/build-tool-only or confirmed non-exploitable given our actual usage.** Nothing found in this audit is reachable by a public website visitor today.

