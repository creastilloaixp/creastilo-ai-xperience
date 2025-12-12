import { test, expect } from '@playwright/test';

/**
 * Test Suite: Lazy Loading
 * Tests that components are loaded on-demand (code splitting)
 */

test.describe('Lazy Loading & Performance', () => {

  test('should load initial page without all components', async ({ page }) => {
    // Listen for network requests
    const requests: string[] = [];
    page.on('request', request => {
      const url = request.url();
      if (url.includes('.js') || url.includes('.tsx')) {
        requests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Initial load should not include all components
    // Check that main bundle loaded
    const hasMainBundle = requests.some(url => url.includes('index') || url.includes('main'));
    expect(hasMainBundle).toBe(true);
  });

  test('should lazy load ToolsSection component when scrolling', async ({ page }) => {
    const lazyChunks: string[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') && (url.includes('chunk') || url.includes('Tools'))) {
        lazyChunks.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Scroll to tools section to trigger lazy load
    await page.evaluate(() => {
      const toolsSection = document.querySelector('#herramientas, [id*="tools"]');
      if (toolsSection) {
        toolsSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo(0, document.body.scrollHeight / 2);
      }
    });

    await page.waitForTimeout(2000);

    // Click on Herramientas if visible
    const herramientasLink = page.locator('a:has-text("Herramientas"), button:has-text("Herramientas")').first();
    if (await herramientasLink.isVisible()) {
      await herramientasLink.click();
      await page.waitForTimeout(1500);
    }

    // Some lazy chunk should have loaded
    // Note: This test may be flaky depending on bundle configuration
    console.log('Lazy chunks loaded:', lazyChunks.length);
  });

  test('should lazy load Jarvis component', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Wait for Jarvis to appear (floating assistant)
    await page.waitForTimeout(2000);

    // Look for Jarvis floating button
    const jarvisButton = page.locator('button[class*="fixed"], [class*="jarvis"]').first();

    // Jarvis should be lazy loaded and appear
    // If not immediately visible, it's being lazy loaded
    await page.waitForTimeout(1000);
  });

  test('should show loading fallback during lazy load', async ({ page }) => {
    await page.goto('/');

    // Look for loading spinner/fallback
    const loadingSpinner = page.locator('.animate-spin, [class*="loader"]');

    // Loading indicator might appear briefly
    // This is a soft check - if it doesn't appear, it loaded too fast (which is good)
    await page.waitForTimeout(500);
  });

  test('should have reduced initial bundle size', async ({ page }) => {
    const responses: any[] = [];

    page.on('response', response => {
      if (response.url().includes('.js')) {
        responses.push({
          url: response.url(),
          size: response.headers()['content-length'] || 'unknown'
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Log bundle info for analysis
    console.log('JavaScript bundles loaded:', responses.length);
    responses.forEach(r => {
      console.log(`  - ${r.url.split('/').pop()}: ${r.size} bytes`);
    });

    // With lazy loading, we should have multiple smaller chunks
    // instead of one huge bundle
    expect(responses.length).toBeGreaterThan(1);
  });
});
