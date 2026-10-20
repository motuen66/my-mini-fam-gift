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
await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(900);

const cdp = await page.context().newCDPSession(page);
const read = () => page.evaluate(() => Math.round(window.scrollY));

async function swipe(fromY, toY, steps = 12, x = 195) {
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x, y: fromY }],
  });
  for (let i = 1; i <= steps; i++) {
    const y = fromY + ((toY - fromY) * i) / steps;
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x, y }],
    });
    await new Promise((r) => setTimeout(r, 16));
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

console.log('start', await read());
await swipe(600, 150);
await page.waitForTimeout(1200);
console.log('after swipe up (should increase)', await read());
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(300);
await swipe(700, 300, 8, 60);
await page.waitForTimeout(1200);
console.log('after second swipe', await read());

await browser.close();
