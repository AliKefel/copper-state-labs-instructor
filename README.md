# Copper State Labs: CIS 591 instructor repo

_Instructor and TAs only. Students use the course repo,
[AliKefel/copper-state-labs-student](https://github.com/AliKefel/copper-state-labs-student)._

This repo holds every module's starter and solution, plus the instructor-only
teaching guides. `main` is only this index; the code is on the branches below.

## Branches

Each branch is built on the one before it, and fixes are merged forward in
this order:

```
base-repo → module-0-solution → module-1-starter → module-1-solution → …
```

| Branch              | What it is                                               | Published to students as |
| ------------------- | -------------------------------------------------------- | ------------------------ |
| `base-repo`         | Module 0 starter: the base app and `specs/module-0/`     | `module-0`               |
| `module-0-solution` | Module 0 solved (check-in line changed)                  | —                        |
| `module-1-starter`  | Module 0 solution plus `specs/module-1/` and the catalog | `module-1`               |
| `module-1-solution` | Module 1 solved (landing page)                           | —                        |

## Where things are (on any branch)

| Path                                            | What it is                                                                                      | Students get it |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------- |
| `docs/teaching/README.md`                       | Course teaching guide: grading, Docker, publishing, common problems                             | No              |
| `docs/teaching/product-bible-traps.md`          | The Product Bible's deliberate traps, review-dataset guidance, asset checklist                  | No              |
| `specs/module-N/teaching.md`                    | That module's guide: release checklist, how each criterion is checked, grading, common mistakes | No              |
| `specs/module-N/instructions.md`                | That module's student walkthrough                                                               | Yes             |
| `specs/module-N/spec.md`, `rubric.md`, `tests/` | What students build and how it's checked                                                        | Yes             |
| `docs/copper-state-labs/product-bible.md`       | Company facts (no course material)                                                              | Yes             |

| Module | Teaching guide                                                                                                                            | Student instructions                                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0      | [`specs/module-0/teaching.md`](https://github.com/AliKefel/copper-state-labs-instructor/blob/base-repo/specs/module-0/teaching.md)        | [`specs/module-0/instructions.md`](https://github.com/AliKefel/copper-state-labs-instructor/blob/base-repo/specs/module-0/instructions.md)        |
| 1      | [`specs/module-1/teaching.md`](https://github.com/AliKefel/copper-state-labs-instructor/blob/module-1-starter/specs/module-1/teaching.md) | [`specs/module-1/instructions.md`](https://github.com/AliKefel/copper-state-labs-instructor/blob/module-1-starter/specs/module-1/instructions.md) |

## Releasing a module

1. Finish the starter and the solution. The module's tests must fail on the
   starter and pass on the solution (`npm run check`).
2. After the previous module's deadline, copy the starter to the course repo's
   `module-N` branch **without** `docs/teaching/` and `specs/*/teaching.md`.
3. Check that `git diff --stat <starter> <course module-N>` lists only those
   files, then push the course branch.
4. Add the module to the table in the course repo's `main` README.

## Grading

From the module's solution branch, with Docker running:

```bash
export GH_TOKEN="$(cat ~/Developer/HONG-AI/grader/grading_token.txt)"
npm run grade:docker -- --module N \
  --roster ~/Developer/HONG-AI/grader/roster.csv \
  --deadline <deadline with time zone>
```

The roster, grading token and any hidden tests stay outside this repo. See
`docs/teaching/README.md` section 4 for the details.
