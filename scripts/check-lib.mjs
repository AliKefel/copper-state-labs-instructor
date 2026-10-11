// Pure helpers for scripts/check.mjs, kept separate so they can be unit tested.
import { readdirSync } from "node:fs";

/** Folders to check: the current module's tests and evals, earlier modules' tests. */
export function checkPaths(module, specDirs = readdirSync("specs")) {
  const number = (dir) => Number(/^module-(\d+)(?:-|$)/.exec(dir)?.[1] ?? NaN);
  const paths = [];
  for (const dir of specDirs.filter((d) => !Number.isNaN(number(d))).sort()) {
    if (number(dir) === module)
      paths.push(`specs/${dir}/tests`, `specs/${dir}/evals`);
    else if (number(dir) < module) paths.push(`specs/${dir}/tests`);
  }
  return paths;
}

/**
 * Groups Vitest JSON results by acceptance-criterion ID (the "AC-x.y" at the
 * start of each test name). A criterion passes only if all its tests pass.
 */
export function criteriaFrom(vitestJson) {
  const criteria = new Map();
  for (const file of vitestJson.testResults ?? []) {
    for (const test of file.assertionResults ?? []) {
      const match = /\b(AC-[\w.]+)\s*[:—-]?\s*(.*)/.exec(test.title);
      if (!match) continue;
      const [, id, description] = match;
      const entry = criteria.get(id) ?? { id, description, passed: true };
      if (test.status !== "passed") entry.passed = false;
      criteria.set(id, entry);
    }
  }
  const byId = (a, b) => a.id.localeCompare(b.id, undefined, { numeric: true });
  return [...criteria.values()].sort(byId);
}

/** Test files that failed before any test ran (for example, a syntax error). */
export function brokenFiles(vitestJson) {
  return (vitestJson.testResults ?? [])
    .filter(
      (f) => f.status === "failed" && (f.assertionResults ?? []).length === 0,
    )
    .map((f) => ({ file: f.name, message: f.message }));
}

export function report(module, criteria, broken = []) {
  const lines = [`Module ${module}: acceptance criteria`, ""];
  for (const c of criteria) {
    lines.push(
      `  ${c.passed ? "✅ PASS" : "❌ FAIL"}  ${c.id}  ${c.description}`,
    );
  }
  const passed = criteria.filter((c) => c.passed).length;
  for (const b of broken) {
    lines.push(
      `  ❌ ERROR  ${b.file} could not run: ${b.message ?? "unknown error"}`,
    );
  }
  lines.push("", `${passed} of ${criteria.length} criteria passed.`);
  return lines.join("\n");
}
