#!/usr/bin/env bash
# npm run start-module: run once, right after cloning a module branch.
# Makes the branch your local main, keeps the course repo as the "course" remote,
# and creates your public copper-mN repo on GitHub and pushes to it.
set -euo pipefail

cd "$(git rev-parse --show-toplevel)"

config() { node -p "require('./course.config.json').$1"; }
module="$(config module)"
repo="$(config repoPrefix)${module}"

fail() { echo "start-module: $*" >&2; exit 1; }

command -v gh >/dev/null || fail "install the GitHub CLI first: https://cli.github.com"
gh auth status >/dev/null 2>&1 || fail "log in to GitHub first: gh auth login"
if git remote get-url course >/dev/null 2>&1; then
  fail "this clone is already set up (it has a \"course\" remote)."
fi

owner="$(gh api user --jq .login)"

git branch -M main
git remote rename origin course
gh repo create "$repo" --public --source . --remote origin --push

echo "Done: https://github.com/${owner}/${repo}"
