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

const getScroll = () =>
  page.evaluate(() => ({
    windowY: window.scrollY,
    docY: document.documentElement.scrollTop,
    bodyY: document.body.scrollTop,
    docH: document.documentElement.scrollHeight,
    innerH: window.innerHeight,
    htmlOverflow: getComputedStyle(document.documentElement).overflow,
    bodyOverflow: getComputedStyle(document.body).overflow,
  }));

console.log('start', await getScroll());

const cdp = await page.context().newCDPSession(page);
await cdp.send('Input.synthesizeScrollGesture', {
  x: 195,
  y: 500,
  xDistance: 0,
  yDistance: -600,
  gestureSourceType: 'touch',
  speed: 800,
});
await page.waitForTimeout(1200);
console.log('after touch scroll', await getScroll());

await page.mouse.move(195, 500);
await page.mouse.wheel(0, 600);
await page.waitForTimeout(800);
console.log('after wheel', await getScroll());

await browser.close();
