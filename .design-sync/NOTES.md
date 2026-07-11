# design-sync notes — ragnar

## Shape: tokens-only (off-script)

`ragnar` is **not** a component library. It is a static, hand-written multi-page
HTML site (Norse "Рагнарёк-AU" TTRPG companion) served from GitHub Pages:

- No `package.json` / lockfile → the converter's install step cannot run.
- No Storybook, no `*.stories.*` → no shape to detect.
- No `dist/`, no bundler, no exported React/JS components → nothing for
  `_ds_bundle.js` to render.

The design system that *does* exist lives entirely in **`theme.css`**: a
Scandinavian "Nord" palette (Polar Night dark / Snow Storm light), plus tokens
for color, motion (easings/durations), radii, and shadows. Shared across the
pages via `app-shell.js` (sets `data-theme` on `<html>`, persists player choice
to localStorage).

So this sync is **tokens + styles + fonts + guidelines only** — no interactive
components, because the repo has none in bindable form. Fabricating React
components from the static pages was explicitly rejected as dishonest (it would
violate "ship what the customer already built").

## Sync anchor

No `_ds_sync.json` is uploaded — the package/storybook hash recipes don't apply
to a hand-authored tokens bundle. Consequence: every re-sync re-derives the
bundle from `theme.css` and re-uploads. That is correct and cheap here.

## Source of truth

`theme.css` is the single source. When it changes, re-run this sync to refresh
`ds-bundle/` and re-upload. The token vocabulary in `.design-sync/conventions.md`
must be kept true to `theme.css`.
