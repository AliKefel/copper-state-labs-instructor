# Module 0: Set up the Copper State Labs app

_Fictional — for educational use._

Welcome to CIS 591. All semester you'll build one app for **Copper State Labs**, a fictional Arizona company that makes AI-first devices. Each module adds a feature to the same app.

This week you'll get the starter app running on your computer, make your own copy on GitHub, put it on the web, and complete one small change that proves everything works.

> **Placeholders:** wherever you see `COURSE_REPO_URL`, use the course repository link your instructor posts in Canvas.

---

## What you need

| Tool | Why | Get it |
|---|---|---|
| GitHub account | Your code lives here | https://github.com/signup |
| GitHub CLI (`gh`) | Creates your repo for you | https://cli.github.com, then run `gh auth login` |
| Node.js 24 | Runs the app | https://nodejs.org (choose version 24) |
| Git | Downloads and saves your code | Included on Mac; https://git-scm.com on Windows |
| Vercel account | Puts your app on the web | https://vercel.com/signup (sign up with GitHub) |
| An AI coding agent | Your main way of working | Claude Code |

You'll also need a **Supabase** account (database) and an **AI Gateway key** later in the course. You don't need them this week. The app runs without them.

**Check your setup** in a terminal:

```bash
node --version   # should start with v24
git --version
gh auth status   # should say you're logged in
```

---

## Step 1: Get the starter code and make it yours

1. Clone the Module 0 starter:

   ```bash
   git clone --branch module-0 COURSE_REPO_URL copper-m0
   cd copper-m0
   ```

2. Create your own copy on GitHub:

   ```bash
   npm run start-module
   ```

   This one command:
   - makes the starter your `main` branch
   - creates a **public** repo called `copper-m0` on your GitHub account and pushes the code to it. It's public so your instructor can grade it and you can show it to employers
   - keeps the course repo connected under the name `course`

   If it stops with an error, read the message, fix what it says (for example, run `gh auth login`), and run it again. It picks up where it stopped.

3. Install the app's packages:

   ```bash
   npm ci
   ```

## Step 2: Run the app

```bash
npm run dev
```

Open http://localhost:3000. You should see the Copper State Labs logo, "Our new site is under construction.", a highlighted **Week 0 check-in** line, and the footer "Fictional — for educational use." Try the sun/moon button for dark mode.

Stop the server with `Ctrl + C`.

## Step 3: Check your progress

Each module comes with automatic checks. Run:

```bash
npm run check
```

You'll see something like:

```
Module 0: acceptance criteria

  ✅ PASS  AC-0.1 (5 pts)  The home page shows the Week 0 line
  ❌ FAIL  AC-0.2 (10 pts)  The Week 0 line was changed from the default text
  ⏳ LATER DEPLOY (5 pts)  The app is live on Vercel (checked when grading)

1 of 2 criteria passed.
5 of 15 points from tests, plus 5 points checked later.
```

One failure is expected: that's your task. `DEPLOY` is checked when your instructor grades: it looks for your live Vercel site (Step 6).

## Step 4: Your Module 0 task

Change the Week 0 line to say something about you.

1. Open `app/page.tsx`. Find the line marked `{/* MODULE 0: change this line */}`.
2. Replace `Week 0 check-in: Hello from Copper State Labs!` with your own sentence. For example: `Week 0 check-in: Hi, I'm Jordan and I'm excited to build with AI.`
3. Save, then check your work:

   ```bash
   npm test
   npm run check
   ```

   `npm run check` should now say **2 of 2 criteria passed** and **15 of 15 points from tests**.

**Try it with your AI agent.** Open Claude Code (or Codex) in the project folder and ask it to make the change. You'll notice it shows you a plan and waits for your OK first. That's on purpose: the project's `CLAUDE.md` / `AGENTS.md` file tells the agent how to work in this course.

## Step 5: Save and push

```bash
git add app/page.tsx
git commit -m "Module 0: personalize the check-in line"
git push
```

Open `https://github.com/YOUR-USERNAME/copper-m0` to confirm your change is there. A green check mark next to the commit means the automatic tests (CI) passed.

## Step 6: Put it on the web

1. Go to https://vercel.com/new.
2. Import your `copper-m0` repository.
3. Leave every setting as it is. **Don't add any environment variables yet.**
4. Click **Deploy**.

After a minute you'll get a link like `https://copper-m0-yourname.vercel.app`. Open it and check that your Week 0 line is there.

## What to submit

In Canvas, submit:

1. Your GitHub repo link (`https://github.com/YOUR-USERNAME/copper-m0`)
2. Your Vercel link
3. A screenshot of `npm run check` showing **2 of 2 criteria passed**

---

## Working with AI agents in this course

The repo comes set up for Claude Code and Codex.

- **Plan first.** The agent shows a plan and waits for your approval. Read it before saying yes.
- **Tests come with every change.** The agent runs `npm test` before saying it's done.
- **Secrets stay secret.** The agent is blocked from reading `.env` files.
- **MCP servers:** the first time you start Claude Code in the project, it asks you to approve three helpers: shadcn (UI components), next-devtools (Next.js docs) and supabase (read-only database access). Approve them.
- **Codex users:** Codex doesn't read the project's MCP file. The README has a snippet to paste into `~/.codex/config.toml`.

## Rules

- **Never commit `.env` or `.env.local` files, and never paste a key or password into code.** Your repo is public: bots scan GitHub for leaked keys within minutes, and a leaked AI Gateway key spends real money. Keep keys only in `.env.local` and in Vercel. When you get an AI Gateway key later, set a spending limit on it.
- **Don't edit anything in `specs/*/tests` or `specs/*/evals`.** Those are how your work is checked, and your instructor grades with their own copy.
- **Don't "fix" the Product Bible.** Some facts in `docs/copper-state-labs/product-bible.md` deliberately conflict, like an old privacy policy that's still in the system. Later modules depend on those traps.
- **Everything about Copper State Labs is fictional.** Don't use real company names, logos or products in your work.

## Useful commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the app at http://localhost:3000 |
| `npm test` | Run the app's tests |
| `npm run check` | Show which of this module's criteria pass |
| `npm run lint` | Check code style |
| `npm run typecheck` | Check for type errors |
| `npm run format` | Tidy up formatting |

## Troubleshooting

| Problem | Fix |
|---|---|
| `node --version` isn't v24 | Install Node 24 from nodejs.org, or run `nvm use` if you have nvm |
| `npm run start-module` says to log in | Run `gh auth login` and choose GitHub.com and HTTPS |
| `npm run start-module` says "already set up" | It already finished. Your repo exists; carry on with `npm ci` |
| `npm run start-module` says it could not push | You already have a `copper-m0` repo with other work in it. Delete it on GitHub (Settings > Delete this repository) and run the command again |
| Port 3000 is in use | Stop the other server, or run `npm run dev -- -p 3001` |
| `npm run check` shows "could not run" | Something in your code doesn't compile. Run `npm run typecheck` to find it |
| Vercel build fails | Run `npm run build` on your computer and fix the first error it shows |

**Working from another computer?** After Step 1 has created your repo, you can also open it on GitHub and choose **Code → Codespaces → Create codespace**. It installs everything and starts the app in your browser, so you can do Steps 2–5 there. Step 1 itself needs Git, `gh` and Node on your own computer; if that's not possible, ask a TA.

Stuck for more than 20 minutes? Post in the course forum with the command you ran and the full error message, or come to office hours.
