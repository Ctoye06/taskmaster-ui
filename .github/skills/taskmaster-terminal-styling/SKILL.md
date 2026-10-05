---
name: taskmaster-terminal-styling
description: >-
  Visual styling standards for EAYL Taskmaster UI's terminal / coding
  aesthetic. Use when creating or restyling any Astro component, page, or
  global CSS so new work matches the established CRT-terminal look: the
  design-token palette, monospace typography, terminal chrome (traffic
  lights, prompts, carets, scanlines), badges, and motion rules. Triggers:
  "style a component", "add a page", "match the theme", "terminal styling",
  "which color/token do I use", "add an animation".
---

# Taskmaster Terminal Styling

EAYL Taskmaster site uses a deliberate **terminal / coding aesthetic** (dark
CRT, monospace, green-on-black, window chrome). It must never look like a
generic Tailwind template, corporate dashboard, or e-commerce site. Keep it
playful, competitive, and polished.

All tokens live in `src/styles/global.css` under Tailwind v4's `@theme`
block, which generates matching utilities automatically. **Always style with
these tokens/utilities — never hard-code hex values in components.**

## Design tokens → utilities

Defining `--color-acid` in `@theme` yields `text-acid`, `bg-acid`,
`border-acid`, etc. Same pattern for every token below.

### Surfaces
- `term-bg` `#080b10` — page background (near-black).
- `term-panel` `#0e141c` / `term-panel-2` `#121a24` — raised panels/cards.
- `grid` `#1d2a38` — default borders. `grid-soft` `#152030` — background grid lines.

### Text (ink ramp)
- `ink` `#cfdae6` — primary text.
- `ink-dim` `#8595a7` — secondary text / body copy.
- `ink-faint` `#5a6675` — captions, labels, de-emphasised meta.

### Accents (use sparingly, with intent)
- `acid` `#3ef08b` — **primary** terminal green: prompts, key numbers, primary CTAs, active nav.
- `amber` `#ffb454` — live/in-progress state, deadlines, warnings.
- `magenta` `#ff6ac1` — playful highlights (hero numbers, week labels).
- `cyan` `#5bd6ff` — links, informational `>` lines.
- `danger` `#ff5f56` — errors/penalties only.
- `dot-red` / `dot-amber` / `dot-green` — the three window "traffic lights".

## Typography
- Font is **JetBrains Mono** everywhere (`--font-mono`), loaded in
  `Layout.astro`. Never introduce a non-monospace font.
- Headings: `font-extrabold` with tight tracking; large display numbers use
  `tabular-nums`.
- Section labels/eyebrows: uppercase, `tracking-[0.2em]`–`[0.3em]`,
  `text-ink-faint`, small (`text-[10px]`/`text-xs`).
- Prefer lowercase, command-style microcopy for labels
  (e.g. `leaderboard --top 5`, `stats --summary`).

## Terminal chrome (signature elements)
Reuse these to keep the aesthetic cohesive:

- **Window frame:** use the `TerminalWindow.astro` component for any boxed
  section. It renders the title bar + three traffic-light dots. Pass a
  file/command-style `title` (e.g. `~/tasks/week-04.md`).
- **Traffic lights:** three `h-3 w-3 rounded-full` dots in
  `bg-dot-red/amber/green`, marked `aria-hidden`.
- **Prompt marker:** `.prompt` class prefixes an element with a green `$ `.
  Inline, write literal `$` / `>` / `//` spans in `text-acid` / `text-cyan`.
- **Blinking caret:** `.caret` class appends a blinking block cursor after
  live/dynamic text.
- **Scanlines + grid:** applied globally via `body` and `body::before` — do
  not re-add per component.
- **Glow:** `.text-glow` (green) / `.text-glow-magenta` for hero/feature
  headings only, not body text.

## Helper utility classes (in global.css)
`.prompt`, `.text-glow`, `.text-glow-magenta`, `.caret`, `.live-dot`. Add new
cross-cutting effects here as classes rather than repeating raw CSS in
components.

## Status colour mapping (keep consistent everywhere)
- `live` → amber (+ pulsing `.live-dot`).
- `completed` → acid green.
- `upcoming`/locked → `ink-faint` on neutral panel.
- Never rely on colour alone — always pair with a text label or icon
  (medals, `●`, "LIVE", "LOCKED").

## Buttons (shared string pattern)
Define button classes as local `const` strings in the page frontmatter and
reuse them (see `index.astro` `btnPrimary` / `btnGhost`):
- Primary: `border border-acid bg-acid/10 text-acid` → hover
  `bg-acid text-term-bg`, bold + `tracking-widest`.
- Ghost: `border border-grid text-ink-dim` → hover `border-ink-faint text-ink`.

## Motion
- Subtle only. Allowed: caret blink, `live-dot` pulse, `transition-colors`
  hover on cards/links/buttons. Avoid large/entrance animations.
- Every animation **must** be disabled under
  `@media (prefers-reduced-motion: reduce)` (already handled for the shared
  helpers in `global.css`; extend that block for anything new).

## Layout rhythm
- Page container: `mx-auto max-w-6xl px-4 sm:px-6`.
- Vertical section spacing: `mt-14` between major homepage sections.
- Rounded corners `rounded-md`/`rounded-lg`/`rounded-xl`; 1px `border-grid`
  borders; optional soft green shadow on feature windows.

## Do / Don't
- ✅ Use tokens, monospace, terminal chrome, lowercase command microcopy.
- ✅ Keep contrast high and label every status in text.
- ❌ No raw hex, no non-mono fonts, no gradients-as-decoration beyond the
  established background, no heavy animation, no emoji-only status.
