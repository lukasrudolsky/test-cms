import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const required = [
  "docs/brand/project-analysis.md",
  "docs/brand/reference-analysis.md",
  "docs/brand/concept-evaluation.md",
  "public/brand/concepts/concept-01.svg",
  "public/brand/concepts/concept-02.svg",
  "public/brand/concepts/concept-03.svg",
  "public/brand/logo.svg",
  "public/brand/logo-mark.svg",
  "public/brand/logo-horizontal.svg",
  "public/brand/logo-monochrome.svg",
  "public/brand/logo-light.svg",
  "public/brand/logo-dark.svg",
  "public/brand/favicon.svg",
  "components/brand/Logo.tsx",
  "components/brand/LogoMark.tsx",
];

const previewCandidates = [
  "app/logo-preview/page.tsx",
  "pages/logo-preview.tsx",
  "src/app/logo-preview/page.tsx",
  "src/pages/logo-preview.tsx",
];

const navCandidates = [
  "components/hero/Navbar.tsx",
  "components/Navbar.tsx",
  "components/nav/Navbar.tsx",
  "app/layout.tsx",
  "src/components/Navbar.tsx",
];

const faviconCandidates = [
  "app/layout.tsx",
  "app/manifest.ts",
  "public/manifest.json",
  "src/app/layout.tsx",
];

const errors = [];
const warnings = [];
const missing = new Set();

function read(rel) {
  return readFileSync(join(root, rel), "utf8");
}

function requireFile(rel) {
  if (!existsSync(join(root, rel))) {
    missing.add(rel);
    return false;
  }
  return true;
}

function validateSvg(rel) {
  if (!requireFile(rel)) return;
  const text = read(rel);
  const size = statSync(join(root, rel)).size;
  if (!/<svg[\s>]/i.test(text)) errors.push(`${rel}: missing <svg> root`);
  if (!/viewBox=/i.test(text)) errors.push(`${rel}: missing viewBox`);
  if (/<script[\s>]/i.test(text)) errors.push(`${rel}: contains <script>`);
  if (/<image[\s>]/i.test(text)) errors.push(`${rel}: contains <image>`);
  if (/base64/i.test(text)) errors.push(`${rel}: contains base64`);
  if (/<path\b[^>]*\bd=(["'])\s*\1/i.test(text)) errors.push(`${rel}: contains empty path`);
  if (size > 25000) warnings.push(`${rel}: file is larger than 25 KB`);
}

for (const rel of required.filter((file) => file.endsWith(".svg"))) validateSvg(rel);
for (const rel of required.filter((file) => !file.endsWith(".svg"))) requireFile(rel);
for (const rel of missing) errors.push(`Missing required file: ${rel}`);

if (!previewCandidates.some((rel) => existsSync(join(root, rel)))) {
  errors.push(`Missing logo preview page. Expected one of: ${previewCandidates.join(", ")}`);
}

const navUsesLogo = navCandidates
  .filter((rel) => existsSync(join(root, rel)))
  .some((rel) => /Logo|logo-mark|logo-horizontal|brand\/logo/i.test(read(rel)));
if (!navUsesLogo) errors.push("Winning logo does not appear to be used in navigation/layout candidates.");

const faviconUsesLogo = faviconCandidates
  .filter((rel) => existsSync(join(root, rel)))
  .some((rel) => /favicon\.svg|brand\/favicon|logo-mark|icon/i.test(read(rel)));
if (!faviconUsesLogo) errors.push("Favicon/logo usage was not found in metadata or manifest candidates.");

if (errors.length) {
  console.error(["Logo validation failed:", ...errors.map((e) => `- ${e}`)].join("\n"));
  if (warnings.length) console.warn(["Warnings:", ...warnings.map((w) => `- ${w}`)].join("\n"));
  process.exit(1);
}

console.log("Logo validation passed.");
if (warnings.length) console.warn(["Warnings:", ...warnings.map((w) => `- ${w}`)].join("\n"));
