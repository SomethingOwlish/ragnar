# Token reference

Every value below is a CSS custom property defined in `theme.css`. The **same
names** exist in all themes; only the values change. Select a theme with
`data-theme` on the root element: `dark` (default, Polar Night), `light`
(Snow Storm), or `skog` (Forest).

## Fonts (shared by all themes)

| Token | Value | Use |
|---|---|---|
| `--disp` | Spectral, Georgia, serif | Display / headings |
| `--sans` | Inter, system-ui, sans-serif | Body & UI |
| `--mono` | JetBrains Mono, monospace | Stats, dice, code |
| `--rune` | Noto Sans Runic, Segoe UI Historic, serif | Sigils & flavor |

## Motion, radii (shared)

| Token | Value | Use |
|---|---|---|
| `--ease` | `cubic-bezier(.16,1,.3,1)` | Soft, "expensive" deceleration |
| `--dur-1` | `.14s` | Instant feedback: hover, color |
| `--dur-2` | `.22s` | Visible shift: card lift, reveal |
| `--theme-fade` | bg/border/color .25s ease | Cross-fade on theme switch |
| `--r-1` … `--r-4` | 8px · 10px · 14px · 18px | Corner radius scale |

## Color

| Token | Dark (Polar Night) | Light (Snow Storm) | Skog (Forest) | Role |
|---|---|---|---|---|
| `--bg` | `#22272E` | `#E4E9F0` | `#1C2621` | Page background |
| `--surf` | `#2E3440` | `#F6F8FB` | `#25332C` | Card surface |
| `--surf2` | `#3B4252` | `#ECF0F5` | `#2E3D34` | Raised / active surface |
| `--inset` | `#39414F` | `#E0E6EE` | `#283730` | Inset wells |
| `--warm` | `#302A20` | `#F2ECDD` | `#2C2A1D` | Warm "parchment" surface |
| `--warm2` | `#28231B` | `#EBE3D0` | `#252319` | Warm surface, deeper |
| `--warm-inset` | `#3A3123` | `#E6DCC4` | `#37321F` | Warm inset |
| `--warm-field` | `#2C2619` | `#FAF6EC` | `#2A2817` | Warm input field |
| `--warm-chosen` | `#463A22` | `#F4EAD5` | `#43401F` | Warm selected |
| `--warm-chip` | `#302A20` | `#FAF4E7` | `#2C2A1D` | Warm chip |
| `--line` | `#434C5E` | `#CBD5E1` | `#3C4C41` | Default border |
| `--line-soft` | `#39414F` | `#D9E0EA` | `#31413A` | Subtle border |
| `--line-warm` | `#4E4632` | `#DBC8A2` | `#4A4630` | Warm/GM border |
| `--ink` | `#ECEFF4` | `#2E3440` | `#EAF1E8` | Primary text |
| `--muted` | `#AEB6C4` | `#4C566A` | `#A6B4A4` | Secondary text |
| `--faint` | `#727C8D` | `#7C8698` | `#6B7A69` | Tertiary / meta text |
| `--steel` | `#88C0D0` | `#48709F` | `#8FC9A6` | Primary accent (frost / moss) |
| `--steel-soft` | `#81A1C1` | `#6688B0` | `#79AE92` | Steel, softened |
| `--steel-deep` | `#5E81AC` | `#3A6090` | `#4F8C6C` | Steel, deep |
| `--bronze` | `#E6C583` | `#9C7628` | `#E3C07A` | Secondary accent (aurora / birch) |
| `--bronze-deep` | `#A17E3E` | `#7A5A1C` | `#9C7C3E` | Bronze, deep |
| `--ember` | `#D6926B` | `#BE7B45` | `#D6895B` | Warm highlight |
| `--red` | `#BF616A` | `#A8483F` | `#C56A63` | Danger / error |
| `--choice-on` | `#3B4252` | `#E9F0F7` | `#2E3D34` | Selected choice bg |
| `--on-ink` | `#22272E` | `#FFFFFF` | `#1C2621` | Text on filled steel/bronze |
| `--on-steel` | `#22272E` | `#FFFFFF` | `#152019` | Text on bright steel |
| `--tip-bg` | `#1A1F26` | `#2E3440` | `#141B16` | Tooltip bg |
| `--tip-ink` | `#ECEFF4` | `#ECEFF4` | `#EAF1E8` | Tooltip text |
| `--niche-idle` | `#6E6547` | `#A99B74` | `#5E6B4A` | Idle niche accent |

## Elevation & focus

| Token | Dark | Light | Skog |
|---|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(0,0,0,.28)` | `0 1px 2px rgba(46,52,64,.08)` | `0 1px 2px rgba(0,0,0,.30)` |
| `--shadow-2` | `0 6px 16px -10px rgba(0,0,0,.5)` | `0 8px 20px -12px rgba(46,52,64,.18)` | `0 6px 16px -10px rgba(0,0,0,.52)` |
| `--shadow-3` | `0 14px 30px -16px rgba(0,0,0,.55)` | `0 16px 34px -18px rgba(46,52,64,.20)` | `0 14px 30px -16px rgba(0,0,0,.58)` |
| `--focus` | `…4px var(--steel-soft)` | `…4px var(--steel)` | `…4px var(--steel-soft)` |

Shadows are deliberately flat and restrained ("Scandinavian"). Apply `--focus`
via `:focus-visible` on interactive elements; never strip the keyboard ring.

## Accessibility notes (baked into theme.css)

- Keyboard focus ring is drawn only on `:focus-visible` (mouse clicks stay clean).
- `@media (prefers-reduced-motion: reduce)` collapses all transitions/animations.
- Accent contrast is held at WCAG AA against its surface in every theme.

## The three palettes

- **Polar Night** (dark) — cool slate, frost-steel blue, aurora gold.
- **Snow Storm** (light) — airy blue-white, deep steel, muted gold.
- **Skog** (forest) — evergreen slate with a green shift; moss/lichen replaces
  the frost-steel accent, birch amber and rowan carry the warm accents.
