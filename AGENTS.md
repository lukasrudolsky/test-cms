# Project Agent Instructions

Use `.agents/skills/auto-logo-maker` whenever the user asks to create, redesign, implement, or preview a logo, brand symbol, logomark, SVG logo, favicon, or logo system from references.

For logo requests, do not ask the user for a full brief when project context and visual references are available. Analyze the repository and references, make reasonable assumptions, write those assumptions into `docs/brand/project-analysis.md`, create concepts, choose the strongest one, implement it, preview it, and run `npm run validate:logo`.

For public portfolio imports or learned logo-style collections, use the same skill. Respect source terms, write manifests and `SOURCE.md`, keep imported artwork as internal visual reference only, and do not copy source marks into final outputs.

Global copy: this skill has also been copied to `~/.agents/skills/auto-logo-maker/`. To install it globally in another environment, copy the project folder `.agents/skills/auto-logo-maker/` to that same user-level path.
