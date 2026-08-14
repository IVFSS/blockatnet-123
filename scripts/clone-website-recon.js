/**
 * Clone Website - Playwright Reconnaissance Script
 * Extracts design tokens, screenshots, and page topology from ctrl.xyz
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://ctrl.xyz/';
const OUTPUT_DIR = path.resolve('docs');
const SCREENSHOT_DIR = path.join(OUTPUT_DIR, 'design-references');
const RESEARCH_DIR = path.join(OUTPUT_DIR, 'research');

async function main() {
  console.log('🚀 Starting clone-website reconnaissance...');
  console.log(`Target: ${TARGET_URL}`);

  // Create output directories
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  fs.mkdirSync(RESEARCH_DIR, { recursive: true });
  fs.mkdirSync(path.join(RESEARCH_DIR, 'components'), { recursive: true });

  // Launch browser
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });

  const page = await context.newPage();

  try {
    // Phase 1: Navigate and take screenshots
    console.log('📸 Phase 1: Taking screenshots...');
    await page.goto(TARGET_URL, { waitUntil: 'networkidle' });

    // Desktop screenshot (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-full.png'), fullPage: true });
    console.log('✅ Desktop screenshot saved');

    // Mobile screenshot (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-full.png'), fullPage: true });
    console.log('✅ Mobile screenshot saved');

    // Phase 2: Extract design tokens
    console.log('🎨 Phase 2: Extracting design tokens...');
    const designTokens = await page.evaluate(() => {
      const tokens = {
        colors: {},
        fonts: {},
        spacing: {},
        shadows: {},
        borderRadii: {},
      };

      // Extract colors from body and key elements
      const body = document.body;
      const bodyStyles = getComputedStyle(body);
      tokens.colors.background = bodyStyles.backgroundColor;
      tokens.colors.text = bodyStyles.color;
      tokens.fonts.body = bodyStyles.fontFamily;

      // Extract from key elements
      const selectors = ['h1', 'h2', 'h3', 'p', 'a', 'button', '[class*="card"]', '[class*="nav"]'];
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          const styles = getComputedStyle(el);
          if (!tokens.colors[sel]) tokens.colors[sel] = {};
          tokens.colors[sel].color = styles.color;
          tokens.colors[sel].bg = styles.backgroundColor;
          tokens.fonts[sel] = styles.fontFamily;
        }
      });

      return tokens;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'design-tokens.json'), JSON.stringify(designTokens, null, 2));
    console.log('✅ Design tokens extracted');

    // Phase 3: Extract page topology
    console.log('🗺️ Phase 3: Extracting page topology...');
    const topology = await page.evaluate(() => {
      const sections = [];
      const elements = document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="feature"], footer, header, nav');

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const styles = getComputedStyle(el);

        sections.push({
          index,
          tag: el.tagName.toLowerCase(),
          classes: el.className?.toString().split(' ').slice(0, 5).join(' '),
          text: el.textContent?.trim().slice(0, 100),
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
          styles: {
            background: styles.backgroundColor,
            color: styles.color,
            padding: styles.padding,
            margin: styles.margin,
          },
        });
      });

      return sections;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'page-topology.json'), JSON.stringify(topology, null, 2));
    console.log('✅ Page topology extracted');

    // Phase 4: Extract component specs
    console.log('📝 Phase 4: Extracting component specs...');
    const components = await page.evaluate(() => {
      const specs = [];
      const sections = document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="feature"], footer, header, nav');

      sections.forEach((el, index) => {
        const spec = {
          name: `section-${index}`,
          tag: el.tagName.toLowerCase(),
          classes: el.className?.toString().split(' ').slice(0, 5).join(' '),
          text: el.textContent?.trim().slice(0, 200),
          styles: getComputedStyle(el),
          children: [],
        };

        // Extract child elements
        const children = el.querySelectorAll('*');
        children.forEach(child => {
          if (child.children.length === 0) {
            spec.children.push({
              tag: child.tagName.toLowerCase(),
              text: child.textContent?.trim().slice(0, 100),
              styles: getComputedStyle(child),
            });
          }
        });

        specs.push(spec);
      });

      return specs;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'components', 'page-specs.json'), JSON.stringify(components, null, 2));
    console.log('✅ Component specs extracted');

    // Phase 5: Extract interactions
    console.log('🖱️ Phase 5: Extracting interactions...');
    const interactions = await page.evaluate(() => {
      const interactions = [];

      // Find all buttons and links
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], [class*="btn"]');
      interactiveElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        interactions.push({
          index,
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().slice(0, 50),
          href: el.href || null,
          rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          },
          styles: getComputedStyle(el),
        });
      });

      return interactions;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'interactions.json'), JSON.stringify(interactions, null, 2));
    console.log('✅ Interactions extracted');

    console.log('\n✅ Reconnaissance complete!');
    console.log(`📁 Output saved to: ${OUTPUT_DIR}`);
    console.log('\nNext steps:');
    console.log('1. Review design-tokens.json for color/font/spacing values');
    console.log('2. Review page-topology.json for section layout');
    console.log('3. Review components/page-specs.json for component details');
    console.log('4. Review interactions.json for interactive elements');
    console.log('5. Run foundation build with extracted tokens');
    console.log('6. Dispatch builders with component specs');

  } catch (error) {
    console.error('❌ Error during reconnaissance:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
