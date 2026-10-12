# Module 1: Teaching guide (landing page)

_Fictional — for educational use. **Instructor-only: never publish this file to students.**_

Students replace the Week 0 placeholder with a one-page landing page for Copper Home, Copper Notes and Copper Plus, built with an AI agent from `spec.md`. The base teaching guide (`specs/base/teaching.md`) covers the grader, Docker and publishing in general; this guide covers what's specific to Module 1.

---

## 1. What students learn

- **Working from a spec with an agent:** plan one section at a time, read the plan, check it, commit.
- **Data, not copy:** prices and plans come from `lib/copper/catalog.ts`. The test that swaps in different prices shows why hard-coded values break.
- **Using assets properly:** `git mv` instead of re-creating files, `next/image`, real alt text.
- **Honesty under pressure (Bible trap):** the old marketing FAQ says "Copper never records you." The 2026 policy says requests are saved after the wake word. The page must follow the policy (AC-3.3).
- **Responsive design and brand consistency**, judged by a person (DESIGN).

## 2. What's in the starter

| Path | What it is |
|---|---|
| `specs/module-1/spec.md` | The requirements students build from |
| `specs/module-1/assets/` | Six images: 2 cutouts, 3 lifestyle photos, the mascot. Students move them to `public/assets/` in spec Step 0 |
| `specs/module-1/tests/landing-page.test.tsx` | The 12 auto-graded criteria |
| `specs/module-1/rubric.md`, `grading.mjs` | Points, and the deploy marker (the tagline) |
| `specs/module-1/student_instruction.md` | The student walkthrough |
| `lib/copper/catalog.ts`, `lib/copper/data/catalog.json` | Products, plans, features, colors, image paths and 2026 privacy points, with formatting helpers. `tests/catalog.test.ts` checks it against the Bible |
| `course.config.json` | `"module": 1`, so `npm run check` shows Module 1 and Module 0's Week 0 tests retire |

The home page is still Module 0's placeholder (with your Week 0 solution line), so the starter scores **0 of 12** on `npm run check`.

## 3. Before releasing Module 1

- [ ] **Build your solution on `module-1-solution`** and confirm `npm run check` shows 12 of 12 and `npm test`, lint and typecheck pass. Deploy it once to Vercel to confirm the tagline marker is found.
- [ ] **Release after Module 0's deadline.** The starter contains the Module 0 solution (the edited Week 0 line).
- [ ] **Publish `module-1-starter` as the course repo's `module-1` branch**, the same way as Module 0: a history-free copy, with instructor files removed. For this module the removal list is:

  ```bash
  git rm -rq --ignore-unmatch specs/base/teaching.md specs/base/spec.md \
    docs/copper-state-labs/assets specs/module-1/teaching.md
  ```

  Then check `git ls-files | grep -iE "teaching|solution"` prints nothing.
- [ ] **Post `COURSE_REPO_URL`** in Canvas (student instructions use the placeholder).
- [ ] **Dry run:** with your test account, clone `module-1`, run `npm run start-module` (creates `copper-m1`), do Step 0, and check `npm run check` passes AC-2.3.

## 4. How each criterion is checked

All tests render `app/page.tsx` in Vitest (jsdom), so grading takes about 2 seconds per student. There's no browser, Lighthouse or `next build` per student.

| ID | Pts | The test checks | It doesn't check |
|---|---|---|---|
| AC-1.1 | 5 | Seven `data-testid`s in order, and the `id`s | What's inside each section |
| AC-1.2 | 5 | Header `<a>`s ending in `#products`, `#plus`, `#privacy`; a "See products" link in the hero to `#products` | Smooth scrolling, sticky header |
| AC-1.3 | 5 | One `h1`, inside the hero, ≤10 words; tagline text present exactly | Headline quality |
| AC-1.4 | 5 | Only `app/page.tsx` is a page or route; no `pages/` folder | — |
| AC-2.1 | 5 | Hero `<img>`s include both `/assets/cutouts/…` files | Layout of the hero |
| AC-2.2 | 5 | Each `product-card` (`data-product`) shows its cutout; showcase has a lifestyle photo per product | Captions |
| AC-2.3 | 5 | The six files exist in `public/assets/…`; `specs/module-1/assets` is gone | That `git mv` (not copy and delete) was used |
| AC-2.4 | 5 | Every `<img>` has `data-nimg` (next/image), comes from `/assets/` or `/brand/` (logo), and has alt text that isn't "image", "logo" or a file name | Whether images load, or are stretched (DESIGN) |
| AC-3.1 | 10 | The catalog still holds official values; the page shows them; with a mocked catalog (+$50 per product, Plus $9.49/$95) the page shows the new prices and none of the old ones | Notes hours or memory changes |
| AC-3.2 | 5 | Privacy section mentions "Hey Copper", the cloud, 30 days, 12 months, delete, Copper app | Tone |
| AC-3.3 | 5 | No "never record(s)" anywhere on the page | Other misleading wording |
| AC-4.1 | 15 | "See products" has `bg-primary` (or `bg-[#b87333]`); no hex colors outside the brand palette and white in `app/` and `components/` (excluding `components/ui` and `components/ai-elements`) | Tailwind named colors like `text-gray-500`, fonts, contrast |
| DESIGN | 10 | Manual: the TA's review at three widths | — |
| DEPLOY | 15 | A live Vercel production deployment whose page shows "From raw ideas to refined answers." | Whether the live site is the graded commit (noted in feedback) |

AC-1.4, AC-2.4 and AC-3.3 also require the hero to exist, so the untouched placeholder earns nothing.

## 5. Grading Module 1

From `module-1-solution` (it has every spec up to Module 1), with Docker running:

```bash
export GH_TOKEN="$(cat ~/Developer/HONG-AI/grader/grading_token.txt)"
npm run grade:docker -- --module 1 \
  --roster ~/Developer/HONG-AI/grader/roster.csv \
  --deadline <deadline with time zone>
```

The grader looks for each student's `copper-m1` repo. Results land in `.grading/module-1/`: `grades.csv` has a blank **DESIGN** column for TAs.

### DESIGN review (10 points)

For each student, a TA opens the Vercel URL and uses the browser's device toolbar at **375**, **768** and **1280** px. Score each row of the design rubric in `spec.md` 0–2 (first impression, visual hierarchy, use of imagery, brand consistency, spacing and polish) and enter the total in the DESIGN column. Note anything that the tests can't see:

- horizontal scrolling or overlapping text on a phone
- stretched or squashed images
- off-brand Tailwind colors (`text-gray-…`, `bg-blue-…`), which AC-4.1 doesn't catch

About 3–4 minutes per student. Calibrate by scoring three submissions together first.

## 6. What students commonly get wrong

| What you'll see | Cause | Fails |
|---|---|---|
| Prices typed into the JSX | The agent copied numbers from the spec | AC-3.1 |
| "See products" is a `<button onClick=…>` | The agent used JavaScript scrolling | AC-1.2 |
| Two `h1`s | Section titles made `h1` | AC-1.3 |
| `#333333`, `#f5f5f5` or `text-[#…]` greys | The agent's default palette | AC-4.1 |
| `alt="image"` or `alt="copper-home.png"` | Alt text left to the agent | AC-2.4 |
| Images copied instead of moved, or renamed | Step 0 skipped or "improved" | AC-2.3, and AC-2.1/2.2 paths |
| "Copper never records you" on the page | The agent read the Marketing FAQ trap | AC-3.3 |
| Every criterion failing | The page crashes in tests, or no `data-testid="hero"` | All |
| DEPLOY 0 with a live site | Vercel is serving the Week 0 placeholder (wrong repo imported), or the tagline is missing | DEPLOY |

The tests await the page if it's an `async` server component, but only plain synchronous pages have been tried so far. If an async page fails every criterion, check that first. Static image imports (`import home from "@/public/…"`) haven't been tried either; the spec asks for `/assets/…` string paths, which are tested.

## 7. Discussion prompts

- **The never-records trap:** why might marketing copy and policy disagree? What did your agent do when it found both? (Sets up Module 3's conflicting-sources trap and Module 7's trust discussion.)
- **Copper Plus pricing:** heavy Plus users cost more than they pay (Bible §5). Should the landing page push Plus harder, or not? Who is that page really for?
- **Spec versus judgment:** the tests passed but the design review didn't. What could a test never tell you?

## 8. Limits to know about

- **Tests can't see layout.** Responsiveness, image proportions and visual polish are only in DESIGN.
- **Students can game their own tests** (same as every module; see the base guide). The page code is public, and DESIGN looks at the real site.
- **AC-3.1 mocks `@/lib/copper/catalog`.** A page that imports `lib/copper/data/catalog.json` directly, bypassing `catalog.ts`, fails AC-3.1. The spec requires `catalog.ts`, so that's intended.
