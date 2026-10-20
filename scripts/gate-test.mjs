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

const newPage = async () => {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  return page;
};

// 1. Màn hình hỏi ai đang vào
let page = await newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
console.log('gate visible:', await page.getByText('Ai đang mở quà đây?').isVisible());
console.log('tron option:', await page.getByRole('button', { name: /em Tròn/ }).isVisible());
console.log('hoanh option:', await page.getByRole('button', { name: /Hoành con/ }).isVisible());
await page.screenshot({ path: path.join(out, 'gate-mobile.png') });

// 2. Chọn Tròn -> cả 2 tab
await page.getByRole('button', { name: /em Tròn/ }).click();
await page.waitForTimeout(900);
console.log('tron tabs:', {
  boyfriend: await page.getByRole('button', { name: /em Tròn/ }).count(),
  family: await page.getByRole('button', { name: /Gia đình nhỏ/ }).count(),
});
console.log('tron first section:', await page.getByText('Món Quà Bí Mật Dành Cho').first().isVisible());
await page.screenshot({ path: path.join(out, 'gate-chon-tron.png') });

// 3. Reload -> chọn Hoành -> chỉ tab Gia đình nhỏ
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await page.getByRole('button', { name: /Hoành con/ }).click();
await page.waitForTimeout(900);
console.log('hoanh tabs:', {
  boyfriendButtons: await page.getByRole('button', { name: /em Tròn/ }).count(),
  familyButtons: await page.getByRole('button', { name: /Gia đình nhỏ/ }).count(),
});
console.log('family heading visible:', await page.getByText('Ba Cây Nến Lung Linh').isVisible());
console.log('page1 absent:', (await page.getByText('Món Quà Bí Mật Dành Cho').count()) === 0);
await page.screenshot({ path: path.join(out, 'gate-chon-hoanh.png') });

// 4. URL preset cho Hoành
await page.goto('http://localhost:4173/?viewer=hoanh', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);
console.log('hoanh preset gate hidden:', (await page.getByText('Ai đang mở quà đây?').count()) === 0);
console.log('hoanh preset family:', await page.getByText('Ba Cây Nến Lung Linh').isVisible());

// 5. Cuộn được sau khi vào
await page.evaluate(() => window.scrollTo(0, 0));
const cdp = await page.context().newCDPSession(page);
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 195, y: 700 }] });
for (let i = 1; i <= 12; i++) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 195, y: 700 - i * 35 }] });
  await new Promise((r) => setTimeout(r, 16));
}
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await page.waitForTimeout(900);
console.log('scrollY:', await page.evaluate(() => Math.round(window.scrollY)));

await browser.close();
