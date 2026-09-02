# Database Baseline Reconciliation Plan — Sprint 6

## ✅ Status: DONE (post-freeze correction)

Completed via direct introspection against the live project (`zxgeipuzglromtuxhxtb`) — read-only queries only (`information_schema`, `pg_indexes`, `pg_policies`). **Nothing was changed in the live database to produce this.**

- **`migrations/000_baseline.sql`** — the new starting point. Verified column-by-column, constraint-by-constraint, and policy-by-policy (all 3 live RLS policies confirmed present and matching) against the actual live schema.
- **`migrations/archive/`** — the original `001_extensions_and_helpers.sql` through `004_leads.sql` files, kept for historical context of the corrections made along the way (see each sprint's report for what changed and why).
- Migrations `005` through `009` (security hardening, leads extension, storage RLS, first-touch attribution) were already verified against the live schema when applied — they remain valid and are NOT part of the baseline file (they're incremental history that already replays correctly on top of it).

## The problem (confirmed across Sprints 4-6)

Every time a migration in this repo was applied live, the actual Supabase schema had small but real differences from what the repo's migration files (as originally written) assumed — column names (`customer_name` vs `name`), extra columns already present (`region`, `conversion_status`, `media`, `idempotency_key`), etc. Each time, the migration actually applied live was adjusted on the spot to match reality, and documented in that sprint's report.

## What was NOT done

Per the brief: no live production columns were renamed or dropped to make old files look cleaner. The live schema was treated as ground truth throughout — the baseline file was written to match it exactly, never the reverse.

## Going forward

Any new migration is now numbered `010` onward, replaying cleanly on top of `000_baseline.sql`. A fresh environment (staging, a second developer's local Supabase project) can be reproduced by running `000_baseline.sql` followed by `010+` in order — no more guessing at intermediate states.

