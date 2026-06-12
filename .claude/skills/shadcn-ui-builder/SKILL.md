---
name: shadcn-ui-builder
description: Build, modify, or style UI in this project using shadcn/ui + Tailwind CSS v4 + Next.js (App Router). Use whenever creating pages, components, layouts, forms, dialogs, dashboards, or any visual element — and when adding/installing shadcn components or theming. Always read DESIGN.md (project root) alongside this skill.
---

# SKILL: Building UI with shadcn/ui + Tailwind v4 + Next.js

You are building UI in a project that uses **shadcn/ui (radix-nova style — Radix primitives, Lucide icons)** on **Tailwind CSS v4** with **Next.js App Router**. Component source is owned by this repo under `components/ui/`. The design tokens, spacing, typography, and layout rules live in **`DESIGN.md` at the project root** — treat that file as the spec; this file is the workflow. Read DESIGN.md before producing any UI code.

## 0. Non-negotiable rules

1. **Tokens only.** Use semantic utilities (`bg-background`, `bg-card`, `text-muted-foreground`, `border`, `ring-ring`, `bg-primary text-primary-foreground`). Never hardcode palette colors (`bg-zinc-900`, `text-white`, `#hex`) or pixel radii.
2. **Compose existing components first.** Before writing custom markup, check the Component Usage Map in DESIGN.md §10 and `components/ui/` for an existing component.
3. **Install via CLI, never copy-paste from memory.** Components are added with `npx shadcn@latest add <name>` so they match the project's `components.json`.
4. **Never edit generated component APIs casually.** Restyle by editing `components/ui/*` source deliberately (that is the shadcn way), but keep prop interfaces (`variant`, `size`, `asChild`) intact.
5. **Tailwind v4 idioms.** No `tailwind.config.ts`; theme lives in `app/globals.css` (`@theme inline`). Use `size-*` instead of `w-* h-*` pairs. No `forwardRef` — plain function components with a `ref` prop if needed.
6. **Light mode only.** Token values come from the Figma export (`tokens/variables-export.json` at the project root) which defines a single Light mode. Do not add `.dark` blocks, `dark:` color utilities, or next-themes plumbing until dark tokens ship — see DESIGN.md §1 and §5 (pending tokens: `destructive-foreground`, `radius` use interim values).

## 1. Workflow

### Step 1 — Inspect the project setup

Read `components.json` to learn the style, base color, aliases, and icon library:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "radix-nova",
  "tailwind": { "config": "", "css": "app/globals.css", "baseColor": "neutral", "cssVariables": true },
  "rsc": true,
  "tsx": true,
  "iconLibrary": "lucide",
  "aliases": {
    "components": "@/components",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks",
    "utils": "@/lib/utils"
  }
}
```

- `tailwind.config` is empty on purpose (Tailwind v4).
- If `components.json` does not exist, initialize first: `npx shadcn@latest init` (existing Next.js project) or `npx shadcn@latest init -t next` (new project).
- Check which components already exist: `ls components/ui/`.

### Step 2 — Add missing components via CLI

```bash
npx shadcn@latest add button card dialog        # add one or many
npx shadcn@latest view button                   # preview source before adding
npx shadcn@latest search @shadcn -q "date"      # find a component by keyword
npx shadcn@latest docs button                   # fetch component docs
npx shadcn@latest add button --overwrite        # re-pull after upstream changes
```

(Substitute `pnpm dlx` / `bunx` for `npx` to match the project's package manager — check the lockfile.)

### Step 3 — Compose the UI

Import from the `@/components/ui` alias and compose:

```tsx
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"

export function ProjectCard() {
  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
        <CardDescription>Track progress and recent activity.</CardDescription>
      </CardHeader>
      <CardContent>…</CardContent>
      <CardFooter>
        <Button>View project</Button>
      </CardFooter>
    </Card>
  )
}
```

### Step 4 — Verify

- `npm run build` (or at least `npx tsc --noEmit`) after adding components.
- If you touched tokens or surfaces, cross-check values against DESIGN.md §3–§5 (which mirror the Figma export).
- Check mobile (`< 640px`) layout for anything with columns, tables, or dialogs.

## 2. File & code conventions

```
app/                    # routes (App Router), server components by default
  globals.css           # Tailwind v4 theme: :root (light tokens), @theme inline
  layout.tsx            # loads fonts (GraphikTH + IBM Plex Sans Thai)
components/
  ui/                   # shadcn-generated components (owned, editable)
  <feature>/            # app-specific composed components
hooks/                  # use-*.ts custom hooks
lib/
  utils.ts              # cn() helper
tokens/
  variables-export.json # Figma variables export — token source of truth
```

- **Naming**: files kebab-case (`user-card.tsx`), components PascalCase, hooks `use-*`.
- **Server vs client**: pages/layouts stay server components; add `"use client"` only where state, effects, or event handlers exist. shadcn components already declare it where needed.
- **Class merging**: always merge incoming classes with `cn()`:

```tsx
import { cn } from "@/lib/utils"

function PanelRow({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-row"
      className={cn("flex items-center gap-2 rounded-md border p-4", className)}
      {...props}
    />
  )
}
```

- **Variants with CVA**: when a custom component needs visual variants, follow the Button pattern — `cva` base + `variants` + `defaultVariants`, export both the component and the `*Variants` helper:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const calloutVariants = cva(
  "rounded-lg border p-4 text-sm",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",
        inverted: "bg-semantic-background text-semantic-foreground border-semantic-border",
        destructive: "border-destructive/50 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  }
)

function Callout({ className, variant, ...props }:
  React.ComponentProps<"div"> & VariantProps<typeof calloutVariants>) {
  return <div className={cn(calloutVariants({ variant }), className)} {...props} />
}
```

- **`data-slot`**: every exported primitive carries a `data-slot="<name>"` attribute (the v4 convention) so parents can target children with `[&_[data-slot=…]]` selectors.
- **`asChild`**: to render a Button as a link, use the slot pattern — never nest `<button><a>`:

```tsx
<Button asChild>
  <Link href="/dashboard">Dashboard</Link>
</Button>
```

- **Icons**: lucide-react, sized with `size-4` (inline) / `size-5` (standalone). Icon-only buttons: `size="icon"` + `aria-label`.

## 3. Forms (react-hook-form + zod + Field)

Standard recipe — `useForm` + `zodResolver`, `Controller` per field, `Field` wrapper for layout/validation states:

```tsx
"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters."),
})

export function ExampleForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  })

  return (
    <form onSubmit={form.handleSubmit((data) => {/* … */})}>
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>
              <Input {...field} id="title" aria-invalid={fieldState.invalid} />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Button type="submit">Submit</Button>
      </FieldGroup>
    </form>
  )
}
```

Key points: `data-invalid` on `Field`, `aria-invalid` on the control, spread `field` onto the input, `FieldDescription` for hints, `toast()` from Sonner for submit feedback.

## 4. Theming tasks

- **Token values are not yours to invent.** The source of truth is the Figma export `tokens/variables-export.json`; DESIGN.md §3–§5 and the `:root` block in `app/globals.css` mirror it. To change a color: design team changes it in Figma → re-export → update `:root` (hex + palette-alias comment).
- **Add a new color** → it must exist in the Figma export first; then expose it in `@theme inline` as `--color-<name>` / `--color-<name>-foreground` and use `bg-<name> text-<name>-foreground`.
- **Pending tokens** — `--destructive-foreground` (#ffffff) and `--radius` (8px) are interim values not yet in Figma; keep them flagged as in DESIGN.md §5.
- **No dark mode work.** The project is light-only until dark tokens ship — do not install next-themes or add `.dark` blocks.

## 5. Common pitfalls

- ❌ Adding `tailwind.config.ts` or `@tailwind base/components/utilities` directives — that's v3; v4 uses `@import "tailwindcss"` + `@theme inline`.
- ❌ `tailwindcss-animate` — deprecated; v4 projects use `tw-animate-css`.
- ❌ Forgetting `"use client"` on components using hooks/handlers (build error in App Router).
- ❌ Adding `dark:` utilities or `.dark` token blocks — dark mode is not designed yet (DESIGN.md §1).
- ❌ Pairing a surface with the wrong foreground (e.g. `bg-primary` with default text color).
- ❌ Rebuilding Radix behavior (modals, menus, tooltips) from scratch with divs — always use the shadcn component.
- ❌ Importing from `radix-ui` packages directly in app code — go through `components/ui/*`.
- ❌ Inventing component names when running `add` — verify with `npx shadcn@latest search @shadcn -q "<keyword>"` first.
