# CLAUDE.md

@AGENTS.md

## Project

Next.js (App Router) + shadcn/ui (radix-nova) + Tailwind CSS v4. TypeScript. UI text is Thai-first.
Fonts: GraphikTH (primary, `next/font/local`) + IBM Plex Sans Thai (fallback, `next/font/google`); mono = Andale Mono.

- Design system spec: `DESIGN.md` (project root) — read it before any UI work.
- UI workflow: the `shadcn-ui-builder` skill (`.claude/skills/shadcn-ui-builder/SKILL.md`) — triggers on any UI task.
- Token source of truth: `tokens/variables-export.json` (Figma variables export, 1,807 variables, **Light mode only**).

## Commands

```bash
npm run dev                      # dev server (Turbopack)
npm run build                    # production build — run before considering UI work done
npm run lint                     # ESLint
npx tsc --noEmit                 # type check
npx shadcn@latest add <name>     # add a shadcn component (never paste from memory)
```

First-time setup (only if `package.json` does not exist yet):

```bash
npx create-next-app@latest . --typescript --app --tailwind --eslint --src-dir=false
npx shadcn@latest init           # base color: neutral, CSS variables: yes
```

Then apply the token values from DESIGN.md §11 to `app/globals.css` and set up fonts per DESIGN.md §6.

## Architecture

```
app/                    # routes; server components by default
  globals.css           # Tailwind v4 theme — :root mirrors the Figma export (no .dark block)
  layout.tsx            # font loading (GraphikTH + IBM Plex Sans Thai)
components/ui/          # shadcn-generated components (owned, editable source)
components/<feature>/   # app-specific composed components
hooks/                  # use-*.ts
lib/utils.ts            # cn() helper
tokens/variables-export.json   # Figma export — token source of truth
.claude/skills/shadcn-ui-builder/  # UI workflow skill
```

## Design system rules (always apply)

- **Semantic tokens only**: `bg-primary text-primary-foreground`, `text-muted-foreground`, `border` — never raw palette colors (`bg-neutral-900`, `#hex`) or arbitrary radii (`rounded-[10px]`).
- **Light mode only**: dark mode is not designed. No `.dark` blocks, no `dark:` color utilities, no next-themes.
- **Token values are never invented**: they come from the Figma export. To change a color: change in Figma → re-export → replace `tokens/variables-export.json` → sync `DESIGN.md` §3–§5 and `:root` in `app/globals.css`.
- **Tailwind v4**: no `tailwind.config.ts`; theme lives in `app/globals.css` via `@theme inline`. Use `size-*` over `w-* h-*`. No `forwardRef`.
- **Pending tokens** (interim values, not yet in Figma — see DESIGN.md §5): `--destructive-foreground: #ffffff`, `--radius: 8px`.

## Figma

Design file: `[FIGMA_FILE_URL — to be added]`

- **Design-to-code**: when given a Figma frame URL, read it with the Figma MCP server (`get_design_context`, `get_screenshot`), then implement using semantic tokens and existing `components/ui/*`. If a value read from the frame conflicts with DESIGN.md, **DESIGN.md wins** — flag the mismatch instead of copying the frame value.
- **Token sync**: when the design team ships a new variables export, replace `tokens/variables-export.json`, then update DESIGN.md token tables (§3–§5) and `app/globals.css` `:root` to match, and verify hex values against the JSON before finishing.

## MCP servers

- **Figma MCP** — read designs from the Figma file (design context, screenshots, variables). Load the matching `figma-*` skill before calling its write tools (`use_figma`, `create_new_file`, `generate_diagram`).
- **shadcn MCP** — search/view registry components (`search_items_in_registries`, `view_items_in_registries`) to verify a component exists before `npx shadcn@latest add`.
