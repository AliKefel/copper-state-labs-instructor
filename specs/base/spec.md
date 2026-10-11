# Spec: Copper State Labs Base Repo (draft)

_Destination in the repo: `specs/base/spec.md`. Hand this to Claude Code one build step at a time (see "Build order"), reviewing and committing after each._

## 1. Purpose

A Next.js starter that every CIS 591 student clones in Week 0. It deploys to Vercel with no setup, carries the Copper State Labs brand and data, and contains the shared tools (UI kit, Supabase helpers, AI wrapper with cost logging, tests, CI, agent rules) that every class example builds on.

## 2. Users

- **Students** (mixed business and technical) cloning, running and deploying the app, mostly through Claude Code or Codex.
- **The instructor and TAs**, adding week starters and grading against tests.

## 3. Requirements

### 3.1 Stack and versions

- Next.js (App Router), TypeScript in strict mode, Tailwind CSS v4, shadcn/ui, Supabase (`@supabase/supabase-js`, `@supabase/ssr`), Vercel AI SDK, zod, Vitest, React Testing Library.
- Node version pinned in `.nvmrc` and `package.json` `engines`. npm with a committed `package-lock.json`. All dependency versions pinned exactly (no `^` or `~`). Record the chosen versions in this spec's change log.

### 3.2 Home page (Week 0 "Hello, Copper State Labs")

- One page: logo, tagline "From raw ideas to refined answers.", a short company intro, and a list of the seven class examples with their week numbers (unbuilt weeks shown as "Coming in Week N").
- Includes one clearly marked line of text that the Week 0 readiness task asks students to change.
- Labeled "Fictional — for educational use." in the footer.

### 3.3 Brand

- shadcn theme built from the Product Bible colors: Copper `#B87333` (primary), Patina Teal `#4A8C82` (accent), Desert Sand `#EFE3D0`, Sonoran Sunset `#E8663D`, Night Sky `#1C2333`, Hard-Hat Yellow `#F2C230`. Light and dark modes via next-themes.
- Rounded geometric sans for headings, humanist sans for body, both via `next/font`.
- `components/copper/`: `Logo`, `SiteHeader`, `SiteFooter`, `WeekCard`.

### 3.4 UI kit

- shadcn components pre-added: button, card, input, textarea, label, select, badge, tabs, table, dialog, sheet, dropdown-menu, form, sonner, skeleton, scroll-area, separator, tooltip, avatar, progress, chart.
- AI Elements components for conversation, message, prompt input, sources and tool display.
- Also installed: lucide-react, recharts, @tanstack/react-table, react-hook-form, @hookform/resolvers, date-fns.

### 3.5 Supabase

- `lib/supabase/client.ts` and `lib/supabase/server.ts`.
- Migrations creating the Product Bible tables `products`, `plans`, `assistant_versions` and `ai_tiers` exactly as in Bible Section 10, plus `ai_calls` (section 3.6). pgvector extension enabled.
- `supabase/seed.sql` generated from Bible Section 10, matching it exactly.
- No authentication and no row-level security policies yet (Week 6).

### 3.6 AI wrapper and cost logging

- `lib/ai/models.ts`: the course's approved models, each with an id and a label.
- `lib/ai/pricing.ts`: input and output price per million tokens for each approved model.
- `lib/ai/call.ts`: wraps text generation and structured-object generation. Every call records `week`, `feature`, `model`, `input_tokens`, `output_tokens`, `cost_usd`, `latency_ms`, `ok`, `created_at` in `ai_calls`.
- If Supabase isn't configured, the wrapper logs to the console instead of failing.
- All model access goes through one gateway key read from an environment variable.

### 3.7 Works with no configuration

- `npm run build` succeeds and the home page renders with no environment variables set.
- Any page that needs Supabase or a model key shows a friendly "Set up X to use this page" card instead of crashing.

### 3.8 Agent harness

- Root `CLAUDE.md`:
  - plan before coding, and wait for approval of the plan
  - every change comes with tests; run `npm test` before saying a task is done
  - use components from `components/ui` and `components/ai-elements`; don't add UI libraries
  - all AI calls go through `lib/ai/call.ts`
  - never read, print or commit `.env` files
  - the Product Bible traps (Section 11) are intentional; never correct, remove or reconcile them
  - don't change files under `specs/*/tests` or `specs/*/evals`
- `AGENTS.md` with the same rules (for Codex).
- `.claude/settings.json`: deny reading `.env*`; allow `npm test`, `npm run lint`, `npm run typecheck`.
- `.mcp.json`: shadcn MCP server, a docs MCP server, and the Supabase MCP server in read-only mode.

### 3.9 Quality and delivery

- Scripts: `dev`, `build`, `lint`, `typecheck`, `test`, `format`.
- `.github/workflows/ci.yml` runs `npm ci`, lint, typecheck and tests on pushes and pull requests.
- `.github/pull_request_template.md`: link to the spec, test evidence, "AI-generated code I rejected or corrected", architecture note.
- `.devcontainer/devcontainer.json` that runs `npm ci` on create.
- `README.md`: Deploy to Vercel button, local setup in five steps or fewer, environment variables table, Codex MCP note.
- `docs/copper-state-labs/product-bible.md` (the Product Bible) and `docs/architecture-template.md`.
- `specs/README.md` explaining a week folder: `spec.md`, `instructions.md`, `assets/`, `data/`, `evals/`, `tests/`, `rubric.md`, `reflection.md`, optional `CLAUDE.md`.

## 4. Acceptance criteria

1. A fresh clone runs `npm ci && npm run build` with no environment variables, and the build succeeds.
2. With no environment variables, the home page renders the logo, tagline, seven week cards and the fictional-use footer.
3. `npm run lint`, `npm run typecheck` and `npm test` all pass, and CI passes on a pull request.
4. After running the migrations and seed against a new Supabase project, the four Bible tables match Bible Section 10 row for row (checked by a test that reads the seed data).
5. With a gateway key and Supabase set, a test call through `lib/ai/call.ts` writes one row to `ai_calls` with tokens, cost and latency filled in.
6. With no Supabase configured, the same call logs to the console and does not throw.
7. `package.json` contains no `^` or `~` versions, and `package-lock.json` is committed.
8. Claude Code started in the repo cannot read `.env.local` (blocked by settings), and lists the three MCP servers.
9. The Deploy to Vercel button produces a working site with no environment variables entered.
10. Opening the repo in GitHub Codespaces reaches a running dev server with no manual installs.

## 5. Non-goals

- No class-example features (weeks are added later as starters).
- No authentication, row-level security, or Realtime.
- No agent framework.
- No real Copper State Labs products, logos or trademarks of real companies.

## 6. Build order for Claude Code

Ask Claude Code to do one step at a time, plan first, and commit after you review each:

1. Scaffold Next.js, TypeScript, Tailwind, ESLint, Prettier, Vitest; pin versions; CI workflow. (Criteria 1, 3, 7) Because the repo already contains `specs/` and `docs/`, run `create-next-app` in a temporary folder and move the result into the repo root rather than scaffolding in place.
2. shadcn init with the Copper theme, components, AI Elements, and the other UI libraries. (3.3, 3.4)
3. Home page and brand components. (Criterion 2)
4. Supabase helpers, migrations, seed and the seed test. (Criterion 4)
5. AI wrapper, pricing, `ai_calls` logging and its tests. (Criteria 5, 6)
6. Agent harness: `CLAUDE.md`, `AGENTS.md`, settings, `.mcp.json`. (Criterion 8)
7. README, Deploy button, devcontainer, PR template, docs and `specs/README.md`. (Criteria 9, 10)

## 7. Change log

| Date | Change |
|---|---|
| 2026-10-10 | Draft created |
| 2026-10-10 | Step 1 versions: Node 24 (`.nvmrc`, `engines` `24.x`), next 16.4.0, react / react-dom 19.3.0, typescript 5.9.3, tailwindcss / @tailwindcss/turbopack 4.3.3, eslint 9.39.5, eslint-config-next 16.4.0, eslint-config-prettier 10.1.8, prettier 3.9.10, vitest 5.0.3, @vitejs/plugin-react 6.1.2, jsdom 30.1.2, @testing-library/react 16.3.3, @testing-library/dom 10.4.2, @testing-library/jest-dom 7.0.1, @types/node 24.19.2, @types/react / @types/react-dom 19.3.0 |
