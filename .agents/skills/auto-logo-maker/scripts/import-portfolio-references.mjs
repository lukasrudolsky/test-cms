import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import vm from "node:vm";

const args = parseArgs(process.argv.slice(2));
const sourceUrl = args.url ?? "https://galshir.com/";
const collection = args.collection ?? "gal-shir-inspired";
const limit = Number(args.limit ?? 50);
const root = process.cwd();
const rawDir = join(root, "logo-style-training/raw/gal-shir");
const contactDir = join(root, "logo-style-training/processed/contact-sheets");
const libraryDir = join(root, "logo-style-training/libraries", collection);
const manifestPath = join(rawDir, "manifest.json");
const excludePath = join(rawDir, "exclude.txt");
const sourcePath = join(rawDir, "SOURCE.md");
const historyPath = join(rawDir, "history.jsonl");
const contactPath = join(contactDir, "gal-shir.html");

const startedAt = new Date().toISOString();
const stats = {
  candidates: 0,
  downloaded: 0,
  reused: 0,
  exactDuplicates: 0,
  nearDuplicates: 0,
  rejected: 0,
  rejectedReasons: {},
  technicalLimitations: [],
};

mkdirSync(rawDir, { recursive: true });
mkdirSync(contactDir, { recursive: true });
mkdirSync(libraryDir, { recursive: true });
if (!existsSync(excludePath)) writeFileSync(excludePath, "", "utf8");

const previousManifest = readJson(manifestPath, { items: [] });
const previousItems = Array.isArray(previousManifest.items) ? previousManifest.items : [];
const previousByUrl = new Map(previousItems.map((item) => [item.sourceUrl, item]));
const previousByHash = new Map(previousItems.map((item) => [item.sha256, item]));
const excluded = new Set(readFileSafe(excludePath).split(/\r?\n/).map((line) => line.trim()).filter(Boolean));

const robots = await fetchText(new URL("/robots.txt", sourceUrl).href);
const terms = await fetchText(new URL("/terms", sourceUrl).href).catch((error) => {
  stats.technicalLimitations.push(`Terms page unavailable: ${error.message}`);
  return "";
});
const html = await fetchText(sourceUrl);
const projects = extractProjects(html);
const candidates = buildCandidates(projects).slice(0, Math.max(limit * 3, limit));
stats.candidates = candidates.length;

const accepted = [];
const seenHashes = new Set();
const seenNearKeys = new Set();
for (const item of previousItems) {
  seenHashes.add(item.sha256);
  if (item.nearDuplicateKey) seenNearKeys.add(item.nearDuplicateKey);
}

for (const candidate of candidates) {
  if (accepted.length >= limit) break;
  await sleep(140);

  if (!isAllowedUrl(candidate.url)) {
    reject("outside-allowed-domain");
    continue;
  }

  const prior = previousByUrl.get(candidate.url);
  if (prior && existsSync(join(rawDir, prior.localName)) && !excluded.has(prior.localName)) {
    accepted.push(prior);
    stats.reused++;
    continue;
  }

  let response;
  try {
    response = await fetch(candidate.url, { headers: { "user-agent": "Codex auto-logo-maker reference importer" } });
  } catch {
    reject("download-error");
    continue;
  }
  if (!response.ok) {
    reject(`http-${response.status}`);
    continue;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const mime = normalizeMime(response.headers.get("content-type"), buffer);
  const ext = chooseExt(candidate.url, mime);
  const dimensions = getDimensions(buffer, mime);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const nearDuplicateKey = `${candidate.project}:${candidate.kind}:${dimensions.width}x${dimensions.height}:${mime}`;

  if (!isAcceptable(candidate, mime, dimensions, buffer.length)) {
    reject("quality-or-relevance-filter");
    continue;
  }
  if (seenHashes.has(sha256) || previousByHash.has(sha256)) {
    stats.exactDuplicates++;
    continue;
  }
  if (seenNearKeys.has(nearDuplicateKey)) {
    stats.nearDuplicates++;
    continue;
  }

  const localName = nextName([...previousItems, ...accepted], ext);
  writeFileSync(join(rawDir, localName), buffer);
  const entry = {
    localName,
    sourceUrl: candidate.url,
    sourcePageUrl: `${sourceUrl.replace(/\/$/, "")}/#${candidate.project}`,
    originalFilename: basename(new URL(candidate.url).pathname),
    altText: candidate.altText,
    projectTitle: candidate.projectTitle,
    dimensions,
    mimeType: mime,
    fileSize: buffer.length,
    sha256,
    downloadedAt: startedAt,
    inclusionReason: candidate.reason,
    classification: candidate.classification,
    sourceNote: "Copyright Gal Shir / respective brand owner. Internal visual reference only; do not redistribute or use as final output.",
    project: candidate.project,
    kind: candidate.kind,
    nearDuplicateKey,
  };
  accepted.push(entry);
  seenHashes.add(sha256);
  seenNearKeys.add(nearDuplicateKey);
  stats.downloaded++;
}

const activeItems = mergeItems(previousItems, accepted)
  .filter((item) => existsSync(join(rawDir, item.localName)))
  .filter((item) => !excluded.has(item.localName))
  .slice(0, limit);

const manifest = {
  source: sourceUrl,
  collection,
  importedAt: startedAt,
  robots: summarizeRobots(robots),
  terms: summarizeTerms(terms),
  stats,
  items: activeItems,
};
writeJsonAtomic(manifestPath, manifest);
writeFileSync(historyPath, `${JSON.stringify({ importedAt: startedAt, stats })}\n`, { encoding: "utf8", flag: "a" });
writeSourceFile({ robots, terms, count: activeItems.length });
writeContactSheet(activeItems);
writeStyleLibrary({ items: activeItems, projects, collection });

console.log(JSON.stringify({
  candidates: stats.candidates,
  downloaded: stats.downloaded,
  reused: stats.reused,
  exactDuplicates: stats.exactDuplicates,
  nearDuplicates: stats.nearDuplicates,
  rejected: stats.rejected,
  accepted: activeItems.length,
  contactSheet: relative(contactPath),
  styleLibrary: relative(libraryDir),
  validation: "import completed",
  technicalLimitations: stats.technicalLimitations,
}, null, 2));

function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) parsed[argv[i].slice(2)] = argv[i + 1];
  }
  return parsed;
}

function extractProjects(pageHtml) {
  const match = pageHtml.match(/projectsData\s*=\s*({[\s\S]*?})\s*\n\s*\n\s*news\s*=/);
  if (!match) throw new Error("Could not locate projectsData in source page.");
  const sandbox = {};
  vm.createContext(sandbox);
  vm.runInContext(`projectsData = ${match[1]};`, sandbox, { timeout: 1000 });
  return sandbox.projectsData;
}

function buildCandidates(projects) {
  const out = [];
  for (const [slug, data] of Object.entries(projects)) {
    const projectTitle = data.brand ?? slug;
    const base = `https://galshirart.github.io/website/work/${slug}`;
    push(`${base}-preview.svg`, "preview", "combination-mark", "project preview mark", "Preview logo presentation");
    push(`${base}-avatar-1.svg`, "avatar", "logomark", "standalone avatar/logomark", "Standalone mark/avatar");
    for (let i = 1; i <= Number(data.structure ?? 0); i++) {
      push(`${base}-structure-${i}.svg`, "construction", "construction", "logo construction/geometric structure", `Construction ${i}`);
    }
    for (let i = 1; i <= Number(data.assets ?? 0); i++) {
      push(`${base}-asset-${i}.webp`, "asset", "brand-presentation", "logo-focused brand presentation", `Brand presentation ${i}`);
    }
    for (let i = 2; i <= Math.min(Number(data.avatars ?? 0), 3); i++) {
      push(`${base}-avatar-${i}.svg`, "avatar", "logomark", "additional standalone mark/avatar", `Avatar ${i}`);
    }

    function push(url, kind, classification, reason, alt) {
      out.push({
        url,
        project: slug,
        projectTitle,
        kind,
        classification,
        reason,
        altText: `${projectTitle} ${alt}`,
        description: data["logo-description"] ?? "",
        color: data.color,
      });
    }
  }
  return out;
}

function isAllowedUrl(url) {
  const host = new URL(url).hostname;
  return host === "galshir.com" || host === "galshirart.github.io";
}

function isAcceptable(candidate, mime, dimensions, size) {
  if (!["image/svg+xml", "image/webp", "image/png", "image/jpeg"].includes(mime)) return false;
  if (size < 300 && mime !== "image/svg+xml") return false;
  if (candidate.kind === "preview" || candidate.kind === "avatar" || candidate.kind === "construction") return true;
  if (!dimensions.width || !dimensions.height) return true;
  return dimensions.width >= 300 && dimensions.height >= 300;
}

function normalizeMime(header, buffer) {
  const clean = (header ?? "").split(";")[0].trim().toLowerCase();
  if (clean) return clean;
  if (buffer.slice(0, 4).toString("hex") === "89504e47") return "image/png";
  if (buffer.slice(0, 3).toString("hex") === "ffd8ff") return "image/jpeg";
  if (buffer.slice(0, 4).toString() === "RIFF" && buffer.slice(8, 12).toString() === "WEBP") return "image/webp";
  if (buffer.toString("utf8", 0, 120).includes("<svg")) return "image/svg+xml";
  return "application/octet-stream";
}

function chooseExt(url, mime) {
  const existing = extname(new URL(url).pathname).toLowerCase();
  if (existing) return existing;
  return ({ "image/svg+xml": ".svg", "image/webp": ".webp", "image/png": ".png", "image/jpeg": ".jpg" }[mime] ?? ".bin");
}

function getDimensions(buffer, mime) {
  if (mime === "image/svg+xml") {
    const text = buffer.toString("utf8");
    const viewBox = text.match(/viewBox=["']\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)\s+([\d.]+)\s*["']/i);
    if (viewBox) return { width: Math.round(Number(viewBox[1])), height: Math.round(Number(viewBox[2])) };
    const width = text.match(/\bwidth=["']([\d.]+)/i)?.[1];
    const height = text.match(/\bheight=["']([\d.]+)/i)?.[1];
    return { width: Number(width) || null, height: Number(height) || null };
  }
  if (mime === "image/png" && buffer.slice(0, 8).toString("hex") === "89504e470d0a1a0a") {
    return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  }
  if (mime === "image/webp") return getWebpDimensions(buffer);
  if (mime === "image/jpeg") return getJpegDimensions(buffer);
  return { width: null, height: null };
}

function getWebpDimensions(buffer) {
  const type = buffer.slice(12, 16).toString();
  if (type === "VP8X") {
    return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  if (type === "VP8 ") {
    return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
  }
  if (type === "VP8L") {
    const bits = buffer.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return { width: null, height: null };
}

function getJpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) break;
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if (marker >= 0xc0 && marker <= 0xc3) {
      return { width: buffer.readUInt16BE(offset + 7), height: buffer.readUInt16BE(offset + 5) };
    }
    offset += 2 + length;
  }
  return { width: null, height: null };
}

function nextName(items, ext) {
  const usedNumbers = new Set(items
    .map((item) => item.localName?.match(/^gal-shir-(\d{3})\./)?.[1])
    .filter(Boolean));
  for (let i = 1; i < 1000; i++) {
    const number = String(i).padStart(3, "0");
    if (usedNumbers.has(number)) continue;
    const name = `gal-shir-${String(i).padStart(3, "0")}${ext}`;
    return name;
  }
  throw new Error("Could not allocate filename.");
}

function mergeItems(previous, current) {
  const byUrl = new Map();
  for (const item of previous) byUrl.set(item.sourceUrl, item);
  for (const item of current) byUrl.set(item.sourceUrl, item);
  return [...byUrl.values()].sort((a, b) => a.localName.localeCompare(b.localName));
}

function writeSourceFile({ robots, terms, count }) {
  writeFileSync(sourcePath, `# Gal Shir Reference Source

Source portfolio: ${sourceUrl}
Import date: ${startedAt}
Accepted references: ${count}

These images are works by Gal Shir and/or the respective featured brands. They are stored only as internal visual references for style analysis inside this local project.

Do not redistribute these files, publish them as a dataset, use them as final logo outputs, or copy any specific symbol, monogram, composition, silhouette, detail, or exact colorway.

Terms note: the Gal Shir terms page states the website materials are protected by copyright/trademark law and grants only temporary viewing/download permissions with restrictions. Treat this collection as local, non-public reference material.

Robots note:
\`\`\`
${robots.trim().slice(0, 1800)}
\`\`\`

Terms excerpt note:
\`\`\`
${terms.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").slice(0, 1200)}
\`\`\`
`, "utf8");
}

function writeContactSheet(items) {
  const cards = items.map((item, index) => `<article class="card">
  <div class="thumb"><img src="../../raw/gal-shir/${escapeHtml(item.localName)}" alt="${escapeHtml(item.altText)}"></div>
  <h2>${String(index + 1).padStart(2, "0")} · ${escapeHtml(item.projectTitle)}</h2>
  <p><b>${escapeHtml(item.classification)}</b> · ${item.dimensions.width ?? "?"}×${item.dimensions.height ?? "?"}</p>
  <p><a href="${escapeHtml(item.sourcePageUrl)}">${escapeHtml(item.sourcePageUrl)}</a></p>
  <p>Exclude by adding <code>${escapeHtml(item.localName)}</code> to <code>logo-style-training/raw/gal-shir/exclude.txt</code>.</p>
</article>`).join("\n");
  writeFileSync(contactPath, `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<title>Gal Shir Logo Reference Contact Sheet</title>
<style>
body{font-family:Inter,Arial,sans-serif;margin:32px;background:#f6f6f7;color:#18181b}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:18px}
.card{background:white;border:1px solid #e4e4e7;border-radius:10px;padding:12px}
.thumb{height:180px;display:grid;place-items:center;background:#fafafa;border-radius:8px;overflow:hidden}
img{max-width:100%;max-height:100%;object-fit:contain}
h1{font-size:24px}h2{font-size:14px}p{font-size:12px;line-height:1.45;color:#52525b}code{font-size:11px}
</style>
<h1>Gal Shir Logo Reference Contact Sheet</h1>
<p>${items.length} accepted references. Files listed in <code>exclude.txt</code> are ignored by the skill.</p>
<main class="grid">${cards}</main>
</html>`, "utf8");
}

function writeStyleLibrary({ items, projects, collection }) {
  const representatives = chooseRepresentatives(items);
  const projectDescriptions = representatives.map((item) => projects[item.project]?.["logo-description"]).filter(Boolean);
  const profile = {
    collection_id: collection,
    collection_name: "Gal Shir - geometric brand inspiration",
    generated_at: startedAt,
    source: sourceUrl,
    item_count: items.length,
    representative_count: representatives.length,
    principles: {
      shape_simplification: "Reduce ideas to a small number of bold geometric primitives, often one to five memorable masses.",
      negative_space: "Use negative space as meaning-bearing structure, not decoration.",
      geometry: "Prefer circles, squares, arcs, stripes, folded polygons, and modular strokes with precise optical balance.",
      radius: "Mix soft rounded forms with sharper purposeful cuts when the brand needs contrast.",
      monogram: "Use letters only when the letter construction becomes a distinctive symbol.",
      color: "Keep brand color systems restrained; the mark must survive in one color.",
      small_size: "Favor silhouettes that remain recognizable at 16-24 px.",
    },
    anti_copy: [
      "Do not reuse a specific Gal Shir silhouette or monogram linkage.",
      "Do not copy a featured brand colorway or exact composition.",
      "Reject future concepts that look like one specific reference.",
    ],
    representative_files: representatives.map((item) => item.localName),
  };
  writeJsonAtomic(join(libraryDir, "style-profile.json"), profile);
  writeJsonAtomic(join(libraryDir, "representative-index.json"), representatives.map((item) => ({
    localName: item.localName,
    classification: item.classification,
    projectTitle: item.projectTitle,
    sourceUrl: item.sourceUrl,
    reason: item.inclusionReason,
  })));
  writeFileSync(join(libraryDir, "style-profile.md"), `# Gal Shir - Geometric Brand Inspiration

Collection ID: \`${collection}\`
Generated: ${startedAt}
Accepted references: ${items.length}
Representatives: ${representatives.length}

## Style DNA

- Distill product meaning into simple geometric primitives.
- Build symbols from strong silhouettes, negative space, and optical balance.
- Prefer memorable standalone marks over decorative detail.
- Use monograms only when letterforms become custom geometry.
- Keep color secondary; one-color performance is mandatory.
- Balance confidence and approachability through controlled radius and proportion.

## Source Descriptions Used

${projectDescriptions.slice(0, 12).map((text) => `- ${text}`).join("\n")}
`, "utf8");
  writeFileSync(join(libraryDir, "generation-rules.md"), `# Generation Rules

- Start with the brand meaning, then reduce it to one strong geometric idea.
- Use no more than five primary shapes unless the concept demands a structured repeating system.
- Design the mark in one color first.
- Test at 16 px and 24 px before adding horizontal or color variants.
- Prefer optical balance over literal symmetry when needed.
- Make every cut, gap, radius, or overlap explainable.
`, "utf8");
  writeFileSync(join(libraryDir, "avoid-patterns.md"), `# Avoid Patterns

- Do not copy any specific Gal Shir or featured-brand mark.
- Avoid direct replicas of star, swan, diamond, coin-face, slingshot, colon, overlapping OR, or connected double-X compositions found in the source set.
- Avoid decorative gradients, mascot detail, generic app icons, and library-icon shapes.
- Avoid exact source color pairings.
- Reject any concept that is clearly closest to one individual reference instead of the collection-level principles.
`, "utf8");
  writeFileSync(join(libraryDir, "design-system.md"), `# Design System Notes

- Geometry: circles, squares, arcs, folded polygons, modular stripes, and continuous strokes.
- Stroke/mass: bold enough for favicon use; avoid hairlines.
- Corners: use consistent radii; mix sharpness and softness only for a reason.
- Color: one primary brand color plus neutral variants; monochrome must work.
- Wordmark relationship: pair symbols with clean custom or near-geometric typography, but do not depend on wordmark for recognition.
`, "utf8");
  writeFileSync(join(libraryDir, "training-report.md"), `# Training Report

This is a style-analysis library, not model training data.

- Source: ${sourceUrl}
- Imported: ${startedAt}
- Accepted references: ${items.length}
- Representative references: ${representatives.length}
- Contact sheet: ../../processed/contact-sheets/gal-shir.html
- Restrictions: internal visual reference only; no redistribution; do not copy source marks.

## Technical Notes

${stats.technicalLimitations.length ? stats.technicalLimitations.map((note) => `- ${note}`).join("\n") : "- No blocking technical limitations encountered."}
`, "utf8");
  writeFileSync(join(libraryDir, "changelog.md"), `# Changelog

## ${startedAt}

- Imported Gal Shir public portfolio references.
- Generated style profile, representative index, generation rules, avoid patterns, design system notes, and training report.
`, "utf8");
}

function chooseRepresentatives(items) {
  const chosen = [];
  const classes = ["logomark", "monogram", "combination-mark", "brand-presentation", "construction"];
  for (const cls of classes) {
    const item = items.find((entry) => entry.classification === cls && !chosen.includes(entry));
    if (item) chosen.push(item);
  }
  for (const item of items) {
    if (chosen.length >= 12) break;
    if (!chosen.some((entry) => entry.project === item.project)) chosen.push(item);
  }
  return chosen.slice(0, 12);
}

function summarizeRobots(text) {
  return {
    available: Boolean(text),
    hasDisallow: /disallow\s*:/i.test(text),
    contentSignalsMentioned: /content-signal|ai-input|ai-train/i.test(text),
  };
}

function summarizeTerms(text) {
  return {
    available: Boolean(text),
    mentionsCopyright: /copyright|trademark/i.test(text),
    mentionsDownloadRestrictions: /temporarily download|commercial purpose|public display/i.test(text),
  };
}

function reject(reason) {
  stats.rejected++;
  stats.rejectedReasons[reason] = (stats.rejectedReasons[reason] ?? 0) + 1;
}

async function fetchText(url) {
  const response = await fetch(url, { headers: { "user-agent": "Codex auto-logo-maker reference importer" } });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.text();
}

function readJson(path, fallback) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return fallback;
  }
}

function readFileSafe(path) {
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

function writeJsonAtomic(path, value) {
  const temp = `${path}.tmp`;
  writeFileSync(temp, `${JSON.stringify(value, null, 2)}\n`, "utf8");
  renameSync(temp, path);
}

function relative(path) {
  return path.replace(`${root}\\`, "").replaceAll("\\", "/");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
