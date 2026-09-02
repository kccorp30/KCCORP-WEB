# Monorepo Extraction Plan (Not Executed Yet)

## Decision

**Kept the website as a standalone repo for now.** Forcing a monorepo migration today would mean moving code into `/apps/website` while `/apps/marine-cloud` doesn't exist yet as a codebase (Marine Cloud is currently database schema only — migrations 001-008, no application code). That's disruption with no immediate payoff and real risk of breaking the working Sprint 1-4 build for no benefit yet.

Instead, the code most likely to be shared is already isolated into clearly-bounded files **within** `kccorp-web`, so extraction later is a copy-paste, not a rewrite.

## What moves where, when Marine Cloud has real application code

```
/apps
  /website          ← current kccorp-web/, moved as-is
  /marine-cloud      ← Marine Cloud's application code (doesn't exist yet)

/packages
  /shared            ← lib/shared/schemas.ts moves here verbatim
  /validation         ← same Zod schemas double as validation package;
                         may split from /shared if it grows large
  /design-tokens      ← tailwind.config.ts color/font/spacing tokens,
                         extracted into a shared config both apps import
  /integration        ← lib/integrations/marine-cloud/ moves here —
                         BUT becomes a real, active client instead of
                         the disabled stub, since at that point Marine
                         Cloud's service layer exists to call
```

## Trigger for doing this

Do the extraction when **both** are true:
1. Marine Cloud has real, running application code (not just schema)
2. `MARINE_CLOUD_INTEGRATION_ENABLED` is about to flip to `true` for real (i.e. `lib/integrations/marine-cloud/client.ts` needs a live implementation, not the `DisabledMarineCloudClient` stub)

At that point, the natural work is one and the same: implementing the live integration client *is* the reason to extract `/packages/integration` — do them together, not extraction-for-its-own-sake beforehand.

## What NOT to force

- Don't extract `/packages/design-tokens` before Marine Cloud's own app exists to consume it — right now `shared-visual-tokens.md` (the markdown doc) is doing that job informally, and that's sufficient until there's a second real consumer.
- Don't move `lib/shared/schemas.ts` until there's a second codebase importing it — a "shared" package with one consumer is just indirection.
