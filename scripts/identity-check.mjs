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

const newPage = async (viewport = { width: 390, height: 844 }) => {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));
  return page;
};

const log = (label, value) => console.log(`${label}:`, value);

// 1. Màn hình đầu: chỉ có gate, chưa mount nội dung web
let page = await newPage();
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
log('gate visible', await page.getByText('Ai đang mở quà đây?').isVisible());
log('header mounted before choose', await page.locator('header').count());
log('horizontal', await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));
await page.screenshot({ path: path.join(out, 'identity-gate.png') });

// 2. Tròn: cả 2 tab
await page.getByRole('button', { name: /em Tròn/ }).click();
await page.waitForTimeout(900);
let header = page.locator('header');
log('tron header buttons', await header.getByRole('button').allTextContents());
log('tron boyfriend tab', await header.getByRole('button', { name: /em Tròn/ }).count());
log('tron family tab', await header.getByRole('button', { name: /Gia đình nhỏ/ }).count());
log('tron starts at gift box', await page.getByText(/Món Quà Bí Mật/).first().isVisible());
log('tron horizontal', await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));
await page.screenshot({ path: path.join(out, 'identity-tron.png') });

// 3. Hoành: chỉ tab Gia đình nhỏ
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);
await page.getByRole('button', { name: /Hoành con/ }).click();
await page.waitForTimeout(900);
header = page.locator('header');
log('hoanh header buttons', await header.getByRole('button').allTextContents());
log('hoanh boyfriend tab', await header.getByRole('button', { name: /em Tròn/ }).count());
log('hoanh family tab', await header.getByRole('button', { name: /Gia đình nhỏ/ }).count());
log('hoanh starts at family', await page.getByText('Ba Cây Nến Lung Linh').isVisible());
log('hoanh page1 mounted', (await page.getByText(/Món Quà Bí Mật/).count()) > 0);
log('hoanh horizontal', await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));

// 4. Cuộn dọc bằng vuốt trên trang gia đình
const cdp = await page.context().newCDPSession(page);
await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 360, y: 720 }] });
for (let i = 1; i <= 14; i++) {
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 360, y: 720 - i * 34 }] });
  await new Promise((r) => setTimeout(r, 16));
}
await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
await page.waitForTimeout(900);
log('hoanh scrollY after swipe', await page.evaluate(() => Math.round(window.scrollY)));
await page.screenshot({ path: path.join(out, 'identity-hoanh.png') });

// 5. URL preset
await page.goto('http://localhost:4173/?viewer=hoanh', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
log('preset hoanh gate hidden', (await page.getByText('Ai đang mở quà đây?').count()) === 0);
log('preset hoanh only family', await page.locator('header').getByRole('button', { name: /Gia đình nhỏ/ }).count());

await page.goto('http://localhost:4173/?viewer=tron', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(700);
log('preset tron gate hidden', (await page.getByText('Ai đang mở quà đây?').count()) === 0);
log('preset tron both tabs', {
  boyfriend: await page.locator('header').getByRole('button', { name: /em Tròn/ }).count(),
  family: await page.locator('header').getByRole('button', { name: /Gia đình nhỏ/ }).count(),
});

// 6. Màn hình nhỏ: gate vẫn chạm được cả 2 nút
const small = await newPage({ width: 320, height: 568 });
await small.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
await small.waitForTimeout(700);
log('small gate visible', await small.getByText('Ai đang mở quà đây?').isVisible());
log('small tron button visible', await small.getByRole('button', { name: /em Tròn/ }).isVisible());
log('small hoanh button visible', await small.getByRole('button', { name: /Hoành con/ }).isVisible());
log('small horizontal', await small.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));
await small.screenshot({ path: path.join(out, 'identity-small.png'), fullPage: true });

await browser.close();
