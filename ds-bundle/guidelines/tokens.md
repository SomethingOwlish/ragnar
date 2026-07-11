# Token reference

Every value below is a CSS custom property defined in `theme.css`. The **same
names** exist in both themes; only the values change. Select a theme with
`data-theme="dark"` (default, Polar Night) or `data-theme="light"` (Snow Storm)
on the root element.

## Fonts (shared by both themes)

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

| Token | Dark (Polar Night) | Light (Snow Storm) | Role |
|---|---|---|---|
| `--bg` | `#22272E` | `#E4E9F0` | Page background |
| `--surf` | `#2E3440` | `#F6F8FB` | Card surface |
| `--surf2` | `#3B4252` | `#ECF0F5` | Raised / active surface |
| `--inset` | `#39414F` | `#E0E6EE` | Inset wells |
| `--warm` | `#302A20` | `#F2ECDD` | Warm "parchment" surface |
| `--warm2` | `#28231B` | `#EBE3D0` | Warm surface, deeper |
| `--warm-inset` | `#3A3123` | `#E6DCC4` | Warm inset |
| `--warm-field` | `#2C2619` | `#FAF6EC` | Warm input field |
| `--warm-chosen` | `#463A22` | `#F4EAD5` | Warm selected |
| `--warm-chip` | `#302A20` | `#FAF4E7` | Warm chip |
| `--line` | `#434C5E` | `#CBD5E1` | Default border |
| `--line-soft` | `#39414F` | `#D9E0EA` | Subtle border |
| `--line-warm` | `#4E4632` | `#DBC8A2` | Warm/GM border |
| `--ink` | `#ECEFF4` | `#2E3440` | Primary text |
| `--muted` | `#AEB6C4` | `#4C566A` | Secondary text |
| `--faint` | `#727C8D` | `#7C8698` | Tertiary / meta text |
| `--steel` | `#88C0D0` | `#48709F` | Primary accent (frost, "player") |
| `--steel-soft` | `#81A1C1` | `#6688B0` | Steel, softened |
| `--steel-deep` | `#5E81AC` | `#3A6090` | Steel, deep |
| `--bronze` | `#E6C583` | `#9C7628` | Secondary accent (aurora, "GM") |
| `--bronze-deep` | `#A17E3E` | `#7A5A1C` | Bronze, deep |
| `--ember` | `#D6926B` | `#BE7B45` | Warm highlight |
| `--red` | `#BF616A` | `#A8483F` | Danger / error |
| `--choice-on` | `#3B4252` | `#E9F0F7` | Selected choice bg |
| `--on-ink` | `#22272E` | `#FFFFFF` | Text on filled steel/bronze |
| `--on-steel` | `#22272E` | `#FFFFFF` | Text on bright steel |
| `--tip-bg` / `--tip-ink` | `#1A1F26` / `#ECEFF4` | `#2E3440` / `#ECEFF4` | Tooltip |
| `--niche-idle` | `#6E6547` | `#A99B74` | Idle niche accent |

## Elevation & focus

| Token | Dark | Light |
|---|---|---|
| `--shadow-1` | `0 1px 2px rgba(0,0,0,.28)` | `0 1px 2px rgba(46,52,64,.08)` |
| `--shadow-2` | `0 6px 16px -10px rgba(0,0,0,.5)` | `0 8px 20px -12px rgba(46,52,64,.18)` |
| `--shadow-3` | `0 14px 30px -16px rgba(0,0,0,.55)` | `0 16px 34px -18px rgba(46,52,64,.20)` |
| `--focus` | `0 0 0 2px var(--bg), 0 0 0 4px var(--steel-soft)` | `0 0 0 2px var(--surf), 0 0 0 4px var(--steel)` |

Shadows are deliberately flat and restrained ("Scandinavian"). Apply `--focus`
via `:focus-visible` on interactive elements; never strip the keyboard ring.

## Accessibility notes (baked into theme.css)

- Keyboard focus ring is drawn only on `:focus-visible` (mouse clicks stay clean).
- `@media (prefers-reduced-motion: reduce)` collapses all transitions/animations.
- Accent contrast is held at WCAG AA against its surface in both themes.
