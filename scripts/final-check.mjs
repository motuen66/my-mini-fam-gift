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
  return file;
};

await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);

// 1. Scroll bằng vuốt tay
const cdp = await page.context().newCDPSession(page);
const scrollY = () => page.evaluate(() => Math.round(window.scrollY));
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 700 }] });
for (let i = 1; i <= 12; i++) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 700 - i * 35 }] });
  await new Promise((r) => setTimeout(r, 16));
}
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await page.waitForTimeout(1000);
console.log('scroll after swipe:', await scrollY());

// 2. Không tràn ngang
console.log(
  'horizontal:',
  await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }))
);

// 3. Hộp quà: đúng 10 lần né
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);
await shot('final-gift-box.png');
const gift = page.locator('button').filter({ hasText: /Mở quà|Mở Thật/ });
let evades = 0;
for (let i = 0; i < 11; i++) {
  const label = (await gift.first().textContent())?.trim();
  if (label?.includes('Mở Thật')) {
    console.log('final button after', evades, 'evasions:', label);
    await gift.first().tap();
    break;
  }
  await gift.first().tap();
  evades++;
  await page.waitForTimeout(220);
}
await page.waitForTimeout(900);
console.log('evasions:', evades, 'opened:', await page.getByText('Ú òa! Mở quà thành công!').isVisible().catch(() => false));

// 4. Photo story: card dưới màn hình phải trong suốt trước khi cuộn
const revealStates = await page.evaluate(() => {
  const section = document.getElementById('photo-story-section');
  if (!section) return [];
  return [...section.querySelectorAll(':scope > div:last-child > div')].slice(0, 4).map((el) => ({
    opacity: getComputedStyle(el).opacity,
    filter: getComputedStyle(el).filter,
  }));
});
console.log('story reveal states (before scroll):', revealStates);
await page.locator('#photo-story-section').scrollIntoViewIfNeeded();
await page.waitForTimeout(1100);
const revealAfter = await page.evaluate(() => {
  const section = document.getElementById('photo-story-section');
  return section
    ? [...section.querySelectorAll(':scope > div:last-child > div')].slice(0, 2).map((el) => getComputedStyle(el).opacity)
    : [];
});
console.log('story reveal states (after scroll):', revealAfter);
await shot('final-story.png');

// 5. Vòng quay: modal nằm trong khu vực vòng quay
const spin = page.getByRole('button', { name: /QUAY NGAY/ });
await spin.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await spin.click();
await page.waitForTimeout(4200);
const wheelBox = await page.locator('section').filter({ hasText: 'Vòng Quay' }).first().boundingBox();
const overlayBox = await page.locator('.absolute.inset-0.z-30').first().boundingBox();
console.log('wheel section:', wheelBox, 'prize overlay:', overlayBox);
console.log('fixed overlays:', await page.locator('.fixed.inset-0').count());
await shot('final-wheel.png');

// 6. Voice note không còn phụ đề
await page.getByText('Lời Chúc Chân Thành Từ a Mỏ').first().scrollIntoViewIfNeeded();
await page.waitForTimeout(600);
console.log('transcript blocks:', await page.getByText('Phụ Đề Lời Chúc:').count());

// 7. Tab gia đình
await page.goto('http://localhost:4173/?autostart=1&tab=family', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
await page.locator('[data-testid="candle-ba"]').tap();
await page.waitForTimeout(300);
await page.locator('[data-testid="candle-me"]').tap();
await page.waitForTimeout(300);
await page.locator('[data-testid="candle-con"]').tap();
await page.waitForTimeout(800);
await shot('final-family.png');

await browser.close();
