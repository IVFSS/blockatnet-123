#!/usr/bin/env node
const { exec } = require('child_process');
const { chromium } = require('playwright');

const server = exec('npx next dev -p 3000', { cwd: 'C:\\Users\\HP\\Downloads\\blockatnet-123' });
let output = '';
server.stdout.on('data', (d) => { output += d.toString(); });
server.stderr.on('data', (d) => { output += d.toString(); });

setTimeout(async () => {
  try {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', err => errors.push('PAGE ERROR: ' + err.message));
    
    // Test home
    console.log('--- Testing Home ---');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForTimeout(3000);
    console.log('Home errors:', errors.length ? errors.join('\n') : 'none');
    errors.length = 0;
    
    // Test cryptocurrencies with longer wait
    console.log('\n--- Testing /Cryptocurrencies ---');
    try {
      const resp = await page.goto('http://localhost:3000/Cryptocurrencies', { waitUntil: 'load', timeout: 30000 });
      console.log('Status:', resp.status());
      await page.waitForTimeout(5000);
      console.log('Cryptocurrencies errors:', errors.length ? errors.join('\n') : 'none');
    } catch (e) {
      console.log('Cryptocurrencies failed:', e.message);
    }
    
    // Print server output
    console.log('\n--- Server output ---');
    console.log(output.slice(-2000));
    
    await browser.close();
    server.kill();
    process.exit(0);
  } catch (e) {
    console.log('Fatal:', e.message);
    server.kill();
    process.exit(1);
  }
}, 30000);
