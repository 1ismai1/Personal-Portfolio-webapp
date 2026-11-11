# Ismail Ahmed's portfolio

A firmware and embedded-hardware portfolio built with Next.js 15, React 19, TypeScript and Tailwind CSS. Case studies use the shared server-rendered kit. The three.js / React Three Fiber board replay loads on scroll.

## Run locally

- `npm ci` installs the locked dependencies.
- `npm run dev` starts the local preview at http://localhost:3000.
- `npx tsc --noEmit` checks TypeScript.
- `npm run build` creates the production build; `npm start` serves it.
- `npm run data` rebuilds the measured JSON from the raw CSV logs.

The build downloads Google Fonts through next/font. See `CLAUDE.md` for design rules and `HANDOFF.md` for the original finish checklist. Work stays on `redesign-fable` until Ismail authorizes a merge or deployment.

## Structure

- `content/projects.ts`: project descriptions, facts, images and repository links.
- `app/projects/[slug]/`: project routes, metadata and body registration.
- `components/kit/`: sections, figures, measured stats, bug cards and capture viewer.
- `components/home/`: hero, project cards, skills, timing and endurance evidence.
- `components/replay/`: deferred board rendering, replay controls and part hotspots.
- `data/`: raw CSV logs. `assets-src/`: original assets. Neither is served.
- `public/`: web images, model and generated log data.

## Replace motion data

Replace `data/LOG_MOTION.CSV`, preserving the columns `ms,ax,ay,az,gx,gy,gz,roll_x100,pitch_x100`, then run `npm run data`. Commit the generated `public/data/motion.json`. The printed `refilterMeanAbsErrDeg` should be about 0.01. If it changes substantially, check `ACC_LSB_PER_G`, `ACC_OFFSET_G`, `GYRO_LSB_PER_DPS` and `FILTER_GAIN` in `scripts/build-data.mjs` against `filter_task` in the firmware's `Core/Src/main.c`. Update the home-page duration in `app/page.tsx` to match the printed `durationS`.

## Replace endurance data

Replace `data/LOG_30MIN.CSV`, run `npm run data`, and commit `public/data/endurance.json`. `ProofStrip` shows measured interruptions and hides the recovery panel for a log without gaps. Describe the cause of a new interruption only when it is known; the current sensor-unplug story belongs to the supplied experiment.

## Replace the board or photos

Replace `public/models/imu-shield.glb` with an Altium STEP export converted to GLB: Z up and millimetres scaled to metres. The current model is about 314 kB. If a new model exceeds about 3 MB, optimize it with `npx @gltf-transform/cli optimize in.glb out.glb --compress meshopt` and keep the original in `assets-src/`. If the board changes, update `BOARD` in `components/replay/BoardView.tsx` and the part centers/sizes in `components/replay/shared.ts` (millimetres from the board's bottom-left corner).

Photo originals go in `assets-src/`; web copies go in `public/`, maximum 2000 pixels wide. Supply actual pixel dimensions to `Figure` and `CaptureViewer`. Keep small course-project images at their native size. Video files use `preload="none"`; add genuine poster stills when available.

## Visual checks

With the preview on port 3000, run `node scripts/shots.mjs . 390 "temporary screenshots" home-mobile` and repeat at 1440 pixels. Replace `.` with `projects/imu-logger` or another project path. Inspect all six project pages, keyboard focus and capture zoom. Check the animated hero and WebGL replay in a normal browser too. Use a production build for Lighthouse mobile checks.

## Content still needed

- Clock-capture PNG, resume PDF and video poster stills.
- Engineering-notebook bug details: symptom, cause, fix and lesson.
- Confirmation of physical sensor-axis mapping and timing-diagram widths. GPA stays off unless requested.
- OTA receiver protocol sign-off and hardware transfer results before describing the entire update path as hardware-verified.
