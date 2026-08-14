#!/usr/bin/env node
const { exec } = require('child_process');
const { chromium } = require('playwright');

const server = exec('npx next dev -p 3000', { cwd: 'C:\\Users\\HP\\Downloads\\blockatnet-123' });

setTimeout(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    // Test main pages
    const pages = [
      { url: 'http://localhost:3000', name: 'home' },
      { url: 'http://localhost:3000/Cryptocurrencies', name: 'cryptocurrencies' },
      { url: 'http://localhost:3000/alert', name: 'alert' },
      { url: 'http://localhost:3000/track', name: 'track' },
    ];
    
    for (const p of pages) {
      try {
        await page.goto(p.url, { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        await page.screenshot({ path: `docs/design-references/${p.name}-test.png` });
        console.log(`✓ ${p.name} loaded successfully`);
      } catch (e) {
        console.log(`✗ ${p.name} failed: ${e.message}`);
      }
    }
    
    // Check console errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('Console error:', msg.text());
      }
    });
    
    await browser.close();
    server.kill();
    process.exit(0);
  } catch (e) {
    console.log('Error:', e.message);
    server.kill();
    process.exit(1);
  }
}, 30000);
