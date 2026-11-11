// Screenshot helper for design review. Start the dev server first (npm run dev).
//   node scripts/shots.mjs <path> <width> <outDir> [label]   (path without a leading slash; use . for home)
// e.g. node scripts/shots.mjs . 390 "temporary screenshots" home-mobile
// Captures the full page at the given width and slices it into ~1300px-tall
// tiles (label-1.jpg, label-2.jpg, ...) so each one can be looked at closely.
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const [path = '/', widthArg = '1440', outDir = 'temporary screenshots', label = 'shot'] = process.argv.slice(2)
const width = Number(widthArg)
const exe = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
].find(existsSync)
if (!exe) { console.error('No Chrome/Edge found'); process.exit(1) }
mkdirSync(outDir, { recursive: true })

const browser = await puppeteer.launch({ executablePath: exe, headless: true, args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'] })
try {
  const page = await browser.newPage()
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(String(e)))
  await page.setViewport({ width, height: width < 600 ? 844 : 900, deviceScaleFactor: 1, isMobile: width < 600 })
  await page.goto('http://localhost:3000/' + path.replace(/^[./]+/, ''), { waitUntil: 'networkidle0', timeout: 60000 })
  // Walk the page so lazy sections (replay, images) load, then wait for the hero animation.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) { scrollTo(0, y); await new Promise(r => setTimeout(r, 250)) }
    scrollTo(0, 0)
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'))
  })
  await new Promise(r => setTimeout(r, 3000))
  const buf = await page.screenshot({ fullPage: true, type: 'png' })
  const meta = await sharp(buf).metadata()
  const TILE = 1300
  const n = Math.ceil(meta.height / TILE)
  for (let i = 0; i < n; i++) {
    const h = Math.min(TILE, meta.height - i * TILE)
    await sharp(buf).extract({ left: 0, top: i * TILE, width: meta.width, height: h }).jpeg({ quality: 80 }).toFile(join(outDir, `${label}-${i + 1}.jpg`))
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)
  console.log(`${label}: ${meta.width}x${meta.height}, ${n} tiles, horizontal overflow ${overflow}px`)
  if (errors.length) console.log('console errors:\n' + [...new Set(errors)].slice(0, 8).join('\n'))
} finally {
  await browser.close()
}
