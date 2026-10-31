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

// A `gh api` that fails the test if the check asks GitHub for anything.
const noGitHub = async (path: string) => {
  throw new Error(`unexpected GitHub call: ${path}`);
};

const ctx = (overrides: object) => ({
  student: { github: "ana", vercel_url: "" },
  owner: "ana",
  repoName: "copper-m0",
  sha: "abc1234def",
  settings: {},
  fetch: globalThis.fetch,
  gh: noGitHub,
  ...overrides,
});

const run = async (overrides: object) =>
  (await deploy.run(ctx(overrides) as never)).results[0];

describe("deploy check", () => {
  it("passes the submitted link when it shows the marker", async () => {
    const result = await run({
      student: { github: "ana", vercel_url: `${base}/live` },
    });
    expect(result).toMatchObject({ criterion: "DEPLOY", passed: true });
    expect(result.detail).toBe(`live at ${base}/live`);
  });

  it("fails without a submitted link, without asking GitHub", async () => {
    const result = await run({});
    expect(result).toMatchObject({
      passed: false,
      detail: "no Vercel link submitted (roster's vercel_url is empty)",
    });
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
    expect(
      (
        await run({
          student: { github: "a", vercel_url: `${base}/live` },
          fetch: async () => {
            throw new Error("ECONNREFUSED");
          },
        })
      ).detail,
    ).toContain("didn't respond");
  });

  it("uses the module's marker setting", async () => {
    const result = await run({
      student: { github: "a", vercel_url: `${base}/other` },
      settings: { deploy: { marker: "Some other site" } },
    });
    expect(result.passed).toBe(true);
  });

  it("fails a link behind the Vercel login instead of guessing another URL", async () => {
    const link = "https://copper-m0-12j5-m6oj94gwm-team-projects.vercel.app";
    const tried: string[] = [];
    const result = await run({
      student: { github: "ana", vercel_url: link },
      // Every URL ends at the Vercel login, like Vercel Authentication.
      fetch: async (url: string) => {
        tried.push(url);
        return Object.defineProperty(
          new Response("<h1>Log in to Vercel</h1>"),
          "url",
          { value: `https://vercel.com/login?next=${encodeURIComponent(url)}` },
        );
      },
    });
    expect(result.passed).toBe(false);
    expect(result.detail).toContain(`${link} needs a Vercel login`);
    expect(tried).toEqual([link]);
  });
});
