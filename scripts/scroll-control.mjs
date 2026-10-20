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
await page.setContent(`<style>body{margin:0}div{height:5000px;background:linear-gradient(red,blue)}</style><div></div>`);
console.log('h', await page.evaluate(() => document.documentElement.scrollHeight));

const read = () => page.evaluate(() => window.scrollY);
console.log('start', await read());

await page.mouse.move(195, 400);
await page.mouse.wheel(0, 500);
await page.waitForTimeout(700);
console.log('after wheel', await read());

await page.evaluate(() => window.scrollTo(0, 0));
const cdp = await page.context().newCDPSession(page);
await cdp.send('Input.synthesizeScrollGesture', {
  x: 195,
  y: 500,
  xDistance: 0,
  yDistance: -600,
  gestureSourceType: 'touch',
  speed: 800,
});
await page.waitForTimeout(1000);
console.log('after touch', await read());

await browser.close();
