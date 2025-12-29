const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const logs = [];
  page.on('console', (msg) => logs.push({ type: msg.type(), text: msg.text(), location: msg.location() }));
  page.on('pageerror', (err) => logs.push({ type: 'pageerror', text: err.message }));

  // Capture console.error stack traces by patching console.error early
  await page.addInitScript(() => {
    try {
      const orig = console.error;
      console.error = function (...args) {
        try {
          // @ts-ignore
          window.__console_error_stack__ = window.__console_error_stack__ || [];
          // @ts-ignore
          window.__console_error_stack__.push({ args, stack: new Error().stack });
        } catch (e) {}
        orig.apply(console, args);
      };
    } catch (e) {}
  });

  const url = 'http://localhost:3000/transactions';
  console.log('Navigating to', url);
  await page.goto(url, { waitUntil: 'networkidle' });

  const filePath = path.resolve(__dirname, '../tmp/sample.xlsx');
  console.log('Using file', filePath);

  const input = await page.waitForSelector('input[type=file]', { timeout: 5000 });
  await input.setInputFiles(filePath);

  // Wait a bit for processing to happen in the page
  await page.waitForTimeout(3000);

  const remoteErrors = await page.evaluate(() => {
    // @ts-ignore
    return window.__console_error_stack__ || [];
  });
  if (remoteErrors && remoteErrors.length) {
    console.log('Captured console.error stacks from page:');
    console.log(remoteErrors.map((r) => ({ args: r.args, stack: r.stack })).slice(0, 5));
  }

  console.log('Captured console logs:');
  logs.forEach((l) => console.log(`[${l.type}] ${l.text}`));

  // Look for React warning in logs
  const warning = logs.find((l) => l.text && l.text.includes("Can't perform a React state update on a component"));
  if (warning) {
    console.error('Found React state update warning:', warning.text);
    await browser.close();
    process.exit(2);
  }

  console.log('No React state update warning found.');
  await browser.close();
  process.exit(0);
})().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
