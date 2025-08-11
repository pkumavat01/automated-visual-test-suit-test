import { test, expect } from '@playwright/test';

test.describe('Visual Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set default viewport size
    await page.setViewportSize({ width: 1280, height: 2000 });
  });

  test('cards visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');

    await page.setViewportSize({ 
      width: 320,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-mobile.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('cards visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');

    await page.setViewportSize({ 
      width: 768,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-tablet.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('cards visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');

    await page.setViewportSize({ 
      width: 1024,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-desktop.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('cards visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/cards&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.cards', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Cards');

    await page.setViewportSize({ 
      width: 1440,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'cards-0-large.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('hero visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');

    await page.setViewportSize({ 
      width: 320,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'hero-0-mobile.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('hero visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');

    await page.setViewportSize({ 
      width: 768,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'hero-0-tablet.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('hero visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');

    await page.setViewportSize({ 
      width: 1024,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'hero-0-desktop.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('hero visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/hero&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.hero', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Hero');

    await page.setViewportSize({ 
      width: 1440,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'hero-0-large.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 320,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-0-mobile.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 768,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-0-tablet.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 1024,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-0-desktop.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=0&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 1440,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-0-large.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs (reverse) visual test at mobile viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 320, height: 568 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 320,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-1-mobile.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs (reverse) visual test at tablet viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable after breakpoint transition
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 768,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-1-tablet.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs (reverse) visual test at desktop viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1024, height: 768 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 1024,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-1-desktop.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
  test('tabs (reverse) visual test at large viewport', async ({ page }) => {
    // Set viewport size
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Navigate to the block variation
    await page.goto('/tools/sidekick/library.html?plugin=blocks&path=/tools/sidekick/library/templates/tabs&index=1&vtest=true');
    
    // Wait for the library component to load
    await page.waitForSelector('sidekick-library', { timeout: 30000 });
    
    // Wait for the iframe to load and switch to its context
    const iframe = await page.waitForSelector('sidekick-library >> sp-theme >> plugin-renderer >> .view block-renderer >> iframe', { timeout: 30000 });
    const frame = await iframe.contentFrame();
    if (!frame) throw new Error('Could not get iframe content frame');
    
    // Wait for the block to be fully rendered
    const block = await frame.waitForSelector('.tabs', { timeout: 30000, state: 'visible' });
    
    // Small delay to ensure layout is stable
    await page.waitForTimeout(1000);

    await block.scrollIntoViewIfNeeded();
    await page.evaluate(el => {
      el.style.overflow = 'visible';
      el.style.maxHeight = 'none';
    }, block);
    
    // Get the bounding box of the block
    const box = await block.boundingBox();
    if (!box) throw new Error('Could not get bounding box for Tabs');

    await page.setViewportSize({ 
      width: 1440,
      height: Math.round(box.height + box.y),
    });

    // Take a screenshot of only the block area
    const screenshotName = 'tabs-1-large.png';
    const screenshot = await page.screenshot({
      clip: box,
      timeout: 30000,
      animations: 'disabled',
      type: 'png',
    });

    // Use strict visual comparison settings for detecting color and layout changes
    expect(screenshot).toMatchSnapshot(screenshotName, {
      maxDiffPixels: 50,         // Reduced tolerance for better sensitivity
      threshold: 0.05,            // 5% color difference tolerance (more sensitive)
      maxDiffPixelRatio: 0.005,  // 0.5% of total pixels tolerance
    });
  });
});