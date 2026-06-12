# DESIGN.md — Design System Specification

> Design system spec for this project, built on **shadcn/ui** + **Tailwind CSS v4** + **Next.js (App Router)**.
> Token values in this document are extracted from the project's Figma variables export — that file is the **source of truth**:
>
> **`tokens/variables-export.json`** (format `lazyyysync-variables-v1` · 17 collections · 1,807 variables · single mode = **Light**)
>
> For *how to build UI* (workflow, CLI, code patterns), see the [`shadcn-ui-builder` skill](./.claude/skills/shadcn-ui-builder/SKILL.md).

---

## 1. Principles

1. **Figma is the source of truth for values.** Every color, size, radius, and font value below comes from `variables-export.json`. To change a value: change it in Figma → re-export → update CSS. Never tweak a token value directly in CSS "to make it look right."
2. **Open Code** — shadcn/ui component source lives in this repo under `components/ui/` and is owned by us. Customize by editing the source, never by wrapping or overriding with hacks.
3. **Semantic tokens first** — app code uses semantic utilities (`bg-primary`, `text-muted-foreground`), never raw palette colors (`bg-neutral-900`, `#hex`). The palettes (`tw/colors`, `rdx/colors`) exist only to feed the semantic layer.
4. **Composition** — components share one predictable interface and compose together (`Card` + `Form` + `Button`).
5. **Light mode only (for now).** The Figma file defines a single Light mode. Dark mode has **not been designed** — do not invent dark values, do not add `.dark` blocks or `dark:` utilities until the design team ships dark tokens.

---

## 2. Token Architecture

Three layers, mirroring the Figma collections:

```
Layer 1 — Primitives      tw/colors (Tailwind palette, 24 families)
                          rdx/colors (Radix palette, 33 families)
                          tokens (raw numbers), border-radius, font, height,
                          gap, margin, padding, space, max-width, opacity, …
        │  (Figma alias)
        ▼
Layer 2 — Semantic        shadcn/ui collection (35 tokens)
                          → CSS variables in :root  (--background, --primary, …)
        │  (@theme inline)
        ▼
Layer 3 — Utilities       Tailwind classes: bg-primary, text-muted-foreground,
                          border, rounded-lg, …
```

### The `background` / `foreground` convention

Tokens come in pairs: the base token is the **surface color**, the `-foreground` token is the **text/icon color on that surface**:

```tsx
<div className="bg-primary text-primary-foreground">Hello</div>
```

Rule: whenever you set a surface (`bg-card`, `bg-primary`, `bg-muted`…), set the matching foreground — never assume the default text color is readable on it.

---

## 3. Semantic Color Tokens (Light)

Values from the `shadcn/ui` collection. Format: hex + the palette primitive it aliases in Figma.

### Core surfaces & text

| Token | Value | Alias | Use |
|---|---|---|---|
| `--background` | `#ffffff` | `white` | App/page background |
| `--foreground` | `#0a0a0a` | `neutral-950` | Default text |
| `--card` | `#ffffff` | `white` | Card / panel surface |
| `--card-foreground` | `#0a0a0a` | `neutral-950` | Text on cards |
| `--popover` | `#ffffff` | `white` | Popover/Dropdown/Tooltip surface |
| `--popover-foreground` | `#0a0a0a` | `neutral-950` | Text on popovers |

### Actions & emphasis

| Token | Value | Alias | Use |
|---|---|---|---|
| `--primary` | `#171717` | `neutral-900` | Primary buttons, brand emphasis |
| `--primary-foreground` | `#fafafa` | `neutral-50` | Text on primary |
| `--secondary` | `#f5f5f5` | `neutral-100` | Secondary buttons |
| `--secondary-foreground` | `#0a0a0a` | `neutral-950` | Text on secondary |
| `--muted` | `#f5f5f5` | `neutral-100` | Subtle wells, skeletons |
| `--muted-foreground` | `#737373` | `neutral-500` | Secondary/description text |
| `--accent` | `#f5f5f5` | `neutral-100` | Hover/selected states |
| `--accent-foreground` | `#171717` | `neutral-900` | Text on accent |
| `--destructive` | `#dc2626` | `red-600` | Destructive actions, errors |

### Borders & focus

| Token | Value | Alias | Use |
|---|---|---|---|
| `--border` | `#e5e5e5` | `neutral-200` | Borders, separators |
| `--input` | `#e5e5e5` | `neutral-200` | Form control borders |
| `--ring` | `#737373` | `neutral-500` | Focus rings |

### Charts (Radix blue scale)

| Token | Value | Alias |
|---|---|---|
| `--chart-1` | `#5eb1ef` | rdx `blue-8` |
| `--chart-2` | `#0090ff` | rdx `blue-9` |
| `--chart-3` | `#0588f0` | rdx `blue-10` |
| `--chart-4` | `#0d74ce` | rdx `blue-11` |
| `--chart-5` | `#113264` | rdx `blue-12` |

Charts are a **monochromatic blue ramp** (light → dark), not a categorical rainbow. Use chart-1…5 in order for series 1…5.

### Sidebar

| Token | Value | Alias | Use |
|---|---|---|---|
| `--sidebar` | `#fafafa` | `neutral-50` | Sidebar surface |
| `--sidebar-foreground` | `#0a0a0a` | `neutral-950` | Sidebar text |
| `--sidebar-primary` | `#171717` | `neutral-900` | Active nav item |
| `--sidebar-primary-foreground` | `#fafafa` | `neutral-50` | Text on active item |
| `--sidebar-accent` | `#f5f5f5` | `neutral-100` | Hover/selected menu item |
| `--sidebar-accent-foreground` | `#171717` | `neutral-900` | Text on hover item |
| `--sidebar-border` | `#d4d4d4` | `neutral-300` | Sidebar dividers (darker than `--border`) |
| `--sidebar-ring` | `#737373` | `neutral-500` | Focus rings in sidebar |

---

## 4. Project-Specific Tokens

Four tokens beyond the shadcn standard exist in the Figma file:

| Token | Value | Alias | Recommended use |
|---|---|---|---|
| `--background-color` | `#000000` at **30% alpha** | rdx `black-5` | Overlay/backdrop behind Dialog, Sheet, Drawer (`bg-black/30` equivalent) |
| `--semantic-background` | `#6b7280` | `gray-500` | Inverted/neutral info surface (e.g. tooltips on light UI, info chips) |
| `--semantic-border` | `#374151` | `gray-700` | Border on the inverted surface |
| `--semantic-foreground` | `#ffffff` | `white` | Text on the inverted surface |

Note: `semantic-*` tokens alias the **gray** family while everything else uses **neutral** — they are intentionally distinct. Always use the three together as a set.

---

## 5. ⚠️ Pending Tokens (not yet in Figma)

Two standard shadcn tokens are **not yet defined** in the Figma file. Code may use the interim values below, clearly understood as provisional until the design team adds them to Figma and re-exports:

| Token | Status | Interim value for code | Rationale |
|---|---|---|---|
| `--destructive-foreground` | ❌ not in Figma | `#ffffff` (`white`) | Pairs with `--destructive` = red-600 |
| `--radius` | ❌ not in Figma | `8px` | Matches `rounded-lg` in the `border-radius` collection |

When these land in the Figma export, replace the interim values and delete this section.

---

## 6. Typography

### Families

| Role | Font | Loading |
|---|---|---|
| Sans (primary) | **GraphikTH** | Local font files via `next/font/local` → `--font-sans` |
| Sans (fallback) | IBM Plex Sans Thai | `next/font/google` → appended to the `--font-sans` stack |
| Mono | Andale Mono | System font → `--font-mono` |

Font stack: `GraphikTH, "IBM Plex Sans Thai", ui-sans-serif, system-ui, sans-serif`. Both primary and fallback support Thai — never substitute a Latin-only font.

### Type scale (from the `font` collection, values in px)

| Step | Size | Tailwind class |
|---|---|---|
| xs | 12 | `text-xs` |
| sm | 14 | `text-sm` |
| base | 16 | `text-base` |
| lg | 18 | `text-lg` |
| xl | 20 | `text-xl` |
| 2xl | 24 | `text-2xl` |
| 3xl | 30 | `text-3xl` |
| 4xl | 36 | `text-4xl` |
| 5xl–9xl | 48 / 60 / 72 / 96 / 128 | `text-5xl` … `text-9xl` |

Weights: thin 100 → black 900 (full scale available; UI normally uses `font-normal` 400, `font-medium` 500, `font-semibold` 600).
Line heights (`leading/*`): 12–128px scale. Letter spacing (`tracking/*`): tighter −0.8 · tight −0.4 · normal 0 · wide 0.4 · wider 0.8 · widest 1.6.

### Roles

| Role | Classes |
|---|---|
| Page title (h1) | `text-3xl font-semibold tracking-tight` |
| Section title (h2) | `text-2xl font-semibold tracking-tight` |
| Card / widget title (h3) | `text-lg font-semibold` |
| Body | `text-sm` (app UI) / `text-base` (long-form) |
| Secondary / description | `text-sm text-muted-foreground` |
| Caption / meta | `text-xs text-muted-foreground` |
| Inline code | `rounded-sm bg-muted px-1.5 py-0.5 font-mono text-sm` |
| Numbers in tables | add `tabular-nums` |

---

## 7. Radius Scale

Fixed pixel values from the `border-radius` collection (not the shadcn `calc()` formula — Figma defines each step explicitly):

| Token | Value | Tailwind class |
|---|---|---|
| `rounded-none` | 0 | `rounded-none` |
| `rounded-xs` | 2px | `rounded-xs` |
| `rounded-sm` | 4px | `rounded-sm` |
| `rounded-md` | 6px | `rounded-md` |
| `rounded-lg` | **8px** | `rounded-lg` |
| `rounded-xl` | 12px | `rounded-xl` |
| `rounded-2xl` | 16px | `rounded-2xl` |
| `rounded-3xl` | 24px | `rounded-3xl` |
| `rounded-4xl` | 32px | `rounded-4xl` |
| `rounded-full` | 9999 | `rounded-full` |

Usage rules: `rounded-lg` (8px) for cards, dialogs, popovers · `rounded-md` (6px) for buttons, inputs, menu items · `rounded-full` for avatars, badges/pills. Never hardcode arbitrary radii (`rounded-[10px]`).

---

## 8. Spacing & Layout

### Spacing scale

`gap` / `margin` / `padding` / `space` collections all follow the Tailwind 4px scale (`*-1` = 4px, `*-2` = 8px, … `*-96` = 384px). Standard rhythm:

- Within a control or tight group: `gap-2` (8px)
- Between related elements (form fields, card content): `gap-4` / `space-y-4` (16px)
- Between sections / cards: `gap-6` (24px)
- Page-level section spacing: `py-8` … `py-12`
- Page gutters: `px-4 sm:px-6 lg:px-8`

Prefer **flex/grid + `gap-*`** over margins between siblings. Use `size-*` for equal width/height (`size-4` icons, `size-9` icon buttons) — never `w-4 h-4`.

### Control heights (from the `height` collection)

| Control | Height | Class |
|---|---|---|
| Button / Input (default) | 36px | `h-9` |
| Button sm | 32px | `h-8` |
| Button lg | 40px | `h-10` |
| Icon button | 36 × 36px | `size-9` |
| Table row (comfortable) | 48px | `h-12` |

### Containers & breakpoints (from the `max-width` collection)

| Purpose | Class | Width |
|---|---|---|
| Content / article page | `max-w-3xl` | 768px |
| Form / settings page | `max-w-xl` | 576px |
| Dashboard shell | `max-w-7xl` | 1280px |
| Screen breakpoints | `max-w-screen-sm/md/lg/xl/2xl` | 640 / 768 / 1024 / 1280 / 1536 |

Mobile-first; Tailwind defaults `sm:640 md:768 lg:1024 xl:1280 2xl:1536` match the `max-w-screen-*` tokens.

- Page container: `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`
- Card grids: `grid gap-4 md:grid-cols-2 lg:grid-cols-3`
- Forms: single column on mobile; pair short fields with `grid gap-4 sm:grid-cols-2`
- Navigation: `Sidebar` component for app shells; `Sheet` for ad-hoc mobile drawers
- Modal tasks: prefer `Drawer` below `md`, `Dialog` above

### Surfaces & elevation

Elevation is expressed by **token + border**, not heavy shadows:

| Level | Treatment |
|---|---|
| 0 — page | `bg-background` |
| 1 — panel | `bg-card text-card-foreground rounded-lg border` (the Card component) |
| 2 — floating | `bg-popover text-popover-foreground rounded-lg border shadow-md` |
| Backdrop | `--background-color` (black 30%) behind Dialog/Sheet/Drawer |
| Hover/selected | `bg-accent text-accent-foreground` |
| Subtle well | `bg-muted` |

### Borders & opacity

`border-width` tokens: 1px default (`border`), 2/4/8 available. `stroke-width` for icons/SVG: 0.5–3 (Lucide default 2). `opacity` scale: 0–100 in steps of 5; disabled states use `opacity-50`.

---

## 9. Interaction States

- **Focus**: never remove outlines. Focus ring color is `--ring` (`#737373` neutral-500); custom focusable elements use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2`.
- **Hover**: `hover:bg-accent hover:text-accent-foreground` for list items/ghost actions; built-in variants for buttons.
- **Disabled**: `disabled:pointer-events-none disabled:opacity-50`.
- **Invalid**: set `aria-invalid` on the control and `data-invalid` on its `Field` wrapper; components style themselves from those attributes (error color = `--destructive` `#dc2626`).
- **Loading**: `Spinner` inside buttons (disable while pending); `Skeleton` (`bg-muted`) for loading surfaces.

---

## 10. Component Usage Map

Pick the standard component before inventing markup:

| Need | Use |
|---|---|
| Primary/secondary/dangerous action | `Button` (`variant="default" / "secondary" / "destructive"`) |
| Low-emphasis or icon action | `Button` (`variant="ghost"` / `size="icon"`) |
| Panel of grouped content | `Card` (+ `CardHeader/Title/Description/Content/Footer`) |
| Confirmation that blocks | `AlertDialog` |
| Modal task | `Dialog` (or `Drawer` on mobile) |
| Side panel | `Sheet` |
| App navigation shell | `Sidebar` |
| Inline status label | `Badge` |
| Inline callout | `Alert` |
| Toast / async feedback | `Sonner` (`toast(...)`) |
| Tabular data | `Table`; sorting/filtering → Data Table pattern (TanStack) |
| Form fields | `Field`, `FieldLabel`, `FieldDescription`, `FieldError` + controls |
| Select from few options | `RadioGroup` (≤5) / `Select` (>5) / `Combobox` (searchable) |
| Loading placeholder | `Skeleton` / `Spinner` |
| Empty state | `Empty` |

---

## 11. Theming Implementation (`app/globals.css`)

Tailwind v4 — no `tailwind.config.{js,ts}`; all theme configuration lives in CSS. This is the canonical mapping of the Figma export:

```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  /* === shadcn/ui collection — Light (from variables-export.json) === */
  --background: #ffffff;            /* white */
  --foreground: #0a0a0a;            /* neutral-950 */
  --card: #ffffff;                  /* white */
  --card-foreground: #0a0a0a;       /* neutral-950 */
  --popover: #ffffff;               /* white */
  --popover-foreground: #0a0a0a;    /* neutral-950 */
  --primary: #171717;               /* neutral-900 */
  --primary-foreground: #fafafa;    /* neutral-50 */
  --secondary: #f5f5f5;             /* neutral-100 */
  --secondary-foreground: #0a0a0a;  /* neutral-950 */
  --muted: #f5f5f5;                 /* neutral-100 */
  --muted-foreground: #737373;      /* neutral-500 */
  --accent: #f5f5f5;                /* neutral-100 */
  --accent-foreground: #171717;     /* neutral-900 */
  --destructive: #dc2626;           /* red-600 */
  --border: #e5e5e5;                /* neutral-200 */
  --input: #e5e5e5;                 /* neutral-200 */
  --ring: #737373;                  /* neutral-500 */
  --chart-1: #5eb1ef;               /* rdx blue-8 */
  --chart-2: #0090ff;               /* rdx blue-9 */
  --chart-3: #0588f0;               /* rdx blue-10 */
  --chart-4: #0d74ce;               /* rdx blue-11 */
  --chart-5: #113264;               /* rdx blue-12 */
  --sidebar: #fafafa;               /* neutral-50 */
  --sidebar-foreground: #0a0a0a;    /* neutral-950 */
  --sidebar-primary: #171717;       /* neutral-900 */
  --sidebar-primary-foreground: #fafafa;
  --sidebar-accent: #f5f5f5;        /* neutral-100 */
  --sidebar-accent-foreground: #171717;
  --sidebar-border: #d4d4d4;        /* neutral-300 */
  --sidebar-ring: #737373;          /* neutral-500 */

  /* === Project-specific tokens === */
  --overlay: rgb(0 0 0 / 0.3);      /* Figma: background-color (black 30%) */
  --semantic-background: #6b7280;   /* gray-500 */
  --semantic-border: #374151;       /* gray-700 */
  --semantic-foreground: #ffffff;   /* white */

  /* === ⚠️ Pending — not yet in Figma (see DESIGN.md §5) === */
  --destructive-foreground: #ffffff;
  --radius: 8px;                    /* = rounded-lg */
}

/* NOTE: no .dark block — dark mode has not been designed yet. */

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
  --color-overlay: var(--overlay);
  --color-semantic-background: var(--semantic-background);
  --color-semantic-border: var(--semantic-border);
  --color-semantic-foreground: var(--semantic-foreground);

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  --font-sans: var(--font-graphik), var(--font-plex-thai), ui-sans-serif, system-ui, sans-serif;
  --font-mono: "Andale Mono", ui-monospace, monospace;
}
```

Fonts are loaded in `app/layout.tsx`: GraphikTH via `next/font/local` (exposed as `--font-graphik`), IBM Plex Sans Thai via `next/font/google` (exposed as `--font-plex-thai`).

### Sync workflow

1. Design team edits variables in Figma → exports a new `variables-export.json` → replace `tokens/variables-export.json`.
2. Diff the export against `:root` in `globals.css` and update changed values (keep the palette-alias comments accurate).
3. Update the tables in this document if tokens were added/removed.

---

## 12. Accessibility Baseline

- All interactive components are Radix-based and keyboard-accessible — do not re-implement them with `div onClick`.
- Every form control gets a `FieldLabel`/`Label` with matching `htmlFor`/`id`.
- Icon-only buttons require `aria-label` (or `<span className="sr-only">`).
- Contrast notes for this palette: `--muted-foreground` (#737373) on white passes AA for normal text only at ≥ 4.5:1 boundary — use it for secondary text, never for essential small text on `--muted` (#f5f5f5). White on `--destructive` (#dc2626) passes AA for the button text size.
- Thai text: GraphikTH/IBM Plex Sans Thai both render Thai correctly; keep `leading` roomy (Thai diacritics clip with tight line heights — avoid `leading-none` on Thai copy).

---

## 13. Hard Rules (Do / Don't)

| ✅ Do | ❌ Don't |
|---|---|
| `bg-primary text-primary-foreground` | `bg-neutral-900 text-white` |
| `text-muted-foreground` for secondary text | `text-gray-500` / `text-neutral-500` |
| `border` (uses `--border`) | `border-neutral-200` |
| `rounded-lg` / `rounded-md` (token steps) | `rounded-[10px]` |
| `size-4` for icons | `w-4 h-4` |
| Change values in Figma → re-export → update CSS | Edit a token value in CSS only |
| Use `--overlay` token for dialog backdrops | `bg-black/50` ad-hoc overlays |
| Use chart-1…5 in ramp order | Random palette colors in charts |
| Flag missing tokens (see §5) and use interim values | Silently inventing new token values |
| Keep UI light-mode only until dark tokens ship | Adding `.dark` blocks or `dark:` color overrides |
