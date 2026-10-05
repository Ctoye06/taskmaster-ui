---
name: taskmaster-component-standards
description: >-
  Coding standards and architecture conventions for EAYL Taskmaster Astro UI.
  Use when creating or editing Astro components, pages, TypeScript types, or
  the mock data layer so new code matches the established patterns: typed
  `Props`, the data-layer separation (types → data → derived queries → UI),
  mock-data-only rules, prop-driven reusable components, client scripts, and
  accessibility. Triggers: "add a component", "create a page", "add mock
  data", "wire up data", "new type", "follow the project conventions".
---

# Taskmaster Component & Code Standards

The UI is **Astro + TypeScript + Tailwind v4**, static-first, **no React**,
**no backend/Supabase yet**. The goal is a clean, prop-driven component set
backed by a swappable mock data layer.

## Architecture: strict data-layer separation
Data flows one direction. Keep every layer in its place:

```
src/types/index.ts      ← shape definitions (interfaces, unions)
src/data/*.ts           ← raw mock records (players, tasks, scores)
src/data/queries.ts     ← derived selectors / view models
pages (.astro)          ← call selectors, pass plain props to components
components (.astro)      ← render props only; NO data imports of raw records
```

Rules:
- **Never hard-code player/task/score data inside a component.** Components
  receive everything through typed `Props`.
- Pages import from `src/data/*` (ideally the `queries.ts` selectors), then
  hand ready-to-render data to components.
- All cross-record computation (leaderboard ranking, stats, recent results,
  initials) lives in `queries.ts` as pure functions — not in components or
  page markup.
- This separation exists so the mock arrays can later be replaced by Supabase
  queries **without changing any component**. Preserve it.

## Types (`src/types/index.ts`)
- Define a shared `interface` / union for every domain concept and reuse it;
  don't inline object shapes.
- Separate **raw records** (`Player`, `Task`, `Score`) from **derived view
  models** (`LeaderboardRow`, `TaskResult`, `CompetitionStats`).
- Dates are ISO 8601 strings on the record; format them at the page level.
- Status is a string-literal union (`"upcoming" | "live" | "completed"`),
  exported as `TaskStatus`.

## Mock data (`src/data/*.ts`)
- One file per entity: `players.ts`, `tasks.ts`, `scores.ts`.
- Export a typed array plus small `getXById` / `getCurrent*` lookup helpers.
- Derive scores deterministically where practical (see `scores.ts`) so the
  dataset stays internally consistent and easy to extend.
- Add a comment noting the array will become a Supabase query later.
- Keep data realistic and sufficient to demonstrate every UI state (upcoming,
  live, completed).

## Astro component conventions
- **Typed props:** every component declares `interface Props { ... }` and
  destructures from `Astro.props`, with sensible defaults.
- **Pass-through styling:** accept an optional `class?: string` prop and merge
  it last so callers can extend layout (e.g. `class="shrink-0"`).
- Use `class:list={[...]}` for conditional/variant classes, not string
  concatenation.
- Keep components **small, single-purpose, and reusable**. Prefer composing
  (e.g. `TerminalWindow` wrapping content) over duplicating markup.
- Map variants with a typed config object keyed by the union
  (see `TaskStatusBadge.astro`'s `config: Record<TaskStatus, {...}>`), rather
  than chains of `if`/ternaries in markup.
- Comment only where it adds context (e.g. explaining the build-time
  countdown fallback); don't narrate obvious markup.

## Client-side JavaScript
- Default to static output. Add a `<script>` only when behaviour needs the
  browser (e.g. `Countdown.astro`, mobile nav toggle).
- Scripts are TypeScript, type the DOM queries (`querySelector<HTMLElement>`),
  and must **degrade gracefully**: render a correct server-side value first,
  then enhance (the countdown prints a valid time before JS runs).
- Drive scripts off `data-*` attributes rather than hard-coded values.

## Accessibility (required)
- Semantic HTML and correct heading hierarchy (`h1` once per page, sections
  use `h2`).
- Decorative chrome (traffic lights, `●`, medals used only as decoration) is
  `aria-hidden="true"`; meaningful state is also conveyed in text.
- Interactive elements are real `<a>`/`<button>` with visible focus (global
  `:focus-visible` outline) and proper `aria-*` (`aria-current="page"` for
  active nav, `aria-expanded`/`aria-controls` for the menu toggle).
- Provide a skip-to-content link (in `Layout.astro`); don't remove it.

## Responsive
- Mobile-first: base styles target small screens, scale up with `sm:`/`lg:`.
- Don't just shrink desktop — collapse multi-column grids
  (`grid lg:grid-cols-2`) and swap the desktop nav for the mobile menu.

## Validation before finishing
Always run and keep clean:
```
npx astro check   # 0 errors / 0 warnings
npx astro build
```
Also confirm nav links and dynamic routes resolve, and that no section looks
unfinished or contains placeholder content.

## Don't
- ❌ Add React or UI libraries without a strong technical reason.
- ❌ Implement Supabase, auth, or any backend yet.
- ❌ Import raw data arrays into components or compute standings in markup.
- ❌ Leave untyped props or inline one-off object shapes.
