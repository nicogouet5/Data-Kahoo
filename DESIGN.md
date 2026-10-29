# Design System — Data-Kahoo (DataViz Arena · Clase 10 HBDA)

## Aesthetic Direction

- **Persona:** Broadcast Data Desk & Editorial Telemetry Studio (inspired by live sports analytics desks like Opta/F1 telemetry and Financial Times / Observable data workbenches).
- **Tone:** Sharp, authoritative, competitive, and zero-noise—practicing Clase 10's own data-ink principles inside the UI itself (neutral structural base + one deliberate primary signal accent).
- **Operating Dual-Mode:** Built with native CSS `color-scheme` and `light-dark()` tokens to support **Estudio Oscuro** (default carbon-slate broadcast desk) and **Modo Proyector Claro** (high-contrast daylight lecture hall paper).

## Typography

- **Display & Headings (`--font-display`):** `'Bricolage Grotesque'` (weights `600`, `700`, `800`). Expressive editorial geometry that anchors headlines at classroom projection distances without relying on decorative gradients or kickers.
- **Body & Controls (`--font-sans`):** `'Figtree'` (weights `400`, `500`, `600`, `700`). Open apertures and clean legibility for business prompts, buttons, and explanations.
- **Code, DataFrames & Scores (`--font-mono`):** `'JetBrains Mono'` (weights `400`, `500`, `600`) paired with `font-variant-numeric: tabular-nums` on every score counter, index column, and metric readout.
- **Type Scale (5-step ramp, strict `0.75rem` floor):**
  - `--text-xs`: `0.75rem` (12px — technical metadata, `.dtype` tags, keyboard hints)
  - `--text-sm`: `0.875rem` (14px — DataFrame cells, secondary buttons, captions)
  - `--text-base`: `1rem` (16px — primary prose, option copy, form inputs; `max-width: 65ch` on reading blocks)
  - `--text-lg`: `1.25rem` (20px — `h3` subheadings, card titles)
  - `--text-xl`: `1.625rem` (26px — `h2` stage titles)
  - `--text-2xl`: `clamp(1.85rem, 2.8vw, 2.5rem)` (`h1` lobby & case briefing titles; `line-height: 1.12`, `text-wrap: balance`)

## Color Tokens

All neutrals carry a subtle cool-slate tint; pure `#000000` and pure `#808080` are never used.

- **Surfaces (`light-dark`):**
  - `--surface-canvas`: `light-dark(#f3f5f8, #0d1015)`
  - `--surface-1`: `light-dark(#ffffff, #141922)`
  - `--surface-2`: `light-dark(#ebeef4, #1b222e)`
  - `--surface-code`: `#0b0e14` (consistent high-contrast notebook terminal well)
- **Ink (`light-dark`, WCAG AA ≥ 4.5:1 verified):**
  - `--ink-1`: `light-dark(#11161f, #f1f4f9)`
  - `--ink-2`: `light-dark(#323e52, #c1cad8)`
  - `--ink-3`: `light-dark(#516079, #8c99ad)`
- **Borders:**
  - `--border-subtle`: `light-dark(#d5dce6, #252f40)`
  - `--border-strong`: `light-dark(#8896ab, #3d4d66)` (≥ 3:1 control boundary contrast)
- **Semantic Accents:**
  - **Primary Broadcast Gold (`--accent-primary`):** `light-dark(#b45309, #f0b429)` for text/indicators; `#f0b429` fill with `#141108` ink on primary CTAs.
  - **Reference Cobalt (`--accent-info`):** `light-dark(#1d4ed8, #60a5fa)` for Python `fig, ax` inspection and technical badges.
  - **Signal Emerald (`--accent-ok`):** `light-dark(#15803d, #22c55e)` for verified columns and winning Matplotlib versions.
  - **Signal Crimson (`--accent-err`):** `light-dark(#b91c1c, #ef4444)` for `df.drop` columns and misleading charts.

## Layout & Anti-Pattern Guardrails

1. **Zero Cards-in-Cards:** Outer containers use architectural `1px solid` rules and open grid splits rather than nesting elevated cards inside outer cards. Column audits render as a unified ledger matrix.
2. **Zero Side-Tabs or Top-Accents on Rounded Boxes:** Never apply `border-left` or `border-top` ≥ `2px` on rounded elements. Differentiate state via uniform `1px` borders, subtle background washes, and explicit iconography.
3. **Zero Eyebrow Kickers Above Headings:** `<h1>` and `<h2>` open sections directly; stage progress lives in the horizontal stepper bar.
4. **Zero Chromatic Glows or Gradient Text:** Depth comes from subtle neutral offset shadows (`0 8px 24px rgba(0, 0, 0, 0.18)`) and crisp hairline borders—never zero-offset neon halos, radial spotlights, or `background-clip: text`.
5. **Native Top-Layer Overlays:** Modals use semantic `<dialog>` opened with `showModal()`, `closedby="any"` with pointer-coordinate fallback, and `overscroll-behavior: contain`.
