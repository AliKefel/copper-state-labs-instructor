// @vitest-environment node
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { tempDir } from "./helpers/temp-dir";

const script = join(process.cwd(), "scripts/start-module.sh");

// A throwaway clone of a "module-3" branch, plus a fake `gh` that records its
// arguments instead of talking to GitHub.
function setup() {
  const root = tempDir("start-module-");
  const course = join(root, "course.git");
  const clone = join(root, "clone");
  const bin = join(root, "bin");
  const log = join(root, "gh.log");
  const git = (cwd: string, ...args: string[]) =>
    execFileSync("git", args, { cwd, stdio: "pipe" });

  git(root, "init", "--bare", "-q", course);
  mkdirSync(clone);
  git(clone, "init", "-q", "-b", "module-3");
  git(clone, "remote", "add", "origin", course);
  writeFileSync(
    join(clone, "course.config.json"),
    JSON.stringify({ module: 3, repoPrefix: "copper-m" }),
  );
  mkdirSync(join(clone, "scripts"));
  copyFileSync(script, join(clone, "scripts/start-module.sh"));
  git(clone, "add", ".");
  git(
    clone,
    "-c",
    "user.name=t",
    "-c",
    "user.email=t@example.com",
    "commit",
    "-qm",
    "start",
  );

  mkdirSync(bin);
  writeFileSync(
    join(bin, "gh"),
    `#!/bin/sh\necho "gh $*" >> "${log}"\n[ "$1 $2" = "api user" ] && echo student-1\nexit 0\n`,
  );
  chmodSync(join(bin, "gh"), 0o755);

  const run = () =>
    spawnSync("bash", ["scripts/start-module.sh"], {
      cwd: clone,
      env: { ...process.env, PATH: `${bin}:${process.env.PATH}` },
      encoding: "utf8",
    });
  const gitOut = (...args: string[]) =>
    git(clone, ...args)
      .toString()
      .trim();
  return { run, gitOut, ghLog: () => readFileSync(log, "utf8") };
}

describe("npm run start-module", () => {
  it("makes main, keeps the course remote, and creates the public repo", () => {
    const { run, gitOut, ghLog } = setup();
    const result = run();
    expect(result.status, result.stderr).toBe(0);
    expect(gitOut("branch", "--show-current")).toBe("main");
    expect(gitOut("remote")).toBe("course");
    expect(ghLog()).toContain(
      "gh repo create copper-m3 --public --source . --remote origin --push",
    );
    expect(ghLog()).not.toContain("collaborators");
  });

  it("refuses to run twice", () => {
    const { run } = setup();
    run();
    const second = run();
    expect(second.status).toBe(1);
    expect(second.stderr).toContain("already set up");
  });
});
