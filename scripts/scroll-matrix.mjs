import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  headless: true,
});

const cases = {
  plain: '',
  ox: 'html,body{overflow-x:hidden}',
  oxy: 'html,body{overflow-x:hidden;overflow-y:visible}',
  overscroll: 'body{overscroll-behavior-y:none}',
  both: 'html,body{overflow-x:hidden}body{overscroll-behavior-y:none;min-height:100dvh}',
  app: 'html,body{overflow-x:hidden}body{overscroll-behavior-y:none;min-height:100dvh} .app{overflow-x:hidden}',
};

for (const [name, css] of Object.entries(cases)) {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  await page.setContent(
    `<style>body{margin:0}${css}div.content{height:5000px;background:linear-gradient(red,blue)}</style><div class="app"><div class="content"></div></div>`
  );
  await page.waitForTimeout(200);
  await page.mouse.move(195, 400);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(500);
  const y = await page.evaluate(() => window.scrollY);
  console.log(name, '=>', y, '|', await page.evaluate(() => getComputedStyle(document.documentElement).overflowY + '/' + getComputedStyle(document.body).overflowY));
  await page.close();
}

await browser.close();
