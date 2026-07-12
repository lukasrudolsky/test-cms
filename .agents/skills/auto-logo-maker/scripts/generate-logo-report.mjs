import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const paths = [
  "docs/brand",
  "public/brand",
  "components/brand",
  "app/logo-preview",
  "pages",
];

function walk(rel, out = []) {
  const abs = join(root, rel);
  if (!existsSync(abs)) return out;
  const stat = statSync(abs);
  if (stat.isFile()) {
    out.push({ path: rel.replaceAll("\\", "/"), size: stat.size });
    return out;
  }
  for (const entry of readdirSync(abs)) walk(join(rel, entry), out);
  return out;
}

const files = paths.flatMap((path) => walk(path)).filter((file) =>
  /\.(svg|tsx|ts|md)$/i.test(file.path)
);

const evaluationPath = join(root, "docs/brand/concept-evaluation.md");
const selected = existsSync(evaluationPath)
  ? (readFileSync(evaluationPath, "utf8").match(/selected concept:?\s*(.+)/i)?.[1] ?? "See docs/brand/concept-evaluation.md")
  : "No evaluation file found";

console.log(JSON.stringify({ selected, files }, null, 2));
