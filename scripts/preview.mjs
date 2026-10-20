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

const errors = [];
page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
});

const shot = async (name, opts = {}) => {
  const file = path.join(out, name);
  await page.screenshot({ path: file, ...opts });
  console.log('saved', file);
};

const shotEl = async (selector, name) => {
  const file = path.join(out, name);
  await page.locator(selector).screenshot({ path: file });
  console.log('saved', file);
};

await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);

// Scroll hết trang để load ảnh lazy rồi quay lại đầu.
await page.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 600) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 60));
  }
  window.scrollTo(0, 0);
});
await page.waitForTimeout(1200);

console.log('title:', await page.title());
console.log('h overflow:', await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));
console.log('broken images:', await page.evaluate(() =>
  Array.from(document.images)
    .filter((img) => img.complete && img.naturalWidth === 0)
    .map((img) => img.getAttribute('src'))
));

await shot('tab1-viewport.png');
await shotEl('#photo-story-section', 'photo-story.png');
await shot('tab1-full.png', { fullPage: true });

// Mở tab 2
await page.locator('header').getByRole('button', { name: /Gia đình nhỏ/ }).click();
await page.waitForTimeout(900);
await shot('family-before.png');
await shot('family-full.png', { fullPage: true });

// Thắp 3 nến
for (const id of ['candle-ba', 'candle-me', 'candle-con']) {
  await page.locator(`[data-testid="${id}"]`).click();
  await page.waitForTimeout(500);
}
await page.waitForTimeout(1000);
await shot('family-lit.png');

// Quay lại tab 1, lật 20 thẻ
await page.locator('header').getByRole('button', { name: /Dành cho em Tròn/ }).click();
await page.waitForTimeout(700);
const cards = page.locator('[aria-label^="Lật thẻ lý do"]');
const count = await cards.count();
console.log('cards:', count);
for (let i = 0; i < count; i++) {
  await cards.nth(i).click();
  await page.waitForTimeout(90);
}
await page.waitForTimeout(1400);
const letter = page.getByText('Mở Khóa Bức Thư Cuối!');
console.log('letter visible:', await letter.isVisible().catch(() => false));
await letter.scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(500);
await shot('letter.png');

// Thử voice note (không có file -> phụ đề tự chạy)
await page.getByRole('button', { name: /Nghe lời chúc/ }).first().scrollIntoViewIfNeeded();
await page.getByRole('button', { name: /Nghe lời chúc/ }).first().click();
await page.waitForTimeout(1500);
await shot('voice.png');

console.log('\n--- errors (last 20) ---');
console.log(errors.slice(-20).join('\n') || '(none)');

await browser.close();
