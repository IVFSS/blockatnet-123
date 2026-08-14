/**
 * Clone Website - Playwright Reconnaissance Script
 * Extracts design tokens, screenshots, and page topology from worldlabs.ai
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const TARGET_URL = 'https://www.worldlabs.ai/';
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
    await page.goto(TARGET_URL, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Desktop screenshot (1440px)
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'worldlabs-desktop.png'), fullPage: true });
    console.log('✅ Desktop screenshot saved');

    // Mobile screenshot (390px)
    await page.setViewportSize({ width: 390, height: 844 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'worldlabs-mobile.png'), fullPage: true });
    console.log('✅ Mobile screenshot saved');

    // Tablet screenshot (768px)
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'worldlabs-tablet.png'), fullPage: true });
    console.log('✅ Tablet screenshot saved');

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
      const selectors = ['h1', 'h2', 'h3', 'h4', 'p', 'a', 'button', '[class*="card"]', '[class*="nav"]', '[class*="hero"]', '[class*="section"]', '[class*="footer"]'];
      selectors.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) {
          const styles = getComputedStyle(el);
          if (!tokens.colors[sel]) tokens.colors[sel] = {};
          tokens.colors[sel].color = styles.color;
          tokens.colors[sel].bg = styles.backgroundColor;
          tokens.fonts[sel] = styles.fontFamily;
          tokens.borderRadii[sel] = styles.borderRadius;
        }
      });

      // Extract all unique colors
      const allElements = document.querySelectorAll('*');
      const uniqueColors = new Set();
      const uniqueBgColors = new Set();
      allElements.forEach(el => {
        const styles = getComputedStyle(el);
        if (styles.color) uniqueColors.add(styles.color);
        if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          uniqueBgColors.add(styles.backgroundColor);
        }
      });
      tokens.colors.allColors = Array.from(uniqueColors).slice(0, 20);
      tokens.colors.allBgColors = Array.from(uniqueBgColors).slice(0, 20);

      return tokens;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'worldlabs-design-tokens.json'), JSON.stringify(designTokens, null, 2));
    console.log('✅ Design tokens extracted');

    // Phase 3: Extract page topology
    console.log('🗺️ Phase 3: Extracting page topology...');
    const topology = await page.evaluate(() => {
      const sections = [];
      const elements = document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="feature"], footer, header, nav, main');

      elements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const styles = getComputedStyle(el);

        sections.push({
          index,
          tag: el.tagName.toLowerCase(),
          classes: el.className?.toString().split(' ').slice(0, 5).join(' '),
          text: el.textContent?.trim().slice(0, 150),
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

    fs.writeFileSync(path.join(RESEARCH_DIR, 'worldlabs-page-topology.json'), JSON.stringify(topology, null, 2));
    console.log('✅ Page topology extracted');

    // Phase 4: Extract component specs
    console.log('📝 Phase 4: Extracting component specs...');
    const components = await page.evaluate(() => {
      const specs = [];
      const sections = document.querySelectorAll('section, [class*="section"], [class*="hero"], [class*="feature"], footer, header, nav, main');

      sections.forEach((el, index) => {
        const spec = {
          name: `section-${index}`,
          tag: el.tagName.toLowerCase(),
          classes: el.className?.toString().split(' ').slice(0, 5).join(' '),
          text: el.textContent?.trim().slice(0, 300),
          styles: getComputedStyle(el),
          children: [],
        };

        // Extract child elements (limit to first 50 for performance)
        const children = Array.from(el.querySelectorAll('*')).slice(0, 50);
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

    fs.writeFileSync(path.join(RESEARCH_DIR, 'components', 'worldlabs-page-specs.json'), JSON.stringify(components, null, 2));
    console.log('✅ Component specs extracted');

    // Phase 5: Extract interactions
    console.log('🖱️ Phase 5: Extracting interactions...');
    const interactions = await page.evaluate(() => {
      const interactions = [];

      // Find all buttons and links
      const interactiveElements = document.querySelectorAll('button, a, [role="button"], [class*="btn"], [class*="link"]');
      interactiveElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const styles = getComputedStyle(el);
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
          styles: {
            color: styles.color,
            bg: styles.backgroundColor,
            border: styles.border,
            borderRadius: styles.borderRadius,
            padding: styles.padding,
            fontSize: styles.fontSize,
            fontWeight: styles.fontWeight,
          },
        });
      });

      return interactions;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'worldlabs-interactions.json'), JSON.stringify(interactions, null, 2));
    console.log('✅ Interactions extracted');

    // Phase 6: Extract navigation structure
    console.log('🧭 Phase 6: Extracting navigation structure...');
    const navigation = await page.evaluate(() => {
      const nav = [];
      const navElements = document.querySelectorAll('nav, [class*="nav"], [class*="menu"], header a');
      navElements.forEach((el, index) => {
        nav.push({
          index,
          tag: el.tagName.toLowerCase(),
          text: el.textContent?.trim().slice(0, 50),
          href: el.href || null,
          classes: el.className?.toString().split(' ').slice(0, 3).join(' '),
        });
      });
      return nav;
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'worldlabs-navigation.json'), JSON.stringify(navigation, null, 2));
    console.log('✅ Navigation structure extracted');

    // Phase 7: Extract footer structure
    console.log('🦶 Phase 7: Extracting footer structure...');
    const footer = await page.evaluate(() => {
      const footerEl = document.querySelector('footer');
      if (!footerEl) return null;
      
      const links = [];
      footerEl.querySelectorAll('a').forEach((el, index) => {
        links.push({
          index,
          text: el.textContent?.trim().slice(0, 50),
          href: el.href || null,
        });
      });
      
      return {
        text: footerEl.textContent?.trim().slice(0, 500),
        links,
        styles: getComputedStyle(footerEl),
      };
    });

    fs.writeFileSync(path.join(RESEARCH_DIR, 'worldlabs-footer.json'), JSON.stringify(footer, null, 2));
    console.log('✅ Footer structure extracted');

    console.log('\n✅ Reconnaissance complete!');
    console.log(`📁 Output saved to: ${OUTPUT_DIR}`);
    console.log('\nNext steps:');
    console.log('1. Review worldlabs-design-tokens.json for color/font/spacing values');
    console.log('2. Review worldlabs-page-topology.json for section layout');
    console.log('3. Review components/worldlabs-page-specs.json for component details');
    console.log('4. Review worldlabs-interactions.json for interactive elements');
    console.log('5. Review worldlabs-navigation.json for navigation structure');
    console.log('6. Review worldlabs-footer.json for footer structure');
    console.log('7. Update theme to match worldlabs.ai design');
    console.log('8. Update all components to match worldlabs.ai UI');

  } catch (error) {
    console.error('❌ Error during reconnaissance:', error);
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
