// Built-in check: is the student's app live on Vercel? Loads the link the
// student submitted (the roster's vercel_url) and looks for a marker. Only
// that link counts: the check doesn't look up deployments on GitHub or guess
// other URLs, so a student is never credited for a site they didn't submit.
export const DEFAULT_MARKER = "Fictional — for educational use.";

const VERCEL_LOGIN = /^https:\/\/vercel\.com\/login/;

const deployCheck = {
  id: "deploy",
  description: "Vercel deployment",
  criteria: ["DEPLOY"],
  cache: false, // cheap, and a student may deploy without pushing a new commit
  needsWorkspace: false,
  async run(ctx) {
    const marker = ctx.settings.deploy?.marker ?? DEFAULT_MARKER;
    const fail = (detail) => ({
      results: [{ criterion: "DEPLOY", passed: false, detail }],
      errors: [],
    });

    const url = ctx.student.vercel_url;
    if (!url)
      return fail("no Vercel link submitted (roster's vercel_url is empty)");

    let response;
    try {
      response = await ctx.fetch(url, { signal: AbortSignal.timeout(15_000) });
    } catch (error) {
      return fail(`${url} didn't respond: ${error.message}`);
    }
    // Vercel Authentication puts a login in front of deployment and preview
    // URLs; the project's public https://<project>.vercel.app link has none.
    if (VERCEL_LOGIN.test(response.url ?? "")) {
      return fail(
        `${url} needs a Vercel login. Ask the student for their public ` +
          `link (https://<project>.vercel.app) and put it in the roster's vercel_url`,
      );
    }
    if (!response.ok) return fail(`${url} returned HTTP ${response.status}`);
    if (!(await response.text()).includes(marker)) {
      return fail(`${url} is up but doesn't show "${marker}"`);
    }
    return {
      results: [
        { criterion: "DEPLOY", passed: true, detail: `live at ${url}` },
      ],
      errors: [],
    };
  },
};

export default deployCheck;
