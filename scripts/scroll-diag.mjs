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

const info = await page.evaluate(() => {
  const pathOf = (el) => {
    const out = [];
    while (el && el.nodeType === 1 && out.length < 8) {
      const cs = getComputedStyle(el);
      out.push({
        tag: el.tagName,
        id: el.id,
        cls: (el.className || '').toString().slice(0, 80),
        overflow: cs.overflow,
        overflowY: cs.overflowY,
        touchAction: cs.touchAction,
        pointerEvents: cs.pointerEvents,
        position: cs.position,
        height: cs.height,
        clientH: el.clientHeight,
        scrollH: el.scrollHeight,
        scrollTop: el.scrollTop,
      });
      el = el.parentElement;
    }
    return out;
  };
  const center = document.elementFromPoint(195, 400);
  return {
    scrollingElement: document.scrollingElement?.tagName,
    html: {
      clientH: document.documentElement.clientHeight,
      scrollH: document.documentElement.scrollHeight,
      scrollTop: document.documentElement.scrollTop,
    },
    body: {
      clientH: document.body.clientHeight,
      scrollH: document.body.scrollHeight,
      scrollTop: document.body.scrollTop,
    },
    centerPath: pathOf(center),
  };
});
console.log(JSON.stringify(info, null, 2));

const probe = async (label, fn) => {
  const before = await page.evaluate(() => ({
    win: window.scrollY,
    doc: document.documentElement.scrollTop,
    body: document.body.scrollTop,
    scrolling: document.scrollingElement?.scrollTop,
  }));
  await fn();
  await page.waitForTimeout(600);
  const after = await page.evaluate(() => ({
    win: window.scrollY,
    doc: document.documentElement.scrollTop,
    body: document.body.scrollTop,
    scrolling: document.scrollingElement?.scrollTop,
  }));
  console.log(label, { before, after });
};

await probe('scrollBy 500', () => page.evaluate(() => window.scrollBy(0, 500)));
await probe('wheel over center', async () => {
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 500);
});
await probe('wheel over right edge', async () => {
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.mouse.move(380, 400);
  await page.mouse.wheel(0, 500);
});

await browser.close();
