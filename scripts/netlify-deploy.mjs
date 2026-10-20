import { chromium } from 'playwright-core';
import path from 'node:path';

const DIST = 'D:\\Coding\\PROJECTS\\20-10-2026\\dist';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

await page.goto('https://app.netlify.com/drop', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(3000);

const folderInput = page.locator('input[type=file][webkitdirectory]');
console.log('folder inputs:', await folderInput.count());
await folderInput.first().setInputFiles(DIST);
console.log('files set, waiting for deploy...');

try {
  await page.waitForURL(/netlify\.app|deploy/i, { timeout: 120000 });
} catch (e) {
  console.log('waitForURL timeout:', e.message.split('\n')[0]);
}
console.log('url now:', page.url());
await page.waitForTimeout(3000);
console.log('body:', (await page.locator('body').innerText()).slice(0, 1200));
await page.screenshot({
  path: 'C:\\Users\\Motuen\\AppData\\Local\\Temp\\opencode\\screens\\netlify-result.png',
  fullPage: false,
});
await browser.close();
