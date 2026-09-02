# Launch Readiness Checklist

## 🔴 BLOCKS LAUNCH

**Infrastructure**
- [ ] Domain purchased and pointed at Vercel
- [ ] Vercel project created, connected to the GitHub repo
- [ ] Production environment variables set in Vercel (see full list below)

**Sanity**
- [ ] Real Sanity project created (I don't have a tool to do this myself, unlike Supabase)
- [ ] `NEXT_PUBLIC_SANITY_PROJECT_ID` configured
- [ ] At minimum: `globalSettings`, `navigation`, `footer` documents filled in (site works without them via fallback, but launching with placeholder nav/footer looks unfinished)

**Supabase**
- [x] Already created and connected (`kccorp-marine-cloud`) — nothing blocking here
- [ ] Real `SUPABASE_SERVICE_ROLE_KEY` in production env (never the placeholder used during our builds)

**Upstash**
- [ ] Real account + Redis database created
- [ ] `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` configured — **without this, Request Service and media upload will throw errors in production**

**Contact details**
- [ ] Real WhatsApp number, phone, email configured in Sanity `globalSettings` (or env vars as fallback) — currently every contact channel shows "[ pending configuration ]"

**Content — the minimum for a credible public launch**
- [ ] Real logo (SVG/PNG) replacing the text "KCC" wordmark
- [ ] Hero video or photography (currently a gradient placeholder)
- [ ] At least the Featured Project with real photography and a real project name (currently marked `[example, placeholder]`)
- [ ] Real about-page team/founder photography

**Security**
- [ ] `CRON_SECRET` set (protects the media cleanup endpoint)
- [ ] Confirm `SUPABASE_SERVICE_ROLE_KEY` is set ONLY in Vercel's server environment, never exposed client-side (verified in code — see `docs/security-review.md` — but re-verify at deploy time)

## 🟡 CAN BE ADDED AFTER LAUNCH

**Mux** — video hosting isn't required for launch if the hero uses a static poster image initially; add Mux credentials when real video production is ready.

**Meta Pixel / Google Analytics / Google Ads** — the site works identically with these disabled. Add `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID` whenever campaigns are ready to launch — see `docs/analytics-setup.md` for exactly which conversion events to configure on each platform.

**Remaining real content:**
- [ ] Full project portfolio (currently 4 examples, 3 with placeholder case-study text)
- [ ] Real Marine Cloud screenshots (currently conceptual UI, clearly labeled)
- [ ] Approved testimonials (section stays hidden until at least one exists — this is correct behavior, not a bug)
- [ ] Full Insights article library (currently 3 stub articles)

**Legal**
- [ ] Privacy policy page — not built this sprint, not requested; needed once the Request Service form is collecting real customer data. Recommend adding before real ad spend, not necessarily before a soft launch.
- [ ] Terms of service — only if KCC's legal counsel advises it's needed; not built.

**Technical follow-ups (documented, non-blocking):**
- [ ] First-touch attribution cookie (✅ done this sprint)
- [ ] Abandoned lead-media cleanup (✅ implemented this sprint, needs Vercel Cron activated + `CRON_SECRET` set)
- [ ] DB baseline reconciliation (see `docs/db-baseline-reconciliation-plan.md` — not urgent with one environment)
- [ ] Marine Cloud integration (intentionally not started in this repo — see integration boundary docs)

**Performance/Polish**
- [ ] Real Lighthouse/PageSpeed audit once real images/video are in place (placeholder gradients don't reflect real-world image weight)
- [ ] `npm audit fix` pass on the 25 known dependency vulnerabilities (mostly build tooling, not runtime-exposed — see `docs/security-review.md`)

---

## Full list of production environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_READ_TOKEN=

UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

MUX_TOKEN_ID=
MUX_TOKEN_SECRET=

NEXT_PUBLIC_CONTACT_WHATSAPP=
NEXT_PUBLIC_CONTACT_PHONE=
NEXT_PUBLIC_CONTACT_EMAIL=

NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_GOOGLE_ADS_ID=

CRON_SECRET=
MARINE_CLOUD_INTEGRATION_ENABLED=false
```
