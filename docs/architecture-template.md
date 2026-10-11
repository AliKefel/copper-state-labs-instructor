# Architecture: <feature or module name>

_Copy this file to `docs/architecture.md` (or add a section to it) when a module changes how the app fits together._

## Summary

One or two sentences: what this adds and why.

## Components

| Piece | Where | What it does |
|---|---|---|
| Page / route | `app/...` | |
| Components | `components/...` | |
| Data | `supabase/migrations/...` | Tables and columns added |
| AI calls | `lib/ai/call.ts` (week, feature) | Model, prompt purpose, expected cost per call |

## Data flow

Describe (or draw) how a request moves through the app: user action → page → server code → database / model → response.

## Decisions and trade-offs

- **Decision:** what you chose, the alternatives, and why.

## Risks and open questions

- Cost, privacy, accuracy or safety risks, and how you handle them.
