import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.on('console', (m) => console.log('CONSOLE', m.type(), m.text().slice(0, 200)));
page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

const resp = await page.goto('https://app.netlify.com/drop', { waitUntil: 'domcontentloaded', timeout: 60000 });
console.log('status', resp?.status(), 'url', page.url());
await page.waitForTimeout(4000);
console.log('title', await page.title());
console.log('inputs', await page.locator('input').count());
const fileInputs = page.locator('input[type=file]');
console.log('file inputs', await fileInputs.count());
for (let i = 0; i < (await fileInputs.count()); i++) {
  console.log('input', i, await fileInputs.nth(i).getAttribute('webkitdirectory'), await fileInputs.nth(i).getAttribute('multiple'));
}
console.log('text', (await page.locator('body').innerText()).slice(0, 1500));
await page.screenshot({
  path: 'C:\\Users\\Motuen\\AppData\\Local\\Temp\\opencode\\screens\\netlify-drop.png',
  fullPage: false,
});
await browser.close();
