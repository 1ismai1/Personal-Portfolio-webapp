# CLAUDE.md: portfolio site rules

Ismail Ahmed's portfolio. Audience: recruiters who skim for 6 seconds, then engineers who click in and judge depth. Every claim on the site is backed by a capture, a diagram or a measurement.

## Always do first
- Invoke the `frontend-design` skill before writing any frontend code.
- Read `HANDOFF.md` if it still has unchecked tasks.

## Stack
- Next.js 15 (App Router), React 19, TypeScript, Tailwind 3. Deployed on Vercel.
- 3D: `three` + `@react-three/fiber`, loaded only through `next/dynamic` (never import them from a server component or from the home page's first-load path).
- Commands: `npm run dev`, `npm run build`, `npm run data` (rebuilds `public/data/*.json` from `data/*.CSV`).
- Never merge to main or deploy without being asked.

## Map
| Path | What |
|---|---|
| `content/projects.ts` | The one typed project model. Adding a project = adding an object here. |
| `app/projects/[slug]/page.tsx` | One route for all projects; header generated from the model. |
| `app/projects/[slug]/bodies.tsx` | slug -> case-study body component. |
| `components/case-studies/` | Case studies built on the kit. `IMULogger.tsx` is the reference. |
| `components/kit/` | `Section`, `StatRow`, `BugCard`, `Figure`, `StatusBadge`, `CaptureViewer`. |
| `components/home/` | `Hero` (CSS-only I2C decode), `TimingDiagram`, `ProofStrip`, `ProjectCard`, `Skills`. |
| `components/replay/` | IMU replay: `Replay.tsx` (shell, no three.js), `BoardView.tsx` (lazy 3D), `shared.ts` (modes, part hotspots). |
| `scripts/build-data.mjs` | CSV -> JSON. Mirrors the firmware's filter constants. |
| `scripts/shots.mjs` | Tiled full-page screenshots at any width. |
| `data/` | Raw logger CSVs. Never served. |
| `assets-src/` | Original, full-size source images. Never served. |
| `components/legacy/`, `app/legacy.css` | Un-ported case studies. Delete after HANDOFF Task 2. |

## Facts
- The resume (bottom of `HANDOFF.md`) is the source of truth. Never invent a metric. Unknown number -> `TODO(ismail)` in a comment, never on the page.
- Numbers in the proof strip and replay are computed by `npm run data`; do not type them by hand.

## Design system: "the site is a running board"
An instrument bench: logic-analyzer traces, scope screens, silkscreen labels, test points. Subtle and confident, a clean professional portfolio first.

- **Tokens** live in `tailwind.config.ts` and as CSS variables in `app/globals.css`. The default Tailwind palette is removed; use only these.
  - Ground `mask-950/900/800/700/600` (soldermask in shadow). Layers: base `mask-900` -> raised `.panel` (`mask-800`) -> floating `.panel-float` (`mask-700`). Recessed scope screen: `.screen` (`mask-950`).
  - Text `silk` / `silk-2` / `silk-3`.
  - `phos` amber = channel 1 (SDA, roll), primary accent and the only solid button colour.
  - `trace` teal = channel 2 (SCL, pitch), "good/measured".
  - `fault` red = errors, the "before" state, the unplug. Never decorative.
- **Type:** display = Archivo at 125% width, bold, tracking -0.03em (`.display`). Body = IBM Plex Sans, line-height 1.7. Readouts, decode labels and silkscreen refs = IBM Plex Mono (`.ref`, `.chip`, `.ctl`). Scale: `text-2xs` to `text-4xl` in the config; no arbitrary sizes except the two clamp() page titles.
- **Radii:** `rounded-xs` 2px chips, `rounded-sm` 6px controls, `rounded` 10px panels. Nothing pill-shaped.
- **Shadows:** `shadow-raised`, `shadow-floating` (layered, green-tinted). Never `shadow-md`.
- **Motion:** animate only `transform` and `opacity` (colour transitions on hover are fine). Never `transition-all`. Easings `ease-spring`, `ease-out`. One orchestrated load moment (the hero decode); no scroll-reveal. Everything respects `prefers-reduced-motion`.
- **Interactive states:** every clickable element has hover, focus-visible and active. Use `.btn .btn-solid`, `.btn .btn-line`, `.ctl` (with `aria-pressed`), `.link`.
- **Structure labels:** `TPn` test-point refs mark real sections in order; do not add them as decoration. Sentence case everywhere, no all-caps labels, no em dashes in copy, no arrows appended to link text.
- **Images:** always `next/image`. Photos get the mask tint (`bg-mask-600 opacity-20 mix-blend-multiply`) and a bottom gradient; `Figure` does this. Captures go in `CaptureViewer`, untinted.
- **Accessibility:** no nested links (cards use a stretched title link; see `ProjectCard`), 44px minimum targets for buttons, alt text on everything, all interactive pieces keyboard operable, live values announced with `aria-live` or `aria-valuetext`.
- **Performance:** home first-load JS is about 118 kB; keep it there. Anything heavy is lazy and loads on scroll.

## Screenshot workflow
- `npm run dev`, then `node scripts/shots.mjs <path> <width> "temporary screenshots" <label>` (path without a leading slash; `.` is home). Always check 390 and 1440, and do at least two rounds.
- Read the JPEG tiles and be specific about what is off (size, spacing, colour).
- Headless capture freezes CSS animation and WebGL part-way; verify the hero decode and the 3D board in a real browser.
