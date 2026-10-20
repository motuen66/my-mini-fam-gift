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
await page.waitForTimeout(900);

const gift = page.locator('button').filter({ hasText: /Mở quà|Mở Thật/ });
for (let i = 0; i < 6; i++) {
  const count = await gift.count();
  const labels = count ? await gift.allTextContents() : [];
  const boxes = count ? await Promise.all((await gift.all()).map((b) => b.boundingBox())) : [];
  console.log(`step ${i}: count=${count} labels=${JSON.stringify(labels)} boxes=${JSON.stringify(boxes)}`);
  if (!count) break;
  try {
    await gift.first().tap({ timeout: 3000 });
    console.log('  tap ok');
  } catch (e) {
    console.log('  tap err:', e.message.split('\n')[0]);
    break;
  }
  await page.waitForTimeout(450);
}
await page.waitForTimeout(1000);
console.log(
  'opened:',
  await page
    .getByText('Ú òa! Mở quà thành công!')
    .isVisible()
    .catch(() => false)
);
await page.screenshot({
  path: 'C:\\Users\\Motuen\\AppData\\Local\\Temp\\opencode\\screens\\gift-touch-2.png',
});
await browser.close();
