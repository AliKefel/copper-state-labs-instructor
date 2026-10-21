// @vitest-environment node
// npm run grade:docker, with a fake `docker` that records its arguments.
// Set GRADER_DOCKER_TEST=1 (with Docker running) to also build the real image
// and run the grader's end-to-end and isolation tests inside it.
import { spawnSync } from "node:child_process";
import {
  chmodSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { tempDir } from "../helpers/temp-dir";
import {
  CONTAINER_FLAGS,
  IMAGE,
  IMAGE_LABEL,
} from "../../scripts/grade/docker.mjs";

const SECRET = "github_pat_do-not-print";

function setup({ dockerRunning = true } = {}) {
  const tmp = tempDir("grade-docker-");
  const bin = join(tmp, "bin");
  const log = join(tmp, "docker.log");
  mkdirSync(bin);
  writeFileSync(
    join(bin, "docker"),
    `#!/usr/bin/env node
require("fs").appendFileSync(${JSON.stringify(log)}, JSON.stringify(process.argv.slice(2)) + "\\n");
if (process.argv[2] === "create") console.log("fake-container");
process.exit(process.argv[2] === "info" && ${!dockerRunning} ? 1 : 0);
`,
  );
  chmodSync(join(bin, "docker"), 0o755);
  writeFileSync(join(tmp, "roster.csv"), "name,github,vercel_url\nAna,ana,\n");
  mkdirSync(join(tmp, "hidden"));

  const run = (args: string[], env: Record<string, string> = {}) => {
    const result = spawnSync(
      process.execPath,
      ["scripts/grade/docker.mjs", ...args],
      {
        encoding: "utf8",
        env: {
          NODE_ENV: "test",
          PATH: `${bin}:${process.env.PATH}`,
          HOME: tmp,
          GH_TOKEN: SECRET,
          ...env,
        },
      },
    );
    const calls: string[][] = existsSync(log)
      ? readFileSync(log, "utf8")
          .trim()
          .split("\n")
          .map((line) => JSON.parse(line))
      : [];
    return {
      ...result,
      calls,
      runCall: calls.find((c) => c[0] === "create"),
    };
  };
  const base = ["--roster", join(tmp, "roster.csv"), "--out", join(tmp, "out")];
  return { tmp, run, base };
}

// The fake `docker` is a script with a #! line, which Windows can't run. The
// launcher builds the same arguments on every system.
describe.skipIf(process.platform === "win32")("npm run grade:docker", () => {
  it("runs the grader in a locked-down container with only the token and copies of the roster and results", () => {
    const { tmp, run, base } = setup();
    mkdirSync(join(tmp, "out", "cache"), { recursive: true });
    writeFileSync(join(tmp, "out", "old-grades.csv"), "old");
    const result = run([
      ...base,
      "--module",
      "0",
      "--deadline",
      "2026-10-20T23:59-07:00",
      "--hidden",
      join(tmp, "hidden"),
    ]);
    expect(result.status, result.stderr).toBe(0);
    expect(result.calls.find((c) => c[0] === "build")).toEqual(
      expect.arrayContaining(["-f", "Dockerfile.grader", "-t", IMAGE]),
    );
    // Old grading images are removed after the build, and only those.
    const commands = result.calls.map((c) => c.slice(0, 2).join(" "));
    expect(commands).toEqual([
      "info",
      "build --quiet",
      "image prune",
      "create --init",
      `cp ${join(tmp, "roster.csv")}`,
      `cp ${join(tmp, "hidden")}`,
      `cp ${join(tmp, "out", "cache")}`,
      "start --attach",
      "cp fake-container:/results/.",
      "rm --force",
    ]);
    // Copied in, never mounted: on a Mac, every user in the container can read
    // a mounted folder, student code included.
    expect(result.calls.slice(4, 7).map((c) => c[2])).toEqual([
      "fake-container:/input/roster.csv",
      "fake-container:/input/hidden",
      "fake-container:/results/cache",
    ]);
    expect(result.calls.at(-2)).toEqual([
      "cp",
      "fake-container:/results/.",
      join(tmp, "out"),
    ]);
    expect(result.calls.at(-1)).toEqual(["rm", "--force", "fake-container"]);
    // The old results are replaced by the new ones.
    expect(existsSync(join(tmp, "out", "old-grades.csv"))).toBe(false);
    expect(result.calls[2]).toEqual([
      "image",
      "prune",
      "--force",
      "--filter",
      `label=${IMAGE_LABEL}`,
    ]);

    const args = result.runCall!;
    expect(args).toEqual(expect.arrayContaining(CONTAINER_FLAGS));
    expect(args).not.toContain("-v");
    expect(args).toEqual(
      expect.arrayContaining([
        "--roster",
        "/input/roster.csv",
        "--hidden",
        "/input/hidden",
        "--out",
        "/results",
        "--deadline",
        "2026-10-20T23:59-07:00",
      ]),
    );
    // Passed by name only: the token's value never appears in arguments.
    expect(args[args.indexOf("GH_TOKEN") - 1]).toBe("-e");
    expect(JSON.stringify(result.calls)).not.toContain(SECRET);
    expect(args).not.toContain("GRADING_AI_GATEWAY_API_KEY");
    expect(existsSync(join(tmp, "out"))).toBe(true);
  });

  it("labels the image the way the cleanup step looks for it", () => {
    expect(readFileSync("Dockerfile.grader", "utf8")).toMatch(
      new RegExp(`^LABEL ${IMAGE_LABEL}$`, "m"),
    );
  });

  it("passes the grading AI key only with --evals", () => {
    const { run, base } = setup();
    const result = run([...base, "--evals"], {
      GRADING_AI_GATEWAY_API_KEY: "grading-key-value",
    });
    expect(result.status, result.stderr).toBe(0);
    const args = result.runCall!;
    expect(args[args.indexOf("GRADING_AI_GATEWAY_API_KEY") - 1]).toBe("-e");
    expect(args).toContain("--evals");
    expect(JSON.stringify(result.calls)).not.toContain("grading-key-value");
  });

  it.each([
    [
      "GH_TOKEN is missing",
      {},
      { GH_TOKEN: "" },
      /set GH_TOKEN to a read-only GitHub token/,
    ],
    [
      "Docker isn't running",
      { dockerRunning: false },
      {},
      /Docker isn't running/,
    ],
    [
      "--evals has no grading key",
      {},
      { EVALS: "1" },
      /--evals needs GRADING_AI_GATEWAY_API_KEY/,
    ],
  ])("stops with a clear message when %s", (_, options, env, message) => {
    const { run, base } = setup(options);
    const { EVALS, ...rest } = env as Record<string, string>;
    const result = run(EVALS ? [...base, "--evals"] : base, rest);
    expect(result.status).toBe(1);
    expect(result.stderr).toMatch(message);
    expect(result.runCall).toBeUndefined();
  });
});

describe.runIf(process.env.GRADER_DOCKER_TEST === "1")(
  "the real grading container",
  () => {
    it("grades correctly and keeps student code away from the grader", () => {
      const build = spawnSync(
        "docker",
        ["build", "--quiet", "-f", "Dockerfile.grader", "-t", IMAGE, "."],
        { encoding: "utf8" },
      );
      expect(build.status, build.stderr).toBe(0);
      const run = spawnSync(
        "docker",
        [
          "run",
          "--rm",
          ...CONTAINER_FLAGS,
          IMAGE,
          "npx",
          "vitest",
          "run",
          "tests/grade/grade.e2e.test.ts",
          "tests/grade/isolation.test.ts",
        ],
        { encoding: "utf8" },
      );
      // Without Vitest's colors, so the summary line can be matched.
      const output = (run.stdout + run.stderr).replace(/\u001b\[[0-9;]*m/g, "");
      expect(run.status, output).toBe(0);
      expect(output).toMatch(/Test Files {2}2 passed/);
    }, 900_000);
  },
);
