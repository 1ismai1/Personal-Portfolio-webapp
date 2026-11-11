// Start the site, then: BROWSER_PATH=<Chrome/Edge> node scripts/check-motion.mjs [base URL] [screenshots directory]
import puppeteer from 'puppeteer-core'
import assert from 'node:assert/strict'
import { existsSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const base = process.argv[2] || 'http://localhost:3000'
const output = process.argv[3]
const executablePath = [process.env.BROWSER_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
].find(path => path && existsSync(path))
assert.ok(executablePath, 'Set BROWSER_PATH to an installed Chrome or Edge executable')
if (output) mkdirSync(output, { recursive: true })
const browser = await puppeteer.launch({ executablePath, headless: true })
const entrances = { 'imu-logger': 'logger-open', 'imu-shield': 'shield-open', 'ota-update': 'ota-open' }
try {
  const page = await browser.newPage()
  const errors = []
  page.on('pageerror', error => { errors.push(error.message); console.error('Page error:', error.message) })
  const overflow = async () => assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Page overflows horizontally')
  const freeze = async selector => page.$eval(selector, async el => {
    for (const animation of el.getAnimations({ subtree: true })) {
      animation.pause()
      await animation.ready
      animation.currentTime = 400
    }
    await new Promise(requestAnimationFrame)
  })
  const finish = async selector => page.$eval(selector, el => {
    for (const animation of el.getAnimations({ subtree: true })) {
      if (Number.isFinite(animation.effect.getComputedTiming().endTime)) animation.finish()
      else animation.play()
    }
  })
  for (const width of [390, 1440]) {
    await page.setViewport({ width, height: 900 })
    await page.goto(base, { waitUntil: 'networkidle0' })
    await page.locator('a::-p-text(See the work)').click()
    await page.waitForSelector('.work-arrival[data-arrived]')
    assert.equal(await page.$eval('#work h2', el => getComputedStyle(el).animationName), 'work-heading')
    await freeze('#work')
    await page.$eval('#work', el => el.scrollIntoView({ behavior: 'instant' }))
    if (output) await page.screenshot({ path: join(output, `motion-work-${width}.png`) })
    await finish('#work')
    assert.ok(await page.$eval('.work-signal span', el => Number(getComputedStyle(el).opacity) > 0), 'Work signal must remain visible')
    await overflow()
    for (const [slug, name] of Object.entries(entrances)) {
      await page.locator(`a[href="/projects/${slug}"]`).click()
      await page.waitForFunction(path => location.pathname === path, {}, `/projects/${slug}`)
      await page.waitForSelector(`[data-project-motion="${slug}"]`)
      assert.equal(await page.$eval('.project-header h1', el => getComputedStyle(el).animationName), name)
      await freeze('.project-header')
      if (output) await page.screenshot({ path: join(output, `motion-${slug}-${width}.png`) })
      await finish('.project-header')
      assert.ok(await page.$eval('.project-arrival', el => Number(getComputedStyle(el).opacity) > 0), 'Project graphic must remain visible')
      if (slug === 'ota-update') assert.ok(await page.$$eval('.arrival-packet', els => els.every(el => getComputedStyle(el).opacity === '1' && getComputedStyle(el).transform === 'matrix(1, 0, 0, 1, 0, 0)')), 'OTA packets must settle in place')
      await overflow()
      if (output) await page.screenshot({ path: join(output, `motion-${slug}-${width}-settled.png`) })
      await page.goBack()
      console.log('Back from', slug, 'to', page.url())
      await page.waitForSelector('#work', { timeout: 10000 }).catch(async error => {
        console.error(await page.evaluate(() => ({ url: location.href, historyState: history.state, title: document.title, main: document.querySelector('main')?.innerText.slice(0, 300) })))
        throw error
      })
    }
    console.log(`${width}px: work arrival, all three card clicks, settled states, back navigation and overflow pass`)
  }
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
  for (const slug of Object.keys(entrances)) {
    await page.goto(`${base}/projects/${slug}`, { waitUntil: 'networkidle0' })
    assert.equal(await page.$eval('.project-header h1', el => getComputedStyle(el).animationName), 'none')
    assert.ok(await page.$eval('.project-arrival', el => getComputedStyle(el).display !== 'none' && Number(getComputedStyle(el).opacity) > 0), 'Reduced motion keeps static artwork visible')
  }
  await page.goto(`${base}/#work`, { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('#work h2', el => getComputedStyle(el).animationName), 'none')
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }])
  await page.setJavaScriptEnabled(false)
  await page.goto(`${base}/#work`, { waitUntil: 'networkidle0' })
  assert.equal(await page.$eval('#work h2', el => getComputedStyle(el).opacity), '1')
  assert.equal(await page.$eval('a[href="/projects/imu-logger"]', el => el.getAttribute('href')), '/projects/imu-logger')
  assert.deepEqual(errors, [])
  console.log('Reduced motion, direct project visits, no-JavaScript content and runtime errors pass')
} finally { await browser.close() }
