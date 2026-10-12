// Built-in check: is the student's app live on Vercel? Finds the production
// deployment that Vercel reports to GitHub, falls back to the roster's
// vercel_url, then loads the page and looks for a marker.
export const DEFAULT_MARKER = "Fictional — for educational use.";

async function fromGitHub(ctx) {
  const repo = `repos/${ctx.owner}/${ctx.repoName}`;
  const deployments = await ctx.gh(`${repo}/deployments?per_page=30`);
  const production = deployments.filter((d) =>
    String(d.environment ?? "")
      .toLowerCase()
      .startsWith("production"),
  );
  for (const deployment of production) {
    const [status] = await ctx.gh(
      `${repo}/deployments/${deployment.id}/statuses?per_page=1`,
    );
    const url = status?.environment_url || status?.target_url;
    if (status?.state === "success" && url) return { url, sha: deployment.sha };
  }
  return null;
}

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

    let found = null;
    let lookupError = "";
    try {
      found = await fromGitHub(ctx);
    } catch (error) {
      lookupError = ` (GitHub lookup failed: ${error.message.slice(0, 120)})`;
    }
    if (!found && ctx.student.vercel_url)
      found = { url: ctx.student.vercel_url, sha: null };
    if (!found) return fail(`no Vercel deployment found${lookupError}`);

    let response;
    try {
      response = await ctx.fetch(found.url, {
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      return fail(`${found.url} didn't respond: ${error.message}`);
    }
    if (!response.ok)
      return fail(`${found.url} returned HTTP ${response.status}`);
    if (!(await response.text()).includes(marker)) {
      return fail(`${found.url} is up but doesn't show "${marker}"`);
    }
    const commit =
      found.sha === null
        ? "URL from roster"
        : found.sha === ctx.sha
          ? "deployed commit matches graded commit"
          : `deployed commit ${found.sha.slice(0, 7)} differs from graded commit`;
    return {
      results: [
        {
          criterion: "DEPLOY",
          passed: true,
          detail: `live at ${found.url} (${commit})`,
        },
      ],
      errors: [],
    };
  },
};

export default deployCheck;
