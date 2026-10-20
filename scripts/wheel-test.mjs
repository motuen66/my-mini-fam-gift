import { chromium } from 'playwright-core';
import path from 'node:path';
import os from 'node:os';

const out = path.join(os.tmpdir(), 'opencode', 'screens');

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});

for (const [name, viewport, mobile] of [
  ['mobile', { width: 390, height: 844 }, true],
  ['desktop', { width: 1280, height: 900 }, false],
]) {
  const page = await browser.newPage({
    viewport,
    deviceScaleFactor: mobile ? 2 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  page.on('pageerror', (e) => console.log('PAGEERROR', e.message));

  await page.goto('http://localhost:4173/?autostart=1', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(900);

  const spin = page.getByRole('button', { name: /QUAY NGAY/ });
  await spin.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await spin.click();
  console.log(name, 'spinning...');
  await page.waitForTimeout(4300);

  const card = page.locator('text=Chúc Mừng').first();
  console.log(name, 'prize visible:', await card.isVisible().catch(() => false));

  const overlay = page.locator('.absolute.inset-0.z-30').first();
  console.log(name, 'overlay box:', await overlay.boundingBox().catch(() => null));
  console.log(name, 'wheel section box:', await page.locator('section').filter({ hasText: 'Vòng Quay' }).first().boundingBox().catch(() => null));

  await page.screenshot({ path: path.join(out, `v3-wheel-${name}.png`) });
  console.log('saved', path.join(out, `v3-wheel-${name}.png`));
  await page.close();
}

await browser.close();
