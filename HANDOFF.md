# HANDOFF: finishing the redesign

## Motion update, November 11, 2026

Added the four requested entrances: a signal sweep when Embedded work enters view, plus waveform, board-layer, and packet sequences for IMU Logger, Sensor Shield, and OTA. Graphics finish and fade away; reduced motion disables all four. No new dependencies. Converted the hero's internal anchors to Next Link after reproducing a null-history-state Back-button failure. Production browser checks pass at 390/1440, including Back, direct navigation, reduced motion, no-JavaScript content, overflow and runtime errors. TypeScript/build pass; home initial JavaScript is now 119 kB. Details and repeatable browser check: docs/superpowers/plans/2026-11-11-project-motion.md and scripts/check-motion.mjs.

## Completion update, November 11, 2026

Implemented the content pass and clock section; Ismail confirmed all four task descriptions. Ported all four case studies and removed old components/CSS. Expanded OTA using the repository Ismail supplied: `ronitbhanot4/stm32-ota-bootloader` (format, sender and 23 tests checked at `18ee3f0`). Receiver protocol remains a draft; hardware verification is stated only for the bootloader jump.

Added social metadata, 1200x630 sharing artwork and favicon. Removed unused Supabase, obsolete standalone files and five byte-identical image duplicates. Documented data/model replacement. ProofStrip now handles zero/multiple gaps and unavailable averages; controls meet the 44px height rule and the capture dialog is labelled. Small project photos use the generated sharing image as a social fallback.

Verification: TypeScript and production build pass. Home initial JavaScript remains 118 kB. All seven routes checked at 390 and 1440 px for overflow, image alternatives, broken images and nested controls. Capture keyboard focus returns correctly; reduced-motion home decodes immediately and replay stays paused. Final Lighthouse mobile: home performance 96 / accessibility 100; IMU Logger performance 100 / accessibility 100. All 14 page/viewport automated accessibility scans pass.

Still requires Ismail: engineering-notebook bug details, clock PNG, resume PDF, video posters, real-board axis confirmation and measured timing widths (currently disclosed as illustrative). GPA remains absent. The font system remains next/font. Full physical-axis validation and exhaustive manual keyboard testing remain open. Original checklist below is retained as the specification, not an indication that completed work needs repeating.

Branch: `redesign-fable`. Do not merge to main and do not deploy until Ismail says so.

The design system, architecture and the three signature pieces are done. What is left is content and polish. **No design judgment is needed:** every task names the file, the change, the component to use and how to check it. Read `CLAUDE.md` first for the stack and design rules.

## Ground rules

- **The resume (bottom of this file) is the source of truth.** Never invent a metric. If a number is not in the resume, the firmware repo, or `public/data/*.json`, write `TODO(ismail)` in a code comment and list it in your summary. Do not show TODO text on the page.
- Use only the tokens in `tailwind.config.ts` (`mask`, `silk`, `phos`, `trace`, `fault`, `line`). The default Tailwind palette is removed on purpose.
- Build case studies only from the kit in `components/kit/`. Reference example: `components/case-studies/IMULogger.tsx`.
- Copy style: plain words, sentence case, active voice, no em dashes, no all-caps labels.
- After every task: `npx tsc --noEmit`, then `npm run build`. Commit each task separately.
- To look at a page: `npm run dev`, then `node scripts/shots.mjs <path> <width> "temporary screenshots" <label>` (path has no leading slash; `.` is home). Check 390 and 1440. The headless capture freezes animations and WebGL mid-way, so the hero trace and the 3D board can look unfinished in those files; check those two in a real browser.

## Kit cheat sheet

| Need | Use | Import from |
|---|---|---|
| Section with heading | `<Section refId="TP3" label="DMA" title="...">` | `@/components/kit` |
| Row of numbers | `<StatRow stats={[{ value, unit, label }]} />` | `@/components/kit` |
| A bug story | `<BugCard title tag symptom cause fix lesson proof? />` | `@/components/kit` |
| Photo or render | `<Figure src alt width height caption />` | `@/components/kit` |
| Logic-analyzer capture, schematic | `<CaptureViewer src alt width height caption />` | `@/components/kit/CaptureViewer` |
| Status pill | `<StatusBadge tone="ok" \| "live" \| "neutral">` | `@/components/kit` |

`width` and `height` must be the real pixel size of the file. Get them with:
`node -e "require('sharp')(process.argv[1]).metadata().then(m=>console.log(m.width,m.height))" public/path/to/file.png`

---

## Task 1: content pass against the resume

Most card and header copy already matches the resume because it was rewritten in `content/projects.ts`. Verify and fix what remains.

- [ ] **`content/projects.ts`**: read every `summary`, `lead`, `sub`, `stats` and `stack` against the resume. Known-correct already: 4 FreeRTOS tasks, DMA ping-pong buffers, 1.5 ms, 20+ faults, shield "Assembled and tested", 3 pin conflicts, 0 V. Fix anything else you find. **Check:** `grep -rn "3 FreeRTOS\|three tasks\|Three steps\|in fabrication\|3.9/4.0\|no HAL" app components content` returns nothing outside `components/legacy/`.
- [ ] **`components/legacy/IMUShieldCaseStudy.tsx`**: this still has the old "in fabrication / ordered Oct 14" story. It is replaced in Task 2a; do not patch it, port it.
- [ ] **`components/home/Hero.tsx`**: the second paragraph says "Level 2". Add the GPA only if Ismail confirms he wants it on the site: resume says **11.5/12**; the old site said 3.9/4.0. Do not show either without asking. **Check:** no GPA string on the home page unless confirmed.
- [ ] **`components/home/Skills.tsx`**: compare each row with the resume's "Technical skills". It was typed from the resume; confirm nothing was dropped. **Check:** six rows, same items as the resume.
- [ ] **`components/case-studies/IMULogger.tsx`**, the `tasks` table: task names and priorities come from `Core/Src/main.c` in the firmware repo (`imu` High, `filter` AboveNormal, `sd` BelowNormal, `sdw` Low). The "Job" sentences are a reading of the code. Ask Ismail to confirm the four job descriptions. **Check:** Ismail has read the table.
- [ ] **`components/case-studies/IMULogger.tsx`**, add a `<Section refId="TP7" label="Clock" title="...">` covering "traced a 1.5% clock error to the internal RC oscillator and cut it to under 0.06%". Two or three sentences from the resume only. If Ismail has the clock capture (`04b_clock_hse_20_periods` exists in the firmware repo under `docs/captures/` as a PulseView session, not an image), ask him to export a PNG to `public/imu-logger/clock-hse.png` and show it with `CaptureViewer`. **Check:** section renders; no invented numbers.
- [ ] **Unplug duration wording.** The resume says the sensor was unplugged "for 15 s". The log on the site measures **25.3 s** and the site shows 25.3 s. Do not change the site number. Leave resume wording to Ismail (already flagged to him).

## Task 2: port the four legacy case studies onto the kit

For each: create `components/case-studies/<Name>.tsx` using only kit components, keep the existing facts and images, register it in `app/projects/[slug]/bodies.tsx` in place of the legacy import, then delete the legacy file. Structure to copy: `components/case-studies/IMULogger.tsx` (outer `<div className="wrap pb-8">`, an optional lead `<Figure>`, then `<Section>` blocks with `refId` TP1, TP2, ...).

Mapping from old markup to kit:

| Old | New |
|---|---|
| `.refl-step` with `.refl-step-num` + `.refl-step-q` | `<Section label={num text} title={q text}>` |
| `.imu-stats` / `.imu-stat` | `<StatRow>` (or put the numbers in `stats` in `content/projects.ts`) |
| `.imu-bug` definition list, "What happened / How I found it / The fix / Lesson" | `<BugCard>`: What happened -> `symptom`, How I found it + cause -> `cause`, The fix -> `fix`, Lesson -> `lesson`, Proof -> `proof` |
| legacy `<Figure>` (captures, schematic) | `<CaptureViewer>` |
| `<Image>` photos in `.refl-device-img` | `<Figure>` |
| `.pin-table` | a `<table>` styled like the task table in `IMULogger.tsx` |
| `.ttag` / `.pbadge` | `<span className="chip">` / `<StatusBadge>` |
| `<Reveal>` wrappers | delete them (the new design has no scroll-reveal) |
| `<video>` in Disillusionary Tale | keep `<video controls preload="none">` inside a `<figure className="my-6">` with `className="w-full rounded border border-line"` and a `<figcaption className="mt-3 text-xs text-silk-3">` |

- [ ] **2a. Sensor Shield** (`components/legacy/IMUShieldCaseStudy.tsx` -> `components/case-studies/SensorShield.tsx`, slug `imu-shield`). Rewrite status content from the resume: assembled and tested; 3 pin conflicts caught before power-on; logged 30 min with zero dropped samples; SD power switch measured 0 V when off (previously needed a USB unplug); push-pull socket that vibration cannot eject; zero electrical rule violations; 2-layer, 68.6 x 53.3 mm. Remove every "in fabrication / ordered" sentence. Lead figure: `<Figure src="/imu-shield/shield-on-nucleo.jpg" width={2000} height={1532} priority .../>`. Board renders (`board-top.png`, `board-bottom.png`) with `Figure`; `schematic.png` with `CaptureViewer`. Add `<ProofStrip />` (from `@/components/home/ProofStrip`) in a "Bring-up" section: that log was recorded on this board. Add `<Replay />` (from `@/components/replay/Replay`) in a "The board in 3D" section. Keep the pin table. **Check:** `/projects/imu-shield` has no "fabrication" text; build passes.
- [ ] **2b. Exo Arm** (`ExoArmCaseStudy.tsx` -> `ExoArm.tsx`, slug `exo-arm`). Straight port, facts unchanged. The charts in `.refl-charts` are inline SVG: keep the SVG, wrap each in `<figure className="panel p-5">`, and replace old colour variables with tokens (`var(--phos)`, `var(--trace)`, `var(--silk-3)`).
- [ ] **2c. Q-Arm End Effector** (`EndEffectorCaseStudy.tsx` -> `EndEffector.tsx`, slug `end-effector`). Straight port. Images `End-Effector-CAD.png` (249x155) and `End-Effector-Sketch.png` are small: render them in a `max-w-[420px]` wrapper so they are not upscaled.
- [ ] **2d. Disillusionary Tale** (`DisillusionaryTaleCaseStudy.tsx` -> `DisillusionaryTale.tsx`, slug `disillusionary-tale`). Straight port. The two MP4s are 16 MB each: keep `preload="none"` and add a `poster` if Ismail supplies stills.
- [ ] **2e. Remove legacy CSS.** When 2a to 2d are done: delete `components/legacy/`, delete `app/legacy.css`, remove the `@import './legacy.css';` line and the "Legacy aliases" block from `app/globals.css`. **Check:** `grep -rn "legacy\|refl-\|imu-fig\|var(--txt\|var(--bg" app components` returns nothing; build passes; all six project pages look right at 390 and 1440.

## Task 3: fill out the OTA case study

File: `components/case-studies/OTAUpdate.tsx` (stub, facts from the resume only).

- [ ] Ask Ismail for: the repo URL (add as `repo` in `content/projects.ts`), a block diagram or photo, the image header layout (field names and sizes), chunk size, and one or two bugs.
- [ ] Add sections with `Section`: "Image format" (table of header fields), "Transfer protocol" (chunk, ACK, retry), "Testing" (what the 23 tests cover), "Bootloader" (vector-table check, VTOR relocation, jump). Use `BugCard` for bugs.
- [ ] `components/home/PacketArt.tsx` is an illustrative diagram used as the card image. Once the real header layout is known, make its field boxes match, or replace it by adding an `image` to the project in `content/projects.ts` (the card then uses the image automatically).
- **Check:** every number on `/projects/ota-update` appears in the resume or was given by Ismail.

## Task 4: bug cards from the engineering notebook

Ismail will paste bugs. For each bug add one `<BugCard>`:

- IMU firmware bugs -> `components/case-studies/IMULogger.tsx`, inside the "Fault recovery" section (TP5), after the existing card. If there are more than three, add a new `<Section refId="TP8" label="Debug log" title="Bugs worth remembering">`.
- Board bugs (for example the 3 pin conflicts) -> the Sensor Shield case study.
- Known from the resume and worth a card each once Ismail supplies details: the I2C lockup caused by a chip erratum; the 1.5% clock error; an SD card that locked up until power-cycled.
- Fill `symptom`, `cause`, `fix`, `lesson` in Ismail's words, tightened. `tag` is the bus or area ("I2C", "SPI", "Clock", "Power"). Put any measurement in `proof`.
- **Check:** each card has all four fields; no field is invented.

## Task 5: SEO, meta and footer

- [ ] **`app/layout.tsx`** `metadata`: confirm `title` and `description`; add `openGraph` (`title`, `description`, `url`, `siteName`, `type: 'website'`) and `twitter: { card: 'summary_large_image' }`.
- [ ] **Open Graph image:** add `app/opengraph-image.tsx` using `ImageResponse` from `next/og`, 1200x630: background `#0A1312`, "ISMAIL AHMED" in bold white, one line "Firmware and embedded hardware. Summer 2027 co-op." and the "-1.5 ms" stat in `#F5B546`. **Check:** `http://localhost:3000/opengraph-image` returns a PNG.
- [ ] **`app/projects/[slug]/page.tsx`** `generateMetadata`: add `openGraph: { title, description, images: p.image ? [p.image.src] : undefined }`.
- [ ] **Empty `next-size-adjust` meta tag:** Next.js emits `<meta name="next-size-adjust" content="">` whenever `next/font` is used; it is harmless. If Ismail still wants it gone, the only way is to self-host the three fonts with `@font-face` in `app/globals.css` instead of `next/font/google`. Ask before doing this; it costs the automatic fallback-font sizing.
- [ ] **Favicon:** add `app/icon.svg`: a 32x32 dark square (`#0A1312`) with the test-point ring (`#F5B546` circle, dark centre).
- [ ] **`components/Footer.tsx`:** confirm the three contact links work. Add a "Resume (PDF)" row if Ismail supplies `public/Ismail-Ahmed-Resume.pdf`. The 404 in the dev console is the missing favicon; it goes away with the icon above.
- [ ] **`app/README.md` and `README.md`:** replace with a short description of the stack, `npm run dev`, `npm run data`, and a pointer to `CLAUDE.md`.
- [ ] **Cleanup:** delete `index.html`, `serve.mjs`, `screenshot.mjs` (replaced by `scripts/shots.mjs`), `brand_assets/` duplicates that already exist in `public/`, and `utils/supabase` plus the `@supabase/*` dependencies and `middleware.ts` if `grep -rn supabase app components` shows nothing uses them. Add `tsconfig.tsbuildinfo` and `temporary screenshots/` to `.gitignore`.

## Task 6: swapping in new data or a new model

Write this up in `README.md` as well.

- **New motion log:** replace `data/LOG_MOTION.CSV` (same columns: `ms,ax,ay,az,gx,gy,gz,roll_x100,pitch_x100`), run `npm run data`, commit the changed `public/data/motion.json`. The script prints `refilterMeanAbsErrDeg`: it re-runs the firmware's filter on the raw columns and compares with the logged angles. It should be about 0.01. If it is large, the firmware constants changed: update `ACC_LSB_PER_G`, `ACC_OFFSET_G`, `GYRO_LSB_PER_DPS`, `FILTER_GAIN` at the top of `scripts/build-data.mjs` from `filter_task` in the firmware's `Core/Src/main.c`. Then update "48.9 seconds" in `app/page.tsx` to the printed `durationS`.
- **New endurance log:** replace `data/LOG_30MIN.CSV`, run `npm run data`. `components/home/ProofStrip.tsx` reads `public/data/endurance.json` at build time and assumes exactly one gap (`e.gaps[0]`). If the new log has zero gaps or several, the strip needs a small change: guard `gap` and hide the right-hand panel when `e.gaps.length === 0`.
- **New GLB:** replace `public/models/imu-shield.glb` (Altium: export STEP, convert to GLB, Z up, millimetres scaled to metres as now). It is 314 kB, so no compression was needed; if a new export is over about 3 MB run `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt` and keep the original in `assets-src/`. If the board outline or part placement changed, update `BOARD` in `components/replay/BoardView.tsx` and the `center`/`size` values (millimetres from the board's bottom-left corner) in `PARTS` in `components/replay/shared.ts`.
- **Photos:** originals go in `assets-src/` (not served); web copies go in `public/`, max 2000 px wide JPEG.

## Task 7: final accessibility and performance check

- [ ] Keyboard only, home page: Tab reaches skip link, nav, hero buttons, replay Play/scrubber/speed/mode/part buttons, timing toggle and each timing segment, every card title, footer links. Focus ring (amber outline) is visible on each. **Check:** nothing is skipped or trapped.
- [ ] Capture viewer: Enter opens, Tab reaches 1x/2x/4x and Close, Esc closes, focus returns to the capture.
- [ ] Turn on "reduce motion" in the OS: the hero shows the decoded name immediately, the replay does not autoplay.
- [ ] `document.querySelectorAll('a a, button a, a button').length` is 0 on every page.
- [ ] Every `<Image>`/`<img>` has meaningful `alt`.
- [ ] Lighthouse mobile on the production build (`npm run build && npm start`, then Chrome DevTools > Lighthouse > Mobile) for `/` and `/projects/imu-logger`. Target: Performance >= 90, Accessibility >= 95. It has **not** been run yet. If Performance is under 90, the likely cause is the replay loading early: raise the bar for loading in `components/replay/Replay.tsx` (change `rootMargin: '200px 0px'` to `'0px'`).
- [ ] Contrast: `text-silk-3` (#7C8B83) on `bg-mask-900` is about 5:1; do not use it on `bg-mask-600` or lighter.

## Things only Ismail can provide

1. Confirmation of the sensor axis mapping in the replay (see summary): does tilting the real board right tilt the model right?
2. Engineering-notebook bugs (Task 4), OTA details and repo URL (Task 3).
3. GPA: show 11.5/12 or leave it off?
4. Measured widths for the "start DMA" and "filter" segments in the timing diagram, or approval to keep them marked "not to scale" (`components/home/TimingDiagram.tsx`, `TODO(ismail)`).
5. Resume PDF, clock capture PNG, video poster stills, a photo for the OTA card.

## Resume (source of truth)

Ismail Ahmed. Oakville, ON. github.com/1ismai1. personal-portfolio-webapp.vercel.app

Computer Engineering co-op student seeking a firmware engineering internship. Available full-time and on-site for Summer 2027 (May to August). Writes real-time embedded C firmware, register-level device drivers and RTOS architecture on STM32, designs PCBs in Altium, and debugs I2C and SPI interfaces with a logic analyzer.

**Education:** McMaster University, Hamilton, ON. B.Eng. Computer Engineering (Co-op), Level 2. Expected April 2029.
- First-year GPA: 11.5/12
- Coursework: Verilog/FPGA design, circuits and electromagnetism, power electronics fundamentals, multivariable calculus, ODEs, engineering design

**IMU Logger, Real-Time Firmware** (C, STM32, FreeRTOS, DMA). github.com/1ismai1/imu-logger-stm32
- Wrote register-level device drivers in C for GPIO, UART, I2C (100 kHz), SPI (10.5 MHz) and timers on an 84 MHz Cortex-M4, plus a custom SPI disk driver for FatFS; logs 100 Hz IMU data to an SD card
- Designed the firmware as four prioritized FreeRTOS tasks joined by queues and interrupt-driven notifications, so storage never delays sampling; a logic analyzer showed a sensor read firing on time during a 10.6 ms SD save
- Sized every task stack from measured high-water marks, freeing 3.5 KB of RAM, and enabled stack-overflow checking so a fault halts and names the task instead of silently corrupting memory
- Moved sensor reads and SD writes to DMA with ping-pong buffers, eliminating 1.5 ms of CPU busy-waiting per 10 ms sampling interval (measured on a logic analyzer), freeing ~15% of each sampling period; sustains ~5.1 KB/s with zero dropped samples or SD errors
- Debugged 20+ hardware and firmware faults across I2C and SPI, including an I2C lockup from a chip erratum; separately, traced a 1.5% clock error to the internal RC oscillator and cut it to under 0.06%
- Built in fault recovery and verified it with fault-injection tests: every bus wait is time-bounded, logging resumed in the same file after the sensor was unplugged for 15 s or power-cycled, and a power cut loses about 1 s of data

**Sensor Shield PCB** (Altium Designer, JLCPCB), assembled and tested. github.com/1ismai1/imu-logger-shield
- Designed a 2-layer, 68.6 x 53.3 mm shield for the NUCLEO-F411RE carrying the MPU-6050, a XIAO ESP32-C3 radio and a microSD socket; passed design-rule checks with zero electrical violations
- Defined the hardware/software interface: assigned every STM32 pin across I2C, SPI, USART, ADC and GPIO without DMA-stream conflicts, and added SD power enable, card detect, battery sensing and debug test points
- Designed in fixes for breadboard failures: a GPIO-switched 3.3 V regulator lets firmware power-cycle a locked SD card (measured 0 V when off; previously needed a USB unplug) and a push-pull socket that vibration can't eject
- Brought up the board, caught 3 pin conflicts before power-on, and logged 30 min with zero dropped samples

**OTA Firmware Update System for STM32** (Python, C, team of 2), in progress
- Built the Python host tools: a packager that wraps each build in a versioned, CRC-32-checked image, and a sender that streams it over UART in acknowledged chunks; 23 tests cover lost ACKs and corrupted data
- Wrote the bootloader's jump-to-app logic (vector-table check, VTOR relocation), verified on hardware; next: watchdog rollback, digital signatures, and a Go server for Wi-Fi updates via an ESP32-C3

**Technical skills**
- Languages: C/C++, Python, Verilog
- Embedded firmware: real-time C, device drivers, FreeRTOS, DMA, interrupts, timers, FatFS
- Protocols: I2C, SPI, UART, SD card (SPI mode)
- Hardware: STM32 (Cortex-M4), ESP32, Altium Designer, KiCad, soldering and rework
- Debug and validation: logic analyzer with I2C/SPI decoding (PulseView), fault-injection tests, SPI loopback and block read-back tests, stack high-water-mark analysis, Python log analysis
- Tools: STM32CubeIDE, STM32CubeMX, Git/GitHub, Quartus
