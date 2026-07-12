---
name: auto-logo-maker
description: Automatically analyze a project and logo references, design original SVG logo concepts, select the best concept, produce final logo assets and framework components, implement the logo into the app, create a logo preview page, import public logo/style reference portfolios, learn reusable style libraries, and validate the result. Use when the user asks to create a logo from references, make a logo, design a brand symbol, create a logomark or SVG logo, implement a logo into a website, use attached/reference logos as inspiration, import logo portfolio references, or run LEARN_STYLE for a logo reference collection.
---

# Auto Logo Maker

Create and implement a complete original logo system from visual references with minimal user input. Do not ask for a brief, concept approval, or manual implementation unless the task is blocked by missing files or an explicit user constraint.

## Core Behavior

Use visual references only for style analysis. Never copy a specific reference, known brand, or recognizable mark. Infer brand/product details from the repository. If a detail cannot be verified, make a reasonable assumption, record it in `docs/brand/project-analysis.md`, and continue.

Prefer deterministic SVG and code-native implementation. Do not use raster images, base64, emoji, icon libraries, generated bitmap logos, SVG `<text>` as the main symbol, JavaScript inside SVG, or effects that are required for recognition.

## Inputs

Collect references from:

- images attached in chat, inspected with available image tools;
- files under `logo-references/`;
- imported style collections under `logo-style-training/libraries/`;
- existing project logo assets only as project context, not as mandatory style constraints.

## Required Workflow

1. Analyze the project before designing.
2. Analyze all logo references.
3. Create at least three distinct original SVG concepts.
4. Score concepts and select the strongest one automatically.
5. Create final SVG logo variants and framework components.
6. Implement the logo in navigation, mobile navigation, footer, favicon, metadata, and manifest when present.
7. Create a private development preview route such as `/logo-preview`.
8. Run lint, TypeScript check if available, build, and `npm run validate:logo`.
9. Fix failures within scope.
10. End with a concise summary only.

## Portfolio Import

Read `references/portfolio-import.md` before importing public reference portfolios. Use only publicly accessible files that normal visitors can view without login, paywall, CAPTCHA, private APIs, or authentication tokens. Respect `robots.txt`, terms pages, and source restrictions. Do not collect from unrelated social networks or third-party portfolio sites unless explicitly permitted.

For the Gal Shir portfolio import, run:

```bash
npm run logo:import:galshir
```

This writes raw files to `logo-style-training/raw/gal-shir/`, a contact sheet to `logo-style-training/processed/contact-sheets/gal-shir.html`, and a learned style library to `logo-style-training/libraries/gal-shir-inspired/`.

## LEARN_STYLE Mode

Read `references/style-library.md` before creating or updating a style library. In LEARN_STYLE mode, analyze the collection as visual inspiration only. Extract reusable design principles, representative examples, generation rules, and avoid patterns. Never use a learned collection to imitate a specific source image, mark, monogram, composition, or colorway.

## Project Analysis

Read `references/project-analysis.md` before analysis. Save findings to `docs/brand/project-analysis.md`.

Inspect relevant non-secret files, including `package.json`, README files, web metadata, layout files, homepage, navigation, hero content, CSS, Tailwind config, design tokens, public assets, CMS data, and safe config files. Do not print or copy `.env` values.

Identify brand name, product name, business domain, services, audience, value proposition, brand personality, colors, fonts, design style, language, framework, styling approach, existing favicon/logo placeholders, and every place the logo is used.

## Reference Analysis

Read `references/style-analysis.md` and `references/logo-rules.md` before analyzing references. Save findings to `docs/brand/reference-analysis.md`.

For each reference, describe concrete visual principles: geometry, simplicity, stroke weight, radius, edge sharpness, negative space, symmetry, proportions, optical balance, symbol construction, symbol/wordmark relationship, typographic character, color system, abstraction level, brand impression, and small-size readability.

Then synthesize a shared style DNA. Avoid vague labels such as "modern" unless paired with concrete geometry.

## Concept Generation

Create at least:

- `public/brand/concepts/concept-01.svg`: geometric symbol;
- `public/brand/concepts/concept-02.svg`: smart monogram or lettermark;
- `public/brand/concepts/concept-03.svg`: abstract symbol based on brand meaning.

Concepts must not be minor variants of one shape. Each must include a clear visual idea, symbolism, explainable construction, one-color usability, 16-24 px viability, a horizontal variant direction, and a standalone mark.

## Evaluation

Read `references/evaluation-rubric.md`. Score each concept from 1 to 10 for originality, simplicity, memorability, brand relevance, fit with reference DNA, difference from specific references, small-size use, one-color use, SVG cleanliness, web use, project compatibility, and favicon potential.

Save scoring and the automatic winner to `docs/brand/concept-evaluation.md`.

## Final Outputs

Create these files from the winning concept:

- `public/brand/logo.svg`
- `public/brand/logo-mark.svg`
- `public/brand/logo-horizontal.svg`
- `public/brand/logo-monochrome.svg`
- `public/brand/logo-light.svg`
- `public/brand/logo-dark.svg`
- `public/brand/favicon.svg`

Create framework-appropriate components, typically:

- `components/brand/Logo.tsx`
- `components/brand/LogoMark.tsx`

Component requirements: support `variant`, `size`, `className`, `title`, `decorative`, light/dark variants, and `currentColor` where practical. Follow existing framework and styling conventions without adding unnecessary dependencies.

## Preview

Create a private development preview route, usually `/logo-preview`, using real components and SVG files. Show all three concepts, the winner, light/dark/monochrome variants, standalone mark, horizontal logo, favicon, navigation usage, sizes 16/24/32/48/64/128/256 px, safe area, mobile header simulation, and desktop header simulation.

## Validation

Use `scripts/validate-logo.mjs` by running:

```bash
npm run validate:logo
```

Use `scripts/generate-logo-report.mjs` when a concise artifact inventory is useful:

```bash
node .agents/skills/auto-logo-maker/scripts/generate-logo-report.mjs
```

Use `scripts/import-portfolio-references.mjs` for future public portfolio imports:

```bash
node .agents/skills/auto-logo-maker/scripts/import-portfolio-references.mjs --url "https://galshir.com/" --collection "gal-shir-inspired" --limit 50
```

Before finishing, run available lint, TypeScript checking, build, and logo validation. If a command is unavailable or fails for unrelated existing project reasons, report that clearly.

## Final Response

Report only:

- selected concept;
- preview URL/path;
- created/updated files;
- whether build and validation passed;
- assumptions used.
