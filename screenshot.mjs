import puppeteer from 'puppeteer-core';
import { mkdir, readdir } from 'fs/promises';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';

const CHROME_PATHS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
];

const executablePath = CHROME_PATHS.find(p => existsSync(p));
if (!executablePath) {
  console.error('No local Chrome/Edge install found. Checked:\n' + CHROME_PATHS.join('\n'));
  process.exit(1);
}

const url = process.argv[2];
const label = process.argv[3];

if (!url) {
  console.error('Usage: node screenshot.mjs <url> [label]');
  process.exit(1);
}
if (!/^https?:\/\/localhost(:\d+)?\//.test(url) && !/^https?:\/\/localhost(:\d+)?$/.test(url)) {
  console.error('Refusing to screenshot a non-localhost URL. Serve the site locally first (see CLAUDE.md).');
  process.exit(1);
}

const outDir = new URL('./temporary screenshots/', import.meta.url);
await mkdir(outDir, { recursive: true });

const existing = await readdir(outDir);
const nums = existing
  .map(f => f.match(/^screenshot-(\d+)/))
  .filter(Boolean)
  .map(m => parseInt(m[1], 10));
const next = (nums.length ? Math.max(...nums) : 0) + 1;
const fileName = `screenshot-${next}${label ? `-${label}` : ''}.png`;
const outPath = fileURLToPath(new URL(fileName, outDir));

const browser = await puppeteer.launch({ executablePath, headless: true });
try {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });

  // Scroll-reveal animations only trigger once an element enters the
  // viewport (IntersectionObserver), so walk the page top to bottom
  // before capturing, then force every reveal target's end state so
  // the full-page screenshot never catches a mid-animation frame.
  await page.evaluate(async () => {
    const step = window.innerHeight;
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 200));
    }
    document.querySelectorAll('.reveal').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('in');
    });
    window.scrollTo(0, 0);
    await new Promise(r => setTimeout(r, 150));
  });

  await page.screenshot({ path: outPath, fullPage: true });
  console.log(`Saved ${outPath}`);
} finally {
  await browser.close();
}
