import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';
import fs from 'node:fs';

const out = path.join(os.tmpdir(), 'opencode', 'screens');
fs.mkdirSync(out, { recursive: true });

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const page = await browser.newPage({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
});
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

const shot = async (name) => {
  const file = path.join(out, name);
  await page.screenshot({ path: file });
  console.log('saved', file);
};

await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
await shot('v2-gift-box.png');

// 10 lần né, lần 11 mở được
const gift = page.locator('button').filter({ hasText: /Mở quà|Mở Thật/ });
let taps = 0;
for (let i = 0; i < 12; i++) {
  const count = await gift.count();
  if (!count) break;
  const label = (await gift.first().textContent())?.trim();
  console.log(`tap ${i + 1}: ${label}`);
  await gift.first().tap({ timeout: 4000 });
  taps++;
  await page.waitForTimeout(260);
}
await page.waitForTimeout(900);
console.log('taps:', taps, 'opened:', await page.getByText('Ú òa! Mở quà thành công!').isVisible().catch(() => false));
await shot('v2-gift-opened.png');

// Photo story reveal
await page.locator('#photo-story-section').scrollIntoViewIfNeeded();
await page.waitForTimeout(900);
await shot('v2-story-top.png');
await page.evaluate(() => window.scrollBy(0, 520));
await page.waitForTimeout(900);
await shot('v2-story-reveal.png');
await page.evaluate(() => window.scrollBy(0, 700));
await page.waitForTimeout(900);
await shot('v2-story-reveal-2.png');

// 20 thẻ mới
await page.getByText('20 Thông Điệp Vui Vẻ & May Mắn').scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
await shot('v2-reasons-top.png');
const cards = page.locator('[aria-label^="Lật thẻ thông điệp"]');
console.log('cards:', await cards.count());
for (let i = 0; i < 20; i++) {
  await cards.nth(i).click({ timeout: 5000 });
  await page.waitForTimeout(80);
}
await page.waitForTimeout(1000);
await page.evaluate(() => window.scrollTo(0, 5200));
await page.waitForTimeout(800);
await shot('v2-letter.png');

// Voice note: no transcript
const voiceTitle = page.getByText('Lời Chúc Chân Thành Từ a Mỏ').first();
await voiceTitle.scrollIntoViewIfNeeded();
await page.waitForTimeout(700);
const transcriptCount = await page.getByText('Phụ Đề Lời Chúc:').count();
console.log('transcript blocks:', transcriptCount);
await shot('v2-voice-note.png');

await browser.close();
