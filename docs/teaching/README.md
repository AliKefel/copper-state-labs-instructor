# Teaching guide: Copper State Labs course app

_For the instructor and TAs. Don't share this file with students._

This guide covers what's in the base repo, what to set up before Module 0, how modules are released and checked, and the problems students are most likely to hit. The full requirements are in [`docs/starter-app.md`](../starter-app.md); the student walkthrough is [`specs/module-0/instructions.md`](../../specs/module-0/instructions.md). The Product Bible's deliberate traps and the asset-generation guidance are in [`product-bible-traps.md`](product-bible-traps.md). Each module's own guide is in `specs/module-N/teaching.md` (section 2).

---

## 1. What the base repo gives students

| Area | What's there | Where |
|---|---|---|
| App | Next.js 16 (App Router), TypeScript strict, Tailwind v4 | `app/` |
| Placeholder page | Logo, "Copper State Labs", under-construction line, Week 0 line, footer. The real landing page is Module 1 | `app/page.tsx` |
| Brand | Copper theme (light and dark), Nunito headings, Source Sans 3 body, `Logo`, `SiteHeader`, `SiteFooter` | `app/globals.css`, `components/copper/` |
| UI kit | 21 shadcn components and 5 AI Elements components | `components/ui/`, `components/ai-elements/` |
| Database | Supabase helpers, a migration for the four Bible tables plus `ai_calls`, pgvector, seed data | `lib/supabase/`, `supabase/` |
| AI | `callText` / `callObject` through the Vercel AI Gateway; every call logged to `ai_calls` with tokens, cost and latency | `lib/ai/` |
| Agent harness | `AGENTS.md` (rules), `CLAUDE.md` (imports it), `.env` read block, three MCP servers | repo root, `.claude/` |
| Checking | `npm test` (app tests), `npm run check` (module acceptance criteria) | `tests/`, `specs/` |
| Delivery | CI, PR template, devcontainer, README | `.github/`, `.devcontainer/` |

**Everything builds and runs with no environment variables.** Pages that need Supabase or the gateway should render `<SetupRequired service="supabase" | "ai" />` instead of crashing. Put this in every module that adds such a page.

### Approved models and prices

Defined in `lib/ai/models.ts` and `lib/ai/pricing.ts`. Prices are Anthropic list prices per million tokens as of October 2026; the gateway may bill slightly differently.

| Model (gateway id) | Input | Output | Notes |
|---|---|---|---|
| `anthropic/claude-haiku-5.5` | $0.10 | $0.50 | **Default.** Price for prompts up to 100K tokens |
| `anthropic/claude-sonnet-5.5` | $2.00 | $10.00 | |
| `anthropic/claude-opus-5.5` | $4.00 | $20.00 | |

To add or change a model, edit both files. `tests/ai.test.ts` fails if a model has no price.

---

## 2. Module guides

Each module has its own instructor guide in `specs/module-N/teaching.md`: what students learn, what's in the starter, the release checklist, how each criterion is checked, grading, common mistakes, discussion prompts and limits. The setup checklist for the first release is in `specs/module-0/teaching.md`.

---

## 3. How students move through modules

Each module is a branch. **A module's solution is the next module's starter**, so the branches form one chain:

```
main (base) → module-0 → module-1 → module-2 → … → module-7
```

For each module, the student:

1. Clones that module's branch from the course repo.
2. Runs `npm run start-module` once. This makes the branch their `main`, renames the course remote to `course`, creates a **public** `copper-mN` repo on their account and pushes. It reads N from `course.config.json`. Public repos mean no invites to accept, free CI, and Vercel's free plan works.
3. Runs `npm ci`, does the work, checks with `npm run check`, and pushes.
4. If the module adds tables, runs `npm run db:migrate` against their **existing** Supabase project. Migrations accumulate in `supabase/migrations/`, and the seed is safe to re-run.

Because every module starts from the previous solution, a student who didn't finish Module N still starts Module N+1 with working code.

### Building a module

1. Branch `module-N` from the previous module's solution.
2. Set `"module": N` in `course.config.json`.
3. Create `specs/module-N/` (layout in `specs/README.md`): `spec.md`, `instructions.md` (follow the layout of the Module 0 and Module 1 instructions), `teaching.md` (instructor-only, same sections as the other modules), `tests/`, `rubric.md`, optional `evals/`, `data/`, `assets/`, `reflection.md`, `CLAUDE.md`, and optional grading extensions (`grading.mjs`, `checks/`, see section 4).
4. Name every test after its criterion: `it("AC-N.x <what it checks>", …)`. A criterion passes only if **all** tests with that ID pass. Tests without an ID are ignored by `check`.
5. Add starter stubs (TODOs) for what students will build.
6. **Check that the tests fail on the starter and pass on your solution.** If a test passes on the starter, it isn't testing the assignment.
7. If you fix something in an earlier branch, carry the fix forward by merging each branch into the next (`base-repo` → `module-0-solution` → `module-1-starter` → `module-1-solution` → …). Use merges, not rebases: the published student branches are copies of these.
8. **Publish** the starter to the student-facing course repo as its `module-N` branch, without the instructor-only files: `docs/teaching/` and every `specs/*/teaching.md`. Then check `git ls-files | grep -iE "teaching|solution"` prints nothing. Compare with `git diff --stat <instructor starter> <student branch>`: only those files should differ.

### What `npm run check` does

- Reads the module number from `course.config.json`.
- Runs the current module's `tests/` and `evals/`, plus every earlier module's `tests/` (not their evals), using `vitest.check.config.mts`.
- Prints a ✅/❌ line per criterion ID with its rubric points, a ⏳ line for rubric rows checked only when grading (like `DEPLOY`), and a summary like `3 of 4 criteria passed.` / `25 of 30 points from tests`. It exits non-zero if anything fails, and lists any test file that couldn't run (for example, a syntax error).
- `npm test` and CI **skip `specs/`**, so a student's unfinished module doesn't turn CI red.

`specs/module-0/` is both the demo and the Module 0 task: AC-0.1 passes on a fresh clone, and AC-0.2 passes once the student changes the Week 0 line.

### Evals

Put AI quality checks in `specs/module-N/evals/*.eval.ts`. They run as Vitest tests, so give them criterion IDs and assert on a score threshold (for example, 85% of review categories correct) rather than exact answers. **Evals call real models and cost money**; they only run for the current module, never for earlier ones.

---

## 4. Grading

### Grade in Docker, never directly

Grading runs each student's code, and code runs with the full access of whoever runs it. Run plainly on your Mac, a student's code could read your files and SSH keys, use your `gh` login (`gh auth token` prints it, even though it's kept in the keychain) or alter the grader for everyone after them. It would only take a few lines hidden in their app.

`npm run grade:docker` runs the same grader inside a throwaway Linux container instead:

- The container holds a copy of this repo and **one read-only GitHub token**. None of your files, logins or keys are in it.
- Each student's code runs as **its own user** inside the container. It can't write to the grader, the shared packages, other students' checkouts or the results, and it can't read the grader's token.
- **None of your folders is mounted.** The roster, hidden tests and result cache are copied into root-only folders before grading, and the results are copied back to `.grading/` at the end. (On a Mac, Docker Desktop lets every user in a container read a mounted folder, so mounting would let student code read the roster and earlier grades.)
- The container has no extra privileges, has memory and process limits, and is deleted when grading ends.

Use plain `npm run grade` only on repos you trust, such as the fake students in the grader's own tests.

### One-time setup

1. **Install Docker Desktop** (docker.com) and start it. It must be running whenever you grade.
2. **Create the grading token.** On GitHub: Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token.
   - Name: `cis591-grading`. Expiration: the end of the semester.
   - Repository access: **Public repositories**.
   - Permissions: **none**.

   The grader only reads students' public repos and their deployment records, so this token can't change anything, even if it leaks. Don't use your own login token (`gh auth token`): that one can push to and delete your repos.
3. **Store the token outside the repo**, for example in your password manager or in `~/cis591/grading-token` with `chmod 600`.
4. **Make the roster** (keep it outside the repo): a CSV with columns `name`, `github` and optional `vercel_url`, `repo` and `branch`. Fill `repo` when a student submitted a repo not named `copper-mN` (for example `copper-m1-ext`), and `branch` when their work isn't on the default branch; leave them empty otherwise. Use the Vercel link from each student's Module 0 submission; it's only used if GitHub has no deployment record.

### Grading a module

From your checkout of the module's **solution** branch (it has every module's specs and tests up to that point), with Docker Desktop running:

```bash
export GH_TOKEN="$(cat ~/cis591/grading-token)"
npm run grade:docker -- --module 2 \
  --roster ~/cis591/roster.csv \
  --deadline 2026-11-03T23:59-07:00 \
  --hidden ~/cis591/hidden-tests
```

The first run builds the grading image, which takes a few minutes. After that it's rebuilt in seconds unless `package-lock.json` changed.

**Disk space:** the grading image is about 1.5 GB. Each run deletes students' checkouts when it ends, and removes the previous grading image after a rebuild, so it doesn't grow over the semester. What stays in `.grading/` is a few KB per student. Docker also keeps a build cache shared by all your projects; if Docker Desktop's disk use grows, run `docker builder prune` (it only clears cached build steps, and the next build is slower).

| Option | What it does |
|---|---|
| `--roster <csv>` | **Required.** The roster CSV |
| `--module <n>` | Module to grade (default: `module` in `course.config.json`) |
| `--deadline <time>` | Grade each student's last commit before this time. Include the time zone |
| `--hidden <dir>` | Hidden tests: `<dir>/module-2-…/*.test.ts`, named after the module's folder, are added to the module's tests for grading only |
| `--out <dir>` | Output folder (default: `.grading/module-N/`, which is gitignored) |
| `--concurrency <n>` | Students graded at once (default: half the CPU cores Docker has) |
| `--only a,b` | Grade only these GitHub usernames (for regrades) |
| `--evals` | Also run AI evals. Needs `GRADING_GOOGLE_GENERATIVE_AI_API_KEY`; see below |
| `--no-cache` | Grade everyone again from scratch |

It stops with a clear message if Docker isn't running, `GH_TOKEN` isn't set, or the roster or hidden-tests folder doesn't exist.

**Keep the roster, hidden tests, token and results outside the repo** (or in `.grading/`). This repo's branches are published to students. The grader code itself isn't secret.

### What it does for each student

1. Clones `github.com/<github>/copper-mN` (partial clone, fast) and picks the **last commit before the deadline**. If later commits exist, the student is marked `late`; if there's no repo or no commit before the deadline, `no submission`.
2. Copies **your** grading files over the student's: every `specs/module-*/tests`, `evals`, `rubric.md`, `grading.mjs` and `checks/`, plus the check and grade scripts and the Vitest check config. Editing those in a student repo has no effect.
3. Links the image's `node_modules` into the checkout (the lockfile is identical, so no install). If the student changed dependencies, it runs `npm ci --ignore-scripts` for that student only.
4. Runs the module's checks as that student's own user, with **no keys or tokens** in the environment and a per-student timeout (default 3 minutes).
5. Caches results by graded commit plus a fingerprint of your grading files. Re-running only regrades students who pushed or whose tests you changed. The deployment check always re-runs (it takes about a second).

### Output

- **`grades.csv`:** status, graded commit, points per rubric row, auto-graded total and maximum, blank columns for manual rows (TAs fill these in), notes. Ready to import into Canvas.
- **`feedback/<github>.md`:** the same checklist students see with `npm run check`, plus points and failure details. Share through Canvas.

In testing, 4 fake students graded in about 2 seconds on a laptop without Docker. Expect roughly 2–4 minutes for 60 students; this will be measured on the first real module.

### The deployment check

For each student it asks GitHub for the repo's production deployments (Vercel reports them when a student imports the repo, as in the last step of each module's student instructions), falling back to the roster's `vercel_url`. It loads the page and passes if it returns 200 and shows the marker text, by default the footer "Fictional — for educational use." The details say whether the deployed commit matches the graded one. **Confirm on your dry-run account** that the grader finds a real Vercel deployment.

**Vercel's login on deployment URLs.** New Vercel projects turn on Vercel Authentication, which puts a Vercel login in front of each deployment's own URL (`copper-m0-12j5-m6oj94gwm-<team>-projects.vercel.app`), the URL Vercel reports to GitHub. The project's production domain (`copper-m0-12j5.vercel.app`) stays public. When a URL leads to the Vercel login, the check tries the roster's `vercel_url`, then the production domain worked out from the deployment URL, and says so in the feedback. Working out the domain is a best guess, so **fill `vercel_url` from the links students submit** (their public `https://<project>.vercel.app` link). Don't ask students to turn the protection off.

### Evals

`--evals` runs `specs/module-N/evals` only for students whose spec tests all pass, with `GOOGLE_GENERATIVE_AI_API_KEY` set from your `GRADING_GOOGLE_GENERATIVE_AI_API_KEY`. Evals call the student's AI features, so this is the one key student code **can** read during grading, and a student could make their code send it elsewhere. So:

- Create a **grading-only** AI Gateway key, never your personal one.
- Give it a **low spending limit** (roughly class size × evals per student × a few cents).
- **Delete it and make a new one** after each module's grading.

```bash
export GRADING_GOOGLE_GENERATIVE_AI_API_KEY="$(cat ~/cis591/grading-ai-key)"
npm run grade:docker -- --module 3 --roster ~/cis591/roster.csv --deadline … --evals
```

### Testing the grading container

`tests/grade/docker.test.ts` checks the wrapper with a fake `docker` on every `npm test`. To test the real container after changing the grader or `Dockerfile.grader`, run with Docker Desktop running:

```bash
GRADER_DOCKER_TEST=1 npx vitest run tests/grade/docker.test.ts
```

It builds the image and runs the grader's end-to-end test inside it, plus `tests/grade/isolation.test.ts`, where a fake student's page tries to rewrite the grader, the packages, the results and another student's checkout, to read the roster and earlier results, and to read the token, then reports what it managed. Every attempt must be blocked.

### Adding grading to a new module

Everything a module needs lives in its own folder, so module branches never change the grader itself:

1. **`specs/module-N/rubric.md`** (required): a table with `Criterion | Points | Graded by | Description`. "Graded by" is `auto` or `manual`. Add a `DEPLOY` row to include the deployment check.
2. **Tests** named after their criteria, as in section 3.
3. **Optional `specs/module-N/grading.mjs`** to choose checks and settings:

   ```js
   import schemaCheck from "./checks/schema.mjs";
   export default {
     checks: ["tests", "deploy", schemaCheck], // built-ins: tests, deploy, evals
     deploy: { marker: "Review Radar" },      // text the live page must show
     timeoutMs: 180_000,
   };
   ```

4. **Optional custom checks** in `specs/module-N/checks/*.mjs`. A check is an object:

   ```js
   export default {
     id: "schema",
     criteria: ["SCHEMA"],     // rubric rows it produces
     needsWorkspace: true,     // needs the student's code checked out (default true)
     cache: true,              // cache by commit (default true)
     async run(ctx) {          // ctx.dir, ctx.uid, ctx.sha, ctx.student, ctx.settings, ctx.gh, ctx.fetch, ctx.previous
       return { results: [{ criterion: "SCHEMA", passed: true, detail: "…" }], errors: [] };
     },
   };
   ```

A custom check that runs student code must run it as the student's user: pass `uid: ctx.uid` to `runAsync` from `scripts/grade/proc.mjs`, with `env: safeEnv()`. `ctx.uid` is undefined outside the container.

`tests/grade/consistency.test.ts` runs on every branch and fails if a tested criterion is missing from the rubric, or an `auto` rubric row has no test or check that produces it.

### Other grading notes

- **Integrity:** repos are public, so students can see classmates' work while a module is open. Use the PR template's "AI-generated code I rejected or corrected" and the reflections for the parts that are hard to copy.
- **Commit times come from git**, which a determined student can backdate. If a late submission looks suspicious, compare with the push time shown on GitHub.
- **Students can game their own tests.** Tests run in the same process as the student's code, so a student who knows how could make their own tests report a pass. The container stops them from affecting anyone else's grade, but not their own. The code would be in their public repo; if a score looks too good for what the app does, read the code or open their Vercel site.
- **Hidden tests are visible to student code while it's graded**, because they run alongside it. Treat them as a deterrent for one term, not a secret forever.
- **Cost evidence:** every AI call is in the student's `ai_calls` table (module, feature, model, tokens, cost, latency, ok). Useful for Module 2 (cost per call) and Module 7 (pricing).

---

## 5. Things that look like bugs but aren't

| What you'll see | Why |
|---|---|
| The Product Bible contradicts itself (old 2024 privacy policy, "Copper never records you" FAQ) | Deliberate traps for Modules 2, 3 and 7 (listed in `docs/teaching/product-bible-traps.md`). `AGENTS.md` tells agents never to fix them |
| `npm run check` fails on a fresh clone | AC-0.2 is the Module 0 task; it passes once the student edits the line |
| `AGENTS.md` ends with a "This is NOT the Next.js you know" block | Next.js 16 writes this block on every `npm run dev`. It's committed so the working tree stays clean. Edit only the rules above it |
| `components/ui/field.tsx` instead of `form.tsx` | `form` is an empty placeholder in the current shadcn style; `field` is its replacement and works with react-hook-form |
| `npm audit` reports 5 high-severity issues | All come from one advisory (`braces`) in the dev-only ESLint packages. The only offered fix downgrades ESLint for Next 14 |
| Lint rules turned off in `components/ai-elements/` | That code is generated by the AI Elements CLI and would be overwritten if patched |
| Claude Code shows MCP servers as "pending approval" | Normal: Claude Code asks once before trusting a project's MCP servers |

---

## 6. Common student problems

| Problem | Fix |
|---|---|
| `start-module`: "log in to GitHub first" | `gh auth login` |
| `start-module` stopped with an error | Fix what the message says and run it again; it picks up where it stopped |
| `start-module`: "already set up" | It finished before. Their repo exists; continue |
| `start-module`: "could not push" | They already have a `copper-mN` with other work in it. Delete it on GitHub and run again |
| Wrong Node version / odd install errors | `node --version` must be 24. Then `rm -rf node_modules && npm ci` |
| Ran `npx ai-elements` without `add` | It installs the whole library (about 60 files). Undo with `git checkout -- package.json package-lock.json components/`, then delete the new untracked files `git status` lists, keeping any the student wrote themselves |
| "Set up Supabase / the AI gateway to use this page" | Expected until they add the variables to `.env.local` **and** to Vercel, then restart the dev server |
| `npm run db:migrate`: "Set up Supabase to run migrations" | `SUPABASE_DB_URL` is missing from `.env.local`. It's the **direct connection** string and includes the database password |
| Agent says it can't read `.env.local` | Working as intended. Students should tell the agent variable names, never values |
| Vercel deploy works locally but not online | Variables were added to `.env.local` but not to the Vercel project |
| `npm run check` shows "could not run" | Compile error in their code. `npm run typecheck` shows it |

---

## 7. Security and privacy notes

- **Student repos are public.** Remind students never to paste keys into code; bots find leaked keys within minutes. Some schools require consent or an opt-out for public coursework; check your institution's policy.
- **No row-level security until a later module.** Anyone with the publishable key (which ships to the browser) can read the Bible tables and read or insert `ai_calls` rows. That's acceptable for fictional data, but tell students not to store anything personal until then.
- **`SUPABASE_DB_URL` and `AI_GATEWAY_API_KEY` are secrets.** They belong only in `.env.local` and Vercel. `.gitignore` ignores `.env*`, and `.claude/settings.json` blocks Claude Code from reading them.
- **The gateway key spends money.** Suggest students set a spending limit in the Vercel AI Gateway dashboard. The default model is the cheapest one.
- **Grade only with `npm run grade:docker`** and the read-only grading token (section 4). Plain `npm run grade` runs students' code with your full access.
- **The grading AI key is readable by student code** during `--evals`. Keep it grading-only, with a low spending limit, and rotate it after each module.
- **Supabase MCP is read-only** (`read_only=true` in `.mcp.json`), so agents can inspect the database but not change it.

---

## 8. Maintaining the base

- **Versions are pinned exactly** (`.npmrc` has `save-exact=true`) and recorded in the spec's change log. Upgrade deliberately, run the full suite, and add a change-log row.
- **Adding shadcn components:** `npx shadcn@4.21.4 add <name>`. **AI Elements:** `npx ai-elements@1.9.0 add <name>`, always naming the components.
- **Theme contrast:** button text (Night Sky) on Copper is 4.14:1, below the 4.5:1 guideline for small text. If you want full compliance, use `#A6672E` for `--primary` in `app/globals.css` and raise the threshold in `tests/theme.test.ts`.
- **Schema changes** go in a new file in `supabase/migrations/`. `tests/seed.test.ts` runs every migration and the seed in PGlite, so database tests need no Docker or Supabase account.
- **After changing the base**, merge it forward through the module chain and re-check that each module's tests still fail on its starter and pass on its solution.
