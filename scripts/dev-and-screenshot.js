#!/usr/bin/env node
const { exec } = require('child_process');
const { chromium } = require('playwright');

// Start dev server
const server = exec('npx next dev -p 3000', { cwd: 'C:\\Users\\HP\\Downloads\\blockatnet-123' });

// Wait for server to start
setTimeout(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(5000);
    await page.screenshot({ path: 'docs/design-references/coinbase-final.png', fullPage: true });
    console.log('Screenshot saved successfully');
    await browser.close();
    server.kill();
    process.exit(0);
  } catch (e) {
    console.log('Error:', e.message);
    server.kill();
    process.exit(1);
  }
}, 30000);
