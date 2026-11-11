// Turns the raw logger CSVs in data/ into small JSON files in public/data/.
// Raw logs never ship to the browser. Re-run with:  npm run data
//
// Inputs  (columns: ms,ax,ay,az,gx,gy,gz,roll_x100,pitch_x100)
//   data/LOG_MOTION.CSV  -> public/data/motion.json     (IMU replay)
//   data/LOG_30MIN.CSV   -> public/data/endurance.json  (proof strip)
//
// The constants below mirror the firmware (imu-logger-stm32, Core/Src/main.c,
// filter_task): accel ±8 g = 4096 LSB/g with fixed offsets, gyro ±2000 dps =
// 16.4 LSB/(deg/s), complementary filter gain 0.02 at dt = 10 ms.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const ACC_LSB_PER_G = 4096
const ACC_OFFSET_G = [-0.095, 0.025, 0.22]
const GYRO_LSB_PER_DPS = 16.4
const DT = 0.01
const FILTER_GAIN = 0.02
const GYRO_SAT = 32000 // int16 rail is 32767; bias subtraction moves it slightly
const PERIOD_MS = 10
const GAP_MS = 15 // anything longer than 1.5 periods counts as a gap
const RAD = 180 / Math.PI

function parse(file) {
  const lines = readFileSync(join(root, 'data', file), 'utf8').split(/\r?\n/)
  const rows = []
  let skipped = 0
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) continue
    const p = line.split(',').map(s => s.trim())
    // The logger lost power mid-write, so the last row is cut off. Drop anything malformed.
    if (p.length !== 9 || p.some(v => v === '' || !/^-?\d+$/.test(v))) { skipped++; continue }
    rows.push(p.map(Number))
  }
  return { rows, skipped }
}

const wrap180 = a => (a > 180 ? a - 360 : a < -180 ? a + 360 : a)
const r1 = v => Math.round(v * 10) // degrees x10, integers keep the JSON small

// ───────────────────────── motion.json ─────────────────────────
function buildMotion() {
  const { rows, skipped } = parse('LOG_MOTION.CSV')
  const n = rows.length
  const filt = { r: [], p: [] }, accel = { r: [], p: [] }, gyro = { r: [], p: [] }
  const saturated = []
  let gRoll = 0, gPitch = 0, satStart = -1, badIntervals = 0

  for (let i = 0; i < n; i++) {
    const [ms, ax, ay, az, gx, gy, gz, rx, px] = rows[i]
    if (i && ms - rows[i - 1][0] !== PERIOD_MS) badIntervals++

    // Accel only: gravity direction, same formula as the firmware.
    const axg = ax / ACC_LSB_PER_G + ACC_OFFSET_G[0]
    const ayg = ay / ACC_LSB_PER_G + ACC_OFFSET_G[1]
    const azg = az / ACC_LSB_PER_G + ACC_OFFSET_G[2]
    const aRoll = Math.atan2(ayg, azg) * RAD
    const aPitch = Math.atan2(-axg, Math.hypot(ayg, azg)) * RAD

    // Gyro only: the firmware's integration step with the accel correction removed.
    if (i === 0) { gRoll = aRoll; gPitch = aPitch }
    else {
      gRoll = wrap180(gRoll + (gx / GYRO_LSB_PER_DPS) * DT)
      gPitch = Math.max(-90, Math.min(90, gPitch + (gy / GYRO_LSB_PER_DPS) * DT))
    }

    const sat = Math.abs(gx) >= GYRO_SAT || Math.abs(gy) >= GYRO_SAT || Math.abs(gz) >= GYRO_SAT
    if (sat && satStart < 0) satStart = i
    if (!sat && satStart >= 0) { saturated.push([satStart, i - 1]); satStart = -1 }

    filt.r.push(r1(rx / 100)); filt.p.push(r1(px / 100))
    accel.r.push(r1(aRoll)); accel.p.push(r1(aPitch))
    gyro.r.push(r1(gRoll)); gyro.p.push(r1(gPitch))
  }
  if (satStart >= 0) saturated.push([satStart, n - 1])

  // Sanity check on the firmware constants: replay the full complementary filter
  // from the raw columns and compare with what the firmware logged.
  let a = accel.r[0] / 10, p = accel.p[0] / 10, errSum = 0
  for (let i = 1; i < n; i++) {
    const [, , , , gx, gy] = rows[i]
    const ar = accel.r[i] / 10, ap = accel.p[i] / 10
    a = wrap180(a + (gx / GYRO_LSB_PER_DPS) * DT + FILTER_GAIN * wrap180(ar - a))
    p = Math.max(-90, Math.min(90, p + (gy / GYRO_LSB_PER_DPS) * DT + FILTER_GAIN * (ap - p)))
    errSum += Math.abs(wrap180(a - rows[i][7] / 100))
  }

  const out = {
    meta: {
      source: 'LOG_MOTION.CSV',
      hz: 1000 / PERIOD_MS,
      samples: n,
      durationS: +((rows[n - 1][0] - rows[0][0]) / 1000).toFixed(2),
      skippedRows: skipped,
      irregularIntervals: badIntervals,
      units: 'degrees x10',
      accelLsbPerG: ACC_LSB_PER_G,
      gyroLsbPerDps: GYRO_LSB_PER_DPS,
      gyroSaturatedSamples: saturated.reduce((s, [a0, b0]) => s + b0 - a0 + 1, 0),
      refilterMeanAbsErrDeg: +(errSum / (n - 1)).toFixed(2),
    },
    saturated,
    filt, accel, gyro,
  }
  return out
}

// ───────────────────────── endurance.json ─────────────────────────
function buildEndurance() {
  const { rows, skipped } = parse('LOG_30MIN.CSV')
  const n = rows.length
  const t0 = rows[0][0], t1 = rows[n - 1][0]
  const gaps = []
  const hist = {}
  for (let i = 1; i < n; i++) {
    const d = rows[i][0] - rows[i - 1][0]
    hist[d] = (hist[d] || 0) + 1
    if (d > GAP_MS) gaps.push({ index: i, fromMs: rows[i - 1][0], toMs: rows[i][0], durationMs: d })
  }

  // Continuous stretches between gaps. After a gap the firmware flushes a short
  // backlog (samples 1-2 ms apart); the stretch is measured from the first
  // sample that is back on the 10 ms grid.
  const stretches = []
  let start = 0
  const bounds = [...gaps.map(g => g.index), n]
  for (const end of bounds) {
    let s = start
    while (s + 1 < end && rows[s + 1][0] - rows[s][0] < PERIOD_MS) s++
    const backlog = s - start
    const first = rows[s][0], last = rows[end - 1][0]
    const samples = end - s
    const expected = Math.round((last - first) / PERIOD_MS) + 1
    let worst = 0, sum = 0
    for (let i = s + 1; i < end; i++) { const d = rows[i][0] - rows[i - 1][0]; sum += d; if (d > worst) worst = d }
    stretches.push({
      fromMs: first, toMs: last,
      durationS: +((last - first) / 1000).toFixed(2),
      samples, expectedSamples: expected, droppedSamples: expected - samples,
      backlogSamples: backlog,
      avgIntervalMs: +(sum / (samples - 1)).toFixed(4),
      worstIntervalMs: worst,
    })
    start = end
  }

  // Timeline buckets for the annotated strip + interval sparkline.
  const BUCKET_MS = 5000
  const nb = Math.ceil((t1 - t0 + 1) / BUCKET_MS)
  const buckets = Array.from({ length: nb }, () => ({ c: 0, w: 0, lo: 1e9, hi: -1e9 }))
  for (let i = 0; i < n; i++) {
    const b = buckets[Math.floor((rows[i][0] - t0) / BUCKET_MS)]
    b.c++
    const roll = rows[i][7] / 100
    if (roll < b.lo) b.lo = roll
    if (roll > b.hi) b.hi = roll
    if (i) { const d = rows[i][0] - rows[i - 1][0]; if (d <= GAP_MS && d > b.w) b.w = d }
  }

  const longest = stretches.reduce((a, b) => (b.durationS > a.durationS ? b : a))
  const intervalsOnGrid = hist[PERIOD_MS] || 0
  return {
    meta: { source: 'LOG_30MIN.CSV', periodMs: PERIOD_MS, skippedRows: skipped, bucketMs: BUCKET_MS },
    totalSamples: n,
    startMs: t0, endMs: t1,
    durationS: +((t1 - t0) / 1000).toFixed(2),
    intervalHistogramMs: hist,
    intervalsExactly10ms: intervalsOnGrid,
    intervalsTotal: n - 1,
    gaps,
    stretches,
    longestStretch: longest,
    timeline: {
      count: buckets.map(b => b.c),
      worstIntervalMs: buckets.map(b => b.w),
      rollLo: buckets.map(b => (b.c ? Math.round(b.lo) : null)),
      rollHi: buckets.map(b => (b.c ? Math.round(b.hi) : null)),
    },
  }
}

mkdirSync(join(root, 'public', 'data'), { recursive: true })
const motion = buildMotion()
const endurance = buildEndurance()
writeFileSync(join(root, 'public', 'data', 'motion.json'), JSON.stringify(motion))
writeFileSync(join(root, 'public', 'data', 'endurance.json'), JSON.stringify(endurance))

const kb = f => (readFileSync(join(root, 'public', 'data', f)).length / 1024).toFixed(1) + ' kB'
console.log('motion.json   ', kb('motion.json'), motion.meta)
console.log('endurance.json', kb('endurance.json'))
console.log('  total', endurance.totalSamples, 'samples over', (endurance.durationS / 60).toFixed(1), 'min')
console.log('  gaps', endurance.gaps)
console.log('  stretches', endurance.stretches)
console.log('  interval histogram (ms: count)', endurance.intervalHistogramMs)
