# Design System — Data-Kahoo // ARENA_OS v10.4 (Clase 10 HBDA)

## Aesthetic Direction

- **Persona:** Tactical Hacker Video Game OS & Live Telemetry Terminal (inspired by *Hacknet*, *Cyberpunk Breach Protocol*, and broadcast operations consoles, engineered with `ui-ux-pro-max` + `impeccable` guardrails).
- **Tone:** Immersive terminal authority, crisp phosphor telemetry, chamfered HUD geometry, ASCII art boot sequence, and clean 60fps compositor-thread animations—while keeping Clase 10's Matplotlib charts crystal-clear and pedagogically accurate.
- **Operating Dual-Mode:** Built with native CSS `color-scheme` and `light-dark()` tokens to support **Terminal Hacker Oscuro** (default phosphor-obsidian console) and **Modo Proyector Claro** (high-contrast tactical paper for bright lecture halls).

## Typography

- **Display & HUD Headings (`--font-display`):** `'Chakra Petch'` (weights `600`, `700`). Angular, chamfered sci-fi/hacker game display geometry with full Spanish diacritics (`á, é, í, ó, ú, ñ, ¿, ¡`) and crisp projection legibility.
- **Body & Analytical Prose (`--font-sans`):** `'Figtree'` (weights `400`, `500`, `600`, `700`). Clean open apertures for case contexts, explanations, and options (`max-width: 50ch–58ch`).
- **ASCII Hero, Code, DataFrames & Telemetry (`--font-mono`):** `'JetBrains Mono'` (weights `400`, `500`, `600`, `700`) with `font-variant-numeric: tabular-nums` across boot progress bars, XP scores, `.dtypes`, and Matplotlib scripts.
- **Type Scale (5-step ramp, strict `0.75rem` / `12px` floor — including ASCII art):**
  - `--text-xs`: `0.75rem` (12px — ASCII art blocks, HUD telemetry, `.dtype` tags, `<kbd>` hints)
  - `--text-sm`: `0.875rem` (14px — DataFrame cells, boot log entries, secondary controls)
  - `--text-base`: `1rem` (16px — primary prose, option copy, form inputs)
  - `--text-lg`: `1.25rem` (20px — `h3` card & panel titles)
  - `--text-xl`: `clamp(1.35rem, 2vw, 1.625rem)` (`h2` stage & modal titles)
  - `--text-2xl`: `clamp(1.85rem, 2.8vw, 2.5rem)` (`h1` lobby & mission briefing titles)

## Color Tokens

All neutrals use deep phosphor-tinted obsidian in dark mode and cool tactical paper in light mode (never pure `#000000` or `#808080`, preserving WCAG AA >= 4.5:1 text contrast and >= 3:1 control boundaries):

- **Surfaces (`light-dark`):**
  - `--surface-canvas`: `light-dark(#eef3f0, #070b09)`
  - `--surface-1`: `light-dark(#f9fcfa, #0d1410)`
  - `--surface-2`: `light-dark(#e2ebe6, #131e18)`
  - `--surface-hover`: `light-dark(#d5e2db, #192820)`
  - `--surface-code`: `#080d0b`
- **Ink (`light-dark`, WCAG AA >= 4.5:1 verified):**
  - `--ink-1`: `light-dark(#0c1711, #e8f5ee)`
  - `--ink-2`: `light-dark(#24382d, #b4cbbe)`
  - `--ink-3`: `light-dark(#445e50, #7c9989)`
- **Semantic Hacker Signals:**
  - **Phosphor Matrix Green (`--accent-matrix`):** `#22e566` fill with `#05140a` ink on primary CTAs; `light-dark(#0b6e31, #34f576)` for active terminal readouts and verified states.
  - **Tactical Amber (`--accent-amber`):** `light-dark(#9a5b00, #fbbf24)` for streaks, bonus multipliers, and indicator alerts.
  - **Scanner Cyan-Cobalt (`--accent-info`):** `light-dark(#0369a1, #38bdf8)` for `fig, ax` X-Ray inspection and `.dtype` chips.
  - **Breach Crimson (`--accent-err`):** `light-dark(#b91c1c, #f87171)` for `df.drop` purges and distorted charts.

## Motion & Layout Guardrails

1. **Hero ASCII Boot Sequence:** Interactive terminal loader (`AsciiBootScreen`) with `12px` box-drawing ASCII art, sequential kernel checks, segmented progress bar, instant `[ SALTAR / INICIAR ]` keyboard/click bypass (`Enter` / `Esc`), `sessionStorage` memory, and a top-bar `>_ BOOT` replay trigger.
2. **Modern Web Motion (`modern-web-guidance` + `ui-ux-pro-max`):**
   - SPA state changes wrapped in `document.startViewTransition()` with programmatic focus routing (`tabIndex={-1}`).
   - Entry/exit animations via `@starting-style`, `transition-behavior: allow-discrete`, and `overlay` with `canTransitionDisplay()` / `closeTopLayer()` fallback for `<dialog>`.
   - Strictly compositor-thread properties (`opacity`, `translate`, `scale`, `clip-path`) and case-by-case `@media (prefers-reduced-motion: reduce)` overrides.
3. **Impeccable Structural Discipline:** Zero nested cards, zero `border-left`/`border-top` >= `2px` on rounded elements, zero `gradient-text`, zero neon zero-offset `box-shadow` halos, and zero eyebrow kickers above headings.
