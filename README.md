# shadcn/ui Design System Kit for Claude Code

A drop-in bundle that teaches Claude Code to build UI in a **Next.js (App Router) + shadcn/ui (radix-nova) + Tailwind CSS v4** project using this project's real design tokens (exported from Figma).

## Structure

```
CLAUDE.md                              # Loaded by Claude Code every session — commands, rules, Figma workflow
DESIGN.md                              # Design system spec (tokens, typography, layout) — source of truth in docs
tokens/
  variables-export.json                # Figma variables export — source of truth for values
.claude/
  skills/
    shadcn-ui-builder/
      SKILL.md                         # Skill: workflow + code conventions for building UI
```

## How to use

1. Copy everything in this folder into the **root of your Next.js project** (merge `.claude/` if it already exists).
2. Open the project with Claude Code. `CLAUDE.md` loads automatically every session; the `shadcn-ui-builder` skill triggers whenever you ask for UI work (pages, components, forms, theming) and reads `DESIGN.md` as the spec.
3. When the design team updates tokens in Figma, replace `tokens/variables-export.json` with the new export and ask Claude to sync `DESIGN.md` and `app/globals.css` against it.
4. When you have the Figma design file link, replace the `[FIGMA_FILE_URL — to be added]` placeholder in `CLAUDE.md` so Claude can reference the file directly via the Figma MCP server.

## Current state

- **Light mode only** — the Figma file defines a single mode; dark tokens have not been designed.
- **Pending tokens** (not yet in Figma, interim values in use): `--destructive-foreground` (#ffffff), `--radius` (8px). See DESIGN.md §5.
- Fonts: GraphikTH (primary) + IBM Plex Sans Thai (fallback), Andale Mono.
