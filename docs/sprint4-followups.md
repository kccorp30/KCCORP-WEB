# Sprint 4 Follow-Ups (Documented, Not Blocking)

Per Sprint 5's instruction: do not redesign Sprint 4, just document these three for later.

## 1. First-touch campaign attribution via cookie/session

**Current behavior:** `RequestServiceWizard.tsx` captures UTMs/referrer from `window.location` and `document.referrer` at the moment the visitor **starts the wizard** — not necessarily their first visit to the site. If someone clicks a paid ad, browses for 10 minutes across `/services`, `/projects`, `/about`, and *then* starts Request Service, the attribution captured is whatever page they were on when they clicked "Request Service" — the original ad UTMs are lost.

**Before paid advertising launches**, this needs: a cookie set on first page load (client-side, in the root layout or a small script) capturing the *first* `utm_*`/`referrer`/`landing_page` seen in that session, read back (not re-captured) when the wizard submits. This is a real gap for measuring campaign ROI accurately — flagging it now so it isn't discovered after ad spend is already running.

## 2. Cleanup strategy for abandoned lead-media drafts

**Current behavior:** Step 5 of the wizard (media upload) creates files in Supabase Storage under `{draftId}/...` the moment a visitor picks a file — *before* they've necessarily completed and submitted the form. If someone uploads photos and abandons the wizard, those files sit in `lead-media` forever with no owning `leads` row (the `leads` row is only created on final submit).

**Needed later:** a scheduled cleanup (Supabase cron job or edge function) that deletes any `{draftId}/` folder older than, say, 48 hours with no matching `leads.media` entry referencing it. Not urgent at current traffic levels, but will accumulate storage cost/clutter over time.

## 3. Schema/migration baseline reconciliation

**Current behavior:** documented plainly in the Sprint 4 report already — the live `leads` table had several fields (`customer_name`, `region`, `conversion_status`, etc.) already present when Sprint 4 began, under different assumptions than the `004_leads.sql` file originally shown. The migrations applied since (`007b`, `008`) work correctly against what's actually live, but the **migration files in this repo no longer perfectly replay to reproduce the live schema from scratch** — there's drift between "migration 004 as written" and "what's actually live."

**Needed later:** a baseline reconciliation pass — either regenerate migration files from the live schema (`supabase db pull` equivalent) or add a documented "baseline" migration that captures the true starting state, so a fresh environment built from the repo's migrations alone would match production. Not urgent since there's only one environment today, but will matter before a staging environment or a second developer joins.
