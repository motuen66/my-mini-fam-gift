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

// 1. Màn hình mở đầu
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1400);
await shot('opening.png');

// 2. Tab 1: chụp vòng quay và 20 thẻ
await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(1200);

const wheelSection = page.locator('section').filter({ hasText: 'Vòng Quay Yêu Thương' }).first();
await wheelSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await wheelSection.screenshot({ path: path.join(out, 'wheel.png') });
console.log('saved wheel');

const cardsSection = page.locator('section').filter({ hasText: '20 Điều Khiến' }).first();
await cardsSection.scrollIntoViewIfNeeded();
await page.waitForTimeout(400);
await cardsSection.screenshot({ path: path.join(out, 'cards.png') });
console.log('saved cards');

// 3. Quay thử
await wheelSection.getByRole('button', { name: /QUAY NGAY/ }).click();
await page.waitForTimeout(4300);
await shot('wheel-result.png');
const resultHeading = page.locator('h3').filter({ hasText: /Chúc Mừng|Troll/ }).first();
console.log('wheel result:', await resultHeading.textContent().catch(() => 'none'));

// 4. Hộp quà chạy trốn: hover 4 lần rồi click
await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
const giftButton = () => page.getByRole('button', { name: /Mở quà ngay|Mở Thật Nè/ }).first();
for (let i = 0; i < 4; i++) {
  await giftButton().hover({ force: true }).catch(() => {});
  await page.waitForTimeout(250);
}
console.log('gift label after evades:', await giftButton().textContent().catch(() => 'none'));
await giftButton().click({ force: true });
await page.waitForTimeout(1200);
console.log('gift opened:', await page.getByText('Ú òa! Mở quà thành công!').isVisible().catch(() => false));
await shot('gift-opened.png');

// 5. Tab 2: hộp quà gia đình 5 lớp
await page.goto('http://localhost:4173/?autostart=1&tab=family', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);
await page.getByRole('button', { name: /Hộp Quà Gia Đình/ }).click();
await page.waitForTimeout(500);
const labels = [
  /Xé toạc/,
  /Bóc hết băng keo/,
  /Mở nơ hồng/,
  /Mở khóa yêu thương/,
  /Nhận chứng nhận/,
];
for (const re of labels) {
  await page.getByRole('button', { name: re }).click();
  await page.waitForTimeout(500);
}
await page.waitForTimeout(800);
console.log('certificate:', await page.getByText('CHỨNG NHẬN GIA ĐÌNH 3 NGƯỜI VÔ ĐỊCH').isVisible().catch(() => false));
await page.getByText('CHỨNG NHẬN GIA ĐÌNH 3 NGƯỜI VÔ ĐỊCH').scrollIntoViewIfNeeded().catch(() => {});
await page.waitForTimeout(500);
await shot('family-gift-open.png');

console.log('h overflow family:', await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));

console.log('\n--- errors (last 20) ---');
console.log(errors.slice(-20).join('\n') || '(none)');

await browser.close();
