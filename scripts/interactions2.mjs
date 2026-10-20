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

const shot = async (name) => {
  const file = path.join(out, name);
  await page.screenshot({ path: file });
  console.log('saved', file);
};

// --- Hộp quà: tap 5 lần ---
await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);

const giftButton = () => page.getByRole('button', { name: /Mở quà ngay|Mở Thật Nè|Mở thật/ }).first();
for (let i = 1; i <= 5; i++) {
  const label = await giftButton().textContent().catch(() => 'missing');
  console.log(`tap ${i}:`, label?.trim());
  if (i <= 4) {
    await giftButton().tap({ force: true }).catch((e) => console.log('tap err', e.message.slice(0, 80)));
    await page.waitForTimeout(300);
  }
}
await page.waitForTimeout(300);
console.log('after 4 taps:', (await giftButton().textContent().catch(() => 'missing'))?.trim());
await giftButton().tap({ force: true }).catch((e) => console.log('final tap err', e.message.slice(0, 80)));
await page.waitForTimeout(1200);
console.log('opened:', await page.getByText('Ú òa! Mở quà thành công!').isVisible().catch(() => false));
await shot('gift-touch.png');

// --- Hộp quà gia đình: 5 lớp ---
await page.goto('http://localhost:4173/?autostart=1&tab=family', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
await page.getByRole('button', { name: /Hộp Quà Gia Đình/ }).click();
await page.waitForTimeout(500);

const stepLabels = [
  /Xé toạc/,
  /Bóc hết băng keo/,
  /Mở nơ hồng/,
  /Mở khóa yêu thương/,
  /Nhận chứng nhận/,
];
for (let i = 0; i < stepLabels.length; i++) {
  const btn = page.getByRole('button', { name: stepLabels[i] });
  console.log(`layer ${i + 1} visible:`, await btn.isVisible().catch(() => false));
  if (await btn.isVisible().catch(() => false)) {
    await btn.click();
    await page.waitForTimeout(500);
  }
}
await page.waitForTimeout(800);
const cert = page.getByText('CHỨNG NHẬN GIA ĐÌNH 3 NGƯỜI VÔ ĐỊCH');
console.log('certificate:', await cert.isVisible().catch(() => false));
await cert.scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(500);
await shot('family-gift-open.png');

// --- Header + candle mới ---
await page.goto('http://localhost:4173/?autostart=1&tab=family', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
await shot('family-before-2.png');
await page.locator('[data-testid="candle-ba"]').tap();
await page.waitForTimeout(400);
await page.locator('[data-testid="candle-me"]').tap();
await page.waitForTimeout(400);
await page.locator('[data-testid="candle-con"]').tap();
await page.waitForTimeout(900);
await shot('family-lit-2.png');

// --- Mở đầu mới ---
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1000);
await shot('opening-2.png');

console.log('\n--- errors ---');
console.log(errors.slice(-20).join('\n') || '(none)');

await browser.close();
