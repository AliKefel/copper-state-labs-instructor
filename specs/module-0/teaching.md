# Module 0: Teaching guide (setup)

_Fictional — for educational use. **Instructor-only: never publish this file to students.**_

Students get the starter app running, create their own public `copper-m0` repo, deploy it to Vercel and change one line on the placeholder home page. The course teaching guide (`docs/teaching/README.md`) covers the grader, Docker and publishing in general; this guide covers what's specific to Module 0.

---

## 1. What students learn

- **The course workflow:** clone a module branch, `npm run start-module`, work, `npm run check`, push, deploy. Every later module repeats it.
- **Working with an agent under rules:** `AGENTS.md` makes the agent plan first and wait for approval, even for a one-line change. Students see that before the work gets bigger.
- **Checks as a to-do list:** a fresh clone fails AC-0.2 on purpose, so the first `npm run check` shows what's left to do.
- **Public code, private secrets:** their repo is public from day one, and keys never go in it.

## 2. What's in the starter

| Path | What it is |
|---|---|
| `specs/module-0/instructions.md` | The student walkthrough |
| `specs/module-0/spec.md` | The two acceptance criteria |
| `specs/module-0/tests/week-0.test.tsx` | AC-0.1 and AC-0.2. Both run only while `course.config.json` says `"module": 0` |
| `specs/module-0/rubric.md` | Points: AC-0.1 5, AC-0.2 10, DEPLOY 5. No `grading.mjs`, so the grader runs `tests` and `deploy` with the default marker |
| `app/page.tsx` | The placeholder page with the `week-0-line` check-in line |
| Everything else | The base app: see section 1 of the course guide and `docs/architecture.md` |

A fresh clone scores **1 of 2** criteria (5 of 15 points) on `npm run check`.

## 3. Before releasing Module 0

- [ ] **Publish `base-repo` as the course repo's `module-0` branch**, with the instructor-only files removed (`docs/teaching/` and every `specs/*/teaching.md`; see "Building a module" in the course guide). Then check `git ls-files | grep -iE "teaching|solution"` prints nothing.
- [ ] **Check the clone URL.** `specs/module-0/instructions.md` and the course repo's `main` README use `https://github.com/AliKefel/copper-state-labs-student.git`, and every module branch is named `module-N`.
- [ ] **Do a dry run with a test GitHub account:** clone `module-0`, `npm run start-module`, `npm ci`, `npm run dev`, change the line, `npm run check` (2 of 2), push, deploy on Vercel. This also confirms starter-app criteria 9 and 10.
- [ ] **Confirm starter-app criterion 5 once** with real keys: put `AI_GATEWAY_API_KEY`, the Supabase URL and publishable key, and `SUPABASE_DB_URL` in `.env.local`, run `npm run db:migrate`, then `npm test`. The live test in `tests/ai.integration.test.ts` stops being skipped and checks the `ai_calls` row.
- [ ] **Open the repo in Codespaces once** to confirm it reaches a running dev server (criterion 10).
- [ ] **Push a branch and open a PR** to confirm CI passes (criterion 3).
- [ ] **Set up grading** (course guide section 4): install Docker Desktop, create the read-only grading token, and grade your dry-run account once with `npm run grade:docker` to confirm the deployment check finds its Vercel site.

## 4. How each criterion is checked

| ID | Pts | The test checks | It doesn't check |
|---|---|---|---|
| AC-0.1 | 5 | `app/page.tsx` renders an element with `data-testid="week-0-line"` | What the line says |
| AC-0.2 | 10 | That element's text, trimmed, isn't the default `Week 0 check-in: Hello from Copper State Labs!` | That the new text is about the student, or isn't empty |
| DEPLOY | 5 | A live Vercel production deployment of `copper-m0` whose page shows the footer "Fictional — for educational use." | That the live site shows the changed line (the details say whether the deployed commit is the graded one) |

## 5. Grading Module 0

From `module-0-solution` (or `base-repo`), with Docker running:

```bash
export GH_TOKEN="$(cat ~/Developer/HONG-AI/grader/grading_token.txt)"
npm run grade:docker -- --module 0 \
  --roster ~/Developer/HONG-AI/grader/roster.csv \
  --deadline <deadline with time zone>
```

The grader looks for each student's `copper-m0` repo. Results land in `.grading/module-0/`: `grades.csv` and `feedback/<github>.md`.

**Fill the roster's `vercel_url` from the links students submit.** New Vercel projects put a login in front of deployment URLs, and the submitted `https://<project>.vercel.app` link is the reliable fallback. Module 0 is the first time you collect them, so check a few by hand.

## 6. What students commonly get wrong

| What you'll see | Cause | Fails |
|---|---|---|
| No `copper-m0` repo | `start-module` stopped (not logged in to `gh`) and they moved on, or the repo has another name | Everything ("no submission") |
| AC-0.1 fails after the change | The agent replaced the whole `<p>`, dropping `data-testid="week-0-line"` | AC-0.1 |
| Changed the line but didn't push | Committed locally only | AC-0.2 (graded commit still has the default) |
| DEPLOY 0 with a working local app | Imported the course repo or a fork on Vercel instead of their own `copper-m0`, or never deployed | DEPLOY |
| Wrong Node version, odd install errors | Node isn't 24. `rm -rf node_modules && npm ci` after switching | Nothing graded; blocks setup |
| Pasted a key into code "to make it work" | Nothing in Module 0 needs keys | Not graded, but rotate the key |

The course guide's "Common student problems" table covers `start-module` messages and the other setup errors.

## 7. Discussion prompts

- **The agent's plan:** what did your agent propose for a one-line change? Did you read the plan before approving it? What would you check in a plan for a bigger change?
- **Public by default:** your repo is public. What would happen if a key ended up in it? How does the starter protect you (`.gitignore`, the agent's `.env` block), and where does that protection stop?
- **Checks as a contract:** `npm run check` passed. What does that prove, and what doesn't it prove? (AC-0.2 passes for any change, even an empty line.)

## 8. Limits to know about

- **AC-0.2 only checks that the text changed.** An empty line or random text passes. That's fine for a setup module; DEPLOY and the submission screenshot show they went through the whole workflow.
- **Module 0's tests retire after Module 0.** They run only while `course.config.json` says `"module": 0`, so later modules can replace the placeholder page.
- **DEPLOY uses the default marker** (the footer), which every deployment of the starter shows, so it proves the site is live, not that it has the student's change.
- **Students can game their own tests** (same as every module; see the course guide). It doesn't matter here: the change is the whole task.
