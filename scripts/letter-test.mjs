import { chromium } from 'playwright-core';

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

await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(800);

const cards = page.locator('[aria-label^="Lật thẻ lý do"]');
for (let i = 0; i < 20; i++) {
  await cards.nth(i).click({ timeout: 5000 });
  await page.waitForTimeout(100);
}
await page.waitForTimeout(1000);

const info = await page.evaluate(() => {
  const matches = [...document.querySelectorAll('*')].filter(
    (el) => el.children.length === 0 && el.textContent?.includes('Mở Khóa Bức Thư Cuối')
  );
  return matches.map((el) => {
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, text: el.textContent?.slice(0, 40), top: r.top + window.scrollY, height: r.height };
  });
});
console.log(JSON.stringify(info, null, 2));

await page.evaluate(() => window.scrollTo(0, 6500));
await page.waitForTimeout(1000);
await page.screenshot({
  path: 'C:\\Users\\Motuen\\AppData\\Local\\Temp\\opencode\\screens\\letter-final.png',
});
await browser.close();
