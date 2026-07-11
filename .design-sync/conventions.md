# Ragnarök Design System — how to build with it

This is a **token + CSS-variable** design system (the theme layer of a Norse
TTRPG site). There are **no importable components** — you build layouts with
plain HTML/CSS and style everything through the CSS custom properties below.
Every design you produce should read as calm Scandinavian "Nord": slate
surfaces, frost-steel and aurora-bronze accents, generous radii, flat shadows.

## Setup (required)

Link `styles.css` — it `@import`s `theme.css`, which defines every `--*` token
and loads the fonts. Then set the palette on the root element:

```html
<html data-theme="dark">   <!-- "dark" (Polar Night) is the default; "light" is Snow Storm -->
```

Nothing is styled until an ancestor carries `data-theme`. Both themes define the
**same** variable names, so any `var(--…)` you write works in both.

## The token vocabulary — use these, don't invent colors

- **Surfaces (dark→light order swaps by theme):** `--bg` (page), `--surf`
  (card), `--surf2` (raised/active), `--inset` (wells). Warm variants for
  "chosen/parchment" UI: `--warm`, `--warm2`, `--warm-field`, `--warm-chosen`.
- **Text:** `--ink` (primary), `--muted` (secondary), `--faint` (tertiary/meta).
- **Lines:** `--line`, `--line-soft`, `--line-warm`.
- **Accents:** `--steel` / `--steel-soft` / `--steel-deep` (frost blue — the
  primary/interactive accent, "player"), `--bronze` / `--bronze-deep` (aurora
  gold — secondary, "GM"), `--ember` (warm highlight), `--red` (danger).
- **On-accent text:** `--on-ink`, `--on-steel` (text on filled steel/bronze).
- **Fonts:** `--disp` (Spectral — headings), `--sans` (Inter — body/UI),
  `--mono` (JetBrains Mono — stats/dice/code), `--rune` (Noto Sans Runic).
- **Radii:** `--r-1:8px` `--r-2:10px` `--r-3:14px` `--r-4:18px`.
- **Motion:** `--ease:cubic-bezier(.16,1,.3,1)`, `--dur-1:.14s` (hover/color),
  `--dur-2:.22s` (lift/reveal). Prefer these over ad-hoc easings.
- **Elevation:** `--shadow-1/2/3` (flat, restrained), `--focus` (keyboard ring —
  apply on `:focus-visible`, never remove it).

## Where the truth lives

Read `theme.css` (bound alongside this) before styling — it is the single
source for every token value in both themes, plus ready-made shell/link/toggle
patterns you can borrow.

## Idiomatic snippet

```html
<article style="background:var(--surf); border:1px solid var(--line);
  border-radius:var(--r-3); box-shadow:var(--shadow-2); padding:16px;
  font-family:var(--sans); color:var(--ink);
  transition:border-color var(--dur-1) var(--ease);">
  <h3 style="font-family:var(--disp); color:var(--ink); margin:0 0 6px;">Draugr</h3>
  <p style="color:var(--muted); margin:0;">A restless barrow-wight.</p>
  <span style="font-family:var(--mono); color:var(--bronze);">HP 28 · init 12</span>
</article>
```
