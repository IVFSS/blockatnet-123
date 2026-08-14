/**
 * Component Token Updater for blockatnet
 * 
 * Scans all .tsx files in src/components/ and reports Chakra UI color/token
 * usages with suggested ctrl.xyz replacements based on DESIGN_TOKENS_MAP.md.
 * 
 * Run: node scripts/update-tokens.js
 * 
 * This is a REPORTING tool — it shows what could be updated. Review each change
 * before applying manually to avoid breaking the build.
 */

const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.resolve('src/components');
const IGNORE_DIRS = ['node_modules', '.git'];
FILE_PATTERN = /\.tsx?$/;

// ctrl.xyz token mappings from DESIGN_TOKENS_MAP.md
const TOKEN_MAPPINGS = {
  // useColorModeValue replacements
  'useColorModeValue\\(gray\\.700, gray\\.100\\)': "useColorModeValue('ctrlPrimary', 'ctrlPrimaryForeground')",
  'useColorModeValue\\(gray\\.500, gray\\.400\\)': "useColorModeValue('ctrlMuted', 'ctrlMuted')",
  'useColorModeValue\\(gray\\.200, gray\\.800\\)': "useColorModeValue('ctrlBg', 'ctrlCard')",

  // bg color replacements
  'bg="gray\\.50"': 'bg="ctrlCard"',
  'bg="gray\.100"': 'bg="ctrlCard"',
  'bg="gray\\.500"': 'bg="ctrlPrimary"',
  'bg="gray\\.100"': 'bg="ctrlCard"',

  // color text replacements
  'color="gray\\.500"': 'color="ctrlPrimary"',
  'color="gray\\.100"': 'color="ctrlPrimaryForeground"',
  'color="gray\\.600"': 'color="ctrlMuted"',
  'color="gray\\.700"': 'color="ctrlMuted"',

  // borderColor replacements
  'borderColor="gray\\.200"': 'borderColor="ctrlBorder"',
  'borderColor="gray\\.300"': 'borderColor="ctrlBorder"',

  // shadow replacements
  'shadow="lg"': 'shadow="ctrlMd"',
  'shadow="md"': 'shadow="ctrlSm"',

  // radius replacements
  'radius="lg"': 'radius="16px"',
  'radius="md"': 'radius="12px"',
  'radius="sm"': 'radius="8px"',

  // spacing replacements
  'py={10}': 'py={6}',
  'py={16}': 'py={16}', // keep as-is (matches DESIGN_TOKENS_MAP.md section padding)
  'py={8}': 'py={4}',
  'px={10}': 'px={6}',
  'px={16}': 'px={8}',

  // fontWeight replacements
  'fontWeight="bold"': 'fontWeight="600"',
  'fontWeight="medium"': 'fontWeight="500"',
  'fontWeight="regular"': 'fontWeight="400"',
};

const CHAKRA_COLOR_PATTERNS = [
  /bg=["']gray\.[0-9]+["']/g,
  /color=["']gray\.[0-9]+["']/g,
  /borderColor=["']gray\.[0-9]+["']/g,
  /useColorModeValue\('gray\.[0-9]+(?:\s*,\s*gray\.[0-9]+)?\)/g,
];

function findChakraColorUsages(content) {
  const usages = [];

  // Find useColorModeValue with gray values
  const colorModeMatches = content.match(/useColorModeValue\(['"][^'"]*gray[^'"]*['"]/g);
  if (colorModeMatches) {
    colorModeMatches.forEach(match => {
      usages.push({
        type: 'useColorModeValue',
        match,
        line: content.split('\n').findIndex(l => l.includes(match)),
      });
    });
  }

  // Find bg="gray.X"
  const bgMatches = content.match(/bg=["']gray\.[0-9]+["']/g);
  if (bgMatches) {
    bgMatches.forEach(match => {
      usages.push({
        type: 'bg-color',
        match,
        line: content.split('\n').findIndex(l => l.includes(match)),
      });
    });
  }

  // Find color="gray.X"
  const colorMatches = content.match(/color=["']gray\.[0-9]+["']/g);
  if (colorMatches) {
    colorMatches.forEach(match => {
      usages.push({
        type: 'text-color',
        match,
        line: content.split('\n').findIndex(l => l.includes(match)),
      });
    });
  }

  // Find borderColor="gray.X"
  const borderMatches = content.match(/borderColor=["']gray\.[0-9]+["']/g);
  if (borderMatches) {
    borderMatches.forEach(match => {
      usages.push({
        type: 'border-color',
        match,
        line: content.split('\n').findIndex(l => l.includes(match)),
      });
    });
  }

  // Find shadow="lg" / shadow="md"
  const shadowMatches = content.match(/shadow="(lg|md)"/g);
  if (shadowMatches) {
    shadowMatches.forEach(match => {
      usages.push({
        type: 'shadow',
        match,
        line: content.split('\n').findIndex(l => l.includes(match)),
      });
    });
  }

  return usages;
}

function findComponentFiles(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.includes(entry.name)) {
        results.push(...findComponentFiles(fullPath));
      }
    } else if (entry.isFile() && FILE_PATTERN.test(entry.name)) {
      results.push(fullPath);
    }
  }

  return results;
}

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const usages = findChakraColorUsages(content);

  if (usages.length === 0) {
    return null;
  }

  return {
    file: filePath.replace(/\\/g, '/'),
    totalUsages: usages.length,
    usages,
  };
}

console.log('='.repeat(60));
console.log('blockatnet Component Token Analysis');
console.log('='.repeat(60));
console.log('Scanning src/components/ for Chakra UI color/token usages\n');

const componentFiles = findComponentFiles(COMPONENTS_DIR);
console.log(`Found ${componentFiles.length} component files\n`);

const results = [];

for (const file of componentFiles) {
  const analysis = analyzeFile(file);
  if (analysis) {
    results.push(analysis);
    console.log(`📁 ${path.basename(file)}`);
    console.log(`   ${analysis.usages.length} token usage(s) found`);
    analysis.usages.forEach((u, i) => {
      console.log(`   ${i + 1}. [${u.type}] ${u.match}`);
    });
    console.log();
  }
}

// Summary
console.log('='.repeat(60));
console.log(`Summary: ${results.length} files have token usages needing review`);
console.log('='.repeat(60));
console.log();
console.log('Recommended replacement mappings (from DESIGN_TOKENS_MAP.md):');
console.log();
console.log('  useColorModeValue gray.700, gray.100 → useColorModeValue("ctrlPrimary", "ctrlPrimaryForeground")');
console.log('  useColorModeValue gray.500, gray.400 → useColorModeValue("ctrlMuted", "ctrlMuted")');
console.log('  bg="gray.500" → bg="ctrlPrimary" (for primary buttons)');
console.log('  bg="gray.100" → bg="ctrlCard" (for cards/modals)');
console.log('  color="gray.500" → color="ctrlPrimary" (for primary text)');
console.log('  color="gray.600" → color="ctrlMuted" (for secondary text)');
console.log('  borderColor="gray.200" → borderColor="ctrlBorder"');
console.log('  shadow="lg" → shadow="ctrlMd"');
console.log('  radius="lg" → 16px, radius="md" → 12px');
console.log('  py={16} → section padding (keep as-is for ctrl.xyz layout)');
console.log('  px={10} → px={6}');
console.log();
console.log('After review, apply changes manually to each file.');
console.log('Example: In Header.tsx, we updated:');
console.log('  - primaryColor useColorModeValue → ctrlPrimary/ctrlPrimaryForeground');
console.log('  - secondaryColor useColorModeValue → ctrlMuted');
console.log('  - Box bg="ctrlBg", borderBottomColor="ctrlBorder"');
console.log('  - Container mx="auto" p={0}');