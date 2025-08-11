import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

// import { VIEWPORTS as configViewports } from '../../test-config/config.js';

// const VIEWPORTS = (configViewports || [
//   { width: 320, height: 568, label: 'mobile' },
//   { width: 768, height: 1024, label: 'tablet' },
//   { width: 1024, height: 768, label: 'desktop' },
//   { width: '100%', height: 900, label: 'large' },
// ]).map((vp) => {
//   const { width: origWidth, height: origHeight, ...rest } = vp;

//   function parseDim(val) {
//     if (typeof val === 'string') {
//       if (val.endsWith('px')) {
//         return parseInt(val.replace(/px$/, ''), 10);
//       }
//       if (val.includes('%')) {
//         return val;
//       }
//       // Only convert if the string is fully numeric
//       if (/^\d+$/.test(val)) {
//         return parseInt(val, 10);
//       }
//     }
//     return val;
//   }

//   return {
//     ...rest,
//     width: parseDim(origWidth),
//     height: parseDim(origHeight),
//   };
// });

const VIEWPORTS = [
  { width: 320, height: 568, label: 'mobile' },
  { width: 768, height: 1024, label: 'tablet' },
  { width: 1024, height: 768, label: 'desktop' },
  { width: 1440, height: 900, label: 'large' },
];

// Timeout constants
const SELECTOR_TIMEOUT = 30000;
const RENDER_TIMEOUT = 3000;
const LAYOUT_TIMEOUT = 1000;

async function fetchLibraryBlocks() {
  try {
    // Launch a headless browser
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to the library page with blocks plugin active
    await page.goto('http://localhost:3000/tools/sidekick/library.html?plugin=blocks');

    // Wait for the sidekick-library component to load
    await page.waitForSelector('sidekick-library', { timeout: SELECTOR_TIMEOUT });

    // Wait for the blocks to be loaded in the plugin
    await page.waitForSelector('sp-sidenav[data-testid="blocks"]', { timeout: SELECTOR_TIMEOUT });

    // Give it some time to fully load and render blocks
    await page.waitForTimeout(RENDER_TIMEOUT);

    // Extract block information from the DOM
    const blocks = await page.evaluate(() => {
      function querySelectorAllDeep(selector, root = document) {
        const results = [];

        function findAll(node) {
          // Check if current node matches (only for elements)
          if (node.nodeType === Node.ELEMENT_NODE && node.matches && node.matches(selector)) {
            results.push(node);
          }

          // Search in shadow DOM if present
          if (node.shadowRoot) {
            findAll(node.shadowRoot);
          }

          // Recursively search child elements
          if (node.children) {
            Array.from(node.children).forEach((child) => findAll(child));
          }
        }
        findAll(root);
        return results;
      }

      // Find the sidenav element that contains the blocks
      const sidenav = querySelectorAllDeep('sp-sidenav[data-testid="blocks"]');
      if (!sidenav) return [];

      // Get all top-level sidenav items (these are the block categories)
      const variations = querySelectorAllDeep('sp-sidenav > sp-sidenav-item > sp-sidenav-item.descendant');

      // Array to store all blocks
      const blocksList = [];

      // Process each block parent item
      variations.forEach((variationItem) => {
        // Get the block name from the label attribute
        const blockName = variationItem.parentElement.getAttribute('label');
        // Add the block with its variations
        blocksList.push({
          name: blockName,
          variationName: variationItem.getAttribute('label'),
          path: `/tools/sidekick/library/templates/${blockName.toLowerCase()}`,
          variationIndex: variationItem.getAttribute('data-index'),
        });
      });

      return blocksList;
    });

    // Close the browser
    await browser.close();
    return blocks;
  } catch (error) {
    console.error('Error fetching library blocks from HTML:', error);
    return [];
  }
}

function generateTestSpec(blocks) {
  const imports = 'import { test, expect } from \'@playwright/test\';\n\n';

  const testContent = blocks.flatMap((block) => {
    const testName = `${block.variationName} visual test`;

    // Generate tests for each viewport for this block variation
    const viewportTests = VIEWPORTS.map((viewport) => `  test('${testName} at ${viewport.label} viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: ${typeof viewport.width === 'string' ? `'${viewport.width}'` : viewport.width}, height: ${typeof viewport.height === 'string' ? `'${viewport.height}'` : viewport.height} });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=${block.path}&index=${block.variationIndex}&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: ${SELECTOR_TIMEOUT} });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: ${SELECTOR_TIMEOUT} });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.${block.name.toLowerCase().replace(/\s+/g, '-')}', { timeout: ${SELECTOR_TIMEOUT}, state: 'visible' });
    
    // Small delay to ensure layout is stable${viewport.label === 'tablet' ? ' after breakpoint transition' : ''}
    await page.waitForTimeout(${LAYOUT_TIMEOUT});

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for ${block.name}');

    await page.setViewportSize({ 
      width: ${typeof viewport.width === 'string' ? `'${viewport.width}'` : viewport.width},
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = '${block.name.toLowerCase().replace(/\s+/g, '-')}-${block.variationIndex}-${viewport.label}.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: ${SELECTOR_TIMEOUT},
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });`);

    return viewportTests;
  }).join('\n');

  return `${imports}test.describe('Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set default viewport size
    await page.setViewportSize({ width: 1280, height: 2000 });
  });

${testContent}
});`;
}

async function generateVisualTests() {
  // Fetch library blocks
  const blocks = await fetchLibraryBlocks();
  if (blocks.length === 0) {
    console.log('No blocks found in library');
    return;
  }
  // Generate test spec content
  const testSpec = generateTestSpec(blocks);
  // Write to test file
  const testDir = 'tools/visual-tests';
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }
  fs.writeFileSync(path.join(testDir, 'visual.spec.js'), testSpec);
  console.log(`Generated visual test spec for ${blocks.length} blocks in visual-tests/visual.spec.js`);
}

// Run the generator
generateVisualTests().catch(console.error);
