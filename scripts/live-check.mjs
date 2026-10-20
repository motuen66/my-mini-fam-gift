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
const failed = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`console: ${msg.text()}`);
});
page.on('requestfailed', (req) => failed.push(`${req.url()} :: ${req.failure()?.errorText}`));
page.on('response', (res) => {
  if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
});

const url = 'https://motuen66.github.io/my-mini-fam-gift/';
await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(800);
console.log('title:', await page.title());
console.log('gate:', await page.getByText('Ai đang mở quà đây?').isVisible());
console.log('gate screenshot:', path.join(out, 'live-gate.png'));
await page.screenshot({ path: path.join(out, 'live-gate.png') });

await page.getByRole('button', { name: /em Tròn/ }).click();
await page.waitForTimeout(1000);
let header = page.locator('header');
console.log('tron tabs:', {
  boyfriend: await header.getByRole('button', { name: /em Tròn/ }).count(),
  family: await header.getByRole('button', { name: /Gia đình nhỏ/ }).count(),
});
console.log('gift box:', await page.getByText(/Món Quà Bí Mật/).first().isVisible());
console.log('horizontal:', await page.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
})));
await page.screenshot({ path: path.join(out, 'live-tron.png') });

await page.goto(url, { waitUntil: 'networkidle' });
await page.waitForTimeout(700);
await page.getByRole('button', { name: /Hoành con/ }).click();
await page.waitForTimeout(1000);
header = page.locator('header');
console.log('hoanh tabs:', {
  boyfriend: await header.getByRole('button', { name: /em Tròn/ }).count(),
  family: await header.getByRole('button', { name: /Gia đình nhỏ/ }).count(),
});
console.log('family page:', await page.getByText('Ba Cây Nến Lung Linh').isVisible());
console.log('page1 mounted:', (await page.getByText(/Món Quà Bí Mật/).count()) > 0);
await page.screenshot({ path: path.join(out, 'live-hoanh.png') });

console.log('errors:', errors);
console.log('failedRequests:', failed);
await browser.close();
