// @vitest-environment node
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import deploy, { DEFAULT_MARKER } from "../../scripts/grade/checks/deploy.mjs";

let server: Server;
let base = "";

beforeAll(async () => {
  server = createServer((req, res) => {
    if (req.url === "/live")
      return res.end(`<footer>${DEFAULT_MARKER}</footer>`);
    if (req.url === "/other") return res.end("<p>Some other site</p>");
    res.statusCode = 404;
    res.end("not found");
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
afterAll(() => new Promise<void>((resolve) => server.close(() => resolve())));

// A fake `gh api` answering with the given deployments and their statuses.
function fakeGitHub(
  deployments: {
    id: number;
    sha: string;
    environment: string;
    url: string;
    state?: string;
  }[],
) {
  return async (path: string) => {
    const status = /deployments\/(\d+)\/statuses/.exec(path);
    if (status) {
      const d = deployments.find((x) => x.id === Number(status[1]))!;
      return [{ state: d.state ?? "success", environment_url: d.url }];
    }
    return deployments.map(({ id, sha, environment }) => ({
      id,
      sha,
      environment,
    }));
  };
}

const ctx = (overrides: object) => ({
  student: { github: "ana", vercel_url: "" },
  owner: "ana",
  repoName: "copper-m0",
  sha: "abc1234def",
  settings: {},
  fetch: globalThis.fetch,
  gh: fakeGitHub([]),
  ...overrides,
});

const run = async (overrides: object) =>
  (await deploy.run(ctx(overrides) as never)).results[0];

describe("deploy check", () => {
  it("passes a live production deployment of the graded commit", async () => {
    const result = await run({
      gh: fakeGitHub([
        {
          id: 2,
          sha: "zzz",
          environment: "Preview – copper-m0",
          url: `${base}/other`,
        },
        {
          id: 1,
          sha: "abc1234def",
          environment: "Production – copper-m0",
          url: `${base}/live`,
        },
      ]),
    });
    expect(result).toMatchObject({ criterion: "DEPLOY", passed: true });
    expect(result.detail).toContain("matches graded commit");
  });

  it("passes but notes when the deployed commit differs", async () => {
    const result = await run({
      gh: fakeGitHub([
        {
          id: 1,
          sha: "9999999aaa",
          environment: "Production",
          url: `${base}/live`,
        },
      ]),
    });
    expect(result.passed).toBe(true);
    expect(result.detail).toContain("differs from graded commit");
  });

  it("skips failed deployments", async () => {
    const result = await run({
      gh: fakeGitHub([
        {
          id: 1,
          sha: "abc",
          environment: "Production",
          url: `${base}/live`,
          state: "failure",
        },
      ]),
    });
    expect(result).toMatchObject({
      passed: false,
      detail: "no Vercel deployment found",
    });
  });

  it("falls back to the roster's vercel_url", async () => {
    const result = await run({
      student: { github: "ana", vercel_url: `${base}/live` },
    });
    expect(result.passed).toBe(true);
    expect(result.detail).toContain("URL from roster");
  });

  it("fails when the page doesn't show the marker or is down", async () => {
    expect(
      (await run({ student: { github: "a", vercel_url: `${base}/other` } }))
        .detail,
    ).toContain("doesn't show");
    expect(
      (await run({ student: { github: "a", vercel_url: `${base}/missing` } }))
        .detail,
    ).toContain("HTTP 404");
  });

  it("uses the module's marker setting", async () => {
    const result = await run({
      student: { github: "a", vercel_url: `${base}/other` },
      settings: { deploy: { marker: "Some other site" } },
    });
    expect(result.passed).toBe(true);
  });

  it("reports GitHub lookup errors without crashing", async () => {
    const result = await run({
      gh: async () => {
        throw new Error("HTTP 404");
      },
    });
    expect(result.passed).toBe(false);
    expect(result.detail).toContain("GitHub lookup failed");
  });
});
